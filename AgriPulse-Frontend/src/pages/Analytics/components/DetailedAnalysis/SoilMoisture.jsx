import { changeCropTypeApi, fetchCropsDataApi } from '@/apis/fields/other';
import {
  fetchDeviceSensorsApi,
  fetchLatestDeviceSensorsApi,
} from '@/apis/sensors';
import { MagicCard } from '@/components/magicui/magic-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import formatErrorMessages from '@/lib/formatErrorMessages';
import { useTheme } from '@/themes/theme-provider';
import { ReloadIcon } from '@radix-ui/react-icons';
import { MessageCircleWarningIcon } from 'lucide-react';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LoadingPage from '@/components/LoadingPage';
import MotorStatusView from './MotorStatusView';

const SoilMoisture = ({ id, deviceData }) => {
  const [soilMoistureData, setSoilMoistureData] = useState([]);
  const { theme } = useTheme();
  const [cropsData, setCropsData] = useState([]);
  const [threshold, setThreshold] = useState(50);
  const { toast } = useToast();

  const [selectedCrop, setSelectedCrop] = useState(
    deviceData?.fields_data?.[0]?.crop_type || 'Change the crop type',
  );

  useEffect(() => {
    if (deviceData?.fields_data?.[0]?.crop_type) {
      setSelectedCrop(deviceData.fields_data[0].crop_type);
    }
  }, [deviceData]);

  const fetchSoilMoistureData = async () => {
    try {
      const res = await fetchLatestDeviceSensorsApi(id);
      console.log(res.data);
      setSoilMoistureData(res.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCropsData = async () => {
    try {
      const res = await fetchCropsDataApi();
      console.log(res.data);
      setCropsData(res.data);
    } catch (error) {
      console.error(error?.response?.data);
      toast({
        title: 'Error!',
        description: formatErrorMessages(error?.response?.data),
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchSoilMoistureData();
    fetchCropsData();
  }, []);

  // Get data from the API every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSoilMoistureData();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const changeCropType = async (id, data) => {
    try {
      const res = await changeCropTypeApi(id, data);
      if (res.status === 200) {
        fetchDeviceSensorsApi(id);
        toast({
          title: 'Success!',
          description: 'Crop type changed successfully',
        });
      }
    } catch (error) {
      console.error(error?.response?.data);
      toast({
        title: 'Error!',
        description: formatErrorMessages(error?.response?.data),
        variant: 'destructive',
      });
    }
  };
  return (
    <>
      <div className='space-y-4 md:space-y-0 md:flex md:items-center md:justify-between mb-4'>
        <div className='space-y-2 md:space-y-0'>
          <h5 className='text-lg md:text-xl font-semibold flex items-center flex-wrap'>
            Sensor Data Cards
            {deviceData?.configurations?.soil_sensors_count === undefined && (
              <span className='text-red-500 text-sm md:text-base ml-2'>
                {' '}
                (No sensor data available)
              </span>
            )}
            {soilMoistureData &&
              Date.now() - new Date(soilMoistureData.timestamp).getTime() <
                120000 && (
                <div className='flex items-center ml-2'>
                  <div className='w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full animate-pulse-red' />
                  <span className='ml-1 text-xs md:text-sm font-normal'>
                    Live
                  </span>
                </div>
              )}
          </h5>
        </div>

        <div className='mt-2 md:mt-0'>
          <Select
            onValueChange={value => {
              if (value === 'other') {
                setThreshold(50);
              } else {
                const crop = cropsData.find(crop => crop.name === value);
                setThreshold(crop.avg_brack_point);
              }
              changeCropType(id, { crop_type: value });
              setSelectedCrop(value);
            }}
            value={selectedCrop}
          >
            <SelectTrigger className='w-full md:w-52'>
              <SelectValue placeholder='Change the crop type' />
            </SelectTrigger>
            <SelectContent className='max-h-[40vh] overflow-y-auto min-h-[150px]'>
              {cropsData.map((crop, index) => (
                <SelectItem key={index} value={crop.name}>
                  {crop.name[0].toUpperCase() + crop.name.slice(1)}
                  {' - '}
                  {crop.avg_brack_point}
                </SelectItem>
              ))}
              <SelectItem value='other'>Default - 50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex flex-col md:flex-row items-start md:items-center justify-start md:justify-center gap-2 text-xs md:text-sm mt-2 md:mt-0'>
          <Button
            onClick={fetchSoilMoistureData}
            variant='secondary'
            size='sm'
            className='p-1 w-full md:w-auto'
          >
            <ReloadIcon className='w-4 h-4 md:w-5 md:h-5 mr-2' />
            <span className='inline-flex items-center gap-1'>Refresh</span>
          </Button>
          <div className='flex flex-col md:flex-row items-start md:items-center gap-1 w-full md:w-auto'>
            <span>last updated at:</span>
            <Badge className='font-semibold text-xs md:text-sm w-full md:w-auto text-center'>
              {(soilMoistureData &&
                moment(soilMoistureData.timestamp).format(
                  'MMM Do YYYY, h:mm:ss a',
                )) ||
                'N/A'}
            </Badge>
          </div>
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
            const bgColor = SMData >= threshold ? 'bg-green-200' : 'bg-red-200';
            const darkBgColor =
              SMData >= threshold ? 'dark:bg-green-800' : 'dark:bg-red-800';
            const gradientColor =
              SMData >= threshold
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

      <div className='w-full flex flex-col mt-5'>
        <MotorStatusView
          id={id}
          deviceData={deviceData}
          soilMoistureData={soilMoistureData}
          threshold={threshold}
        />
      </div>
    </>
  );
};

export default SoilMoisture;
