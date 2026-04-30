import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DEFAULT_SCHEDULE = DAYS.map((day) => ({
  day,
  enabled: day !== "Sunday",
  startTime: "09:00",
  endTime: "18:00",
}));


const SetAvailability = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [blockedDates, setBlockedDates] = useState([]);
  const [newBlockedDate, setNewBlockedDate] = useState("");

  // Fetch existing decorator data
  const { data: decorators = [], isLoading } = useQuery({
    queryKey: ["decorator-availability", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/decorators");
      return res.data;
    },
  });

  const decorator = decorators.find((d) => d.email === user?.email);

  // Pre-fill saved schedule
  useEffect(() => {
    if (decorator?.weeklySchedule) {
      setSchedule(decorator.weeklySchedule);
    }
    if (decorator?.blockedDates) {
      setBlockedDates(decorator.blockedDates);
    }
  }, [decorator]);

  const toggleDay = (index) => {
    setSchedule((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const updateTime = (index, field, value) => {
    setSchedule((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addBlockedDate = () => {
    if (!newBlockedDate) return;
    if (blockedDates.includes(newBlockedDate)) {
      Swal.fire({ icon: "info", title: "Date already blocked", timer: 1500, showConfirmButton: false });
      return;
    }
    setBlockedDates((prev) => [...prev, newBlockedDate].sort());
    setNewBlockedDate("");
  };

  const removeBlockedDate = (date) => {
    setBlockedDates((prev) => prev.filter((d) => d !== date));
  };

  const { mutate: saveAvailability, isPending } = useMutation({
    mutationFn: async () => {
      if (!decorator?._id) throw new Error("Decorator profile not found");
      const res = await axiosSecure.patch(`/decorators/${decorator._id}`, {
        weeklySchedule: schedule,
        blockedDates,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["decorator-availability"]);
      Swal.fire({
        icon: "success",
        title: "Availability saved!",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Failed to save",
        text: err.message || "Something went wrong",
      });
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
      <div className="max-w-xl mx-auto mt-20 text-center">
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-8">
          <p className="text-xl font-semibold text-yellow-700">No decorator profile found</p>
          <p className="text-sm text-gray-500 mt-2">
            You need an approved decorator profile to set availability.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 my-6">
      <h2 className="text-3xl font-bold text-[#062416] mb-2">Set Availability</h2>
      <p className="text-gray-500 text-sm mb-6">
        Define your weekly working schedule and block specific dates you're unavailable.
      </p>

      {/* Weekly Schedule */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold text-[#062416] mb-4">Weekly Schedule</h3>
        <div className="space-y-3">
          {schedule.map((item, index) => (
            <div
              key={item.day}
              className={`flex flex-wrap items-center gap-3 p-3 rounded-lg border transition-all ${
                item.enabled ? "border-green-300 bg-green-50" : "border-gray-200 bg-gray-50 opacity-60"
              }`}
            >
              {/* Toggle */}
              <input
                type="checkbox"
                className="toggle toggle-success toggle-sm"
                checked={item.enabled}
                onChange={() => toggleDay(index)}
              />

              {/* Day name */}
              <span className="w-24 font-medium text-sm">{item.day}</span>

              {/* Time pickers */}
              {item.enabled ? (
                <>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500">From</label>
                    <input
                      type="time"
                      className="input input-bordered input-sm w-32"
                      value={item.startTime}
                      onChange={(e) => updateTime(index, "startTime", e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500">To</label>
                    <input
                      type="time"
                      className="input input-bordered input-sm w-32"
                      value={item.endTime}
                      onChange={(e) => updateTime(index, "endTime", e.target.value)}
                    />
                  </div>
                  <span className="text-xs text-green-600 ml-auto">Available</span>
                </>
              ) : (
                <span className="text-xs text-gray-400 ml-auto">Day Off</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Blocked Dates */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold text-[#062416] mb-4">Block Specific Dates</h3>
        <p className="text-xs text-gray-400 mb-3">
          Add dates you won't be available (holidays, personal leave, etc.)
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="date"
            className="input input-bordered input-sm flex-1"
            value={newBlockedDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setNewBlockedDate(e.target.value)}
          />
          <button
            className="btn btn-sm bg-[#062416] text-white"
            onClick={addBlockedDate}
            disabled={!newBlockedDate}
          >
            Block Date
          </button>
        </div>

        {blockedDates.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No dates blocked</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {blockedDates.map((date) => (
              <div
                key={date}
                className="flex items-center gap-1 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-1.5 rounded-full"
              >
                <span>{new Date(date + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                <button
                  onClick={() => removeBlockedDate(date)}
                  className="ml-1 hover:text-red-900 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-base-200 rounded-xl p-4 mb-6 text-sm text-gray-600">
        <p>
          Working days:{" "}
          <span className="font-semibold text-green-700">
            {schedule.filter((d) => d.enabled).map((d) => d.day.slice(0, 3)).join(", ") || "None"}
          </span>
        </p>
        <p className="mt-1">
          Blocked dates: <span className="font-semibold text-red-600">{blockedDates.length}</span>
        </p>
      </div>

      <button
        className="btn bg-green-500 text-white w-full"
        onClick={() => saveAvailability()}
        disabled={isPending}
      >
        {isPending ? <span className="loading loading-spinner loading-sm"></span> : "Save Availability"}
      </button>
    </div>
  );
};

export default SetAvailability;
