import React, { useEffect, useState } from 'react';
import {
  deleteDeviceApi,
  fetchDeviceBySearchApi,
  fetchDevicesApi,
} from '@/apis/devices';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { MagicCard } from '@/components/magicui/magic-card';
import Meteors from '@/components/magicui/meteors';
import { useTheme } from '@/themes/theme-provider';
import { Circle, CircleDot, Dot, Trash } from 'lucide-react';
import { formatText } from '../scripts/utils';

const DeviceListComponent = () => {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { theme } = useTheme();

  const fetchData = async () => {
    try {
      const res = await fetchDevicesApi();
      console.log(res.data);
      setDevices(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async e => {
    setSearch(e.target.value);
    try {
      const res = await fetchDeviceBySearchApi(e.target.value);
      console.log(res.data);
      setDevices(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async id => {
    console.log(id);
  };

  return (
    <>
      <div className='flex w-full'>
        <Input
          placeholder='Search fields'
          className='w-1/2 lg:w-1/3'
          value={search}
          onChange={handleSearch}
        />
      </div>
      <div className='grid flex-1 gap-4 overflow-auto md:grid-cols-2 lg:grid-cols-4 w-full h-full'>
        {devices.map((device, index) => {
          const isConfigured = device.is_configured;
          const bgColor = isConfigured ? 'bg-green-100' : 'bg-red-100';
          const gradientColor = isConfigured
            ? theme === 'dark'
              ? '#00FF00'
              : '#00FF0055'
            : theme === 'dark'
            ? '#FF0000'
            : '#FF000055';

          return (
            <MagicCard
              className={`relative cursor-pointer items-start justify-center max-w-lg overflow-hidden whitespace-nowrap ${bgColor}`}
              key={index}
              gradientColor={gradientColor}
            >
              <Meteors number={30} />
              <CardHeader
                onClick={() => {
                  navigate(`/dashboard/devices/${device.id}`);
                }}
                className='flex justify-between'
              >
                <CardTitle>{device?.name}</CardTitle>
              </CardHeader>
              <CardContent
                onClick={() => {
                  navigate(`/dashboard/devices/${device.id}`);
                }}
              >
                <div className='flex items-center space-x-2'>
                  <CircleDot
                    className={`text-xs ${
                      isConfigured ? 'text-green-500' : 'text-red-500'
                    }`}
                  />
                  <span className='text-sm'>
                    {isConfigured ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
                <div className='mt-2'>
                  <strong>Status:</strong>{' '}
                  {device.is_active ? 'Active' : 'Inactive'}
                </div>
                <div className='mt-2'>
                  <strong>Configurations:</strong>
                  {device.configurations ? (
                    <ul className='list-disc pl-5 mt-1 text-sm'>
                      {Object.entries(device.configurations).map(
                        ([key, value], idx) => (
                          <li key={idx} className='text-sm'>
                            <strong>{formatText(key)}:</strong>{' '}
                            {value?.toString()}
                          </li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <p className='text-sm'>No configurations</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className='flex flex-col gap-2 justify-between'>
                <Badge className='text-xs' variant='secondary'>
                  Created on: {moment(device?.created_at).format('DD MMM YYYY')}
                </Badge>
              </CardFooter>
            </MagicCard>
          );
        })}
      </div>
    </>
  );
};

export default DeviceListComponent;
