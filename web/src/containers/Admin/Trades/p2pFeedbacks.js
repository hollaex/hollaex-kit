import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { Button, Rate, Spin, Table } from 'antd';
import { fetchFeedback } from 'containers/P2P/actions/p2pActions';

const columns = [
	{
		title: 'Transaction Id',
		render: ({ transaction_id }) => (
			<Button className="green-btn no-border">{transaction_id}</Button>
		),
	},
	{
		title: 'User Id',
		render: ({ user }) => (
			<Button className="green-btn no-border">
				<Link to={`/admin/user?id=${user?.id}`}>{user?.id}</Link>
			</Button>
		),
	},
	{
		title: 'Merchant Id',
		render: ({ merchant_id }) => (
			<Button className="green-btn no-border">
				<Link to={`/admin/user?id=${merchant_id}`}>{merchant_id}</Link>
			</Button>
		),
	},
	{
		title: 'User Name',
		render: ({ user }) => <div>{user?.full_name || 'Anonymous'}</div>,
	},
	{
		title: 'Comments',
		className: 'comments-title',
		render: ({ comment }) => <div>{comment}</div>,
	},
	{
		title: 'Ratings',
		render: ({ rating }) => (
			<Rate disabled allowHalf={false} allowClear={false} value={rating} />
		),
	},
];

const P2PFeedbacks = () => {
	const [p2pFeedBacks, setP2pFeedbacks] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		getFeedbackDetails();
	}, []);

	const getFeedbackDetails = async () => {
		setIsLoading(true);
		try {
			const feedBackDetails = await fetchFeedback();
			setP2pFeedbacks(feedBackDetails?.data);
		} catch (err) {
			console.error(err);
		}
		setIsLoading(false);
	};
	return (
		<div className="p2p-feedbacks-wrapper">
			<div className="p2p-feedback-title-wrapper">
				<span className="p2p-feedback-title font-weight-bold">Feedback</span>
				<span className="p2p-feedback-description">
					User order P2P feedback and ratings.
				</span>
			</div>
			<Spin spinning={isLoading}>
				<Table
					className="blue-admin-table mt-5"
					dataSource={p2pFeedBacks}
					columns={columns}
				/>
			</Spin>
		</div>
	);
};

export default P2PFeedbacks;
