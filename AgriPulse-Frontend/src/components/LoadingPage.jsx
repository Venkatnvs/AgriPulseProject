import React from 'react';

const LoadingPage = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary'></div>
    </div>
  );
};

export default LoadingPage;
