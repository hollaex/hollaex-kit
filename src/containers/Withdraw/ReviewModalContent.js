import React from 'react';
import math from 'mathjs';
import { Button } from '../../components';
import { fiatSymbol, fiatFormatToCurrency } from '../../utils/currency';
import { CURRENCIES, ICONS } from '../../config/constants';

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
	symbol,
	data,
	price,
	onClickAccept,
	onClickCancel
}) => {
	const { shortName, name, formatToCurrency } = CURRENCIES[symbol];
	const totalTransaction = math.number(
		math.add(math.fraction(data.amount), math.fraction(data.fee || 0))
	);
	const cryptoAmountText = STRINGS.formatString(
		STRINGS.BTC_PRICE_FORMAT,
		formatToCurrency(totalTransaction),
		shortName
	);
	const feePrice = data.fee ? math.number(math.multiply(data.fee, price)) : 0;
	return (
		<div className="d-flex flex-column review-wrapper">
			<img
				src={ICONS.CHECK_SENDING_BITCOIN}
				alt="review"
				className="review-icon"
			/>
			{symbol === fiatSymbol ? (
				<div className="d-flex flex-column align-items-center review-info_container">
					<div className="review-info_message">
						{STRINGS.WITHDRAW_PAGE.MESSAGE_ABOUT_WITHDRAW}
					</div>
					<div className="review-crypto-amount">{cryptoAmountText}</div>
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
									STRINGS.FIAT_PRICE_FORMAT,
									fiatFormatToCurrency(feePrice),
									STRINGS.FIAT_SHORTNAME
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
	price: 0
};

export default ReviewModalContent;
