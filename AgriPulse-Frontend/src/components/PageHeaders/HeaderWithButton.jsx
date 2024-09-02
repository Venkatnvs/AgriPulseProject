import React from 'react';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Heading } from '../ui/Header';

const HeaderWithButton = ({ title, description, onClick, buttonText, icon }) => {
  return (
    <>
      <div className='flex items-start justify-between'>
        <Heading title={title} description={description} />
        <Button className='text-xs md:text-sm' onClick={() => onClick()}>
          {icon && icon} {buttonText}
        </Button>
      </div>
      <Separator />
    </>
  );
};

export default HeaderWithButton;
