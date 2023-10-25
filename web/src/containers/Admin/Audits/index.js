import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { requestUserAudits, requestUserAuditsDownload } from './actions';
import SessionFilters from '../Sessions/SessionFilters';
import Moment from 'react-moment';

// const INITIAL_STATE = {
// 	audits: [],
// 	total: 0,
// 	loading: true,
// };

const formatDate = (value) => {
	return <Moment format="YYYY/MM/DD HH:mm">{value}</Moment>;
};

// const formatDescription = (value) => {
// 	if (value.old) {
// 		return Object.keys(value.old).map((item, key) => {
// 			return (
// 				<div key={item}>
// 					{item}: {JSON.stringify(value.old[item])} {'->'}{' '}
// 					{JSON.stringify(value.new[item])}
// 				</div>
// 			);
// 		});
// 	}
// 	return null;
// };

// const formatDescriptionNote = (value) => {
// 	return <div>{value.note}</div>;
// };

const fieldKeyValue = {
	user_id: {
		type: 'string',
		label: 'User id',
	},
	subject: {
		type: 'string',
		label: 'Action Owner',
	},
};

const defaultFilters = [
	{
		field: 'subject',
		type: 'string',
		label: 'Action Owner Email',
		value: null,
	},
	{
		field: 'user_id',
		type: 'string',
		label: 'Effected User id',
		value: null,
	},
];

const AUDIT_COLUMNS = [
	{ title: 'Action Owner', dataIndex: 'subject', key: 'subject' },
	{ title: 'Event', dataIndex: 'description', key: 'description' },
	{
		title: 'Effected User',
		dataIndex: 'user_id',
		key: 'user_id',
		render: (user_id, data) => {
			return (
				<div className="d-flex">
					{data?.user_id ? (
						<Button className="ant-btn green-btn ant-tooltip-open ant-btn-primary">
							{data?.user_id}
						</Button>
					) : (
						'-'
					)}
				</div>
			);
		},
	},
	{
		title: 'Time',
		dataIndex: 'timestamp',
		key: 'timestamp',
		render: formatDate,
	},
];
// const CSV_AUDIT_COLUMNS = [
// 	{ label: 'Event', dataIndex: 'event', key: 'event' },
// 	{ label: 'IP', dataIndex: 'ip', key: 'ip' },
// 	{ label: 'Domain', dataIndex: 'domain', key: 'domain' },
// 	{ label: 'Time', dataIndex: 'timestamp', key: 'timestamp' }
// ];

const Audits = () => {
	const [userData, setUserData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const [queryValues, setQueryValues] = useState({});
	const [queryFilters, setQueryFilters] = useState({
		total: 0,
		page: 1,
		pageSize: 10,
		limit: 50,
		currentTablePage: 1,
		isRemaining: true,
	});

	// const state = INITIAL_STATE;

	useEffect(() => {
		setIsLoading(true);
		handleUserAudits(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		handleUserAudits(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryValues]);

	const handleUserAudits = (page = 1, limit = 50) => {
		setIsLoading(true);
		requestUserAudits({ page, limit, ...queryValues })
			.then((response) => {
				console.log({ userData });
				setUserData(
					page === 1 ? response.data : [...userData, ...response.data]
				);

				setQueryFilters({
					total: response.count,
					fetched: true,
					page,
					currentTablePage: page === 1 ? 1 : queryFilters.currentTablePage,
					isRemaining: response.count > page * limit,
				});

				setIsLoading(false);
			})
			.catch((err) => {
				setIsLoading(false);
			});
	};

	const requestUserAuditsDownloads = () => {
		return requestUserAuditsDownload({ ...queryValues, format: 'csv' });
	};

	const pageChange = (count, pageSize) => {
		const { page, limit, isRemaining } = queryFilters;
		const pageCount = count % 5 === 0 ? 5 : count % 5;
		const apiPageTemp = Math.floor(count / 5);
		if (limit === pageSize * pageCount && apiPageTemp >= page && isRemaining) {
			handleUserAudits(page + 1, limit);
		}
		setQueryFilters({ ...queryFilters, currentTablePage: count });
	};

	return (
		<div className="app_container-content my-2 admin-user-container">
			<div style={{ color: '#ccc', marginTop: 20, marginBottom: 30 }}>
				Below are logs of the actions performed by admin typed users
			</div>
			<div style={{ marginTop: 20 }}>
				<SessionFilters
					applyFilters={(filters) => {
						setQueryValues(filters);
					}}
					fieldKeyValue={fieldKeyValue}
					defaultFilters={defaultFilters}
				/>
			</div>
			<div
				className="d-flex justify-content-between my-3"
				style={{ marginTop: 20 }}
			>
				<div>Number of events: {queryFilters.total}</div>
				<div
					className="pointer download-csv-table"
					onClick={() => requestUserAuditsDownloads()}
				>
					Download CSV table
				</div>
			</div>
			<Table
				spinning={isLoading}
				rowKey={(data) => {
					return data.id;
				}}
				columns={AUDIT_COLUMNS}
				dataSource={userData ? userData : 'No Data'}
				pagination={{
					current: queryFilters.currentTablePage,
					onChange: pageChange,
				}}
			/>
		</div>
	);
};

export default Audits;
