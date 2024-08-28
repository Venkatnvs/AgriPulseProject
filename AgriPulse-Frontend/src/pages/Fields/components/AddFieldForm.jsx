import React from 'react';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FieldSelectImage } from '@/constants/Images';
import { useNavigate } from 'react-router-dom';
import formatErrorMessages from '@/lib/formatErrorMessages';
import { createFieldApi } from '@/apis/fields';

const formSchema = z.object({
  name: z.string().nonempty({ message: 'Name is required' }),
  crop_type: z.string().nonempty({ message: 'Crop type is required' }),
  description: z.string().optional(),
});

const AddFieldForm = ({ isLandSelected, selectedField }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);

  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async data => {
    console.log(data, selectedField);
    setLoading(true);
    try{

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('crop_type', data.crop_type);

      // send the selected field geometry as JSON string
      formData.append('geometry', JSON.stringify(selectedField.geometry));
      formData.append('size', selectedField.size);

      const res = await createFieldApi(formData);

      if (res.status === 201) {
        toast({
          title: 'Success!',
          description: 'Field added successfully',
        });
        navigate('/dashboard/fields');
      }

    } catch (error) {
      console.error(error?.response?.data);
      toast({
        title: 'Error!',
        description: formatErrorMessages(error?.response?.data),
        variant: 'destructive',
      });
    }finally{
      setLoading(false);
    }
  };

  return (
    <>
      {isLandSelected ? (
        <Card>
          <CardHeader>
            <CardTitle>Add Field</CardTitle>
            <CardDescription>
              Add a new field to the selected land
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='grid w-full items-start gap-3'
              >
                <FormItem>
                  <FormLabel htmlFor='name'>Name</FormLabel>
                  <Input
                    id='name'
                    {...form.register('name')}
                    placeholder='Enter field name'
                  />
                  <FormMessage>
                    {form.formState.errors.name?.message}
                  </FormMessage>
                </FormItem>
                <FormItem>
                  <FormLabel htmlFor='description'>Description</FormLabel>
                  <Input
                    id='description'
                    {...form.register('description')}
                    placeholder='Enter field description'
                  />
                  <FormMessage>
                    {form.formState.errors.description?.message}
                  </FormMessage>
                </FormItem>
                <FormItem>
                  <FormLabel htmlFor='crop_type'>Crop Type</FormLabel>
                  <Input
                    id='crop_type'
                    {...form.register('crop_type')}
                    placeholder='Enter crop type'
                  />
                  <FormMessage>
                    {form.formState.errors.crop_type?.message}
                  </FormMessage>
                </FormItem>
                <FormControl>
                  <Button
                    type='submit'
                    className='mt-5'
                    disabled={!form.formState.isValid}
                  >
                    Add Field
                  </Button>
                </FormControl>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Select Land</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className='text-xl'>
              Click on Polygon tool in the top-right corner of map to select a
              land
            </CardDescription>
            <div className='flex flex-col justify-center mt-5 relative'>
              <p className='text-muted text-lg px-3 absolute top-0 left-0 right-0 text-center'>
                Select a land as shown below
              </p>
              <img
                src={FieldSelectImage}
                alt='Map Selection'
                className='w-full h-full max-w-[300px] max-h-[300px] mx-auto'
              />
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AddFieldForm;
