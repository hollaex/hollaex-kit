import { overwriteLocale } from './string';

export const getRemoteVersion = async () => {
  const remoteVersions = await new Promise((resolve, reject) => {
    setTimeout(() => resolve({ strings: "randomVersion" }), 1000);
  });

  return remoteVersions;
}

export const getLocalVersions = () => {
  const versions = localStorage.getItem('versions') || JSON.stringify({});
  return JSON.parse(versions);
}

export const setLocalVersions = (versions) => {
  localStorage.setItem('versions', JSON.stringify(versions));
}

export const initializeStrings = () => {
  const stringsJson = localStorage.getItem('strings');
  const strings = JSON.parse(stringsJson);
  Object.entries(strings).forEach(([key, overwrites]) => {
    overwriteLocale(key, overwrites);
  })
}