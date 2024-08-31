import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import moment from 'moment';
import { Badge } from '@/components/ui/badge';
import { formatText } from '../scripts/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import DotPattern from '@/components/magicui/dot-pattern';
import { cn } from '@/lib/utils';
import { Copy, Dot, Edit, Loader, Trash } from 'lucide-react';
import { NewDeviceIcon } from '@/constants/Icons/icons';
import PulsatingButton from '@/components/magicui/pulsating-button';
import Meteors from '@/components/magicui/meteors';
import { deleteDeviceApi } from '@/apis/devices';
import formatErrorMessages from '@/lib/formatErrorMessages';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const DetailsofDevice = ({ device }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteDeviceApi(device.id);
      if (res.status === 204) {
        toast({
          title: 'Device Deleted',
          description: 'Device has been deleted successfully',
        });
        setShowEdit(false);
        navigate('/dashboard/devices', { replace: true });
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

  const handleCopy = text => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'Token copied to clipboard',
    });
  };

  return (
    <TooltipProvider>
      <div className='p-1 lg:p-4 max-w-4xl mx-auto'>
        <fieldset className='relative border p-6 rounded-lg shadow-md w-full'>
          <DotPattern
            className={cn(
              '[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]',
            )}
          />
          <legend className='text-xl font-semibold mb-4 flex items-center justify-between'>
            <span className='text-primary'>Device Details</span>
            <Dialog open={showEdit} onOpenChange={setShowEdit}>
              <DialogTrigger asChild>
                <div className='flex space-x-2'>
                  <Tooltip text='Delete Device'>
                    <TooltipTrigger asChild>
                      <Button variant='destructive' className='p-2 ml-2'>
                        <Trash size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Device</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>Delete Device</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  Are you sure you want to delete this device?
                </DialogDescription>
                <DialogFooter>
                  <Button
                    variant='destructive'
                    onClick={handleDelete}
                  >
                    {
                      loading ? (
                        <Loader size={16} />
                      ) : (
                        'Delete'
                      )
                    }
                  </Button>
                  <Button variant='outline' onClick={() => setShowEdit(false)}>
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </legend>
          <div className='flex flex-col md:flex-row items-center md:items-start gap-6'>
            <div className='flex flex-col items-center md:items-start'>
              <img src={NewDeviceIcon} alt='Device' className='w-36 h-auto' />
            </div>

            <section className='flex-1'>
              <div className='grid grid-cols-1 gap-4'>
                <div className='flex space-x-2'>
                  <strong className='text-gray-700'>Name:</strong>
                  <span>{device.name}</span>
                </div>
                <div className='flex space-x-2'>
                  <strong className='text-gray-700'>Device ID:</strong>
                  <span>
                    {device?.is_configured
                      ? device?.device_id
                      : 'Not Configured'}
                  </span>
                </div>
                <div className='flex gap-4 flex-wrap'>
                  <strong className='text-gray-700'>Token:</strong>
                  <div className='flex items-center space-x-2 overflow-auto'>
                    <span className='border bg-gray-100/10 text-sm border-gray-300 dark:border-gray-700 px-2 py-1 rounded-md'>
                      {device.access_token}
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleCopy(device.access_token)}
                        >
                          <Copy size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to copy token</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <div className='flex items-center flex-wrap'>
                  <strong className='text-gray-700'>Status:</strong>
                  <div className='ml-2 flex items-center flex-wrap gap-2'>
                    <span
                      className={`w-4 h-4 rounded-full ${
                        device.is_configured ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <span className='ml-1'>
                      {device.is_configured ? 'Connected' : 'Not Connected'}
                    </span>
                    {!device.is_configured && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <PulsatingButton
                            className='ml-4 py-1 bg-primary dark:bg-primary text-white dark:text-white'
                            pulseColor='#ff9800'
                          >
                            Configure
                          </PulsatingButton>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to configure device</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
                <div className='flex space-x-2'>
                  <strong className='text-gray-700'>Active:</strong>
                  <span>{device.is_active ? 'Yes' : 'No'}</span>
                </div>
                <div>
                  <strong className='text-gray-700'>Configurations:</strong>
                  <ul className='list-disc list-inside mt-2 ml-8'>
                    {Object.entries(device.configurations).map(
                      ([key, value], idx) => (
                        <li key={idx} className='mb-1'>
                          <strong>{formatText(key)}:</strong>{' '}
                          {value?.toString()}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
                <div>
                  <Badge className='text-sm' variant='secondary'>
                    Created on:{' '}
                    {moment(device.created_at).format('DD MMM YYYY')}
                  </Badge>
                </div>
              </div>
            </section>
          </div>
        </fieldset>
      </div>
    </TooltipProvider>
  );
};

export default DetailsofDevice;
