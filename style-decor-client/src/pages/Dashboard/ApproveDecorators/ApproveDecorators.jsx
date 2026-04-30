import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FaEye, FaUserCheck, FaEdit } from "react-icons/fa";
import { IoPersonRemoveSharp } from "react-icons/io5";
import { FaTrashCan } from "react-icons/fa6";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const ApproveDecorators = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { refetch, data: decorators = [] } = useQuery({
    queryKey: ["decorators", "pending"],
    queryFn: async () => {
      const res = await axiosSecure.get("/decorators");
      return res.data;
    },
  });

  const updateDecoratorStatus = (decorators, status) => {
    const updateInfo = { status: status, email: decorators.email };
    axiosSecure
      .patch(`/decorators/${decorators._id}`, updateInfo)
      .then((res) => {
        if (res.data.modifiedCount) {
          refetch();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `Decorator status is set to ${status}.`,
            showConfirmButton: false,
            timer: 2000,
          });
        }
      });
  };

  const handleDeleteDecorator = (id) => {
    console.log(id);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/decorators/${id}`).then((res) => {
          console.log(res.data);

          if (res.data.deletedCount) {
            // refresh the data in the ui
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

  const handleApproval = (decorator) => {
    updateDecoratorStatus(decorator, "approved");
  };

  const handleRejection = (decorator) => {
    updateDecoratorStatus(decorator, "rejected");
  };

  return (
    <div className="max-w-7xl mx-auto p-2">
      <div className="flex items-center justify-between my-6">
        <h2 className="text-3xl md:text-4xl font-bold text-[#062416]">
          Decorators Approval & Management
        </h2>
        <button
          onClick={() => navigate("/dashboard/add-decorator")}
          className="btn bg-green-500 text-white"
        >
          + Add Decorator
        </button>
      </div>
      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="table table-zebra w-full text-center">
          <thead className="bg-base-200 text-sm uppercase">
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>District</th>
              <th>Application Status</th>
              <th>Work Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {decorators.map((decorator, index) => (
              <tr>
                <th>{index + 1}</th>
                <td>{decorator.name}</td>
                <td>{decorator.email}</td>
                <td>{decorator.district}</td>
                <td>
                  <p
                    className={`${
                      decorator.status === "approved"
                        ? "text-green-800"
                        : "text-red-500"
                    }`}
                  >
                    {decorator.status}
                  </p>
                </td>
                <td>{decorator.workStatus}</td>
                <td>
                  <button
                    onClick={() => handleApproval(decorator)}
                    className="btn"
                  >
                    <FaUserCheck />
                  </button>
                  <button
                    onClick={() => handleRejection(decorator)}
                    className="btn"
                  >
                    <IoPersonRemoveSharp />
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/decorator-profile/${decorator._id}`)}
                    className="btn btn-square hover:bg-blue-400"
                    title="View Profile"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/edit-decorator/${decorator._id}`)}
                    className="btn btn-square hover:bg-yellow-400"
                    title="Edit Decorator"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteDecorator(decorator._id)}
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

export default ApproveDecorators;
