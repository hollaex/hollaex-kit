import React, { useEffect, useState } from 'react';
import { message, Table, Button, Spin } from 'antd';
import { requestUserBalancesDownload } from '../User/actions';
import MultiFilter from './TableFilter';
import { getExchangeBalances } from './action';

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
		dataIndex: 'symbol',
		key: 'symbol',
	},
	{
		title: 'Available Balance',
		dataIndex: 'available',
		key: 'available',
		render: (available, data) => {
			return (
				<div>
					{parseFloat(data.available)}
				</div>
			);
		},
	},
	{
		title: 'Total Balance',
		dataIndex: 'balance',
		key: 'balance',
		render: (balance, data) => {
			return (
				<div>
					{parseFloat(data.balance)}
				</div>
			);
		},
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
		label: 'Currency',
		value: '',
		placeholder: 'Currency',
		type: 'select',
		name: 'currency',
	},
];

const filterOptions = [
	{
		label: 'User ID',
		value: 'user_id',
		name: 'user_id',
	},
	{
		label: 'Currency',
		value: 'currency',
		name: 'currency',
	}

];

const Balances = () => {
	const [userData, setUserData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		getBalances();
	}, []);

	const getBalances = async (values = {}) => {
		try {
			const res = await getExchangeBalances(values);
			if (res && res.data) {
				setUserData(res.data);
				setIsLoading(false);
			}
		} catch (error) {
			message.error(error.data.message);
			setIsLoading(false);
		}
	};

	const requestDownload = (params = {}) => {
		return requestUserBalancesDownload({ ...params, format: 'all' });
	};

	return (
		<div className="asset-exchange-wallet-wrapper">
			<div className="header-txt">Exchange balances</div>
			<div className="wallet-filter-wrapper mt-4">
				<MultiFilter
					fields={filterFields}
					filterOptions={filterOptions}
					onHandle={getBalances}
					setIsLoading={setIsLoading}
					isLoading={isLoading}
				/>
			</div>
			<div className="mt-5">
				<span
					onClick={requestDownload}
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

export default Balances;
