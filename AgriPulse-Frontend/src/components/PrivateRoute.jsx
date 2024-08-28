import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../store/actions/authActions';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingPage from './LoadingPage';

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const { authTokens, loading, user } = useSelector(state => state.auth);
  const [shouldProceed, setShouldProceed] = useState(false);

  const fetchUserByToken = async () => {
      const res = await dispatch(fetchUser());
      if (res?.error) {
        console.log(res.error);
      }
  };

  useEffect(() => {
    if (authTokens?.access && !user) {
      fetchUserByToken();
    }
  }, [authTokens, user]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShouldProceed(true);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  if (loading || !shouldProceed) {
    return <LoadingPage />;
  }

  if (authTokens?.access && user) {
    return <Outlet />;
  }

  return <Navigate to='/login' replace />;
};

export default PrivateRoute;
