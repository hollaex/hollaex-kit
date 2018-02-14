import React from 'react';
import { formatTimestamp } from '../../utils/utils';

export const NotificationItem = (props) => {
	const { type, data, timestamp } = props;
	return (
		<div className="notifications_list-itme-container">
			{type && <div className="notifications_list-item-title">{type}</div>}
			{data && (
				<div className="notifications_list-item-text">
					{JSON.stringify(data)}
				</div>
			)}
			{timestamp && (
				<div className="notifications_list-item-timestamp">
					{formatTimestamp(timestamp)}
				</div>
			)}
		</div>
	);
};

const NotificationsList = ({ notifications }) => (
	<div className="notifications_list-wrapper">
		{/*notifications.map((currentNotification, index) => <NotificationItem {...currentNotification} key={index} />)*/}
	</div>
);

export default NotificationsList;
