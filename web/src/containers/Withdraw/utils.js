import React from 'react';
import { isMobile } from 'react-device-detect';
import mathjs from 'mathjs';
import { Accordion, Coin, EditWrapper } from 'components';
import {
	BANK_WITHDRAWAL_BASE_FEE,
	BANK_WITHDRAWAL_DYNAMIC_FEE_RATE,
	BANK_WITHDRAWAL_MAX_DYNAMIC_FEE,
	BANK_WITHDRAWAL_MAX_AMOUNT_FOR_BASE_FEE,
	BASE_CURRENCY,
} from 'config/constants';
import STRINGS from 'config/localizedStrings';

import { renderBankInformation } from '../Wallet/components';
import { getNetworkName, getNetworkNameByKey } from 'utils/wallet';
import { STATIC_ICONS } from 'config/icons';

export const generateBaseInformation = (currency, limits = {}) => {
	const { minAmount = 2, maxAmount = 10000 } = limits;
	const { currencySymbol, shortName, formatToCurrency } = currency;
	return (
		<div className="text">
			<p>{STRINGS['WITHDRAW_PAGE.BASE_MESSAGE_1']}</p>
			<p>{`${
				STRINGS['WITHDRAW_PAGE.BASE_MESSAGE_2']
			}: ${currencySymbol}${formatToCurrency(minAmount)} ${shortName}`}</p>
			<p>{`${
				STRINGS['WITHDRAW_PAGE.BASE_MESSAGE_3']
			}: ${currencySymbol}${formatToCurrency(maxAmount)} ${shortName} (${
				STRINGS['WITHDRAW_PAGE.MESSAGE_LIMIT']
			})`}</p>
		</div>
	);
};

export const renderExtraInformation = (symbol, bank_account, icon) =>
	symbol === BASE_CURRENCY && (
		<div className="bank_account-information-wrapper">
			<Accordion
				sections={[
					{
						stringId: 'WITHDRAW_PAGE.BANK_TO_WITHDRAW',
						title: STRINGS['WITHDRAW_PAGE.BANK_TO_WITHDRAW'],
						content: renderBankInformation(bank_account),
						notification: {
							stringId: 'NEED_HELP_TEXT',
							text: STRINGS['NEED_HELP_TEXT'],
							status: 'information',
							iconPath: icon,
							allowClick: true,
						},
					},
				]}
			/>
		</div>
	);

export const calculateBaseFee = (amount = 0) => {
	if (amount < 0) {
		return 0;
	}

	let withdrawalFee = mathjs.chain(
		mathjs.largerEq(amount, BANK_WITHDRAWAL_MAX_AMOUNT_FOR_BASE_FEE)
			? 0
			: BANK_WITHDRAWAL_BASE_FEE
	);
	const dinamicFee = mathjs
		.chain(amount)
		.multiply(BANK_WITHDRAWAL_DYNAMIC_FEE_RATE)
		.divide(100)
		.done();
	if (mathjs.larger(dinamicFee, BANK_WITHDRAWAL_MAX_DYNAMIC_FEE)) {
		withdrawalFee = withdrawalFee.add(BANK_WITHDRAWAL_MAX_DYNAMIC_FEE);
	} else {
		withdrawalFee = withdrawalFee.add(dinamicFee);
	}
	const fee = mathjs.ceil(withdrawalFee.done());
	return fee;
};

export const renderLabel = (label) => {
	return <EditWrapper stringId={label}>{STRINGS[label]}</EditWrapper>;
};

export const renderEstimatedValueAndFee = (
	renderWithdrawlabel,
	label,
	format
) => {
	return (
		<div className="d-flex">
			<div className="mt-2 ml-1">{renderWithdrawlabel(label)}</div>
			<div className="mt-2 ml-1 fee-fields">{format}</div>
		</div>
	);
};

export const calculateFee = (
	selectedAsset,
	getWithdrawNetworkOptions,
	coins
) => {
	return selectedAsset &&
		coins[selectedAsset].withdrawal_fees &&
		Object.keys(coins[selectedAsset]?.withdrawal_fees).length &&
		coins[selectedAsset].withdrawal_fees[getWithdrawNetworkOptions]?.value
		? coins[selectedAsset].withdrawal_fees[getWithdrawNetworkOptions]?.value
		: selectedAsset &&
		  coins[selectedAsset].withdrawal_fees &&
		  Object.keys(coins[selectedAsset]?.withdrawal_fees).length &&
		  coins[selectedAsset].withdrawal_fees[
				Object.keys(coins[selectedAsset]?.withdrawal_fees)[0]
		  ]?.value
		? coins[selectedAsset].withdrawal_fees[
				Object.keys(coins[selectedAsset]?.withdrawal_fees)[0]
		  ]?.value
		: selectedAsset && coins[selectedAsset].withdrawal_fee
		? coins[selectedAsset]?.withdrawal_fee
		: 0;
};

export const calculateFeeCoin = (
	selectedAsset,
	getWithdrawNetworkOptions,
	coins
) => {
	return selectedAsset &&
		coins[selectedAsset].withdrawal_fees &&
		Object.keys(coins[selectedAsset]?.withdrawal_fees).length &&
		coins[selectedAsset].withdrawal_fees[getWithdrawNetworkOptions]?.symbol
		? coins[selectedAsset].withdrawal_fees[getWithdrawNetworkOptions]?.symbol
		: selectedAsset &&
		  coins[selectedAsset].withdrawal_fees &&
		  Object.keys(coins[selectedAsset]?.withdrawal_fees).length &&
		  coins[selectedAsset].withdrawal_fees[
				Object.keys(coins[selectedAsset]?.withdrawal_fees)[0]
		  ]?.symbol
		? coins[selectedAsset].withdrawal_fees[
				Object.keys(coins[selectedAsset]?.withdrawal_fees)[0]
		  ]?.symbol
		: selectedAsset;
};

export const onHandleSymbol = (value) => {
	const regex = /\(([^)]+)\)/;
	const match = value.match(regex);
	const curr = match ? match[1].toLowerCase() : null;
	return curr;
};

export const renderNetworkWithLabel = (iconId, network) => {
	return network && iconId ? (
		<div className="d-flex">
			<span>{getNetworkNameByKey(network)}</span>
			<div
				className={isMobile ? 'network-icon ml-2' : 'network-icon mt-1 ml-2'}
			>
				<Coin iconId={iconId} type="CS2" className="withdraw-network-icon" />
			</div>
		</div>
	) : null;
};

export const renderNetworkField = (network) => {
	return network ? getNetworkName(network) : null;
};

export const networkList = [
	{ network: 'ERC20', iconId: 'ETH_ICON' },
	{ network: 'BEP20', iconId: 'BNB_ICON' },
	{ network: 'TRC20', iconId: 'TRX_ICON' },
	{ network: 'klaytn', iconId: 'KLAY_ICON' },
	{ network: 'Polygon', iconId: 'MATIC_ICON' },
	{ network: 'Solana', iconId: 'SOL_ICON' },
	{ network: 'Stellar', iconId: 'XLM_ICON' },
	{ network: 'Fantom', iconId: 'FTM_ICON' },
	{ network: 'Sonic', iconId: 'S_ICON' },
];

export const renderScanIcon = (onHandleScan) => {
	return (
		<div className="render-scan-wrapper d-flex" onClick={() => onHandleScan()}>
			<span className="suffix-text">{renderLabel('ACCORDIAN.SCAN')}</span>
			<div className="img-wrapper">
				<img alt="scan-icon" src={STATIC_ICONS['QR_CODE_SCAN']}></img>
			</div>
		</div>
	);
};
