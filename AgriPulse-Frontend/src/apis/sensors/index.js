import AXIOS_INSTANCE from '../axios';

export const fetchSensorsApi = () => AXIOS_INSTANCE.get('/core/sensors/');

export const fetchSensorApi = id => AXIOS_INSTANCE.get(`/core/sensors/${id}/`);

export const createSensorApi = formData =>
  AXIOS_INSTANCE.post('/core/sensors/', formData);

export const updateSensorApi = (id, formData) =>
  AXIOS_INSTANCE.put(`/core/sensors/${id}/`, formData);

export const partialUpdateSensorApi = (id, formData) =>
  AXIOS_INSTANCE.patch(`/core/sensors/${id}/`, formData);

export const deleteSensorApi = id =>
  AXIOS_INSTANCE.delete(`/core/sensors/${id}/`);

export const fetchDeviceSensorsApi = device_id =>
  AXIOS_INSTANCE.get(`/core/sensors/devices/${device_id}/sensors/`);

export const fetchLatestDeviceSensorsApi = device_id =>
  AXIOS_INSTANCE.get(`/core/sensors/devices/${device_id}/sensors/latest/`);
