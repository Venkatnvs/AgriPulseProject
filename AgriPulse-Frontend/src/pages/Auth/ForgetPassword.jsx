import React from 'react'
import AuthLayout from './AuthLayout'
import ForgetPasswordForm from './Components/ForgetPasswordForm'

const ForgetPassword = () => {
  return (
    <AuthLayout>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <ForgetPasswordForm />
      </div>
    </AuthLayout>
  )
}

export default ForgetPassword