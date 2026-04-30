import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router";

const SPECIALTIES = [
  "Wedding",
  "Birthday",
  "Corporate",
  "Concert",
  "PhotoBooth",
];

const AddEditDecorator = () => {
  const { id } = useParams(); // present = edit mode
  const isEdit = !!id;
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const serviceCenters = useLoaderData();

  const regions = [...new Set(serviceCenters.map((c) => c.region))];
  const getDistricts = (region) => {
    if (!region) return [];
    return [
      ...new Set(
        serviceCenters.filter((c) => c.region === region).map((c) => c.district)
      ),
    ];
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const selectedRegion = watch("region");

  // Fetch existing decorator data in edit mode
  const { data: decorator, isLoading } = useQuery({
    queryKey: ["decorator", id],
    enabled: isEdit,
    queryFn: async () => {
      const res = await axiosSecure.get(`/decorators`);
      return res.data.find((d) => d._id === id) || null;
    },
  });

  // Pre-fill form when decorator data loads
  useEffect(() => {
    if (decorator) {
      reset({
        name: decorator.name,
        email: decorator.email,
        phone: decorator.phone,
        region: decorator.region,
        district: decorator.district,
        specialty: decorator.specialty,
        experience: decorator.experience,
        photoURL: decorator.photoURL,
        status: decorator.status,
        workStatus: decorator.workStatus,
      });
    }
  }, [decorator, reset]);

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      region: data.region,
      district: data.district,
      specialty: data.specialty,
      experience: Number(data.experience),
      photoURL: data.photoURL,
      ...(isEdit && { status: data.status, workStatus: data.workStatus }),
      ...(!isEdit && { status: "pending", appliedAt: new Date() }),
    };

    try {
      if (isEdit) {
        const res = await axiosSecure.patch(`/decorators/${id}`, payload);
        if (res.data.modifiedCount || res.data.acknowledged) {
          Swal.fire({ icon: "success", title: "Decorator updated successfully!", timer: 2000, showConfirmButton: false });
          navigate("/dashboard/approve-decorators");
        }
      } else {
        const res = await axiosSecure.post("/decorators", payload);
        if (res.data?.insertedId) {
          Swal.fire({ icon: "success", title: "Decorator added successfully!", timer: 2000, showConfirmButton: false });
          navigate("/dashboard/approve-decorators");
        }
      }
    } catch {
      Swal.fire({ icon: "error", title: "Failed", text: "Something went wrong. Please try again." });
    }
  };

  if (isEdit && isLoading) {
    return <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 my-6">
      <h2 className="text-3xl font-bold text-[#062416] mb-6">
        {isEdit ? "Edit Decorator" : "Add New Decorator"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl p-6 space-y-4">

        {/* Name */}
        <div>
          <label className="label font-medium">Full Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Full name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="label font-medium">Email</label>
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="email@example.com"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Photo URL */}
        <div>
          <label className="label font-medium">Photo URL</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="https://..."
            {...register("photoURL")}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="label font-medium">Phone Number</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="01XXXXXXXXX"
            {...register("phone", {
              required: "Phone is required",
              pattern: { value: /^01[3-9]\d{8}$/, message: "Invalid Bangladeshi phone number" },
            })}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        {/* Region */}
        <div>
          <label className="label font-medium">Region</label>
          <select className="select select-bordered w-full" {...register("region", { required: "Region is required" })} defaultValue="">
            <option value="" disabled>Pick a region</option>
            {regions.map((r, i) => <option key={i} value={r}>{r}</option>)}
          </select>
          {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region.message}</p>}
        </div>

        {/* District */}
        <div>
          <label className="label font-medium">District</label>
          <select className="select select-bordered w-full" {...register("district", { required: "District is required" })} defaultValue="" disabled={!selectedRegion}>
            <option value="" disabled>{selectedRegion ? "Pick a district" : "Select a region first"}</option>
            {getDistricts(selectedRegion).map((d, i) => <option key={i} value={d}>{d}</option>)}
          </select>
          {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>}
        </div>

        {/* Specialty */}
        <div>
          <label className="label font-medium">Specialty</label>
          <select className="select select-bordered w-full" {...register("specialty", { required: "Specialty is required" })} defaultValue="">
            <option value="" disabled>Select specialty</option>
            {SPECIALTIES.map((s) => <option key={s} value={s}>{s} Decoration</option>)}
          </select>
          {errors.specialty && <p className="text-red-500 text-sm mt-1">{errors.specialty.message}</p>}
        </div>

        {/* Experience */}
        <div>
          <label className="label font-medium">Experience (Years)</label>
          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="e.g. 3"
            min="0"
            {...register("experience", {
              required: "Experience is required",
              min: { value: 0, message: "Cannot be negative" },
            })}
          />
          {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>}
        </div>

        {/* Edit-only fields */}
        {isEdit && (
          <>
            <div>
              <label className="label font-medium">Application Status</label>
              <select className="select select-bordered w-full" {...register("status")}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="label font-medium">Work Status</label>
              <select className="select select-bordered w-full" {...register("workStatus")}>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
          </>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn bg-green-500 text-white flex-1">
            {isEdit ? "Update Decorator" : "Add Decorator"}
          </button>
          <button type="button" className="btn btn-outline flex-1" onClick={() => navigate("/dashboard/approve-decorators")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditDecorator;
