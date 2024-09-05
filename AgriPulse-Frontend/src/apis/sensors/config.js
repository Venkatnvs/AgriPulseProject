import AXIOS_INSTANCE from '../axios';

export const setSensorConfigApi = (id, formData) =>
    AXIOS_INSTANCE.put(`/core/sensors/devices/${id}/configure/`, formData);

export const partialUpdateSensorConfigApi = (id, formData) =>
    AXIOS_INSTANCE.patch(`/core/sensors/devices/${id}/configure/`, formData);