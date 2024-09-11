import React, { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import OverViewCard from './components/OverViewCards';
import {
  CircuitBoardIcon,
  Laptop2Icon,
  MicrochipIcon,
  RadioTowerIcon,
} from 'lucide-react';
import {
  fetchDashBoardCardCounts,
  fetchDashBoardGraphData,
} from '@/apis/dashboard';
import CalendarDateRangePicker from '@/components/date-range-picker';
import moment from 'moment';
import BarAverageGraph from './components/charts/BarAverageGraph';
import AreaGraphByDeviceAndFields from './components/charts/AreaGraphByDeviceAndFields';
import PieChartForCropType from './components/charts/PieChartForCropType';
import { NoDataFoundIcon } from '@/constants/Icons/icons';

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

  const [chartData, setChartData] = useState([]);

  const [date, setDate] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  const fetchCountData = async (from = date.from, to = date.to) => {
    try {
      const res = await fetchDashBoardCardCounts(
        moment(from).format('YYYY-MM-DD'),
        moment(to).add(1, 'days').format('YYYY-MM-DD'),
      );
      if (res.status == 200) {
        setCountData(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchGraphData = async (from = date.from, to = date.to) => {
    try {
      const res = await fetchDashBoardGraphData(
        moment(from).format('YYYY-MM-DD'),
        moment(to).add(1, 'days').format('YYYY-MM-DD'),
      );
      if (res.status == 200) {
        console.log(res?.data);
        setChartData(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateChange = changeDate => {
    setDate(changeDate);
    fetchCountData(changeDate?.from, changeDate?.to);
    fetchGraphData(changeDate?.from, changeDate?.to);
  };

  useEffect(() => {
    fetchCountData();
    fetchGraphData();
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
              handleDateChange={handleDateChange}
              date={date}
            />
          </div>
        </div>
      </div>
      <MainDashBoardContainer
        countData={countData}
        setCountData={setCountData}
        fetchCountData={fetchCountData}
      />
      <div className='flex items-center justify-between space-y-2'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7 mt-5'>
          <div className='col-span-full'>
            {chartData?.chart1 && (
              <BarAverageGraph chartData={chartData?.chart1} />
            )}
          </div>
          <div className='col-span-4'>
            {chartData?.chart2 && (
              <AreaGraphByDeviceAndFields chartData={chartData?.chart2} />
            )}
          </div>
          <div className='col-span-4 md:col-span-3'>
            {chartData?.chart3 && (
              <PieChartForCropType chartData={chartData?.chart3} />
            )}
          </div>
        </div>
      </div>
      {!chartData?.chart1 && !chartData?.chart2 && !chartData?.chart3 && (
        <div className='flex items-center justify-center h-80 w-full flex-col gap-2'>
          <img
            src={NoDataFoundIcon}
            alt='No Data'
            className='h-52 w-52 object-cover'
          />
          <p className='text-lg text-gray-500'>
            No Data Found for the selected date range 📅 to show Details
          </p>
        </div>
      )}
    </PageContainer>
  );
};

export default MainDashBoard;
