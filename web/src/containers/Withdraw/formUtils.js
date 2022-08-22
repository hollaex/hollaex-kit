import {
	required,
	minValue,
	maxValue,
	checkBalance,
	checkFee,
	validAddress,
	normalizeBTC,
	normalizeBTCFee,
} from '../../components/Form/validations';
import STRINGS from '../../config/localizedStrings';
import { DEFAULT_COIN_DATA } from '../../config/constants';
import { getLanguage } from '../../utils/string';
import { getTheme } from '../../utils/theme';
import { toFixed } from '../../utils/currency';
import { getDecimals } from '../../utils/utils';
import { getNetworkNameByKey } from 'utils/wallet';
import { email } from 'components/AdminForm/validations';

export const generateInitialValues = (
	symbol,
	coins = {},
	networks,
	network,
	query,
	verification_level
) => {
	const { min, withdrawal_fee, withdrawal_fees } =
		coins[symbol] || DEFAULT_COIN_DATA;
	const initialValues = {};

	if (withdrawal_fees && network && withdrawal_fees[network]) {
		const { value, symbol, type = 'static', levels } = withdrawal_fees[network];
		if (type === 'static') {
			initialValues.fee_coin = symbol;
			initialValues.fee_type = 'static';

			if (levels && levels[verification_level]) {
				initialValues.fee = levels[verification_level];
			} else {
				initialValues.fee = value;
			}
		} else {
			initialValues.fee_coin = '';
			initialValues.fee_type = 'percentage';

			if (levels && levels[verification_level]) {
				initialValues.fee = levels[verification_level];
			} else {
				initialValues.fee = value;
			}
		}
	} else if (withdrawal_fees && withdrawal_fees[symbol]) {
		const {
			value,
			symbol: feeSymbol,
			type = 'static',
			levels,
		} = withdrawal_fees[symbol];
		if (type === 'static') {
			initialValues.fee_coin = feeSymbol;
			initialValues.fee_type = 'static';

			if (levels && levels[verification_level]) {
				initialValues.fee = levels[verification_level];
			} else {
				initialValues.fee = value;
			}
		} else {
			initialValues.fee_coin = '';
			initialValues.fee_type = 'percentage';

			if (levels && levels[verification_level]) {
				initialValues.fee = levels[verification_level];
			} else {
				initialValues.fee = value;
			}
		}
	} else if (coins[symbol]) {
		initialValues.fee = withdrawal_fee;
		initialValues.fee_coin = '';
		initialValues.fee_type = 'static';
	} else {
		initialValues.fee = 0;
		initialValues.fee_coin = '';
		initialValues.fee_type = 'static';
	}

	if (min) {
		initialValues.amount = min;
	} else {
		initialValues.amount = '';
	}

	initialValues.destination_tag = '';
	initialValues.address = '';

	if (networks && networks.length > 0) {
		initialValues.network = network;
	}

	if (network && query && network === query.network && query.address) {
		initialValues.address = query.address;
	}

	initialValues.method = 'address';

	return initialValues;
};

export const generateFormValues = (
	symbol,
	balance,
	calculateMax,
	coins = {},
	verification_level,
	theme = getTheme(),
	icon,
	iconId,
	networks,
	selectedNetwork,
	ICONS = '',
	selectedMethod,
	handleMethodChange = () => {}
) => {
	const isEmail = selectedMethod && selectedMethod === 'email' ? true : false;
	const {
		fullname,
		min,
		increment_unit,
		withdrawal_limits = {},
		withdrawal_fee,
		withdrawal_fees,
		display_name,
	} = coins[symbol] || DEFAULT_COIN_DATA;
	let MAX = withdrawal_limits[verification_level];
	if (withdrawal_limits[verification_level] === 0) MAX = '';
	if (withdrawal_limits[verification_level] === -1) MAX = 0;
	const available = balance[`${symbol}_available`] || 0;

	let fee;
	let fee_coin;
	let fee_type;
	let min_fee;
	let max_fee;
	if (
		withdrawal_fees &&
		selectedNetwork &&
		withdrawal_fees[selectedNetwork] &&
		!isEmail
	) {
		const {
			value,
			symbol,
			type = 'static',
			levels,
			min,
			max,
		} = withdrawal_fees[selectedNetwork];
		fee_type = type;

		if (type === 'static') {
			fee_coin = symbol;
		}

		if (type === 'percentage') {
			min_fee = min;
			max_fee = max;
		}

		if (levels && levels[verification_level]) {
			fee = levels[verification_level];
		} else {
			fee = value;
		}
	} else if (
		!networks &&
		withdrawal_fees &&
		withdrawal_fees[symbol] &&
		!isEmail
	) {
		const {
			value,
			symbol: feeSymbol,
			type = 'static',
			levels,
			min,
			max,
		} = withdrawal_fees[symbol];
		fee_type = type;

		if (type === 'static') {
			fee_coin = feeSymbol;
		}

		if (type === 'percentage') {
			min_fee = min;
			max_fee = max;
		}

		if (levels && levels[verification_level]) {
			fee = levels[verification_level];
		} else {
			fee = value;
		}
	} else if (coins[symbol] && !isEmail) {
		fee = withdrawal_fee;
		fee_type = 'static';
	} else {
		fee = 0;
		fee_type = 'static';
	}

	const fields = {};
	fields.method = {
		type: 'select',
		stringId: 'WITHDRAWALS_FORM_METHOD, WITHDRAWALS_FORM_MAIL_INFO',
		label: STRINGS['WITHDRAWALS_FORM_METHOD'],
		options: [
			{
				value: 'address',
				label: `${display_name} ${STRINGS[
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.ADDRESS_LABEL'
				].toLowerCase()}`,
			},
			{ value: 'email', label: STRINGS['FORM_FIELDS.EMAIL_LABEL'] },
		],
		fullWidth: true,
		ishorizontalfield: true,
		emailMsg: STRINGS['WITHDRAWALS_FORM_MAIL_INFO'],
		isEmail,
		onChange: (e) => handleMethodChange(e),
	};
	if (networks && !isEmail) {
		const networkOptions = networks.map((network) => ({
			value: network,
			label: getNetworkNameByKey(network),
		}));
		fields.network = {
			type: 'select',
			stringId:
				'WITHDRAWALS_FORM_NETWORK_LABEL,WITHDRAWALS_FORM_NETWORK_PLACEHOLDER,WITHDRAWALS_FORM_NETWORK_WARNING',
			label: STRINGS['WITHDRAWALS_FORM_NETWORK_LABEL'],
			placeholder: STRINGS['WITHDRAWALS_FORM_NETWORK_PLACEHOLDER'],
			warning: STRINGS['WITHDRAWALS_FORM_NETWORK_WARNING'],
			validate: [required],
			fullWidth: true,
			options: networkOptions,
			hideCheck: true,
			ishorizontalfield: true,
			disabled: networks.length === 1,
		};
	}
	if (
		!networks ||
		(networks && (networks.length === 1 || selectedNetwork)) ||
		isEmail
	) {
		if (!isEmail) {
			fields.address = {
				type: 'text',
				stringId:
					'WITHDRAWALS_FORM_ADDRESS_LABEL,WITHDRAWALS_FORM_ADDRESS_PLACEHOLDER',
				label: STRINGS['WITHDRAWALS_FORM_ADDRESS_LABEL'],
				placeholder: STRINGS['WITHDRAWALS_FORM_ADDRESS_PLACEHOLDER'],
				validate: [
					required,
					validAddress(
						symbol,
						STRINGS[`WITHDRAWALS_${symbol.toUpperCase()}_INVALID_ADDRESS`],
						selectedNetwork
					),
				],
				fullWidth: true,
				ishorizontalfield: true,
			};
		}
		if (isEmail) {
			fields.email = {
				type: 'text',
				stringId:
					'WITHDRAWALS_FORM_ADDRESS_EXCHANGE,WITHDRAWALS_FORM_EXCHANGE_PLACEHOLDER',
				label: STRINGS['WITHDRAWALS_FORM_ADDRESS_EXCHANGE'],
				placeholder: STRINGS['WITHDRAWALS_FORM_EXCHANGE_PLACEHOLDER'],
				validate: [required, email],
				fullWidth: true,
				ishorizontalfield: true,
			};
		}
		if (!isEmail && symbol === 'xrp') {
			fields.destination_tag = {
				type: 'number',
				stringId:
					'WITHDRAWALS_FORM_DESTINATION_TAG_LABEL,WITHDRAWALS_FORM_DESTINATION_TAG_PLACEHOLDER,WITHDRAWALS_FORM_DESTINATION_TAG_WARNING',
				label: STRINGS['WITHDRAWALS_FORM_DESTINATION_TAG_LABEL'],
				warning: STRINGS['WITHDRAWALS_FORM_DESTINATION_TAG_WARNING'],
				placeholder: STRINGS['WITHDRAWALS_FORM_DESTINATION_TAG_PLACEHOLDER'],
				fullWidth: true,
				ishorizontalfield: true,
			};
		} else if (symbol === 'xlm' || selectedNetwork === 'xlm') {
			fields.destination_tag = {
				type: 'text',
				stringId:
					'WITHDRAWALS_FORM_MEMO_LABEL,WITHDRAWALS_FORM_DESTINATION_TAG_PLACEHOLDER,WITHDRAWALS_FORM_DESTINATION_TAG_WARNING',
				label: STRINGS['WITHDRAWALS_FORM_MEMO_LABEL'],
				warning: STRINGS['WITHDRAWALS_FORM_DESTINATION_TAG_WARNING'],
				placeholder: STRINGS['WITHDRAWALS_FORM_DESTINATION_TAG_PLACEHOLDER'],
				fullWidth: true,
				ishorizontalfield: true,
			};
		}

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
		// FIX add according fee
		// amountValidate.push(checkBalance(available, STRINGS.formatString(STRINGS["WITHDRAWALS_LOWER_BALANCE"], fullname), fee));
		if (fee_coin && fee_coin !== symbol) {
			const availableFeeBalance = balance[`${fee_coin}_available`] || 0;
			const { fullname: feeFullname } = coins[fee_coin];

			amountValidate.push(checkBalance(available, fullname, 0));
			amountValidate.push(checkFee(availableFeeBalance, feeFullname, fee));
		} else {
			amountValidate.push(
				checkBalance(available, fullname, fee, fee_type, min_fee, max_fee)
			);
		}

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
		};

		if (coins[symbol]) {
			const { fullname: feeFullname } = coins[fee_coin] || coins[symbol];

			fields.fee = {
				type: 'number',
				stringId:
					'WITHDRAWALS_FORM_FEE_COMMON_LABEL,WITHDRAWALS_FORM_FEE_PLACEHOLDER',
				label: STRINGS.formatString(
					STRINGS[
						fee_coin && fee_coin !== symbol
							? 'WITHDRAWALS_FORM_FEE_COMMON_LABEL_COIN'
							: 'WITHDRAWALS_FORM_FEE_COMMON_LABEL'
					],
					feeFullname
				),
				placeholder: STRINGS.formatString(
					STRINGS['WITHDRAWALS_FORM_FEE_PLACEHOLDER'],
					feeFullname
				).join(''),
				disabled: true,
				fullWidth: true,
				ishorizontalfield: true,
				...(fee_coin && fee_coin !== symbol
					? {
							warning: STRINGS.formatString(
								STRINGS['WITHDRAWALS_FORM_FEE_WARNING'],
								feeFullname,
								fee_coin.toUpperCase()
							),
					  }
					: {}),
			};
		} else {
			fields.fee = {
				type: 'editable',
				stringId: `WITHDRAWALS_FORM_FEE_${symbol.toUpperCase()}_LABEL,WITHDRAWALS_FORM_FEE_PLACEHOLDER`,
				inputType: 'number',
				label: STRINGS[`WITHDRAWALS_FORM_FEE_${symbol.toUpperCase()}_LABEL`],
				placeholder: STRINGS.formatString(
					STRINGS['WITHDRAWALS_FORM_FEE_PLACEHOLDER'],
					fullname
				).join(''),
				min: min,
				max: MAX,
				step: min,
				validate: [required, minValue(min), MAX ? maxValue(MAX) : ''],
				normalize: normalizeBTCFee,
				fullWidth: true,
				ishorizontalfield: true,
			};
		}

		fields.fee_coin = {
			type: 'hidden',
			label: 'fee coin',
			disabled: true,
			fullWidth: true,
			ishorizontalfield: true,
		};

		fields.fee_type = {
			type: 'hidden',
			label: 'fee type',
			disabled: true,
			fullWidth: true,
			ishorizontalfield: true,
		};
	}

	fields.captcha = {
		type: 'captcha',
		language: getLanguage(),
		theme: theme,
		validate: [required],
	};

	return fields;
};
