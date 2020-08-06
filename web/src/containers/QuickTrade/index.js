import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';

import STRINGS from '../../config/localizedStrings';
import { ICONS, BALANCE_ERROR, BASE_CURRENCY, DEFAULT_COIN_DATA } from '../../config/constants';

import {
	QuickTrade,
	Dialog,
	Countdown,
	IconTitle,
	Loader,
	MobileBarBack
} from '../../components';
import {
	requestQuote,
	executeQuote,
	changeSymbol,
	requestQuickTrade
} from '../../actions/orderbookAction';
import {
	calculateBalancePrice,
	formatToCurrency
} from '../../utils/currency';
import { isLoggedIn } from '../../utils/token';
import {
	changePair,
	setNotification,
	RISKY_ORDER
} from '../../actions/appActions';

import QuoteResult from './QuoteResult';

class QuickTradeContainer extends Component {
	state = {
		pair: '',
		showQuickTradeModal: false,
		side: 'buy',
		quote: {},
		interval: undefined,
		totalAssets: ''
	};

	componentWillMount() {
		this.changePair(this.props.routeParams.pair);
	}

	componentDidMount() {
		if (this.props.user.id) {
			this.calculateSections(this.props);
		}
		if (this.props.constants &&
			!this.props.constants.broker_enabled &&
			!this.props.fetchingAuth) {
				this.props.router.push('/account');
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const nextExp = nextProps.quoteData.data.exp;
		const thisExp = this.props.quoteData.data.exp;
		if (
			nextProps.quoteData.error &&
			nextProps.quoteData.error !== this.props.quoteData.error
		) {
			this.onClearQuoteInterval();
		}
		if (nextExp !== thisExp) {
			const interval = setInterval(() => {
				this.onRequestQuote();
			}, 60 * 1000);
			this.onClearQuoteInterval();
			this.setState({ interval });
		}
		if (nextProps.routeParams.pair !== this.props.routeParams.pair) {
			this.changePair(nextProps.routeParams.pair);
		}
		if (
			JSON.stringify(this.props.prices) !==
				JSON.stringify(nextProps.prices) ||
			JSON.stringify(this.props.balance) !==
				JSON.stringify(nextProps.balance) ||
			JSON.stringify(this.props.coins) !==
				JSON.stringify(nextProps.coins)
		) {
			this.calculateSections(nextProps);
		}
	}

	componentWillUnmount() {
		this.onClearQuoteInterval();
	}

	changePair = (pair) => {
		this.setState({ pair });
		this.props.changePair(pair);
	};

	onOpenDialog = () => {
		this.onClearQuoteInterval();
		this.setState({ showQuickTradeModal: true });
	};

	onCloseDialog = () => {
		this.setState({ showQuickTradeModal: false });
		if (this.state.quote) {
			this.props.requestQuote(this.state.quote);
		}
	};

	calculateSections = ({ balance, prices, coins }) => {
		const totalAssets = calculateBalancePrice(balance, prices, coins);
		this.setState({ totalAssets });
	};

	onReviewQuickTrade = () => {
		const { pair_base, pair_2 } = this.props.pairData;
		const {
			settings: { risk = {} },
			quoteData: { data = {} },
			setNotification,
			pairData,
			balance
		} = this.props;

		if (this.props.quoteData.error === BALANCE_ERROR) {
			this.props.changeSymbol(
				this.state.side === 'sell' ? pair_base : pair_2
			);
			this.props.router.push('deposit');
		} else {
			const order = {
				type: 'quick trade',
				side: data.side,
				price: 0,
				size: data.size,
				symbol: pair_base,
				orderPrice: data.price,
				orderFees: 0
			};
			// const riskyPrice = ((this.state.totalAssets / 100) * risk.order_portfolio_percentage);
			let coin_balance = 0;
			if (data.side === 'buy') {
				coin_balance = balance[`${pair_2.toLowerCase()}_balance`];
			} else {
				coin_balance = balance[`${pair_base.toLowerCase()}_balance`];
			}
			const riskySize = ((coin_balance / 100) * risk.order_portfolio_percentage);
			if (risk.popup_warning && data.size >= riskySize) {
				order['order_portfolio_percentage'] =
					risk.order_portfolio_percentage;
				setNotification(RISKY_ORDER, {
					order,
					onConfirm: () => {
						this.onClearQuoteInterval();
						this.onOpenDialog();
					},
					fees: {},
					pairData
				});
			} else {
				this.onClearQuoteInterval();
				this.onOpenDialog();
			}
		}
	};

	onChangeSide = (side = '') => {
		this.setState({ side });
	};

	onExecuteTrade = () => {
		const { token } = this.props.quoteData;
		this.props.executeQuote(token, this.props.settings);
	};

	onRequestQuote = (quoteData) => {
		let quote;
		if (quoteData) {
			quote = quoteData;
			this.setState({ quote });
		} else {
			quote = this.state.quote;
		}
		isLoggedIn()
			? this.props.requestQuote(quote)
			: this.props.requestQuickTrade(quote);
	};

	onClearQuoteInterval = () => {
		if (this.state.interval) {
			clearInterval(this.state.interval);
		}
	};

	renderCountdown = (countdown) => {
		return (
			<div className="quote-countdown-wrapper">
				{STRINGS.formatString(
					STRINGS.QUOTE_COUNTDOWN_MESSAGE,
					<div className="counter">{countdown}</div>
				)}
			</div>
		);
	};

	renderTimeout = () => (
		<div className="quote-countdown-wrapper">
			{STRINGS.QUOTE_EXPIRED_TOKEN}
		</div>
	);

	onGoBack = () => {
		this.props.router.push(`/trade/${this.state.pair}`);
	};

	render() {
		const {
			quoteData,
			pairData = {},
			activeTheme,
			quickTrade,
			orderLimits,
			pairs,
			coins
		} = this.props;
		const { showQuickTradeModal, side, pair } = this.state;

		if (!pair || pair !== this.props.pair || !pairData) {
			return <Loader background={false} />;
		}

		const { data, order } = quoteData;
		const end = quoteData.data.exp;
		const tradeData = isLoggedIn() ? quoteData : quickTrade;
		const baseCoin = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
		const pairCoin = coins[pairData.pair_base] || DEFAULT_COIN_DATA;
		return (
			<div className='h-100'>
				{isMobile && <MobileBarBack onBackClick={this.onGoBack} />}

				<div
					className={classnames(
						'd-flex',
						'f-1',
						'quote-container',
						'h-100',
						{ 'flex-column': isMobile }
					)}
				>
					<QuickTrade
						onReviewQuickTrade={this.onReviewQuickTrade}
						onRequestMarketValue={this.onRequestQuote}
						symbol={pair}
						theme={activeTheme}
						quickTradeData={tradeData}
						onChangeSide={this.onChangeSide}
						disabled={
							quoteData.error === BALANCE_ERROR ? true : !quoteData.token
						}
						orderLimits={orderLimits}
						pairs={pairs}
						coins={coins}
					/>
					<Dialog
						isOpen={!!end && showQuickTradeModal}
						label="quick-trade-modal"
						onCloseDialog={this.onCloseDialog}
						shouldCloseOnOverlayClick={false}
						showCloseText={!order.fetching && !order.completed}
						theme={activeTheme}
						style={{ 'z-index': 100 }}
					>
						{showQuickTradeModal ? (
							!order.fetching && !order.completed ? (
								<Countdown
									buttonLabel={STRINGS.QUOTE_BUTTON}
									settings={this.props.settings}
									onClickButton={this.onExecuteTrade}
									end={end}
									renderTimeout={this.renderTimeout}
									renderCountdown={this.renderCountdown}
								>
									<IconTitle
										iconPath={ICONS.SQUARE_DOTS}
										text={STRINGS.QUOTE_REVIEW}
										underline={true}
										useSvg={true}
										className="w-100"
									/>
									<div className="quote-review-wrapper">
										{STRINGS.formatString(
											STRINGS.QUOTE_MESSAGE,
											STRINGS.SIDES_VALUES[side],
											formatToCurrency(data.size, pairData.increment_size),
											pairCoin.fullname,
											formatToCurrency(data.price, pairData.increment_price),
											baseCoin.fullname
										)}
									</div>
								</Countdown>
							) : (
								<QuoteResult
									pairData={pairData}
									data={order}
									name={pairCoin.fullname}
									coins={coins}
									onClose={this.onCloseDialog}
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

const mapStateToProps = (store) => {
	const pair = store.app.pair;
	const pairData = store.app.pairs[pair] || {};
	return {
		pair,
		pairData,
		pairs: store.app.pairs,
		coins: store.app.coins,
		quoteData: store.orderbook.quoteData,
		activeTheme: store.app.theme,
		activeLanguage: store.app.language,
		quickTrade: store.orderbook.quickTrade,
		orderLimits: store.app.orderLimits,
		prices: store.orderbook.prices,
		balance: store.user.balance,
		user: store.user,
		settings: store.user.settings,
		constants: store.app.constants,
		fetchingAuth: store.auth.fetching
	};
};

const mapDispatchToProps = (dispatch) => ({
	changePair: bindActionCreators(changePair, dispatch),
	requestQuote: bindActionCreators(requestQuote, dispatch),
	executeQuote: bindActionCreators(executeQuote, dispatch),
	changeSymbol: bindActionCreators(changeSymbol, dispatch),
	requestQuickTrade: bindActionCreators(requestQuickTrade, dispatch),
	setNotification: bindActionCreators(setNotification, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(QuickTradeContainer);
