import React from 'react';
import mathjs from 'mathjs';
import { Accordion } from '../../components';
import { ICONS } from '../../config/constants';
import { fiatSymbol } from '../../utils/currency';
import STRINGS from '../../config/localizedStrings';

import { renderBankInformation } from '../Wallet/components';

export const generateFiatInformation = (currency, limits = {}) => {
	const { minAmount = 2, maxAmount = 10000 } = limits;
	const { currencySymbol, shortName, formatToCurrency } = currency;
	return (
		<div className="text">
			<p>{STRINGS.WITHDRAW_PAGE.FIAT_MESSAGE_1}</p>
			<p>{`${
				STRINGS.WITHDRAW_PAGE.FIAT_MESSAGE_2
			}: ${currencySymbol}${formatToCurrency(minAmount)} ${shortName}`}</p>
			<p>{`${
				STRINGS.WITHDRAW_PAGE.FIAT_MESSAGE_3
			}: ${currencySymbol}${formatToCurrency(maxAmount)} ${shortName} (${
				STRINGS.WITHDRAW_PAGE.MESSAGE_LIMIT
			})`}</p>
		</div>
	);
};

export const renderExtraInformation = (symbol, bank_account) =>
	symbol === fiatSymbol && (
		<div className="bank_account-information-wrapper">
			<Accordion
				sections={[
					{
						title: STRINGS.WITHDRAW_PAGE.BANK_TO_WITHDRAW,
						content: renderBankInformation(bank_account),
						notification: {
							text: STRINGS.NEED_HELP_TEXT,
							status: 'information',
							iconPath: ICONS.BLUE_QUESTION,
							allowClick: true
						}
					}
				]}
			/>
		</div>
	);

const BANK_WITHDRAWAL_BASE_FEE = 500;
const BANK_WITHDRAWAL_DYNAMIC_FEE_RATE = 0.5;
const BANK_WITHDRAWAL_MAX_DYNAMIC_FEE = 50000;

export const calculateFiatFee = (amount = 0) => {
	if (amount < 0) {
		return 0;
	}

	let withdrawalFee = mathjs.chain(BANK_WITHDRAWAL_BASE_FEE);
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
