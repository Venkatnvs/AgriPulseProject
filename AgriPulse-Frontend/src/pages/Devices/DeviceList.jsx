import { Breadcrumbs } from '@/components/Breadcrumbs';
import PageContainer from '@/components/layout/PageContainer';
import HeaderWithButton from '@/components/PageHeaders/HeaderWithButton';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DeviceListComponent from './components/DeviceListComponent';
import { Plus } from 'lucide-react';

const DeviceListMain = () => {
  const navigate = useNavigate();
  return (
    <>
      <HeaderWithButton
        title='Devices'
        description='List of all devices'
        buttonText='Add Device'
        onClick={() => {
          navigate('/dashboard/devices/create');
        }}
        icon={<Plus className='mr-2 h-4 w-4' />}
      />

      <DeviceListComponent />
    </>
  );
};

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Devices', link: '/dashboard/devices' },
];

const DeviceList = () => {
  return (
    <PageContainer scrollable={true}>
      <div className='space-y-2'>
        <Breadcrumbs items={breadcrumbItems} />
        <DeviceListMain />
      </div>
    </PageContainer>
  );
};

export default DeviceList;
