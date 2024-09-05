import {
  fetchDeviceSensorsApi,
  fetchLatestDeviceSensorsApi,
} from '@/apis/sensors';
import { MagicCard } from '@/components/magicui/magic-card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/themes/theme-provider';
import { ReloadIcon } from '@radix-ui/react-icons';
import { MessageCircleWarningIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const SoilMoisture = ({ id, deviceData }) => {
  const [soilMoistureData, setSoilMoistureData] = useState([]);
  const { theme } = useTheme();

  const fetchSoilMoistureData = async () => {
    try {
      const res = await fetchLatestDeviceSensorsApi(id);
      console.log(res.data);
      setSoilMoistureData(res.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSoilMoistureData();
  }, []);

  // Get data from the API every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSoilMoistureData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className='flex items-center justify-between mb-3'>
        <h5 className='text-xl font-semibold'>
          Sensor Data Cards
          <div className='w-3 h-3 bg-red-500 rounded-full blob animate-pulse-red inline-block ml-2' />
          <span className='ml-1 text-sm font-normal'>Live</span>
        </h5>
        <div className='flex items-center justify-center gap-2 text-sm'>
          <Button onClick={fetchSoilMoistureData} variant='secondary' size='sm'>
            <ReloadIcon className='w-5 h-5 mr-2' />
            Refresh Data
          </Button>
          last updated at {new Date().toLocaleTimeString()}
        </div>
      </div>
      {soilMoistureData?.soil_moisture?.s1 === undefined && (
        <p className='inline-flex items-center gap-2 text-sm text-red-500'>
          <MessageCircleWarningIcon className='w-5 h-5 mr-2' />
          Warning: Data is not beeing recived from the sensors
        </p>
      )}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {Array(deviceData?.configurations?.soil_sensors_count)
          .fill(0)
          .map((_, index) => {
            const SMData =
              soilMoistureData?.soil_moisture?.[`s${index + 1}`] || 0;
            const bgColor = SMData >= 50 ? 'bg-green-100' : 'bg-red-100';
            const darkBgColor =
              SMData >= 50 ? 'dark:bg-green-800' : 'dark:bg-red-800';
            const gradientColor =
              SMData >= 50
                ? theme === 'dark'
                  ? '#00FF00'
                  : '#00FF0055'
                : theme === 'dark'
                ? '#FF0000'
                : '#FF000055';
            return (
              <MagicCard
                key={index}
                gradientColor={gradientColor}
                className={`relative shadow-sm rounded-lg p-2 items-start justify-center max-w-lg overflow-hidden whitespace-nowrap ${bgColor} ${darkBgColor}`}
              >
                <h6 className='text-md font-semibold mb-2'>
                  Sensor {index + 1}
                </h6>
                <p>
                  <span className=''>Soil Moisture:</span>{' '}
                  {soilMoistureData?.soil_moisture?.[`s${index + 1}`] || 'N/A'}
                </p>
              </MagicCard>
            );
          })}
      </div>
    </>
  );
};

export default SoilMoisture;
