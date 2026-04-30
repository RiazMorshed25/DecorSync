import { motion } from 'framer-motion';
import { Link } from 'react-router'; 

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-green-600 to-yellow-500 min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-[url('/path/to/hero-bg.jpg')] bg-cover bg-center opacity-50"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Make Your Events Unforgettable
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-white mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Professional decorators for weddings, birthdays, corporate events & more!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link
            to="/services"
            className="inline-block bg-yellow-500 text-black font-semibold py-4 px-10 rounded-full text-xl hover:bg-purple-100 transition transform hover:scale-105 shadow-lg"
          >
            Explore Our Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;