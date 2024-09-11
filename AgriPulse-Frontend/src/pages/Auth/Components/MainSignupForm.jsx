import React, { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ArrowRightIcon, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { registerUser, sendOtpToEmail } from '@/store/actions/authActions';
import { Link } from 'react-router-dom';
import { useAuthContext } from '@/context/auth-context';
import { useToast } from '@/components/ui/use-toast';
import formatErrorMessages from '@/lib/formatErrorMessages';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { PhoneInput } from '@/components/phone-input';

const formSchema = z.object({
  full_name: z.string().nonempty({ message: 'Full name is required' }),
  phone_number: z
    .string()
    .nonempty({ message: 'Phone number is required' })
    .min(10, { message: 'Phone number must be at least 10 characters' })
    .max(15, { message: 'Phone number must not exceed 15 characters' })
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

const MainSignupForm = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { setEmail, setSignUpCurrentStep } = useAuthContext();
  const { toast } = useToast();

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
      const res = await dispatch(registerUser(data));
      if (res.status === 200 || res.status === 201) {
        form.reset();
        const { email } = data;
        setEmail(email);
        setSignUpCurrentStep(2);
        toast({
          title: 'Success!',
          description: 'Please check your email for a verification code',
        });
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
      <div className='flex flex-col space-y-2 text-center lg:mt-1 mt-8'>
        <h1 className='text-2xl font-semibold tracking-tight'>
          Create an account
        </h1>
        <p className='text-sm text-muted-foreground'>
          Enter your full name, email and password to sign up
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-2'
        >
          <FormField
            control={form.control}
            name='full_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='Enter your full name...'
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
            name='phone_number'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <PhoneInput 
                    placeholder="Enter a phone number"
                    disabled={loading}
                    defaultCountry="IN"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
              </FormItem>
            )}
          />

          <div className='py-2'></div>

          <Button
            disabled={!form.formState.isValid || loading}
            className='w-full'
            type='submit'
          >
            Continue <ArrowRightIcon className='w-5 h-5 ml-2' />
          </Button>
        </form>
      </Form>

      <p className='px-8 text-center text-sm text-muted-foreground'>
        By clicking continue, you agree to our{' '}
        <Link
          href='/terms'
          className='underline underline-offset-4 hover:text-primary'
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href='/privacy'
          className='underline underline-offset-4 hover:text-primary'
        >
          Privacy Policy
        </Link>
        .
      </p>
    </>
  );
};

export default MainSignupForm;
