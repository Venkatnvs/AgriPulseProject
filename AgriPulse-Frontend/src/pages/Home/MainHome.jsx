import React, { useEffect, useState } from 'react';
import ThreeJsBackGround from '@/components/ThreeJsBackGround';
import LandingPageNavbar from './components/LandingPageNavbar';
import HeroSection from './components/HeroSection';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '@/store/actions/authActions';
import AgriLinks from './components/AgriLinks';
import { ScrollArea } from '@/components/ui/scroll-area';
import Footer from './components/Footer';

const MainHome = () => {
  const { authTokens } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [scrolled, setScrolled] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };
  return (
    <ScrollArea className='relative h-screen'
      onScrollCapture={(event) => {
        if (event.target.scrollTop > 10) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      }}
    >
      <ThreeJsBackGround />

      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-primary-foreground/90 shadow-md dark:bg-black/90' : 'bg-transparent p-5'
        }`}
      >
        <div className='lg:w-[90%] max-w-[1400px] mx-auto'>
          <LandingPageNavbar
            isLoggedin={authTokens?.access ? true : false}
            handleLogout={handleLogout}
            navigate={navigate}
          />
        </div>
      </div>

      <div className='lg:w-[90%] max-w-[1400px] mx-auto p-5'>
        <div
          className={`flex flex-col justify-center items-center h-[calc(100vh-64px)]`}
        >
          <HeroSection
            isLoggedin={authTokens?.access ? true : false}
            handleLogout={handleLogout}
          />
        </div>

        <div className='flex flex-col justify-center items-center min-h-screen'>
          <AgriLinks />
        </div>

      </div>
      <Footer />
    </ScrollArea>
  );
};

export default MainHome;
