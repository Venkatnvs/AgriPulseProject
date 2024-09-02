import React, { useEffect, useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import formatErrorMessages from '@/lib/formatErrorMessages';
import { linkDeviceApi, partialUpdateFieldApi } from '@/apis/fields';

const formSchema = z.object({
  device: z.string().nonempty('Device is required'),
});

const LinkDeviceDialog = ({
  openLinkDeviceModal,
  setOpenLinkDeviceModal = () => {},
  data,
  setFieldData = () => {},
}) => {
  const [loading, setLoading] = useState(true);
  const [device, setDevice] = useState(null);
  const { toast } = useToast();

  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const fetchDevice = async () => {
    setLoading(true);
    try {
      const res = await fetchDeviceListForSelectApi();
      setDevice(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async values => {
    setLoading(true);
    try {
      const res = await linkDeviceApi(data.id, parseInt(values.device));
      if (res.status === 200) {
        toast({
          title: 'Success!',
          description: 'Device configured successfully',
        });
        setFieldData(prev => ({
          ...prev,
          linked_devices: parseInt(values.device),
        }));
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
    }
  };

  useEffect(() => {
    fetchDevice();
  }, []);

  return (
    <Dialog open={openLinkDeviceModal} onOpenChange={setOpenLinkDeviceModal}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Link Device</DialogTitle>
          <DialogDescription>
            Link this field to a device to start collecting data.
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a device to link' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {device?.map(item => (
                          <SelectItem key={item.id} value={item.id + ''}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
  );
};

export default LinkDeviceDialog;
