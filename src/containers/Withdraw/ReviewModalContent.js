import React from 'react';
import math from 'mathjs';
import ReactSVG from 'react-svg';
import { Button } from '../../components';
import { formatToCurrency } from '../../utils/currency';
import { ICONS, BASE_CURRENCY } from '../../config/constants';

import STRINGS from '../../config/localizedStrings';

const ButtonSection = ({ onClickAccept, onClickCancel }) => {
	return (
		<div className="d-flex">
			<Button
				label={STRINGS.CANCEL}
				onClick={onClickCancel}
				className="button-fail"
			/>
			<div className="button-separator" />
			<Button
				label={STRINGS.NOTIFICATIONS.BUTTONS.OKAY}
				onClick={onClickAccept}
				className="button-success"
			/>
		</div>
	);
};

const ReviewModalContent = ({
	coins,
	currency,
	data,
	price,
	onClickAccept,
	onClickCancel
}) => {
	const { min } = coins[currency || BASE_CURRENCY] || {};
	const baseCoin = coins[BASE_CURRENCY] || {};
	const shortName = STRINGS[`${currency.toUpperCase()}_SHORTNAME`];
	const name = STRINGS[`${currency.toUpperCase()}_NAME`];

	const totalTransaction = math.number(
		math.add(math.fraction(data.amount), math.fraction(data.fee || 0))
	);

	const cryptoAmountText = STRINGS.formatString(
		STRINGS[`${currency.toUpperCase()}_PRICE_FORMAT`],
		formatToCurrency(totalTransaction, min),
		shortName
	);

	const feePrice = data.fee ? math.number(math.multiply(data.fee, price)) : 0;

	return (
		<div className="d-flex flex-column review-wrapper">
			<ReactSVG
				path={ICONS.CHECK_SENDING_BITCOIN}
				wrapperClassName="review-icon"
			/>
			{currency === BASE_CURRENCY ? (
				<div className="d-flex flex-column align-items-center review-info_container">
					<div className="review-info_message">
						{STRINGS.WITHDRAW_PAGE.MESSAGE_ABOUT_WITHDRAW}
					</div>
					<div className="review-crypto-amount review-crypto-address">
						<div>{cryptoAmountText}</div>
						<div className="review-fee_message">
							{STRINGS.formatString(
								STRINGS.WITHDRAW_PAGE.MESSAGE_FEE_BASE,
								STRINGS.formatString(
									STRINGS[`${BASE_CURRENCY.toUpperCase()}_PRICE_FORMAT`],
									formatToCurrency(data.fee, baseCoin.min),
									STRINGS[`${BASE_CURRENCY.toUpperCase()}_SHORTNAME`]
								)
							)}
						</div>
					</div>
				</div>
			) : (
				<div className="d-flex flex-column align-items-center review-info_container">
					<div className="review-info_message">
						{STRINGS.WITHDRAW_PAGE.MESSAGE_ABOUT_SEND}
					</div>
					<div className="review-crypto-amount review-crypto-address">
						<div>{cryptoAmountText}</div>
						<div className="review-fee_message">
							{STRINGS.formatString(
								STRINGS.WITHDRAW_PAGE.MESSAGE_FEE,
								data.fee,
								STRINGS.formatString(
									STRINGS[`${BASE_CURRENCY.toUpperCase()}_PRICE_FORMAT`],
									formatToCurrency(feePrice, baseCoin.min),
									STRINGS[`${BASE_CURRENCY.toUpperCase()}_SHORTNAME`]
								)
							)}
						</div>
					</div>
					<div className="review-warning_arrow" />
					<div className="review-crypto-address">{data.address}</div>
					<div className="warning_text review-info_message">
						{STRINGS.formatString(
							STRINGS.WITHDRAW_PAGE.MESSAGE_BTC_WARNING,
							name
						)}
					</div>
				</div>
			)}
			<ButtonSection
				onClickAccept={onClickAccept}
				onClickCancel={onClickCancel}
			/>
		</div>
	);
};

ReviewModalContent.defaultProps = {
	data: {},
	onClickAccept: () => {},
	onClickCancel: () => {},
	price: 0,
	coins: {}
};

export default ReviewModalContent;
