import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import { browserHistory } from 'react-router';
import math from 'mathjs';
import { QuickTradeLimitsSelector } from './utils';

import { submitOrder } from 'actions/orderAction';
import STRINGS from 'config/localizedStrings';

import { QuickTrade, Dialog, Loader, MobileBarBack, Button } from 'components';
import ReviewBlock from 'components/QuickTrade/ReviewBlock';
import { changeSymbol } from 'actions/orderbookAction';
import { formatNumber, formatPercentage } from 'utils/currency';
import { isLoggedIn } from 'utils/token';
import { unique } from 'utils/data';
import { getDecimals } from 'utils/utils';
import { changePair, setNotification } from 'actions/appActions';

import QuoteResult from './QuoteResult';
// import { getSparklines } from 'actions/chartAction';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';

// const DECIMALS = 4;

class QuickTradeContainer extends PureComponent {
	constructor(props) {
		super(props);
		const { routeParams, sourceOptions, tickers, pairs, router } = this.props;

		const pairKeys = Object.keys(pairs);
		const flippedPair = this.flipPair(routeParams.pair);

		let pair;
		let side;
		let tickerClose;
		let originalPair;
		if (pairKeys.includes(routeParams.pair)) {
			originalPair = routeParams.pair;
			pair = routeParams.pair;
			const { close } = tickers[pair] || {};
			side = 'buy';
			tickerClose = close;
		} else if (pairKeys.includes(flippedPair)) {
			originalPair = routeParams.pair;
			pair = flippedPair;
			const { close } = tickers[pair] || {};
			side = 'sell';
			tickerClose = 1 / close;
		} else if (pairKeys.length) {
			originalPair = pairKeys[0];
			pair = pairKeys[0];
			const { close } = tickers[pair] || {};
			side = 'buy';
			tickerClose = close;
		} else {
			router.push('/summary');
		}

		const [, selectedSource = sourceOptions[0]] = originalPair.split('-');
		const targetOptions = this.getTargetOptions(selectedSource);
		const [selectedTarget = targetOptions[0]] = originalPair.split('-');

		this.state = {
			pair,
			side,
			tickerClose,
			showQuickTradeModal: false,
			targetOptions,
			selectedSource,
			selectedTarget,
			targetAmount: undefined,
			sourceAmount: undefined,
			order: {
				fetching: false,
				error: false,
				data: {},
			},
			sourceError: '',
			targetError: '',
			data: [],
			page: 0,
			pageSize: 12,
			searchValue: '',
			isSelectChange: false
		};

		this.goToPair(pair);
	}

	getSearchPairs = (value) => {
		const { pairs, coins } = this.props;
		let result = {};
		let searchValue = value.toLowerCase().trim();
		Object.keys(pairs).map((key) => {
			let temp = pairs[key];
			const { fullname } = coins[temp.pair_base] || DEFAULT_COIN_DATA;
			let cashName = fullname ? fullname.toLowerCase() : '';
			if (
				key.indexOf(searchValue) !== -1 ||
				temp.pair_base.indexOf(searchValue) !== -1 ||
				temp.pair_2.indexOf(searchValue) !== -1 ||
				cashName.indexOf(searchValue) !== -1
			) {
				result[key] = temp;
			}
			return key;
		});
		return result;
	};

	handleMarket = (pairval, tickers, searchValue) => {
		const pairs = searchValue ? this.getSearchPairs(searchValue) : pairval;
		const pairKeys = Object.keys(pairs).sort((a, b) => {
			const { volume: volumeA = 0, close: closeA = 0 } = tickers[a] || {};
			const { volume: volumeB = 0, close: closeB = 0 } = tickers[b] || {};
			const marketCapA = math.multiply(volumeA, closeA);
			const marketCapB = math.multiply(volumeB, closeB);
			return marketCapB - marketCapA;
		});
		this.setState({ data: pairKeys });
	};

	UNSAFE_componentWillMount() {
		const { isReady, router, routeParams } = this.props;
		this.changePair(routeParams.pair);
		if (!isReady) {
			router.push('/summary');
		}
	}

	componentDidMount() {
		const { pairs, tickers } = this.props;
		if (
			this.props.constants &&
			this.props.constants.features &&
			!this.props.constants.features.quick_trade &&
			!this.props.fetchingAuth
		) {
			this.props.router.push('/account');
		}
		if (this.props.sourceOptions && this.props.sourceOptions.length) {
			this.constructTarget();
		}
		this.handleMarket(pairs, tickers, this.state.searchValue);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.routeParams.pair !== this.props.routeParams.pair) {
			this.changePair(nextProps.routeParams.pair);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			!prevProps.sourceOptions.length &&
			JSON.stringify(prevProps.sourceOptions) !==
				JSON.stringify(this.props.sourceOptions)
		) {
			this.constructTarget();
		}
		if (JSON.stringify(prevProps.routeParams.pair) !== JSON.stringify(this.props.routeParams.pair) && !this.state.isSelectChange) {
			const { routeParams, sourceOptions, tickers, pairs, router } = this.props;
			const pairKeys = Object.keys(pairs);
			const flippedPair = this.flipPair(routeParams.pair);

			let pair;
			let side;
			let tickerClose;
			let originalPair;
			if (pairKeys.includes(routeParams.pair)) {
				originalPair = routeParams.pair;
				pair = routeParams.pair;
				const { close } = tickers[pair] || {};
				side = 'buy';
				tickerClose = close;
			} else if (pairKeys.includes(flippedPair)) {
				originalPair = routeParams.pair;
				pair = flippedPair;
				const { close } = tickers[pair] || {};
				side = 'sell';
				tickerClose = 1 / close;
			} else if (pairKeys.length) {
				originalPair = pairKeys[0];
				pair = pairKeys[0];
				const { close } = tickers[pair] || {};
				side = 'buy';
				tickerClose = close;
			} else {
				router.push('/summary');
			}

			const [, selectedSource = sourceOptions[0]] = originalPair.split('-');
			const targetOptions = this.getTargetOptions(selectedSource);
			const [selectedTarget = targetOptions[0]] = originalPair.split('-');

			this.setState({
				pair,
				side,
				tickerClose,
				targetOptions,
				selectedSource,
				selectedTarget,
				targetAmount: undefined,
				sourceAmount: undefined,
			});
		} else if (this.state.isSelectChange) {
			this.setState({
				isSelectChange: false
			});
		}
	}

	changePair = (pair) => {
		this.setState({ pair });
		this.props.changePair(pair);
	};

	onOpenDialog = () => {
		this.setState({ showQuickTradeModal: true });
	};

	onCloseDialog = () => {
		this.setState({ showQuickTradeModal: false }, this.resetOrderData);
	};

	onReviewQuickTrade = () => {
		this.onOpenDialog();
	};

	onExecuteTrade = () => {
		const { side, targetAmount, pair, sourceAmount } = this.state;
		const { pairs } = this.props;
		const pairData = pairs[pair] || {};
		const { increment_size } = pairData;

		let size;
		let price;
		if (side === 'buy') {
			[size, price] = [targetAmount, sourceAmount];
		} else {
			[price, size] = [targetAmount, sourceAmount];
		}

		const orderData = {
			type: 'market',
			side,
			size: formatNumber(size, getDecimals(increment_size)),
			symbol: pair,
		};

		this.setState({
			order: {
				completed: false,
				fetching: true,
				error: false,
				data: orderData,
			},
		});

		submitOrder(orderData)
			.then(({ data }) => {
				this.setState({
					order: {
						completed: true,
						fetching: false,
						error: false,
						data: {
							...data,
							price,
						},
					},
				});
			})
			.catch((err) => {
				const _error =
					err.response && err.response.data
						? err.response.data.message
						: err.message;

				this.setState({
					order: {
						completed: true,
						fetching: false,
						error: _error,
						data: orderData,
					},
				});
			});
	};

	onGoBack = () => {
		this.props.router.push(`/trade/${this.state.pair}`);
	};

	flipPair = (pair) => {
		const pairArray = pair.split('-');
		return pairArray.reverse().join('-');
	};

	onSelectTarget = (selectedTarget) => {
		const { tickers, pairs } = this.props;
		const { selectedSource } = this.state;

		const pairName = `${selectedTarget}-${selectedSource}`;
		const reversePairName = `${selectedSource}-${selectedTarget}`;

		let tickerClose;
		let side;
		let pair;
		if (pairs[pairName]) {
			const { close } = tickers[pairName];
			tickerClose = close;
			side = 'buy';
			pair = pairName;
		} else if (pairs[reversePairName]) {
			const { close } = tickers[reversePairName];
			tickerClose = 1 / close;
			side = 'sell';
			pair = reversePairName;
		}

		this.setState({
			tickerClose,
			side,
			selectedTarget,
			targetAmount: undefined,
			sourceAmount: undefined,
			isSelectChange: true
		});
		if (pair) {
			this.goToPair(pair);
		}
	};

	onSelectSource = (selectedSource) => {
		const { tickers, pairs } = this.props;
		const targetOptions = this.getTargetOptions(selectedSource);
		const selectedTarget = targetOptions[0];
		const pairName = `${selectedTarget}-${selectedSource}`;
		const reversePairName = `${selectedSource}-${selectedTarget}`;

		let tickerClose;
		let side;
		let pair;
		if (pairs[pairName]) {
			const { close } = tickers[pairName];
			tickerClose = close;
			side = 'buy';
			pair = pairName;
		} else if (pairs[reversePairName]) {
			const { close } = tickers[reversePairName];
			tickerClose = 1 / close;
			side = 'sell';
			pair = reversePairName;
		}

		this.setState({
			tickerClose,
			side,
			// pair,
			selectedSource,
			selectedTarget,
			targetOptions: targetOptions,
			targetAmount: undefined,
			sourceAmount: undefined,
			isSelectChange: true
		});
		if (pair) {
			this.goToPair(pair);
		}
	};

	constructTarget = () => {
		const { sourceOptions, routeParams, pairs, router, tickers } = this.props;

		const pairKeys = Object.keys(pairs);
		const flippedPair = this.flipPair(routeParams.pair);

		let pair;
		let side;
		let tickerClose;
		let originalPair;
		if (pairKeys.includes(routeParams.pair)) {
			originalPair = routeParams.pair;
			pair = routeParams.pair;
			const { close } = tickers[pair] || {};
			side = 'buy';
			tickerClose = close;
		} else if (pairKeys.includes(flippedPair)) {
			originalPair = routeParams.pair;
			pair = flippedPair;
			const { close } = tickers[pair] || {};
			side = 'sell';
			tickerClose = 1 / close;
		} else if (pairKeys.length) {
			originalPair = pairKeys[0];
			pair = pairKeys[0];
			const { close } = tickers[pair] || {};
			side = 'buy';
			tickerClose = close;
		} else {
			router.push('/summary');
		}

		const [, selectedSource = sourceOptions[0]] = originalPair.split('-');
		const targetOptions = this.getTargetOptions(selectedSource);
		const [selectedTarget = targetOptions[0]] = originalPair.split('-');
		this.setState({
			selectedTarget,
			targetOptions,
			side,
			tickerClose,
		});

		this.goToPair(pair);
	};

	getTargetOptions = (sourceKey) => {
		const { sourceOptions, pairs } = this.props;

		return sourceOptions.filter(
			(key) => pairs[`${key}-${sourceKey}`] || pairs[`${sourceKey}-${key}`]
		);
	};

	onChangeTargetAmount = (targetAmount) => {
		const { tickerClose } = this.state;
		const { pairData = {} } = this.props;
		const decimalPoint = getDecimals(pairData.increment_size);
		const sourceAmount = math.round(targetAmount * tickerClose, decimalPoint);

		this.setState({
			targetAmount,
			sourceAmount,
		});
	};

	onChangeSourceAmount = (sourceAmount) => {
		const { tickerClose } = this.state;
		const { pairData = {} } = this.props;
		const decimalPoint = getDecimals(pairData.increment_size);
		const targetAmount = math.round(sourceAmount / tickerClose, decimalPoint);

		this.setState({
			sourceAmount,
			targetAmount,
		});
	};

	isReviewDisabled = () => {
		const {
			targetAmount,
			sourceAmount,
			selectedTarget,
			selectedSource,
			sourceError,
			targetError,
		} = this.state;
		return (
			!isLoggedIn() ||
			!selectedTarget ||
			!selectedSource ||
			!targetAmount ||
			!sourceAmount ||
			sourceError ||
			targetError
		);
	};

	goToPair = (pair) => {
		browserHistory.push(`/quick-trade/${pair}`);
	};

	resetOrderData = () => {
		this.setState({
			order: {
				fetching: false,
				error: false,
				data: {},
			},
		});
	};

	goToWallet = () => {
		this.props.router.push('/wallet');
	};

	forwardSourceError = (sourceError) => {
		this.setState({ sourceError });
	};

	forwardTargetError = (targetError) => {
		this.setState({ targetError });
	};

	render() {
		const {
			pairData = {},
			activeTheme,
			orderLimits,
			pairs,
			coins,
			sourceOptions,
			tickers,
			user,
			router,
			constants
		} = this.props;
		const {
			order,
			targetAmount,
			sourceAmount,
			selectedTarget,
			selectedSource,
			showQuickTradeModal,
			pair,
			targetOptions,
			side,
			data,
		} = this.state;

		let market = data.map((key) => {
			let pair = pairs[key] || {};
			let { fullname, symbol = '' } =
				coins[pair.pair_base || BASE_CURRENCY] || DEFAULT_COIN_DATA;
			const pairTwo = coins[pair.pair_2] || DEFAULT_COIN_DATA;
			const { increment_price, increment_size } = pair;
			let ticker = tickers[key] || {};
			const priceDifference =
				ticker.open === 0 ? 0 : (ticker.close || 0) - (ticker.open || 0);
			const tickerPercent =
				priceDifference === 0 || ticker.open === 0
					? 0
					: (priceDifference / ticker.open) * 100;
			const priceDifferencePercent = isNaN(tickerPercent)
				? formatPercentage(0)
				: formatPercentage(tickerPercent);
			return {
				key,
				pair,
				symbol,
				pairTwo,
				fullname,
				ticker,
				increment_price,
				increment_size,
				priceDifference,
				priceDifferencePercent,
			};
		});

		let marketData;
		market.forEach((data) => {
			const keyData = data.key.split('-');
			if (
				(keyData[0] === selectedSource && keyData[1] === selectedTarget) ||
				(keyData[1] === selectedSource && keyData[0] === selectedTarget)
			) {
				marketData = data;
			}
		});
		const decimalPoint = getDecimals(pairData.increment_size);

		if (!pair || pair !== this.props.pair || !pairData) {
			return <Loader background={false} />;
		}

		return (
			<div className="h-100">
				{isMobile && <MobileBarBack onBackClick={this.onGoBack} />}

				<div
					className={classnames(
						'd-flex',
						'f-1',
						'quote-container',
						'h-100',
						'justify-content-center',
						{
							'flex-column': isMobile,
						}
					)}
				>
					<QuickTrade
						onReviewQuickTrade={this.onReviewQuickTrade}
						onSelectTarget={this.onSelectTarget}
						onSelectSource={this.onSelectSource}
						side={side}
						symbol={pair}
						disabled={this.isReviewDisabled()}
						orderLimits={orderLimits[pair] || {}}
						pairs={pairs}
						coins={coins}
						market={marketData}
						user={user}
						sourceOptions={sourceOptions}
						targetOptions={targetOptions}
						selectedSource={selectedSource}
						selectedTarget={selectedTarget}
						targetAmount={targetAmount}
						sourceAmount={sourceAmount}
						router={router}
						onChangeTargetAmount={this.onChangeTargetAmount}
						onChangeSourceAmount={this.onChangeSourceAmount}
						forwardSourceError={this.forwardSourceError}
						forwardTargetError={this.forwardTargetError}
						constants={constants}
					/>
					<Dialog
						isOpen={showQuickTradeModal}
						label="quick-trade-modal"
						onCloseDialog={this.onCloseDialog}
						shouldCloseOnOverlayClick={false}
						showCloseText={false}
						theme={activeTheme}
						style={{ 'z-index': 100 }}
					>
						{showQuickTradeModal ? (
							!order.fetching && !order.completed ? (
								<div className="quote-review-wrapper">
									<div>
										<ReviewBlock
											symbol={selectedSource}
											text={STRINGS['SPEND_AMOUNT']}
											amount={sourceAmount}
											decimalPoint={decimalPoint}
										/>
										<ReviewBlock
											symbol={selectedTarget}
											text={STRINGS['ESTIMATE_RECEIVE_AMOUNT']}
											amount={targetAmount}
											decimalPoint={decimalPoint}
										/>
										<footer className="d-flex pt-4">
											<Button
												label={STRINGS['CLOSE_TEXT']}
												onClick={this.onCloseDialog}
												className="mr-2"
											/>
											<Button
												label={STRINGS['CONFIRM_TEXT']}
												onClick={this.onExecuteTrade}
												className="ml-2"
											/>
										</footer>
									</div>
								</div>
							) : (
								<QuoteResult
									pairData={pairData}
									data={order}
									onClose={this.onCloseDialog}
									onConfirm={this.goToWallet}
								/>
							)
						) : (
							<div />
						)}
					</Dialog>
				</div>
			</div>
		);
	}
}

const getSourceOptions = (pairs = {}) => {
	const coins = [];
	Object.entries(pairs).forEach(([, { pair_base, pair_2 }]) => {
		coins.push(pair_base);
		coins.push(pair_2);
	});

	return unique(coins);
};

const mapStateToProps = (store) => {
	const pair = store.app.pair;
	const pairData = store.app.pairs[pair] || {};
	const sourceOptions = getSourceOptions(store.app.pairs);
	const qtlimits = QuickTradeLimitsSelector(store);

	return {
		sourceOptions,
		pair,
		pairData,
		pairs: store.app.pairs,
		coins: store.app.coins,
		tickers: store.app.tickers,
		activeTheme: store.app.theme,
		activeLanguage: store.app.language,
		orderLimits: qtlimits,
		user: store.user,
		settings: store.user.settings,
		constants: store.app.constants,
		fetchingAuth: store.auth.fetching,
		isReady: store.app.isReady,
	};
};

const mapDispatchToProps = (dispatch) => ({
	changePair: bindActionCreators(changePair, dispatch),
	changeSymbol: bindActionCreators(changeSymbol, dispatch),
	setNotification: bindActionCreators(setNotification, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(QuickTradeContainer);
