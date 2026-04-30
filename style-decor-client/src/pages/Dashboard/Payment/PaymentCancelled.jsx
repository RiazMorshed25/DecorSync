import React from "react";
import { Link } from "react-router";

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mx-auto mb-6">
          <svg
            className="w-24 h-24 text-red-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Payment Cancelled
        </h2>

        <p className="text-lg text-gray-600 mb-10">
          Please try again to complete your booking.
        </p>

        <Link to="/dashboard/my-bookings">
          <button 
          className="w-full py-4 px-6 bg-[#28a745] text-white font-semibold text-lg rounded-xl transition duration-200 shadow-lg">
            Try Again
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancelled;
