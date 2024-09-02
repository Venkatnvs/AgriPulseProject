import AXIOS_INSTANCE from '../axios';

export const fetchFieldsApi = () => AXIOS_INSTANCE.get('/core/fields/');

export const fetchFieldsBySearchApi = search =>
    AXIOS_INSTANCE.get(`/core/fields/?search=${search}`);

export const createFieldApi = formData =>
    AXIOS_INSTANCE.post('/core/fields/', formData);

export const fetchFieldApi = id => AXIOS_INSTANCE.get(`/core/fields/${id}/`);

export const updateFieldApi = (id, formData) =>
    AXIOS_INSTANCE.put(`/core/fields/${id}/`, formData);

export const partialUpdateFieldApi = (id, formData) =>
    AXIOS_INSTANCE.patch(`/core/fields/${id}/`, formData);

export const deleteFieldApi = id => AXIOS_INSTANCE.delete(`/core/fields/${id}/`);

export const fetchWeatherAndForecastApi = formData =>
    AXIOS_INSTANCE.post('/core/fields/weather-and-forecast/', formData);

export const fetchFieldsForSelectApi = () =>
    AXIOS_INSTANCE.get('/core/fields/select-list/');

export const linkDeviceApi = (fieldId, deviceId) =>
    AXIOS_INSTANCE.post(`/core/fields/${fieldId}/link-device/`, { device_id: deviceId });