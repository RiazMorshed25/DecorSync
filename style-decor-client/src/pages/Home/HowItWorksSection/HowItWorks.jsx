import { motion } from 'framer-motion';
import { FaCalendarAlt, FaComments, FaCreditCard, FaPalette } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaCalendarAlt />,
      title: 'Book Appointment',
      description: 'Choose your preferred date, time, and service type. Select from studio consultation or on-site service.',
      step: '01',
    },
    {
      icon: <FaComments />,
      title: 'Consultation',
      description: 'Meet with our expert decorators to discuss your vision, theme, and requirements in detail.',
      step: '02',
    },
    {
      icon: <FaCreditCard />,
      title: 'Secure Payment',
      description: 'Make a secure online payment for your chosen package. Transparent pricing with no hidden fees.',
      step: '03',
    },
    {
      icon: <FaPalette />,
      title: 'Decoration Magic',
      description: 'Our team brings your vision to life. Track progress in real-time through your dashboard.',
      step: '04',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-[#062416] to-[#0a3520] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It <span className="text-yellow-500">Works</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Simple, transparent, and efficient process to make your event decoration hassle-free
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-[#062416] text-lg shadow-lg">
                  {step.step}
                </div>
                
                <div className="text-yellow-500 text-5xl mb-4 mt-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path d="M5 15L25 15M25 15L18 8M25 15L18 22" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
