import { MagicCard } from '@/components/magicui/magic-card';
import React from 'react';

const MotorStatusView = ({ id, deviceData, soilMoistureData, threshold }) => {
  const isMotorOn = soilMoistureData?.average_soil_moisture < threshold;

  return (
    <div className='flex flex-col w-full h-full'>
      <h5 className='text-lg md:text-xl font-semibold flex items-center flex-wrap mb-2'>
        Motor Status
      </h5>
      <div className='relative flex flex-col items-center justify-center bg-secondary/50 p-4 rounded-xl w-full min-h-[20vh] shadow-md'>
        <MagicCard
          gradientColor={isMotorOn ? '#00BFFF' : '#D1D1D1'}
          className={`relative shadow-lg rounded-lg p-4 items-start justify-center w-full max-w-md overflow-hidden whitespace-nowrap
            ${isMotorOn ? 
            'bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-600 dark:to-blue-800' 
            : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-800'}
            `}
        >
          <h6 className={`text-lg font-semibold mb-4 ${!isMotorOn && 'text-black'}`}>
            Water Motor Status:
          </h6>
          <div 
            className={`flex justify-center w-full h-10 rounded-full items-center transition-colors duration-1500 ease-in-out ${
              isMotorOn ? 'bg-blue-500 animate-pulse-green dark:bg-blue-900' : 'bg-red-500'
            }`}
          >
            <h5 className={`text-white text-xl font-bold`}>
              {isMotorOn ? 'ON' : 'OFF'}
            </h5>
          </div>
          {isMotorOn && (
            <div className='relative w-full h-3 mt-5 overflow-hidden bg-blue-300 dark:bg-blue-900 rounded-full'>
              <div className='absolute top-0 left-0 w-1/2 h-full bg-blue-500 dark:bg-blue-300 animate-waterFlow'></div>
            </div>
          )}
        </MagicCard>
      </div>
    </div>
  );
};

export default MotorStatusView;
