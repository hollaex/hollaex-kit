import axios from 'axios';

export const requestExchange = (values) => {
    return axios.get(`/network/${values.id}/exchange`);
};

export const updateExchange = (values) => {
    return axios.put(`/network/${values.id}/exchange`);
};

export const storeMint = (values) => {
    return axios.post(`/network/${values.id}/mint`);
};

export const storeBurn = (values) => {
    return axios.post(`/network/${values.id}/burn`);
};

export const getCoins = (values) => {
    return axios.get(`/network/${values.id}/coin/all`);
};