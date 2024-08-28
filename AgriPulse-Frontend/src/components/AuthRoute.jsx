import { AuthProvider } from '@/context/auth-context';
import { fetchUser } from '@/store/actions/authActions';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingPage from './LoadingPage';

const AuthRoute = () => {
  const dispatch = useDispatch();
  const { authTokens, loading, user } = useSelector(state => state.auth);

  if (loading) {
    return <LoadingPage />;
  }

  if (authTokens?.access && user) {
    return <Navigate to='/dashboard' replace={true} />;
  }

  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default AuthRoute;
