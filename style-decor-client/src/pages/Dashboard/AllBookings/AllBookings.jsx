import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const STATUS_BADGE = {
  paid: "badge-success",
  pending: "badge-warning",
  cancelled: "badge-error",
};

const FILTERS = ["all", "paid", "pending", "cancelled"];

const AllBookings = () => {
  const axiosSecure = useAxiosSecure();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-all-bookings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bookings");
      return res.data;
    },
  });

  // Sort: paid first (most recent), then pending, then rest
  const sorted = [...bookings].sort((a, b) => {
    const order = { paid: 0, pending: 1, cancelled: 2 };
    const ao = order[a.paymentStatus] ?? 1;
    const bo = order[b.paymentStatus] ?? 1;
    if (ao !== bo) return ao - bo;
    // within same status, most recent first
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  const filtered = sorted.filter((b) => {
    const matchStatus = filter === "all" || b.paymentStatus === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b._id?.toLowerCase().includes(q) ||
      b.userEmail?.toLowerCase().includes(q) ||
      b.userName?.toLowerCase().includes(q) ||
      b.serviceTitle?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const paidCount = bookings.filter((b) => b.paymentStatus === "paid").length;
  const pendingCount = bookings.filter((b) => b.paymentStatus !== "paid" && b.paymentStatus !== "cancelled").length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl md:text-4xl font-bold text-[#062416] my-6">
        All Bookings
      </h2>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
          <p className="text-xs text-gray-400 uppercase">Total</p>
          <p className="text-3xl font-bold text-blue-600">{bookings.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
          <p className="text-xs text-gray-400 uppercase">Paid</p>
          <p className="text-3xl font-bold text-green-600">{paidCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border-l-4 border-yellow-500">
          <p className="text-xs text-gray-400 uppercase">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-sm capitalize ${filter === f ? "bg-[#062416] text-white" : "btn-outline"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by ID, name, email, service..."
          className="input input-bordered input-sm flex-1 min-w-48"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="table table-zebra w-full text-sm text-center">
          <thead className="bg-base-200 text-xs uppercase">
            <tr>
              <th>#</th>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Cost</th>
              <th>Payment</th>
              <th>Booking Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-gray-400">
                  No bookings found.
                </td>
              </tr>
            ) : (
              filtered.map((booking, index) => (
                <tr key={booking._id}>
                  <th>{index + 1}</th>
                  <td>
                    <span className="font-mono text-xs bg-base-200 px-2 py-1 rounded">
                      {booking._id}
                    </span>
                  </td>
                  <td>
                    <p className="font-medium">{booking.userName || "—"}</p>
                    <p className="text-xs text-gray-400">{booking.userEmail || "—"}</p>
                  </td>
                  <td>{booking.serviceTitle || "—"}</td>
                  <td className="font-semibold">
                    ${(booking.cost / 100).toFixed(2)}
                  </td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[booking.paymentStatus] || "badge-warning"} capitalize`}>
                      {booking.paymentStatus || "pending"}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-ghost capitalize">
                      {booking.BookingStatus || "—"}
                    </span>
                  </td>
                  <td className="text-xs text-gray-500">
                    {booking.createdAt
                      ? new Date(booking.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit", month: "short", year: "numeric",
                        })
                      : "—"}
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

export default AllBookings;
