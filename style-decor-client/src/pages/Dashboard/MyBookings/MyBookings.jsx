import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FaTrashCan } from "react-icons/fa6";
import Swal from "sweetalert2";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyBookings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: bookings = [], refetch } = useQuery({
    queryKey: ["my-bookings", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings?email=${user.email}`);
      console.log("user object:", user);
      console.log("bookings response:", res.data);
      return res.data;
    },
  });
  const handleBookingDelete = (id) => {
    console.log(id);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/bookings/${id}`).then((res) => {
          console.log(res.data);

          if (res.data.deletedCount) {
            refetch();

            Swal.fire({
              title: "Deleted!",
              text: "Your booking has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };

  const handlePayment = async (booking) => {
    const paymentInfo = {
      cost: booking.cost,
      bookingId: booking._id,
      customerName: booking.userName,
      customerEmail: booking.userEmail,
      serviceName: booking.serviceTitle,
      serviceId: booking.serviceId,
    };

    const res = await axiosSecure.post(
      "/payment-checkout-session",
      paymentInfo
    );
    console.log("payment info:", paymentInfo);
    console.log(res.data.url);
    window.location.assign(res.data.url);
  };

  return (
    <div className="max-w-7xl mx-auto p-2">
      <h2 className="text-3xl md:text-4xl font-bold text-[#062416] my-6">
          All of my bookings : {bookings.length}
        </h2>
      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="table table-zebra w-full text-center">
          <thead className="bg-base-200 text-sm uppercase">
            <tr>
              <th>#</th>
              <th>Service Title</th>
              <th>Service Id</th>
              <th>Cost</th>
              <th>Payment</th>
              <th>Booking Id</th>
              <th>Approved Status</th>
              <th>Work Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking._id}>
                <th>{index + 1}</th>
                <td>{booking.serviceTitle}</td>
                <td>{booking.serviceId}</td>
                <td>{booking.cost}</td>
                <td>
                  {booking.paymentStatus === "paid" ? (
                    <span className="text-green-400">Paid</span>
                  ) : (
                    <Link to={`/dashboard/payment/${booking._id}`}>
                      <button
                        onClick={() => handlePayment(booking)}
                        className="btn btn-sm bg-[#28a745] text-black"
                      >
                        Pay
                      </button>
                    </Link>
                  )}
                </td>
                <td>{booking._id}</td>
                <td>{booking.BookingStatus}</td>
                <td>{booking.workStatus}</td>
                <td>
                  <button
                    onClick={() => handleBookingDelete(booking._id)}
                    className="btn btn-square hover:bg-primary"
                  >
                    <FaTrashCan />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBookings;
