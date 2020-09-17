import axios from 'axios';
import { requestAuthenticated } from 'utils';

export const updateConfig = async (key, values) => {

  const oldConstants = await getConstants();

  const constants = {
    ...oldConstants,
    [key]: values,
  }

  const options = {
    method: 'PUT',
    body: JSON.stringify(constants)
  };
  return requestAuthenticated('/admin/constant', options);
}

export const getConstants = async () => {
  const { data: { constants } } = await axios.get('/constant')
  return constants;
}

export const getConfig = async (key) => {
  const { data: { constants: { [key]: config } } } = axios.get('/constant')
  return config;
}

export const getValidLanguages = async () => {
  const { data: { constants: { valid_languages = [] } } } = await axios.get('/constant')
  return valid_languages.split(',')
}

export const getVersions = async () => {
  const { data: { constants: { versions = {} } } } = await axios.get('/constant')
  return versions
}
