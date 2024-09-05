import React from 'react';
import MainMapView from './DetailedAnalysis/MainMapView';
import { Button } from '@/components/ui/button';
import SoilMoisture from './DetailedAnalysis/SoilMoisture';

const DetailedAnalysisComponent = ({
  deviceData,
  fetchAnalysisData = () => {},
  id,
}) => {
  return (
    <section className='flex flex-col gap-8 w-full h-full'>
      <div className='w-full h-full'>
        {!deviceData?.fields_data ? (
          <div className='flex flex-col items-center justify-center min-h-[60vh] bg-secondary/50 p-3 rounded-lg w-full'>
            <p className='text-2xl font-semibold text-gray-500'>
              No fields data found
            </p>
            <Button onClick={fetchAnalysisData} className='mt-4'>
              Refresh
            </Button>
          </div>
        ) : (
          <div className='relative flex flex-col items-start bg-secondary/50 p-3 rounded-xl w-full min-h-[60vh]'>
            <h5 className='text-l font-semibold mb-4'>
              All Fields For this Device
            </h5>
            <div className='w-full h-[60vh] z-0'>
              <MainMapView fieldDetails={deviceData?.fields_data} />
            </div>
          </div>
        )}
      </div>

      <div className='w-full flex flex-col'>
          <SoilMoisture
            id={id}
            deviceData={deviceData}
          />
      </div>
    </section>
  );
};

export default DetailedAnalysisComponent;
