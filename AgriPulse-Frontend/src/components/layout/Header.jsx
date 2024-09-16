import React from 'react';
import MobileSidebar from './MobileSidebar';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/themes/theme-toggle';
import UserNavbar from './UserNavbar';
import { Link } from 'react-router-dom';
import { MainLogo } from '@/constants/Images';
import { SITE_NAME } from '@/constants/BaseAxios';

const Header = () => {
  return (
    <header className='sticky inset-x-0 top-0 w-full'>
      <nav className='flex items-center justify-between px-4 py-2 md:justify-end'>
        <div className={cn('lg:!hidden flex-row flex gap-1')}>
          <MobileSidebar />
          <Link to={'/dashboard'}>
            <div className='flex flex-row items-center space-x-0 space-y-0 cursor-pointer'>
              <img src={MainLogo} alt='Logo' className={cn('mr-1 w-8 h-6')} />
              {
                <h2 className='text-xl font-semibold text-pretty text-primary font-oswald'>
                  {SITE_NAME}
                </h2>
              }
            </div>
          </Link>
        </div>
        <div className='flex items-center gap-2'>
          <UserNavbar />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Header;
