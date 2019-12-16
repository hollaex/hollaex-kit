import {
	required,
	minValue,
	maxValue,
	checkBalance,
	validAddress,
	normalizeBTC,
	normalizeBTCFee
} from "../../components/Form/validations";
import { isMobile } from "react-device-detect";
import STRINGS from "../../config/localizedStrings";
import { ICONS, DEFAULT_COIN_DATA } from "../../config/constants";

export const generateInitialValues = (symbol, coins = {}) => {
	const { min, withdrawal_fee } = coins[symbol] || DEFAULT_COIN_DATA;
	const initialValues = {};

	if (coins[symbol]) {
		initialValues.fee = withdrawal_fee;
	} else {
		initialValues.fee = 0;
	}

	if (min) {
		initialValues.amount = min;
	}
	return initialValues;
};

export const generateFormValues = (
	symbol,
	available = 0,
	calculateMax,
	coins = {},
	verification_level
) => {
	const { fullname, min, increment_unit, withdrawal_limits = {} } = coins[
		symbol
	] || DEFAULT_COIN_DATA;
	let MAX = withdrawal_limits[verification_level];
	if (withdrawal_limits[verification_level] === 0) MAX = "";
	if (withdrawal_limits[verification_level] === -1) MAX = 0;
	const fields = {};


	fields.address = {
		type: "text",
		label: STRINGS.WITHDRAWALS_FORM_ADDRESS_LABEL,
		placeholder: STRINGS.WITHDRAWALS_FORM_ADDRESS_PLACEHOLDER,
		validate: [
			required,
			validAddress(
				symbol,
				STRINGS[`WITHDRAWALS_${symbol.toUpperCase()}_INVALID_ADDRESS`]
			)
		],
		fullWidth: isMobile
	};
	

	const amountValidate = [required];
	if (min) {
		amountValidate.push(minValue(min, STRINGS.WITHDRAWALS_MIN_VALUE_ERROR));
	}
	if (MAX) {
		amountValidate.push(maxValue(MAX, STRINGS.WITHDRAWALS_MAX_VALUE_ERROR));
	}
	// FIX add according fee
	// amountValidate.push(checkBalance(available, STRINGS.formatString(STRINGS.WITHDRAWALS_LOWER_BALANCE, fullname), fee));
	amountValidate.push(
		checkBalance(
			available,
			STRINGS.formatString(STRINGS.WITHDRAWALS_LOWER_BALANCE, fullname),
			0
		)
	);

	fields.amount = {
		type: "number",
		label: STRINGS.formatString(STRINGS.WITHDRAWALS_FORM_AMOUNT_LABEL, fullname),
		placeholder: STRINGS.formatString(
			STRINGS.WITHDRAWALS_FORM_AMOUNT_PLACEHOLDER,
			fullname
		).join(""),
		min: min,
		max: MAX,
		step: increment_unit,
		validate: amountValidate,
		normalize: normalizeBTC,
		fullWidth: isMobile,
		notification: {
			text: STRINGS.CALCULATE_MAX,
			status: "information",
			iconPath: ICONS.BLUE_PLUS,
			className: "file_upload_icon",
			useSvg: true,
			onClick: calculateMax
		}
	};

	if (coins[symbol]) {
		fields.fee = {
			type: "number",
			// label: STRINGS[`WITHDRAWALS_FORM_FEE_${symbol.toUpperCase()}_LABEL`],
			label: STRINGS.formatString(
				STRINGS.WITHDRAWALS_FORM_FEE_COMMON_LABEL,
				fullname
			),
			placeholder: STRINGS.formatString(
				STRINGS.WITHDRAWALS_FORM_FEE_PLACEHOLDER,
				fullname
			).join(""),
			disabled: true,
			fullWidth: isMobile
		};
	} else {
		fields.fee = {
			type: "editable",
			inputType: "number",
			label: STRINGS[`WITHDRAWALS_FORM_FEE_${symbol.toUpperCase()}_LABEL`],
			placeholder: STRINGS.formatString(
				STRINGS.WITHDRAWALS_FORM_FEE_PLACEHOLDER,
				fullname
			).join(""),
			min: min,
			max: MAX,
			step: min,
			validate: [required, minValue(min), MAX ? maxValue(MAX) : ""],
			normalize: normalizeBTCFee,
			fullWidth: isMobile
		};
	}

	return fields;
};
