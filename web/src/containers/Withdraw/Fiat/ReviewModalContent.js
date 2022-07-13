import React from 'react';
import math from 'mathjs';
import { Image, Button, EditWrapper } from 'components';
import { formatToCurrency } from 'utils/currency';
import {
	CURRENCY_PRICE_FORMAT,
	BASE_CURRENCY,
	DEFAULT_COIN_DATA,
} from 'config/constants';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { generateDynamicStringKey } from 'utils/id';
import { HIDDEN_KEYS } from 'containers/Verification/UserPaymentVerificationHome';

const ButtonSection = ({ onClickAccept, onClickCancel }) => {
	return (
		<div className="d-flex">
			<Button
				stringId="CANCEL"
				label={STRINGS['CANCEL']}
				onClick={onClickCancel}
				className="button-fail"
			/>
			<div className="button-separator" />
			<Button
				stringId="NOTIFICATIONS.BUTTONS.OKAY"
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
	banks,
	activeTab,
}) => {
	const { min, display_name } =
		coins[currency || BASE_CURRENCY] || DEFAULT_COIN_DATA;
	const baseCoin = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;

	const selectedBank = banks.find(({ id }) => id === data.bank);

	const totalTransaction = math.number(
		math.add(math.fraction(data.amount), math.fraction(data.fee || 0))
	);

	const cryptoAmountText = STRINGS.formatString(
		CURRENCY_PRICE_FORMAT,
		formatToCurrency(totalTransaction, min),
		display_name
	);

	const feePrice = data.fee ? math.number(math.multiply(data.fee, price)) : 0;
	const fee = data.fee ? data.fee : 0;

	const renderContent = () => {
		let previewData;
		if (data.bank) {
			if (selectedBank) {
				const { type = 'bank' } = selectedBank;
				const generateId = generateDynamicStringKey('ULTIMATE_FIAT', type);

				previewData = (
					<div className="py-2 field-content_preview">
						{Object.entries(selectedBank)
							.filter(([key]) => !HIDDEN_KEYS.includes(key))
							.map(([key, value]) => {
								const labelId = generateId(key);
								const defaultText = key.replace(/_/g, ' ');

								return (
									<div className="d-flex">
										<div className="bold pr-3">
											{STRINGS[labelId] || defaultText}:
										</div>
										<div>{value}</div>
									</div>
								);
							})}
					</div>
				);
			}
		}

		return <div className="d-flex py-4">{previewData}</div>;
	};

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
									baseCoin.display_name
								)
							)}
						</EditWrapper>
					</div>
				</div>
				<div className="review-warning_arrow" />
				<div className="review-crypto-address" style={{ fontSize: '1.1rem' }}>
					{renderContent()}
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
