import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const RevenueTracking = () => {
  const axiosSecure = useAxiosSecure();
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [groupBy, setGroupBy] = useState("day"); // day, week, month

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-revenue-bookings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bookings");
      return res.data;
    },
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["admin-all-payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data;
    },
  });

  // Filter by date range
  const filteredBookings = useMemo(() => {
    if (!dateRange.start && !dateRange.end) return bookings;
    return bookings.filter((b) => {
      const date = new Date(b.paidAt || b.createdAt);
      const start = dateRange.start ? new Date(dateRange.start) : null;
      const end = dateRange.end ? new Date(dateRange.end) : null;
      if (start && date < start) return false;
      if (end && date > end) return false;
      return true;
    });
  }, [bookings, dateRange]);

  // Calculate stats
  const paidBookings = filteredBookings.filter((b) => b.paymentStatus === "paid");
  const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.cost || 0), 0);
  const pendingRevenue = filteredBookings
    .filter((b) => b.paymentStatus !== "paid")
    .reduce((sum, b) => sum + (b.cost || 0), 0);
  const avgOrderValue = paidBookings.length > 0 ? totalRevenue / paidBookings.length : 0;

  // Revenue by service
  const revenueByService = useMemo(() => {
    const map = {};
    paidBookings.forEach((b) => {
      const service = b.serviceTitle || "Unknown";
      map[service] = (map[service] || 0) + (b.cost || 0);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: value / 100 }))
      .sort((a, b) => b.value - a.value);
  }, [paidBookings]);

  // Revenue over time
  const revenueOverTime = useMemo(() => {
    const map = {};
    paidBookings.forEach((b) => {
      const date = new Date(b.paidAt || b.createdAt);
      let key;
      if (groupBy === "day") {
        key = date.toISOString().split("T")[0];
      } else if (groupBy === "week") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split("T")[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      }
      map[key] = (map[key] || 0) + (b.cost || 0);
    });
    return Object.entries(map)
      .map(([date, revenue]) => ({ date, revenue: revenue / 100 }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [paidBookings, groupBy]);

  // Payment methods breakdown (if available)
  const paymentMethods = useMemo(() => {
    const map = {};
    payments.forEach((p) => {
      const method = p.paymentMethod || "Stripe";
      map[method] = (map[method] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [payments]);

  if (isLoading || paymentsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 my-6">
      <h2 className="text-3xl md:text-4xl font-bold text-[#062416] mb-6">
        Revenue Tracking & Analytics
      </h2>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="label text-xs font-medium">Start Date</label>
          <input
            type="date"
            className="input input-bordered input-sm"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
        </div>
        <div>
          <label className="label text-xs font-medium">End Date</label>
          <input
            type="date"
            className="input input-bordered input-sm"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </div>
        <button
          className="btn btn-sm btn-outline"
          onClick={() => setDateRange({ start: "", end: "" })}
        >
          Clear Filter
        </button>
        <div className="ml-auto">
          <label className="label text-xs font-medium">Group By</label>
          <select
            className="select select-bordered select-sm"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
          <p className="text-xs text-gray-400 uppercase">Total Revenue</p>
          <p className="text-3xl font-bold text-green-600">${(totalRevenue / 100).toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">{paidBookings.length} paid bookings</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">
          <p className="text-xs text-gray-400 uppercase">Pending Revenue</p>
          <p className="text-3xl font-bold text-yellow-600">${(pendingRevenue / 100).toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
          <p className="text-xs text-gray-400 uppercase">Avg Order Value</p>
          <p className="text-3xl font-bold text-blue-600">${(avgOrderValue / 100).toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Per booking</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
          <p className="text-xs text-gray-400 uppercase">Total Bookings</p>
          <p className="text-3xl font-bold text-purple-600">{filteredBookings.length}</p>
          <p className="text-xs text-gray-500 mt-1">In selected range</p>
        </div>
      </div>

      {/* Revenue Over Time Chart */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-xl font-bold text-[#062416] mb-4">Revenue Trend</h3>
        {revenueOverTime.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={revenueOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-400 py-10">No revenue data in selected range</p>
        )}
      </div>

      {/* Revenue by Service */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold text-[#062416] mb-4">Revenue by Service</h3>
          {revenueByService.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByService}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Bar dataKey="value" fill="#3b82f6" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-10">No data</p>
          )}
        </div>

        {/* Payment Methods Pie */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold text-[#062416] mb-4">Payment Methods</h3>
          {paymentMethods.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-10">No payment data</p>
          )}
        </div>
      </div>

      {/* Top Services Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-bold text-[#062416] mb-4">Top Revenue Services</h3>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Service</th>
                <th>Revenue</th>
                <th>Bookings</th>
              </tr>
            </thead>
            <tbody>
              {revenueByService.slice(0, 10).map((service, index) => {
                const count = paidBookings.filter((b) => b.serviceTitle === service.name).length;
                return (
                  <tr key={service.name}>
                    <td>{index + 1}</td>
                    <td>{service.name}</td>
                    <td className="font-semibold text-green-600">${service.value.toFixed(2)}</td>
                    <td>{count}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueTracking;
