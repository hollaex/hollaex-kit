import React, { Component } from 'react';
import { connect } from 'react-redux';
// import classnames from 'classnames';
import { isMobile } from 'react-device-detect';
import {
	Button,
	//  DonutChart,
	EditWrapper,
} from 'components';
import { calculatePrice } from 'utils/currency';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';
import Currency from './Currency';
import Arrow from './Arrow';
import STRINGS from 'config/localizedStrings';
import _toLower from 'lodash/toLower';
import { fetchBalanceHistory, fetchPlHistory } from '../actions';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { withRouter } from 'react-router';
import moment from 'moment';
import BigNumber from 'bignumber.js';

class CurrencySlider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentCurrency: '',
			historyData: [],
			graphData: [],
			userPL: null,
		};
	}

	UNSAFE_componentWillMount() {
		const currency = Object.keys(this.props.coins)[0];
		const currencyIndex = this.findCurrentCurrencyIndex(currency);
		this.setcurrentCurrency(currency);
		this.setcurrentCurrencyIndex(currencyIndex);
	}

	componentDidMount() {
		if (isMobile) {
			fetchPlHistory()
				.then((res) => {
					this.setState({ userPL: res });
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

					this.setState({
						graphData: newGraphData,
						historyData: response.data || [],
					});
				})
				.catch((error) => {
					return error;
				});
		}
	}

	setcurrentCurrency = (currency) => {
		this.setState({ currentCurrency: currency });
	};

	setcurrentCurrencyIndex = (currentCurrencyIndex) => {
		this.setState({ currentCurrencyIndex });
	};

	nextCurrency = () => {
		const { currentCurrency } = this.state;
		const currencyArray = Object.keys(this.props.coins);
		const currenciesLength = currencyArray.length;
		const currencyIndex = this.findCurrentCurrencyIndex(currentCurrency);
		const currentCurrencyIndex =
			currencyIndex >= currenciesLength - 1 ? 0 : currencyIndex + 1;

		this.setState({
			currentCurrency: currencyArray[currentCurrencyIndex],
		});
	};

	previousCurrency = () => {
		const { currentCurrency } = this.state;
		const currencyArray = Object.keys(this.props.coins);
		const currencyIndex = this.findCurrentCurrencyIndex(currentCurrency);
		const currentCurrencyIndex =
			currencyIndex <= 0 ? currencyArray.length - 1 : currencyIndex - 1;
		this.setState({
			currentCurrency: currencyArray[currentCurrencyIndex],
		});
	};

	findCurrentCurrencyIndex = (currentCurrency) =>
		Object.keys(this.props.coins).findIndex(
			(currency) => currency === currentCurrency
		);

	render() {
		const {
			balance,
			prices,
			navigate,
			coins,
			searchResult,
			// chartData,
		} = this.props;
		const { currentCurrency } = this.state;
		const balanceValue = balance[`${currentCurrency}_balance`];
		const baseBalance =
			currentCurrency !== BASE_CURRENCY &&
			calculatePrice(balanceValue, prices[currentCurrency]);
		const { fullname, allow_deposit, allow_withdrawal } =
			coins[currentCurrency] || DEFAULT_COIN_DATA;

		const getSourceDecimals = (symbol, value) => {
			const incrementUnit = coins[symbol].increment_unit;
			const decimalPoint = new BigNumber(incrementUnit).dp();
			const sourceAmount = new BigNumber(value || 0)
				.decimalPlaces(decimalPoint)
				.toNumber();

			return sourceAmount;
		};

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
		const isUpgrade = handleUpgrade(this.props.info);

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
					let min = this.state.graphData?.[0]?.[1];

					this.state.graphData.forEach((graph) => {
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
					data: this.state.graphData,
					color: '#FFFF00',
				},
			],
		};

		return (
			<div className="d-flex flex-column justify-content-end currency-list-container f-1">
				{isMobile && (
					<div>
						{/* <div
							className={classnames('donut-container mb-4', {
								'd-flex align-items-center justify-content-center loading-wrapper': !chartData.length,
							})}
						>
							{chartData.length ? (
								<DonutChart
									coins={coins}
									chartData={chartData}
									showOpenWallet={false}
									currentCurrency={currentCurrency}
								/>
							) : (
								<div>
									<div className="rounded-loading">
										<div className="inner-round" />
									</div>
								</div>
							)}
						</div> */}
						<div>
							{!isUpgrade &&
								this.props.balance_history_config?.active &&
								this.state.historyData.length > 1 && (
									<div>
										<div
											style={{
												marginTop: 10,
												display: 'flex',
												justifyContent: 'center',
												fontSize: '1.5rem',
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
											onClick={() => {
												this.props.handleBalanceHistory(true);
											}}
											style={{ zoom: 0.3, cursor: 'pointer' }}
											className="highChartColor highChartColorOverview"
										>
											{' '}
											<HighchartsReact
												highcharts={Highcharts}
												options={options}
											/>{' '}
										</div>

										<div
											className={
												Number(this.state.userPL?.['7d']?.total || 0) === 0
													? 'profitNeutral'
													: (this.state.userPL?.['7d']?.total || 0) > 0
													? 'profitPositive'
													: 'profitNegative'
											}
											style={{
												marginTop: 10,
												display: 'flex',
												justifyContent: 'center',
												fontSize: '1.5rem',
											}}
										>
											<EditWrapper stringId="PROFIT_LOSS.PL_7_DAY">
												{STRINGS['PROFIT_LOSS.PL_7_DAY']}
											</EditWrapper>{' '}
											{Number(this.state.userPL?.['7d']?.total || 0) > 0
												? '+'
												: ' '}
											{''}
											{getSourceDecimals(
												this.props.balance_history_config?.currency || 'usdt',
												this.state.userPL?.['7d']?.total
													?.toString()
													.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
											) || '0'}
											{this.state.userPL?.['7d']?.totalPercentage
												? ` (${this.state.userPL?.['7d']?.totalPercentage}) `
												: ' '}
											{this.props.balance_history_config?.currency?.toUpperCase() ||
												'USDT'}
										</div>
									</div>
								)}
						</div>
					</div>
				)}

				<div className="d-flex mb-5 flex-row">
					<div className="d-flex align-items-center arrow-container">
						<Arrow className="left" onClick={() => this.previousCurrency()} />
					</div>
					{
						<Currency
							currency={currentCurrency}
							balance={balance}
							balanceValue={balanceValue}
							balanceText={baseBalance}
							coins={coins}
							searchResult={searchResult}
						/>
					}
					<div className="d-flex align-items-center arrow-container">
						<Arrow className="right" onClick={() => this.nextCurrency()} />
					</div>
				</div>

				{!isMobile && (
					<div className="mb-4 button-container">
						<div className="d-flex justify-content-between flew-row ">
							{allow_deposit && (
								<Button
									className="mr-4"
									label={STRINGS.formatString(
										STRINGS['RECEIVE_CURRENCY'],
										fullname
									).join('')}
									onClick={() => navigate(`wallet/${currentCurrency}/deposit`)}
								/>
							)}
							{allow_withdrawal && (
								<Button
									label={STRINGS.formatString(
										STRINGS['SEND_CURRENCY'],
										fullname
									).join('')}
									onClick={() => navigate(`wallet/${currentCurrency}/withdraw`)}
								/>
							)}
						</div>
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = ({
	app: {
		constants: { balance_history_config, info },
	},
	asset: { chartData },
}) => ({
	chartData,
	balance_history_config,
	info,
});

export default connect(mapStateToProps)(withRouter(CurrencySlider));
