import React from 'react';
import { NOTIFICATIONS } from '../../actions/appActions';

import Deposit from './Deposit';
import Withdraw from './Withdraw';
import Order from './Order';
import Trade from './Trade';
import Verification from './Verification';
import Logout from './Logout';

const generateNotificationContent = ({ type, data, ...rest }) => {
	console.log(type, data);
	switch (type) {
		case NOTIFICATIONS.DEPOSIT:
			return <Deposit data={data} {...rest} />;
		case NOTIFICATIONS.WITHDRAWAL:
			return <Withdraw data={data} type={type} {...rest} />;
		case NOTIFICATIONS.ORDERS:
			return <Order {...data} />;
		case NOTIFICATIONS.TRADES:
			return <Trade data={data} />;
		case NOTIFICATIONS.LOGOUT:
			return <Logout data={data} {...rest} />;
		case NOTIFICATIONS.VERIFICATION:
			return <Verification data={data} />;
		default:
			break;
	}
};

const Notification = (props) => (
	<div className="notification-wrapper d-flex">
		{generateNotificationContent(props)}
	</div>
);

Notification.defaultProps = {
	type: '',
	data: {}
};

export default Notification;
