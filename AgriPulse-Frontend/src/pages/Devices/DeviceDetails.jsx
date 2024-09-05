import { fetchDeviceApi } from '@/apis/devices';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import PageContainer from '@/components/layout/PageContainer';
import LoadingPage from '@/components/LoadingPage';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DetailsofDevice from './components/DetailsofDevice';
import TextHeader from '@/components/PageHeaders/TextHeader';


const DeviceDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [device, setDevice] = useState(null);

  const fetchDevice = async () => {
    setLoading(true);
    try {
      const res = await fetchDeviceApi(id);
      setDevice(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevice();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  if (!device) {
    return <div>Device not found</div>;
  }

  const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Devices', link: '/dashboard/devices' },
    { title: device?.name || id , link: `/dashboard/devices/${id}` },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className='space-y-2'>
        <Breadcrumbs items={breadcrumbItems} />
        <TextHeader
            title={device?.name}
            description={device?.description || 'No description'}
        />
        <DetailsofDevice
            device={device}
            fetchDevice={fetchDevice}
        />
      </div>
    </PageContainer>
  );
};

export default DeviceDetails;
