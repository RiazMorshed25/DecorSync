import React from "react";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useLoaderData } from "react-router";
import { useForm } from "react-hook-form";

const Decorators = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const serviceCenters = useLoaderData();

  const regionsDuplicate = serviceCenters.map((c) => c.region);
  const regions = [...new Set(regionsDuplicate)];

  const getDistrictsByRegion = (region) => {
    if (!region) return [];
    const filtered = serviceCenters.filter((c) => c.region === region);
    const districts = filtered.map((d) => d.district);
    return [...new Set(districts)]; 
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const selectedRegion = watch("region");

  const onSubmit = async (data) => {
    const decoratorInfo = {
      name: user?.displayName,
      email: user?.email,
      region: data.region,
      photoURL: user?.photoURL,
      district: data.district,
      phone: data.phone,
      specialty: data.specialty,
      experience: data.experience,
      status: "pending",
      appliedAt: new Date(),
    };

    try {
      const res = await axiosSecure.post("/decorators", decoratorInfo);

      if (res.data?.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted",
          text: "Your decorator application is under review",
        });
        reset();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="fieldset mx-auto items-center bg-gradient-to-r from-green-500 to-yellow-300 border-base-300 rounded-box w-full max-w-md border p-8 m-8">
        <h2 className="fieldset-legend text-2xl p-1">Apply as Decorator</h2>

        <label className="label">Name</label>
        <input
          type="text"
          value={user?.displayName || ""}
          readOnly
          className="input input-bordered w-full"
        />
        <label className="label">Photo URL</label>
        <input
          type="text"
          value={user?.photoURL || ""}
          readOnly
          className="input input-bordered w-full"
        />

        <label className="label">Email</label>
        <input
          type="email"
          value={user?.email || ""}
          readOnly
          className="input input-bordered w-full"
        />

        <label className="label">Region</label>
        <select
          className="select select-bordered w-full"
          {...register("region", { required: "Region is required" })}
          defaultValue=""
        >
          <option value="" disabled>
            Pick a region
          </option>
          {regions.map((r, i) => (
            <option key={i} value={r}>
              {r}
            </option>
          ))}
        </select>
        {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region.message}</p>}

        <label className="label">District</label>
        <select
          className="select select-bordered w-full"
          {...register("district", { required: "District is required" })}
          defaultValue=""
          disabled={!selectedRegion}
        >
          <option value="" disabled>
            {selectedRegion ? "Pick a district" : "First select a region"}
          </option>
          {getDistrictsByRegion(selectedRegion).map((dist, i) => (
            <option key={i} value={dist}>
              {dist}
            </option>
          ))}
        </select>
        {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>}

        {/* Phone Number */}
        <label className="label">Phone Number</label>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="01XXXXXXXXX"
          {...register("phone", {
            required: "Phone number is required",
            pattern: {
              value: /^01[3-9]\d{8}$/,
              message: "Invalid Bangladeshi phone number",
            },
          })}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}

        <label className="label">Specialty</label>
        <select
          className="select select-bordered w-full"
          {...register("specialty", { required: "Specialty is required" })}
          defaultValue=""
        >
          <option value="" disabled>
            Select specialty
          </option>
          <option value="Wedding">Wedding Decoration</option>
          <option value="Birthday">Birthday Decoration</option>
          <option value="Corporate">Corporate / Office</option>
          <option value="Concert">Concert / Stage</option>
          <option value="PhotoBooth">Photo Booth</option>
        </select>
        {errors.specialty && <p className="text-red-500 text-sm mt-1">{errors.specialty.message}</p>}

        <label className="label">Experience (Years)</label>
        <input
          type="number"
          className="input input-bordered w-full"
          placeholder="e.g. 3"
          min="0"
          {...register("experience", {
            required: "Experience is required",
            min: { value: 0, message: "Experience cannot be negative" },
          })}
        />
        {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>}

        <button type="submit" className="btn bg-yellow-400 mt-4 w-full">
          Apply as Decorator
        </button>
      </fieldset>
    </form>
  );
};

export default Decorators;