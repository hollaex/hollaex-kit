import React, { useEffect, useState } from 'react';
import { message, Table, Button } from 'antd';
import { requestUsersDownload } from '../User/actions';
import MultiFilter from './TableFilter';
import { getExchangeWallet } from './action';

const columns = [
	{
		title: 'User Id',
		dataIndex: 'user_id',
		key: 'user_id',
		render: (user_id, data) => {
			return (
				<div className="d-flex">
					<Button className="ant-btn green-btn ant-tooltip-open ant-btn-primary">
						{data.User.id}
					</Button>
					<div className="ml-3">{data.User.email}</div>
				</div>
			);
		},
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
		name: 'user_id',
	},
	{
		label: 'Address',
		value: 'address',
		placeHolder: 'Input address',
		type: 'text',
		name: 'address',
	},
	{
		label: 'Currency',
		value: 'currency',
		placeHolder: 'Currency',
		type: 'select',
		name: 'currency',
	},
	{
		label: 'Network',
		value: 'network',
		placeHolder: 'Network',
		type: 'select',
		name: 'network',
	},
	{
		label: 'Time',
		name: 'time',
		value: 'time',
		placeHolder: 'Network',
		type: 'time-picker',
	},
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

	const requestUsersWallet = async (values) => {
		if ('type' === 'remove') {
		} else {
			const res = await getExchangeWallet(values);
			if (res && res.data) {
				setUserData(res.data);
			}
		}
	};

	return (
		<div className="asset-exchange-wallet-wrapper">
			<div className="header-txt">Exchange wallets</div>
			<div className="wallet-filter-wrapper mt-4">
				<MultiFilter fields={filterFields} onHandle={requestUsersWallet} />
			</div>
			<div className="mt-5">
				<span
					onClick={requestDownload}
					className="mb-2 underline-text cursor-pointer"
				>
					Download below CSV table
				</span>
				<div className="mt-4">
					<Table columns={columns} dataSource={userData} />
				</div>
			</div>
		</div>
	);
};

export default Wallet;
