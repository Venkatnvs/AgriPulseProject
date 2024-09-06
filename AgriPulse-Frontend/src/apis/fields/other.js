import AXIOS_INSTANCE from '../axios';

export const fetchCropsDataApi = () => AXIOS_INSTANCE.get('/core/fields/crops-data/');