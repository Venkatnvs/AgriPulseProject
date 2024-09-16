import { Button } from '@/components/ui/button';
import { SITE_NAME } from '@/constants/BaseAxios';
import { MainLogo } from '@/constants/Images';
import ThemeToggle from '@/themes/theme-toggle';
import { LogOut } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPageNavbar = ({
  isLoggedin,
  handleLogout,
  navigate = () => {},
}) => {
  return (
    <header className='lg:flex items-center justify-between p-1 md:p-2 sm:px-1 lg:px-2'>
      <div className='flex items-center justify-between w-full'>
        <div
          className='flex flex-row items-center space-x-1 cursor-pointer'
          onClick={() => navigate('/')}
        >

        <img src={MainLogo} alt='logo' className='max-w-[220px] w-auto h-14' />
        <h2 className='text-3xl font-semibold text-pretty text-primary font-oswald'
        >{SITE_NAME}</h2>
        </div>
        <div className='flex items-end space-x-6'>
          <Link 
            to={isLoggedin ? '/' : '/login'}
            onClick={isLoggedin ? handleLogout : null}
          >
            <Button className='hidden lg:inline-block py-2 px-2 bg-gradient-2 text-center text-white font-semibold rounded-sm transition-transform duration-300 ease-in-out hover:transform hover:translate-y-[-3px]'>
              {isLoggedin ? 'Logout' : 'Login / Sign Up'}
              {
                isLoggedin ? (
                  <LogOut className='h-5 w-5 ml-2 inline-flex' />
                ) : null
              }
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default LandingPageNavbar;
