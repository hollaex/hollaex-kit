import light from 'config/colors/light';

export const getColorByKey = (key, content = light) => {
  return content[key];
}