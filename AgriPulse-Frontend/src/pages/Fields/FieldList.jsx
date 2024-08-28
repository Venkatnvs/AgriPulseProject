import React, { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import HeaderWithButton from '@/components/PageHeaders/HeaderWithButton';
import { fetchFieldsApi } from '@/apis/fields';
import { useNavigate } from 'react-router-dom';

const FieldListContainer = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetchFieldsApi();
      setFields(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <HeaderWithButton
        title='Fields'
        description='List of all fields'
        buttonText='Add Field'
        onClick={() => {
          navigate('/dashboard/fields/create');
        }}
      />

      {/* Display fields using Shadcn Ui in the form of list */}

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {fields?.map(field => (
          <div key={field.id} className='p-4 bg-white shadow-md rounded-md'>
            <div className='flex justify-between items-center'>
              <h3 className='text-lg font-semibold'>{field.name}</h3>
              <span className='text-sm text-gray-500'>{field.area} acres</span>
            </div>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>{field.location}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Fields', link: '/dashboard/fields' },
];

const FieldList = () => {
  return (
    <PageContainer scrollable={true}>
      <div className='space-y-2'>
        <Breadcrumbs items={breadcrumbItems} />
        <FieldListContainer />
      </div>
    </PageContainer>
  );
};

export default FieldList;
