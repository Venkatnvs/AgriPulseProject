import React from 'react';
import { CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';

const FieldDataDetails = ({ data }) => {
  return (
    <>
      <CardContent>
        <div className='flex flex-col flex-wrap p-3 gap-2'>
          <div className='flex flex-row text-lg'>
            <span className='text-gray-500'>Field Name:</span>
            <h3 className='ml-2'>{data?.name}</h3>
          </div>
          <div className='flex flex-row text-lg'>
            <span className='text-gray-500'>Description:</span>
            <h3 className='ml-2'>{data?.description || '-'}</h3>
          </div>
          <div className='flex flex-row text-lg'>
            <span className='text-gray-500'>Area:</span>
            <h3 className='ml-2'>{data?.size} ha</h3>
          </div>
          <div className='flex flex-row text-lg'>
            <span className='text-gray-500'>Crop:</span>
            <Badge className='ml-2'>{data?.crop_type}</Badge>
          </div>
          <div className='flex flex-row text-lg'>
            <span className='text-gray-500'>Coordinates:</span>
            <h3 className='ml-2'>
              {data?.main_coordinate?.[1]}, {data?.main_coordinate?.[0]}
            </h3>
          </div>
          <div className='flex flex-row text-lg'>
            <span className='text-gray-500'>Created:</span>
            <Badge variant={'outline'} className='ml-2'>{moment(data?.created_at).format('lll')}</Badge>
          </div>
          <div className='flex flex-row text-lg'>
            <span className='text-gray-500'>Modified:</span>
            <Badge variant={'outline'} className='ml-2'>{moment(data?.modified_at).format('lll')}</Badge>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default FieldDataDetails;
