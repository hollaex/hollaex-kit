import moment from 'moment';
import { calculatePrice } from '../../../utils/currency';
import STRINGS from '../../../config/localizedStrings';

export const getHexRequirements = (user, coins) => {
	let walletDeposit = false;
	let hexDeposit = false;
	if (user.balance) {
		Object.keys(coins).forEach(pair => {
			if (user.balance[`${pair.toLowerCase()}_balance`] > 0) {
				walletDeposit = true;
			}
		})
		if (user.balance.hex_balance && user.balance.hex_balance > 0) {
			hexDeposit = true;
		}
	}
	const verificationObj = {
		'1': {
			title: STRINGS.USER_VERIFICATION.MAKE_FIRST_DEPOSIT,
			completed: walletDeposit,
			status: walletDeposit ? 3 : 0
		},
		'2': {
			title: STRINGS.USER_VERIFICATION.OBTAIN_HEX,
			completed: hexDeposit,
			status: hexDeposit ? 3 : 0
		}
	};
	return verificationObj;
};

export const checkBankVerification = (bank_account = [], id_data) => {
	let bank_status = 0;
	if (bank_account.length) {
		if (bank_account.filter((data) => data.status === 3).length) {
			bank_status = 3;
		} else if (bank_account.filter((data) => data.status === 1).length) {
			bank_status = 1;
		} else if (bank_account.filter((data) => data.status === 2).length) {
			bank_status = 2;
		}
		if (id_data.status !== 3) {
			bank_status = 1;
		}
		if (
			bank_account.length ===
			bank_account.filter((data) => data.status === 0).length
		) {
			bank_status = 0;
		}
	}
	return bank_status;
};

export const getBonusRequirements = (user, coins) => {
	const { address, phone_number, id_data = {} } = user.userData;
	const identity = address.country
		? id_data.status && id_data.status === 3
			? 3
			: 1
		: 1;
	let walletDeposit = false;
	let hexDeposit = false;
	let accVerified = !!phone_number && identity === 3
	if (user.balance) {
		Object.keys(coins).forEach(pair => {
			if (user.balance[`${pair.toLowerCase()}_balance`] > 0) {
				walletDeposit = true;
			}
		});
		if (user.balance.hex_balance && user.balance.hex_balance > 0) {
			hexDeposit = true;
		}
	}
	const verificationObj = {
		'1': {
			title: STRINGS.SUMMARY.MAKE_FIRST_DEPOSIT,
			completed: walletDeposit,
			status: walletDeposit ? 3 : 0
		},
		'2': {
			title: STRINGS.SUMMARY.BUY_FIRST_HEX,
			completed: hexDeposit,
			status: hexDeposit ? 3 : 0
		},
		'3': {
			title: STRINGS.SUMMARY.COMPLETE_ACC_VERIFICATION,
			completed: accVerified,
			status: accVerified ? 3 : 0
		},
		'4': {
			title: STRINGS.SUMMARY.INVITE_USER,
			completed: false,
			status: 0
		},
		'5': {
			title: STRINGS.SUMMARY.JOIN_HAP,
			completed: user.is_hap,
			status: user.is_hap ? 3 : 0
		},
		'6': {
			title: STRINGS.SUMMARY.EARN_RUNNING_EXCHANGE,
			completed: false,
			status: 0
		}
	};
	return verificationObj;
};

export const getTradeVolumeTotal = (tradeData, prices, pairs) => {
	let totalVolume = 0;
	Object.keys(tradeData).map((month) => {
		let trade = tradeData[month];
		if (trade) {
			let total = 0;
			Object.keys(trade).map((pair) => {
				let pairValue = pairs[pair] || {};
				let volumeObj = trade[pair] || {};
				let pairPrice = calculatePrice(
					volumeObj.volume,
					prices[pairValue.pair_base]
				);
				total += pairPrice;
				return total;
			});
			totalVolume += total;
		}
		return month;
	});
	return totalVolume;
};

export const getLastMonthVolume = (tradeData = {}, prices = {}, pairs = {}) => {
	const month = moment()
		.subtract(1, 'month')
		.format('M');
	const trade = tradeData[month];
	let total = 0;
	if (trade) {
		Object.keys(trade).map((pair) => {
			let pairValue = pairs[pair] || {};
			let volumeObj = trade[pair] || {};
			let pairPrice = calculatePrice(
				volumeObj.volume,
				prices[pairValue.pair_base]
			);
			total += pairPrice;
			return total;
		});
	}
	return total;
};
