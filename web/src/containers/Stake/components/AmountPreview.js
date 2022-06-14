import React from 'react';
import { connect } from 'react-redux';
import mathjs from 'mathjs';
import { EditWrapper, Image } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { formatToCurrency } from 'utils/currency';
import {
	BASE_CURRENCY,
	CURRENCY_PRICE_FORMAT,
	APPROXIMATELY_EQAUL_CURRENCY_PRICE_FORMAT,
	DEFAULT_COIN_DATA,
} from 'config/constants';

const AmountPreview = ({
	amount = 0,
	symbol: token = 'xht',
	labelId = 'STAKE.AMOUNT_LABEL',
	coins,
	icons: ICONS,
	price,
}) => {
	const { min: baseMin, display_name: base_display = '' } =
		coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
	const { min: tokenMin, display_name: token_display = '', icon_id } =
		coins[token] || DEFAULT_COIN_DATA;

	const format = (value, displayName, min, format = CURRENCY_PRICE_FORMAT) =>
		STRINGS.formatString(format, formatToCurrency(value, min), displayName);

	const formatToken = (value) => format(value, token_display, tokenMin);
	const formatBase = (value) =>
		format(
			value,
			base_display,
			baseMin,
			APPROXIMATELY_EQAUL_CURRENCY_PRICE_FORMAT
		);

	const amountValue = mathjs.multiply(amount, price);

	return (
		<div className="pt-4">
			<div className="bold">
				<EditWrapper stringId={labelId}>{STRINGS[labelId]}</EditWrapper>
			</div>
			<div className="d-flex align-center pt-2">
				<div>
					<Image
						iconId={icon_id}
						icon={ICONS[icon_id]}
						wrapperClassName="stake-currency-ball"
					/>
				</div>
				<div className="stake-amount pl-2">
					<div>{formatToken(amount)}</div>
					<div className="secondary-text small">{formatBase(amountValue)}</div>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (store, { symbol }) => {
	const price = store.asset.oraclePrices[symbol];

	return {
		coins: store.app.coins,
		price,
	};
};

export default connect(mapStateToProps)(withConfig(AmountPreview));
