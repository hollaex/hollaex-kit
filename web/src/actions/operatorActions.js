import axios from 'axios';
import { requestAuthenticated } from 'utils';

export const updateConfigs = async (configs) => {
  const { valid_languages, ...restConfigs } = configs;
  const versionedConfigs = await pushVersions(restConfigs)

  const constants = {
    kit: {
      valid_languages,
      ...versionedConfigs,
    }
  }

  const options = {
    method: 'PUT',
    body: JSON.stringify(constants)
  };

  return requestAuthenticated('/admin/kit', options);
}

export const getConstants = async () => {
  const { data = { } } = await axios.get('/kit');
  return data;
}

export const getConfig = async (key) => {
  const { data } = await axios.get('/kit')
  return data[key] ? data[key] : {};
}

export const getValidLanguages = async () => {
  const { data: { valid_languages = '' } } = await axios.get('/kit')
  return valid_languages;
}

export const getVersions = async () => {
  const { data: { meta = { } } } = await axios.get('/kit')
  return meta.versions ? meta.versions : {};
}

export const getInitialized = async () => {
  const { data: { info: { initialized } } } = await axios.get('/kit')
  return initialized;
}

export const publish = async (configs) => {
  await updateConfigs(configs)
  console.info('Published Successfully');
}

export const pushVersions = async (configs) => {
  const versions = await getVersions()
  const uniqid = Date.now();
  Object.keys(configs).forEach(key => {
    versions[key] = `${key}-${uniqid}`
  })
  return {...configs, meta: { versions }}
}

export const upload = (formData) => {
  const options = {
    method: 'POST',
    body: formData,
  };

  const path = 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png';
  return new Promise((resolve, reject) => {
    return setTimeout(() => resolve(path), 2000)
  })

  return requestAuthenticated('/admin/upload', options)
}