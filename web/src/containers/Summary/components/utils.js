import React from 'react';
import moment from 'moment';
import { ReactSVG } from 'react-svg';
import { Link } from 'react-router';
import classnames from 'classnames';

import { calculatePrice } from '../../../utils/currency';
import STRINGS from '../../../config/localizedStrings';
import { BASE_CURRENCY } from '../../../config/constants';

export const getXhtRequirements = (user, coins) => {
	let walletDeposit = false;
	let xhtDeposit = false;
	if (user.balance) {
		Object.keys(coins).forEach((pair) => {
			if (user.balance[`${pair.toLowerCase()}_balance`] > 0) {
				walletDeposit = true;
			}
		});
		if (user.balance.xht_balance && user.balance.xht_balance > 0) {
			xhtDeposit = true;
		}
	}
	const verificationObj = {
		1: {
			title: STRINGS['USER_VERIFICATION.MAKE_FIRST_DEPOSIT'],
			completed: walletDeposit,
			status: walletDeposit ? 3 : 0,
		},
		2: {
			title: STRINGS['USER_VERIFICATION.OBTAIN_XHT'],
			completed: xhtDeposit,
			status: xhtDeposit ? 3 : 0,
		},
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

export const getBonusRequirements = (user, coins, affiliation = {}) => {
	const { address, phone_number, id_data = {} } = user.userData;
	const identity = address.country
		? id_data.status && id_data.status === 3
			? 3
			: 1
		: 1;
	let walletDeposit = false;
	let accVerified = !!phone_number && identity === 3;
	if (user.balance) {
		Object.keys(coins).forEach((pair) => {
			if (user.balance[`${pair.toLowerCase()}_balance`] > 0) {
				walletDeposit = true;
			}
		});
	}
	const verificationObj = {
		1: {
			title: STRINGS['SUMMARY.MAKE_FIRST_DEPOSIT'],
			completed: walletDeposit,
			status: walletDeposit ? 3 : 0,
		},
		2: {
			title: STRINGS['SUMMARY.COMPLETE_ACC_VERIFICATION'],
			completed: accVerified,
			status: accVerified ? 3 : 0,
		},
		3: {
			title: STRINGS['SUMMARY.INVITE_USER'],
			completed: !!affiliation.count,
			status: affiliation.count ? 3 : 0,
		},
		4: {
			title: STRINGS['SUMMARY.JOIN_HAP'],
			completed: user.is_hap,
			status: user.is_hap ? 3 : 0,
		},
		5: {
			title: STRINGS['SUMMARY.EARN_RUNNING_EXCHANGE'],
			completed: false,
			status: 0,
		},
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
				let pairPrice = calculatePrice(volumeObj.volume, pairValue.pair_base);
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
	const month = moment().subtract(1, 'month').format('M');
	const trade = tradeData[month];
	let total = 0;
	if (trade) {
		Object.keys(trade).map((pair) => {
			let pairValue = pairs[pair] || {};
			let volumeObj = trade[pair] || {};
			let pairPrice = calculatePrice(volumeObj.volume, pairValue.pair_base);
			total += pairPrice;
			return total;
		});
	}
	return total;
};

export const generateWaveHeaders = (ICONS) => [
	{
		label: STRINGS['SUMMARY.WAVE_NUMBER'],
		key: 'id',
		renderCell: ({ no = 0, status = '' }, key, index) => {
			return (
				<td
					key={index}
					className={classnames({
						'wave-phase-completed': status === true,
						'wave-phase-pending': status === false,
					})}
				>
					<div className="d-flex">
						<ReactSVG
							src={ICONS['INCOMING_WAVE']}
							className="wave-auction-icon"
						/>
						<div className="ml-1">{no}</div>
					</div>
				</td>
			);
		},
	},
	{
		label: STRINGS['AMOUNT'],
		key: 'amount',
		renderCell: ({ amount = '', status = '' }, key, index) => {
			return (
				<td
					key={index}
					className={classnames({
						'wave-phase-completed': status === true,
						'wave-phase-pending': status === false,
					})}
				>
					{amount}
				</td>
			);
		},
	},
	{
		label: STRINGS['FILLED'],
		key: 'filled',
		renderCell: ({ filled = 0, status = '' }, key, index) => {
			return (
				<td
					key={index}
					className={classnames({
						'wave-phase-completed': status === true,
						'wave-phase-pending': status === false,
					})}
				>
					{filled}
				</td>
			);
		},
	},
	{
		label: STRINGS.formatString(
			STRINGS['LOWEST_PRICE'],
			BASE_CURRENCY.toUpperCase()
		).join(''),
		key: 'low',
		renderCell: ({ low = 0, status = '' }, key, index) => {
			return status === 'TBA' ? (
				<td key={index}>{low}</td>
			) : status === true ? (
				<td key={index} className="wave-phase-completed">
					{low}
				</td>
			) : (
				<td key={index} className="wave-phase-pending">
					{STRINGS['PENDING']}
				</td>
			);
		},
	},
	{
		label: STRINGS['PHASE'],
		key: 'phase',
		renderCell: ({ phase = 0, status = '' }, key, index) => {
			return (
				<td
					key={index}
					className={classnames({
						'wave-phase-completed': status === true,
						'wave-phase-pending': status === false,
					})}
				>
					{phase}
				</td>
			);
		},
	},
	{
		label: STRINGS['STATUS'],
		key: 'status',
		renderCell: ({ status = '', updated_at = '' }, key, index) => {
			let statusTxt =
				status === true
					? STRINGS['USER_VERIFICATION.COMPLETED']
					: STRINGS['INCOMING'];
			let updated =
				status === true ? (
					`(${moment(updated_at).format('MMMM Do YYYY, hh:mm:ss')})`
				) : (
					<Link className="blue-link" to="/trade/xht-usdt">
						({STRINGS['GO_TRADE']})
					</Link>
				);
			return status === 'TBA' ? (
				<td key={index}>{status}</td>
			) : (
				<td
					key={index}
					className={classnames({
						'wave-phase-completed': status === true,
						'wave-phase-pending': status === false,
					})}
				>
					{statusTxt} {updated}
				</td>
			);
		},
	},
];
