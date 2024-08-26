import React from 'react';

import ThreeJsBackGround from '@/components/ThreeJsBackGround';
import LandingPageNavbar from './components/LandingPageNavbar';
import HeroSection from './components/HeroSection';

const MainHome = () => {
  return (
    <div className='lg:w-[90%] max-w-[1400px] mx-auto p-5 h-screen'>
      <ThreeJsBackGround />

      <LandingPageNavbar />
      <HeroSection />
    </div>
  );
};

export default MainHome;
