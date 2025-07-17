import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { isMobile } from 'react-device-detect';
import { Input, InputNumber, message, Select, Tooltip } from 'antd';
import {
	ExclamationCircleFilled,
	ExclamationCircleOutlined,
	PauseCircleFilled,
	PlayCircleFilled,
} from '@ant-design/icons';

import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import './AutoTrader.scss';
import { Button, Coin, Dialog, EditWrapper, Image, Table } from 'components';
import { AutoTraderEmptydata, ConfirmAutoTrade } from './Utils';
import {
	flipPair,
	getSourceOptions,
	quicktradePairSelector,
} from 'containers/QuickTrade/components/utils';
import {
	editAutoTradeDeatils,
	getAutoTradeDetails,
	removeAutoTrade,
	setAutoTrader,
} from './actions';
import { handlePopupContainer } from 'utils/utils';

const autoTraderData = (
	coins,
	user,
	onHandleRemoveTrade,
	onSetPauseData,
	onSetPlayData
) => {
	return [
		{
			stringId: 'CONTACT_FORM.DESCRIPTION_LABEL',
			label: STRINGS['CONTACT_FORM.DESCRIPTION_LABEL'],
			className: 'description-header',
			key: 'description',
			renderCell: (data, key) => (
				<td
					key={key}
					className={
						data?.active
							? 'description-content trade-active'
							: 'description-content trade-inactive'
					}
				>
					<div className="d-flex justify-content-start table_text">
						{data?.description || '-'}
					</div>
				</td>
			),
		},
		{
			stringId: 'AUTO_TRADER.ASSET_TO_BUY',
			label: STRINGS['AUTO_TRADER.ASSET_TO_BUY'],
			key: 'buy_coin',
			renderCell: (data, key) => (
				<td
					key={key}
					className={data?.active ? 'trade-active' : 'trade-inactive'}
				>
					<div className="d-flex justify-content-start table_text spend-asset-detail">
						<div
							className="selected-asset trade-asset"
							onClick={() => browserHistory.push(`/wallet/${data?.buy_coin}`)}
						>
							<span className="asset-icon">
								<Coin iconId={coins[data?.buy_coin]?.icon_id} type="CS5" />
							</span>
							<span>{data?.buy_coin?.toUpperCase()}</span>
						</div>
					</div>
				</td>
			),
		},
		{
			stringId: 'AUTO_TRADER.ASSET_TO_SPEND',
			label: STRINGS['AUTO_TRADER.ASSET_TO_SPEND'],
			key: 'spend_coin',
			renderCell: (data, key) => (
				<td
					key={key}
					className={data?.active ? 'trade-active' : 'trade-inactive'}
				>
					<div className="d-flex justify-content-start table_text spend-asset-detail">
						<div
							className="selected-asset trade-asset"
							onClick={() => browserHistory.push(`/wallet/${data?.spend_coin}`)}
						>
							<span className="asset-icon">
								<Coin iconId={coins[data?.spend_coin]?.icon_id} type="CS5" />
							</span>
							<span>{data?.spend_coin?.toUpperCase()}</span>
						</div>
					</div>
				</td>
			),
		},
		{
			stringId: 'AUTO_TRADER.AMOUNT_TO_SPEND',
			label: STRINGS['AUTO_TRADER.AMOUNT_TO_SPEND'],
			key: 'spend_amount',
			renderCell: (data, key) => (
				<td
					key={key}
					className={data?.active ? 'trade-active' : 'trade-inactive'}
				>
					<div className="d-flex justify-content-start table_text spend-asset-detail">
						<div className="selected-asset">
							<span>{data?.spend_amount}</span>
							<span>{data?.spend_coin?.toUpperCase()}</span>
						</div>
					</div>
				</td>
			),
		},
		{
			stringId: 'AUTO_TRADER.EXECUTION_INTERVAL',
			label: STRINGS['AUTO_TRADER.EXECUTION_INTERVAL'],
			key: 'frequency',
			renderCell: (data, key) => {
				const frequencyTrade =
					data?.frequency === 'daily'
						? STRINGS['AUTO_TRADER.DAILY']
						: data?.frequency === 'weekly'
						? STRINGS['AUTO_TRADER.WEEKLY']
						: data?.frequency === 'monthly' && STRINGS['AUTO_TRADER.MONTHLY'];

				return (
					<td
						key={key}
						className={data?.active ? 'trade-active' : 'trade-inactive'}
					>
						<div className="d-flex justify-content-start table_text spend-asset-detail">
							<div className="selected-asset frequency-trade">
								<span className="caps-first">{frequencyTrade}:</span>
								<span className="ml-1">
									{data?.frequency === 'weekly'
										? data?.week_days?.map((day) => {
												return (
													<span className="ml-1" key={day}>
														<span className="trade-days">
															{day === 0
																? STRINGS['AUTO_TRADER.SUNDAY']
																: day === 1
																? STRINGS['AUTO_TRADER.MONDAY']
																: day === 2
																? STRINGS['AUTO_TRADER.TUESDAY']
																: day === 3
																? STRINGS['AUTO_TRADER.WEDNESDAY']
																: day === 4
																? STRINGS['AUTO_TRADER.THURSDAY']
																: day === 5
																? STRINGS['AUTO_TRADER.FRIDAY']
																: day === 6 && STRINGS['AUTO_TRADER.SATURDAY']}
														</span>
													</span>
												);
										  })
										: data?.frequency === 'monthly' && (
												<span>{data?.day_of_month}</span>
										  )}
								</span>
							</div>
							<div className="selected-asset frequency-trade">
								<span>{`${data?.trade_hour}${':00'}`}</span>
							</div>
						</div>
					</td>
				);
			},
		},
		{
			stringId: 'AUTO_TRADER.DATE_CREATED',
			label: STRINGS['AUTO_TRADER.DATE_CREATED'],
			key: 'created_at',
			renderCell: (data, key) => (
				<td
					key={key}
					className={data?.active ? 'trade-active' : 'trade-inactive'}
				>
					<div className="d-flex justify-content-start table_text">
						{data?.created_at
							? new Date(data?.created_at)
									.toISOString()
									.slice(0, 10)
									.replace(/-/g, '/')
							: '-'}
					</div>
				</td>
			),
		},
		{
			stringId: 'STATUS',
			label: STRINGS['STATUS'],
			key: 'active',
			renderCell: (data, key) => (
				<td key={key}>
					<div className="d-flex justify-content-start table_text">
						{data?.active ? (
							<div className="active-link">
								<PlayCircleFilled className="active-play-icon" />
								<EditWrapper>
									<span>{STRINGS['DEVELOPER_SECTION.ACTIVE']}</span>
								</EditWrapper>
								<EditWrapper>
									(
									<span
										className="blue-link text-decoration-underline"
										onClick={() => onSetPauseData(data)}
									>
										{STRINGS['AUTO_TRADER.PAUSE']?.toUpperCase()}
									</span>
									)
								</EditWrapper>
							</div>
						) : (
							<div className="active-link">
								<PauseCircleFilled className="active-play-icon inactive-pause-icon" />
								<EditWrapper>
									<span>{STRINGS['AUTO_TRADER.PAUSED_TEXT']}</span>
								</EditWrapper>
								<EditWrapper>
									(
									<span
										className="blue-link text-decoration-underline"
										onClick={() => onSetPlayData(data)}
									>
										{STRINGS['AUTO_TRADER.PLAY']?.toUpperCase()}
									</span>
									)
								</EditWrapper>
							</div>
						)}
					</div>
				</td>
			),
		},
		{
			stringId: 'AUTO_TRADER.DELETE_TEXT',
			label: STRINGS['AUTO_TRADER.DELETE_TEXT'],
			key: 'delete',
			renderCell: (data, key) => (
				<td key={key}>
					<div className="d-flex justify-content-start table_text">
						<EditWrapper stringId="DEVELOPERS_TOKENS_POPUP.DELETE">
							<span
								className="blue-link text-decoration-underline"
								onClick={() => onHandleRemoveTrade(data)}
							>
								{STRINGS['DEVELOPERS_TOKENS_POPUP.DELETE']}
							</span>
						</EditWrapper>
					</div>
				</td>
			),
		},
	];
};

const Autotrader = ({
	user,
	sourceOptions,
	coins,
	features,
	exchangeTimeZone,
	quicktradePairs,
	icons,
}) => {
	const [isRenderPopup, setIsRenderPopup] = useState({
		isDisplayAutoTrader: false,
		isDisplayFrequencyPopup: false,
		isDisplayDescriptionPopup: false,
		isDisplayConfirmPopup: false,
		isDisplayDeletePopup: false,
		isDisplayPauseAutoTrade: false,
		isDisplayPlayAutoTrade: false,
		isDisplayMaximumTrade: false,
	});
	const [selectedTrade, setSelectedTrade] = useState([]);

	const [autoTradeDetails, setAutoTradeDetails] = useState({
		spend_coin: null,
		buy_coin: null,
		spend_amount: null,
		frequency: null,
		trade_hour: 0,
		week_days: [],
		day_of_month: null,
		description: null,
	});

	const [tradeDetails, setTradeDetails] = useState([]);

	const getTargetOptions = (source) =>
		sourceOptions.filter((key) => {
			const pairKey = `${key}-${source}`;
			const flippedKey = flipPair(pairKey);
			return quicktradePairs
				? quicktradePairs[pairKey] || quicktradePairs[flippedKey]
				: pairKey;
		});

	const pairedAsset = `${autoTradeDetails?.spend_coin}-${autoTradeDetails?.buy_coin}`;
	const queryPair =
		quicktradePairs &&
		(quicktradePairs[pairedAsset] || quicktradePairs[flipPair(pairedAsset)]
			? (quicktradePairs[pairedAsset] || quicktradePairs[flipPair(pairedAsset)])
					?.symbol
			: null);

	useEffect(() => {
		if (features?.auto_trade_config) {
			getTradeDetails();
		} else {
			browserHistory.push('/summary');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getTradeDetails = async () => {
		try {
			const autoTrade = await getAutoTradeDetails();
			setTradeDetails(autoTrade?.data);
		} catch (error) {
			console.error(error);
		}
	};

	const onHandleRemoveTrade = (data) => {
		setSelectedTrade(data);
		setIsRenderPopup((prev) => ({
			...prev,
			isDisplayDeletePopup: true,
		}));
	};

	const onRemoveAutoTrade = async (data) => {
		const filteredRemoveTrade = tradeDetails?.filter((trade) => {
			return trade?.id !== data.id;
		});
		try {
			await removeAutoTrade({ removed_ids: [data?.id] });
			setTradeDetails(filteredRemoveTrade);
		} catch (error) {
			console.error(error);
		}
	};

	const onHandleBack = (step) => {
		if (step === 'step1') {
			setIsRenderPopup((prev) => ({
				...prev,
				isDisplayAutoTrader: false,
			}));
			setAutoTradeDetails({
				spend_coin: null,
				buy_coin: null,
				spend_amount: null,
			});
		} else if (step === 'step2') {
			setIsRenderPopup((prev) => ({
				...prev,
				isDisplayAutoTrader: true,
				isDisplayFrequencyPopup: false,
			}));
			setAutoTradeDetails((prev) => ({
				...prev,
				frequency: null,
				trade_hour: null,
				week_days: [],
				day_of_month: null,
			}));
		} else if (step === 'step3') {
			setIsRenderPopup((prev) => ({
				...prev,
				isDisplayDescriptionPopup: false,
				isDisplayFrequencyPopup: true,
			}));
			setAutoTradeDetails((prev) => ({
				...prev,
				description: null,
			}));
		} else if (step === 'step4') {
			setIsRenderPopup((prev) => ({
				...prev,
				isDisplayDescriptionPopup: true,
				isDisplayConfirmPopup: false,
			}));
		} else if (step === 'isAuoTradePlay') {
			setIsRenderPopup((prev) => ({
				...prev,
				isDisplayPlayAutoTrade: false,
			}));
		}
	};

	const onHandleNext = (step) => {
		if (step === 'step1') {
			setIsRenderPopup((prev) => ({
				...prev,
				isDisplayAutoTrader: false,
				isDisplayFrequencyPopup: true,
			}));
		} else if (step === 'step2') {
			const weekdays = autoTradeDetails?.week_days?.sort((a, b) => {
				if (a === 0 && b === 0) return 0;
				if (a === 0) return 1;
				if (b === 0) return -1;
				return a - b;
			});
			setAutoTradeDetails((prev) => ({
				...prev,
				week_days: weekdays,
			}));
			setIsRenderPopup((prev) => ({
				...prev,
				isDisplayFrequencyPopup: false,
				isDisplayDescriptionPopup: true,
			}));
		} else if (step === 'step3') {
			setIsRenderPopup((prev) => ({
				...prev,
				isDisplayDescriptionPopup: false,
				isDisplayConfirmPopup: true,
			}));
		}
	};

	let clickLock = false;

	const onHandleConfirm = async () => {
		if (clickLock) return;

		clickLock = true;

		const frequencyTrade =
			autoTradeDetails?.frequency === STRINGS['AUTO_TRADER.DAILY']
				? 'daily'
				: autoTradeDetails?.frequency === STRINGS['AUTO_TRADER.WEEKLY']
				? 'weekly'
				: autoTradeDetails?.frequency === STRINGS['AUTO_TRADER.MONTHLY'] &&
				  'monthly';

		try {
			await setAutoTrader({
				spend_coin: autoTradeDetails?.spend_coin,
				buy_coin: autoTradeDetails?.buy_coin,
				spend_amount: Number(autoTradeDetails?.spend_amount),
				frequency: frequencyTrade,
				week_days: autoTradeDetails?.week_days,
				day_of_month: autoTradeDetails?.day_of_month
					? autoTradeDetails?.day_of_month
					: 0,
				trade_hour: autoTradeDetails?.trade_hour,
				active: true,
				description: autoTradeDetails?.description,
			});
			getTradeDetails();
			message.success(STRINGS['AUTO_TRADER.SUCCESSFULLY_CREATED']);
		} catch (error) {
			message.error(error.data.message);
			console.error('Error', error);
		} finally {
			clickLock = false;
		}

		setAutoTradeDetails({
			spend_coin: null,
			buy_coin: null,
			spend_amount: null,
			frequency: null,
			trade_hour: 0,
			week_days: [],
			day_of_month: null,
			description: null,
		});
		setIsRenderPopup((prev) => ({
			...prev,
			isDisplayConfirmPopup: false,
		}));
	};

	const onHandleClose = () => {
		setAutoTradeDetails({
			spend_coin: null,
			buy_coin: null,
			spend_amount: null,
			frequency: null,
			trade_hour: null,
			week_days: [],
			day_of_month: null,
			description: null,
		});
	};

	const onHandleEdit = (text) => {
		if (text === 'frequency') {
			setIsRenderPopup((prev) => ({
				...prev,
				isDisplayFrequencyPopup: false,
				isDisplayAutoTrader: true,
			}));
			setAutoTradeDetails((prev) => ({
				...prev,
				spend_amount: null,
			}));
		} else if (text === 'description') {
			setIsRenderPopup((prev) => ({
				...prev,
				isDisplayDescriptionPopup: false,
				isDisplayAutoTrader: true,
			}));
			setAutoTradeDetails((prev) => ({
				...prev,
				spend_amount: null,
			}));
		} else if (text === 'confirmAmount') {
			setIsRenderPopup((prev) => ({
				...prev,
				isDisplayConfirmPopup: false,
				isDisplayAutoTrader: true,
			}));
			setAutoTradeDetails((prev) => ({
				...prev,
				spend_amount: null,
			}));
		} else if (text === 'trade') {
			setIsRenderPopup((prev) => ({
				...prev,
				isDisplayConfirmPopup: false,
				isDisplayFrequencyPopup: true,
			}));
		} else if (text === 'confirmDescription') {
			setIsRenderPopup((prev) => ({
				...prev,
				isDisplayConfirmPopup: false,
				isDisplayDescriptionPopup: true,
			}));
		}
	};

	const onSetPauseData = (data) => {
		setSelectedTrade(data);
		setIsRenderPopup((prev) => ({
			...prev,
			isDisplayPauseAutoTrade: true,
		}));
	};

	const onSetPlayData = (data) => {
		setSelectedTrade(data);
		setIsRenderPopup((prev) => ({
			...prev,
			isDisplayPlayAutoTrade: true,
		}));
	};

	const onHandlePause = async () => {
		const filteredTrade = tradeDetails?.map((trade) =>
			trade?.id === selectedTrade?.id &&
			trade?.user_id === selectedTrade?.user_id
				? { ...trade, active: !selectedTrade?.active }
				: trade
		);

		try {
			await editAutoTradeDeatils({
				id: selectedTrade?.id,
				spend_coin: selectedTrade?.spend_coin,
				buy_coin: selectedTrade?.buy_coin,
				spend_amount: selectedTrade?.spend_amount,
				frequency: selectedTrade?.frequency,
				week_days: selectedTrade?.week_days,
				day_of_month: selectedTrade?.day_of_month,
				trade_hour: selectedTrade?.trade_hour,
				active: !selectedTrade?.active,
				description: selectedTrade?.description,
			});
			setTradeDetails(filteredTrade);
		} catch (error) {
			console.error(error);
		}

		if (isRenderPopup?.isDisplayPauseAutoTrade) {
			setIsRenderPopup((prev) => ({
				...prev,
				isDisplayPauseAutoTrade: false,
			}));
		} else if (isRenderPopup?.isDisplayPlayAutoTrade) {
			setIsRenderPopup((prev) => ({
				...prev,
				isDisplayPlayAutoTrade: false,
			}));
		}
	};

	const filteredSpendOptions = sourceOptions?.filter((coin) =>
		autoTradeDetails?.spend_coin
			? getTargetOptions(autoTradeDetails?.spend_coin).includes(coin)
			: coin
	);
	const filteredBuyOptions = sourceOptions?.filter((coin) =>
		autoTradeDetails?.buy_coin
			? getTargetOptions(autoTradeDetails?.buy_coin).includes(coin)
			: coin !== autoTradeDetails?.buy_coin
	);
	const getSpendAssetAval =
		user?.balance[`${autoTradeDetails?.spend_coin?.toLowerCase()}_available`];
	const getBuyAssetAval =
		user?.balance[`${autoTradeDetails?.buy_coin?.toLowerCase()}_available`];

	const isMaxSpendAmount =
		autoTradeDetails?.spend_amount &&
		autoTradeDetails?.spend_amount > getSpendAssetAval;

	let isMinSpendAmount = null;
	let minAmount = null;

	if (autoTradeDetails?.spend_coin && autoTradeDetails?.spend_amount) {
		const { min } = coins[autoTradeDetails?.spend_coin];
		minAmount = min;
		isMinSpendAmount = autoTradeDetails?.spend_amount < min;
	}

	const frequencyTradeOptions = [
		STRINGS['AUTO_TRADER.DAILY'],
		STRINGS['AUTO_TRADER.WEEKLY'],
		STRINGS['AUTO_TRADER.MONTHLY'],
	];
	const totalWeekDays = [1, 2, 3, 4, 5, 6, 0];

	const selectedFrequency =
		selectedTrade?.frequency === 'daily'
			? STRINGS['AUTO_TRADER.DAILY']
			: selectedTrade?.frequency === 'weekly'
			? STRINGS['AUTO_TRADER.WEEKLY']
			: selectedTrade?.frequency === 'monthly' &&
			  STRINGS['AUTO_TRADER.MONTHLY'];

	const onHandleAsset = (text, asset) => {
		if (text === 'spend') {
			getTargetOptions(asset);
			autoTradeDetails?.buy_coin
				? setAutoTradeDetails((prev) => ({
						...prev,
						spend_coin: asset,
				  }))
				: setAutoTradeDetails((prev) => ({
						...prev,
						spend_coin: asset,
						buy_coin: getTargetOptions(asset) && getTargetOptions(asset)[0],
				  }));
		} else if (text === 'buy') {
			setAutoTradeDetails((prev) => ({
				...prev,
				buy_coin: asset,
			}));
		}
	};

	const onHandleClear = (text) => {
		if (text === 'spend') {
			setAutoTradeDetails((prev) => ({
				...prev,
				spend_coin: null,
				buy_coin: null,
				spend_amount: null,
			}));
		} else if (text === 'buy') {
			setAutoTradeDetails((prev) => ({
				...prev,
				buy_coin: null,
				spend_amount: null,
			}));
		}
	};

	const getDaysInMonth = (year, month) =>
		new Date(year, month + 1, 0).getDate();
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth();
	const daysInMonth = getDaysInMonth(currentYear, currentMonth);

	const handleDayClick = (day) => {
		setAutoTradeDetails((prevState) => {
			const updatedDays = prevState?.week_days?.includes(day)
				? prevState?.week_days?.filter((option) => option !== day)
				: [...prevState?.week_days, day];

			return {
				...prevState,
				week_days: updatedDays,
			};
		});
	};

	const getDayLabel = (day) => {
		switch (day) {
			case 0:
				return STRINGS['AUTO_TRADER.SUNDAY'];
			case 1:
				return STRINGS['AUTO_TRADER.MONDAY'];
			case 2:
				return STRINGS['AUTO_TRADER.TUESDAY'];
			case 3:
				return STRINGS['AUTO_TRADER.WEDNESDAY'];
			case 4:
				return STRINGS['AUTO_TRADER.THURSDAY'];
			case 5:
				return STRINGS['AUTO_TRADER.FRIDAY'];
			case 6:
				return STRINGS['AUTO_TRADER.SATURDAY'];
			default:
				return '';
		}
	};

	const onHandleChange = (value) => {
		return value?.replace(/[^0-9]/g, '');
	};

	const isDisabledTrade =
		!autoTradeDetails?.buy_coin ||
		!autoTradeDetails?.spend_amount ||
		!autoTradeDetails?.spend_coin ||
		isMinSpendAmount ||
		isMaxSpendAmount ||
		(getSpendAssetAval && !queryPair);

	const { frequency, trade_hour, day_of_month, week_days } =
		autoTradeDetails || {};

	const isDisabledFrequencyTrade =
		!frequency ||
		(frequency === STRINGS['AUTO_TRADER.DAILY'] &&
			(trade_hour === null || trade_hour === '')) ||
		(frequency === STRINGS['AUTO_TRADER.MONTHLY'] &&
			(!day_of_month || trade_hour === null || trade_hour === '')) ||
		(frequency === STRINGS['AUTO_TRADER.WEEKLY'] &&
			(!week_days ||
				week_days.length === 0 ||
				trade_hour === null ||
				trade_hour === ''));

	return (
		<div className="auto-trader-container">
			<Dialog
				isOpen={isRenderPopup?.isDisplayAutoTrader}
				onCloseDialog={() => {
					setIsRenderPopup((prev) => ({
						...prev,
						isDisplayAutoTrader: false,
					}));
					onHandleClose();
				}}
				className="auto-trader-popup-wrapper"
				label="auto-trader-popup"
			>
				<div className="auto-trader-popup-container">
					<EditWrapper stringId="AUTO_TRADER.AUTO_TRADER_TITLE">
						<span className="auto-trader-title">
							{' '}
							{STRINGS['AUTO_TRADER.AUTO_TRADER_TITLE']}
						</span>
					</EditWrapper>
					<div className="auto-trader-popup-content">
						<EditWrapper stringId="AUTO_TRADER.ASSET_BUY_DESCRIPTION">
							<span className="secondary-text">
								{' '}
								{STRINGS['AUTO_TRADER.ASSET_BUY_DESCRIPTION']}
							</span>
						</EditWrapper>
						<div className="asset-spend-field">
							<EditWrapper stringId="AUTO_TRADER.SPEND">
								<span className="spend-title mr-1">
									{STRINGS['AUTO_TRADER.SPEND']}
								</span>
								<Tooltip
									title={STRINGS['AUTO_TRADER.SPENDING_ASSET_DESC']}
									placement="right"
									overlayClassName="auto-trade-tool-tip"
								>
									<ExclamationCircleOutlined className="exclamation-icon" />
								</Tooltip>
							</EditWrapper>
							<Select
								value={
									autoTradeDetails?.spend_coin ? (
										<div className="options-wrapper">
											<span className="asset-icon">
												<Coin
													iconId={coins[autoTradeDetails?.spend_coin]?.icon_id}
													type={isMobile ? 'CS8' : 'CS4'}
												/>
											</span>
											<span className="mx-1">
												{coins[autoTradeDetails?.spend_coin]?.fullname}
											</span>
											(
											<span>{autoTradeDetails?.spend_coin?.toUpperCase()}</span>
											)
										</div>
									) : null
								}
								listHeight={165}
								className="auto-trader-select-dropdown mt-2"
								placeholder={STRINGS['AUTO_TRADER.SELECT_SPEND_ASSET']}
								showSearch
								size="medium"
								dropdownClassName={
									isMobile
										? 'custom-select-style auto-trader-select-option-dropdown auto-trader-select-option-dropdown-mobile'
										: 'custom-select-style auto-trader-select-option-dropdown'
								}
								onChange={(value) => onHandleAsset('spend', value)}
								allowClear
								onClear={() => onHandleClear('spend')}
								getPopupContainer={handlePopupContainer}
								virtual={false}
							>
								{filteredBuyOptions?.map((coin) => (
									<Select.Option key={coin} value={coin}>
										<div className="options-wrapper">
											<span className="asset-icon">
												<Coin
													iconId={coins[coin]?.icon_id}
													type={isMobile ? 'CS8' : 'CS4'}
												/>
											</span>
											<span className="mx-1">{coins[coin]?.fullname}</span>(
											<span>{coin?.toUpperCase()}</span>)
										</div>
									</Select.Option>
								))}
							</Select>

							{autoTradeDetails?.spend_coin && (
								<span className="mt-2">
									<EditWrapper stringId="AUTO_TRADER.AVAL_BALANCE">
										<span className="secondary-text">
											{' '}
											(
											{STRINGS.formatString(
												STRINGS['AUTO_TRADER.AVAL_BALANCE'],
												<span>{getSpendAssetAval}</span>,
												<span>
													{autoTradeDetails?.spend_coin?.toUpperCase()}
												</span>
											)}
											)
										</span>
									</EditWrapper>
								</span>
							)}
						</div>
						<div className="asset-spend-field">
							<EditWrapper stringId="P2P.BUY_COIN">
								<span className="spend-title mr-1">
									{STRINGS['P2P.BUY_COIN']}
								</span>
								<Tooltip
									title={STRINGS['AUTO_TRADER.BUYING_ASSET_DESC']}
									placement="right"
									overlayClassName="auto-trade-tool-tip"
								>
									<ExclamationCircleOutlined className="exclamation-icon" />
								</Tooltip>
							</EditWrapper>
							<Select
								listHeight={115}
								placeholder={STRINGS['AUTO_TRADER.SELECT_BUY_ASSET']}
								value={
									autoTradeDetails?.buy_coin ? (
										<div className="options-wrapper">
											<span className="asset-icon">
												<Coin
													iconId={coins[autoTradeDetails?.buy_coin]?.icon_id}
													type="CS4"
												/>
											</span>
											<span className="mx-1">
												{coins[autoTradeDetails?.buy_coin]?.fullname}
											</span>
											(<span>{autoTradeDetails?.buy_coin?.toUpperCase()}</span>)
										</div>
									) : null
								}
								className="auto-trader-select-dropdown mt-2"
								showSearch
								allowClear
								onClear={() => onHandleClear('buy')}
								size="medium"
								dropdownClassName={
									isMobile
										? 'custom-select-style auto-trader-select-option-dropdown auto-trader-select-option-dropdown-mobile'
										: 'custom-select-style auto-trader-select-option-dropdown select-buy-dropdown'
								}
								onChange={(value) => onHandleAsset('buy', value)}
								getPopupContainer={handlePopupContainer}
								virtual={false}
							>
								{filteredSpendOptions?.map((coin) => (
									<Select.Option key={coin} value={coin}>
										<div className="options-wrapper">
											<span className="asset-icon">
												<Coin
													iconId={coins[coin]?.icon_id}
													type={isMobile ? 'CS8' : 'CS4'}
												/>
											</span>
											<span className="mx-1">{coins[coin]?.fullname}</span>(
											<span>{coin?.toUpperCase()}</span>)
										</div>
									</Select.Option>
								))}
							</Select>
							{autoTradeDetails?.buy_coin && (
								<span className="mt-2">
									<EditWrapper stringId="AUTO_TRADER.AVAL_BALANCE">
										<span className="secondary-text">
											(
											{STRINGS.formatString(
												STRINGS['AUTO_TRADER.AVAL_BALANCE'],
												<span>{getBuyAssetAval}</span>,
												<span>{autoTradeDetails?.buy_coin?.toUpperCase()}</span>
											)}
											)
										</span>
									</EditWrapper>
								</span>
							)}
						</div>
						<div className="asset-spend-field">
							<EditWrapper stringId="SPEND_AMOUNT">
								<span className="spend-title mr-1">
									{STRINGS['SPEND_AMOUNT']}
								</span>
								<Tooltip
									title={STRINGS['AUTO_TRADER.AMOUNT_SPEND_DESC']}
									placement="right"
									overlayClassName="auto-trade-tool-tip"
								>
									<ExclamationCircleOutlined className="exclamation-icon" />
								</Tooltip>
							</EditWrapper>
							<Input
								className="auto-trader-input-field mt-2"
								prefix={
									<Coin
										iconId={coins[autoTradeDetails?.spend_coin]?.icon_id}
										type={isMobile ? 'CS8' : 'CS4'}
									/>
								}
								suffix={autoTradeDetails?.spend_coin?.toUpperCase()}
								value={autoTradeDetails?.spend_amount}
								onChange={(e) => {
									setAutoTradeDetails((prev) => ({
										...prev,
										spend_amount: e.target.value,
									}));
								}}
								type="number"
								placeholder={STRINGS['WITHDRAW_PAGE.ENTER_AMOUNT']}
							/>
							{getSpendAssetAval === 0 && (
								<div className="d-flex mt-2 warning-text font-weight-bold">
									<ExclamationCircleFilled className="mt-1 mr-1" />
									<span>{STRINGS['WITHDRAW_PAGE.ZERO_BALANCE']}</span>
								</div>
							)}
							{isMinSpendAmount && getSpendAssetAval > 0 && queryPair ? (
								<div className="d-flex mt-2 error-text font-weight-bold">
									<ExclamationCircleFilled className="mt-1 mr-1" />
									<EditWrapper>
										{STRINGS.formatString(
											STRINGS['AUTO_TRADER.MIN_AMOUNT'],
											minAmount
										)}
									</EditWrapper>
								</div>
							) : (
								isMaxSpendAmount &&
								getSpendAssetAval > 0 &&
								queryPair && (
									<div className="d-flex mt-2 error-text font-weight-bold">
										<ExclamationCircleFilled className="mt-1 mr-1" />
										<span>{STRINGS['AUTO_TRADER.MAX_AMOUNT']}</span>
									</div>
								)
							)}
						</div>
					</div>
					<div className="button-container">
						<Button
							label={STRINGS['BACK_TEXT']}
							className="back-btn"
							onClick={() => onHandleBack('step1')}
						/>
						<Button
							label={STRINGS['STAKE.NEXT']}
							className="next-btn"
							onClick={() => onHandleNext('step1')}
							disabled={isDisabledTrade}
						/>
					</div>
				</div>
			</Dialog>
			<Dialog
				isOpen={isRenderPopup?.isDisplayFrequencyPopup}
				onCloseDialog={() => {
					setIsRenderPopup((prev) => ({
						...prev,
						isDisplayFrequencyPopup: false,
					}));
					onHandleClose();
				}}
				className="auto-trader-popup-wrapper auto-trader-frequency-trade-popup-wrapper"
				label="auto-trader-frequency-trade-popup"
			>
				<div className="auto-trader-popup-container auto-trader-frequency-trade-popup-container">
					<EditWrapper stringId="AUTO_TRADER.AUTO_TRADER_TITLE">
						<span className="auto-trader-title">
							{STRINGS['AUTO_TRADER.AUTO_TRADER_TITLE']}
						</span>
					</EditWrapper>
					<div className="auto-trader-popup-content">
						<EditWrapper stringId="AUTO_TRADER.TRANSACTION_REPEAT_DESC">
							<span className="secondary-text">
								{STRINGS['AUTO_TRADER.TRANSACTION_REPEAT_DESC']}
							</span>
						</EditWrapper>
						<div className="frequency-trade-description">
							<EditWrapper stringId="AUTO_TRADER.REPEAT_SPEMD_AMOUNT">
								<span className="secondary-text">
									{STRINGS.formatString(
										STRINGS['AUTO_TRADER.REPEAT_SPEMD_AMOUNT'],
										<span className="repeating-amount">
											<span className="spending-asset">
												<Coin
													iconId={coins[autoTradeDetails?.spend_coin]?.icon_id}
													type={isMobile ? 'CS8' : 'CS4'}
												/>
											</span>
											<span className="ml-1 font-weight-bold important-text">
												{autoTradeDetails?.spend_amount}
											</span>
											<span className="ml-1 font-weight-bold important-text">
												{autoTradeDetails?.spend_coin?.toUpperCase()}
											</span>
										</span>
									)}
								</span>
							</EditWrapper>
							<EditWrapper stringId="EDIT_TEXT">
								<span
									className="blue-link text-decoration-underline"
									onClick={() => onHandleEdit('frequency')}
								>
									{STRINGS['EDIT_TEXT']}
								</span>
							</EditWrapper>
						</div>
						<div>
							<div className="frequency-trade-field">
								<EditWrapper stringId="AUTO_TRADER.FREQUENCY_TRADE">
									<span className="important-text font-weight-bold frequency-trade-title">
										{STRINGS['AUTO_TRADER.FREQUENCY_TRADE']}
									</span>
								</EditWrapper>
								<Tooltip
									title={STRINGS['AUTO_TRADER.FREQUENCY_TRADE_TOOLTIP_DESC']}
									placement="right"
									overlayClassName="auto-trade-tool-tip"
								>
									<ExclamationCircleOutlined className="exclamation-icon" />
								</Tooltip>
							</div>
							<Select
								placeholder={STRINGS['WITHDRAW_PAGE.SELECT']}
								className="auto-trader-select-dropdown mt-2"
								showSearch
								size="medium"
								value={autoTradeDetails?.frequency}
								dropdownClassName={
									isMobile
										? 'custom-select-style auto-trader-select-option-dropdown'
										: 'custom-select-style auto-trader-select-option-dropdown select-frequency-dropdown'
								}
								onChange={(value) =>
									setAutoTradeDetails((prev) => ({
										...prev,
										frequency: value,
										trade_hour: null,
										week_days: [],
									}))
								}
								getPopupContainer={handlePopupContainer}
								virtual={false}
							>
								{frequencyTradeOptions?.map((option) => {
									return (
										<Select.Option key={option} value={option}>
											{option}
										</Select.Option>
									);
								})}
							</Select>
							{autoTradeDetails?.frequency === STRINGS['AUTO_TRADER.WEEKLY'] ? (
								<div className="weekly-trade-wrapper daily-trade-wrapper">
									<span className="frequency-trade-field">
										<EditWrapper stringId="AUTO_TRADER.WEEKLY_TRADE_TITLE">
											<span className="important-text font-weight-bold">
												{STRINGS['AUTO_TRADER.WEEKLY_TRADE_TITLE']}
											</span>
										</EditWrapper>
										<Tooltip
											title={STRINGS['AUTO_TRADER.WEEKLY_TRADE_TOOLTIP_DESC']}
											placement="right"
											overlayClassName="auto-trade-tool-tip"
										>
											<ExclamationCircleOutlined className="exclamation-icon" />
										</Tooltip>
									</span>
									<div className="weekly-trade-options">
										{totalWeekDays?.map((days) => {
											return (
												<span
													className={
														autoTradeDetails?.week_days?.includes(days)
															? 'selected-days days-option'
															: 'days-option'
													}
													key={days}
													onClick={() => handleDayClick(days)}
												>
													{getDayLabel(days)}
												</span>
											);
										})}
									</div>
								</div>
							) : (
								autoTradeDetails?.frequency ===
									STRINGS['AUTO_TRADER.MONTHLY'] && (
									<div className="monthly-trade-wrapper daily-trade-wrapper">
										<span className="frequency-trade-field">
											<EditWrapper stringId="AUTO_TRADER.MONTHLY_TRADE_TITLE">
												<span className="important-text font-weight-bold">
													{STRINGS['AUTO_TRADER.MONTHLY_TRADE_TITLE']}
												</span>
											</EditWrapper>
											<Tooltip
												title={STRINGS.formatString(
													STRINGS['AUTO_TRADER.MONTHLY_TRADE_TOOLTIP_DESC'],
													daysInMonth
												)}
												placement="right"
												overlayClassName="auto-trade-tool-tip"
											>
												<ExclamationCircleOutlined className="exclamation-icon" />
											</Tooltip>
										</span>
										<InputNumber
											className="montly-trade-field mt-1"
											min={1}
											max={daysInMonth}
											value={autoTradeDetails?.day_of_month}
											onChange={(value) =>
												setAutoTradeDetails((prev) => ({
													...prev,
													day_of_month: value,
												}))
											}
											controls={true}
											placeholder={`${STRINGS['AUTO_TRADER.SELECT_DAY']} (1-${daysInMonth})`}
										/>
									</div>
								)
							)}
							{autoTradeDetails?.frequency && (
								<div className="daily-trade-wrapper mb-1">
									<span className="frequency-trade-field mb-2">
										<EditWrapper stringId="AUTO_TRADER.DAILY_TRADE_TITLE">
											<span className="important-text font-weight-bold">
												{
													STRINGS[
														autoTradeDetails?.frequency ===
														STRINGS['AUTO_TRADER.DAILY']
															? 'AUTO_TRADER.DAILY_TRADE_TITLE'
															: 'AUTO_TRADER.TRADE_TIME'
													]
												}
											</span>
										</EditWrapper>
										<Tooltip
											title={
												STRINGS[
													autoTradeDetails?.frequency ===
													STRINGS['AUTO_TRADER.DAILY']
														? 'AUTO_TRADER.DAILY_TRADE_TOOLTIP_DESC'
														: 'AUTO_TRADER.WEEKLY_TRADE_TOOLTIP_DESC'
												]
											}
											placement="right"
											overlayClassName="auto-trade-tool-tip"
										>
											<ExclamationCircleOutlined className="exclamation-icon" />
										</Tooltip>
									</span>
									<InputNumber
										className="montly-trade-field mt-1"
										min={0}
										max={23}
										value={autoTradeDetails.trade_hour}
										onChange={(value) =>
											setAutoTradeDetails((prev) => ({
												...prev,
												trade_hour: value,
											}))
										}
										controls={true}
										placeholder={STRINGS['AUTO_TRADER.SELECT_HOUR']}
										suffix={STRINGS['AUTO_TRADER.HOUR']}
										step={1}
										parser={(value) => onHandleChange(value)}
									/>
								</div>
							)}
							<div className="secondary-text mt-1">
								<EditWrapper stringId="AUTO_TRADER.TIME_ZONE">
									<span>{STRINGS['AUTO_TRADER.TIME_ZONE']}</span>
									<span className="ml-1">{exchangeTimeZone}</span>
								</EditWrapper>
							</div>
						</div>
						<div className="button-container">
							<Button
								label={STRINGS['BACK_TEXT']}
								className="back-btn"
								onClick={() => onHandleBack('step2')}
							/>
							<Button
								label={STRINGS['STAKE.NEXT']}
								className="next-btn"
								onClick={() => onHandleNext('step2')}
								disabled={isDisabledFrequencyTrade}
							/>
						</div>
					</div>
				</div>
			</Dialog>
			<Dialog
				isOpen={isRenderPopup?.isDisplayDescriptionPopup}
				onCloseDialog={() => {
					setIsRenderPopup((prev) => ({
						...prev,
						isDisplayDescriptionPopup: false,
					}));
					onHandleClose();
				}}
				className="auto-trader-popup-wrapper auto-trader-description-popup-wrapper"
				label="auto-trader-description-popup"
			>
				<div className="auto-trader-popup-container auto-trader-description-popup-container">
					<EditWrapper stringId="AUTO_TRADER.AUTO_TRADER_TITLE">
						<span className="auto-trader-title">
							{STRINGS['AUTO_TRADER.AUTO_TRADER_TITLE']}
						</span>
					</EditWrapper>
					<div className="auto-trader-popup-content">
						<EditWrapper stringId="AUTO_TRADER.DESCTIPTION_TEXT">
							<span className="secondary-text">
								{STRINGS['AUTO_TRADER.DESCTIPTION_TEXT']}
							</span>
						</EditWrapper>
						<span className="description-title important-text">
							<span className="caps-first ">{autoTradeDetails?.frequency}</span>
							<EditWrapper stringId="SPEND_AMOUNT">
								<span className="important-text">
									{STRINGS['SPEND_AMOUNT']}
								</span>
							</EditWrapper>
							<span className="spending-asset">
								<Coin
									iconId={coins[autoTradeDetails?.spend_coin]?.icon_id}
									type={isMobile ? 'CS8' : 'CS4'}
								/>
							</span>
							<span className="font-weight-bold important-text">
								{autoTradeDetails?.spend_amount}
							</span>
							<span className="font-weight-bold important-text">
								{autoTradeDetails?.spend_coin?.toUpperCase()}
							</span>
							<EditWrapper stringId="EDIT_TEXT">
								<span
									className="blue-link text-decoration-underline"
									onClick={() => onHandleEdit('description')}
								>
									{STRINGS['EDIT_TEXT']}
								</span>
							</EditWrapper>
						</span>
						<div className="description-input-field">
							<EditWrapper stringId="CONTACT_FORM.DESCRIPTION_LABEL">
								<span className="important-text font-weight-bold">
									{STRINGS['CONTACT_FORM.DESCRIPTION_LABEL']}
								</span>
							</EditWrapper>
							<Input
								className="auto-trader-input-field mt-2"
								value={autoTradeDetails?.description}
								onChange={(e) => {
									setAutoTradeDetails((prev) => ({
										...prev,
										description: e.target.value,
									}));
								}}
								placeholder={STRINGS['AUTO_TRADER.DESCRIPTION_PLACEHOLDER']}
							/>
						</div>
					</div>
					<div className="button-container">
						<Button
							label={STRINGS['BACK_TEXT']}
							className="back-btn"
							onClick={() => onHandleBack('step3')}
						/>
						<Button
							label={STRINGS['STAKE.REVIEW']}
							className="next-btn"
							onClick={() => onHandleNext('step3')}
							disabled={!autoTradeDetails?.description}
						/>
					</div>
				</div>
			</Dialog>
			{isRenderPopup?.isDisplayConfirmPopup && (
				<ConfirmAutoTrade
					isDisplayConfirmPopup={isRenderPopup?.isDisplayConfirmPopup}
					setIsRenderPopup={setIsRenderPopup}
					onHandleClose={onHandleClose}
					autoTradeDetails={autoTradeDetails}
					tradeDetails={tradeDetails}
					coins={coins}
					getBuyAssetAval={getBuyAssetAval}
					getSpendAssetAval={getSpendAssetAval}
					onHandleBack={onHandleBack}
					onHandleConfirm={onHandleConfirm}
					onHandleEdit={onHandleEdit}
					isConfirmAutoTrade={true}
					getDayLabel={getDayLabel}
					exchangeTimeZone={exchangeTimeZone}
				/>
			)}
			{isRenderPopup?.isDisplayPlayAutoTrade && (
				<ConfirmAutoTrade
					isDisplayConfirmPopup={isRenderPopup?.isDisplayPlayAutoTrade}
					setIsRenderPopup={setIsRenderPopup}
					onHandleClose={onHandleClose}
					autoTradeDetails={selectedTrade}
					coins={coins}
					getBuyAssetAval={
						user?.balance[`${selectedTrade?.buy_coin?.toLowerCase()}_available`]
					}
					getSpendAssetAval={
						user?.balance[
							`${selectedTrade?.spend_coin?.toLowerCase()}_available`
						]
					}
					onHandleBack={onHandleBack}
					onHandleConfirm={onHandlePause}
					onHandleEdit={onHandleEdit}
					isConfirmAutoTrade={false}
					getDayLabel={getDayLabel}
					exchangeTimeZone={exchangeTimeZone}
				/>
			)}
			<Dialog
				isOpen={isRenderPopup?.isDisplayPauseAutoTrade}
				onCloseDialog={() => {
					setIsRenderPopup((prev) => ({
						...prev,
						isDisplayPauseAutoTrade: false,
					}));
				}}
				className="auto-trader-popup-wrapper auto-trader-pause-popup-wrapper"
				label="auto-trader-pause-popup"
			>
				<div className="auto-trader-popup-container auto-trader-pause-popup-container">
					<EditWrapper stringId="AUTO_TRADER.PAUSE">
						<span className="auto-trader-title">
							{STRINGS['AUTO_TRADER.PAUSE']}
						</span>
					</EditWrapper>
					<div className="auto-trade-content-wrapper">
						<EditWrapper stringId="AUTO_TRADER.PAUSE_DESCRIPTION">
							<span className="secondary-text">
								{STRINGS['AUTO_TRADER.PAUSE_DESCRIPTION']}
							</span>
						</EditWrapper>
						<div className="description-title">
							<span className="mr-1 important-text font-weight-bold caps-first">
								{selectedFrequency}
							</span>
							<EditWrapper stringId="SPEND_AMOUNT">
								<span className="important-text font-weight-bold">
									{STRINGS['SPEND_AMOUNT']}:
								</span>
							</EditWrapper>
							<span className="spending-asset ml-1">
								<Coin
									iconId={coins[selectedTrade?.spend_coin]?.icon_id}
									type={isMobile ? 'CS8' : 'CS4'}
								/>
							</span>
							<span className="important-text asset-price ml-1">
								{selectedTrade?.spend_amount}
							</span>
							<span className="important-text selected-asset ml-1">
								{selectedTrade?.spend_coin?.toUpperCase()}
							</span>
						</div>
					</div>
					<div className="button-container">
						<Button
							label={STRINGS['BACK_TEXT']}
							className="back-btn"
							onClick={() =>
								setIsRenderPopup((prev) => ({
									...prev,
									isDisplayPauseAutoTrade: false,
								}))
							}
						/>
						<Button
							label={STRINGS['AUTO_TRADER.PAUSE']}
							className="next-btn"
							onClick={() => onHandlePause()}
						/>
					</div>
				</div>
			</Dialog>
			<Dialog
				isOpen={isRenderPopup?.isDisplayDeletePopup}
				onCloseDialog={() => {
					setIsRenderPopup((prev) => ({
						...prev,
						isDisplayDeletePopup: false,
					}));
				}}
				className="auto-trader-popup-wrapper auto-trader-remove-popup-wrapper"
				label="auto-trader-remove-popup"
			>
				<div className="auto-trader-popup-container auto-trader-remove-popup-container">
					<EditWrapper stringId="AUTO_TRADER.DELETE_TEXT">
						<span className="auto-trader-title">
							{STRINGS['AUTO_TRADER.DELETE_TEXT']}
						</span>
					</EditWrapper>
					<div className="auto-trade-content-wrapper">
						<EditWrapper stringId="AUTO_TRADER.DELETE_DESC">
							<span className="secondary-text">
								{STRINGS['AUTO_TRADER.DELETE_DESC']}
							</span>
						</EditWrapper>
						<div className="description-title">
							<span className="mr-1 important-text font-weight-bold caps-first">
								{selectedFrequency}
							</span>
							<EditWrapper stringId="SPEND_AMOUNT">
								<span className="important-text font-weight-bold">
									{STRINGS['SPEND_AMOUNT']}:
								</span>
							</EditWrapper>
							<span className="spending-asset ml-1">
								<Coin
									iconId={coins[selectedTrade?.spend_coin]?.icon_id}
									type={isMobile ? 'CS8' : 'CS4'}
								/>
							</span>
							<span className="important-text asset-price ml-1">
								{selectedTrade?.spend_amount}
							</span>
							<span className="important-text selected-asset ml-1">
								{selectedTrade?.spend_coin?.toUpperCase()}
							</span>
						</div>
					</div>
					<div className="button-container">
						<Button
							label={STRINGS['BACK_TEXT']}
							className="back-btn"
							onClick={() =>
								setIsRenderPopup((prev) => ({
									...prev,
									isDisplayDeletePopup: false,
								}))
							}
						/>
						<Button
							label={STRINGS['P2P.DELETE_UPPERCASE']}
							className="delete-btn"
							onClick={() => {
								setIsRenderPopup((prev) => ({
									...prev,
									isDisplayDeletePopup: false,
								}));
								onRemoveAutoTrade(selectedTrade);
							}}
						/>
					</div>
				</div>
			</Dialog>
			<Dialog
				isOpen={isRenderPopup?.isDisplayMaximumTrade}
				onCloseDialog={() => {
					setIsRenderPopup((prev) => ({
						...prev,
						isDisplayMaximumTrade: false,
					}));
				}}
				className="auto-trader-popup-wrapper auto-trader-maximum-limit-popup-wrapper"
				label="auto-trader-maximum-limit-popup"
			>
				<div className="auto-trader-popup-container auto-trader-maximum-limit-popup-container">
					<EditWrapper stringId="AUTO_TRADER.MAXIMUM_TRADE_LIMIT">
						<span className="auto-trader-title">
							{STRINGS['AUTO_TRADER.MAXIMUM_TRADE_LIMIT']}
						</span>
					</EditWrapper>
					<Button
						label={STRINGS['CLOSE_TEXT']?.toUpperCase()}
						className="back-btn mt-3"
						onClick={() =>
							setIsRenderPopup((prev) => ({
								...prev,
								isDisplayMaximumTrade: false,
							}))
						}
					/>
				</div>
			</Dialog>

			<div className="title-wrapper">
				<Image
					icon={icons['AUTO_TRADER_ICON']}
					wrapperClassName="auto-trader-icon"
					iconId="AUTO_TRADER_ICON"
				/>
				<span className="ml-3">
					<EditWrapper stringId="AUTO_TRADER.AUTO_TRADER_TITLE">
						<span className="auto-trader-title">
							{STRINGS['AUTO_TRADER.AUTO_TRADER_TITLE']}
						</span>
					</EditWrapper>
				</span>
			</div>
			<div className="auto-trader-description-wrapper">
				<EditWrapper stringId="AUTO_TRADER.AUTO_TRADER_DESC">
					<span className="auto-trader-description">
						{STRINGS['AUTO_TRADER.AUTO_TRADER_DESC']}
					</span>
				</EditWrapper>
				<div className="link-wrapper">
					<EditWrapper stringId="SUMMARY.DEPOSIT">
						<span
							className="blue-link"
							onClick={() => browserHistory.push('/wallet/deposit')}
						>
							{STRINGS['SUMMARY.DEPOSIT']?.toUpperCase()}
						</span>
					</EditWrapper>
					<span className="link-separator"></span>
					<EditWrapper stringId="SUMMARY.MARKETS">
						<span
							className="blue-link market-link"
							onClick={() => browserHistory.push('/markets')}
						>
							{STRINGS['SUMMARY.MARKETS']?.toUpperCase()}
						</span>
					</EditWrapper>
					<span className="link-separator"></span>
					<EditWrapper stringId="ACCORDIAN.ACCORDIAN_HISTORY">
						<span
							className="d-flex blue-link"
							onClick={() => browserHistory.push('/transactions')}
						>
							{STRINGS['ACCORDIAN.ACCORDIAN_HISTORY']}
							<span className="image-wrapper px-1">
								<Image
									iconId={'CLOCK'}
									icon={icons['CLOCK']}
									alt={'text'}
									svgWrapperClassName="action_notification-svg"
								/>
							</span>
						</span>
					</EditWrapper>
				</div>
			</div>
			<div className="auto-trader-content-wrapper">
				<span className="auto-trader-content-description">
					<div className="d-flex flex-column align-items-start">
						<EditWrapper stringId="AUTO_TRADER.RECURRING_TRANSACTION">
							<span>{STRINGS['AUTO_TRADER.RECURRING_TRANSACTION']}</span>
						</EditWrapper>
						<EditWrapper stringId="AUTO_TRADER.SETUP_TRANSACTION">
							<span
								className="blue-link text-decoration-underline"
								onClick={() => {
									if (tradeDetails?.length <= 19) {
										setIsRenderPopup((prev) => ({
											...prev,
											isDisplayAutoTrader: true,
										}));
									} else {
										setIsRenderPopup((prev) => ({
											...prev,
											isDisplayMaximumTrade: true,
										}));
									}
								}}
							>
								{STRINGS['AUTO_TRADER.SETUP_TRANSACTION']?.toUpperCase()}
							</span>
						</EditWrapper>
					</div>
					<EditWrapper stringId="AUTO_TRADER.TIME_ZONE">
						<span className="time-zone-text">
							{STRINGS['AUTO_TRADER.TIME_ZONE']}
						</span>
						<span className="ml-2 time-zone-text">{exchangeTimeZone}</span>
					</EditWrapper>
				</span>
				<div>
					<Table
						className="auto-trader-table"
						showHeaderNoData={true}
						headers={autoTraderData(
							coins,
							user,
							onHandleRemoveTrade,
							onSetPauseData,
							onSetPlayData
						)}
						rowKey={(data) => {
							return data.id;
						}}
						data={tradeDetails}
						count={tradeDetails?.length}
						isAutoTrader={true}
						pageSize={10}
						noData={
							<AutoTraderEmptydata
								setIsRenderPopup={setIsRenderPopup}
								icons={icons}
							/>
						}
					/>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	user: state.user,
	sourceOptions: getSourceOptions(state.app.quicktrade),
	coins: state.app.coins,
	features: state.app.features,
	exchangeTimeZone: state.app.exchangeTimeZone,
	quicktradePairs: quicktradePairSelector(state),
});

export default connect(mapStateToProps)(withConfig(Autotrader));
