import { motion } from 'framer-motion';
import { FaCheckCircle, FaClock, FaDollarSign, FaUserTie, FaTools, FaShieldAlt } from 'react-icons/fa';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaCheckCircle />,
      title: 'Quality Assurance',
      description: 'Premium materials and meticulous attention to detail in every project we undertake.',
    },
    {
      icon: <FaClock />,
      title: 'On-Time Delivery',
      description: 'We respect your schedule and ensure timely completion of all decoration projects.',
    },
    {
      icon: <FaDollarSign />,
      title: 'Competitive Pricing',
      description: 'Transparent pricing with no hidden costs. Get the best value for your investment.',
    },
    {
      icon: <FaUserTie />,
      title: 'Expert Team',
      description: 'Skilled decorators with years of experience in creating stunning event spaces.',
    },
    {
      icon: <FaTools />,
      title: 'Custom Solutions',
      description: 'Tailored decoration packages designed to match your unique vision and theme.',
    },
    {
      icon: <FaShieldAlt />,
      title: 'Trusted Service',
      description: 'Reliable and professional service backed by hundreds of satisfied customers.',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#062416] mb-4">
            Why Choose <span className="text-yellow-500">StyleDecor</span>?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We combine creativity, professionalism, and innovation to deliver exceptional decoration services
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-yellow-500 text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-[#062416] mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
