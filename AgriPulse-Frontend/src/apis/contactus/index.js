import AXIOS_INSTANCE from '../axios';

export const contactUsListApi = () => AXIOS_INSTANCE.get('/core/contact-us/');

export const contactUsCreateApi = formData =>
    AXIOS_INSTANCE.post('/core/contact-us/', formData);

export const contactUsReadApi = id => AXIOS_INSTANCE.get(`/core/contact-us/${id}/`);

export const contactUsUpdateApi = (id, formData) =>
    AXIOS_INSTANCE.put(`/core/contact-us/${id}/`, formData);

export const contactUsPartialUpdateApi = (id, formData) =>
    AXIOS_INSTANCE.patch(`/core/contact-us/${id}/`, formData);

export const contactUsDeleteApi = id => AXIOS_INSTANCE.delete(`/core/contact-us/${id}/`);