import moment from 'moment';

export const TIMESTAMP_FORMAT = 'YYYY/MM/DD HH:mm:ss';
export const DATETIME_FORMAT = 'YYYY/MM/DD';

export const formatTimestampGregorian = (date, format = TIMESTAMP_FORMAT) =>
	formatTimestamp(date, format, moment);

const formatTimestamp = (date, format, formatter) => {
	let formattedTimestamp = '';
	try {
		formattedTimestamp = formatter(date).format(format);
	} catch (e) {
		formattedTimestamp = date;
	}
	return formattedTimestamp;
};
