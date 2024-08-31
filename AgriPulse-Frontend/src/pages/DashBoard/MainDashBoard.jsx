import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import OverViewCard from './components/OverViewCards';
import { CircuitBoardIcon, Laptop2Icon, MicrochipIcon, RadioTowerIcon } from 'lucide-react';

const MainDashBoardContainer = () => {

  const data = [
    {
      title: 'Total Devices',
      icon: <Laptop2Icon size={24} />,
      amount: '0',
      description: 'Total Devices',
    },
    {
      title: 'Total Fields',
      icon: <CircuitBoardIcon size={24} />,
      amount: '0',
      description: 'Total Fields',
    },
    {
      title: 'Total Sensors',
      icon: <MicrochipIcon size={24} />,
      amount: '0',
      description: 'Total Sensors',
    },
    {
      title: 'Total Readings',
      icon: <RadioTowerIcon size={24} />,
      amount: '0',
      description: 'Total Readings',
    }
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        {data.map((item, index) => (
          <OverViewCard
            key={index}
            title={item.title}
            icon={item.icon}
            amount={item.amount}
            description={item.description}
          />
        ))}
      </div>
    </>
  );
};

const MainDashBoard = () => {
  return (
    <PageContainer scrollable={true}>
      <div className='space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back 👋
          </h2>
        </div>
      </div>
      <MainDashBoardContainer />
    </PageContainer>
  );
};

export default MainDashBoard;
