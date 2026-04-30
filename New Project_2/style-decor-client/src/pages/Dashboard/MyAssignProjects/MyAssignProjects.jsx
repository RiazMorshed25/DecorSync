import { useQuery } from "@tanstack/react-query";
import React from "react";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../components/Loading";

const MyAssignProjects = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: bookings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-assigned-bookings", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings`);
      const myAssigned = res.data.filter(
        (booking) => booking.decoratorEmail === user?.email
      );
      return myAssigned;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-gray-600 mb-4">
          No Assigned Projects Yet
        </h2>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto p-2">
      <h2 className="text-2xl font-semibold m-4 text-gray-800">
        My Assigned Projects ({bookings.length})
      </h2>

      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-sm uppercase">
            <tr>
              <th>#</th>
              <th>Service Title</th>
              <th>Service ID</th>
              <th>Cost</th>
              <th>User Email</th>
              <th>Event Date</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking._id} className="hover:bg-base-100">
                <th>{index + 1}</th>
                <td className="font-medium">{booking.serviceTitle}</td>
                <td>
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {booking.serviceId}
                  </code>
                </td>
                <td>{booking.cost} BDT</td>
                <td>{booking.userEmail}</td>
                <td className="flex items-center gap-2">
                  {new Date(booking.eventDate).toLocaleDateString("en-GB")}
                </td>
               
                <td className="text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() =>
                        Swal.fire({
                          title: booking.serviceTitle,
                          html: `
                            <p><strong>Customer:</strong> ${
                              booking.userName
                            }</p>
                            <p><strong>Email:</strong> ${booking.userEmail}</p>
                            <p><strong>Date:</strong> ${new Date(
                              booking.eventDate
                            ).toLocaleDateString()}</p>
                            <p><strong>Location:</strong> ${
                              booking.location?.district || "Studio"
                            }</p>
                          `,
                          icon: "info",
                        })
                      }
                      className="btn btn-sm bg-yellow-300 text-black"
                    >
                      View Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAssignProjects;
