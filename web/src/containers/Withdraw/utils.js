import React from 'react';
import mathjs from 'mathjs';
import { Accordion } from '../../components';
import {
	BANK_WITHDRAWAL_BASE_FEE,
	BANK_WITHDRAWAL_DYNAMIC_FEE_RATE,
	BANK_WITHDRAWAL_MAX_DYNAMIC_FEE,
	BANK_WITHDRAWAL_MAX_AMOUNT_FOR_BASE_FEE,
	BASE_CURRENCY,
} from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

import { renderBankInformation } from '../Wallet/components';

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
