import moment from 'moment';
import momentJ from 'moment-jalaali';

const generateFaFormat = (format = '') =>
   format
      .split('/')
      .map((s) => `j${s}`)
      .join('/');

export const TIMESTAMP_FORMAT = 'YYYY/MM/DD HH:mm:ss A';
export const TIMESTAMP_FORMAT_FA = generateFaFormat(TIMESTAMP_FORMAT);
export const DATETIME_FORMAT = 'YYYY/MM/DD';
export const DATETIME_FORMAT_FA = generateFaFormat(DATETIME_FORMAT);

export const formatTimestampGregorian = (date, format = TIMESTAMP_FORMAT) =>
   formatTimestamp(date, format, moment);
export const formatTimestampFarsi = (date, format = TIMESTAMP_FORMAT_FA) =>
   formatTimestamp(date, format, momentJ);

const formatTimestamp = (date, format, formatter) => {
   let formattedTimestamp = '';
   try {
      formattedTimestamp = formatter(date).format(format);
   } catch (e) {
      formattedTimestamp = date;
   }
   return formattedTimestamp;
};
