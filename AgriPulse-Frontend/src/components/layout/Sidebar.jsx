import { MainIconLogo, MainLogo } from '@/constants/Images';
import useSidebar from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import DashBoardNav from './DashBoardNav';
import { navItems } from '@/constants/SidebarLinks';

const Sidebar = ({ className }) => {
  const { isMinimized, toggle } = useSidebar();
  const handleToggle = () => {
    toggle();
  };
  return (
    <aside
      className={cn(
        `relative  hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`,
        !isMinimized ? 'w-72' : 'w-[72px]',
        className,
      )}
    >
      <div className='hidden p-5 pt-10 lg:block'>
        <Link href={'/dashboard'} target='_blank'>
        <img
          src={isMinimized ? MainIconLogo : MainLogo}
          alt='Logo'
          className={cn('mr-2 w-30 h-14'
            , isMinimized && 'w-10 h-10')}
        />
        </Link>
      </div>
      <ChevronLeft
        className={cn(
          'absolute -right-3 top-10 z-50  cursor-pointer rounded-full border bg-background text-3xl text-foreground',
          isMinimized && 'rotate-180',
        )}
        onClick={handleToggle}
      />
      <div className='space-y-4 py-4'>
        <div className='px-3 py-2'>
          <div className='mt-3 space-y-1'>
            <DashBoardNav items={navItems} />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
