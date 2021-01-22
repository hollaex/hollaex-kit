import React, { useEffect, useState } from 'react';
import { Button, Table, message } from 'antd';

import { ModalForm } from '../../../components';
import {
	requestAnnouncements,
	requestPostAnnouncement,
	requestDeleteAnnouncement,
} from './action';

const Form = ModalForm('AddAnnouncementForm', '');

const Fields = {
	title: {
		type: 'text',
		label: 'Title',
	},
	message: {
		type: 'editor',
		label: 'Message',
	},
	type: {
		type: 'text',
		label: 'type',
	},
};

const Announcement = (props) => {
	const limit = 50;
	const [announcements, setAnnouncements] = useState([]);
	const [page, setPage] = useState(1);
	const [currentTablePage, setCurrentTablePage] = useState(1);
	const [isRemaining, setIsRemaining] = useState(true);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		requestPosts();
		//  TODO: Fix react-hooks/exhaustive-deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const requestPosts = (pageNo = 1) => {
		requestAnnouncements({ pageNo, limit })
			.then((res) => {
				let temp = pageNo === 1 ? res.data : [...announcements, ...res.data];
				setAnnouncements(temp);
				setPage(pageNo);
				setCurrentTablePage(pageNo === 1 ? 1 : currentTablePage);
				setIsRemaining(res.count > pageNo * limit);
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
			});
	};

	const pageChange = (count, pageSize) => {
		const pageCount = count % 5 === 0 ? 5 : count % 5;
		const apiPageTemp = Math.floor(count / 5);
		if (limit === pageSize * pageCount && apiPageTemp >= page && isRemaining) {
			requestPosts(page + 1);
		}
		setCurrentTablePage(count);
	};

	const openAddForm = () => {
		setIsOpen(!isOpen);
	};

	const handleAddPost = (formProps) => {
		requestPostAnnouncement(formProps)
			.then((res) => {
				setAnnouncements([res, ...announcements]);
				openAddForm();
				message.success('Announcement added successfully');
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
			});
	};

	const handleDeleteRequest = (data) => {
		requestDeleteAnnouncement({ id: data.id })
			.then((res) => {
				let temp = announcements.filter((val) => val.id !== data.id);
				setAnnouncements(temp);
				message.success(res.message);
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
			});
	};

	const createMarkup = (row) => {
		return { __html: row };
	};

	const COLUMNS = [
		{ title: 'title', dataIndex: 'title', key: 'title' },
		{
			title: 'message',
			dataIndex: 'message',
			key: 'message',
			render: (row) => <div dangerouslySetInnerHTML={createMarkup(row)} />,
		},
		{ title: 'type', dataIndex: 'type', key: 'type' },
		{
			title: '',
			dataIndex: '',
			key: 'action',
			render: (row) => (
				<Button type="primary" onClick={() => handleDeleteRequest(row)}>
					Delete
				</Button>
			),
		},
	];

	return (
		<div>
			<div className="d-flex justify-content-end mb-3">
				<Button type="primary" onClick={openAddForm}>
					Add new
				</Button>
			</div>
			<div>
				<Table
					columns={COLUMNS}
					dataSource={announcements}
					rowKey={(data) => {
						return data.id;
					}}
					pagination={{
						current: currentTablePage,
						onChange: pageChange,
					}}
				/>
			</div>
			<Form
				visible={isOpen}
				title={'Add Announcement'}
				okText="Save"
				fields={isOpen ? Fields : {}}
				initialValues={{ type: 'info' }}
				onSubmit={handleAddPost}
				onCancel={openAddForm}
			/>
		</div>
	);
};

export default Announcement;
