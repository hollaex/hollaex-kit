import React from 'react';
import EventListener from 'react-event-listener';
import { connect } from 'react-redux';
import { ICONS, DEFAULT_COIN_DATA } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import {
	NotificationWraper,
	NotificationContent,
	InformationRow,
} from './Notification';
import { Button } from '../';

const generateRows = ({ wave, pair }, pairs, coins) => {
	const { no, amount, filled, floor } = wave;
	const pairData = pairs[pair];
	// const secondaryFormat = coins[pairData.pair_2] || DEFAULT_COIN_DATA;
	const rows = [];

	rows.push({
		label: STRINGS['WAVES.NEXT_WAVE'],
		value: no,
	});

	rows.push({
		label: STRINGS['WAVES.WAVE_AMOUNT'],
		value: `${amount} XHT`,
	});

	rows.push({
		label: STRINGS['WAVES.FLOOR'],
		value: floor,
	});

	rows.push({
		label: STRINGS['FILLED'],
		value: filled,
	});

	// rows.push({
	//     label: STRINGS["WAVES.LAST_WAVE"],
	//     value: filled
	// });

	return rows;
};

const OrderDisplay = ({ rows }) => {
	return (
		<NotificationContent>
			{rows.map((row, index) => (
				<InformationRow {...row} key={index} />
			))}
		</NotificationContent>
	);
};

const WaveNotification = ({ type, data, coins, pairs, onBack, onConfirm }) => {
	const rows = generateRows(data, pairs, coins);
	const onConfirmClick = () => {
		onConfirm();
		onBack();
	};

	const onKeydown = ({ key }) => {
		if (key === 'Enter') {
			onConfirmClick();
		}
	};

	return (
		<NotificationWraper
			title={STRINGS['WAVES.TITLE']}
			icon={ICONS.INCOMING_WAVE}
			className="new-order-notification"
		>
			<EventListener target="document" onKeydown={onKeydown} />
			<OrderDisplay rows={rows} />
			<div className="d-flex">
				<Button label={STRINGS['BACK_TEXT']} onClick={onBack} />
				<div className="separator" />
				<Button label={STRINGS['GOTO_XHT_MARKET']} onClick={onConfirmClick} />
			</div>
		</NotificationWraper>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
	pairs: state.app.pairs,
});

export default connect(mapStateToProps)(WaveNotification);
