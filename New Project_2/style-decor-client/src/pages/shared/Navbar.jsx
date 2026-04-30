import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";

const NavBar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleTheme = (checked) => setTheme(checked ? "dark" : "light");

  const handleSignOut = () => {
    logOut()
      .then(() => navigate("/"))
      .catch((err) => console.log(err));
  };

  const commonLinks = (
    <>
      <li>
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-300 rounded-lg hover:text-yellow-500 hover:bg-white/10 ${
              isActive ? 'text-yellow-500 bg-white/10' : ''
            }`
          }
        >
          HOME
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/services"
          className={({ isActive }) => 
            `px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-300 rounded-lg hover:text-yellow-500 hover:bg-white/10 ${
              isActive ? 'text-yellow-500 bg-white/10' : ''
            }`
          }
        >
          SERVICES
        </NavLink>
      </li>

      <li>
        <NavLink 
          to="/service-area" 
          className={({ isActive }) => 
            `px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-300 rounded-lg hover:text-yellow-500 hover:bg-white/10 ${
              isActive ? 'text-yellow-500 bg-white/10' : ''
            }`
          }
        >
          SERVICE AREA  
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/consultation" 
          className={({ isActive }) => 
            `px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-300 rounded-lg hover:text-yellow-500 hover:bg-white/10 ${
              isActive ? 'text-yellow-500 bg-white/10' : ''
            }`
          }
        >
          CONSULTATION
        </NavLink>
      </li>

      <li>
        <NavLink 
          to="/dashboard/profile" 
          className={({ isActive }) => 
            `px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-300 rounded-lg hover:text-yellow-500 hover:bg-white/10 ${
              isActive ? 'text-yellow-500 bg-white/10' : ''
            }`
          }
        >
          DASHBOARD
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/decorator" 
          className="block px-5 py-2.5 rounded-lg font-semibold text-white bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 text-sm tracking-wide"
        >
          DECORATOR
        </NavLink>
      </li>
    </>
  );

  const authLinks = user ? (
    <div className="relative group">
      <div className="relative">
        <img
          src={user?.photoURL || "https://i.ibb.co.com/4pQ5tY0/default-user.png"}
          alt="User"
          className="w-11 h-11 rounded-full cursor-pointer border-2 border-yellow-500/50 hover:border-yellow-500 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#062416]"></div>
      </div>
      <div
        className={`absolute right-0 mt-3 w-56 bg-white shadow-2xl rounded-xl overflow-hidden transition-all duration-300 transform ${
          dropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
        }`}
      >
        <div className="bg-gradient-to-r from-[#062416] to-[#0a3520] p-4 border-b-2 border-yellow-500">
          <p className="font-bold text-white truncate">{user?.displayName}</p>
          <p className="text-sm text-gray-300 truncate">{user?.email}</p>
        </div>
        <ul className="py-2">
          <li>
            <NavLink
              to="/dashboard/profile"
              className="block px-4 py-2.5 hover:bg-yellow-50 transition-colors duration-200 font-semibold text-gray-700 hover:text-yellow-600 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </NavLink>
          </li>
          <li>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2.5 hover:bg-red-50 transition-colors duration-200 font-semibold text-gray-700 hover:text-red-600 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </li>
          <li className="px-4 py-2 border-t mt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-600">Theme</span>
              <input
                type="checkbox"
                onChange={(e) => handleTheme(e.target.checked)}
                defaultChecked={theme === "dark"}
                className="toggle toggle-sm toggle-warning"
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
  ) : (
    <>
      <ul className="flex items-center gap-2">
        <li>
          <NavLink 
            to="/login" 
            className="block px-5 py-2 rounded-lg font-semibold text-white hover:text-yellow-500 hover:bg-white/10 transition-all duration-300 text-sm tracking-wide"
          >
            Login
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/register"
            className="block px-5 py-2.5 rounded-lg font-semibold text-white bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 text-sm tracking-wide"
          >
            Sign Up
          </NavLink>
        </li>
      </ul>
    </>
  );

  return (
    <div className="navbar bg-gradient-to-r from-[#062416] to-[#0a3520] text-gray-300 px-4 sm:px-6 lg:px-8 py-3 items-center sticky top-0 z-50 shadow-lg backdrop-blur-sm">
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost hover:bg-white/10 transition-colors duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-16 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content bg-white rounded-xl mt-3 w-56 p-3 shadow-2xl border border-gray-100"
          >
            {commonLinks}
            {!user && (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 rounded-lg transition-colors duration-200"
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/register"
                    className="px-4 py-2 text-sm font-semibold text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors duration-200 mt-1"
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
        <NavLink to="/" className="flex items-center gap-1 group">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight transition-transform duration-300 group-hover:scale-105">
            Style<span className="text-yellow-500">Decor</span>
          </h2>
        </NavLink>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">{commonLinks}</ul>
      </div>
      <div className="navbar-end flex items-center gap-4">{authLinks}</div>
    </div>
  );
};

export default NavBar;
