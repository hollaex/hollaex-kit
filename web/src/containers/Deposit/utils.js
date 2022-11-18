import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import QRCode from 'qrcode.react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import STRINGS from 'config/localizedStrings';
import { EditWrapper, Button, SmartTarget } from 'components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { required } from 'components/Form/validations';
import { getNetworkNameByKey } from 'utils/wallet';

import Image from 'components/Image';
import renderFields from 'components/Form/factoryFields';
import { isMobile } from 'react-device-detect';
import Fiat from './Fiat';

export const generateBaseInformation = (id = '') => (
	<div className="text">
		{id && (
			<p>
				{STRINGS.formatString(STRINGS['DEPOSIT_BANK_REFERENCE'], id).join(' ')}
			</p>
		)}
	</div>
);

export const generateFormFields = ({
	currency,
	networks,
	address,
	label,
	onCopy,
	copyOnClick,
	destinationAddress,
	destinationLabel,
	coins,
	network,
	fee,
}) => {
	const fields = {};

	if (networks) {
		const networkOptions = networks.map((network) => ({
			value: network,
			label: getNetworkNameByKey(network),
		}));

		fields.network = {
			type: 'select',
			stringId:
				'WITHDRAWALS_FORM_NETWORK_LABEL,WITHDRAWALS_FORM_NETWORK_PLACEHOLDER,DEPOSIT_FORM_NETWORK_WARNING',
			label: STRINGS['WITHDRAWALS_FORM_NETWORK_LABEL'],
			placeholder: STRINGS['WITHDRAWALS_FORM_NETWORK_PLACEHOLDER'],
			warning: STRINGS['DEPOSIT_FORM_NETWORK_WARNING'],
			validate: [required],
			fullWidth: true,
			options: networkOptions,
			hideCheck: true,
			ishorizontalfield: true,
			disabled: networks.length === 1,
		};
	}

	if (address) {
		fields.address = {
			type: 'dumb',
			label,
			fullWidth: true,
			allowCopy: true,
			onCopy,
			copyOnClick,
			hideCheck: true,
			ishorizontalfield: true,
		};
	}

	if (destinationAddress) {
		fields.destinationAddress = {
			type: 'dumb',
			label: destinationLabel,
			fullWidth: true,
			allowCopy: true,
			onCopy,
			copyOnClick,
			hideCheck: true,
			ishorizontalfield: true,
		};
	}

	if (fee) {
		const feeKey = networks ? network : currency;
		const { deposit_fees } = coins[currency];
		if (deposit_fees && deposit_fees[feeKey]) {
			const { symbol, type } = deposit_fees[feeKey];
			const isPercentage = type === 'percentage';
			const fee_coin = isPercentage ? '' : symbol || currency;

			const fullname = coins[fee_coin]?.fullname;

			fields.fee = {
				type: 'number',
				stringId:
					'WITHDRAWALS_FORM_FEE_COMMON_LABEL,WITHDRAWALS_FORM_FEE_PLACEHOLDER',
				label: STRINGS.formatString(
					STRINGS[
						fee_coin && fee_coin !== currency
							? 'WITHDRAWALS_FORM_FEE_COMMON_LABEL_COIN'
							: 'WITHDRAWALS_FORM_FEE_COMMON_LABEL'
					],
					fullname
				),
				placeholder: STRINGS.formatString(
					STRINGS['WITHDRAWALS_FORM_FEE_PLACEHOLDER'],
					fullname
				),
				disabled: true,
				fullWidth: true,
				ishorizontalfield: true,
				...(fee_coin && fee_coin !== currency
					? {
							warning: STRINGS.formatString(
								STRINGS['WITHDRAWALS_FORM_FEE_WARNING'],
								fullname,
								fee_coin.toUpperCase()
							),
					  }
					: {}),
			};
		}
	}

	return fields;
};

const RenderContentForm = ({
	titleSection,
	currency,
	coins = {},
	onCopy,
	onOpen,
	setCopied,
	copied,
	address,
	showGenerateButton,
	formFields,
	icons: ICONS,
	selectedNetwork,
	targets,
}) => {
	const coinObject = coins[currency];

	const generalId = 'REMOTE_COMPONENT__FIAT_WALLET_DEPOSIT';
	const currencySpecificId = `${generalId}__${currency.toUpperCase()}`;
	const id = targets.includes(currencySpecificId)
		? currencySpecificId
		: generalId;

	if (coinObject && coinObject.type !== 'fiat') {
		return (
			<SmartTarget
				id={currencySpecificId}
				titleSection={titleSection}
				currency={currency}
			>
				<div className="withdraw-form-wrapper">
					<div className="withdraw-form">
						<div className="d-flex align-items-center">
							<Image
								iconId={'DEPOSIT_BITCOIN'}
								icon={ICONS['DEPOSIT_BITCOIN']}
								wrapperClassName="form_currency-ball margin-aligner"
							/>
							{titleSection}
						</div>
						{(currency === 'xrp' ||
							currency === 'xlm' ||
							selectedNetwork === 'xlm') && (
							<div className="d-flex">
								<div className="d-flex align-items-baseline field_warning_wrapper">
									<ExclamationCircleFilled className="field_warning_icon" />
									<div className="field_warning_text">
										<EditWrapper stringId="DEPOSIT_FORM_TITLE_WARNING_DESTINATION_TAG">
											{STRINGS['DEPOSIT_FORM_TITLE_WARNING_DESTINATION_TAG']}
										</EditWrapper>
									</div>
								</div>
							</div>
						)}
						{renderFields(formFields)}
						{address && (
							<div className="deposit_info-qr-wrapper d-flex align-items-center justify-content-center">
								<div className="qr_code-wrapper d-flex flex-column">
									<div className="qr-code-bg d-flex justify-content-center align-items-center">
										<QRCode value={address} />
									</div>
									<div className="qr-text">
										<EditWrapper stringId="DEPOSIT.QR_CODE">
											{STRINGS['DEPOSIT.QR_CODE']}
										</EditWrapper>
									</div>
								</div>
							</div>
						)}
					</div>
					{showGenerateButton && (
						<div className="btn-wrapper">
							<Button
								stringId="GENERATE_WALLET"
								label={STRINGS['GENERATE_WALLET']}
								onClick={onOpen}
							/>
						</div>
					)}
					{isMobile && address && (
						<div className="btn-wrapper">
							<CopyToClipboard text={address} onCopy={setCopied}>
								<Button
									onClick={onCopy}
									label={
										copied ? STRINGS['SUCCESFUL_COPY'] : STRINGS['COPY_ADDRESS']
									}
								/>
							</CopyToClipboard>
						</div>
					)}
				</div>
			</SmartTarget>
		);
	} else if (coinObject && coinObject.type === 'fiat') {
		return <Fiat id={id} titleSection={titleSection} currency={currency} />;
	} else {
		return <div>{STRINGS['DEPOSIT.NO_DATA']}</div>;
	}
};

const mapStateToProps = ({ app: { targets } }) => ({
	targets,
});

const Form = reduxForm({
	form: 'GenerateWalletForm',
	enableReinitialize: true,
})(RenderContentForm);

export default connect(mapStateToProps)(Form);
