import { oldDark } from 'config/colors/dark';

export const getColorByKey = (key, content = oldDark) => {
  return content[key];
}