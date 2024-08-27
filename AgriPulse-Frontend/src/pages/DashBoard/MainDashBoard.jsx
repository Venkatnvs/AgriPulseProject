import React from 'react';
import DashboardLayout from './DashboardLayout';
import PageContainer from '@/components/layout/PageContainer';
import FieldSelection from '../Fields/components/FieldSelection';

const MainDashBoard = () => {
  return (
    <DashboardLayout>
      <PageContainer scrollable={true}>
        <div className='space-y-2'>
          <div className='flex items-center justify-between space-y-2'>
            <h2 className='text-2xl font-bold tracking-tight'>
              Hi, Welcome back 👋
            </h2>
          </div>
        </div>
        <FieldSelection />
      </PageContainer>
    </DashboardLayout>
  );
};

export default MainDashBoard;
