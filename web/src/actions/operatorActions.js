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

export const getKitData = async () => {
  const { data } = await axios.get('/kit')
  return data;
}

export const getVersions = async () => {
  const { data: { meta = { } } } = await axios.get('/kit')
  return meta.versions ? meta.versions : {};
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
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData,
    method: 'POST'
  };

  return axios('/admin/upload', options)
}