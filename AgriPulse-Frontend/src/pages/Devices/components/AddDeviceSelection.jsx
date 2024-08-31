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
import { Button } from '@/components/ui/button';
import { NewDeviceIcon } from '@/constants/Icons/icons';
import { Checkbox } from '@/components/ui/checkbox';
import formatErrorMessages from '@/lib/formatErrorMessages';
import { createDeviceApi } from '@/apis/devices';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  name: z.string().nonempty({ message: 'Name is required' }),
  soil_sensors_count: z.coerce
    .number()
    .int()
    .positive({ message: 'Invalid count' }),
  has_npk_sensor: z.boolean().optional(),
  has_ph_sensor: z.boolean().optional(),
  has_gps: z.boolean().optional(),
});

const AddDeviceSelection = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();

  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });


  const onSubmit = async data => {
    setLoading(true);
    try {
      console.log(data);

      const formData = new FormData();
      formData.append('name', data.name);
      const configurations = {
        soil_sensors_count: data.soil_sensors_count,
        has_npk_sensor: data.has_npk_sensor,
        has_ph_sensor: data.has_ph_sensor,
        has_gps: data.has_gps,
      };
      formData.append('configurations', JSON.stringify(configurations));

      const res = await createDeviceApi(formData);

      if (res.status === 201) {
        toast({
          title: 'Success!',
          description: 'Device added successfully',
        });
        navigator('/dashboard/devices');
      }

      form.reset();
    } catch (error) {
      if (error?.response?.status === 500) {
        toast({
          title: 'Error!',
          description: 'Internal server error',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Error!',
        description: formatErrorMessages(error?.response?.data),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center space-x-8 mt-5'>
      <div className='flex-1'>
        <fieldset className='border p-4 rounded-lg'>
          <legend className='text-sm mb-4'>Device Details</legend>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='w-full space-y-2 max-w-[550px]'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        type='name'
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
                name='soil_sensors_count'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soil Sensors Count</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Enter the number of soil sensors...'
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='pt-1'></div>

              <div className='flex items-center space-x-2'>
                <FormField
                  control={form.control}
                  name='has_npk_sensor'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          disabled={loading}
                          id='id_has_npk_sensor'
                          checked={field.value}
                          onCheckedChange={checked => field.onChange(checked)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormLabel htmlFor='id_has_npk_sensor'>NPK Sensor</FormLabel>
              </div>

              <div className='flex items-center space-x-2'>
                <FormField
                  control={form.control}
                  name='has_ph_sensor'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          disabled={loading}
                          id='id_has_ph_sensor'
                          checked={field.value}
                          onCheckedChange={checked => field.onChange(checked)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormLabel htmlFor='id_has_ph_sensor'>PH Sensor</FormLabel>
              </div>

              <div className='flex items-center space-x-2'>
                <FormField
                  control={form.control}
                  name='has_gps'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          disabled={loading}
                          id='id_has_gps'
                          checked={field.value}
                          onCheckedChange={checked => field.onChange(checked)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormLabel htmlFor='id_has_gps'>GPS</FormLabel>
              </div>

              <div className='py-2'></div>

              <Button
                type='submit'
                className='w-full'
                loading={loading}
                disabled={!form.formState.isValid || loading}
              >
                Add Device
              </Button>
            </form>
          </Form>
        </fieldset>
      </div>
      <div className='hidden lg:block flex-1'>
        <img
          src={NewDeviceIcon}
          alt='Device Animation'
          className='w-full h-60'
        />
      </div>
    </div>
  );
};

export default AddDeviceSelection;
