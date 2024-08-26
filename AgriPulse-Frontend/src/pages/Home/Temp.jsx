import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/store/actions/authActions';

const Temp = () => {
  const { authTokens } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-7xl font-bold mb-20'
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        Welcome to
        <span className='text-primary'> AgriPulse</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-lg font-semibold my-6 text-red-500'
      >
        This page is under construction
      </motion.p>

      {authTokens?.access ? (
        <div className='flex space-x-10'>
          <motion.button
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate('/dashboard')}
            className='bg-primary text-white font-semibold px-6 py-2 rounded-md'
          >
            Go to Dashboard
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => handleLogout()}
            className='px-4 py-2 rounded-md shadow-md bg-white text-primary hover:bg-white/90'
          >
            Logout
          </motion.button>
        </div>
      ) : (
        <div className='flex space-x-10'>
          <motion.button
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className='px-4 py-2 rounded-md shadow-md bg-primary text-white hover:bg-primary-2'
            onClick={() => {
              navigate('/sign-up');
            }}
          >
            Sign Up
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className='px-4 py-2 rounded-md shadow-md bg-white text-primary hover:bg-white/90'
            onClick={() => {
              navigate('/login');
            }}
          >
            Login
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default Temp;
