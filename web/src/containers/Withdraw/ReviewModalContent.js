import React from 'react';
import math from 'mathjs';
import Image from 'components/Image';
import { Button } from '../../components';
import { formatToCurrency } from '../../utils/currency';
import {
	BASE_CURRENCY,
	CURRENCY_PRICE_FORMAT,
	DEFAULT_COIN_DATA,
} from '../../config/constants';
import withConfig from 'components/ConfigProvider/withConfig';
import { EditWrapper } from 'components';
import { getNetworkLabelByKey } from 'utils/wallet';

import STRINGS from '../../config/localizedStrings';

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
	const { min, fullname, symbol = '' } =
		coins[currency || BASE_CURRENCY] || DEFAULT_COIN_DATA;
	const baseCoin = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
	const shortName = symbol.toUpperCase();

	const totalTransaction = math.number(
		math.add(math.fraction(data.amount), math.fraction(data.fee || 0))
	);

	const cryptoAmountText = STRINGS.formatString(
		CURRENCY_PRICE_FORMAT,
		formatToCurrency(totalTransaction, min),
		shortName
	);

	const feePrice = data.fee ? math.number(math.multiply(data.fee, price)) : 0;
	const fee = data.fee ? data.fee : 0;

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
						<EditWrapper stringId="WITHDRAW_PAGE.MESSAGE_FEE">
							{STRINGS.formatString(
								STRINGS['WITHDRAW_PAGE.MESSAGE_FEE'],
								fee,
								STRINGS.formatString(
									CURRENCY_PRICE_FORMAT,
									formatToCurrency(feePrice, baseCoin.min),
									baseCoin.symbol.toUpperCase()
								)
							)}
						</EditWrapper>
					</div>
				</div>
				<div className="review-warning_arrow" />
				<div className="review-crypto-address">{data.address}</div>
				{data.network && (
					<div className="review-fee_message">
						{STRINGS.formatString(
							STRINGS['WITHDRAW_PAGE_NETWORK_TYPE_MESSAGE'],
							fullname,
							getNetworkLabelByKey(data.network)
						)}
					</div>
				)}
				{hasDestinationTag && (
					<div className="review-fee_message">
						{STRINGS.formatString(
							STRINGS['WITHDRAW_PAGE_DESTINATION_TAG_MESSAGE'],
							data.destination_tag
								? data.destination_tag
								: STRINGS['WITHDRAW_PAGE_DESTINATION_TAG_NONE']
						)}
					</div>
				)}
				<div className="warning_text review-info_message">
					<EditWrapper stringId="WITHDRAW_PAGE.MESSAGE_BTC_WARNING">
						{STRINGS.formatString(
							STRINGS['WITHDRAW_PAGE.MESSAGE_BTC_WARNING'],
							fullname
						)}
					</EditWrapper>
				</div>
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
