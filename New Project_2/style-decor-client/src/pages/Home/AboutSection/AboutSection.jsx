import { motion } from 'framer-motion';
import { FaPaintBrush, FaUsers, FaAward, FaHeart } from 'react-icons/fa';

const AboutSection = () => {
  const stats = [
    { icon: <FaUsers />, number: '500+', label: 'Happy Clients' },
    { icon: <FaPaintBrush />, number: '1000+', label: 'Events Decorated' },
    { icon: <FaAward />, number: '50+', label: 'Expert Decorators' },
    { icon: <FaHeart />, number: '100%', label: 'Satisfaction Rate' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#062416] mb-6">
              About <span className="text-yellow-500">StyleDecor</span>
            </h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              StyleDecor is your trusted partner in creating unforgettable moments. We specialize in 
              transforming ordinary spaces into extraordinary experiences for weddings, birthdays, 
              corporate events, and special celebrations.
            </p>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              With years of expertise and a team of passionate decorators, we bring your vision to life 
              with creativity, precision, and attention to detail. From intimate gatherings to grand 
              celebrations, we handle every aspect of decoration with professionalism and care.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our innovative online booking system makes it easy to schedule consultations, choose your 
              preferred decorator, and track your project from start to finish. Experience hassle-free 
              event planning with StyleDecor.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#062416] to-[#0a3520] rounded-xl p-6 text-center shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="text-yellow-500 text-4xl mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{stat.number}</h3>
                <p className="text-gray-300 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
