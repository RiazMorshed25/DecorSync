import { useQuery } from "@tanstack/react-query";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const DecoratorEarningSummary = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["decorator-bookings", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const myBookings = bookings.filter(booking => booking.decoratorEmail === user?.email);

  const totalEarnings = myBookings
    .filter(booking => booking.paymentStatus === "paid")
    .reduce((sum, booking) => sum + booking.cost, 0);

  const pendingEarnings = myBookings
    .filter(booking => booking.paymentStatus !== "paid")
    .reduce((sum, booking) => sum + booking.cost, 0);

  const totalBookings = myBookings.length;
  const confirmedBookings = myBookings.filter(booking => booking.BookingStatus === "confirmed").length;
  const paidBookings = myBookings.filter(booking => booking.paymentStatus === "paid").length;

  const statusData = [
    { name: "Paid", value: paidBookings, color: "#10b981" },
    { name: "Pending Payment", value: totalBookings - paidBookings, color: "#f59e0b" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Decorator Earning Summary</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-600">Total Bookings</h3>
          <p className="text-4xl font-bold text-blue-600 mt-3">{totalBookings}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-600">Confirmed Bookings</h3>
          <p className="text-4xl font-bold text-purple-600 mt-3">{confirmedBookings}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-600">Total Earnings (Paid)</h3>
          <p className="text-4xl font-bold text-green-600 mt-3">${totalEarnings.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-600">Pending Earnings</h3>
          <p className="text-4xl font-bold text-orange-600 mt-3">${pendingEarnings.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Payment Status Overview</h2>
          {statusData.some(item => item.value > 0) ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 mt-10">No bookings yet</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">Earnings Breakdown</h2>
          <div className="space-y-6 mt-10">
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-700">Received (Paid Bookings)</span>
              <span className="font-bold text-green-600 text-2xl">${totalEarnings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-700">Pending (Unpaid Bookings)</span>
              <span className="font-bold text-orange-600 text-2xl">${pendingEarnings.toLocaleString()}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl">
                <span className="font-semibold text-gray-800">Expected Total Earnings</span>
                <span className="font-bold text-blue-600 text-3xl">
                  ${(totalEarnings + pendingEarnings).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecoratorEarningSummary;