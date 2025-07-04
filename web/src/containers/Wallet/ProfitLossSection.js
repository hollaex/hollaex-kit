import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { isMobile } from 'react-device-detect';
import { Button, Spin, DatePicker, message, Modal, Tabs } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import debounce from 'lodash.debounce';
// eslint-disable-next-line
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import {
	ActionNotification,
	Coin,
	DonutChart,
	EditWrapper,
	// MobileBarBack,
} from 'components';
import { fetchBalanceHistory, fetchPlHistory } from './actions';
import './_ProfitLoss.scss';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';
import { sortedAssetsSelector } from './utils';
import {
	calculateOraclePrice,
	formatCurrencyByIncrementalUnit,
} from 'utils/currency';
import { STATIC_ICONS } from 'config/icons';
import { Loading } from 'containers/DigitalAssets/components/utils';
const TabPane = Tabs.TabPane;
const ProfitLossSection = ({
	coins,
	balance_history_config,
	handleBalanceHistory,
	balances,
	pricesInNative,
	chartData,
	assets,
	loading = false,
	onHandleRefresh = () => {},
}) => {
	const month = Array.apply(0, Array(12)).map(function (_, i) {
		return moment().month(i).format('MMM');
	});
	const [balanceHistory, setBalanceHistory] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentDay, setCurrentDay] = useState(7);
	const [queryValues, setQueryValues] = useState({
		start_date: moment().subtract(currentDay, 'days').toISOString(),
		end_date: moment().subtract().toISOString(),
	});
	const [queryFilters, setQueryFilters] = useState({
		total: 0,
		page: 1,
		pageSize: 10,
		limit: 50,
		currentTablePage: 1,
		isRemaining: true,
	});
	// eslint-disable-next-line
	const [selectedDate, setSelectedDate] = useState();
	const [selectedCustomDate, setSelectedCustomDate] = useState();
	const [currentBalance, setCurrentBalance] = useState();
	const [latestBalance, setLatestBalance] = useState();
	const [userPL, setUserPL] = useState();
	const [current, setCurrent] = useState(0);
	const [graphData, setGraphData] = useState([]);
	const [customDate, setCustomDate] = useState(false);
	const [customDateValues, setCustomDateValues] = useState();
	const [loadingPnl, setLoadingPnl] = useState(false);
	const [activeTab, setActiveTab] = useState('0');
	const [selectedDateIndexes, setSelectedDateIndexes] = useState([]);

	const options = {
		chart: {
			type: 'area',
			events: {
				render: function () {
					const chart = this;

					if (chart.xAxis[0].labelClicked) return;
					chart.xAxis[0].labelClicked = true;

					Object.values(chart.xAxis[0]?.ticks).forEach((tick, idx) => {
						const label = tick.label && tick.label.element;
						if (label) {
							label.style.cursor = 'pointer';
							label.onclick = () => {
								const clickedLabel = label.textContent;
								const matchIndex = graphData.findIndex(
									(item) => item[0] === clickedLabel
								);

								if (matchIndex !== -1) {
									setCurrent(matchIndex);
									const balance = balanceHistory?.find(
										(history) =>
											`${moment(history?.created_at)?.date()} ${
												month[moment(history?.created_at)?.month()]
											}` === graphData[matchIndex][0]
									);
									if (balance) {
										setCurrentBalance(balance);
										setSelectedCustomDate(moment(balance.created_at));
									}
									setSelectedDateIndexes((prev) => {
										let newIndexes;
										if (prev?.includes(matchIndex)) {
											newIndexes = prev?.filter((i) => i !== matchIndex);
										} else if (prev?.length < 5) {
											newIndexes = [...prev, matchIndex];
										} else {
											newIndexes = [...prev.slice(1), matchIndex];
										}
										return newIndexes?.sort((a, b) => a - b);
									});
									const point = chart.series[0].points[matchIndex];
									chart.tooltip.refresh(point);
								}
							};
						}
					});
				},
			},
		},
		title: {
			text: '',
		},
		tooltip: {
			className: 'profit-loss-balance-tooltip',
			enabled: true,
			useHTML: true,
			formatter: function () {
				if (selectedDateIndexes.length > 0) {
					let compareTooltips = `<div><b>${STRINGS['PROFIT_LOSS.COMPARE_DATES']}:</b></div>`;
					selectedDateIndexes.forEach((idx) => {
						const point = graphData[idx];
						if (point) {
							compareTooltips += `
 <div style="margin-bottom:4px;">
 <span class="selected-date">${point[0]}</span>:
 ${getSourceDecimals(balance_history_config?.currency || 'usdt', point[1])}
 </div>
 `;
						}
					});
					compareTooltips += `<hr style="margin:4px 0"/>`;
					return (
						compareTooltips +
						`<div>
							${getSourceDecimals(balance_history_config?.currency || 'usdt', this.y)}
						</div>`
					);
				} else {
					return `<div>
						${getSourceDecimals(balance_history_config?.currency || 'usdt', this.y)}
					</div>`;
				}
			},
			positioner: function (labelWidth, labelHeight, point) {
				if (selectedDateIndexes?.length > 0) {
					const chart = this.chart || (this.series && this.series.chart);
					let chartWidth = chart && chart.chartWidth ? chart.chartWidth : 800;
					let y = 20;
					let x = Math.round((chartWidth - labelWidth) / 2);
					return { x, y };
				} else {
					return { x: point.plotX, y: point.plotY - labelHeight };
				}
			},
		},
		xAxis: {
			type: 'category',
			labels: {
				useHTML: true,
				formatter: (item) => {
					const idx = graphData?.findIndex((g) => g[0] === item?.value);
					const isSelected = selectedDateIndexes?.includes(idx);
					const color = isSelected
						? '#5D63FF'
						: graphData?.[current || 0]?.[0] === item?.value
						? '#5D63FF'
						: 'date-text';
					const fontWeight =
						isSelected || graphData?.[current || 0]?.[0] === item?.value
							? 'bold'
							: 'normal';
					return `<span style="color: ${color}; font-weight: ${fontWeight}">${item?.value}</span>`;
				},
			},
		},
		yAxis: {
			title: false,
			min: (() => {
				let min = graphData?.[0]?.[1];

				graphData.forEach((graph) => {
					if (min > graph[1]) {
						min = graph[1];
					}
				});

				return min;
			})(),
		},
		series: [
			{
				data: graphData,
				color: '#FFFF00',
				cursor: 'pointer',
				showInLegend: false,
				point: {
					events: {
						click: (e, x, y) => {
							const idx = e.point.x;
							setCurrent(idx);
							const balance = balanceHistory.find(
								(history) =>
									`${moment(history.created_at).date()} ${
										month[moment(history.created_at).month()]
									}` === graphData[e.point.x || 0][0]
							);

							if (balance) {
								setCurrentBalance(balance);
								setSelectedCustomDate(moment(balance.created_at));
							}
							if (!isMobile) {
								setSelectedDateIndexes((prev) => {
									let newIndexes;
									if (prev.includes(idx)) {
										newIndexes = prev?.filter((i) => i !== idx);
									} else if (prev.length < 5) {
										newIndexes = [...prev, idx];
									} else {
										newIndexes = [...prev.slice(1), idx];
									}
									return newIndexes?.sort((a, b) => a - b);
								});
							}
						},
						mouseOver: function () {
							setCurrent(this.x);
						},
					},
				},
			},
		],
	};
	const firstRender = useRef(true);

	const tabList = ['performance', 'balance-history'];
	const mobileTabList = ['performance', 'percentage', 'balance-history'];

	const selectedTabList = isMobile ? mobileTabList : tabList;

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
		} else {
			setIsLoading(true);
			setLoadingPnl(true);
			fetchPlHistory().then((res) => {
				setUserPL(res);
				setLoadingPnl(false);
			});
			requestHistory(queryFilters.page, queryFilters.limit);
		}
		return () => {
			onHandleFetchBalance && onHandleFetchBalance.cancel();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
		} else {
			setLoadingPnl(true);
			fetchPlHistory({ period: currentDay })
				.then((res) => {
					setUserPL(res);
					setLoadingPnl(false);
				})
				.catch((error) => {
					console.error('error', error);
					setLoadingPnl(false);
				});
			requestHistory(queryFilters.page, queryFilters.limit);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryValues]);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const tab = selectedTabList?.find((data) => params.has(data));
		const tabIndex = selectedTabList?.indexOf(tab);

		if (tab && tabIndex !== -1 && String(tabIndex) !== activeTab) {
			setActiveTab(String(tabIndex));
		} else if (!tab) {
			setActiveTab('0');
			const url = new URL(window.location.href);
			url.search = selectedTabList[0] ? `?${selectedTabList[0]}` : '';
			window.history.replaceState(null, '', url.toString());
		}
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onHandleFetchBalance = debounce(
		(page = 1, limit) => {
			fetchBalanceHistory({ ...queryValues })
				.then((response) => {
					setBalanceHistory(
						page === 1 ? response.data : [...balanceHistory, ...response.data]
					);

					const length =
						response.data.length > currentDay
							? currentDay - 1
							: response.data.length > 6
							? response.data.length
							: 6;
					const balanceData = response.data.find(
						(history) =>
							moment(history.created_at).format('YYYY-MM-DD') ===
							moment(queryValues.end_date)
								.subtract(length === 6 ? 0 : length, 'days')
								.format('YYYY-MM-DD')
					);
					let balance =
						balanceData ||
						response.data[length] ||
						response.data[response.data.length - 1];

					let newGraphData = [];
					for (let i = 0; i < length + 1; i++) {
						if (currentDay === 7) {
							const balanceData = response.data.find(
								(history) =>
									moment(history.created_at).format('YYYY-MM-DD') ===
									moment(queryValues.end_date)
										.subtract(i, 'days')
										.format('YYYY-MM-DD')
							);
							// if (!balanceData) continue;
							newGraphData.push([
								`${moment(queryValues.end_date).subtract(i, 'days').date()} ${
									month[
										moment(queryValues.end_date).subtract(i, 'days').month()
									]
								}`,
								balanceData
									? balanceData.total
									: response?.data?.[response.data.length - 1]?.total,
							]);
						} else if (currentDay === 30) {
							// if (currentDay === 30) {
							const balanceData = response.data.find(
								(history) =>
									moment(history.created_at).format('YYYY-MM-DD') ===
									moment(queryValues.end_date)
										.subtract(i, 'days')
										.format('YYYY-MM-DD')
							);
							if (!balanceData) continue;
							newGraphData.push([
								`${moment(queryValues.end_date).subtract(i, 'days').date()} ${
									month[
										moment(queryValues.end_date).subtract(i, 'days').month()
									]
								}`,
								balanceData ? balanceData.total : 0,
							]);

							// }
						} else if (currentDay === 90) {
							const balanceData = response.data.find(
								(history) =>
									moment(history.created_at).format('YYYY-MM-DD') ===
									moment(queryValues.end_date)
										.subtract(i, 'days')
										.format('YYYY-MM-DD')
							);
							if (!balanceData) continue;
							newGraphData.push([
								`${moment(queryValues.end_date).subtract(i, 'days').date()} ${
									month[
										moment(queryValues.end_date).subtract(i, 'days').month()
									]
								}`,
								balanceData ? balanceData.total : 0,
							]);
						}
					}

					newGraphData.reverse();

					setGraphData(newGraphData);
					setCurrentBalance(balance);
					setLatestBalance(response?.data?.[0]);
					setSelectedDate(balance.created_at);
					setQueryFilters({
						total: response.count,
						fetched: true,
						page,
						currentTablePage: page === 1 ? 1 : queryFilters.currentTablePage,
						isRemaining: response.count > page * limit,
					});

					setIsLoading(false);
				})
				.catch((error) => {
					// const message = error.message;
					setIsLoading(false);
				});
		},
		firstRender.current ? 800 : 0
	);

	const requestHistory = (page = 1, limit = 50) => {
		setIsLoading(true);
		onHandleFetchBalance(page, limit);
	};

	const refreshLinkHandle = () => {
		if (activeTab === '0') {
			setGraphData([]);
			requestHistory();
		} else if (activeTab === '1') {
			onHandleRefresh();
		}
	};

	const getRows = (coins) => {
		let keysSorted = Object.keys(currentBalance?.balance).sort((a, b) => {
			return (
				currentBalance?.balance[b].native_currency_value -
				currentBalance?.balance[a].native_currency_value
			);
		});
		let sortedCoins = [];

		keysSorted.forEach((coin) => {
			sortedCoins.push(coins[coin]);
		});

		Object.keys(coins || {}).forEach((coin) => {
			if (!sortedCoins.find((x) => x.symbol === coins[coin].symbol)) {
				sortedCoins.push(coins[coin]);
			}
		});

		return (
			<>
				{sortedCoins.map((coin, index) => {
					const { symbol } = coin;
					const baseCoin = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
					const selectedCoin = assets.find((coin) => coin[0] === symbol);
					const { increment_unit } = selectedCoin;
					const oraclePrice = pricesInNative[coin?.symbol];
					const balance = balances[`${coin?.symbol}_balance`];
					const incrementUnit = coins[coin.symbol].increment_unit;
					const decimalPoint = new BigNumber(incrementUnit).dp();
					const sourceAmount = new BigNumber(
						currentBalance?.balance[coin.symbol]?.original_value || 0
					)
						.decimalPlaces(decimalPoint)
						.toNumber();
					const incrementUnitNative =
						coins[balance_history_config?.currency || 'usdt'].increment_unit;
					const decimalPointNative = new BigNumber(incrementUnitNative).dp();
					const sourceAmountNative = new BigNumber(
						currentBalance?.balance[coin.symbol]?.native_currency_value || 0
					)
						.decimalPlaces(decimalPointNative)
						.toNumber();
					const balanceText =
						coin?.symbol === BASE_CURRENCY
							? formatCurrencyByIncrementalUnit(balance, increment_unit)
							: formatCurrencyByIncrementalUnit(
									calculateOraclePrice(balance, oraclePrice),
									baseCoin.increment_unit
							  );
					const totalValue = currentBalance?.total;
					const assetValue = sourceAmountNative;
					if (sourceAmount > 0) {
						return (
							<tr className="table-row" key={index}>
								<td
									style={{
										padding: '1.25em',
										borderBottom: '1px solid grey',
										minWidth: '15.5em',
									}}
									className="table-icon td-fit"
								>
									{!loading ? (
										<Link
											to={`/prices/coin/${coin.symbol}`}
											className="underline"
										>
											{isMobile ? (
												<div
													className="d-flex align-items-center wallet-hover cursor-pointer"
													style={{ cursor: 'pointer' }}
												>
													<Coin iconId={coin.icon_id} type="CS11" />
													<div className="ml-3">
														<div className="px-2 fill-active-color">
															{coin.display_name}
														</div>
														<div className="h4">{coin?.fullname}</div>
													</div>
												</div>
											) : (
												<div
													className="d-flex align-items-center wallet-hover cursor-pointer"
													style={{ cursor: 'pointer' }}
												>
													<Coin iconId={coin.icon_id} />
													<div className="px-2">{coin.display_name}</div>
												</div>
											)}
										</Link>
									) : (
										<Loading index={index} />
									)}
								</td>
								<td
									style={{ borderBottom: '1px solid grey', minWidth: '15.5em' }}
									className="td-fit"
								>
									{!loading ? (
										<span>
											<div
												className={isMobile ? 'text-end fill-active-color' : ''}
											>
												{sourceAmount}
											</div>
											{isMobile &&
												selectedCoin[0] !== BASE_CURRENCY &&
												parseFloat(balanceText || 0) > 0 && (
													<div className="text-end">{`(≈ $${balanceText})`}</div>
												)}
										</span>
									) : (
										<Loading index={index} />
									)}
								</td>

								{!isMobile && (
									<td
										style={{
											borderBottom: '1px solid grey',
											minWidth: '15.5em',
										}}
										className="td-fit"
									>
										{!loading ? (
											<>
												= {sourceAmountNative}{' '}
												{balance_history_config?.currency?.toUpperCase() ||
													'USDT'}
											</>
										) : (
											<Loading index={index} />
										)}
									</td>
								)}
								{!isMobile && (
									<td
										style={{
											borderBottom: '1px solid grey',
											minWidth: '15.5em',
										}}
										className="td-fit"
									>
										{!loading ? (
											<>
												<div>{`${calculatePercentages(
													totalValue,
													assetValue
												)}%`}</div>
												{isMobile &&
													selectedCoin[0] !== BASE_CURRENCY &&
													parseFloat(balanceText || 0) > 0 && (
														<div className="text-end">{`(≈ $${balanceText})`}</div>
													)}
											</>
										) : (
											<Loading index={index} />
										)}
									</td>
								)}
							</tr>
						);
					}
					return null;
				})}
			</>
		);
	};

	const customDateModal = () => {
		return (
			<>
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined className="stake_theme" />}
					className="stake_table_theme stake_theme"
					bodyStyle={{}}
					visible={customDate}
					width={400}
					footer={null}
					onCancel={() => {
						setCustomDate(false);
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<div
							className="stake_theme"
							style={{
								width: '100%',
							}}
						>
							<div style={{ marginTop: 20, marginBottom: 20 }}>
								<EditWrapper stringId="PROFIT_LOSS.CUSTOM_DATE_DESCRIPTION">
									{STRINGS['PROFIT_LOSS.CUSTOM_DATE_DESCRIPTION']}
								</EditWrapper>
							</div>
							<div style={{ marginTop: 5 }}>
								<div>Start Date</div>
								<DatePicker
									suffixIcon={null}
									className="pldatePicker"
									value={
										customDateValues?.start_date &&
										moment(customDateValues.start_date)
									}
									disabledDate={(current) => {
										return (
											current &&
											(current <
												moment(
													balance_history_config?.date_enabled,
													'YYYY-MM-DD'
												) ||
												current.isAfter(moment()))
										);
									}}
									placeholder={STRINGS['PROFIT_LOSS.SELECT_START_DATE']}
									style={{
										width: 200,
									}}
									onChange={(date, dateString) => {
										setCustomDateValues({
											...customDateValues,
											start_date: dateString,
										});
									}}
									format={'YYYY/MM/DD'}
								/>
							</div>
							<div style={{ marginTop: 5 }}>
								<div>End Date</div>
								<DatePicker
									suffixIcon={null}
									className="pldatePicker"
									value={
										customDateValues?.end_date &&
										moment(customDateValues.end_date)
									}
									disabledDate={(current) => {
										return (
											current &&
											(current <
												moment(
													balance_history_config?.date_enabled,
													'YYYY-MM-DD'
												) ||
												current.isAfter(moment()))
										);
									}}
									placeholder={STRINGS['PROFIT_LOSS.SELECT_END_DATE']}
									style={{
										width: 200,
									}}
									onChange={(date, dateString) => {
										setCustomDateValues({
											...customDateValues,
											end_date: dateString,
										});
									}}
									format={'YYYY/MM/DD'}
								/>
							</div>
						</div>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 15,
							justifyContent: 'space-between',
							marginTop: 30,
						}}
					>
						<Button
							onClick={() => {
								setCustomDate(false);
							}}
							style={{
								backgroundColor: '#5D63FF',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							<EditWrapper stringId="PROFIT_LOSS.BACK_CUSTOM">
								{STRINGS['PROFIT_LOSS.BACK_CUSTOM']}
							</EditWrapper>
						</Button>
						<Button
							onClick={async () => {
								try {
									if (!customDateValues.end_date) {
										message.error('Please choose an end date');
										return;
									}
									if (!customDateValues.start_date) {
										message.error('Please choose a start date');
										return;
									}
									const duration = moment.duration(
										moment(customDateValues.end_date).diff(
											moment(customDateValues.start_date)
										)
									);
									const months = duration.asMonths();

									if (months > 3) {
										message.error(
											'Date difference cannot go further than 3 months'
										);
										return;
									}

									setCurrentDay(90);
									setQueryValues({
										start_date: moment(customDateValues.start_date)
											.startOf('day')
											.toISOString(),
										end_date: moment(customDateValues.end_date)
											.endOf('day')
											.toISOString(),
									});
									setCustomDate(false);
								} catch (error) {
									message.error('Something went wrong');
								}
							}}
							style={{
								backgroundColor: '#5D63FF',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							<EditWrapper stringId="PROFIT_LOSS.PROOCED_CUSTOM">
								{STRINGS['PROFIT_LOSS.PROOCED_CUSTOM']}
							</EditWrapper>
						</Button>
					</div>
				</Modal>
			</>
		);
	};

	const getSourceDecimals = (symbol, value) => {
		const incrementUnit = coins[symbol].increment_unit;
		const decimalPoint = new BigNumber(incrementUnit).dp();
		const sourceAmount = new BigNumber(value || 0)
			.decimalPlaces(decimalPoint)
			.toNumber();

		return sourceAmount;
	};

	const getPeriod = (day) => {
		if (day === 7) {
			return '7d';
		} else if (day === 30) {
			return '1m';
		} else return '3m';
	};

	const onHandleTab = (activeKey) => {
		setActiveTab(activeKey);
		const url = new URL(window.location.href);
		url.search = selectedTabList[activeKey]
			? `?${selectedTabList[activeKey]}`
			: '';
		window.history.replaceState(null, '', url.toString());
	};

	function calculatePercentages(totalValue, value) {
		const percentage = (value / totalValue) * 100;
		return percentage.toFixed(1);
	}

	return (
		<Spin spinning={isLoading}>
			<div className={`${!isMobile ? 'mt-4' : ''}`}>
				{customDateModal()}
				{!isMobile && (
					<div style={{ position: 'absolute', top: -25, left: -5 }}>
						<span
							style={{
								cursor: 'pointer',
								textDecoration: 'underline',
								color: '#5257CD',
							}}
							onClick={() => handleBalanceHistory(false)}
						>
							{'<'}
							<EditWrapper stringId="PROFIT_LOSS.BACK">
								{STRINGS['PROFIT_LOSS.BACK']}
							</EditWrapper>
						</span>{' '}
						<EditWrapper stringId="PROFIT_LOSS.BACK_TO_WALLET">
							{STRINGS['PROFIT_LOSS.BACK_TO_WALLET']}
						</EditWrapper>
					</div>
				)}
				<Tabs defaultActiveKey="0" activeKey={activeTab} onChange={onHandleTab}>
					<TabPane tab={STRINGS['PROFIT_LOSS.PL_SUMMARY']} key="0">
						<div
							className="wallet-assets_block"
							style={{ marginTop: -10, padding: 15, paddingTop: 20 }}
						>
							<div
								className={`${isMobile ? `mb-0` : ''}`}
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									marginBottom: 40,
									gap: 10,
								}}
							>
								<div>
									<div
										className={`${isMobile ? 'profit-loss-preformance' : ''}`}
									>
										<EditWrapper stringId="PROFIT_LOSS.WALLET_PERFORMANCE_TITLE">
											{STRINGS['PROFIT_LOSS.WALLET_PERFORMANCE_TITLE']}
										</EditWrapper>
									</div>
									<div>
										<EditWrapper stringId="PROFIT_LOSS.WALLET_PERFORMANCE_DESCRIPTION">
											{STRINGS['PROFIT_LOSS.WALLET_PERFORMANCE_DESCRIPTION']}
										</EditWrapper>
									</div>
								</div>
								{!isMobile && (
									<div>
										<div>
											<EditWrapper stringId="PROFIT_LOSS.EST_TOTAL_BALANCE">
												{STRINGS['PROFIT_LOSS.EST_TOTAL_BALANCE']}
											</EditWrapper>{' '}
											{moment(latestBalance?.created_at).format('DD/MMM/YYYY')}
										</div>
										<div style={{ fontSize: '1.5em', marginBottom: 5 }}>
											{balance_history_config?.currency?.toUpperCase() ||
												'USDT'}{' '}
											{getSourceDecimals(
												balance_history_config?.currency || 'usdt',
												latestBalance?.total
											)
												?.toString()
												.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0'}
										</div>
										<Spin spinning={loadingPnl}>
											<div
												className={
													Number(
														userPL?.[getPeriod(currentDay)]?.total || 0
													) === 0
														? 'profitNeutral'
														: (userPL?.[getPeriod(currentDay)]?.total || 0) > 0
														? 'profitPositive'
														: 'profitNegative'
												}
											>
												{' '}
												{currentDay + ' '}
												<EditWrapper stringId="PROFIT_LOSS.PL_DAYS">
													{STRINGS['PROFIT_LOSS.PL_DAYS']}
												</EditWrapper>{' '}
												{Number(userPL?.[getPeriod(currentDay)]?.total || 0) > 0
													? '+'
													: ' '}
												{''}
												{getSourceDecimals(
													balance_history_config?.currency || 'usdt',
													userPL?.[getPeriod(currentDay)]?.total
												)
													?.toString()
													.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0'}
												{userPL?.[getPeriod(currentDay)]?.totalPercentage
													? ` (${
															userPL?.[getPeriod(currentDay)]?.totalPercentage
													  }%) `
													: ' '}
												{balance_history_config?.currency?.toUpperCase() ||
													'USDT'}
											</div>
										</Spin>
									</div>
								)}
							</div>
							<div
								className={`${
									isMobile ? 'flex-direction-column' : 'flex-direction-row'
								}`}
								style={{
									display: 'flex',
								}}
							>
								<div
									style={{
										display: 'flex',
										gap: 5,
										marginTop: 15,
										marginBottom: 15,
									}}
								>
									<Button
										style={{
											fontWeight: currentDay === 7 ? 'bold' : '400',
											fontSize: '1em',
										}}
										className="plButton"
										ghost
										onClick={() => {
											setCurrentDay(7);
											setQueryValues({
												start_date: moment().subtract(7, 'days').toISOString(),
												end_date: moment().subtract().toISOString(),
											});
										}}
									>
										<span style={{ marginRight: 3 }}>1</span>
										<EditWrapper stringId="PROFIT_LOSS.WEEK">
											{STRINGS['PROFIT_LOSS.WEEK']}
										</EditWrapper>
									</Button>
									<Button
										style={{
											fontWeight: currentDay === 30 ? 'bold' : '400',
											fontSize: '1em',
										}}
										className="plButton"
										ghost
										onClick={() => {
											setCurrentDay(30);
											setQueryValues({
												start_date: moment().subtract(30, 'days').toISOString(),
												end_date: moment().subtract().toISOString(),
											});
										}}
									>
										<span style={{ marginRight: 3 }}>1 </span>{' '}
										<EditWrapper stringId="PROFIT_LOSS.MONTH">
											{STRINGS['PROFIT_LOSS.MONTH']}
										</EditWrapper>
									</Button>
									<Button
										style={{
											fontWeight: currentDay === 90 ? 'bold' : '400',
											fontSize: '1em',
										}}
										className="plButton"
										ghost
										onClick={() => {
											setCurrentDay(90);
											setQueryValues({
												start_date: moment().subtract(90, 'days').toISOString(),
												end_date: moment().subtract().toISOString(),
											});
										}}
									>
										<span style={{ marginRight: 3 }}>3 </span>{' '}
										<EditWrapper stringId="PROFIT_LOSS.MONTHS">
											{STRINGS['PROFIT_LOSS.MONTHS']}
										</EditWrapper>
									</Button>
								</div>
								{isMobile && (
									<div
										className={
											Number(userPL?.[getPeriod(currentDay)]?.total || 0) === 0
												? 'profitNeutral mb-5'
												: (userPL?.[getPeriod(currentDay)]?.total || 0) > 0
												? 'profitPositive mb-5'
												: 'profitNegative mb-5'
										}
									>
										{' '}
										{currentDay + ' '}
										<EditWrapper stringId="PROFIT_LOSS.PL_DAYS">
											{STRINGS['PROFIT_LOSS.PL_DAYS']}
										</EditWrapper>{' '}
										{Number(userPL?.[getPeriod(currentDay)]?.total || 0) > 0
											? '+'
											: ' '}
										{''}
										{getSourceDecimals(
											balance_history_config?.currency || 'usdt',
											userPL?.[getPeriod(currentDay)]?.total
										)
											?.toString()
											.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0'}
										{userPL?.[getPeriod(currentDay)]?.totalPercentage
											? ` (${
													userPL?.[getPeriod(currentDay)]?.totalPercentage
											  }%) `
											: ' '}
										{balance_history_config?.currency?.toUpperCase() || 'USDT'}
									</div>
								)}
								{/* <Button
 style={{
 fontWeight: currentDay === 'custom' ? 'bold' : '400',
 fontSize: '1em',
 }}
 className="plButton"
 ghost
 onClick={() => {
 setCustomDate(true);
 }}
 >
 <EditWrapper stringId="PROFIT_LOSS.CUSTOM">
 {STRINGS['PROFIT_LOSS.CUSTOM']}
 </EditWrapper>
 </Button> */}
							</div>

							<div className="highChartColor">
								<HighchartsReact highcharts={Highcharts} options={options} />
							</div>
							{isMobile && (
								<div className="profit-loss-link mb-5">
									<div className="d-flex flex-direction-column align-items-center">
										<div>
											<EditWrapper stringId="PROFIT_LOSS.WALLET_BALANCE_ESTIMATE">
												{STRINGS['PROFIT_LOSS.WALLET_BALANCE_ESTIMATE']}
											</EditWrapper>
											<span>
												{' '}
												(
												{moment(latestBalance?.created_at).format(
													'DD/MMM/YYYY'
												)}
												):
											</span>
										</div>
										<div style={{ fontSize: '1em', marginBottom: 5 }}>
											{balance_history_config?.currency?.toUpperCase() ||
												'USDT'}{' '}
											{getSourceDecimals(
												balance_history_config?.currency || 'usdt',
												latestBalance?.total
											)
												?.toString()
												.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0'}
										</div>
									</div>
									<div onClick={() => onHandleTab('2')}>
										<EditWrapper stringId="PROFIT_LOSS.VIEW_BALANCE_HISTORY">
											<span className="profit-loss-tab-label">
												{STRINGS['PROFIT_LOSS.VIEW_BALANCE_HISTORY']}
											</span>
										</EditWrapper>
									</div>

									<div onClick={() => onHandleTab('1')}>
										<EditWrapper stringId="PROFIT_LOSS.VIEW_PERCENTAGE_SHARE">
											<span className="profit-loss-tab-label">
												{STRINGS['PROFIT_LOSS.VIEW_PERCENTAGE_SHARE']}
											</span>
										</EditWrapper>
									</div>
								</div>
							)}
						</div>
					</TabPane>
					{isMobile && (
						<TabPane tab={STRINGS['PROFIT_LOSS.PERCENTAGE']} key="1">
							<div
								className="wallet-assets_block"
								style={{ marginTop: -10, padding: 15, paddingTop: 20 }}
							>
								<div>
									<DonutChart
										coins={coins}
										chartData={chartData}
										showOpenWallet={false}
										centerText={true}
									/>
								</div>
								<div className="wallet-assets_block">
									<table className="wallet-assets_block-table">
										<thead>
											<tr className="table-bottom-border">
												<th />
												<th>
													<EditWrapper stringId="ASSETS">
														{STRINGS['ASSETS']}
													</EditWrapper>
												</th>
												<th>
													<EditWrapper stringId="WALLET.MOBILE_WALLET_SHARE_LABEL">
														{STRINGS['WALLET.MOBILE_WALLET_SHARE_LABEL']}
													</EditWrapper>
												</th>
											</tr>
										</thead>
										<tbody>
											{assets.map(
												(
													[
														key,
														{
															increment_unit,
															oraclePrice,
															balance,
															fullname,
															symbol = '',
															icon_id,
														} = DEFAULT_COIN_DATA,
													],
													index
												) => {
													// const markets = getAllAvailableMarkets(key);
													const getBalancePercentage = chartData.filter(
														(coin) => coin.symbol === symbol
													);
													const baseCoin =
														coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
													const balanceText =
														key === BASE_CURRENCY
															? formatCurrencyByIncrementalUnit(
																	balance,
																	increment_unit
															  )
															: formatCurrencyByIncrementalUnit(
																	calculateOraclePrice(balance, oraclePrice),
																	baseCoin.increment_unit
															  );
													return (
														<tr
															className="table-row table-bottom-border"
															key={key}
														>
															<td className="table-icon td-fit" />
															<td className="td-name td-fit">
																{assets && !loading ? (
																	<div className="d-flex align-items-center wallet-hover cursor-pointer">
																		<Link
																			to={`/wallet/${key.toLowerCase()}`}
																			className="mt-3"
																		>
																			<Coin iconId={icon_id} type="CS11" />
																		</Link>
																		<Link to={`/wallet/${key.toLowerCase()}`}>
																			<div className="px-2 fill-active-color font-weight-bold">
																				<EditWrapper
																					stringId={`${symbol?.toUpperCase()}_FULLNAME`}
																				>
																					{symbol?.toUpperCase()}
																				</EditWrapper>
																			</div>
																			<div className="ml-2 fill_secondary-color">
																				<EditWrapper
																					stringId={`${symbol?.toUpperCase()}_FULLNAME`}
																				>
																					{fullname}
																				</EditWrapper>
																			</div>
																		</Link>
																	</div>
																) : (
																	<div
																		className="loading-row-anime w-half"
																		style={{
																			animationDelay: `.${index + 1}s`,
																		}}
																	/>
																)}
															</td>
															<td className="td-amount">
																{assets &&
																baseCoin &&
																!loading &&
																increment_unit ? (
																	<div className="d-flex justify-content-end">
																		<div className="d-flex flex-column align-items-end">
																			<div className="font-weight-bold fill-active-color">
																				{
																					getBalancePercentage[0]
																						?.balancePercentage
																				}
																			</div>
																			{key !== BASE_CURRENCY &&
																				parseFloat(balanceText || 0) > 0 && (
																					<div className="fill_secondary-color">
																						{`(≈  $${balanceText})`}
																					</div>
																				)}
																		</div>
																	</div>
																) : (
																	<div
																		className="loading-row-anime w-full"
																		style={{
																			animationDelay: `.${index + 1}s`,
																		}}
																	/>
																)}
															</td>
														</tr>
													);
												}
											)}
										</tbody>
									</table>
								</div>
								{isMobile && (
									<div className="profit-loss-link mb-5">
										<div onClick={() => onHandleTab('2')}>
											<EditWrapper stringId="PROFIT_LOSS.VIEW_BALANCE_HISTORY">
												<span className="profit-loss-tab-label">
													{STRINGS['PROFIT_LOSS.VIEW_BALANCE_HISTORY']}
												</span>
											</EditWrapper>
										</div>
										<div onClick={() => onHandleTab('0')}>
											<EditWrapper stringId="PROFIT_LOSS.VIEW_WALLET_P&L">
												<span className="profit-loss-tab-label">
													{STRINGS['PROFIT_LOSS.VIEW_WALLET_P&L']}
												</span>
											</EditWrapper>
										</div>
									</div>
								)}
							</div>
						</TabPane>
					)}
					{currentBalance && (
						<TabPane
							tab={STRINGS['PROFIT_LOSS.BALANCE_HISTORY']}
							key={isMobile ? '2' : '1'}
						>
							<div
								className="wallet-assets_block "
								style={{ marginTop: -10, padding: 15, paddingTop: 20 }}
							>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										gap: 15,
									}}
								>
									{!isMobile && (
										<div>
											<div style={{ fontWeight: 'bold' }}>
												<EditWrapper stringId="PROFIT_LOSS.WALLET_BALANCE">
													{STRINGS['PROFIT_LOSS.WALLET_BALANCE']}
												</EditWrapper>
											</div>
											<div style={{ maxWidth: 300, marginBottom: 10 }}>
												<EditWrapper stringId="PROFIT_LOSS.WALLET_BALANCE_DESCRIPTION_1">
													{STRINGS['PROFIT_LOSS.WALLET_BALANCE_DESCRIPTION_1']}
												</EditWrapper>{' '}
												{moment(currentBalance?.created_at).format(
													'DD/MMM/YYYY'
												)}
												.
											</div>
										</div>
									)}
									<div className={`${isMobile ? `balance-history` : ''}`}>
										<div className={`${isMobile ? `total-balance` : ''}`}>
											<div>
												<EditWrapper stringId="PROFIT_LOSS.EST_TOTAL_BALANCE">
													{STRINGS['PROFIT_LOSS.EST_TOTAL_BALANCE']}
												</EditWrapper>{' '}
												{moment(currentBalance?.created_at).format(
													'DD/MMM/YYYY'
												)}
											</div>
											<div style={{ fontSize: '1.5em', marginBottom: 5 }}>
												{balance_history_config?.currency?.toUpperCase() ||
													'USDT'}{' '}
												{getSourceDecimals(
													balance_history_config?.currency || 'usdt',
													currentBalance?.total
												)
													?.toString()
													.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0'}
											</div>
										</div>
										<div
											className={`${
												isMobile ? `balance-history-date_select` : ''
											}`}
										>
											<div>
												<EditWrapper stringId="PROFIT_LOSS.DATE_SELECT">
													{STRINGS['PROFIT_LOSS.DATE_SELECT']}
												</EditWrapper>
												:
											</div>
											<DatePicker
												suffixIcon={null}
												className="pldatePicker"
												placeholder={STRINGS['PROFIT_LOSS.DATE_SELECT']}
												value={selectedCustomDate}
												disabledDate={(current) => {
													return (
														current &&
														(current <
															moment(
																balance_history_config?.date_enabled,
																'YYYY-MM-DD'
															) ||
															current.isAfter(moment()))
													);
												}}
												style={{
													width: '12.5em',
													fontSize: '1em',
												}}
												onChange={(date, dateString) => {
													if (!dateString) return;
													setSelectedCustomDate(date);
													fetchBalanceHistory({
														start_date: moment(dateString)
															.startOf('day')
															.toISOString(),
														end_date: moment(dateString)
															.endOf('day')
															.toISOString(),
														limit: 1,
													})
														.then((response) => {
															let balance = response?.data?.[0];

															if (balance) setCurrentBalance(balance);
															else {
																message.error('Balance not found');
															}
														})
														.catch((error) => {
															message.error('Something went wrong');
														});
												}}
												format={'YYYY/MM/DD'}
											/>
										</div>
									</div>
								</div>

								<div
									className="wallet-assets_block"
									style={{ display: 'flex' }}
								>
									<table className="profit_block-table">
										<thead>
											<tr className="table-bottom-border">
												<th>
													<EditWrapper stringId="PROFIT_LOSS.ASSET_NAME">
														{STRINGS['PROFIT_LOSS.ASSET_NAME']}
													</EditWrapper>
												</th>
												<th>
													<EditWrapper
														stringId={
															isMobile
																? 'WALLET.MOBILE_WALLET_BALANCE_LABEL'
																: 'PROFIT_LOSS.BALANCE_AMOUNT'
														}
													>
														{isMobile
															? STRINGS['WALLET.MOBILE_WALLET_BALANCE_LABEL']
															: STRINGS['PROFIT_LOSS.BALANCE_AMOUNT']}
													</EditWrapper>
												</th>
												{!isMobile && (
													<th>
														<EditWrapper stringId="PROFIT_LOSS.VALUE">
															{STRINGS['PROFIT_LOSS.VALUE']}
														</EditWrapper>
													</th>
												)}
												{!isMobile && (
													<th>
														<EditWrapper stringId="PROFIT_LOSS.BALANCE_PERCENTAGE">
															{STRINGS['PROFIT_LOSS.BALANCE_PERCENTAGE']}
														</EditWrapper>
													</th>
												)}
											</tr>
										</thead>
										<tbody className="account-limits-content font-weight-bold">
											{getRows(coins)}
										</tbody>
									</table>
								</div>
								{isMobile && (
									<div className="profit-loss-link mb-5">
										<div onClick={() => onHandleTab('0')}>
											<EditWrapper stringId="PROFIT_LOSS.VIEW_WALLET_P&L">
												<span className="profit-loss-tab-label">
													{STRINGS['PROFIT_LOSS.VIEW_WALLET_P&L']}
												</span>
											</EditWrapper>
										</div>

										<div onClick={() => onHandleTab('1')}>
											<EditWrapper stringId="PROFIT_LOSS.VIEW_PERCENTAGE_SHARE">
												<span className="profit-loss-tab-label">
													{STRINGS['PROFIT_LOSS.VIEW_PERCENTAGE_SHARE']}
												</span>
											</EditWrapper>
										</div>
									</div>
								)}
							</div>
						</TabPane>
					)}
					{!isLoading && !isMobile && (
						<div className="refresh-link">
							<ActionNotification
								stringId="REFRESH"
								text={STRINGS['REFRESH']}
								iconId="REFRESH"
								iconPath={STATIC_ICONS['REFRESH']}
								className="blue-icon"
								onClick={() => refreshLinkHandle()}
							/>
						</div>
					)}
				</Tabs>
			</div>
		</Spin>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
	balances: state.user.balance,
	pricesInNative: state.asset.oraclePrices,
	dust: state.app.constants.dust,
	balance_history_config: state.app.constants.balance_history_config,
	chartData: state.asset.chartData,
	assets: sortedAssetsSelector(state),
	quickTrade: state.app.quickTrade,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(ProfitLossSection));
