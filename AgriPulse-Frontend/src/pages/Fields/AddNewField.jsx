import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import TextHeader from '@/components/PageHeaders/TextHeader';
import AddFieldSelection from './components/AddFieldSelection';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Fields', link: '/dashboard/fields' },
  { title: 'Add New Field' },
];

const AddNewFieldChildren = () => {
  return (
    <div>
      <AddFieldSelection />  
    </div>
  );
};

const AddNewField = () => {
  return (
    <PageContainer scrollable={true}>
      <div className='space-y-2'>
        <Breadcrumbs items={breadcrumbItems} />
        <TextHeader title='Add New Field' description='Add a new farm field' />
        <AddNewFieldChildren />
      </div>
    </PageContainer>
  );
};

export default AddNewField;
