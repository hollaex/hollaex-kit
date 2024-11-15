import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Table, Button } from 'antd';

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
			return <div className="d-flex">{data?.status === 0 && 'Unverified'}</div>;
		},
	},
];

const P2PUnverifiedPayments = () => {
	const [userList, setUserList] = useState([]);

	const fetchPayment = async () => {
		try {
			const payment = await fetchP2PPaymentMethods();
			setUserList(payment);
		} catch (err) {
			console.error('err', err);
		}
	};

	useEffect(() => {
		fetchPayment();
	}, []);

	const filterByPayment = userList?.data?.filter((data) => data?.status === 0);

	return (
		<div>
			<Table
				columns={users}
				dataSource={filterByPayment}
				pagination={{ pageSize: 10 }}
			/>
		</div>
	);
};

export default P2PUnverifiedPayments;
