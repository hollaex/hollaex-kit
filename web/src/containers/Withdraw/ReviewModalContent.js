import React from 'react';
import math from 'mathjs';
import Image from 'components/Image';
import { Button } from 'components';
import { formatToCurrency } from 'utils/currency';
import {
	BASE_CURRENCY,
	CURRENCY_PRICE_FORMAT,
	DEFAULT_COIN_DATA,
} from 'config/constants';
import withConfig from 'components/ConfigProvider/withConfig';
import { EditWrapper } from 'components';
import { getNetworkNameByKey } from 'utils/wallet';
import { limitNumberWithinRange } from 'utils/math';
import STRINGS from 'config/localizedStrings';

const ButtonSection = ({ onClickAccept, onClickCancel }) => {
	return (
		<div className="d-flex">
			<Button
				label={STRINGS['CANCEL']}
				onClick={onClickCancel}
				className="button-fail"
			/>
			<div className="button-separator" />
			<Button
				label={STRINGS['NOTIFICATIONS.BUTTONS.OKAY']}
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
	onClickCancel,
	icons: ICONS,
	hasDestinationTag,
}) => {
	const { min, fullname, display_name, withdrawal_fees, network } =
		coins[currency || BASE_CURRENCY] || DEFAULT_COIN_DATA;
	const baseCoin = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
	const fee_coin = data.fee_coin ? data.fee_coin : '';
	const fee_type = data.fee_type ? data.fee_type : '';
	const isPercentage = fee_type === 'percentage';
	const hasDifferentFeeCoin =
		!isPercentage && fee_coin && fee_coin !== currency;

	let min_fee;
	let max_fee;
	const feeKey = network ? data.network : currency;
	if (withdrawal_fees && withdrawal_fees[feeKey]) {
		min_fee = withdrawal_fees[feeKey].min;
		max_fee = withdrawal_fees[feeKey].max;
	}

	const fee = isPercentage
		? limitNumberWithinRange(
				math.number(
					math.multiply(
						math.fraction(data.amount),
						math.fraction(math.divide(math.fraction(data.fee), 100) || 0)
					)
				),
				min_fee,
				max_fee
		  )
		: data.fee
		? data.fee
		: 0;

	const feePrice = math.number(math.multiply(fee, price));

	const totalTransaction = hasDifferentFeeCoin
		? math.number(math.fraction(data.amount))
		: math.number(math.add(math.fraction(data.amount), fee));

	const cryptoAmountText = STRINGS.formatString(
		CURRENCY_PRICE_FORMAT,
		formatToCurrency(totalTransaction, min),
		display_name
	);

	const { display_name: fee_coin_display } =
		coins[fee_coin] || DEFAULT_COIN_DATA;

	const withdrawFeeMessage = hasDifferentFeeCoin
		? STRINGS.formatString(
				STRINGS['WITHDRAW_PAGE.MESSAGE_FEE_COIN'],
				STRINGS.formatString(CURRENCY_PRICE_FORMAT, fee, fee_coin_display)
		  )
		: STRINGS.formatString(
				STRINGS['WITHDRAW_PAGE.MESSAGE_FEE'],
				fee,
				STRINGS.formatString(
					CURRENCY_PRICE_FORMAT,
					formatToCurrency(feePrice, baseCoin.min),
					baseCoin.display_name
				)
		  );

	return (
		<div className="d-flex flex-column review-wrapper">
			<Image
				iconId="CHECK_SENDING_BITCOIN"
				icon={ICONS['CHECK_SENDING_BITCOIN']}
				wrapperClassName="review-icon"
			/>
			<div className="d-flex flex-column align-items-center review-info_container">
				<div className="review-info_message">
					<EditWrapper stringId="WITHDRAW_PAGE.MESSAGE_ABOUT_SEND">
						{STRINGS['WITHDRAW_PAGE.MESSAGE_ABOUT_SEND']}
					</EditWrapper>
				</div>
				<div className="review-crypto-amount review-crypto-address">
					<div>{cryptoAmountText}</div>
					<div className="review-fee_message">
						<EditWrapper stringId="WITHDRAW_PAGE.MESSAGE_FEE,WITHDRAW_PAGE.MESSAGE_FEE_COIN">
							{withdrawFeeMessage}
						</EditWrapper>
					</div>
				</div>
				<div className="review-warning_arrow" />
				{!data.email ? (
					<div className="review-crypto-address">{data.address}</div>
				) : (
					<div className="review-crypto-mail">
						{' '}
						<span className="review-fee_message">
							<b>Email:</b> {data.email}
						</span>
					</div>
				)}
				{data.network && !data.email && (
					<div className="review-fee_message">
						{STRINGS.formatString(
							STRINGS['WITHDRAW_PAGE_NETWORK_TYPE_MESSAGE'],
							fullname,
							getNetworkNameByKey(data.network)
						)}
					</div>
				)}
				{hasDestinationTag && !data.email && (
					<div className="review-fee_message">
						{STRINGS.formatString(
							STRINGS['WITHDRAW_PAGE_DESTINATION_TAG_MESSAGE'],
							data.destination_tag
								? data.destination_tag
								: STRINGS['WITHDRAW_PAGE_DESTINATION_TAG_NONE']
						)}
					</div>
				)}
				{!data.email && (
					<div className="warning_text review-info_message">
						<EditWrapper stringId="WITHDRAW_PAGE.MESSAGE_BTC_WARNING">
							{STRINGS.formatString(
								STRINGS['WITHDRAW_PAGE.MESSAGE_BTC_WARNING'],
								fullname
							)}
						</EditWrapper>
					</div>
				)}
			</div>
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
	coins: {},
};

export default withConfig(ReviewModalContent);
