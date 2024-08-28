import React from 'react';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Heading } from '../ui/Header';

const HeaderWithButton = ({ title, description, onClick, buttonText }) => {
  return (
    <>
      <div className='flex items-start justify-between'>
        <Heading title={title} description={description} />
        <Button className='text-xs md:text-sm' onClick={() => onClick()}>
          <Plus className='mr-2 h-4 w-4' /> {buttonText}
        </Button>
      </div>
      <Separator />
    </>
  );
};

export default HeaderWithButton;
