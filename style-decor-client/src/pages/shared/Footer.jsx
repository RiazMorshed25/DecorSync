import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { MdLocationOn, MdPhone, MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-[#062416] text-gray-300 pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        <div>
          <h3 className="text-white text-3xl font-semibold mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-yellow-500 inline-block"></span>
            styleDecor
          </h3>
          <p className="text-sm leading-relaxed">
            styleDecor is one of the trusted event management company in
            Bangladesh. styleDecor is at your side to make your important
            formal day more beautiful and memorable.
          </p>
        </div>

        {/* Coverage District */}
        <div>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-yellow-500 inline-block"></span>
            Coverage District
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              "Dhaka",
              "Barishal",
              "Khulna",
              "Rajshahi",
              "Chittagong",
              "Mymensingh",
              "Cumillah",
              "Rangpur",
            ].map((district) => (
              <li key={district} className="flex items-center gap-2">
                <span className="w-2 h-2 border border-gray-400 rounded-full"></span>
                {district}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-yellow-500 inline-block"></span>
            Contact Info
          </h3>

          <div className="space-y-4 text-sm">
            <div className="flex gap-3">
              <MdLocationOn className="text-yellow-500 text-xl" />
              <p>
                Dhaka, Bangladesh, 1214
              </p>
            </div>

            <div className="flex gap-3">
              <MdPhone className="text-yellow-500 text-xl" />
              <p>+880 1800000000</p>
            </div>

            <div className="flex gap-3">
              <MdEmail className="text-yellow-500 text-xl" />
              <p>styleDecor@gmail.com</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-yellow-500 inline-block"></span>
            Follow Us
          </h3>

          <div className="flex gap-3">
            <a className="w-10 h-10 border border-green-700 rounded-md flex items-center justify-center hover:bg-green-700 transition">
              <FaXTwitter />
            </a>
            <a className="w-10 h-10 border border-green-700 rounded-md flex items-center justify-center hover:bg-green-700 transition">
              <FaFacebookF />
            </a>
            <a className="w-10 h-10 border border-green-700 rounded-md flex items-center justify-center hover:bg-green-700 transition">
              <FaInstagram />
            </a>
            <a className="w-10 h-10 border border-green-700 rounded-md flex items-center justify-center hover:bg-green-700 transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-10 border-t border-green-900 pt-4">
        © {new Date().getFullYear()} All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
