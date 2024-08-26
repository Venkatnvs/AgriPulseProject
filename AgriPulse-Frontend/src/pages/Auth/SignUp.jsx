import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import MainSignupForm from './Components/MainSignupForm';
import OTPForm from './Components/OTPForm';
import { useAuthContext } from '@/context/auth-context';

const SignUp = () => {
  const { signUpCurrentStep } = useAuthContext();
  return (
    <AuthLayout>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        {signUpCurrentStep === 1 ? <MainSignupForm /> : <OTPForm />}
      </div>
    </AuthLayout>
  );
};

export default SignUp;
