import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FaArrowRight, FaPhone, FaEnvelope } from 'react-icons/fa';

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#062416] rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#062416] mb-6">
              Ready to Transform Your Event?
            </h2>
            <p className="text-[#062416] text-lg mb-8 leading-relaxed">
              Let's bring your vision to life! Book a consultation today and discover how StyleDecor 
              can make your special occasion truly unforgettable. Our expert team is ready to create 
              magic for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 bg-[#062416] text-white font-semibold px-8 py-4 rounded-lg hover:bg-[#0a3520] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Book Now
                <FaArrowRight />
              </Link>
              <Link
                to="/consultation"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#062416] font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Free Consultation
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                  <FaPhone className="text-[#062416] text-xl" />
                </div>
                <div>
                  <p className="text-[#062416] text-sm font-semibold">Call Us</p>
                  <p className="text-[#062416] font-bold">+880 1234-567890</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                  <FaEnvelope className="text-[#062416] text-xl" />
                </div>
                <div>
                  <p className="text-[#062416] text-sm font-semibold">Email Us</p>
                  <p className="text-[#062416] font-bold">info@styledecor.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-[#062416] mb-6">Why Book With Us?</h3>
              <ul className="space-y-4">
                {[
                  'Instant online booking & confirmation',
                  'Choose your preferred decorator',
                  'Real-time project tracking',
                  'Secure payment options',
                  'Flexible scheduling options',
                  '24/7 customer support',
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
