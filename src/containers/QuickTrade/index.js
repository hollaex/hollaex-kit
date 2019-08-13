import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';

import STRINGS from '../../config/localizedStrings';
import { ICONS, BALANCE_ERROR, BASE_CURRENCY } from '../../config/constants';

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
import { formatBtcAmount, calculateBalancePrice, formatToCurrency } from '../../utils/currency';
import { isLoggedIn } from '../../utils/token';
import { changePair, setNotification, RISKY_ORDER } from '../../actions/appActions';

// import { FLEX_CENTER_CLASSES } from '../../config/constants';

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
	}

	componentWillReceiveProps(nextProps) {
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
		if (JSON.stringify(this.props.prices) !== JSON.stringify(nextProps.prices)
			|| JSON.stringify(this.props.balance) !== JSON.stringify(nextProps.balance)) {
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

	calculateSections = ({ balance, prices }) => {
		const totalAssets = calculateBalancePrice(balance, prices);
		this.setState({ totalAssets });
	};

	onReviewQuickTrade = () => {
		const { pair_base, pair_2 } = this.props.pairData;
		const { settings: { risk = {}, notification = {} }, quoteData: { data = {} }, setNotification, pairData, balance } = this.props;

		if (this.props.quoteData.error === BALANCE_ERROR) {
			this.props.changeSymbol(this.state.side === 'sell' ? pair_base : pair_2);
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
			const avail_balance = balance[`${pair_base.toLowerCase()}_available`] || 0;
			const riskyPrice = ((avail_balance / 100) * risk.order_portfolio_percentage);
			if (risk.popup_warning && data.price > riskyPrice) {
				order['order_portfolio_percentage'] = risk.order_portfolio_percentage
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
		this.props.executeQuote(token);
	};

	onRequestQuote = (quoteData) => {
		let quote;
		if (quoteData) {
			quote = quoteData;
			this.setState({ quote });
		} else {
			quote = this.state.quote;
		}
		isLoggedIn() ? this.props.requestQuote(quote) : this.props.requestQuickTrade(quote);
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
		<div className="quote-countdown-wrapper">{STRINGS.QUOTE_EXPIRED_TOKEN}</div>
	);

	onGoBack = () => {
		this.props.router.push(`/trade/${this.state.pair}`);
	};

	render() {
		const { quoteData, pairData, activeTheme, quickTrade, orderLimits, pairs, coins } = this.props;
		const { showQuickTradeModal, side, pair } = this.state;

		if (!pair || pair !== this.props.pair || !pairData) {
			return <Loader background={false} />;
		}

		const name = STRINGS[`${pairData.pair_base.toUpperCase()}_NAME`];
		const { data, order } = quoteData;
		const end = quoteData.data.exp;
		const tradeData = isLoggedIn() ? quoteData : quickTrade;
		const baseCoin = coins[BASE_CURRENCY] || {};
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
						{showQuickTradeModal
							? !order.fetching && !order.completed ? (
								<Countdown
									buttonLabel={STRINGS.QUOTE_BUTTON}
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
											formatBtcAmount(data.size),
											name,
											formatToCurrency(data.price, baseCoin.min),
											STRINGS[`${BASE_CURRENCY.toUpperCase()}_NAME`]
										)}
									</div>
								</Countdown>
								) : (
									<QuoteResult
										data={order}
										name={name}
										coins={coins}
										onClose={this.onCloseDialog}
									/>
								)
							: <div></div>}
					</Dialog>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	const pair = store.app.pair;
	const pairData = store.app.pairs[pair];
	const activeTheme= store.app.theme
	return {
		pair,
		pairData,
		pairs: store.app.pairs,
		coins: store.app.coins,
		quoteData: store.orderbook.quoteData,
		activeTheme,
		activeLanguage: store.app.language,
		quickTrade: store.orderbook.quickTrade,
		orderLimits: store.app.orderLimits,
		prices: store.orderbook.prices,
		balance: store.user.balance,
		user: store.user,
		settings: store.user.settings
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

export default connect(mapStateToProps, mapDispatchToProps)(
	QuickTradeContainer
);
