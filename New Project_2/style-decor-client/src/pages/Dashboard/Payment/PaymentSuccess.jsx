import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import { CheckCircle2, Printer, Home, ClipboardList } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');
  const axiosPublic = useAxiosPublic();
  const invoiceRef = useRef();

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    axiosPublic
      .patch(`/payment-success?session_id=${sessionId}`)
      .then((res) => res.data.invoice && setInvoice(res.data.invoice))
      .catch((err) => console.error('Payment confirmation error:', err))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const fmt = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })
      : '—';

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  const fmtMoney = (amount, currency = 'usd') =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(amount);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-green-600" />
      </div>
    );
  }

  const Row = ({ label, value, mono, highlight }) => (
    <div className="flex justify-between items-start gap-4 py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-500 shrink-0 w-32">{label}</span>
      <span className={`text-xs text-right break-all ${mono ? 'font-mono' : 'font-medium'} ${highlight ? 'text-green-700 font-semibold' : 'text-gray-800'}`}>
        {value || '—'}
      </span>
    </div>
  );

  return (
    <>
      <style>{`
        @media print {
          html, body { margin: 0; padding: 0; }
          body * { visibility: hidden; }
          #invoice-root, #invoice-root * { visibility: visible; }
          #invoice-root {
            position: fixed; inset: 0;
            display: flex; align-items: center; justify-content: center;
          }
          .no-print { display: none !important; }
          @page { size: A4; margin: 10mm; }
        }
      `}</style>

      {/* Screen action bar */}
      <div className="no-print bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 text-[#062416] font-semibold">
          <CheckCircle2 size={20} className="text-green-500" />
          Payment Confirmed
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="btn btn-sm gap-1.5 border border-gray-300 bg-white hover:bg-gray-50">
            <Printer size={14} /> Print Invoice
          </button>
          <Link to="/dashboard/my-bookings" className="btn btn-sm gap-1.5 bg-[#062416] text-white hover:bg-[#0a3520]">
            <ClipboardList size={14} /> My Bookings
          </Link>
          <Link to="/" className="btn btn-sm gap-1.5 border border-gray-300 bg-white hover:bg-gray-50">
            <Home size={14} /> Home
          </Link>
        </div>
      </div>

      {/* Invoice wrapper */}
      <div className="min-h-screen bg-gray-100 flex items-start justify-center py-8 px-4">
        <div id="invoice-root" ref={invoiceRef}
          className="w-full max-w-xl bg-white shadow-xl rounded-xl overflow-hidden"
          style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        >
          {/* ── Header ── */}
          <div className="bg-[#062416] text-white px-7 py-5 flex justify-between items-center shrink-0">
            <div>
              <h1 className="text-xl font-bold tracking-wide">Style Decor</h1>
              <p className="text-green-300 text-xs mt-0.5">Professional Decoration Services</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Invoice No.</p>
              <p className="text-base font-mono font-bold text-yellow-400">
                {invoice?.trackingId || '—'}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">{fmt(invoice?.paidAt)}</p>
            </div>
          </div>

          {/* ── Success strip ── */}
          <div className="bg-green-50 border-b border-green-100 px-7 py-2.5 flex items-center gap-2 shrink-0">
            <CheckCircle2 size={18} className="text-green-500 shrink-0" />
            <p className="text-sm font-semibold text-green-800">
              Payment Successful — Booking Confirmed
            </p>
          </div>

          {/* ── Body ── */}
          <div className="px-7 py-5 flex flex-col gap-5 overflow-auto">

            {/* Billed to + Service */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Billed To</p>
                <p className="text-sm font-semibold text-gray-800">{invoice?.customerName || '—'}</p>
                <p className="text-xs text-gray-500">{invoice?.customerEmail || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Service</p>
                <p className="text-sm font-semibold text-gray-800">{invoice?.serviceName || '—'}</p>
                <p className="text-xs text-gray-500">
                  Event Date: <span className="font-medium text-gray-700">{fmtDate(invoice?.eventDate)}</span>
                </p>
              </div>
            </div>

            {/* Location */}
            {(invoice?.region || invoice?.district || invoice?.address) && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Service Location</p>
                <p className="text-xs text-gray-700">
                  {[invoice.address, invoice.district, invoice.region].filter(Boolean).join(', ')}
                </p>
              </div>
            )}

            {/* Amount table */}
            <div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase">
                    <th className="text-left py-2 px-3 rounded-l font-medium">Description</th>
                    <th className="text-center py-2 px-3 font-medium">Qty</th>
                    <th className="text-right py-2 px-3 rounded-r font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 px-3 text-gray-800 font-medium">{invoice?.serviceName || '—'}</td>
                    <td className="py-2.5 px-3 text-center text-gray-600">1</td>
                    <td className="py-2.5 px-3 text-right text-gray-800 font-medium">
                      {invoice ? fmtMoney(invoice.amount, invoice.currency) : '—'}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td colSpan={2} className="py-2.5 px-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wide">
                      Total Paid
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#062416] text-sm">
                      {invoice ? fmtMoney(invoice.amount, invoice.currency) : '—'}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Reference IDs */}
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Reference Details</p>
              <Row label="Transaction ID" value={invoice?.transactionId} mono />
              <Row label="Tracking ID"    value={invoice?.trackingId}    mono highlight />
              <Row label="Booking ID"     value={invoice?.bookingId}     mono />
              <Row label="Payment Status" value="Paid" highlight />
              <Row label="Paid On"        value={fmt(invoice?.paidAt)} />
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="bg-gray-50 border-t border-gray-200 px-7 py-3 text-center shrink-0">
            <p className="text-[10px] text-gray-400">
              Thank you for choosing Style Decor &nbsp;·&nbsp; support@styledecor.com
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
