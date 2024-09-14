import ThreeJsBackGround from '@/components/ThreeJsBackGround';
import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useState } from 'react';
import LandingPageNavbar from '../Home/components/LandingPageNavbar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '@/store/actions/authActions';
import ContactForm from './components/ContactForm';
import Footer from '../Home/components/Footer';

const MainContactUs = () => {
  const { authTokens } = useSelector(state => state.auth);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };
  return (
    <ScrollArea
      className='relative h-screen'
      onScrollCapture={event => {
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
          scrolled
            ? 'bg-primary-foreground/90 shadow-md dark:bg-black/90'
            : 'bg-transparent p-5'
        }`}
      >
        <div className='lg:w-[90%] max-w-[1400px] mx-auto'>
          <LandingPageNavbar
            isLoggedin={authTokens?.access ? true : false}
            handleLogout={handleLogout}
          />
        </div>
      </div>

      <div className='lg:w-[90%] max-w-[1400px] mx-auto mt-5'>
        <div
          className={`flex flex-col justify-center items-center h-full`}
        >
          <ContactForm />
        </div>
      </div>
      <Footer />
    </ScrollArea>
  );
};

export default MainContactUs;
