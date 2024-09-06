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
import { Loader, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import formatErrorMessages from '@/lib/formatErrorMessages';
import { useToast } from '@/components/ui/use-toast';
import { deleteDeviceApi } from '@/apis/devices';

const DeleteDeviceDialog = ({
  showDelete,
  setShowDelete = () => {},
  selectedDevice,
  fetchData,
  setSelectedDevice = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!selectedDevice) return null;

  const handleDelete = async id => {
    setLoading(true);
    try {
      const res = await deleteDeviceApi(selectedDevice?.id);
      if (res.status === 204) {
        toast({
          title: 'Device Deleted',
          description: 'Device has been deleted successfully',
        });
        fetchData();
        setShowDelete(false);
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
      setSelectedDevice(null);
    }
  };

  return (
    <Dialog open={showDelete} onOpenChange={setShowDelete}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Delete Field</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this field?
        </DialogDescription>
        <DialogFooter className='flex justify-end gap-4'>
          <Button variant='destructive' onClick={handleDelete}>
            {loading ? <Loader size={16} /> : 'Delete'}
          </Button>
          <Button variant='outline' onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDeviceDialog;
