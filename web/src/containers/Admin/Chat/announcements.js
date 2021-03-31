import React from 'react';
import { List, Button } from 'antd';
import { InputBox } from './InputBox';

const renderItem = (deleteAnnouncement) => ({ id, message, ...rest }) => {
	return (
		<List.Item
			actions={[
				<Button
					type="danger"
					onClick={() => deleteAnnouncement(id)}
					size="small"
				>
					DELETE
				</Button>,
			]}
		>
			<List.Item.Meta title={`${message}`} description={JSON.stringify(rest)} />
		</List.Item>
	);
};

export const Announcements = ({
	announcements,
	deleteAnnouncement,
	addAnnouncement,
}) => {
	return (
		<div>
			<InputBox
				placeholder="Type the announcement message"
				onSearch={addAnnouncement}
				type="textarea"
			/>
			<List
				itemLayout="horizontal"
				header={<h3>Announcements</h3>}
				dataSource={announcements}
				renderItem={renderItem(deleteAnnouncement)}
			/>
		</div>
	);
};
