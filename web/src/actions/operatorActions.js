import axios from 'axios';
import { requestAuthenticated } from 'utils';

export const updateConfigs = async (configs) => {

  const oldConstants = await getConstants();
  const versionedConfigs = await pushVersions(configs)

  oldConstants.user_level_number = parseInt(oldConstants.user_level_number, 10);

  const constants = {
    ...oldConstants,
    color: {
      ...oldConstants.color,
      ...versionedConfigs,
    },
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
  const { data: { constants: { color: { [key]: config } } } } = await axios.get('/constant')
  return config;
}

export const getValidLanguages = async () => {
  const { data: { constants: { valid_languages = '' } } } = await axios.get('/constant')
  return valid_languages;
}

export const getVersions = async () => {
  const { data: { constants: { color: { versions = {} } } } } = await axios.get('/constant')
  return versions
}

export const publish = async (configs) => {
  await updateConfigs(configs)
  console.log('published Successfully');
}

export const pushVersions = async (configs) => {
  const versions = await getVersions()
  const uniqid = Date.now();
  Object.keys(configs).forEach(key => {
    versions[key] = `${key}-${uniqid}`
  })
  return {...configs, versions}
}