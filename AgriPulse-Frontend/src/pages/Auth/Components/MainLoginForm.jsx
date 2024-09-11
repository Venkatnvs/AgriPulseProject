import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useDispatch } from 'react-redux';
import { loginUser } from '@/store/actions/authActions';
import { ArrowBigRightDashIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import formatErrorMessages from '@/lib/formatErrorMessages';
import ResendOTPModel from './ResendOTPModel';
import { Eye, EyeOff } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

const MainLoginForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async data => {
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      const res = await dispatch(loginUser(formData));
      if (res.status === 200 || res.status === 201) {
        form.reset();
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in',
        });
        navigate('/dashboard');
      } else {
        throw res?.response?.data || 'An error occurred';
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error!',
        description: formatErrorMessages(error),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      form.setValue('password', '');
    }
  };

  return (
    <>
      <div className='flex flex-col space-y-2 text-center mt-10'>
        <h1 className='text-2xl font-semibold tracking-tight'>
          Welcome back !
        </h1>
        <p className='text-sm text-muted-foreground'>
          Enter your email and password to login
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-2'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Enter your email...'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="id_password">Password</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Enter your password...'
                      disabled={loading}
                      {...field}
                      className='pr-10'
                      id="id_password"
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                      onClick={togglePasswordVisibility}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4 text-muted-foreground' />
                      ) : (
                        <Eye className='h-4 w-4 text-muted-foreground' />
                      )}
                      <span className='sr-only'>
                        {showPassword ? 'Hide password' : 'Show password'}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
                <FormItem className='justify-end flex'>
                  <Button variant='link' className='items-center'>
                    <Link
                      to='/forgot-password'
                      className='text-sm text-muted-foreground'
                    >
                      Forgot password ?
                    </Link>
                  </Button>
                </FormItem>
              </FormItem>
            )}
          />

          <div className='py-2'></div>

          <Button
            type='submit'
            className='w-full'
            disabled={!form.formState.isValid || loading}
          >
            Login to your account{' '}
            <ArrowBigRightDashIcon className='w-5 h-5 ml-2' />
          </Button>
        </form>
      </Form>

      <p className='px-8 text-center text-sm text-muted-foreground'>
        {"Did't verify your email yet?"}{' '}
        <ResendOTPModel>
          <Button variant='link' className='p-1'>
            Verify now
          </Button>
        </ResendOTPModel>
      </p>
    </>
  );
};

export default MainLoginForm;
