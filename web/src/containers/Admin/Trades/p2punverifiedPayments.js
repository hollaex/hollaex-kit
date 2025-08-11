import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Table, Button, Select } from 'antd';

import { fetchP2PPaymentMethods } from '../User/actions';

const users = [
	{
		title: 'User ID',
		dataIndex: 'user_id',
		key: 'user_id',
		render: (user_id, data) => {
			return (
				<div className="d-flex">
					<Button className="ant-btn green-btn ant-tooltip-open ant-btn-primary">
						<Link to={`/admin/user?id=${data?.user_id}`}>{data?.user_id}</Link>
					</Button>
				</div>
			);
		},
	},
	{
		title: 'Payment Method',
		dataIndex: 'payment_method',
		key: 'payment_method',
		render: (user_id, data) => {
			return <div className="d-flex">{data?.name}</div>;
		},
	},
	{
		title: 'Details',
		dataIndex: 'details',
		key: 'details',
		render: (user_id, data) => {
			return (
				<div className="d-flex">
					<ul>
						{data?.details?.fields.map((field) => (
							<li key={field?.id}>
								{field?.name}: {field?.value}
							</li>
						))}
					</ul>
				</div>
			);
		},
	},
	{
		title: 'Status',
		dataIndex: 'status',
		key: 'status',
		render: (user_id, data) => {
			return (
				<div className="d-flex">
					{data?.status === 0 && 'Unverified'}
					{data?.status === 3 && 'Verified'}
				</div>
			);
		},
	},
];

const P2PUnverifiedPayments = () => {
	const [userList, setUserList] = useState([]);
	const [selectedStatus, setSelectedStatus] = useState('Unverified Accounts');
	const paymentMethods = ['Unverified Accounts', 'Verified Accounts'];

	const fetchPayment = async () => {
		try {
			const payment = await fetchP2PPaymentMethods();
			setUserList(payment || []);
		} catch (err) {
			console.error('err', err);
		}
	};

	useEffect(() => {
		fetchPayment();
	}, []);

	const getStatusCode = (label) => {
		if (label?.toLowerCase() === 'unverified accounts') return 0;
		if (label?.toLowerCase() === 'verified accounts') return 3;
		return null;
	};

	const filteredData = userList?.data?.filter(
		(user) => user?.status === getStatusCode(selectedStatus)
	);

	return (
		<div className="p2p-payment-details">
			<Select
				value={selectedStatus}
				onChange={setSelectedStatus}
				dropdownClassName="blue-admin-select-dropdown"
				getPopupContainer={(triggerNode) => triggerNode.parentNode}
				className="p2p-payment-methods-filter mb-4 mt-3"
			>
				{paymentMethods?.map((method, index) => (
					<Select.Option value={method} key={index}>
						{method}
					</Select.Option>
				))}
			</Select>
			<Table
				columns={users}
				dataSource={filteredData}
				rowKey="id"
				pagination={{ pageSize: 10 }}
			/>
		</div>
	);
};

export default P2PUnverifiedPayments;
