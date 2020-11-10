import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import { browserHistory } from 'react-router';
import math from 'mathjs';

import { submitOrder } from 'actions/orderAction';
import STRINGS from 'config/localizedStrings';

import { QuickTrade, Dialog, Loader, MobileBarBack, Button } from 'components';
import ReviewBlock from 'components/QuickTrade/ReviewBlock';
import { changeSymbol } from 'actions/orderbookAction';
import {
	formatNumber,
	calculateBalancePrice,
	// formatToCurrency
} from 'utils/currency';
import { isLoggedIn } from 'utils/token';
import { unique } from 'utils/data';
import { getDecimals } from 'utils/utils';
import {
	changePair,
	setNotification,
	// RISKY_ORDER
} from 'actions/appActions';

import QuoteResult from './QuoteResult';

const DECIMALS = 4;

class QuickTradeContainer extends PureComponent {
	constructor(props) {
		super(props);
		const {
			routeParams: { pair },
			sourceOptions,
			tickers,
		} = this.props;
		const [, selectedSource = sourceOptions[0]] = pair.split('-');
		const targetOptions = this.getTargetOptions(selectedSource);
		const [selectedTarget = targetOptions[0]] = pair.split('-');
		const { close: tickerClose } = tickers[pair];

		this.state = {
			pair,
			side: 'buy',
			tickerClose,
			showQuickTradeModal: false,
			totalAssets: '',
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
		};
	}

	UNSAFE_componentWillMount() {
		this.changePair(this.props.routeParams.pair);
	}

	componentDidMount() {
		if (this.props.user.id) {
			this.calculateSections(this.props);
		}
		if (
			this.props.constants &&
			!this.props.constants.broker_enabled &&
			!this.props.fetchingAuth
		) {
			this.props.router.push('/account');
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.routeParams.pair !== this.props.routeParams.pair) {
			this.changePair(nextProps.routeParams.pair);
		}
		if (
			JSON.stringify(this.props.prices) !== JSON.stringify(nextProps.prices) ||
			JSON.stringify(this.props.balance) !==
				JSON.stringify(nextProps.balance) ||
			JSON.stringify(this.props.coins) !== JSON.stringify(nextProps.coins)
		) {
			this.calculateSections(nextProps);
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

	calculateSections = ({ balance, prices, coins }) => {
		const totalAssets = calculateBalancePrice(balance, prices, coins);
		this.setState({ totalAssets });
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

	onSelectTarget = (selectedTarget) => {
		const { tickers } = this.props;
		const { selectedSource } = this.state;

		const pairName = `${selectedTarget}-${selectedSource}`;
		const reversePairName = `${selectedSource}-${selectedTarget}`;

		let tickerClose;
		let side;
		let pair;
		if (tickers[pairName]) {
			const { close } = tickers[pairName];
			tickerClose = close;
			side = 'buy';
			pair = pairName;
		} else if (tickers[reversePairName]) {
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
		});
		this.goToPair(pair);
	};

	onSelectSource = (selectedSource) => {
		const { tickers } = this.props;

		const targetOptions = this.getTargetOptions(selectedSource);
		const selectedTarget = targetOptions[0];
		const pairName = `${selectedTarget}-${selectedSource}`;
		const reversePairName = `${selectedSource}-${selectedTarget}`;

		let tickerClose;
		let side;
		let pair;
		if (tickers[pairName]) {
			const { close } = tickers[pairName];
			tickerClose = close;
			side = 'buy';
			pair = pairName;
		} else if (tickers[reversePairName]) {
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
		const sourceAmount = math.round(targetAmount * tickerClose, DECIMALS);

		this.setState({
			targetAmount,
			sourceAmount,
		});
	};

	onChangeSourceAmount = (sourceAmount) => {
		const { tickerClose } = this.state;
		const targetAmount = math.round(sourceAmount / tickerClose, DECIMALS);

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
		} = this.state;

		if (!pair || pair !== this.props.pair || !pairData) {
			return <Loader background={false} />;
		}

		return (
			<div className="h-100">
				{isMobile && <MobileBarBack onBackClick={this.onGoBack} />}

				<div
					className={classnames('d-flex', 'f-1', 'quote-container', 'h-100', {
						'flex-column': isMobile,
					})}
				>
					<QuickTrade
						onReviewQuickTrade={this.onReviewQuickTrade}
						onSelectTarget={this.onSelectTarget}
						onSelectSource={this.onSelectSource}
						side={side}
						symbol={pair}
						theme={activeTheme}
						disabled={this.isReviewDisabled()}
						orderLimits={orderLimits[pair]}
						pairs={pairs}
						coins={coins}
						sourceOptions={sourceOptions}
						targetOptions={targetOptions}
						selectedSource={selectedSource}
						selectedTarget={selectedTarget}
						targetAmount={targetAmount}
						sourceAmount={sourceAmount}
						onChangeTargetAmount={this.onChangeTargetAmount}
						onChangeSourceAmount={this.onChangeSourceAmount}
						forwardSourceError={this.forwardSourceError}
						forwardTargetError={this.forwardTargetError}
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
											text={'Spend Amount'}
											amount={sourceAmount}
										/>
										<ReviewBlock
											symbol={selectedTarget}
											text={'Estimated Recieving Amount'}
											amount={targetAmount}
										/>
										<footer className="d-flex pt-4">
											<Button
												label={STRINGS['CLOSE_TEXT']}
												onClick={this.onCloseDialog}
												className="mr-2"
											/>
											<Button
												label={'Confirm'}
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

	return {
		sourceOptions,
		pair,
		pairData,
		pairs: store.app.pairs,
		coins: store.app.coins,
		tickers: store.app.tickers,
		activeTheme: store.app.theme,
		activeLanguage: store.app.language,
		orderLimits: store.app.orderLimits,
		prices: store.orderbook.prices,
		balance: store.user.balance,
		user: store.user,
		settings: store.user.settings,
		constants: store.app.constants,
		fetchingAuth: store.auth.fetching,
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
