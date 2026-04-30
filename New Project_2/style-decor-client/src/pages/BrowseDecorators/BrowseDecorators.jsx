import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaStar, FaAward, FaPalette, FaMapMarkerAlt, FaBriefcase, FaSearch } from "react-icons/fa";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const SPECIALTIES = ["All", "Wedding", "Birthday", "Corporate", "Concert", "PhotoBooth"];

const SPECIALTY_COLORS = {
  Wedding:    "bg-pink-100 text-pink-700 border-pink-300",
  Birthday:   "bg-yellow-100 text-yellow-700 border-yellow-300",
  Corporate:  "bg-blue-100 text-blue-700 border-blue-300",
  Concert:    "bg-purple-100 text-purple-700 border-purple-300",
  PhotoBooth: "bg-green-100 text-green-700 border-green-300",
};

const SPECIALTY_ICONS = {
  Wedding:    "💍",
  Birthday:   "🎂",
  Corporate:  "🏢",
  Concert:    "🎤",
  PhotoBooth: "📸",
};

const BrowseDecorators = () => {
  const axiosPublic = useAxiosPublic();
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const { data: decorators = [], isLoading } = useQuery({
    queryKey: ["browse-decorators"],
    queryFn: async () => {
      const res = await axiosPublic.get("/decorators?status=approved");
      return res.data;
    },
  });

  const { data: serviceCenters = [] } = useQuery({
    queryKey: ["service-areas"],
    queryFn: async () => {
      const res = await fetch("/serviceareas.json");
      return res.json();
    },
  });

  const regions = useMemo(() => [...new Set(serviceCenters.map((c) => c.region))], [serviceCenters]);
  const districts = useMemo(() => {
    if (!selectedRegion) return [];
    return [...new Set(serviceCenters.filter((c) => c.region === selectedRegion).map((c) => c.district))];
  }, [serviceCenters, selectedRegion]);

  const filtered = useMemo(() => {
    return decorators.filter((d) => {
      const matchSpecialty = selectedSpecialty === "All" || d.specialty === selectedSpecialty;
      const matchRegion = !selectedRegion || d.region === selectedRegion;
      const matchDistrict = !selectedDistrict || d.district === selectedDistrict;
      const q = search.toLowerCase();
      const matchSearch = !q || d.name?.toLowerCase().includes(q) || d.specialty?.toLowerCase().includes(q) || d.district?.toLowerCase().includes(q);
      return matchSpecialty && matchRegion && matchDistrict && matchSearch;
    });
  }, [decorators, selectedSpecialty, selectedRegion, selectedDistrict, search]);

  const clearFilters = () => {
    setSelectedSpecialty("All");
    setSearch("");
    setSelectedRegion("");
    setSelectedDistrict("");
  };

  const hasFilters = selectedSpecialty !== "All" || search || selectedRegion || selectedDistrict;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#062416] mb-3">
            Browse <span className="text-yellow-500">Decorators</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Find the perfect decorator for your event by specialty, location, and experience
          </p>
        </motion.div>

        {/* Specialty filter chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {SPECIALTIES.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSpecialty(s)}
              className={`px-5 py-2 rounded-full border font-medium text-sm transition-all duration-200 ${
                selectedSpecialty === s
                  ? "bg-[#062416] text-white border-[#062416] shadow-md scale-105"
                  : "bg-white text-gray-600 border-gray-300 hover:border-[#062416] hover:text-[#062416]"
              }`}
            >
              {s !== "All" && <span className="mr-1">{SPECIALTY_ICONS[s]}</span>}
              {s === "All" ? "All Specialties" : s}
            </button>
          ))}
        </div>

        {/* Search + Location filters */}
        <div className="bg-white rounded-2xl shadow p-4 mb-8 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48">
            <label className="label text-xs font-medium">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Name, specialty, district..."
                className="input input-bordered input-sm w-full pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="min-w-36">
            <label className="label text-xs font-medium">Region</label>
            <select
              className="select select-bordered select-sm w-full"
              value={selectedRegion}
              onChange={(e) => { setSelectedRegion(e.target.value); setSelectedDistrict(""); }}
            >
              <option value="">All Regions</option>
              {regions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="min-w-36">
            <label className="label text-xs font-medium">District</label>
            <select
              className="select select-bordered select-sm w-full"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedRegion}
            >
              <option value="">All Districts</option>
              {districts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {hasFilters && (
            <button onClick={clearFilters} className="btn btn-sm btn-outline self-end">
              Clear All
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-[#062416]">{filtered.length}</span> decorator{filtered.length !== 1 ? "s" : ""}
            {selectedSpecialty !== "All" && <span> in <span className="font-semibold">{selectedSpecialty}</span></span>}
            {selectedDistrict && <span> · {selectedDistrict}</span>}
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-[#062416]"></span>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">No decorators found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your filters</p>
            <button onClick={clearFilters} className="btn btn-sm bg-[#062416] text-white">
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Decorator cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((decorator, index) => (
            <motion.div
              key={decorator._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Photo */}
              <div className="relative bg-gradient-to-br from-[#062416] to-[#0a3520] p-1">
                <div className="aspect-square bg-gray-200 overflow-hidden rounded-t-xl">
                  <img
                    src={decorator.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(decorator.name)}&background=random&size=200`}
                    alt={decorator.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute top-3 right-3 bg-yellow-500 text-white p-1.5 rounded-full shadow">
                  <FaAward />
                </div>
                {/* Specialty badge */}
                <div className={`absolute bottom-3 left-3 text-xs font-semibold px-2 py-1 rounded-full border ${SPECIALTY_COLORS[decorator.specialty] || "bg-gray-100 text-gray-600 border-gray-300"}`}>
                  {SPECIALTY_ICONS[decorator.specialty]} {decorator.specialty}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-[#062416] text-lg mb-1 group-hover:text-yellow-600 transition-colors">
                  {decorator.name}
                </h3>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-xs" />
                  ))}
                  <span className="text-xs text-gray-400 ml-1">Verified</span>
                </div>

                <div className="space-y-1.5 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-yellow-500 shrink-0" />
                    <span>{decorator.district}, {decorator.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBriefcase className="text-yellow-500 shrink-0" />
                    <span>{decorator.experience} {decorator.experience === 1 ? "year" : "years"} experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPalette className="text-yellow-500 shrink-0" />
                    <span className="font-medium text-[#062416]">{decorator.specialty} Specialist</span>
                  </div>
                </div>

                {/* Work status */}
                <div className="mt-3">
                  <span className={`badge badge-sm ${decorator.workStatus === "available" ? "badge-success" : "badge-warning"} capitalize`}>
                    {decorator.workStatus || "available"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowseDecorators;
