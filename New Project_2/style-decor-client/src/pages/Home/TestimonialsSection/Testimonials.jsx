import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { useState } from 'react';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Ahmed',
      role: 'Wedding Client',
      image: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      text: 'StyleDecor made our wedding day absolutely magical! The attention to detail and creativity exceeded our expectations. The online booking system was so convenient, and the team was professional throughout.',
    },
    {
      name: 'Karim Rahman',
      role: 'Corporate Event',
      image: 'https://i.pravatar.cc/150?img=13',
      rating: 5,
      text: 'We hired StyleDecor for our annual corporate gala, and they delivered beyond imagination. The decorations were stunning, and the on-site coordination was flawless. Highly recommended!',
    },
    {
      name: 'Nadia Khan',
      role: 'Birthday Party',
      image: 'https://i.pravatar.cc/150?img=5',
      rating: 5,
      text: 'My daughter\'s birthday party was a dream come true thanks to StyleDecor. They understood exactly what we wanted and brought it to life beautifully. The team was friendly and efficient.',
    },
    {
      name: 'Fahim Hossain',
      role: 'Anniversary Celebration',
      image: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      text: 'Exceptional service from start to finish! The consultation was thorough, the pricing was transparent, and the final result was breathtaking. StyleDecor truly cares about their clients.',
    },
  ];

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
            What Our <span className="text-yellow-500">Clients Say</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-[#062416] to-[#0a3520] rounded-2xl p-8 md:p-12 shadow-2xl max-w-4xl mx-auto relative"
          >
            <FaQuoteLeft className="text-yellow-500 text-5xl mb-6 opacity-50" />
            
            <p className="text-white text-lg md:text-xl leading-relaxed mb-8 italic">
              "{testimonials[activeIndex].text}"
            </p>

            <div className="flex items-center gap-4">
              <img
                src={testimonials[activeIndex].image}
                alt={testimonials[activeIndex].name}
                className="w-16 h-16 rounded-full border-4 border-yellow-500"
              />
              <div>
                <h4 className="text-white font-bold text-lg">{testimonials[activeIndex].name}</h4>
                <p className="text-gray-300 text-sm">{testimonials[activeIndex].role}</p>
                <div className="flex gap-1 mt-1">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500 text-sm" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'bg-yellow-500 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {testimonials.map((testimonial, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveIndex(index)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-4 rounded-xl transition-all duration-300 ${
                index === activeIndex
                  ? 'bg-yellow-500 shadow-lg scale-105'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-white"
              />
              <p className={`font-semibold text-sm ${
                index === activeIndex ? 'text-white' : 'text-[#062416]'
              }`}>
                {testimonial.name}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
