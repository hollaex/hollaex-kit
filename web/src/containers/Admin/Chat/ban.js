import React from 'react';
import { List, Button } from 'antd';
import { InputBox } from './InputBox';

const renderItem = (unbanUser, bannedUsers) => (user_id) => {
	return (
		<List.Item
			actions={[
				<Button type="danger" onClick={() => unbanUser(user_id)} size="small">
					UNBAN
				</Button>,
			]}
		>
			<List.Item.Meta
				title={<span className="text-white">USER ID: {user_id}</span>}
				description={
					<span className="text-white">USERNAME: {bannedUsers[user_id]}</span>
				}
			/>
		</List.Item>
	);
};

export const Ban = ({ bannedUsers, unbanUser, banUser }) => {
	return (
		<div>
			<InputBox placeholder="Username" onSearch={banUser} enterButton="BAN" />
			<List
				className="banlist"
				itemLayout="horizontal"
				header={<h3>Banned Users</h3>}
				dataSource={Object.keys(bannedUsers)}
				renderItem={renderItem(unbanUser, bannedUsers)}
			/>
		</div>
	);
};
