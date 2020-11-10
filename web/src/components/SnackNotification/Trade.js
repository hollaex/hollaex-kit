import React from 'react';
import { connect } from 'react-redux';

import { NotificationWraperMobile } from '../Notification/Notification';
import { getTitleAndIcon, TradeDisplay } from '../Notification/Trade';

const Trade = ({ onClose, data: { order, data }, pairs, coins }) => {
	const { side, type } = order;
	const notificationProps = getTitleAndIcon(side, type);
	return (
		<NotificationWraperMobile
			{...notificationProps}
			className="trade-notification"
			onClose={onClose}
		>
			<TradeDisplay side={side} data={data} pairs={pairs} coins={coins} />
		</NotificationWraperMobile>
	);
};

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
	coins: state.app.coins,
});

export default connect(mapStateToProps)(Trade);
