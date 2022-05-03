import React from 'react';
import mathjs from 'mathjs';
import {
	required,
	minValue,
	maxValue,
	normalizeBTC,
	checkBalance,
} from 'components/Form/validations';

import { DEFAULT_COIN_DATA } from 'config/constants';
import { getDecimals } from 'utils/utils';
import { toFixed } from 'utils/currency';

import STRINGS from 'config/localizedStrings';

export const generateFormValues = (
	constants,
	symbol,
	available = 0,
	calculateMax,
	coins = {},
	verification_level,
	theme,
	language,
	icon,
	iconId,
	banks,
	selectedBank,
	activeTab,
	withdrawal_limit,
	withdrawal_fee
) => {
	const { fullname, min, increment_unit } = coins[symbol] || DEFAULT_COIN_DATA;

	let MAX = withdrawal_limit;
	if (withdrawal_limit === 0) MAX = '';
	if (withdrawal_limit === -1) MAX = 0;

	const fields = {};

	if (banks) {
		const banksOptions = banks.map(({ bank_name, account_number, id }) => ({
			value: id,
			label: bank_name ? `${bank_name} - ${account_number}` : account_number,
		}));

		let preview;
		if (selectedBank) {
			const selectedBankObj = banks.find(({ id }) => id === selectedBank);
			if (activeTab === 'bank' && selectedBankObj) {
				preview = (
					<div className="d-flex py-2 field-content_preview">
						<div className="bold pl-4">
							<div>{STRINGS['BANK_NAME']}:</div>
							<div>{STRINGS['ACCOUNT_NAME']}:</div>
							<div>{STRINGS['ACCOUNT_NUMBER']}:</div>
						</div>
						<div className="pl-4">
							<div>{selectedBankObj.bank_name || '-'}</div>
							<div>{selectedBankObj.account_name || '-'}</div>
							<div>{selectedBankObj.account_number || '-'}</div>
						</div>
					</div>
				);
			} else if (activeTab === 'osko' && selectedBankObj) {
				preview = (
					<div className="d-flex py-2 field-content_preview">
						<div className="bold pl-4">
							<div>Account name:</div>
							<div>PayID:</div>
						</div>
						<div className="pl-4">
							<div>{selectedBankObj.account_name || '-'}</div>
							<div>{selectedBankObj.pay_id || '-'}</div>
						</div>
					</div>
				);
			}
		}

		fields.bank = {
			type: 'select',
			stringId: 'USER_VERIFICATION.TITLE_BANK',
			label: STRINGS['USER_VERIFICATION.TITLE_BANK'],
			placeholder: 'Select a bank',
			validate: [required],
			fullWidth: true,
			options: banksOptions,
			hideCheck: true,
			ishorizontalfield: true,
			disabled: banks.length === 1,
			strings: STRINGS,
			preview,
		};
	}

	if (banks && (banks.length === 1 || selectedBank)) {
		const amountValidate = [required];
		if (min) {
			amountValidate.push(
				minValue(min, STRINGS['WITHDRAWALS_MIN_VALUE_ERROR'])
			);
		}
		if (MAX) {
			amountValidate.push(
				maxValue(MAX, STRINGS['WITHDRAWALS_MAX_VALUE_ERROR'])
			);
		}
		amountValidate.push(checkBalance(available, fullname, withdrawal_fee));

		fields.amount = {
			type: 'number',
			stringId:
				'WITHDRAWALS_FORM_AMOUNT_LABEL,WITHDRAWALS_FORM_AMOUNT_PLACEHOLDER',
			label: STRINGS.formatString(
				STRINGS['WITHDRAWALS_FORM_AMOUNT_LABEL'],
				fullname
			),
			placeholder: STRINGS.formatString(
				STRINGS['WITHDRAWALS_FORM_AMOUNT_PLACEHOLDER'],
				fullname
			).join(''),
			min: min,
			max: MAX,
			step: increment_unit,
			validate: amountValidate,
			normalize: normalizeBTC,
			fullWidth: true,
			ishorizontalfield: true,
			notification: {
				stringId: 'CALCULATE_MAX',
				text: STRINGS['CALCULATE_MAX'],
				status: 'information',
				iconPath: icon,
				iconId,
				className: 'file_upload_icon',
				useSvg: true,
				onClick: calculateMax,
			},
			parse: (value = '') => {
				let decimal = getDecimals(increment_unit);
				let decValue = toFixed(value);
				let valueDecimal = getDecimals(decValue);

				let result = value;
				if (decimal < valueDecimal) {
					result = decValue
						.toString()
						.substring(
							0,
							decValue.toString().length - (valueDecimal - decimal)
						);
				}
				return result;
			},
			strings: STRINGS,
		};
	}

	fields.captcha = {
		type: 'captcha',
		language,
		theme,
		validate: [required],
		strings: STRINGS,
		constants,
	};

	return fields;
};

export const generateInitialValues = (
	symbol,
	coins = {},
	banks,
	selectedBank,
	withdrawal_fee
) => {
	const { min } = coins[symbol] || DEFAULT_COIN_DATA;
	const initialValues = {};

	if (min) {
		if (withdrawal_fee) {
			initialValues.amount = mathjs.max(min, mathjs.number(withdrawal_fee));
		} else {
			initialValues.amount = min;
		}
	} else {
		initialValues.amount = '';
	}

	if (banks && banks.length > 0) {
		initialValues.bank = selectedBank;
	}

	return initialValues;
};
