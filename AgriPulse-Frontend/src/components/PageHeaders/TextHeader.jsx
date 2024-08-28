import React from 'react';
import { Heading } from '../ui/Header';
import { Separator } from '../ui/separator';

const TextHeader = ({
    title,
    description,
}) => {
  return (
    <>
      <div className='flex items-start'>
        <Heading title={title} description={description} />
      </div>
      <Separator />
    </>
  );
};

export default TextHeader;
