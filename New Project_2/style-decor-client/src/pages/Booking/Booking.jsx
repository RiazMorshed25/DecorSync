import { useState, useEffect } from "react";
import { useLoaderData, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/Loading";
import Swal from "sweetalert2";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const getDayName = (dateStr) => DAYS[new Date(dateStr).getDay()];

// Convert "HH:MM" to total minutes for easy comparison
const toMinutes = (timeStr) => {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

const fmt12 = (timeStr) => {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
};

// Returns { available: bool, reason: string, workingHours: string|null }
const checkDecorator = (decorator, dateStr, timeStr) => {
  if (!dateStr) return { available: true, reason: "", workingHours: null };

  // Blocked date
  if (decorator.blockedDates?.includes(dateStr))
    return { available: false, reason: "blocked", workingHours: null };

  const dayName = getDayName(dateStr);

  if (decorator.weeklySchedule?.length) {
    const daySchedule = decorator.weeklySchedule.find((d) => d.day === dayName);

    // Day off
    if (daySchedule && !daySchedule.enabled)
      return { available: false, reason: "day-off", workingHours: null };

    // Working hours check
    if (daySchedule && daySchedule.enabled && timeStr) {
      const start = toMinutes(daySchedule.startTime);
      const end = toMinutes(daySchedule.endTime);
      const selected = toMinutes(timeStr);

      if (start !== null && end !== null && selected !== null) {
        if (selected < start || selected > end) {
          return {
            available: false,
            reason: "outside-hours",
            workingHours: `${fmt12(daySchedule.startTime)} – ${fmt12(daySchedule.endTime)}`,
          };
        }
      }

      return {
        available: true,
        reason: "ok",
        workingHours: `${fmt12(daySchedule.startTime)} – ${fmt12(daySchedule.endTime)}`,
      };
    }
  }

  return { available: true, reason: "ok", workingHours: null };
};

const Booking = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const serviceCenters = useLoaderData();

  const regions = [...new Set(serviceCenters.map((c) => c.region))];
  const getDistrictsByRegion = (region) => {
    if (!region) return [];
    return [...new Set(serviceCenters.filter((c) => c.region === region).map((c) => c.district))];
  };

  const { serviceTitle, serviceId, cost, image } = location.state || {};

  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");

  // null | "checking" | "available" | "unavailable" | "outside-hours"
  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [availableHours, setAvailableHours] = useState(null); // working hours string

  useEffect(() => {
    if (!eventDate || !district) {
      setAvailabilityStatus(null);
      setAvailableHours(null);
      return;
    }

    setAvailabilityStatus("checking");
    setAvailableHours(null);

    axiosSecure
      .get(`/decorators?status=approved&district=${encodeURIComponent(district)}`)
      .then((res) => {
        const decorators = res.data;

        // Find decorators available on this date+time
        const results = decorators.map((d) => checkDecorator(d, eventDate, eventTime));
        const anyAvailable = results.some((r) => r.available);

        if (anyAvailable) {
          // Collect working hours from available decorators
          const hours = results
            .filter((r) => r.available && r.workingHours)
            .map((r) => r.workingHours);
          setAvailableHours(hours.length > 0 ? hours[0] : null);
          setAvailabilityStatus("available");
        } else {
          // Check if it's an outside-hours issue vs full unavailability
          const outsideHours = results.some((r) => r.reason === "outside-hours");
          if (outsideHours && eventTime) {
            const hours = results
              .filter((r) => r.reason === "outside-hours" && r.workingHours)
              .map((r) => r.workingHours);
            setAvailableHours(hours.length > 0 ? hours[0] : null);
            setAvailabilityStatus("outside-hours");
          } else {
            setAvailabilityStatus("unavailable");
          }
        }
      })
      .catch(() => setAvailabilityStatus(null));
  }, [eventDate, eventTime, district]);

  if (!serviceId) return <Loading />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (availabilityStatus === "unavailable" || availabilityStatus === "outside-hours") {
      Swal.fire({
        icon: "warning",
        title: availabilityStatus === "outside-hours"
          ? "Outside Working Hours"
          : "No Decorators Available",
        text: availabilityStatus === "outside-hours"
          ? `Please select a time within the decorator's working hours${availableHours ? `: ${availableHours}` : ""}.`
          : "No decorators are available in your area on the selected date.",
        confirmButtonColor: "#062416",
      });
      return;
    }

    const bookingData = {
      userId: user?._id || user?.uid,
      userName: user?.displayName,
      userEmail: user?.email,
      serviceTitle,
      serviceId,
      cost,
      designImage: image,
      eventDate,
      eventTime,
      region,
      district,
      location: { addressLine: address, region, district },
    };

    try {
      await axiosSecure.post("/bookings", bookingData);
      Swal.fire({
        title: "Success!",
        text: "Your booking has been successfully completed!",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#28a745",
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Booking failed. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const isBlocked = availabilityStatus === "unavailable" || availabilityStatus === "outside-hours" || availabilityStatus === "checking";

  return (
    <div className="max-w-6xl mx-auto my-12 px-4">
      <form onSubmit={handleSubmit}>
        <div className="card lg:card-side bg-base-100 shadow-xl">
          <figure className="lg:w-1/2">
            <img src={image} alt="Service Design" className="h-full w-full object-cover" />
          </figure>

          <div className="card-body">
            <h2 className="card-title text-2xl text-[#062416]">Booking Summary</h2>

            <div className="space-y-1 text-sm">
              <p><span className="font-semibold">Name:</span> {user?.displayName}</p>
              <p><span className="font-semibold">Email:</span> {user?.email}</p>
            </div>

            <div className="divider"></div>

            <div className="space-y-1">
              <p><span className="font-semibold">Service ID:</span> {serviceId}</p>
              <p className="text-green-600 font-bold text-lg">Cost: Bdt {cost}</p>
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* Event Date */}
              <div>
                <label className="label text-xs font-medium">Event Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Event Time */}
              <div>
                <label className="label text-xs font-medium">
                  Event Time
                  {availableHours && availabilityStatus === "available" && (
                    <span className="text-green-600 ml-2 font-normal">
                      (Working hours: {availableHours})
                    </span>
                  )}
                  {availableHours && availabilityStatus === "outside-hours" && (
                    <span className="text-red-500 ml-2 font-normal">
                      (Available: {availableHours})
                    </span>
                  )}
                </label>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className={`input input-bordered w-full ${
                    availabilityStatus === "outside-hours" ? "border-red-400" : ""
                  }`}
                  required
                />
              </div>

              {/* Region */}
              <div>
                <label className="label text-xs font-medium">Region</label>
                <select
                  value={region}
                  onChange={(e) => { setRegion(e.target.value); setDistrict(""); }}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="" disabled>Select Region</option>
                  {regions.map((r, i) => <option key={i} value={r}>{r}</option>)}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="label text-xs font-medium">District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="select select-bordered w-full"
                  required
                  disabled={!region || !eventDate}
                >
                  <option value="" disabled>
                    {!region ? "First select a Region" : "Select District"}
                  </option>
                  {region && eventDate && getDistrictsByRegion(region).map((dist, i) => (
                    <option key={i} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div className="lg:col-span-2">
                <label className="label text-xs font-medium">Detailed Address</label>
                <textarea
                  placeholder="Detailed Service Location Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="textarea textarea-bordered w-full"
                  required
                />
              </div>
            </div>

            {/* Availability indicator */}
            {availabilityStatus && (
              <div className={`mt-2 flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
                availabilityStatus === "checking"
                  ? "bg-base-200 text-gray-500"
                  : availabilityStatus === "available"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {availabilityStatus === "checking" && (
                  <><span className="loading loading-spinner loading-xs"></span> Checking availability...</>
                )}
                {availabilityStatus === "available" && (
                  <>
                    <span>✓</span>
                    <span>
                      Decorators available on this date
                      {eventTime && availableHours && ` · Working hours: ${availableHours}`}
                    </span>
                  </>
                )}
                {availabilityStatus === "outside-hours" && (
                  <>
                    <span>✗</span>
                    <span>
                      Selected time is outside working hours.
                      {availableHours && <strong> Available: {availableHours}</strong>}
                    </span>
                  </>
                )}
                {availabilityStatus === "unavailable" && (
                  <><span>✗</span> No decorators available on this date in your area.</>
                )}
              </div>
            )}

            <div className="card-actions justify-end mt-6">
              <button
                type="submit"
                disabled={isBlocked}
                className="btn bg-yellow-500 text-white hover:bg-[#062416] disabled:opacity-50"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Booking;
