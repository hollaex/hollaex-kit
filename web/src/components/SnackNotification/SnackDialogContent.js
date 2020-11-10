import React from 'react';

import Trade from './Trade';
import OrderNotification from './Order';

const generateContent = ({ type, ...rest }) => {
	switch (type) {
		case 'trade':
			return <Trade {...rest} />;
		case 'order':
			return <OrderNotification {...rest} />;
		default:
			return (
				<div style={{ height: '2rem', width: '100%', color: '#fff' }}>
					{rest.content}
				</div>
			);
	}
};

const SnackDialogContent = (props) => {
	return <div className="notification-wrapper">{generateContent(props)}</div>;
};

export default SnackDialogContent;
