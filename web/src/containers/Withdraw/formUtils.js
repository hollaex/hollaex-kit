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
import { getNetworkLabelByKey } from 'utils/wallet';

export const generateInitialValues = (
	symbol,
	coins = {},
	networks,
	network,
	query
) => {
	const { min, withdrawal_fee, withdrawal_fees } =
		coins[symbol] || DEFAULT_COIN_DATA;
	const initialValues = {};

	if (withdrawal_fees && network && withdrawal_fees[network]) {
		initialValues.fee = withdrawal_fees[network].value;
		initialValues.fee_coin = withdrawal_fees[network].symbol;
	} else if (coins[symbol]) {
		initialValues.fee = withdrawal_fee;
		initialValues.fee_coin = '';
	} else {
		initialValues.fee = 0;
		initialValues.fee_coin = '';
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
	ICONS = ''
) => {
	const {
		fullname,
		min,
		increment_unit,
		withdrawal_limits = {},
		withdrawal_fee,
		withdrawal_fees,
	} = coins[symbol] || DEFAULT_COIN_DATA;
	let MAX = withdrawal_limits[verification_level];
	if (withdrawal_limits[verification_level] === 0) MAX = '';
	if (withdrawal_limits[verification_level] === -1) MAX = 0;
	const available = balance[`${symbol}_available`] || 0;

	let fee;
	let fee_coin;
	if (withdrawal_fees && selectedNetwork && withdrawal_fees[selectedNetwork]) {
		fee = withdrawal_fees[selectedNetwork].value;
		fee_coin = withdrawal_fees[selectedNetwork].symbol;
	} else if (coins[symbol]) {
		fee = withdrawal_fee;
	} else {
		fee = 0;
	}

	const fields = {};

	if (networks) {
		const networkOptions = networks.map((network) => ({
			value: network,
			label: getNetworkLabelByKey(network),
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

	if (!networks || (networks && (networks.length === 1 || selectedNetwork))) {
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
		if (symbol === 'xrp') {
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
			amountValidate.push(checkBalance(available, fullname, fee));
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
	}

	fields.captcha = {
		type: 'captcha',
		language: getLanguage(),
		theme: theme,
		validate: [required],
	};

	return fields;
};
