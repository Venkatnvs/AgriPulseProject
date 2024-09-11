import { fetchDeviceBySearchApi, fetchDevicesApi } from '@/apis/devices';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import PageContainer from '@/components/layout/PageContainer';
import TextHeader from '@/components/PageHeaders/TextHeader';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { BorderBeam } from '@/components/magicui/border-beam';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/themes/theme-provider';
import { useToast } from '@/components/ui/use-toast';
import { EmptyStateIcon } from '@/constants/Icons/icons';

const AnalysisComponent = () => {
  const navigate = useNavigate();
  const [deviceData, setDeviceData] = useState([]);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const { theme } = useTheme();

  const fetchPoint = async () => {
    try {
      const response = await fetchDevicesApi();
      setDeviceData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPoint();
  }, []);

  const handleSearch = async e => {
    setSearch(e.target.value);
    try {
      const res = await fetchDeviceBySearchApi(e.target.value);
      console.log(res.data);
      setDeviceData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

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
      <div className='grid flex-1 gap-4 overflow-auto md:grid-cols-2 lg:grid-cols-4 w-full h-full'>
        {deviceData.map((device, index) => {
          const isConfigured = device.is_configured;
          return (
            <div
              key={index}
              className='relative cursor-pointer flex h-[200px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl'
              onClick={() => {
                isConfigured ? navigate(`/dashboard/analytics/${device.id}`) : (
                  toast({
                    title: 'Warning!',
                    description: 'Device is not configured',
                    variant: 'destructive',
                  })
                );
              }}
            >
              <span className='whitespace-pre-wrap bg-clip-text text-center text-3xl font-semibold leading-none text-transparent bg-slate-700 dark:bg-white'>
                {device?.name}
              </span>
              <BorderBeam size={250} duration={10} delay={8} />
            </div>
          );
        })}
      </div>
      {
        deviceData.length === 0 && (
          <div className="flex items-center justify-center h-96 flex-col">
            <img src={EmptyStateIcon} alt="No Devices found" />
            <p className="text-lg text-gray-500">
              No Devices found for Analytics 📊
            </p>
          </div>
        )
      }
    </>
  );
};

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Analysis', link: '/dashboard/analytics' },
];

const MainAnalytics = () => {
  return (
    <PageContainer scrollable={true}>
      <div className='space-y-2'>
        <Breadcrumbs items={breadcrumbItems} />
        <TextHeader
          title='Analysis'
          description='Select the device to see analysis'
        />
        <AnalysisComponent />
      </div>
    </PageContainer>
  );
};

export default MainAnalytics;
