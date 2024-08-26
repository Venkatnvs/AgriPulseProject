import { useState } from 'react';
import MapComponent from './MapComponent';
// import FieldDetailsModal from './FieldDetailsModal';

const FieldSelection = () => {
    const [fields, setFields] = useState([]);
    const [selectedField, setSelectedField] = useState(null);

    const handleShapeCreated = (e) => {
        const { layerType, layer } = e;
        const shape = layer.toGeoJSON();
        setSelectedField({ geometry: shape.geometry });
    };

    const saveFieldDetails = (details) => {
        setFields([...fields, { ...selectedField, ...details }]);
        setSelectedField(null);  // Close the modal
    };

    return (
        <div>
            <MapComponent onShapeCreated={handleShapeCreated} />
            {/* {selectedField && (
                <FieldDetailsModal
                    show={!!selectedField}
                    onSave={saveFieldDetails}
                    onClose={() => setSelectedField(null)}
                />
            )} */}
            {/* <FieldList fields={fields} /> */}
        </div>
    );
};

export default FieldSelection;
