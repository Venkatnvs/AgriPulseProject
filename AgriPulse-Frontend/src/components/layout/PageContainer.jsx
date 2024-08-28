import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import DashboardLayout from '@/pages/DashBoard/DashboardLayout';

const PageContainer = ({ children, scrollable = false }) => {
  return (
    <DashboardLayout>
      {scrollable ? (
        <ScrollArea className='h-[calc(100dvh-56px)]'>
          <div className='h-full  p-4 md:px-8'>{children}</div>
        </ScrollArea>
      ) : (
        <div className='h-full  p-4 md:px-8'>{children}</div>
      )}
    </DashboardLayout>
  );
};

export default PageContainer;
