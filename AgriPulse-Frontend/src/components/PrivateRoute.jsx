import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../store/actions/authActions';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingPage from './LoadingPage';

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const { authTokens, loading, user } = useSelector(state => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  if (loading) {
    return <LoadingPage />;
  }

  return authTokens?.access && user ? (
    <Outlet />
  ) : (
    <Navigate to='/login' replace={true} />
  );
};

export default PrivateRoute;
