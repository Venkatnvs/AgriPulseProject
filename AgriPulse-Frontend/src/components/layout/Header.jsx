import React from 'react';
import MobileSidebar from './MobileSidebar';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/themes/theme-toggle';
import UserNavbar from './UserNavbar';

const Header = () => {
  return (
    <header className='sticky inset-x-0 top-0 w-full'>
      <nav className='flex items-center justify-between px-4 py-2 md:justify-end'>
        <div className={cn('block lg:!hidden')}>
          <MobileSidebar />
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
