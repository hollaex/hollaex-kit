import React from 'react';
import moment from 'moment';
import { formatCurrency } from '../../../utils';

const dateFormat = 'YYYY/MM/DD';

export const initialValues = {
	dates: [
		moment(new Date()).subtract(7, 'days').format(dateFormat),
		moment(new Date()).format(dateFormat),
	],
};

export const INITIAL_STATE = {
	data: {},
	filteredData: [],
	loading: false,
	success: false,
	error: '',
	filteredInfo: null,
	sortedInfo: null,
	searchText: '',
};

export const COLUMNS = [
	{
		title: 'TrxID',
		dataIndex: 'TrxID',
		key: 'TrxID',
		sorter: (a, b) => a.TrxID - b.TrxID,
	},
	{
		title: 'Amount',
		dataIndex: 'Amount',
		key: 'Amount',
		sorter: (a, b) => a.Amount - b.Amount,
		render: formatCurrency,
	},
	{
		title: 'DateTime',
		dataIndex: 'DateTime',
		key: 'DateTime',
		render: (value) => moment(value).format('LLL'),
		sorter: (a, b) => (moment(a.DateTime).isBefore(b.DateTime) ? -1 : 1),
	},
	{
		title: 'TrxType',
		dataIndex: 'TrxType',
		key: 'TrxType',
		filterMultiple: false,
		onFilter: (value, record) => record.TrxType === value,
	},
	// { title: 'TrxStatus', dataIndex: 'TrxStatus', key: 'TrxStatus' },
	// { title: 'Description', dataIndex: 'Description', key: 'Description' },
	// { title: 'UID', dataIndex: 'UID', key: 'UID' },
];

export const expandedRowRender = (row) => (
	<div>
		<div>Amount: {formatCurrency(row.Amount)}</div>
		<div>TrxStatus: {row.TrxStatus}</div>
		<div>UID: {row.UID}</div>
		{row.Description && <div>Description: {row.Description}</div>}
	</div>
);
