import http from '~/utils/http';

export const updatePhoneNumber = (userId, phoneNumber) => {
    return http.put(`/users/updatePhoneNumber/${userId}`, { phoneNumber });
};

export const updateAddress = (userId, address) => {
    return http.put(`/users/updateAddress/${userId}`, address);
};

export const addUser = (data) => {
    return http.post('/users/register', data);
};

export const getUser = (id) => http.get(`/users/${id}`);

export const changePass = (data) => {
    return http.put('/users/changePassword', data);
};

export const addBankCard = (userId, data) => {
    return http.post(`/bankcard/addbankcard/${userId}`, data);
};

export const getBankCard = (userId) => {
    return http.get(`/bankcard/getbankcard/${userId}`);
};
