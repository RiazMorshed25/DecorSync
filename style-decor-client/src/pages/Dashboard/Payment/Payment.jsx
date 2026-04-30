import { useQueries, useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Payment = () => {
  const { _id } = useParams();
  console.log("Booking ID from params:", _id);
  const axiosSecure = useAxiosSecure();

  const { isLoading, data: booking } = useQuery({
    queryKey: ["bookings", _id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings/${_id}`);
      return res.data;
    },
  });
  console.log("booking info:", booking);

  if (isLoading || !booking) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  const handlePayment = async () => {
    const paymentInfo = {
      cost: booking.cost,
      bookingId: booking._id,
      customerName: booking.userName,
      customerEmail: booking.userEmail,
      serviceName: booking.serviceTitle,
      serviceId: booking.serviceId,
    };
    console.log("paymentInfo:", paymentInfo);

    const res = await axiosSecure.post("/create-checkout-session", paymentInfo);

    console.log(res.data);

    window.location.href = res.data.url;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Please Pay ${booking.cost / 100} for: {booking.serviceId}
        </h2>

        <button
          onClick={handlePayment}
          className="w-full py-4 px-6 bg-[#28a745] hover:bg-[#218838] text-black font-semibold text-lg rounded-xl transition duration-200 shadow-lg"
        >
          Pay
        </button>
      </div>
    </div>
  );
};

export default Payment;
