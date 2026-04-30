import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const Appointments = () => {
  const axiosSecure = useAxiosSecure();

  const {
    refetch,
    data: consultations = [],
    isLoading,
  } = useQuery({
    queryKey: ["consultations"],
    queryFn: async () => {
      const res = await axiosSecure.get("/consultations");
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="text-center my-12">Loading consultations...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-2">
      <h2 className="text-3xl md:text-4xl font-bold text-[#062416] my-6">
        Consultation Requests
      </h2>

      {consultations.length === 0 ? (
        <div className="text-center my-12 text-gray-500">
          No consultation requests found.
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl">
          <table className="table table-zebra w-full text-center">
            <thead className="bg-base-200 text-sm uppercase">
              <tr>
                <th>SL</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Date</th>
                <th>Time</th>
                <th>Notes</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((consultation, index) => (
                <tr key={consultation._id}>
                  <td>{index + 1}</td>
                  <td>{consultation.fullName}</td>
                  <td>{consultation.email}</td>
                  <td>{consultation.phone || "N/A"}</td>
                  <td>{consultation.consultationType}</td>
                  <td>
                    {new Date(consultation.preferredDate).toLocaleDateString(
                      "en-GB"
                    )}
                  </td>
                  <td>{consultation.preferredTime}</td>
                  <td>{consultation.notes || "-"}</td>
                  <td>
                    {new Date(consultation.createdAt).toLocaleString("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Appointments;
