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
import { useToast } from '@/components/ui/use-toast';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { ArrowBigRightDashIcon, Eye, EyeOff } from 'lucide-react';
import formatErrorMessages from '@/lib/formatErrorMessages';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '@/store/actions/authActions';

const formSchema = z.object({
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

const ResetPasswordForm = () => {
  const { uidb64, token } = useParams();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePassword2Visibility =() => {
    setShowPassword2(!showPassword2);
  }

  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async data => {
    setLoading(true);
    try {
      if (data.password !== data.confirmPassword) {
        toast({
          title: 'Error!',
          description: 'Passwords do not match',
          variant: 'destructive',
        });
        return;
      }
      const res = await dispatch(resetPassword(uidb64, token, data.password));
      if (res.status === 200) {
        form.reset();
        toast({
          title: 'Success !',
          description: 'Password reset successfully, login in',
        });
        setTimeout(() => {
          navigation('/login');
        }, 500);
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
      form.setValue('confirmPassword', '');
    }
  };

  return (
    <>
      <div className='flex flex-col space-y-2 text-center mt-10'>
        <h1 className='text-2xl font-semibold tracking-tight'>
          Reset your password
        </h1>
        <p className='text-sm text-muted-foreground'>
          Enter your new password below
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-3'
        >
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor='id_password'
                >Password</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Enter your password...'
                      disabled={loading}
                      {...field}
                      className='pr-10'
                      id='id_password'
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

          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor='id_password2'
                >Confirm Password</FormLabel>
                <FormControl>
                <div className='relative'>
                    <Input
                      type={showPassword2 ? 'text' : 'password'}
                      placeholder='Enter your password...'
                      disabled={loading}
                      {...field}
                      className='pr-10'
                      id='id_password2'
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                      onClick={togglePassword2Visibility}
                      disabled={loading}
                    >
                      {showPassword2 ? (
                        <EyeOff className='h-4 w-4 text-muted-foreground' />
                      ) : (
                        <Eye className='h-4 w-4 text-muted-foreground' />
                      )}
                      <span className='sr-only'>
                        {showPassword2 ? 'Hide password' : 'Show password'}
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
            type='submit'
            className='w-full'
            loading={loading}
            disabled={!form.formState.isValid || loading}
          >
            Reset password
            <ArrowBigRightDashIcon className='w-5 h-5 ml-2' />
          </Button>
        </form>
      </Form>

      <p className='px-8 text-center text-sm text-muted-foreground'>
        Remember your password?{' '}
        <Button
          onClick={() => navigation('/login')}
          variant='link'
          className='p-1'
        >
          Login
        </Button>
        </p>
    </>
  );
};

export default ResetPasswordForm;
