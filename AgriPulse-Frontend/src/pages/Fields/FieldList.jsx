import React, { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import HeaderWithButton from '@/components/PageHeaders/HeaderWithButton';
import { fetchFieldsApi, fetchFieldsBySearchApi } from '@/apis/fields';
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
import { Badge } from '@/components/ui/badge';
import Meteors from '@/components/magicui/meteors';
import { Input } from '@/components/ui/input';
import { EmptyStateIcon } from '@/constants/Icons/icons';
import { Plus, Trash, TrashIcon } from 'lucide-react';
import DeleteFieldDialog from './components/DeleteFieldDialog';

const FieldListContainer = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);

  const [search, setSearch] = useState('');

  const [selectedField, setSelectedField] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetchFieldsApi();
      console.log(res.data);
      setFields(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async e => {
    setSearch(e.target.value);
    try {
      const res = await fetchFieldsBySearchApi(e.target.value);
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
        icon={<Plus className='mr-2 h-4 w-4' />}
      />

      <div className='flex w-full'>
        <Input
          placeholder='Search fields'
          className='sm:w-2/3 md:w-1/2 lg:w-1/3'
          value={search}
          onChange={handleSearch}
        />
      </div>

      {deleteDialog && (
        <DeleteFieldDialog
          showDelete={deleteDialog}
          setShowDelete={setDeleteDialog}
          selectedField={selectedField}
          fetchData={fetchData}
          setSelectedField={setSelectedField}
        />
      )}

      <div className='grid flex-1 gap-4 overflow-auto md:grid-cols-2 lg:grid-cols-4'>
        {fields.map((field, index) => (
          <Card
            className='relative items-center justify-center max-w-lg overflow-hidden whitespace-nowrap'
            key={index}
          >
            <Meteors number={30} />
            <CardHeader>
              <CardTitle className='text-lg font-semibold'>
                {field.name}
              </CardTitle>
              <Badge className='text-xs' variant='secondary'>
                Created on: {new Date(field.created_at).toLocaleDateString()}
              </Badge>
            </CardHeader>
            <CardContent>
              <img
                src={field?.map_tile_url || FieldSelectImage}
                alt={`Field image for ${field.name}`}
                className='w-50 h-50'
              />
              <div className='flex flex-col gap-2 mt-2'>
                <div className='text-sm'>
                  <strong>Crop Type:</strong> {field.crop_type}
                </div>
                <div className='text-sm'>
                  <strong>Size:</strong> {field.size} acres
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-between gap-3'>
              <Button
                className='text-xs'
                size='sm'
                variant='destructive'
                onClick={() => {
                  setSelectedField(field?.id);
                  setDeleteDialog(true);
                }}
              >
                <TrashIcon className='w-4 h-4' />
              </Button>
              <Button
                className='w-1/2 text-xs'
                size='sm'
                onClick={() => {
                  navigate(`/dashboard/fields/${field.id}`);
                }}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {fields.length === 0 && (
        <div className='flex items-center justify-center h-96 flex-col'>
          <img src={EmptyStateIcon} alt='No fields found' />
          <p className='text-lg text-gray-500'>No fields found</p>
        </div>
      )}
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
