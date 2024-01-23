import React, { useEffect, useState } from 'react';
import { message, Table, Button, Spin } from 'antd';
import MultiFilter from './TableFilter';
import { getExchangeWallet, getExchangeWalletCsv } from './action';

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
					{/* <div className="ml-3">{data.User.email}</div> */}
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
		value: '',
		placeholder: 'Input User ID',
		type: 'number',
		name: 'user_id',
	},
	{
		label: 'Address',
		value: '',
		placeholder: 'Input address',
		type: 'text',
		name: 'address',
	},
	{
		label: 'Currency',
		value: '',
		placeholder: 'Currency',
		type: 'select',
		name: 'currency',
	},
	{
		label: 'Network',
		value: '',
		placeholder: 'Network',
		type: 'text',
		name: 'network',
	},
	{
		label: 'Valid',
		value: true,
		placeholder: 'Valid',
		type: 'boolean',
		name: 'valid',
	},
	{
		label: 'Time',
		name: 'time',
		value: '',
		placeholder: 'Time',
		type: 'time-picker',
	},
];

const filterOptions = [
	{
		label: 'User ID',
		value: 'user_id',
		name: 'user_id',
	},
	{
		label: 'Address',
		value: 'address',
		name: 'address',
	},
	{
		label: 'Currency',
		value: 'currency',
		name: 'currency',
	},
	{
		label: 'Network',
		value: 'network',
		name: 'network',
	},
	{
		label: 'Valid',
		value: 'valid',
		name: 'valid',
	},
	{
		label: 'Time',
		value: 'time',
		name: 'time',
	},
];

const Wallet = () => {
	const [userData, setUserData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [queryValues, setQueryValues] = useState({});

	useEffect(() => {
		setIsLoading(true);
		getWallet();
	}, []);

	const getWallet = async (values = {}) => {
		try {
			setQueryValues(values);
			const res = await getExchangeWallet(values);
			if (res && res.data) {
				setUserData(res.data);
				setIsLoading(false);
			}
		} catch (error) {
			message.error(error.data.message);
			setIsLoading(false);
		}
	};

	const requestDownload = () => {
		return getExchangeWalletCsv({ ...queryValues, format: 'csv' });
	};

	return (
		<div className="asset-exchange-wallet-wrapper">
			<div className="header-txt">Exchange wallets</div>
			<div className="wallet-filter-wrapper mt-4">
				<MultiFilter
					fields={filterFields}
					filterOptions={filterOptions}
					onHandle={getWallet}
					setIsLoading={setIsLoading}
					isLoading={isLoading}
				/>
			</div>
			<div className="mt-5">
				<span
					onClick={(e) => {
						requestDownload();
					}}
					className="mb-2 underline-text cursor-pointer"
				>
					Download below CSV table
				</span>
				<div className="mt-4">
					<Spin spinning={isLoading}>
						<Table columns={columns} dataSource={userData} />
					</Spin>
				</div>
			</div>
		</div>
	);
};

export default Wallet;
