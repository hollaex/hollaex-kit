import moment from 'moment';

export const dateFormat = 'YYYY/MM/DD';

export const dateFilters = {
	all: {
		name: 'All',
		range: [],
	},
	one_day: {
		name: '1 day',
		range: [moment(new Date()).subtract(1, 'days'), moment(new Date())],
	},
	one_week: {
		name: '1 week',
		range: [moment(new Date()).subtract(7, 'days'), moment(new Date())],
	},
	one_month: {
		name: '1 month',
		range: [moment(new Date()).subtract(1, 'months'), moment(new Date())],
	},
	three_month: {
		name: '3 month',
		range: [moment(new Date()).subtract(3, 'months'), moment(new Date())],
	},
};
