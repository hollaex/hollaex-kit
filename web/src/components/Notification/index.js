import React from 'react';
import { NOTIFICATIONS } from '../../actions/appActions';

import Deposit from './Deposit';
import Withdraw from './Withdraw';
import Order from './Order';
import Trade from './Trade';
import Verification from './Verification';
import Logout from './Logout';
import ContactForm from './ContactForm';
import NewOrder from './NewOrder';
import GenerateAddressNotification from './GenerateAddress';
import InviteFriends from './InviteFriends';
import StakeToken from './StakeToken';
import ReferralSuccess from './ReferralSuccess';
import { GenerateApiKey, CreatedApiKey } from './GenerateApiKey';
import withConfig from 'components/ConfigProvider/withConfig';

const generateNotificationContent = ({ type, data, ...rest }) => {
	switch (type) {
		case NOTIFICATIONS.DEPOSIT:
			return <Deposit data={data} {...rest} />;
		case NOTIFICATIONS.WITHDRAWAL:
			return <Withdraw data={data} type={type} {...rest} />;
		case NOTIFICATIONS.ORDERS:
			return <Order {...data} {...rest} />;
		case NOTIFICATIONS.TRADES:
			return <Trade data={data} {...rest} />;
		case NOTIFICATIONS.LOGOUT:
			return <Logout data={data} {...rest} />;
		case NOTIFICATIONS.VERIFICATION:
			return <Verification data={data} />;
		case NOTIFICATIONS.CONTACT_FORM:
			return <ContactForm {...rest} data={data} />;
		case NOTIFICATIONS.XHT_SUCCESS_ACCESS:
			return <ReferralSuccess {...rest} data={data} />;
		case NOTIFICATIONS.NEW_ORDER:
			return <NewOrder data={data} {...rest} />;
		case NOTIFICATIONS.GENERATE_API_KEY:
			return <GenerateApiKey data={data} {...rest} />;
		case NOTIFICATIONS.CREATED_API_KEY:
			return <CreatedApiKey data={data} {...rest} />;
		case NOTIFICATIONS.GENERATE_ADDRESS:
			return <GenerateAddressNotification data={data} {...rest} />;
		case NOTIFICATIONS.INVITE_FRIENDS:
			return <InviteFriends data={data} {...rest} />;
		case NOTIFICATIONS.STAKE_TOKEN:
			return <StakeToken data={data} {...rest} />;
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
	data: {},
	icons: {},
};

export default withConfig(Notification);
