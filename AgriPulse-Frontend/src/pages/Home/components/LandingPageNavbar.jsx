import { Button } from '@/components/ui/button';
import { MainLogo } from '@/constants/Images';
import ThemeToggle from '@/themes/theme-toggle';
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPageNavbar = () => {
  return (
    <header className='lg:flex items-center justify-between pb-5 pt-2 px-2 sm:px-1 lg:px-2'>
      <div className='flex items-center justify-between w-full'>
        <img src={MainLogo} alt='logo' className='max-w-[200px] w-auto h-12' />
        <div className='flex items-end space-x-6'>
          <Link to='/login'>
            <Button className='hidden lg:inline-block py-2 px-2 bg-gradient-2 text-center text-white font-semibold rounded-sm transition-transform duration-300 ease-in-out hover:transform hover:translate-y-[-3px]'>
              Login / Sign Up
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default LandingPageNavbar;
