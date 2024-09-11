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
import { Circle, CircleDot, Delete, Dot, Trash } from 'lucide-react';
import { formatText } from '../scripts/utils';
import { EmptyStateIcon } from '@/constants/Icons/icons';
import DeleteDeviceDialog from './DeleteDeviceDialog';

const DeviceListComponent = () => {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [showDelete, setShowDelete] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

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

  return (
    <>
      <div className='flex w-full'>
        <Input
          placeholder='Search fields'
          className='sm:w-2/3 md:w-1/2 lg:w-1/3'
          value={search}
          onChange={handleSearch}
        />
      </div>

      {
        showDelete && (
          <DeleteDeviceDialog
            showDelete={showDelete}
            setShowDelete={setShowDelete}
            selectedDevice={selectedDevice}
            fetchData={fetchData}
            setSelectedDevice={setSelectedDevice}
            />
        )
      }

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
                <Button
                  variant='destructive'
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDevice(device);
                    setShowDelete(true);
                  }}
                  size='sm'
                  className='p-1 h-7 w-7 m-1 rounded-full inline-flex items-center justify-center absolute top-0 right-0'
                >
                  <Trash 
                    className='h-4 w-4'
                  />
                </Button>
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

      {
        devices.length === 0 && (
          <div className="flex items-center justify-center h-96 flex-col">
            <img src={EmptyStateIcon} alt="No Devices found" />
            <p className="text-lg text-gray-500">No Devices found</p>
          </div>
        )
      }
    </>
  );
};

export default DeviceListComponent;
