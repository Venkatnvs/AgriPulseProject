import AXIOS_INSTANCE from '../axios';

export const fetchDevicesApi = () => AXIOS_INSTANCE.get('/core/sensors/devices/');

export const fetchDeviceBySearchApi = search =>
    AXIOS_INSTANCE.get(`/core/sensors/devices/?search=${search}`);

export const createDeviceApi = formData =>
    AXIOS_INSTANCE.post('/core/sensors/devices/', formData);

export const fetchDeviceApi = id => AXIOS_INSTANCE.get(`/core/sensors/devices/${id}/`);

export const updateDeviceApi = (id, formData) =>
    AXIOS_INSTANCE.put(`/core/sensors/devices/${id}/`, formData);

export const partialUpdateDeviceApi = (id, formData) =>
    AXIOS_INSTANCE.patch(`/core/sensors/devices/${id}/`, formData);

export const deleteDeviceApi = id => AXIOS_INSTANCE.delete(`/core/sensors/devices/${id}/`);

export const fetchDeviceListForSelectApi = () =>
    AXIOS_INSTANCE.get('/core/sensors/devices/select-list/');