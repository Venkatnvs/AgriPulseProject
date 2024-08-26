import React, { createContext, useContext, useState } from 'react';

const initialState = {
  signUpCurrentStep: 1,
  forgotPasswordCurrentStep: 1,
  email: '',
  setSignUpCurrentStep: () => {},
  setForgotPasswordCurrentStep: () => {},
  setEmail: () => {},
};

const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
  const [signUpCurrentStep, setSignUpCurrentStep] = useState(
    initialState.signUpCurrentStep,
  );
  const [forgotPasswordCurrentStep, setForgotPasswordCurrentStep] = useState(
    initialState.forgotPasswordCurrentStep,
  );

  const [email, setEmail] = useState(initialState.email);

  const value = {
    signUpCurrentStep,
    forgotPasswordCurrentStep,
    email,
    setSignUpCurrentStep,
    setForgotPasswordCurrentStep,
    setEmail
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
