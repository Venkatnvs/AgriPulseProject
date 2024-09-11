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
import { ArrowBigRightDashIcon } from 'lucide-react';
import { forgotPassword } from '@/store/actions/authActions';
import formatErrorMessages from '@/lib/formatErrorMessages';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
});

const ForgetPasswordForm = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async data => {
    setLoading(true);
    try {
      const res = await dispatch(forgotPassword(data.email));
      if (res.status === 200) {
        form.reset();
        toast({
          title: 'Success!',
          description: 'Check your email for further instructions',
        });
        setTimeout(() => {
          navigation('/login');
        }, 1000);
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
      form.setValue('email', '');
    }
  };

  return (
    <>
      <div className='flex flex-col space-y-2 text-center mt-10'>
        <h1 className='text-2xl font-semibold tracking-tight'>
          Forgot your password ?
        </h1>
        <p className='text-sm text-muted-foreground'>
          Enter your email address to reset your password
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
          <br />
          {"Don't have an account?"}{' '}
          <Button
            onClick={() => navigation('/sign-up')}
            variant='link'
            className='p-1'
          >
            Sign up
          </Button>
        </p>
    </>
  );
};

export default ForgetPasswordForm;
