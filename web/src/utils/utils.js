import React from 'react';
import { browserHistory } from 'react-router';
import { isMobile } from 'react-device-detect';
import moment from 'moment';
import momentJ from 'moment-jalaali';
import math from 'mathjs';
import _orderBy from 'lodash/orderBy';

import strings from 'config/localizedStrings';
import icons from 'config/icons/dark';
import _toLower from 'lodash/toLower';
import {
	TIMESTAMP_FORMAT,
	TIMESTAMP_FORMAT_FA,
	DEFAULT_TIMESTAMP_FORMAT,
	AUDIOS,
} from '../config/constants';
import { getLanguage } from './string';
import { Button, EditWrapper, Image } from 'components';

const bitcoin = {
	COIN: 100000000,
	PRECISION: 8,
	DUST: 2730,
	BASE_FEE: 10000,
};

const CHART_RESOLUTION_KEY = 'chart_resolution_data';

/**
 * convert a BTC value to Satoshi
 *
 * @param btc   float       BTC value
 * @returns int             Satoshi value (int)
 */
bitcoin.toSatoshi = (btc) => {
	return parseInt((btc * bitcoin.COIN).toFixed(0), 10);
};

/**
 * convert a Satoshi value to BTC
 *
 * @param satoshi   int     Satoshi value
 * @returns {string}        BTC value (float)
 */
bitcoin.toBTC = (satoshi) => {
	return (satoshi / bitcoin.COIN).toFixed(bitcoin.PRECISION);
};

export default bitcoin;

export const getFormattedBOD = (date, format = DEFAULT_TIMESTAMP_FORMAT) => {
	if (getLanguage() === 'fa') {
		return formatTimestampFarsi(date, format);
	}
	return formatTimestampGregorian(date, format);
};

export const getFormatTimestamp = (date, format) => {
	if (getLanguage() === 'fa') {
		return formatTimestampFarsi(date, format);
	}
	return formatTimestampGregorian(date, format);
};

export const formatTimestamp = (date, format) => {
	return formatTimestampGregorian(date, format);
};

export const formatTimestampGregorian = (date, format = TIMESTAMP_FORMAT) =>
	moment(date).format(format);

export const formatTimestampFarsi = (date, format = TIMESTAMP_FORMAT_FA) =>
	momentJ(date).format(format);

export const getDecimals = (value = 0) => {
	let result = math.format(math.number(value), { notation: 'fixed' });
	return value % 1
		? result.toString().split('.')[1]
			? result.toString().split('.')[1].length
			: 0
		: 0;
};

export const isBlockchainTx = (transactionId) => {
	return transactionId.indexOf('-') === -1 ? true : false;
};

export const constructSettings = (state = {}, settings) => {
	let settingsData = { ...state };
	if (settings.notification) {
		settingsData.notification = {
			...settingsData.notification,
			...settings.notification,
		};
	}
	if (settings.interface) {
		settingsData.interface = {
			...settingsData.interface,
			...settings.interface,
		};
	}
	if (settings.audio) {
		settingsData.audio = { ...settingsData.settingsData, ...settings.audio };
	}
	if (settings.risk) {
		settingsData.risk = { ...settingsData.risk, ...settings.risk };
	}
	if (settings.chat) {
		settingsData.chat = { ...settingsData.chat, ...settings.chat };
	}
	if (settings.language) {
		settingsData.language = settings.language;
	}
	if (settings.app) {
		settingsData.apps = settings.app;
	}

	// ToDo: need to these code after end point update.
	if (
		settings.popup_order_confirmation ||
		settings.popup_order_confirmation === false
	) {
		settingsData.notification.popup_order_confirmation =
			settings.popup_order_confirmation;
	}
	if (
		settings.popup_order_completed ||
		settings.popup_order_completed === false
	) {
		settingsData.notification.popup_order_completed =
			settings.popup_order_completed;
	}
	if (
		settings.popup_order_partially_filled ||
		settings.popup_order_partially_filled === false
	) {
		settingsData.notification.popup_order_partially_filled =
			settings.popup_order_partially_filled;
	}
	if (settings.popup_order_new || settings.popup_order_new === false) {
		settingsData.notification.popup_order_new = settings.popup_order_new;
	}
	if (
		settings.popup_order_canceled ||
		settings.popup_order_canceled === false
	) {
		settingsData.notification.popup_order_canceled =
			settings.popup_order_canceled;
	}

	if (settings.theme) {
		settingsData.interface.theme = settings.theme;
	}
	if (settings.order_book_levels) {
		settingsData.interface.order_book_levels = settings.order_book_levels;
	}

	if (settings.order_completed || settings.order_completed === false) {
		settingsData.audio.order_completed = settings.order_completed;
	}
	if (
		settings.order_partially_completed ||
		settings.order_partially_completed === false
	) {
		settingsData.audio.order_partially_completed =
			settings.order_partially_completed;
	}
	if (settings.public_trade || settings.public_trade === false) {
		settingsData.audio.public_trade = settings.public_trade;
	}

	if (settings.order_portfolio_percentage) {
		settingsData.risk.order_portfolio_percentage =
			settings.order_portfolio_percentage;
	}
	if (settings.popup_warning || settings.popup_warning === false) {
		settingsData.risk.popup_warning = settings.popup_warning;
	}

	if (settings.set_username) {
		settingsData.chat.set_username = settings.set_username;
	}
	if (settings.theme) {
		settingsData.theme = settings.theme;
	}

	return settingsData;
};

export const playBackgroundAudioNotification = (
	type = '',
	audioSettings = { audio: {} }
) => {
	let audioSetup = {
		all: true,
		public_trade: false,
		order_partially_completed: true,
		order_placed: true,
		order_canceled: true,
		order_completed: true,
		click_amounts: true,
		get_quote_quick_trade: true,
		quick_trade_success: true,
		quick_trade_timeout: true,
		...audioSettings.audio,
	};
	let audioFile = '';
	switch (type) {
		case 'orderbook_market_order':
		case 'filled':
			if (audioSetup.order_completed) {
				audioFile = AUDIOS.ORDER_COMPLETED;
			} else {
				audioFile = '';
			}
			break;
		case 'pfilled':
			if (audioSetup.order_partially_completed) {
				audioFile = AUDIOS.ORDER_PARTIALLY_COMPLETED;
			} else {
				audioFile = '';
			}
			break;
		case 'orderbook_field_update':
			if (audioSetup.click_amounts) {
				audioFile = AUDIOS.ORDERBOOK_FIELD_UPDATE;
			} else {
				audioFile = '';
			}
			break;
		case 'orderbook_limit_order':
			if (audioSetup.order_placed) {
				audioFile = AUDIOS.ORDERBOOK_LIMIT_ORDER;
			} else {
				audioFile = '';
			}
			break;
		case 'public_trade':
			if (audioSetup.public_trade) {
				audioFile = AUDIOS.PUBLIC_TRADE_NOTIFICATION;
			} else {
				audioFile = '';
			}
			break;
		case 'cancel_order':
			if (audioSetup.order_canceled) {
				audioFile = AUDIOS.CANCEL_ORDER;
			} else {
				audioFile = '';
			}
			break;
		case 'quick_trade_complete':
			if (audioSetup.quick_trade_success) {
				audioFile = AUDIOS.QUICK_TRADE_COMPLETE;
			} else {
				audioFile = '';
			}
			break;
		case 'review_quick_trade_order':
			if (audioSetup.get_quote_quick_trade) {
				audioFile = AUDIOS.REVIEW_QUICK_TRADE_ORDER;
			} else {
				audioFile = '';
			}
			break;
		case 'time_out_quick_trade':
			if (audioSetup.quick_trade_timeout) {
				audioFile = AUDIOS.TIME_OUT_QUICK_TRADE;
			} else {
				audioFile = '';
			}
			break;
		default:
	}
	if (audioSetup.all === false) {
		audioFile = '';
	}
	const audio = new Audio(audioFile);
	if (audioFile) audio.play();
};

export const setChartResolution = (resolution, pair) => {
	try {
		const prevObj = localStorage.getItem(CHART_RESOLUTION_KEY);
		let prevObjData = prevObj ? JSON.parse(prevObj) : {};
		prevObjData[pair] = resolution;
		localStorage.setItem(CHART_RESOLUTION_KEY, JSON.stringify(prevObjData));
	} catch (err) {
		console.log(err);
	}
};

export const getChartResolution = () => {
	try {
		const resolutionData = localStorage.getItem(CHART_RESOLUTION_KEY);
		return resolutionData ? JSON.parse(resolutionData) : {};
	} catch (err) {
		console.log(err);
	}
};

export const handleUpgrade = (info = {}) => {
	if (
		_toLower(info.plan) !== 'crypto' &&
		_toLower(info.plan) !== 'fiat' &&
		_toLower(info.plan) !== 'boost' &&
		_toLower(info.type) !== 'enterprise'
	) {
		return true;
	} else {
		return false;
	}
};

export const handleFiatUpgrade = (info = {}) => {
	if (_toLower(info.plan) !== 'fiat' && _toLower(info.plan) !== 'boost') {
		return true;
	} else {
		return false;
	}
};

export const handleEnterpriseUpgrade = (info = {}) => {
	if (_toLower(info.plan) !== 'fiat') {
		return true;
	} else {
		return false;
	}
};

export const filterPinnedAssets = (pinnedAssets, coins) => {
	const coinKeys = Object.keys(coins);
	return pinnedAssets.filter((pinnedAsset) => coinKeys.includes(pinnedAsset));
};

export const constractPaymentOption = (paymentsData) => {
	const tempData = [];
	Object.keys(paymentsData).forEach((key) => {
		tempData.push({ name: key, ...paymentsData[key] });
	});
	return _orderBy(tempData, ['orderBy'], ['asc']);
};

export const handlePopupContainer = (triggerNode) => {
	return triggerNode.parentNode;
};

const ErrorDisplay = ({
	icon,
	statusCode,
	errorType,
	descText,
	reconnectHandler,
}) => {
	return (
		<div
			className={
				isMobile
					? 'display-error-container display-error-container-mobile'
					: 'display-error-container'
			}
		>
			<div className="w-75 d-flex flex-column h-100 align-items-center justify-content-center">
				{errorType !== 'ERROR_TAB.NETWORK_ERROR' ? (
					<Image
						icon={icon}
						wrapperClassName={
							errorType === 'ERROR_TAB.SERVER_MAINTENANCE_ERROR'
								? 'display-error-icon server-maintenance-icon'
								: 'display-error-icon'
						}
					/>
				) : (
					<div className="display-error-icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="87.321"
							height="71.906"
							viewBox="0 0 87.321 71.906"
						>
							<g
								id="Group_2"
								data-name="Group 2"
								transform="translate(-915 -324)"
								opacity="0.55"
							>
								<g
									id="Layer_2"
									data-name="Layer 2"
									transform="translate(915 324)"
								>
									<path
										id="Path_1"
										data-name="Path 1"
										d="M59.887,71.311A3.881,3.881,0,0,0,62.6,64.657a17.7,17.7,0,0,0-10.177-5.009,3.881,3.881,0,1,0-.988,7.7A10.007,10.007,0,0,1,57.172,70.2a3.869,3.869,0,0,0,2.715,1.108Z"
										transform="translate(-6.281 -10.157)"
										fill="#d9d9d9"
									/>
									<path
										id="Path_2"
										data-name="Path 2"
										d="M70.076,61.049a3.881,3.881,0,0,0,2.77-6.6,31.178,31.178,0,0,0-9.635-6.663,3.881,3.881,0,1,0-3.153,7.092,23.458,23.458,0,0,1,7.249,5.006,3.869,3.869,0,0,0,2.77,1.163Z"
										transform="translate(-6.57 -9.795)"
										fill="#d9d9d9"
									/>
									<path
										id="Path_3"
										data-name="Path 3"
										d="M80.3,50.759a3.881,3.881,0,0,0,2.744-6.625,45.158,45.158,0,0,0-10.3-7.781,3.881,3.881,0,1,0-3.709,6.818,37.384,37.384,0,0,1,8.525,6.45A3.868,3.868,0,0,0,80.3,50.759Z"
										transform="translate(-6.846 -9.45)"
										fill="#d9d9d9"
									/>
									<path
										id="Path_4"
										data-name="Path 4"
										d="M82.075,25a3.881,3.881,0,1,0-3.981,6.663,50.3,50.3,0,0,1,9.722,7.633A3.881,3.881,0,1,0,93.3,33.8,58.038,58.038,0,0,0,82.075,25Z"
										transform="translate(-7.119 -9.11)"
										fill="#d9d9d9"
									/>
									<path
										id="Path_5"
										data-name="Path 5"
										d="M6.137,38.822a3.881,3.881,0,0,0,5.489,0,52.017,52.017,0,0,1,37.035-15.3,52.924,52.924,0,0,1,11.709,1.305l-4.444,5.555a46.228,46.228,0,0,0-7.265-.567A45.572,45.572,0,0,0,16.118,43.331a3.881,3.881,0,1,0,5.5,5.473A37.864,37.864,0,0,1,48.66,37.572c.5,0,.988.019,1.479.038l-5.2,6.506a31.307,31.307,0,0,0-18.89,9.178,3.881,3.881,0,0,0,5.54,5.437,23.437,23.437,0,0,1,4.5-3.555L24.43,69.749A3.881,3.881,0,1,0,30.49,74.6L78.211,14.945A3.881,3.881,0,0,0,72.15,10.1l-6.468,8.086A60.4,60.4,0,0,0,6.137,33.334a3.88,3.88,0,0,0,0,5.488Z"
										transform="translate(-5 -8.639)"
										fill="#d9d9d9"
									/>
									<circle
										id="Ellipse_1"
										data-name="Ellipse 1"
										cx="4.685"
										cy="4.685"
										r="4.685"
										transform="translate(38.975 62.535)"
										fill="#d9d9d9"
									/>
								</g>
							</g>
						</svg>
					</div>
				)}
				<div className="d-flex align-items-center flex-column justify-content-center mt-2">
					{statusCode && <span>{statusCode}</span>}
					<EditWrapper stringId={errorType}>
						<span className="font-weight-bold error-title">
							{strings[errorType]}
						</span>
					</EditWrapper>
					<div className="error-description-wrapper">
						<EditWrapper stringId={descText}>
							<span className="error-description">{strings[descText]}</span>
						</EditWrapper>
					</div>
				</div>
				<div className="button-container">
					<Button
						label={strings['CONNECTIONS.RECONNECT']}
						onClick={reconnectHandler}
						className="mt-2"
					/>
				</div>
			</div>
		</div>
	);
};

export const NetworkError = () => {
	return (
		<ErrorDisplay
			icon={icons['NETWORK_ERROR']}
			errorType="ERROR_TAB.NETWORK_ERROR"
			descText="ERROR_TAB.NETWORK_ERROR_DESC"
			reconnectHandler={() => window.location.reload()}
		/>
	);
};

export const ServerError = () => {
	return (
		<ErrorDisplay
			icon={icons['SERVER_ERROR']}
			statusCode="504"
			errorType="ERROR_TAB.SERVER_ERROR"
			descText="ERROR_TAB.SERVER_ERROR_DESC"
			reconnectHandler={() => window.location.reload()}
		/>
	);
};

export const ServerMaintenanceError = () => {
	return (
		<ErrorDisplay
			icon={icons['SERVER_MAINTENANCE_ERROR']}
			statusCode="503"
			errorType="ERROR_TAB.SERVER_MAINTENANCE_ERROR"
			descText="ERROR_TAB.SERVER_MAINTENANCE_ERROR_DESC"
			reconnectHandler={() => window.location.reload()}
		/>
	);
};

export const TooManyRequestError = () => {
	return (
		<ErrorDisplay
			icon={icons['TOO_MANY_REQUEST_ERROR']}
			statusCode="429"
			errorType="ERROR_TAB.TOO_MANY_REQUEST_ERROR"
			descText="ERROR_TAB.TOO_MANY_REQUEST_ERROR_DESC"
			reconnectHandler={() => window.location.reload()}
		/>
	);
};

export const DefaultError = ({ setIsError }) => {
	return (
		<ErrorDisplay
			icon={icons['SERVER_ERROR']}
			errorType="USER_APPS.ALL_APPS.ADD.FAILED"
			reconnectHandler={() => {
				setIsError();
				browserHistory.push('/account');
			}}
		/>
	);
};
