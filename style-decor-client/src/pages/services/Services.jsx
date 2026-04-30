import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { FaStar, FaClock, FaUsers, FaArrowRight, FaCheckCircle, FaTag, FaSearch } from "react-icons/fa";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Loading from "../../components/Loading";

const CATEGORIES = ["All", "Wedding", "Birthday", "Corporate", "Concert", "PhotoBooth"];

const Services = () => {
  const axiosPublic = useAxiosPublic();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await axiosPublic.get("/services");
      return res.data;
    },
  });

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchCat = activeCategory === "All" ||
        s.category === activeCategory ||
        s.serviceTitle?.toLowerCase().includes(activeCategory.toLowerCase());
      const q = search.toLowerCase();
      const matchSearch = !q || s.serviceTitle?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [services, activeCategory, search]);

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-[#062416] mb-4">
            Our <span className="text-yellow-500">Services</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Explore our comprehensive range of decoration services tailored to make your special moments unforgettable
          </p>
          <div className="flex items-center justify-center gap-8 mt-6 text-sm text-gray-600">
            {["Professional Team", "Quality Materials", "On-Time Delivery"].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category tabs + search */}
        <div className="bg-white rounded-2xl shadow p-4 mb-8">
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#062416] text-white border-[#062416] shadow scale-105"
                    : "bg-white text-gray-600 border-gray-300 hover:border-[#062416] hover:text-[#062416]"
                }`}
              >
                {cat === "All" ? "All Services" : cat}
              </button>
            ))}
          </div>
          <div className="relative max-w-md mx-auto">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search services..."
              className="input input-bordered input-sm w-full pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          Showing <span className="font-semibold text-[#062416]">{filtered.length}</span> service{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "All" && <span> in <span className="font-semibold">{activeCategory}</span></span>}
        </p>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {filtered.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group bg-white w-full max-w-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <figure className="relative h-64 overflow-hidden">
                  <img
                    src={service.images || "https://i.ibb.co/4pDNDk1/default.jpg"}
                    alt={service.serviceTitle}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <FaTag className="text-xs" />
                    {service.category || "Featured"}
                  </div>
                </figure>
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-700"><FaUsers className="text-yellow-500" /><span className="font-semibold">Expert Team</span></div>
                      <div className="flex items-center gap-2 text-gray-700"><FaClock className="text-yellow-500" /><span className="font-semibold">2-3 hrs</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <FaStar key={i} className="text-yellow-500 text-sm" />)}
                  </div>
                  <span className="text-sm text-gray-500 font-semibold">(4.9)</span>
                  <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">Available</span>
                </div>

                <h2 className="text-xl font-bold text-[#062416] mb-3 group-hover:text-yellow-600 transition-colors duration-300 line-clamp-2">
                  {service.serviceTitle}
                </h2>

                {service.description && (
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">{service.description}</p>
                )}

                {service.cost && (
                  <div className="mb-4 border-t pt-4">
                    <p className="text-sm text-gray-500 mb-1">Starting from</p>
                    <p className="text-3xl font-bold text-[#062416]"><span className="text-yellow-600">৳</span> {service.cost}</p>
                  </div>
                )}

                <Link to={`/service/${service._id}`} className="block">
                  <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn">
                    View Details
                    <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold text-[#062416] mb-2">No Services Found</h3>
              <p className="text-gray-600 mb-4">Try a different category or search term</p>
              <button onClick={() => { setActiveCategory("All"); setSearch(""); }} className="btn btn-sm bg-[#062416] text-white">
                Clear Filters
              </button>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-[#062416] to-[#0a3520] rounded-2xl p-8 md:p-12 text-center shadow-2xl"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Need a Custom Package?</h3>
          <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
            Can't find exactly what you're looking for? Our team can create a personalized decoration package tailored to your specific needs and budget.
          </p>
          <Link to="/consultation" className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            Book Free Consultation <FaArrowRight />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
