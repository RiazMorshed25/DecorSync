import React from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import { FaRegCreditCard, FaUser, FaCalendarCheck, FaRegChartBar, FaClipboardList } from "react-icons/fa6";
import { FaCheckCircle, FaPlus, FaUserPlus, FaUserEdit, FaChartLine, FaCreditCard } from "react-icons/fa";
import { MdCalendarToday, MdSchedule, MdAssignment, MdEvent, MdEditCalendar } from "react-icons/md";
import { Link, NavLink, Outlet } from "react-router";
import useRole from "../hooks/useRole";

const DashboardLayout = () => {
  const { role } = useRole();
  return (
    <div className="drawer lg:drawer-open mx-auto ">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <nav className="navbar w-full bg-gradient-to-r from-green-500 to-yellow-300">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <div className="px-4 font-semibold">StyleDecor Dashboard</div>
        </nav>
        <Outlet></Outlet>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible ">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay "
        ></label>
        <div className="flex min-h-full flex-col items-start bg-gradient-to-r from-green-500 to-yellow-300 is-drawer-close:w-14 is-drawer-open:w-64">
          {/* Sidebar content here */}
          <ul className="menu w-full grow">
            {/* List item */}
            <li>
              <Link
                to="/"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Homepage"
              >
                {/* Home icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  className="my-1.5 inline-block size-4"
                >
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                <span className="is-drawer-close:hidden">Homepage</span>
              </Link>
            </li>

            {/* our dashboard links */}
            <li>
              <NavLink
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Profile"
                to="/dashboard/profile"
              >
                <FaUser />
                <span className="is-drawer-close:hidden">Profile</span>
              </NavLink>
            </li>
            {role === "user" && (
              <>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="My Bookings"
                    to="/dashboard/my-bookings"
                  >
                    <FaCalendarCheck />
                    <span className="is-drawer-close:hidden">My Bookings</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Payment History"
                    to="/dashboard/payment-history"
                  >
                    <FaRegCreditCard />
                    <span className="is-drawer-close:hidden">
                      Payment History
                    </span>
                  </NavLink>
                </li>
              </>
            )}

            {role === "admin" && (
              <>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Add Service"
                    to="/dashboard/add-service"
                  >
                    <FaPlus />
                    <span className="is-drawer-close:hidden">
                      Add Service
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Appointments"
                    to="/dashboard/appointments"
                  >
                    <MdEvent />
                    <span className="is-drawer-close:hidden">
                      Appointments
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Approve Decorators"
                    to="/dashboard/approve-decorators"
                  >
                    <FaCheckCircle />
                    <span className="is-drawer-close:hidden">
                      Approve Decorators
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Add Decorator"
                    to="/dashboard/add-decorator"
                  >
                    <FaUserEdit />
                    <span className="is-drawer-close:hidden">
                      Add Decorator
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Assign Decorators"
                    to="/dashboard/assign-decorators"
                  >
                    <FaUserPlus />
                    <span className="is-drawer-close:hidden">
                      Assign Decorators
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Users Management"
                    to="/dashboard/users-management"
                  >
                    <FaUser />
                    <span className="is-drawer-close:hidden">
                      Users Management
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="All Bookings"
                    to="/dashboard/all-bookings"
                  >
                    <FaClipboardList />
                    <span className="is-drawer-close:hidden">All Bookings</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Revenue Tracking"
                    to="/dashboard/revenue-tracking"
                  >
                    <FaChartLine />
                    <span className="is-drawer-close:hidden">Revenue Tracking</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Payment History"
                    to="/dashboard/payment-history"
                  >
                    <FaCreditCard />
                    <span className="is-drawer-close:hidden">Payment History</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Booking Summary Analysis"
                    to="/dashboard/summary-analysis"
                  >
                    <FaRegChartBar />
                    <span className="is-drawer-close:hidden">
                      Booking Summary Analysis
                    </span>
                  </NavLink>
                </li>
              </>
            )}

            {role === "decorator" && (
              <>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="My Projects & Schedule"
                    to="/dashboard/my-assign-projects"
                  >
                    <MdAssignment />
                    <span className="is-drawer-close:hidden">
                      My Projects & Schedule
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Set Availability"
                    to="/dashboard/set-availability"
                  >
                    <MdEditCalendar />
                    <span className="is-drawer-close:hidden">
                      Set Availability
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Earning Summary"
                    to="/dashboard/earning-summary"
                  >
                    <MdSchedule />
                    <span className="is-drawer-close:hidden">
                      Earning Summary
                    </span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
