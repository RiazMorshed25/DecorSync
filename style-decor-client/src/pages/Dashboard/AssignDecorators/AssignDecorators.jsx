import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState, useMemo } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const getDayName = (dateStr) => DAYS[new Date(dateStr).getDay()];
const toMinutes = (t) => { if (!t) return null; const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const fmt12 = (t) => { if (!t) return ""; const [h, m] = t.split(":").map(Number); return `${h % 12 || 12}:${String(m).padStart(2,"0")} ${h >= 12 ? "PM" : "AM"}`; };

// Check if decorator is free on a given date + time
const isAvailableOn = (decorator, dateStr, timeStr) => {
  if (!dateStr) return true;
  if (decorator.blockedDates?.includes(dateStr)) return false;
  if (decorator.weeklySchedule?.length) {
    const day = decorator.weeklySchedule.find((d) => d.day === getDayName(dateStr));
    if (day && !day.enabled) return false;
    if (day && day.enabled && timeStr) {
      const sel = toMinutes(timeStr);
      const start = toMinutes(day.startTime);
      const end = toMinutes(day.endTime);
      if (sel !== null && start !== null && end !== null && (sel < start || sel > end)) return false;
    }
  }
  return true;
};

// Get working hours string for a decorator on a given date
const getWorkingHours = (decorator, dateStr) => {
  if (!dateStr || !decorator.weeklySchedule?.length) return null;
  const day = decorator.weeklySchedule.find((d) => d.day === getDayName(dateStr));
  if (day?.enabled && day.startTime && day.endTime)
    return `${fmt12(day.startTime)} – ${fmt12(day.endTime)}`;
  return null;
};

const SPECIALTY_MAP = {
  Wedding: ["Wedding"],
  Birthday: ["Birthday"],
  Corporate: ["Corporate"],
  Concert: ["Concert"],
  PhotoBooth: ["PhotoBooth"],
};

// Score a decorator for a booking (higher = better match)
const scoreDecorator = (decorator, booking, allBookings) => {
  let score = 0;
  // Specialty match
  const serviceTitle = booking.serviceTitle || "";
  const specialty = decorator.specialty || "";
  if (serviceTitle.toLowerCase().includes(specialty.toLowerCase()) ||
      specialty.toLowerCase().includes(serviceTitle.split(" ")[0]?.toLowerCase())) {
    score += 30;
  }
  // Experience
  score += Math.min((decorator.experience || 0) * 2, 20);
  // Workload — fewer active projects = better
  const activeProjects = allBookings.filter(
    (b) => b.decoratorEmail === decorator.email && b.paymentStatus === "paid"
  ).length;
  score -= activeProjects * 5;
  return score;
};

const AssignDecorators = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const axiosSecure = useAxiosSecure();
  const decoratorModalRef = useRef();

  const { data: bookings = [], refetch: bookingsRefetch } = useQuery({
    queryKey: ["bookings", "assign-view"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bookings?paymentStatus=paid");
      return res.data;
    },
  });

  const { data: allDecorators = [], isLoading: loadingDecorators } = useQuery({
    queryKey: ["decorators", "approved-all"],
    queryFn: async () => {
      const res = await axiosSecure.get("/decorators?status=approved");
      return res.data;
    },
  });

  // Smart filtered + scored decorators for selected booking
  const smartDecorators = useMemo(() => {
    if (!selectedBooking || !allDecorators.length) return [];

    const district = selectedBooking.district;
    const eventDate = selectedBooking.eventDate
      ? new Date(selectedBooking.eventDate).toISOString().split("T")[0]
      : null;
    const eventTime = selectedBooking.eventTime || null;

    return allDecorators
      .filter((d) => {
        // Must be in same district
        if (district && d.district !== district) return false;
        // Must be available on event date/time
        if (!isAvailableOn(d, eventDate, eventTime)) return false;
        return true;
      })
      .map((d) => ({
        ...d,
        workingHours: getWorkingHours(d, eventDate),
        activeProjects: bookings.filter(
          (b) => b.decoratorEmail === d.email && b.paymentStatus === "paid"
        ).length,
        score: scoreDecorator(d, selectedBooking, bookings),
      }))
      .sort((a, b) => b.score - a.score); // best match first
  }, [selectedBooking, allDecorators, bookings]);

  const openModal = (booking) => {
    setSelectedBooking(booking);
    decoratorModalRef.current.showModal();
  };

  const handleAssign = (decorator) => {
    const assignInfo = {
      decoratorId: decorator._id,
      decoratorName: decorator.name,
      decoratorEmail: decorator.email,
      trackingId: selectedBooking.trackingId || selectedBooking._id,
    };
    axiosSecure
      .patch(`/bookings/${selectedBooking._id}/assign-decorator`, assignInfo)
      .then((res) => {
        if (res.data.success) {
          decoratorModalRef.current.close();
          bookingsRefetch();
          Swal.fire({ position: "top-end", icon: "success", title: "Decorator assigned!", showConfirmButton: false, timer: 1500 });
        }
      })
      .catch((err) => {
        Swal.fire({ icon: "error", title: "Failed to assign", text: err.response?.data?.error || "Something went wrong" });
      });
  };

  const eventDateStr = selectedBooking?.eventDate
    ? new Date(selectedBooking.eventDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  return (
    <div className="p-6">
      <h2 className="text-3xl md:text-4xl font-bold text-[#062416] my-6">
        Assign Decorators
        <span className="text-lg font-normal text-gray-500 ml-3">
          {bookings.filter((b) => !b.decoratorId).length} unassigned
        </span>
      </h2>

      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="table table-zebra w-full text-center">
          <thead className="bg-base-200 text-sm uppercase">
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Event Date & Time</th>
              <th>District</th>
              <th>Cost</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan={7} className="py-10 text-gray-400">No paid bookings found.</td></tr>
            ) : (
              bookings.map((booking, index) => (
                <tr key={booking._id}>
                  <th>{index + 1}</th>
                  <td>
                    <p className="font-medium">{booking.userName || "—"}</p>
                    <p className="text-xs text-gray-400">{booking.userEmail || "—"}</p>
                  </td>
                  <td>{booking.serviceTitle || "—"}</td>
                  <td>
                    <p>{booking.eventDate ? new Date(booking.eventDate).toLocaleDateString("en-GB") : "—"}</p>
                    {booking.eventTime && <p className="text-xs text-gray-400">{fmt12(booking.eventTime)}</p>}
                  </td>
                  <td>{booking.district || "—"}</td>
                  <td>{booking.cost}</td>
                  <td>
                    {booking.decoratorId ? (
                      <div>
                        <span className="badge badge-success badge-sm">Assigned</span>
                        <p className="text-xs text-gray-400 mt-1">{booking.decoratorName}</p>
                      </div>
                    ) : (
                      <button onClick={() => openModal(booking)} className="btn bg-yellow-300 btn-sm">
                        Assign
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Assignment Modal */}
      <dialog ref={decoratorModalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-3xl">

          {/* Booking context */}
          {selectedBooking && (
            <div className="bg-base-200 rounded-xl p-4 mb-4 text-sm">
              <p className="font-bold text-[#062416] text-base mb-2">Booking Details</p>
              <div className="grid grid-cols-2 gap-2">
                <p><span className="text-gray-500">Service:</span> <span className="font-medium">{selectedBooking.serviceTitle}</span></p>
                <p><span className="text-gray-500">District:</span> <span className="font-medium">{selectedBooking.district}</span></p>
                <p><span className="text-gray-500">Event Date:</span> <span className="font-medium">{eventDateStr}</span></p>
                {selectedBooking.eventTime && (
                  <p><span className="text-gray-500">Event Time:</span> <span className="font-medium">{fmt12(selectedBooking.eventTime)}</span></p>
                )}
                <p><span className="text-gray-500">Customer:</span> <span className="font-medium">{selectedBooking.userName}</span></p>
              </div>
            </div>
          )}

          <h3 className="font-bold text-lg mb-1">
            Available Decorators
            <span className="text-sm font-normal text-gray-500 ml-2">
              {smartDecorators.length} match{smartDecorators.length !== 1 ? "es" : ""}
            </span>
          </h3>
          <p className="text-xs text-gray-400 mb-4">Sorted by best match — specialty, experience, and workload</p>

          {loadingDecorators ? (
            <div className="flex justify-center py-8"><span className="loading loading-spinner loading-lg"></span></div>
          ) : smartDecorators.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No available decorators</p>
              <p className="text-sm mt-1">No approved decorators match this booking's date, time, and district.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {smartDecorators.map((decorator, i) => {
                const isTopPick = i === 0;
                return (
                  <div
                    key={decorator._id}
                    className={`flex items-center justify-between gap-3 p-3 rounded-xl border ${
                      isTopPick ? "border-green-400 bg-green-50" : "border-base-300 bg-base-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img
                            src={decorator.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(decorator.name)}&background=random`}
                            alt={decorator.name}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{decorator.name}</p>
                          {isTopPick && <span className="badge badge-success badge-xs">Best Match</span>}
                        </div>
                        <p className="text-xs text-gray-400">{decorator.email}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="badge badge-ghost badge-xs">{decorator.specialty}</span>
                          <span className="badge badge-ghost badge-xs">{decorator.experience}y exp</span>
                          <span className="badge badge-ghost badge-xs">{decorator.activeProjects} active projects</span>
                          {decorator.workingHours && (
                            <span className="badge badge-info badge-xs">{decorator.workingHours}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAssign(decorator)}
                      className="btn btn-success btn-sm shrink-0"
                    >
                      Assign
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AssignDecorators;
