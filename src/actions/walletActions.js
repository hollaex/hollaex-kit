import axios from 'axios';
// import querystring from 'query-string';
// import { all } from 'bluebird';

export const performDeposit = (values) => {
  return axios.post('/deposit', values);
}

export const performWithdraw = (values) => {
  return axios.post('/withdraw', values);
}
