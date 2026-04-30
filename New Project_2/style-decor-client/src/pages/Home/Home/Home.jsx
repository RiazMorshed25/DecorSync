import { useEffect } from 'react';
import HeroSection from '../HeroSection/HeroSection';
import AboutSection from '../AboutSection/AboutSection';
import TopServices from '../TopServicesSection/TopServices';
import WhyChooseUs from '../WhyChooseUsSection/WhyChooseUs';
import HowItWorks from '../HowItWorksSection/HowItWorks';
import TopDecorators from '../TopDecoratorsSection/TopDecorators';
import Testimonials from '../TestimonialsSection/Testimonials';
import CTASection from '../CTASection/CTASection';

const Home = () => {
  useEffect(() => {
    document.title = "Home - StyleDecor";
  }, []);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <TopServices />
      <WhyChooseUs />
      <HowItWorks />
      <TopDecorators />
      <Testimonials />
      <CTASection />
    </>
  );
};

export default Home;