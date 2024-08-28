import React from 'react';

import ThreeJsBackGround from '@/components/ThreeJsBackGround';
import LandingPageNavbar from './components/LandingPageNavbar';
import HeroSection from './components/HeroSection';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '@/store/actions/authActions';

const MainHome = () => {
  const { authTokens } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };
  return (
    <div className='lg:w-[90%] max-w-[1400px] mx-auto p-5 h-screen'>
      <ThreeJsBackGround />

      <LandingPageNavbar
        isLoggedin={authTokens?.access ? true : false}
        handleLogout={handleLogout}
      />
      <HeroSection
        isLoggedin={authTokens?.access ? true : false}
        handleLogout={handleLogout}
      />
    </div>
  );
};

export default MainHome;
