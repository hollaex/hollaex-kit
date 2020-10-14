import defaultIcons from 'config/icons';

export const getIconByKey = (key, content = defaultIcons) => {
  return content[key];
}