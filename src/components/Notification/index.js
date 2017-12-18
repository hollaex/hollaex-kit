import React from 'react';
import { NOTIFICATIONS } from '../../actions/appActions';

import Header from './Header';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import Order from './Order';
import Trade from './Trade';
import Logout from './Logout';

const generateNotificationContent = ({ type, data, ...rest }) => {
  switch (type) {
    case NOTIFICATIONS.DEPOSIT:
      return <Deposit data={data} {...rest} />;
    case NOTIFICATIONS.WITHDRAWAL:
      return <Withdraw data={data} type={type} />
    case NOTIFICATIONS.ORDERS:
      return <Order {...data} />
    case NOTIFICATIONS.TRADES:
      return <Trade data={data} />
    case NOTIFICATIONS.LOGOUT:
      return <Logout data={data} {...rest} />
    default:
      break;
  }
}

const Notification = (props) => (
  <div className="notification-wrapper d-flex">
    {generateNotificationContent(props)}
  </div>
);

Notification.defaultProps = {
  type: '',
  data: {},
}

export default Notification;
