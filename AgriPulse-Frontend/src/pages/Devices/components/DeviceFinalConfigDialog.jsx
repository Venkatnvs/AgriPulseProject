import React, { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { fetchDeviceListForSelectApi } from '@/apis/devices';
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
import { useToast } from '@/components/ui/use-toast';
import { partialUpdateSensorConfigApi } from '@/apis/sensors/config';
import formatErrorMessages from '@/lib/formatErrorMessages';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  device_id: z.string().nonempty('Device ID is required'),
});

const DeviceFinalConfigDialog = ({
  openLinkDeviceModal,
  setOpenLinkDeviceModal = () => {},
  deviceData,
  fetchDevice = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async values => {
    setLoading(true);
    try {
      const res = await partialUpdateSensorConfigApi(deviceData.id, {
        device_id: values.device_id,
      });
      if (res.status === 200) {
        toast({
          title: 'Success!',
          description: 'Device configured successfully',
        });
        setOpenLinkDeviceModal(false);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error!',
        description: formatErrorMessages(error?.response?.data),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      fetchDevice();
    }
  };

  if(!deviceData || !deviceData.id) return null;

  const deviceName = deviceData?.name;

  return (
    <Dialog open={openLinkDeviceModal} onOpenChange={setOpenLinkDeviceModal}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>
            Configure Device
          </DialogTitle>
          <DialogDescription>
            Configure the device for reciving data
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center space-x-2'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='w-full space-y-2'
            >
              <FormField
                control={form.control}
                name='device'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='Enter device name...'
                        readOnly={true}
                        disabled={loading}
                        {...field}
                        value={deviceName}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='device_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device ID</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='Enter device ID...'
                        disabled={loading}
                        values={deviceData?.device_id}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='py-2'></div>

              <DialogFooter className='sm:justify-end gap-2'>
                <Button
                  type='submit'
                  className='w-auto h-auto'
                  loading={loading}
                  disabled={!form.formState.isValid || loading}
                >
                  Configure
                </Button>
                <DialogClose asChild>
                  <Button type='button' variant='secondary'>
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeviceFinalConfigDialog