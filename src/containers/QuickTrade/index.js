import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';

import STRINGS from '../../config/localizedStrings';
import { ICONS, BALANCE_ERROR } from '../../config/constants';

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
import { formatBtcAmount, formatFiatAmount } from '../../utils/currency';
import { isLoggedIn } from '../../utils/token';
import { changePair } from '../../actions/appActions';

// import { FLEX_CENTER_CLASSES } from '../../config/constants';

import QuoteResult from './QuoteResult';

class QuickTradeContainer extends Component {
	state = {
		pair: '',
		showQuickTradeModal: false,
		side: 'buy',
		quote: {},
		interval: undefined
	};

	componentWillMount() {
		this.changePair(this.props.routeParams.pair);
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

	onReviewQuickTrade = () => {
		const { pair_base, pair_2 } = this.props.pairData;

		if (this.props.quoteData.error === BALANCE_ERROR) {
			this.props.changeSymbol(this.state.side === 'sell' ? pair_base : pair_2);
			this.props.router.push('deposit');
		} else {
			this.onClearQuoteInterval();
			this.onOpenDialog();
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
		const { quoteData, pairData, activeTheme, quickTrade, orderLimits, pairs } = this.props;
		const { showQuickTradeModal, side, pair } = this.state;

		if (!pair || pair !== this.props.pair || !pairData) {
			return <Loader background={false} />;
		}

		const name = STRINGS[`${pairData.pair_base.toUpperCase()}_NAME`];
		const { data, order } = quoteData;
		const end = quoteData.data.exp;
		const tradeData = isLoggedIn() ? quoteData : quickTrade;
		return (
			<div
				className={classnames(
					'd-flex',
					'f-1',
					'quote-container',
					{ 'flex-column': isMobile }
				)}
			>
				{isMobile && <MobileBarBack onBackClick={this.onGoBack} />}
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
										formatFiatAmount(data.price),
										STRINGS.FIAT_NAME
									)}
								</div>
							</Countdown>
							) : (
								<QuoteResult
									data={order}
									name={name}
									onClose={this.onCloseDialog}
								/>
							)
						: <div></div>}
				</Dialog>
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
		quoteData: store.orderbook.quoteData,
		activeTheme,
		activeLanguage: store.app.language,
		quickTrade: store.orderbook.quickTrade,
		orderLimits: store.app.orderLimits
	};
};

const mapDispatchToProps = (dispatch) => ({
	changePair: bindActionCreators(changePair, dispatch),
	requestQuote: bindActionCreators(requestQuote, dispatch),
	executeQuote: bindActionCreators(executeQuote, dispatch),
	changeSymbol: bindActionCreators(changeSymbol, dispatch),
	requestQuickTrade: bindActionCreators(requestQuickTrade, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(
	QuickTradeContainer
);
