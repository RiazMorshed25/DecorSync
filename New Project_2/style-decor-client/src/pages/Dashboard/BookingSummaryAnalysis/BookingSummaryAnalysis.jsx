import React, { useMemo, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const COLORS  = ["#10b981","#3b82f6","#f59e0b","#ef4444","#8b5cf6","#ec4899","#14b8a6"];

const SPECIALTY_COLORS = {
  Wedding:    "#ec4899",
  Birthday:   "#f59e0b",
  Corporate:  "#3b82f6",
  Concert:    "#8b5cf6",
  PhotoBooth: "#10b981",
};

// ── helpers ──────────────────────────────────────────────────────────────────
const getMonthKey  = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
const getWeekKey   = (d) => { const w = new Date(d); w.setDate(d.getDate()-d.getDay()); return w.toISOString().split("T")[0]; };
const getDayKey    = (d) => d.toISOString().split("T")[0];
const fmtMoney     = (v) => `$${(v/100).toFixed(2)}`;

const StatCard = ({ label, value, sub, color }) => (
  <div className={`bg-white rounded-xl shadow p-5 border-l-4 ${color}`}>
    <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

// ── component ─────────────────────────────────────────────────────────────────
const BookingSummaryAnalysis = () => {
  const axiosSecure = useAxiosSecure();
  const [trendGroup, setTrendGroup] = useState("month"); // day | week | month

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["booking-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bookings");
      return res.data;
    },
  });

  // ── derived data ────────────────────────────────────────────────────────────
  const paid    = useMemo(() => bookings.filter(b => b.paymentStatus === "paid"), [bookings]);
  const pending = useMemo(() => bookings.filter(b => b.paymentStatus !== "paid"), [bookings]);

  const totalRevenue  = useMemo(() => paid.reduce((s,b) => s+(b.cost||0), 0), [paid]);
  const pendingAmount = useMemo(() => pending.reduce((s,b) => s+(b.cost||0), 0), [pending]);
  const avgOrder      = paid.length ? totalRevenue / paid.length : 0;

  // 1. Booking trend over time
  const trendData = useMemo(() => {
    const map = {};
    bookings.forEach(b => {
      const d = new Date(b.createdAt || b.eventDate);
      if (isNaN(d)) return;
      const key = trendGroup === "day" ? getDayKey(d)
                : trendGroup === "week" ? getWeekKey(d)
                : getMonthKey(d);
      if (!map[key]) map[key] = { date: key, total: 0, paid: 0, pending: 0 };
      map[key].total++;
      if (b.paymentStatus === "paid") map[key].paid++;
      else map[key].pending++;
    });
    return Object.values(map).sort((a,b) => a.date.localeCompare(b.date));
  }, [bookings, trendGroup]);

  // 2. Monthly bookings (peak season — always monthly)
  const monthlyData = useMemo(() => {
    const map = {};
    MONTHS.forEach(m => { map[m] = { month: m, bookings: 0, revenue: 0 }; });
    bookings.forEach(b => {
      const d = new Date(b.createdAt || b.eventDate);
      if (isNaN(d)) return;
      const m = MONTHS[d.getMonth()];
      map[m].bookings++;
      if (b.paymentStatus === "paid") map[m].revenue += (b.cost||0);
    });
    return MONTHS.map(m => map[m]);
  }, [bookings]);

  // 3. Service demand
  const serviceDemand = useMemo(() => {
    const map = {};
    bookings.forEach(b => {
      const t = b.serviceTitle || "Unknown";
      map[t] = (map[t]||0) + 1;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a,b) => b.value - a.value)
      .slice(0, 8);
  }, [bookings]);

  // 4. Payment status pie
  const paymentPie = useMemo(() => [
    { name: "Paid",    value: paid.length,    color: "#10b981" },
    { name: "Pending", value: pending.length, color: "#f59e0b" },
  ].filter(d => d.value > 0), [paid, pending]);

  // 5. Specialty demand pie
  const specialtyPie = useMemo(() => {
    const map = {};
    bookings.forEach(b => {
      const s = b.specialty || b.serviceTitle?.split(" ")[0] || "Other";
      map[s] = (map[s]||0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [bookings]);

  // 6. Day-of-week pattern
  const dowData = useMemo(() => {
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const map  = Object.fromEntries(days.map(d => [d, { day: d, bookings: 0 }]));
    bookings.forEach(b => {
      const d = new Date(b.eventDate || b.createdAt);
      if (!isNaN(d)) map[days[d.getDay()]].bookings++;
    });
    return days.map(d => map[d]);
  }, [bookings]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 my-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#062416]">Booking Statistics & Analytics</h1>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Bookings"   value={bookings.length}           sub={`${paid.length} paid`}              color="border-blue-500"   />
        <StatCard label="Total Revenue"    value={fmtMoney(totalRevenue)}    sub={`${paid.length} transactions`}      color="border-green-500"  />
        <StatCard label="Pending Revenue"  value={fmtMoney(pendingAmount)}   sub={`${pending.length} unpaid`}         color="border-yellow-500" />
        <StatCard label="Avg Order Value"  value={fmtMoney(avgOrder)}        sub="per paid booking"                   color="border-purple-500" />
      </div>

      {/* ── Booking trend ── */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-lg font-bold text-[#062416]">Booking Trend</h3>
          <div className="flex gap-2">
            {["day","week","month"].map(g => (
              <button key={g} onClick={() => setTrendGroup(g)}
                className={`btn btn-xs capitalize ${trendGroup === g ? "bg-[#062416] text-white" : "btn-outline"}`}>
                {g}
              </button>
            ))}
          </div>
        </div>
        {trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gPaid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-30} textAnchor="end" height={60} tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="paid"    stroke="#10b981" fill="url(#gPaid)"    name="Paid"    />
              <Area type="monotone" dataKey="pending" stroke="#f59e0b" fill="url(#gPending)" name="Pending" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-400 py-10">No data yet</p>
        )}
      </div>

      {/* ── Peak season (monthly) ── */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-bold text-[#062416] mb-4">Peak Season — Monthly Bookings</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="bookings" fill="#3b82f6" name="Bookings" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Day-of-week pattern + Payment pie ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-[#062416] mb-4">Busiest Days of the Week</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dowData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="bookings" name="Bookings" radius={[4,4,0,0]}>
                {dowData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-[#062416] mb-4">Payment Status Breakdown</h3>
          {paymentPie.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={paymentPie} cx="50%" cy="50%" outerRadius={90}
                  dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {paymentPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-10">No data</p>
          )}
        </div>
      </div>

      {/* ── Service demand + Monthly revenue ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-[#062416] mb-4">Service Demand</h3>
          {serviceDemand.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={serviceDemand} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" name="Bookings" fill="#8b5cf6" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-10">No data</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-[#062416] mb-4">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={v => `$${(v/100).toFixed(0)}`} />
              <Tooltip formatter={v => fmtMoney(v)} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2}
                name="Revenue" dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default BookingSummaryAnalysis;
