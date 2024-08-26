import React from 'react';
import AuthLayout from './AuthLayout';
import MainLoginForm from './Components/MainLoginForm';

const Login = () => {
  return (
    <AuthLayout>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <MainLoginForm />
      </div>
    </AuthLayout>
  );
};

export default Login;
