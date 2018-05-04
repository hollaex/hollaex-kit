import React from 'react';
import { connect } from 'react-redux';
import { formatTimestamp } from '../../utils/utils';

export const NotificationItem = (props) => {
	const { type, message, timestamp } = props;
	return (
		<div className="notifications_list-item-container">
			{type && <div className="notifications_list-item-title">{type}</div>}
			<div className="notifications_list-item-text">{message}</div>
			{timestamp && (
				<div className="notifications_list-item-timestamp">
					{formatTimestamp(timestamp)}
				</div>
			)}
		</div>
	);
};

// TODO create announcement item style
const NotificationsList = ({ announcements }) => (
	<div className="notifications_list-wrapper">
		{/*announcements.map(({ id, ...rest }, index) => (
			<NotificationItem {...rest} key={id} />
		))*/}
	</div>
);

const mapStateToProps = (store) => ({
	announcements: store.app.announcements
});

export default connect(mapStateToProps)(NotificationsList);
