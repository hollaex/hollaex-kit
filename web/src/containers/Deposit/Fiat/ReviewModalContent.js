import React from 'react';
import { Button, EditWrapper, Image } from 'components';
import { ExclamationCircleFilled } from '@ant-design/icons';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { DEFAULT_COIN_DATA } from 'config/constants';
import { generateDynamicStringKey } from 'utils/id';

const ReviewModalContent = ({
	coins,
	onBack,
	onProceed,
	amount,
	fee,
	transactionId,
	currency,
	loading,
	icons: ICONS,
	account,
	onramp,
	method,
}) => {
	const { display_name, icon_id } = coins[currency] || DEFAULT_COIN_DATA;

	let data;
	if (account) {
		const selectedAccountArray =
			onramp.type === 'manual' &&
			onramp.data.find(([{ id }]) => id === account);
		if (selectedAccountArray) {
			const generateId = generateDynamicStringKey(
				'ULTIMATE_FIAT',
				method,
				'ONRAMP'
			);

			data = (
				<div className="py-2 field-content_preview">
					{selectedAccountArray.map(({ key, label, value }) => {
						const labelId = generateId(key);
						const defaultText = label || key.replace(/_/g, ' ');

						return (
							<div className="d-flex">
								<div className="bold pl-4">
									{STRINGS[labelId] || defaultText}
								</div>
								<div className="pl-4">{value}</div>
							</div>
						);
					})}
				</div>
			);
		}
	}

	return (
		<div style={{ width: '48rem' }}>
			<div className="important-text" style={{ 'font-size': '2.2rem' }}>
				<EditWrapper stringId="FIAT.REVIEW_DEPOSIT.TITLE">
					{STRINGS['FIAT.REVIEW_DEPOSIT.TITLE']}
				</EditWrapper>
			</div>
			<div className="secondary-text">
				<EditWrapper stringId="FIAT.REVIEW_DEPOSIT.SUBTITLE">
					{STRINGS['FIAT.REVIEW_DEPOSIT.SUBTITLE']}
				</EditWrapper>
			</div>

			<div>
				<div className="py-1 dop_preview">{data}</div>

				<Image
					iconId={icon_id}
					icon={ICONS[icon_id]}
					wrapperClassName="form_currency-ball"
				/>

				<div className="py-1 dop_preview">
					<div className="d-flex justify-content-start">
						<div className="bold pl-3">
							<EditWrapper stringId="FIAT.REVIEW_DEPOSIT.AMOUNT">
								{STRINGS['FIAT.REVIEW_DEPOSIT.AMOUNT']}
							</EditWrapper>
						</div>
						<div className="pl-4">
							{STRINGS.formatString(
								STRINGS['FIAT.REVIEW_DEPOSIT.FORMAT'],
								amount,
								display_name
							)}
						</div>
					</div>

					<div className="d-flex justify-content-start">
						<div className="bold pl-3">
							<EditWrapper stringId="FIAT.REVIEW_DEPOSIT.FEE">
								{STRINGS['FIAT.REVIEW_DEPOSIT.FEE']}
							</EditWrapper>
						</div>
						<div className="pl-4">
							{STRINGS.formatString(
								STRINGS['FIAT.REVIEW_DEPOSIT.FORMAT'],
								fee,
								display_name
							)}
						</div>
					</div>

					<div className="d-flex justify-content-start">
						<div className="bold pl-3">
							<EditWrapper stringId="FIAT.REVIEW_DEPOSIT.TRANSACTION_ID">
								{STRINGS['FIAT.REVIEW_DEPOSIT.TRANSACTION_ID']}
							</EditWrapper>
						</div>
						<div className="pl-4">{transactionId}</div>
					</div>
				</div>
			</div>

			<div className="d-flex align-items-baseline field_warning_wrapper">
				<ExclamationCircleFilled className="field_warning_icon pr-1" />
				<div className="field_warning_text">
					<EditWrapper stringId="FIAT.REVIEW_DEPOSIT.NOTE">
						{STRINGS['FIAT.REVIEW_DEPOSIT.NOTE']}
					</EditWrapper>
				</div>
			</div>

			<div className="d-flex mt-4 pt-3">
				<div className="w-50">
					<EditWrapper stringId="FIAT.REVIEW_DEPOSIT.BACK" />
					<Button
						label={STRINGS['FIAT.REVIEW_DEPOSIT.BACK']}
						onClick={onBack}
						disabled={loading}
						className="mb-3"
					/>
				</div>
				<div className="separator" />
				<div className="w-50">
					<EditWrapper stringId="FIAT.REVIEW_DEPOSIT.PROCEED" />
					<Button
						label={STRINGS['FIAT.REVIEW_DEPOSIT.PROCEED']}
						onClick={() => onProceed({ amount, fee, transactionId, method })}
						disabled={loading}
						className="mb-3"
					/>
				</div>
			</div>
		</div>
	);
};

export default withConfig(ReviewModalContent);
