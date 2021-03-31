import React from 'react';
import { List, Button } from 'antd';
import { InputBox } from './InputBox';

const renderItem = (deleteMessage, banUser, bannedUsers) => ({
	id,
	username,
	message,
	...rest
}) => {
	return (
		<List.Item
			actions={[
				<Button type="danger" onClick={() => deleteMessage(id)} size="small">
					DELETE
				</Button>,
				<Button
					type="danger"
					onClick={() => banUser(username)}
					size="small"
					disabled={bannedUsers[username]}
				>
					BAN USER
				</Button>,
			]}
		>
			<List.Item.Meta
				title={`${message} - ${username}`}
				description={JSON.stringify(rest)}
			/>
		</List.Item>
	);
};

export const Messages = ({
	messages,
	deleteMessage,
	addMessage,
	banUser,
	bannedUsers,
}) => {
	return (
		<div>
			<InputBox
				placeholder="Type the message"
				onSearch={addMessage}
				type="textarea"
			/>
			<List
				itemLayout="horizontal"
				header={<h3>Messages</h3>}
				dataSource={messages}
				renderItem={renderItem(deleteMessage, banUser, bannedUsers)}
			/>
		</div>
	);
};
