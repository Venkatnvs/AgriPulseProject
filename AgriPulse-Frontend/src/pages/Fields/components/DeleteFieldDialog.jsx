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
import { deleteFieldApi } from '@/apis/fields';

const DeleteFieldDialog = ({
  showDelete,
  setShowDelete = () => {},
  selectedField,
  fetchData,
  setSelectedField = () => {},
}) => {

  const [loading, setLoading] = useState(false);

  if (!selectedField) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteFieldApi(selectedField);
      if (res.status === 204) {
        fetchData();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setShowDelete(false);
      setSelectedField(null);
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

export default DeleteFieldDialog;
