import { useState } from 'react';
import MapComponent from './MapComponent';
import AddFieldForm from './AddFieldForm';

const AddFieldSelection = () => {
  const [selectedField, setSelectedField] = useState(null);

  return (
    <div className='flex flex-col'>
      <section className='grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3'>
        <div className='relative flex-col items-start gap-8 md:flex'>
          <AddFieldForm
            isLandSelected={selectedField?.size ? true : false}
            selectedField={selectedField}
          />
        </div>
        <div className='relative flex h-full min-h-[80vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2'>
          <MapComponent
            selectedField={selectedField}
            setSelectedField={setSelectedField}
          />
        </div>
      </section>
    </div>
  );
};

export default AddFieldSelection;
