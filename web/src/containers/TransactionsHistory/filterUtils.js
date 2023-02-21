import moment from 'moment';
import STRINGS from 'config/localizedStrings';

export const dateFormat = 'YYYY/MM/DD';

export const dateFilters = () => ({
	all: {
		name: STRINGS['ALL'],
		range: [],
	},
	one_day: {
		name: STRINGS['ONE_DAY'],
		range: [moment().subtract(1, 'days'), moment()] || [],
	},
	one_week: {
		name: STRINGS['ONE_WEEK'],
		range: [moment().subtract(7, 'days'), moment()] || [],
	},
	one_month: {
		name: STRINGS.formatString(STRINGS['MONTH'], 1),
		range: [moment().subtract(1, 'months'), moment()] || [],
	},
	three_month: {
		name: STRINGS.formatString(STRINGS['MONTH'], 3),
		range: [moment().subtract(3, 'months'), moment()] || [],
	},
});
