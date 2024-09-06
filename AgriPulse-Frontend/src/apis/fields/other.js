import AXIOS_INSTANCE from '../axios';

export const fetchCropsDataApi = () => AXIOS_INSTANCE.get('/core/fields/crops-data/');

export const changeCropTypeApi = (deviceId, data) =>
    AXIOS_INSTANCE.patch(`/core/fields/${deviceId}/crop-type-change/`, data);