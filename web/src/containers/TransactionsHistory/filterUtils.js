import moment from 'moment';
import STRINGS from 'config/localizedStrings';

export const dateFormat = 'YYYY/MM/DD';

export const dateFilters = {
	all: {
		name: STRINGS['ALL'],
		range: [],
	},
	one_day: {
		name: STRINGS['ONE_DAY'],
		range: [moment(new Date()), moment(new Date()).add(1, 'days')] || [],
	},
	one_week: {
		name: STRINGS['ONE_WEEK'],
		range: [moment(new Date()).subtract(7, 'days'), moment(new Date())] || [],
	},
	one_month: {
		name: STRINGS.formatString(STRINGS['MONTH'], 1),
		range: [moment(new Date()).subtract(1, 'months'), moment(new Date())] || [],
	},
	three_month: {
		name: STRINGS.formatString(STRINGS['MONTH'], 3),
		range: [moment(new Date()).subtract(3, 'months'), moment(new Date())] || [],
	},
};
