import { message, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { requestUsersDownload } from '../User/actions';
import { getExchangeWallet } from './action';
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
	const [userData, setUserData] = useState([]);

	useEffect(() => {
		getWallet();
	}, []);

	const getWallet = async () => {
		try {
			const res = await getExchangeWallet();
			if (res && res.data) {
				setUserData(res.data);
			}
		} catch (error) {
			message.error(error.message);
		}
	};

	const requestDownload = (params = {}) => {
		return requestUsersDownload({ ...params, format: 'csv' });
	};

	return (
		<div className="asset-exchange-wallet-wrapper">
			<div>Exchange wallets</div>
			<div className="wallet-filter-wrapper mt-3">
				<TableFilter fields={filterFields} />
			</div>
			<div className="mt-5">
				<div onClick={requestDownload} className="mb-2">
					Download below CSV table
				</div>
				<Table columns={columns} />
			</div>
		</div>
	);
};

export default Wallet;
