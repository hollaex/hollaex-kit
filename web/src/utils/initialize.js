import { overwriteLocale } from './string';
import { getVersions } from 'actions/operatorActions';

export const getRemoteVersion = async () => {
  return await getVersions()
}

export const getLocalVersions = () => {
  const versions = localStorage.getItem('versions') || '{}';
  return JSON.parse(versions);
}

export const setLocalVersions = (versions) => {
  localStorage.setItem('versions', JSON.stringify(versions));
}

export const initializeStrings = (strings = JSON.parse(localStorage.getItem('strings') || '{}')) => {
  Object.entries(strings).forEach(([key, overwrites]) => {
    overwriteLocale(key, overwrites);
  })
}

export const getValidLanguages = () => {
  const validLanguages = localStorage.getItem('valid_languages') || ''
  return validLanguages.split(',');
}

export const setValidLanguages = (validLanguages = '') => {
  return localStorage.setItem('valid_languages', validLanguages)
}