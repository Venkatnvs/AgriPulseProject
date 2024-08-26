import React, { useEffect, useState } from 'react';
import AuthLayout from './AuthLayout';
import ResetPasswordForm from './Components/ResetPasswordForm';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifyResetPasswordRequest } from '@/store/actions/authActions';
import { useToast } from '@/components/ui/use-toast';
import LoadingPage from '@/components/LoadingPage';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const { toast } = useToast();
  const { uidb64, token } = useParams();
  const [loading, setLoading] = useState(false);

  const checkToken = async () => {
    setLoading(true);
    const res = await dispatch(verifyResetPasswordRequest(uidb64, token));
    console.log(res);
    if (res.status !== 200) {
      console.error('Invalid reset password request');
      toast({
        title: 'Error!',
        description: 'Invalid reset password request',
        variant: 'destructive',
      });
      setTimeout(() => {
        navigation('/forgot-password');
      }, 500);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (uidb64 && token) {
      checkToken();
    }else{
      navigation('/forgot-password');
    }
  }, [dispatch, uidb64, token]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <AuthLayout>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <ResetPasswordForm />
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
