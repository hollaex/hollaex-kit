import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { reduxForm } from 'redux-form';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { isMobile } from 'react-device-detect';

import { STATIC_ICONS } from 'config/icons';
import { EditWrapper, Button, SmartTarget } from 'components';
import { required } from 'components/Form/validations';
import { getNetworkNameByKey } from 'utils/wallet';
import { renderLabel } from 'containers/Withdraw/utils';
import STRINGS from 'config/localizedStrings';
import Image from 'components/Image';
import Fiat from './Fiat';
import DepositComponent from './Deposit';
import TransactionsHistory from 'containers/TransactionsHistory';

export const generateBaseInformation = (id = '') => (
	<div className="text">
		{id && (
			<p>
				{STRINGS.formatString(STRINGS['DEPOSIT_BANK_REFERENCE'], id).join(' ')}
			</p>
		)}
	</div>
);

export const renderBackToWallet = () => {
	return (
		<div style={{ fontSize: '15px' }}>
			<EditWrapper stringId="CURRENCY_WALLET.WALLET_PAGE">
				{STRINGS.formatString(
					STRINGS['CURRENCY_WALLET.WALLET_PAGE'],
					<Link className="link-content" to="wallet">
						{STRINGS['CURRENCY_WALLET.BACK']}
					</Link>
				)}
			</EditWrapper>
		</div>
	);
};

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
	openQRCode,
}) => {
	const fields = {};

	if (networks) {
		const networkOptions = networks.map((network) => ({
			value: network,
			label: getNetworkNameByKey(network),
		}));

		const { min } = coins[currency];
		const warnings = [STRINGS['DEPOSIT_FORM_NETWORK_WARNING']];
		if (min) {
			warnings.push(
				STRINGS.formatString(
					STRINGS['DEPOSIT_FORM_MIN_WARNING'],
					min,
					currency.toUpperCase()
				)
			);
		}

		fields.network = {
			type: 'select',
			stringId:
				'WITHDRAWALS_FORM_NETWORK_LABEL,WITHDRAWALS_FORM_NETWORK_PLACEHOLDER,DEPOSIT_FORM_NETWORK_WARNING,DEPOSIT_FORM_MIN_WARNING',
			label: STRINGS['WITHDRAWALS_FORM_NETWORK_LABEL'],
			placeholder: STRINGS['WITHDRAWALS_FORM_NETWORK_PLACEHOLDER'],
			warnings,
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
			notification: [
				{
					stringId: 'QR_CODE.SHOW',
					text: STRINGS['QR_CODE.SHOW'],
					status: 'information',
					iconPath: STATIC_ICONS['QR_CODE_SHOW'],
					className: 'file_upload_icon',
					useSvg: true,
					onClick: openQRCode,
					hideActionText: true,
				},
			],
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

			const fullname = coins[fee_coin]?.fullname || '';

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
	icons: ICONS,
	targets,
	depositCurrency,
	currentCurrency,
	openQRCode,
	updateAddress,
	depositAddress,
}) => {
	const coinObject = coins[depositCurrency] || coins[currency];

	const generalId = 'REMOTE_COMPONENT__FIAT_WALLET_DEPOSIT';
	const currencySpecificId = `${generalId}__${currency.toUpperCase()}`;
	const id = targets.includes(currencySpecificId)
		? currencySpecificId
		: generalId;

	if ((coinObject && coinObject.type !== 'fiat') || !coinObject) {
		return (
			<SmartTarget
				id={currencySpecificId}
				titleSection={titleSection}
				currency={currency}
			>
				<div className="withdraw-form-wrapper">
					<div className="withdraw-form d-flex">
						<div className="w-100">
							{!coinObject?.allow_deposit && currentCurrency && (
								<div className="d-flex">
									<div className="withdraw-deposit-icon-wrapper">
										<Image
											iconId={'CLOCK'}
											icon={ICONS['CLOCK']}
											svgWrapperClassName="action_notification-svg withdraw-deposit-icon"
										/>
									</div>
									<span className="withdraw-deposit-content">
										{renderLabel('ACCORDIAN.DISABLED_DEPOSIT_CONTENT')}
									</span>
								</div>
							)}
							{currentCurrency && coinObject?.allow_deposit && (
								<div className="d-flex align-items-center">
									<Image
										iconId={'DEPOSIT_BITCOIN'}
										icon={ICONS['DEPOSIT_BITCOIN']}
										wrapperClassName="form_currency-ball margin-aligner"
									/>
									{titleSection}
								</div>
							)}
							<DepositComponent
								updateAddress={updateAddress}
								depositAddress={depositAddress}
								openQRCode={openQRCode}
								onCopy={onCopy}
								coins={coins}
								currency={currency}
								onOpen={onOpen}
							/>
						</div>
						{!isMobile && (
							<div className="side-icon-wrapper">
								<Image iconId={'DEPOSIT_TITLE'} icon={ICONS['DEPOSIT_TITLE']} />
							</div>
						)}
					</div>
					{isMobile && address && depositAddress && (
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
				<TransactionsHistory isFromWallet={true} isDepositFromWallet={true} />
			</SmartTarget>
		);
	} else if (coinObject && coinObject.type === 'fiat') {
		return <Fiat id={id} titleSection={titleSection} currency={currency} />;
	} else {
		return <div>{STRINGS['DEPOSIT.NO_DATA']}</div>;
	}
};

const mapStateToProps = ({
	app: {
		targets,
		depositFields: { depositCurrency },
	},
}) => ({
	targets,
	depositCurrency,
});

const Form = reduxForm({
	form: 'GenerateWalletForm',
	enableReinitialize: true,
})(RenderContentForm);

export default connect(mapStateToProps)(Form);
