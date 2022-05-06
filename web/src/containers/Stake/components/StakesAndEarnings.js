import React from 'react';
import { connect } from 'react-redux';
import { userStakesValueSelector } from 'containers/Stake/selector';
import ConnectWrapper from './ConnectWrapper';
import STRINGS from 'config/localizedStrings';
import { formatToCurrency } from 'utils/currency';
import {
	BASE_CURRENCY,
	CURRENCY_PRICE_FORMAT,
	DEFAULT_COIN_DATA,
} from 'config/constants';

const StakesAndEarnings = ({ totalEarningsValue, totalStakesValue, coins }) => {
	const { min, display_name = '' } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;

	const totalStakesString = STRINGS.formatString(
		CURRENCY_PRICE_FORMAT,
		display_name,
		formatToCurrency(totalStakesValue, min)
	);

	const totalEarningsString = STRINGS.formatString(
		CURRENCY_PRICE_FORMAT,
		display_name,
		formatToCurrency(totalEarningsValue, min)
	);

	return (
		<div
			className="secondary-text"
			style={{
				minWidth: 'max-content',
				paddingTop: '0.5rem',
				textAlign: 'right',
				marginLeft: '3rem',
			}}
		>
			<div>
				<div>{STRINGS['STAKE.ESTIMATED_STAKED']}</div>
				<div>
					<ConnectWrapper>{totalStakesString}</ConnectWrapper>
				</div>
				<div className="kit-divider" />
			</div>
			<div>
				<div>{STRINGS['STAKE.ESTIMATED_EARNINGS']}</div>
				<div>
					<ConnectWrapper>{totalEarningsString}</ConnectWrapper>
				</div>
				<div className="kit-divider" />
			</div>
		</div>
	);
};

const mapStateToProps = (store) => ({
	coins: store.app.coins,
	...userStakesValueSelector(store),
});

export default connect(mapStateToProps)(StakesAndEarnings);
