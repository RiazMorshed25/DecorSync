import { useQuery } from '@tanstack/react-query'; 
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Loading';
import { FaStar, FaAward, FaEnvelope, FaPalette, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router';

const TopDecorators = () => {
  const { loading } = useAuth(); 
  const axiosSecure = useAxiosSecure();
  
  const {
    data: decorators = [],
    isLoading: decoratorsLoading,
  } = useQuery({
    queryKey: ["topDecorators"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/decorators`);
      return res.data || [];
    },
  });
  
  if (loading || decoratorsLoading) {
    return <Loading />;
  }
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#062416] mb-4">
            Top <span className="text-yellow-500">Decorators</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Meet our talented team of expert decorators ready to bring your vision to life
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {decorators.slice(0, 4).map((decorator, index) => (
            <motion.div
              key={decorator._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-[#062416] to-[#0a3520] p-1">
                <div className="aspect-square bg-gray-200 flex items-center justify-center overflow-hidden rounded-t-xl">
                  <img 
                    src={decorator.photoURL ? decorator.photoURL : 'https://via.placeholder.com/150'} 
                    alt={decorator.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <div className="absolute top-4 right-4 bg-yellow-500 text-white p-2 rounded-full shadow-lg">
                  <FaAward className="text-lg" />
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                  <FaStar className="text-yellow-500 text-sm" />
                  <span className="text-sm font-bold text-[#062416]">4.8</span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-[#062416] mb-1 group-hover:text-yellow-600 transition-colors duration-300">
                      {decorator.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                      <FaCheckCircle />
                      <span>Verified Expert</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaEnvelope className="text-yellow-500 flex-shrink-0" />
                    <span className="truncate">{decorator.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaPalette className="text-yellow-500 flex-shrink-0" />
                    <span className="font-semibold text-[#062416]">{decorator.specialty}</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Projects Completed</span>
                    <span className="font-bold text-[#062416]">150+</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Experience</span>
                    <span className="font-bold text-[#062416]">5+ Years</span>
                  </div>
                </div>

                <button className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {decorators.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 mt-8 text-lg"
          >
            No decorators found.
          </motion.p>
        )}

        {decorators.length > 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mt-12"
          >
          <Link to="/browse-decorators">
            <button className="inline-flex items-center gap-2 bg-[#062416] hover:bg-[#0a3520] text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              View All Decorators
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TopDecorators;
