import { isMobile } from 'react-device-detect';
import {
	required,
	minValue,
	checkBalance,
	checkFee,
	validAddress,
	normalizeBTC,
	normalizeBTCFee,
} from 'components/Form/validations';
import STRINGS from 'config/localizedStrings';
import { STATIC_ICONS } from 'config/icons';
import { DEFAULT_COIN_DATA } from 'config/constants';
import { getTheme } from 'utils/theme';
import { toFixed } from 'utils/currency';
import { getDecimals } from 'utils/utils';
import { getNetworkNameByKey } from 'utils/wallet';
import { email } from 'components/AdminForm/validations';
import BigNumber from 'bignumber.js';
import math from 'mathjs';

export const generateInitialValues = (
	symbol,
	coins = {},
	networks,
	network,
	query,
	verification_level,
	selectedMethod,
	coin_customizations
) => {
	const { withdrawal_fee, withdrawal_fees } =
		coins[symbol] || DEFAULT_COIN_DATA;
	const initialValues = {};

	if (withdrawal_fees && network && withdrawal_fees[network]) {
		const { value, symbol } = withdrawal_fees[network];
		initialValues.fee_coin = symbol;
		initialValues.fee = value;
	} else if (withdrawal_fees && withdrawal_fees[symbol]) {
		const { value, symbol: feeSymbol } = withdrawal_fees[symbol];

		initialValues.fee_coin = feeSymbol;
		initialValues.fee = value;
	} else if (coins[symbol]) {
		initialValues.fee = withdrawal_fee;
		initialValues.fee_coin = '';
	} else {
		initialValues.fee = 0;
		initialValues.fee_coin = '';
	}

	initialValues.amount = '';

	const feeMarkup =
		coin_customizations?.[symbol]?.fee_markups?.[network]?.withdrawal?.value;
	if (
		feeMarkup &&
		coin_customizations?.[symbol]?.fee_markups?.[network]?.withdrawal
			?.symbol === withdrawal_fees?.[network]?.symbol
	) {
		const incrementUnit = coins?.[symbol]?.increment_unit;
		const decimalPoint = new BigNumber(incrementUnit).dp();
		const roundedMarkup = new BigNumber(feeMarkup)
			.decimalPlaces(decimalPoint)
			.toNumber();

		initialValues.fee = new BigNumber(initialValues.fee || 0)
			.plus(roundedMarkup || 0)
			.toNumber();
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
	handleMethodChange = () => {},
	openQRScanner = () => {}
) => {
	const isEmail = selectedMethod && selectedMethod === 'email' ? true : false;
	const {
		fullname,
		min,
		increment_unit,
		withdrawal_fee,
		withdrawal_fees,
		display_name,
	} = coins[symbol] || DEFAULT_COIN_DATA;

	const available = balance[`${symbol}_available`] || 0;

	let fee;
	let fee_coin;
	if (
		withdrawal_fees &&
		selectedNetwork &&
		withdrawal_fees[selectedNetwork] &&
		!isEmail
	) {
		const { value, symbol } = withdrawal_fees[selectedNetwork];
		fee_coin = symbol;
		fee = value;
	} else if (
		!networks &&
		withdrawal_fees &&
		withdrawal_fees[symbol] &&
		!isEmail
	) {
		const { value, symbol: feeSymbol } = withdrawal_fees[symbol];
		fee_coin = feeSymbol;
		fee = value;
	} else if (coins[symbol] && !isEmail) {
		fee = withdrawal_fee;
	} else {
		fee = 0;
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
				notification: [
					{
						stringId: 'QR_CODE.SCAN',
						text: STRINGS['QR_CODE.SCAN'],
						status: 'information',
						iconPath: STATIC_ICONS['QR_CODE_SCAN'],
						className: 'file_upload_icon',
						useSvg: true,
						onClick: openQRScanner,
						showActionText: !isMobile,
					},
				],
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
		} else if (
			!isEmail &&
			(symbol === 'xlm' ||
				selectedNetwork === 'xlm' ||
				selectedNetwork === 'ton')
		) {
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

		// FIX add according fee
		// amountValidate.push(checkBalance(available, STRINGS.formatString(STRINGS["WITHDRAWALS_LOWER_BALANCE"], fullname), fee));
		if (fee_coin && fee_coin !== symbol) {
			const availableFeeBalance = balance[`${fee_coin}_available`] || 0;
			const { fullname: feeFullname } = coins[fee_coin];

			amountValidate.push(checkBalance(available, fullname, 0));
			amountValidate.push(checkFee(availableFeeBalance, feeFullname, fee));
		} else {
			amountValidate.push(checkBalance(available, fullname));
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
					const newValue = decValue
						.toString()
						.substring(
							0,
							decValue.toString().length - (valueDecimal - decimal)
						);
					if (math.larger(newValue, min)) {
						result = newValue;
					}
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
				step: min,
				validate: [required, minValue(min)],
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

	return fields;
};
