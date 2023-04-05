import { Table } from 'antd';
import React from 'react';
import TableFilter from './TableFilter';

const columns = [
	{
		title: 'User Id',
		dataIndex: 'user_id',
		key: 'user_id',
	},
	{
		title: 'Currency',
		dataIndex: 'currency',
		key: 'currency',
	},
	{
		title: 'Network',
		dataIndex: 'network',
		key: 'network',
	},
	{
		title: 'Address',
		dataIndex: 'address',
		key: 'address',
	},
];

const filterFields = [
	{
		label: 'User ID',
		value: 'user_id',
		placeHolder: 'Input User ID',
		type: 'number',
	},
	{
		label: 'Address',
		value: 'address',
		placeHolder: 'Input address',
		type: 'text',
	},
	{
		label: 'Currency',
		value: 'currency',
		placeHolder: 'Currency',
		type: 'select',
	},
	{
		label: 'Network',
		value: 'network',
		placeHolder: 'Network',
		type: 'select',
	},
	{ label: 'Time', value: 'time', placeHolder: 'Network', type: 'time-picker' },
];

const Wallet = () => {
	return (
		<div className="asset-exchange-wallet-wrapper">
			<div>Exchange wallets</div>
			<div className="wallet-filter-wrapper">
				<TableFilter fields={filterFields} />
			</div>
			<div>
				<div>Download table</div>
				<Table columns={columns} />
			</div>
		</div>
	);
};

export default Wallet;
