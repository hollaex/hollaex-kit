import React, { useEffect, useMemo, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { isMobile } from 'react-device-detect';
import { Switch } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { fetchBalanceHistory, fetchPlHistory } from './actions';
import classnames from 'classnames';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {
	WALLET_SORT,
	toggleWalletSort,
	setSortModeAmount,
} from 'actions/appActions';
import {
	// CurrencyBall,
	Coin,
	ActionNotification,
	SearchBox,
	EditWrapper,
	Help,
	DonutChart,
	Image,
} from 'components';
import {
	formatCurrencyByIncrementalUnit,
	calculateOraclePrice,
} from 'utils/currency';
import STRINGS from 'config/localizedStrings';
import {
	BASE_CURRENCY,
	CURRENCY_PRICE_FORMAT,
	DEFAULT_COIN_DATA,
} from 'config/constants';
import withConfig from 'components/ConfigProvider/withConfig';
import TradeInputGroup from './components/TradeInputGroup';
import { unique } from 'utils/data';
import DustSection from './DustSection';
import moment from 'moment';
import _toLower from 'lodash/toLower';
import BigNumber from 'bignumber.js';

const AssetsBlock = ({
	coins,
	pairs,
	totalAssets,
	navigate,
	handleSearch,
	onToggle,
	icons: ICONS,
	hasEarn,
	loading,
	contracts,
	quicktrade,
	goToDustSection,
	showDustSection,
	goToWallet,
	isZeroBalanceHidden,
	assets,
	mode,
	is_descending,
	toggleSort,
	setSortModeAmount,
	chartData,
	handleBalanceHistory,
	balance_history_config,
	info,
}) => {
	const emptyDonut = useMemo(() => {
		return chartData && !!chartData.length;
	}, [chartData]);

	const [graphData, setGraphData] = useState([]);
	const [historyData, setHistoryData] = useState([]);
	const [userPL, setUserPL] = useState();

	const handleUpgrade = (info = {}) => {
		if (
			_toLower(info.plan) !== 'fiat' &&
			_toLower(info.plan) !== 'boost' &&
			_toLower(info.type) !== 'enterprise'
		) {
			return true;
		} else {
			return false;
		}
	};

	const isUpgrade = handleUpgrade(info);

	useEffect(() => {
		if (isMobile) return;
		fetchPlHistory()
			.then((res) => {
				setUserPL(res);
			})
			.catch((err) => err);

		fetchBalanceHistory({
			start_date: moment().subtract(7, 'days').toISOString(),
			end_date: moment().subtract().toISOString(),
		})
			.then((response) => {
				const length = 6;

				let newGraphData = [];
				for (let i = 0; i < length + 1; i++) {
					const balanceData = response.data.find(
						(history) =>
							moment(history.created_at).format('YYYY-MM-DD') ===
							moment().subtract(i, 'days').format('YYYY-MM-DD')
					);
					// if (!balanceData) continue;
					newGraphData.push([
						`   `,
						balanceData
							? balanceData.total
							: response?.data?.[response.data.length - 1]?.total,
					]);
				}

				newGraphData.reverse();

				setGraphData(newGraphData);
				setHistoryData(response.data || []);
				// setIsLoading(false);
			})
			.catch((error) => {
				// setIsLoading(false);
			});
		// eslint-disable-next-line
	}, []);

	const options = {
		chart: {
			type: 'area',
		},
		title: {
			text: '',
		},
		tooltip: {
			enabled: false,
		},
		xAxis: {
			lineWidth: 0,
			minorGridLineWidth: 0,
			lineColor: 'transparent',
			minorTickLength: 0,
			tickLength: 0,
			visible: false,
			labels: {
				enabled: false,
			},
			title: {
				text: null,
			},
		},
		yAxis: {
			gridLineColor: 'transparent',
			labels: {
				enabled: false,
			},
			title: {
				text: null,
			},
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
		plotOptions: {
			series: {
				marker: {
					enabled: false,
					states: {
						hover: {
							enabled: false,
						},
					},
				},
			},
		},
		series: [
			{
				showInLegend: false,
				data: graphData,
				color: '#FFFF00',
			},
		],
	};

	const getSourceDecimals = (symbol, value) => {
		const incrementUnit = coins[symbol].increment_unit;
		const decimalPoint = new BigNumber(incrementUnit).dp();
		const sourceAmount = new BigNumber(value || 0)
			.decimalPlaces(decimalPoint)
			.toNumber();

		return sourceAmount;
	};

	const handleClickAmount = () => {
		if (mode === WALLET_SORT.AMOUNT) {
			toggleSort();
		} else {
			setSortModeAmount();
		}
	};

	const renderCaret = (cell) => (
		<div className="market-list__caret d-flex flex-direction-column mx-1 secondary-text">
			<CaretUpOutlined
				className={classnames({
					'important-text': mode === cell && is_descending,
				})}
			/>
			<CaretDownOutlined
				className={classnames({
					'important-text': mode === cell && !is_descending,
				})}
			/>
		</div>
	);

	const isMarketAvailable = (pair) => {
		return pair && pairs[pair] && pairs[pair].active;
	};

	const findPair = (key, field) => {
		const availableMarketsArray = [];

		Object.entries(pairs).map(([pairKey, pairObject]) => {
			if (
				pairObject &&
				pairObject[field] === key &&
				isMarketAvailable(pairKey)
			) {
				availableMarketsArray.push(pairKey);
			}

			return pairKey;
		});

		return availableMarketsArray;
	};

	const goToTrade = (pair) => {
		const flippedPair = getFlippedPair(pair);
		const isQuickTrade = !!quicktrade.filter(
			({ symbol, active, type }) =>
				!!active &&
				type !== 'pro' &&
				(symbol === pair || symbol === flippedPair)
		).length;
		if (pair && isQuickTrade) {
			return navigate(`/quick-trade/${pair}`);
		} else if (pair && !isQuickTrade) {
			return navigate(`/trade/${pair}`);
		}
	};

	const getFlippedPair = (pair) => {
		let flippedPair = pair.split('-');
		flippedPair.reverse().join('-');
		return flippedPair;
	};

	const getAllAvailableMarkets = (key) => {
		const quickTrade = quicktrade
			.filter(({ symbol = '', active }) => {
				const [base, to] = symbol.split('-');
				return active && (base === key || to === key);
			})
			.map(({ symbol }) => symbol);

		const trade = [...findPair(key, 'pair_base'), ...findPair(key, 'pair_2')];

		return unique([...quickTrade, ...trade]);
	};

	return showDustSection ? (
		<DustSection goToWallet={goToWallet} />
	) : (
		<div>
			{isMobile ? (
				<div
					className={
						emptyDonut
							? 'wallet-assets_block'
							: 'wallet-assets_block empty-wallet-assets_block'
					}
				>
					<section className="ml-4 pt-4">
						{totalAssets.length && !loading ? (
							<EditWrapper
								stringId="WALLET_ESTIMATED_TOTAL_BALANCE"
								render={(children) => (
									<div className="wallet-search-improvement">
										{BASE_CURRENCY && (
											<div>
												<div>{STRINGS['WALLET_ESTIMATED_TOTAL_BALANCE']}</div>
												<div className="font-title">{totalAssets}</div>
											</div>
										)}
									</div>
								)}
							>
								{STRINGS['WALLET_ESTIMATED_TOTAL_BALANCE']}
							</EditWrapper>
						) : (
							<div>
								<div className="mb-2">{STRINGS['WALLET_BALANCE_LOADING']}</div>
								<div className="loading-anime" />
							</div>
						)}
						<div className="d-flex justify-content-between zero-balance-wrapper">
							<EditWrapper stringId="WALLET_ASSETS_SEARCH_TXT">
								<SearchBox
									name="search-assets"
									placeHolder={`${STRINGS['WALLET_ASSETS_SEARCH_TXT']}...`}
									handleSearch={handleSearch}
									showCross
								/>
							</EditWrapper>
							<div className="d-flex">
								<div className="d-flex px-4 align-items-center">
									<EditWrapper stringId="DUST.TOOLTIP,DUST.LINK">
										<Help tip={STRINGS['DUST.TOOLTIP']}>
											<div
												className="text-underline pointer blue-link"
												onClick={goToDustSection}
											>
												{STRINGS['DUST.LINK']}
											</div>
										</Help>
									</EditWrapper>
								</div>
								<div className="d-flex align-items-center">
									<span>
										<EditWrapper stringId="WALLET_HIDE_ZERO_BALANCE">
											{STRINGS['WALLET_HIDE_ZERO_BALANCE']}
										</EditWrapper>
									</span>
									<Switch
										checked={isZeroBalanceHidden}
										onClick={onToggle}
										className="mx-2"
										checkedChildren={STRINGS[
											'DEFAULT_TOGGLE_OPTIONS.ON'
										].toUpperCase()}
										unCheckedChildren={STRINGS[
											'DEFAULT_TOGGLE_OPTIONS.OFF'
										].toUpperCase()}
									/>
								</div>
							</div>
						</div>
					</section>
				</div>
			) : (
				<section>
					<div
						className={
							emptyDonut
								? 'wallet-assets_block'
								: 'wallet-assets_block empty-wallet-assets_block'
						}
					>
						<div className="d-flex align-items-center justify-content-between">
							<div className="d-flex align-items-center">
								<div
									className={classnames(
										`${
											emptyDonut
												? 'donut-container'
												: 'donut-container donut-container-empty'
										}`,
										{
											'd-flex align-items-center justify-content-center loading-wrapper': !chartData.length,
										}
									)}
								>
									{chartData.length ? (
										<DonutChart
											coins={coins}
											chartData={chartData}
											showOpenWallet={false}
											centerText={true}
										/>
									) : (
										<div>
											<div className="rounded-loading">
												<div className="inner-round" />
											</div>
										</div>
									)}
								</div>
								{totalAssets.length && !loading ? (
									<div className="mb-3">
										<EditWrapper
											stringId="WALLET_ESTIMATED_TOTAL_BALANCE"
											render={(children) => (
												<div className="wallet-search-improvement">
													{BASE_CURRENCY && (
														<div>
															<div>
																{STRINGS['WALLET_ESTIMATED_TOTAL_BALANCE']}
															</div>
															<div className="header-title plButton">
																{totalAssets}
															</div>
														</div>
													)}
													{!isUpgrade && balance_history_config?.active && (
														<div
															className={
																Number(userPL?.['7d']?.total || 0) === 0
																	? 'profitNeutral'
																	: (userPL?.['7d']?.total || 0) > 0
																	? 'profitPositive'
																	: 'profitNegative'
															}
														>
															<EditWrapper stringId="PROFIT_LOSS.PL_7_DAY">
																{STRINGS['PROFIT_LOSS.PL_7_DAY']}
															</EditWrapper>{' '}
															{Number(userPL?.['7d']?.total || 0) > 0
																? '+'
																: ''}{' '}
															{getSourceDecimals(
																balance_history_config?.currency || 'usdt',
																userPL?.['7d']?.total
															) || '0'}{' '}
															{balance_history_config?.currency?.toUpperCase() ||
																'USDT'}
														</div>
													)}
												</div>
											)}
										>
											{STRINGS['WALLET_ESTIMATED_TOTAL_BALANCE']}
										</EditWrapper>
										<div className="d-flex align-items-center mt-2">
											<EditWrapper stringId="DUST.TOOLTIP,DUST.LINK">
												<Help tip={STRINGS['DUST.TOOLTIP']}>
													<div
														className="text-underline pointer blue-link"
														onClick={goToDustSection}
													>
														{STRINGS['DUST.LINK']}
													</div>
												</Help>
											</EditWrapper>
										</div>
									</div>
								) : (
									<div>
										<div className="mb-2">
											{STRINGS['WALLET_BALANCE_LOADING']}
										</div>
										<div className="loading-anime" />
									</div>
								)}
							</div>
							{!isUpgrade &&
							balance_history_config?.active &&
							historyData.length > 1 ? (
								<div>
									<div
										style={{
											marginTop: 10,
											display: 'flex',
											justifyContent: 'flex-end',
										}}
									>
										<EditWrapper stringId="PROFIT_LOSS.PERFORMANCE_TREND">
											{STRINGS['PROFIT_LOSS.PERFORMANCE_TREND']}
										</EditWrapper>
									</div>
									<div style={{ width: '21rem', opacity: 0, fontSize: 1 }}>
										{STRINGS['PROFIT_LOSS.WALLET_PERFORMANCE_TITLE']}
									</div>

									<div
										onClick={() => handleBalanceHistory(true)}
										style={{ zoom: 0.3, cursor: 'pointer' }}
										className="highChartColor highChartColorOverview"
									>
										{' '}
										<HighchartsReact
											highcharts={Highcharts}
											options={options}
										/>{' '}
									</div>
								</div>
							) : (
								(isUpgrade || !balance_history_config?.active) && (
									<Image
										icon={ICONS['WALLET_GRAPHIC']}
										wrapperClassName="wallet-graphic-icon"
									/>
								)
							)}
						</div>
					</div>

					<div
						className="d-flex justify-content-between pl-3 pr-3 wallet-assets_block"
						style={{ marginTop: '2rem' }}
					>
						<div>
							<EditWrapper stringId="WALLET_ASSETS_SEARCH_TXT">
								<SearchBox
									name="search-assets"
									placeHolder={`${STRINGS['WALLET_ASSETS_SEARCH_TXT']}...`}
									handleSearch={handleSearch}
									showCross
								/>
							</EditWrapper>
						</div>
						<div className="d-flex justify-content-between zero-balance-wrapper row-reverse">
							<div className="d-flex">
								<div className="d-flex align-items-center mt-4">
									<span>
										<EditWrapper stringId="WALLET_HIDE_ZERO_BALANCE">
											{STRINGS['WALLET_HIDE_ZERO_BALANCE']}
										</EditWrapper>
									</span>
									<Switch
										checked={isZeroBalanceHidden}
										onClick={onToggle}
										className="mx-2"
										checkedChildren={STRINGS[
											'DEFAULT_TOGGLE_OPTIONS.ON'
										].toUpperCase()}
										unCheckedChildren={STRINGS[
											'DEFAULT_TOGGLE_OPTIONS.OFF'
										].toUpperCase()}
									/>
								</div>
							</div>
						</div>
					</div>
				</section>
			)}

			<div className="d-flex justify-content-end">
				<EditWrapper configId="WALLET_LIST_CONFIGS" position={[0, 0]} />
			</div>
			<div
				className={
					emptyDonut
						? 'wallet-assets_block'
						: 'wallet-assets_block empty-wallet-assets_block'
				}
			>
				<table className="wallet-assets_block-table">
					<thead>
						<tr className="table-bottom-border">
							<th />
							<th>
								<EditWrapper stringId="CURRENCY">
									{STRINGS['CURRENCY']}
								</EditWrapper>
							</th>
							<th>
								<div onClick={handleClickAmount} className="d-flex pointer">
									<EditWrapper stringId="AMOUNT">
										{STRINGS['AMOUNT']}
									</EditWrapper>
									{renderCaret(WALLET_SORT.AMOUNT)}
								</div>
							</th>
							<th className="td-amount" />
							<th>
								<EditWrapper stringId="DEPOSIT_WITHDRAW,WALLET_BUTTON_BASE_DEPOSIT,WALLET_BUTTON_BASE_WITHDRAW,GENERATE_WALLET">
									{STRINGS['DEPOSIT_WITHDRAW']}
								</EditWrapper>
							</th>
							{!isMobile && (
								<th>
									<EditWrapper stringId="TRADE_TAB_TRADE">
										{STRINGS['TRADE_TAB_TRADE']}
									</EditWrapper>
								</th>
							)}
							{/* {hasEarn && (
							<th>
								<EditWrapper stringId="STAKE.EARN">
									{STRINGS['STAKE.EARN']}
								</EditWrapper>
							</th>
						)} */}
						</tr>
					</thead>
					<tbody>
						{assets.map(
							(
								[
									key,
									{
										increment_unit,
										allow_deposit,
										allow_withdrawal,
										oraclePrice,
										balance,
										fullname,
										symbol = '',
										display_name,
										icon_id,
									} = DEFAULT_COIN_DATA,
								],
								index
							) => {
								const markets = getAllAvailableMarkets(key);
								const baseCoin = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
								const balanceText =
									key === BASE_CURRENCY
										? formatCurrencyByIncrementalUnit(balance, increment_unit)
										: formatCurrencyByIncrementalUnit(
												calculateOraclePrice(balance, oraclePrice),
												baseCoin.increment_unit
										  );
								return (
									<tr className="table-row table-bottom-border" key={key}>
										<td className="table-icon td-fit" />
										<td className="td-name td-fit">
											{assets && !loading ? (
												<div className="d-flex align-items-center wallet-hover cursor-pointer">
													<Link to={`/wallet/${key.toLowerCase()}`}>
														<Coin iconId={icon_id} />
													</Link>
													<Link to={`/wallet/${key.toLowerCase()}`}>
														<div className="px-2">
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
											{assets && baseCoin && !loading && increment_unit ? (
												<div className="d-flex">
													<div className="mr-4">
														{STRINGS.formatString(
															CURRENCY_PRICE_FORMAT,
															formatCurrencyByIncrementalUnit(
																balance,
																increment_unit
															),
															display_name
														)}
													</div>
													{!isMobile &&
														key !== BASE_CURRENCY &&
														parseFloat(balanceText || 0) > 0 && (
															<div>
																{`(≈ ${baseCoin.display_name} ${balanceText})`}
															</div>
														)}
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
										<th className="td-amount" />
										<td className="td-wallet">
											<div className="d-flex justify-content-between deposit-withdrawal-wrapper">
												<ActionNotification
													stringId="WALLET_BUTTON_BASE_DEPOSIT"
													text={STRINGS['WALLET_BUTTON_BASE_DEPOSIT']}
													iconId="BLUE_PLUS"
													iconPath={ICONS['BLUE_DEPOSIT_ICON']}
													onClick={() => navigate(`wallet/${key}/deposit`)}
													className="csv-action action-button-wrapper"
													showActionText={isMobile}
													disable={!allow_deposit}
												/>
												<ActionNotification
													stringId="WALLET_BUTTON_BASE_WITHDRAW"
													text={STRINGS['WALLET_BUTTON_BASE_WITHDRAW']}
													iconId="BLUE_PLUS"
													iconPath={ICONS['BLUE_WITHROW_ICON']}
													onClick={() => navigate(`wallet/${key}/withdraw`)}
													className="csv-action action-button-wrapper"
													showActionText={isMobile}
													disable={!allow_withdrawal}
												/>
											</div>
										</td>
										{!isMobile && (
											<td>
												{markets.length > 1 ? (
													<TradeInputGroup
														quicktrade={quicktrade}
														markets={markets}
														goToTrade={goToTrade}
														pairs={pairs}
													/>
												) : (
													<ActionNotification
														stringId="TRADE_TAB_TRADE"
														text={STRINGS['TRADE_TAB_TRADE']}
														iconId="BLUE_TRADE_ICON"
														iconPath={ICONS['BLUE_TRADE_ICON']}
														onClick={() => goToTrade(markets[0])}
														className="csv-action"
														showActionText={isMobile}
														disable={markets.length === 0}
													/>
												)}
											</td>
										)}
										{/* {hasEarn && (
										<td>
											<ActionNotification
												stringId="STAKE.EARN"
												text={STRINGS['STAKE.EARN']}
												iconId="BLUE_EARN_ICON"
												iconPath={ICONS['BLUE_EARN_ICON']}
												onClick={() => navigate('/stake')}
												className="csv-action"
												showActionText={isMobile}
												disable={!isStakingAvailable(symbol, contracts)}
											/>
										</td>
									)} */}
									</tr>
								);
							}
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

const mapStateToProps = ({
	app: {
		wallet_sort: { mode, is_descending },
		quicktrade,
		constants: { balance_history_config, info },
	},
	asset: { chartData },
}) => ({
	mode,
	is_descending,
	quicktrade,
	chartData,
	balance_history_config,
	info,
});

const mapDispatchToProps = (dispatch) => ({
	toggleSort: bindActionCreators(toggleWalletSort, dispatch),
	setSortModeAmount: bindActionCreators(setSortModeAmount, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(AssetsBlock));
