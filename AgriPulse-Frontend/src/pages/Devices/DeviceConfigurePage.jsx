import { fetchDeviceApi } from '@/apis/devices';
import { Breadcrumbs } from '@/components/Breadcrumbs'
import PageContainer from '@/components/layout/PageContainer'
import TextHeader from '@/components/PageHeaders/TextHeader';
import { useToast } from '@/components/ui/use-toast';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import DeviceConfigurationPage from './components/DeviceConfigurationPage';

const DeviceConfigurePage = () => {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchDevice = async () => {
    setLoading(true);
    try {
      const res = await fetchDeviceApi(id);
      setDevice(res.data);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error!',
        description: 'Error fetching device',
        variant: 'destructive',
      });
      navigate('/dashboard/devices', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevice();
  }
  , []);

  const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Devices', link: '/dashboard/devices' },
    { title: device?.name || id , link: `/dashboard/devices/${id}` },
    { title: 'Configuration' , link: `/dashboard/devices/${id}/configure` },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className='space-y-2'>
        <Breadcrumbs items={breadcrumbItems} />
        <TextHeader
          title='Configure Device'
          description='Configure your device to connect to your fields' 
        />
        <DeviceConfigurationPage device={device} />
      </div>
    </PageContainer>
  )
}

export default DeviceConfigurePage