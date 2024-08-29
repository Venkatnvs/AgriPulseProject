import React, { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import HeaderWithButton from '@/components/PageHeaders/HeaderWithButton';
import { fetchFieldsApi } from '@/apis/fields';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FieldSelectImage } from '@/constants/Images';

const FieldListContainer = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetchFieldsApi();
      console.log(res.data);
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
      <div className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-4">
      {fields.map((field, index) => (
        <Card className="max-w-lg overflow-hidden" key={index}>
          <CardHeader>
            <CardTitle>{field.name}</CardTitle>
            <CardDescription>Created on: {new Date(field.created_at).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <img 
              src={field?.map_tile_url || FieldSelectImage}
              alt={`Field image for ${field.name}`} 
              className="w-50 h-50"
            />
            <div className="flex flex-col gap-2">
              <div className="text-md"><strong>Crop Type:</strong> {field.crop_type}</div>
              <div className="text-md"><strong>Size:</strong> {field.size} acres</div>
            </div>
          </CardContent>
          <CardFooter >
            <Button>
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
      </div>
    </>
  )
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
