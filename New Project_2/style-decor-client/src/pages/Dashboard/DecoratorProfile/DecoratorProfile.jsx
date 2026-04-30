import React from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaEdit, FaEnvelope, FaPhone, FaMapMarkerAlt, FaStar, FaBriefcase } from "react-icons/fa";

const STATUS_COLOR = {
  approved: "badge-success",
  pending: "badge-warning",
  rejected: "badge-error",
};

const WORK_COLOR = {
  available: "badge-success",
  busy: "badge-warning",
  "on-leave": "badge-error",
};

const DecoratorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: decorator, isLoading } = useQuery({
    queryKey: ["decorator", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/decorators`);
      return res.data.find((d) => d._id === id) || null;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!decorator) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-lg text-gray-500">Decorator not found.</p>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 my-6">
      {/* Back + Edit */}
      <div className="flex items-center justify-between mb-6">
        <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <button
          className="btn bg-yellow-400 btn-sm gap-2"
          onClick={() => navigate(`/dashboard/edit-decorator/${id}`)}
        >
          <FaEdit /> Edit Profile
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Header banner */}
        <div className="h-24 bg-gradient-to-r from-green-500 to-yellow-300" />

        {/* Avatar + name */}
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-12 mb-4">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-white ring-offset-2">
                <img
                  src={decorator.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(decorator.name)}&background=random`}
                  alt={decorator.name}
                />
              </div>
            </div>
            <div className="pb-1">
              <h2 className="text-2xl font-bold text-[#062416]">{decorator.name}</h2>
              <p className="text-gray-500 text-sm">{decorator.specialty} Decorator</p>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <span className={`badge ${STATUS_COLOR[decorator.status] || "badge-ghost"} badge-lg capitalize`}>
              {decorator.status}
            </span>
            {decorator.workStatus && (
              <span className={`badge ${WORK_COLOR[decorator.workStatus] || "badge-ghost"} badge-lg capitalize`}>
                {decorator.workStatus}
              </span>
            )}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-base-100 rounded-xl p-4 shadow-sm">
              <FaEnvelope className="text-green-600 text-lg shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase">Email</p>
                <p className="font-medium break-all">{decorator.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-base-100 rounded-xl p-4 shadow-sm">
              <FaPhone className="text-green-600 text-lg shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase">Phone</p>
                <p className="font-medium">{decorator.phone || "—"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-base-100 rounded-xl p-4 shadow-sm">
              <FaMapMarkerAlt className="text-green-600 text-lg shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase">Location</p>
                <p className="font-medium">{decorator.district}, {decorator.region}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-base-100 rounded-xl p-4 shadow-sm">
              <FaBriefcase className="text-green-600 text-lg shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase">Experience</p>
                <p className="font-medium">{decorator.experience} {decorator.experience === 1 ? "year" : "years"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-base-100 rounded-xl p-4 shadow-sm">
              <FaStar className="text-yellow-500 text-lg shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase">Specialty</p>
                <p className="font-medium">{decorator.specialty}</p>
              </div>
            </div>

            {decorator.appliedAt && (
              <div className="flex items-center gap-3 bg-base-100 rounded-xl p-4 shadow-sm">
                <span className="text-green-600 text-lg shrink-0">📅</span>
                <div>
                  <p className="text-xs text-gray-400 uppercase">Applied At</p>
                  <p className="font-medium">{new Date(decorator.appliedAt).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecoratorProfile;
