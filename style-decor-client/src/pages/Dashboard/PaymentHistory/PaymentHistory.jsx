import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useRole from "../../../hooks/useRole";

const PaymentHistory = () => {
  const { user } = useAuth();
  const { role } = useRole();
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");

  const isAdmin = role === "admin";

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments", isAdmin ? "all" : user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const url = isAdmin ? "/payments" : `/payments?email=${user.email}`;
      const res = await axiosSecure.get(url);
      return res.data;
    },
  });

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    return (
      !q ||
      p.transactionId?.toLowerCase().includes(q) ||
      p.customerEmail?.toLowerCase().includes(q) ||
      p.customerName?.toLowerCase().includes(q) ||
      p.serviceName?.toLowerCase().includes(q)
    );
  });

  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-wrap items-center justify-between gap-4 my-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#062416]">
            {isAdmin ? "All Payments" : "Payment History"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {payments.length} transactions · Total: ${totalAmount.toFixed(2)}
          </p>
        </div>
        {isAdmin && (
          <input
            type="text"
            placeholder="Search by name, email, transaction ID..."
            className="input input-bordered input-sm w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
      </div>

      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="table table-zebra w-full text-center">
          <thead className="bg-base-200 text-sm uppercase">
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Paid At</th>
              <th>Transaction ID</th>
              <th>Tracking ID</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-gray-400">
                  No payments found.
                </td>
              </tr>
            ) : (
              filtered.map((payment, index) => (
                <tr key={payment._id}>
                  <th>{index + 1}</th>
                  <td>
                    <p className="font-medium">{payment.customerName || "—"}</p>
                    <p className="text-xs text-gray-400">{payment.customerEmail || "—"}</p>
                  </td>
                  <td>{payment.serviceName || "—"}</td>
                  <td className="font-semibold text-green-600">
                    ${payment.amount?.toFixed(2) || "—"}
                  </td>
                  <td className="text-xs text-gray-500">
                    {payment.paidAt
                      ? new Date(payment.paidAt).toLocaleString("en-GB", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "—"}
                  </td>
                  <td>
                    <span className="font-mono text-xs bg-base-200 px-2 py-1 rounded">
                      {payment.transactionId || "—"}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono text-xs text-green-700">
                      {payment.trackingId || "—"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
