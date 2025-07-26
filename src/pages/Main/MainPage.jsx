import React from 'react';
import HeroSection from './components/HeroSection';
import OurApproach from './components/OurApproach';
import WhyUnschoolingWorks from './components/WhyUnschoolingWorks';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import SubscriptionPlans from './components/SubscriptionPlans';
import FinalCTASection from './components/FinalCTASection';

const MainPage = () => {
  return (
    <div>
      <HeroSection />
      <OurApproach />
      <WhyUnschoolingWorks />
      <HowItWorks />
      <Testimonials />
      <SubscriptionPlans />
      <FinalCTASection />
    </div>
  );
};

export default MainPage;
