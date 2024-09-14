import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Leaf,
  Sprout,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { PhoneInput } from '@/components/phone-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import formatErrorMessages from '@/lib/formatErrorMessages';
import { contactUsCreateApi } from '@/apis/contactus';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().refine(isValidPhoneNumber, { message: "Invalid phone number" }).optional(),
  message: z
    .string()
    .min(5, { message: 'Message must be at least 10 characters.' })
    .max(500, { message: 'Message must be at most 500 characters.' }),
});

const ContactForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async data => {
    setLoading(true);
    try {
      const res = await contactUsCreateApi(data);
      if (res.status === 201) {
        setIsSubmitted(true);
        toast({
          title: 'Success',
          description: 'Your message has been sent successfully!',
          status: 'success',
        });
      } else {
        toast({
          title: 'Error',
          description: formatErrorMessages(res.data),
          status: 'error',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: formatErrorMessages(error.response.data),
        status: 'error',
      });
    } finally {
      setLoading(false);
      form.reset();
    }
  };

  return (
    <div className='w-full md:max-w-6xl py-16 overflow-hidden rounded-sm mt-8'>
      <div className='container mx-auto px-4 max-w-2xl'>
        <Card className='shadow-xl'>
          <CardHeader>
            <CardTitle>
              <div className='flex items-center flex-col'>
                <h1 className='mb-4 text-4xl'>
                  <span className='ctm_highlight2'>Contact Us</span>
                </h1>
                {!isSubmitted && (
                  <p className='text-lg font-semibold text-center flex items-center'>
                    <Sprout className='mr-2' /> Get in Touch
                  </p>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='w-full space-y-2'
                  >
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter your name...'
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
                      name='phone'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
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
                      name='message'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Enter your message...'
                              disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className='py-2'></div>

                    <Button type='submit' className='w-full'>
                      Send Message
                    </Button>
                  </form>
                </Form>
              </>
            ) : (
              <div className='text-center text-green-600'>
                <Leaf className='text-5xl mx-auto mb-4' />
                <p className='text-xl font-semibold'>
                  Thank you for your message!
                </p>
                <p className='mt-2'>{"We'll get back to you soon."}</p>

                <Button
                  onClick={() => {
                    navigate('/');
                  }}
                  className='mt-4'
                >
                  Go back to Home
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactForm;
