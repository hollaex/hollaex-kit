import {
	required,
	minValue,
	maxValue,
	checkBalance,
	validAddress,
	normalizeBTC,
	normalizeBTCFee
} from '../../components/Form/validations';
import { isMobile } from 'react-device-detect';
import STRINGS from '../../config/localizedStrings';
import { WITHDRAW_LIMITS, ICONS } from '../../config/constants';
import { fiatSymbol } from '../../utils/currency';

export const generateInitialValues = (symbol, fees = {}) => {
	const { MIN } = WITHDRAW_LIMITS[symbol];
	const initialValues = {};

	if (symbol === 'btc') {
		initialValues.fee = fees.fee || fees.optimal || fees.min;
	} else if (symbol === 'eth') {
		initialValues.fee = fees.fee || fees.optimal || fees.min;
	} else if (symbol === 'bch') {
		initialValues.fee = fees.fee || fees.optimal || fees.min;
	} else {
		initialValues.fee = fees.value || 0;
	}

	if (MIN) {
		initialValues.amount = MIN;
	}
	return initialValues;
};
export const generateFormValues = (
	symbol,
	available = 0,
	fees = {},
	calculateMax
) => {
	const name = STRINGS[`${symbol.toUpperCase()}_NAME`];
	const { MIN, MAX, STEP = 1 } = WITHDRAW_LIMITS[symbol];
	const fields = {};

	if (symbol !== fiatSymbol) {
		fields.address = {
			type: 'text',
			label: STRINGS.WITHDRAWALS_FORM_ADDRESS_LABEL,
			placeholder: STRINGS.WITHDRAWALS_FORM_ADDRESS_PLACEHOLDER,
			validate: [
				required,
				validAddress(symbol, STRINGS[`WITHDRAWALS_${symbol.toUpperCase()}_INVALID_ADDRESS`])
			],
			fullWidth: isMobile
		};
	}

	const amountValidate = [required];
	if (MIN) {
		amountValidate.push(minValue(MIN, STRINGS.WITHDRAWALS_MIN_VALUE_ERROR));
	}
	if (MAX) {
		amountValidate.push(maxValue(MAX, STRINGS.WITHDRAWALS_MAX_VALUE_ERROR));
	}
	// FIX add according fee
	// amountValidate.push(checkBalance(available, STRINGS.formatString(STRINGS.WITHDRAWALS_LOWER_BALANCE, name), fee));
	amountValidate.push(
		checkBalance(
			available,
			STRINGS.formatString(STRINGS.WITHDRAWALS_LOWER_BALANCE, name),
			0
		)
	);

	fields.amount = {
		type: 'number',
		label: STRINGS.formatString(STRINGS.WITHDRAWALS_FORM_AMOUNT_LABEL, name),
		placeholder: STRINGS.formatString(
			STRINGS.WITHDRAWALS_FORM_AMOUNT_PLACEHOLDER,
			name
		).join(''),
		min: MIN,
		max: MAX,
		step: STEP,
		validate: amountValidate,
		normalize: normalizeBTC,
		fullWidth: isMobile,
		notification: {
			text: STRINGS.CALCULATE_MAX,
			status: 'information',
			iconPath: ICONS.BLUE_PLUS,
			className: 'file_upload_icon',
			useSvg: true,
			onClick: calculateMax
		}
	};

	if (symbol === 'btc' || symbol === 'bch' || symbol === 'eth') {
		fields.fee = {
			type: 'editable',
			inputType: 'number',
			label: STRINGS[`WITHDRAWALS_FORM_FEE_${symbol.toUpperCase()}_LABEL`],
			placeholder: STRINGS.formatString(
				STRINGS.WITHDRAWALS_FORM_FEE_PLACEHOLDER,
				name
			).join(''),
			min: fees.min || MIN,
			max: fees.max || MAX,
			step: STEP,
			validate: [required, minValue(fees.min), maxValue(fees.max)],
			normalize: normalizeBTCFee,
			fullWidth: isMobile
		};
	} else {
		fields.fee = {
			type: 'number',
			label: STRINGS[`WITHDRAWALS_FORM_FEE_${symbol.toUpperCase()}_LABEL`],
			placeholder: STRINGS.formatString(
				STRINGS.WITHDRAWALS_FORM_FEE_PLACEHOLDER,
				name
			).join(''),
			disabled: true,
			fullWidth: isMobile
		};
	}

	return fields;
};
