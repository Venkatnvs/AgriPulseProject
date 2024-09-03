import React, { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import OverViewCard from './components/OverViewCards';
import {
  CircuitBoardIcon,
  Laptop2Icon,
  MicrochipIcon,
  RadioTowerIcon,
} from 'lucide-react';
import { fetchDashBoardCardCounts } from '@/apis/dashboard';
import CalendarDateRangePicker from '@/components/date-range-picker';
import moment from 'moment';

const MainDashBoardContainer = ({
  countData,
  setCountData,
  fetchCountData,
}) => {
  const data = [
    {
      title: 'Total Devices',
      icon: <Laptop2Icon size={24} className='text-primary' />,
      amount: countData.devices,
      description: 'Total Devices',
    },
    {
      title: 'Total Fields',
      icon: <CircuitBoardIcon size={24} className='text-primary' />,
      amount: countData.fields,
      description: 'Total Fields',
    },
    {
      title: 'Total Sensors',
      icon: <MicrochipIcon size={24} className='text-primary' />,
      amount: countData.sensors,
      description: 'Total Sensors',
    },
    {
      title: 'Total Readings',
      icon: <RadioTowerIcon size={24} className='text-primary' />,
      amount: countData.sensors_readings,
      description: 'Total Readings',
    },
  ];

  return (
    <>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4'>
        {data.map((item, index) => (
          <OverViewCard
            key={index}
            title={item.title}
            icon={item.icon}
            amount={item.amount}
            // description={item.description}
          />
        ))}
      </div>
    </>
  );
};

const MainDashBoard = () => {
  const [countData, setCountData] = useState({
    devices: 0,
    fields: 0,
    sensors: 0,
    sensors_readings: 0,
  });

  const startDate = new Date(new Date().setDate(new Date().getDate() - 30));
  const endDate = new Date();

  const fetchCountData = async (from = startDate, to = endDate) => {
    try {
      const res = await fetchDashBoardCardCounts(
        moment(from).format('YYYY-MM-DD'),
        moment(to).format('YYYY-MM-DD'),
      );
      if (res.status == 200) {
        setCountData(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateChange = changeDate => {
    fetchCountData(changeDate?.from, changeDate?.to);
  };

  useEffect(() => {
    fetchCountData();
  }, []);

  return (
    <PageContainer scrollable={true}>
      <div className='space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back 👋
          </h2>
          <div className='hidden items-center space-x-2 md:flex lg:flex'>
            <CalendarDateRangePicker
              enddate={endDate}
              startdate={startDate}
              handleDateChange={handleDateChange}
            />
          </div>
        </div>
      </div>
      <MainDashBoardContainer
        countData={countData}
        setCountData={setCountData}
        fetchCountData={fetchCountData}
      />
    </PageContainer>
  );
};

export default MainDashBoard;
