import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import formatErrorMessages from '@/lib/formatErrorMessages';
import { Input } from '@/components/ui/input';
import { useDispatch } from 'react-redux';
import { sendOtpToEmail } from '@/store/actions/authActions';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuthContext } from '@/context/auth-context';
import { useNavigate } from 'react-router-dom';

const formSchemaForVerifyEmail = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
});

const ResendOTPModel = ({ children }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setEmail, setSignUpCurrentStep } = useAuthContext();
  const navigate = useNavigate();

  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(formSchemaForVerifyEmail),
  });

  const handleVerifyEmail = async data => {
    setLoading(true);
    try {
      const res = await dispatch(sendOtpToEmail(data.email));
      if (res.status === 200 || res.status === 201) {
        form.reset();
        setOpen(false);
        setEmail(data.email);
        setSignUpCurrentStep(2);
        toast({
          title: 'Success!',
          description: 'Verification code sent to your email',
        });
        navigate('/sign-up');
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
    }
  };

  return (
    <Dialog onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Verify your email address</DialogTitle>
          <DialogDescription>
            Enter your email address to receive a verification code
          </DialogDescription>
        </DialogHeader>
        <div className='grid py-4'>
          <div className='grid grid-cols items-center gap-4'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleVerifyEmail)}
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

                <DialogFooter>
                  <Button
                    type='submit'
                    loading={loading}
                    disabled={!form.formState.isValid || loading}
                  >
                    Send verification code
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResendOTPModel;
