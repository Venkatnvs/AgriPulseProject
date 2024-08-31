import { Breadcrumbs } from '@/components/Breadcrumbs'
import PageContainer from '@/components/layout/PageContainer'
import TextHeader from '@/components/PageHeaders/TextHeader';
import React from 'react'
import AddDeviceSelection from './components/AddDeviceSelection';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Devices', link: '/dashboard/devices' },
    { title: 'Add New Device' },
];

const AddNewDeviceChildren = () => {
    return (
        <div>
            <AddDeviceSelection />
        </div>
    )
};

const AddNewDevice = () => {
  return (
    <PageContainer scrollable={true}>
      <div className='space-y-2'>
        <Breadcrumbs items={breadcrumbItems} />
        <TextHeader title='Add New Device' description='Add a new device to connect to your fields' />
        <AddNewDeviceChildren />
      </div>
    </PageContainer>
  )
}

export default AddNewDevice