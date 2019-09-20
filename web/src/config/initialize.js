import axios from 'axios';
import { API_URL } from './constants';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = API_URL;
