import { LinkUnlinkIcon } from '@/constants/Icons/icons';
import React, { useEffect, useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { MultiSelect } from '@/components/ui/multi-select';
import { fetchFieldsForSelectApi } from '@/apis/fields';
import LoadingPage from '@/components/LoadingPage';
import formatErrorMessages from '@/lib/formatErrorMessages';
import { partialUpdateDeviceApi } from '@/apis/devices';

const formSchema = z.object({
  fields: z.array(z.number()).nonempty('At least one field is required'),
});

const DeviceConfigurationPage = ({ device }) => {
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();
  const [fieldsList, setFieldsList] = useState([]);

  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const res = await fetchFieldsForSelectApi(
        device?.id || id
      );
      setFieldsList(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // if (device?.is_configured) {
    //   toast({
    //     title: 'Warning!',
    //     description: 'Device is already configured',
    //   });
    //   navigator('/dashboard/devices', { replace: true });
    // }

    fetchOptions();
  }, []);

  const onSubmit = async data => {
    setLoading(true);
    try {
      const formData = {
        fields: data.fields,
      }
      const res = await partialUpdateDeviceApi(device.id, formData);
      if (res.status === 200) {
        toast({
          title: 'Device Updated',
          description: 'Device has been updated successfully',
        });
        navigator('/dashboard/devices', { replace: true });
      } else {
        toast({
          title: 'Error!',
          description: 'Something went wrong',
          variant: 'destructive',
        });
      }
    }
    catch (error) {
      console.log(error);
      toast({
        title: 'Error!',
        description: formatErrorMessages(error?.response?.data),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <>
      <div className='flex justify-center items-center space-x-8 mt-5'>
        <div className='flex-1'>
          <fieldset className='border p-4 rounded-lg'>
            <legend className='text-sm mb-4'>
              Device Configuration
            </legend>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='w-full space-y-2 max-w-[550px]'
              >
                <FormField
                  control={form.control}
                  name='device'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Device</FormLabel>
                      <FormControl>
                        <Input
                          type='device'
                          placeholder='Enter your device...'
                          {...field}
                          value={device?.name}
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='fields'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fields</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={fieldsList}
                          onValueChange={field.onChange}
                          defaultValue={device?.fields}
                          placeholder='Select fields...'
                          variant='outlined'
                          animation={1}
                          maxCount={8}
                          disabled={fieldsList.length === 0}
                        />
                      </FormControl>
                      {fieldsList.length === 0 && (
                        <div className='text-sm text-destructive mx-2'>
                          No fields available, please create fields first.
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='py-2'></div>

                <Button
                  type='submit'
                  className='w-auto h-auto'
                  loading={loading}
                  disabled={!form.formState.isValid || loading}
                >
                  Configure
                </Button>
              </form>
            </Form>
          </fieldset>
        </div>
        <div className='hidden lg:flex flex-1 justify-center items-center w-full h-full'>
          <img src={LinkUnlinkIcon} alt='Device Animation' className='h-60' />
        </div>
      </div>
    </>
  );
};

export default DeviceConfigurationPage;
