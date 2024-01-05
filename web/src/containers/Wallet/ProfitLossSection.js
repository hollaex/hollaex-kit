import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { connect } from 'react-redux';
import withConfig from 'components/ConfigProvider/withConfig';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Coin, EditWrapper } from 'components';
import { Link } from 'react-router';
import { Button, Spin } from 'antd';
import { fetchBalanceHistory, fetchPlHistory } from './actions';
import BigNumber from 'bignumber.js';
import moment from 'moment';

const ProfitLossSection = ({ coins, balance_history_config }) => {
	const month = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];

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
	const [selectedDate, setSelectedDate] = useState();
	const [currentBalance, setCurrentBalance] = useState();
	const [latestBalance, setLatestBalance] = useState();
	const [userPL, setUserPL] = useState();
	const [current, setCurrent] = useState(0);
	const [graphData, setGraphData] = useState([]);

	const options = {
		title: {
			text: '',
		},
		tooltip: {
			enabled: false,
		},
		xAxis: {
			type: 'category',
			labels: {
				formatter: (item) => {
					const color =
						graphData?.[current || 0]?.[0] === item.value ? '#5D63FF' : 'white';
					const fontWeight =
						graphData?.[current || 0]?.[0] === item.value ? 'bold' : 'normal';
					return `<span style="color: ${color}; font-weight: ${fontWeight}">${item.value}</span>`;
				},
			},
		},
		series: [
			{
				data: graphData,
				color: '#FFFF00',
				cursor: 'pointer',

				point: {
					events: {
						click: (e, x, y) => {
							setCurrent(e.point.x);
							const balance = balanceHistory.find(
								(history) =>
									`${moment(history.created_at).date()} ${
										month[moment().month()]
									}` == graphData[e.point.x || 0][0]
							);
							setCurrentBalance(balance);
						},
					},
				},
			},
		],
	};

	useEffect(() => {
		setIsLoading(true);
		fetchPlHistory().then((res) => {
			setUserPL(res);
		});
		requestHistory(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		requestHistory(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryValues]);

	const requestHistory = (page = 1, limit = 50) => {
		setIsLoading(true);
		fetchBalanceHistory({ ...queryValues })
			.then((response) => {
				setBalanceHistory(
					page === 1 ? response.data : [...balanceHistory, ...response.data]
				);

				const length =
					response.data.length > currentDay
						? currentDay - 1
						: response.data.length - 1;
				const balanceData = response.data.find(
					(history) =>
						moment(history.created_at).format('YYYY-MM-DD') ==
						moment()
							.subtract(length + 1, 'days')
							.format('YYYY-MM-DD')
				);
				let balance = balanceData || response.data[length];

				let newGraphData = [];
				for (let i = 0; i < length; i++) {
					if (currentDay == 7) {
						const balanceData = response.data.find(
							(history) =>
								moment(history.created_at).format('YYYY-MM-DD') ==
								moment()
									.subtract(i + 1, 'days')
									.format('YYYY-MM-DD')
						);
						newGraphData.push([
							`${moment()
								.subtract(i + 1, 'days')
								.date()} ${
								month[
									moment()
										.subtract(i + 1, 'days')
										.month()
								]
							}`,
							balanceData ? balanceData.total : 0,
						]);
					} else if (currentDay == 30) {
						if (i % 2 == 0) {
							const balanceData = response.data.find(
								(history) =>
									moment(history.created_at).format('YYYY-MM-DD') ==
									moment()
										.subtract(i + 1, 'days')
										.format('YYYY-MM-DD')
							);
							newGraphData.push([
								`${moment()
									.subtract(i + 1, 'days')
									.date()} ${
									month[
										moment()
											.subtract(i + 1, 'days')
											.month()
									]
								}`,
								balanceData ? balanceData.total : 0,
							]);
						}
					} else if (currentDay == 90) {
						if (i % 30 == 0) {
							const balanceData = response.data.find(
								(history) =>
									moment(history.created_at).format('YYYY-MM-DD') ==
									moment()
										.subtract(i + 1, 'days')
										.format('YYYY-MM-DD')
							);
							newGraphData.push([
								`${moment()
									.subtract(i + 1, 'days')
									.date()} ${
									month[
										moment()
											.subtract(i + 1, 'days')
											.month()
									]
								}`,
								balanceData ? balanceData.total : 0,
							]);
						}
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
	};

	const getRows = (coins) => {
		return (
			<>
				{Object.values(coins || {}).map((coin, index) => {
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

					return (
						<tr className="table-row" key={index}>
							<td className="table-icon td-fit" />
							<td
								style={{ padding: 20, borderBottom: '1px solid grey' }}
								className="td-name td-fit"
							>
								<Link to={`/assets/coin/${coin.symbol}`} className="underline">
									<div
										className="d-flex align-items-center wallet-hover cursor-pointer"
										style={{ cursor: 'pointer' }}
									>
										<Coin iconId={coin.icon_id} />
										<div className="px-2">{coin.display_name}</div>
									</div>
								</Link>
							</td>
							<td
								style={{ borderBottom: '1px solid grey' }}
								className="td-name td-fit"
							>
								{sourceAmount} {coin.symbol.toUpperCase()}
							</td>

							<td
								style={{ borderBottom: '1px solid grey' }}
								className="td-name td-fit"
							>
								= {sourceAmountNative}{' '}
								{balance_history_config?.currency?.toUpperCase() || 'USDT'}
							</td>
						</tr>
					);
				})}
			</>
		);
	};

	return (
		<Spin spinning={isLoading}>
			<div
				className="wallet-assets_block"
				style={{ marginTop: 20, paddingTop: 20 }}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						marginBottom: 40,
					}}
				>
					<div>
						<div>Balance performance</div>
						<div>
							Your wallet's balance performance over time and the asset
							breakdown. Click the dates below to see your wallet's performance
							on that day.
						</div>
					</div>
					<div>
						<div>
							Est. Total Balance{' '}
							{moment(latestBalance?.created_at).format('DD/MMM/YYYY')}
						</div>
						<div style={{ fontSize: 19, marginBottom: 5 }}>
							{balance_history_config?.currency?.toUpperCase() || 'USDT'}{' '}
							{latestBalance?.total || '0'}
						</div>
						<div
							style={{
								color:
									Number(userPL?.['7d']?.total || 0) > 0
										? '#329932'
										: '#EB5344',
							}}
						>
							7 Day P&L {Number(userPL?.['7d']?.total || 0) > 0 ? '+' : '-'}{' '}
							{userPL?.['7d']?.total || 0}{' '}
							{balance_history_config?.currency?.toUpperCase() || 'USDT'}
						</div>
					</div>
				</div>

				<div
					style={{ display: 'flex', gap: 5, marginTop: 15, marginBottom: 15 }}
				>
					<Button
						style={{ fontWeight: currentDay == 7 ? 'bold' : '400' }}
						ghost
						onClick={() => {
							setCurrentDay(7);
							setQueryValues({
								start_date: moment().subtract(7, 'days').toISOString(),
								end_date: moment().subtract().toISOString(),
							});
						}}
					>
						1 week
					</Button>
					<Button
						style={{ fontWeight: currentDay == 30 ? 'bold' : '400' }}
						ghost
						onClick={() => {
							setCurrentDay(30);
							setQueryValues({
								start_date: moment().subtract(30, 'days').toISOString(),
								end_date: moment().subtract().toISOString(),
							});
						}}
					>
						1 month
					</Button>
					<Button
						style={{ fontWeight: currentDay == 90 ? 'bold' : '400' }}
						ghost
						onClick={() => {
							setCurrentDay(90);
							setQueryValues({
								start_date: moment().subtract(90, 'days').toISOString(),
								end_date: moment().subtract().toISOString(),
							});
						}}
					>
						3 month
					</Button>
					<Button
						style={{ fontWeight: currentDay == 'custom' ? 'bold' : '400' }}
						ghost
						onClick={() => {}}
					>
						Custom
					</Button>
				</div>

				<HighchartsReact highcharts={Highcharts} options={options} />

				{currentBalance && (
					<>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<div>
								<div style={{ fontWeight: 'bold' }}>
									Wallet balance breakdown
								</div>
								<div style={{ width: 300, marginBottom: 10 }}>
									Below is a wallet breakdown on{' '}
									{moment(currentBalance?.created_at).format('DD/MMM/YYYY')}.
									Click chart above to update the table below.
								</div>
							</div>
						</div>

						<div className="wallet-assets_block" style={{ display: 'flex' }}>
							<table className="wallet-assets_block-table">
								<thead>
									<tr className="table-bottom-border">
										<th />
										<th>Assets name</th>
										<th>Balance Amount</th>
										<th>Value</th>
									</tr>
								</thead>
								<tbody className="account-limits-content font-weight-bold">
									{getRows(coins)}
								</tbody>
							</table>
						</div>
					</>
				)}
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
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(ProfitLossSection));
