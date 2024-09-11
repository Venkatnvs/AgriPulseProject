import GradientButtonLink from '@/components/Buttons/GradientButtonLink';
import { SITE_NAME } from '@/constants/BaseAxios';
import { ArrowTopRightIcon, DashboardIcon } from '@radix-ui/react-icons';
import { LogOut } from 'lucide-react';
import React from 'react';

const HeroSection = ({
  isLoggedin,
  handleLogout,
}) => {
  return (
    <section className='relative z-10 text-center pt-5 lg:pt-8 pb-0 px-4 sm:px-4 lg:px-8 min-h-[60vh]'>
      <h1 className='text-4xl sm:text-4xl lg:text-5xl mb-8 lg:mb-10 font-semibold leading-tight'>
        Explore the Possibilities of{' '}<br />
        <span className='ctm_highlight text-[50px] lg:text-[80px] lg:my-2'>Smart Irrigation</span><br /> with <span className='ctm_highlight2 font-oswald'>{SITE_NAME}</span>
      </h1>
      <p className='text-base sm:text-base lg:text-xl max-w-[90%] sm:max-w-[600px] mx-auto mb-8'>
        Unleash the power of smart irrigation to revolutionize water efficiency
        with precise predictions and adaptive watering.
      </p>
      <div className='flex flex-col sm:flex-col lg:flex-row justify-center'>
        <GradientButtonLink 
          href={isLoggedin ? '/dashboard' : '/sign-up'}
          text={isLoggedin ? 'Dashboard' : 'Get Started'}
          Icon={isLoggedin ? ArrowTopRightIcon : null}
        />
        <GradientButtonLink 
          href={isLoggedin ? '/' : '/login'}
          text={isLoggedin ? 'Logout' : 'Login'}
          className="lg:hidden"
          onClick={isLoggedin ? handleLogout : null}
        />
      </div>
    </section>
  );
};

export default HeroSection;
