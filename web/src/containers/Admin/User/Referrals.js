import React, { useState, useEffect, useCallback } from 'react';
import { Table, Spin, Alert } from 'antd';
import { getUserReferer, getUserAffiliation } from './actions';
import { formatTimestampGregorian, DATETIME_FORMAT } from 'utils/date';
import './index.css';

const COLUMNS = [
	{
		title: 'Time referred /signed up',
		dataIndex: 'created_at',
		key: 'created_at',
		render: (value) => (
			<div>{formatTimestampGregorian(value, DATETIME_FORMAT)}</div>
		),
	},
	{
		title: 'Refereed user',
		dataIndex: 'user',
		key: 'user',
		render: ({ id, email }) => (
			<div className="d-flex">
				<div className="d-flex justify-content-center align-items-center green-badge">
					{id}
				</div>
				<div className="px-2">{email}</div>
			</div>
		),
	},
];

const LIMIT = 50;

const Referrals = ({ userInformation: { id: userId, affiliation_code } }) => {
	const [loading, setLoading] = useState(true);
	const [invitedBy, setInvitedBy] = useState();
	const [data, setData] = useState([]);
	const [currentTablePage, setCurrentTablePage] = useState(1);
	const [page, setPage] = useState(1);
	const [count, setCount] = useState();
	const [isRemaining, setIsRemaining] = useState(true);
	const [error, setError] = useState();
	const referralLink = `${process.env.REACT_APP_PUBLIC_URL}/signup?affiliation_code=${affiliation_code}`;

	const requestAffiliations = useCallback(
		(page, limit) => {
			getUserAffiliation(userId, page, limit)
				.then((response) => {
					setData((prevData) =>
						page === 1 ? response.data : [...prevData, ...response.data]
					);
					setLoading(false);
					setCurrentTablePage((prevCurrentTablePage) =>
						page === 1 ? 1 : prevCurrentTablePage
					);
					setPage(page);
					setIsRemaining(response.count > page * limit);
					setCount(response.count);
				})
				.catch((error) => {
					const message = error.data ? error.data.message : error.message;
					setLoading(false);
					setError(message);
				});
		},
		[userId]
	);

	const onPageChange = (count, pageSize) => {
		const pageCount = count % 5 === 0 ? 5 : count % 5;
		const apiPageTemp = Math.floor(count / 5);

		if (LIMIT === pageSize * pageCount && apiPageTemp >= page && isRemaining) {
			requestAffiliations(page + 1, LIMIT);
		}

		setCurrentTablePage(count);
	};

	useEffect(() => {
		getUserReferer(userId).then(({ email }) => {
			setInvitedBy(email);
			setLoading(false);
			requestAffiliations(1, LIMIT);
		});
	}, [userId, requestAffiliations]);

	if (loading) {
		return (
			<div className="app_container-content">
				<Spin size="large" />
			</div>
		);
	}

	return (
		<div className="admin-user-container">
			<div className="mt-2">
				Referral affiliation information and table displaying all the successful
				referrals that were onboarded onto the platform from this user.
			</div>
			<div className="d-flex align-items-center m-4">
				<div className="d-flex">
					<div className="bold">Invited by: </div>
					<div className="px-2">{invitedBy}</div>
				</div>
				<div className="user-info-separator" />
				<div className="d-flex">
					<div className="bold">Total referred: </div>
					<div className="px-2">{count}</div>
				</div>
				<div className="user-info-separator" />
				<div className="d-flex">
					<div className="bold">Referral link: </div>
					<div className="px-2">{referralLink}</div>
				</div>
			</div>
			<div>
				{error && (
					<Alert
						message={error}
						type="error"
						showIcon
						onClose={setError}
						closable={true}
						closeText="Close"
					/>
				)}
				<div className="bold">Affiliation referral table</div>
				<Table
					className="blue-admin-table"
					columns={COLUMNS}
					dataSource={data}
					pagination={{
						current: currentTablePage,
						onChange: onPageChange,
					}}
				/>
			</div>
		</div>
	);
};

export default Referrals;
