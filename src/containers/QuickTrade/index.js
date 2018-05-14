import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import STRINGS from '../../config/localizedStrings';
import { ICONS, BALANCE_ERROR } from '../../config/constants';

import {
	QuickTrade,
	Dialog,
	Countdown,
	IconTitle,
	Loader
} from '../../components';
import {
	requestQuote,
	executeQuote,
	changeSymbol
} from '../../actions/orderbookAction';
import { formatBtcAmount, formatFiatAmount } from '../../utils/currency';
import { changePair } from '../../actions/appActions';

import { FLEX_CENTER_CLASSES } from '../../config/constants';

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
		console.log(this.props);
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
		this.props.requestQuote(quote);
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

	render() {
		const { quoteData, pairData } = this.props;
		const { showQuickTradeModal, side, pair } = this.state;

		if (!pair || pair !== this.props.pair || !pairData) {
			return <Loader background={false} />;
		}

		const name = STRINGS[`${pairData.pair_base.toUpperCase()}_NAME`];
		const { data, order } = quoteData;
		const end = quoteData.data.exp;
		return (
			<div
				className={classnames(...FLEX_CENTER_CLASSES, 'f-1', 'quote-container')}
			>
				<QuickTrade
					onReviewQuickTrade={this.onReviewQuickTrade}
					onRequestMarketValue={this.onRequestQuote}
					symbol={pair}
					quickTradeData={quoteData}
					onChangeSide={this.onChangeSide}
					disabled={
						quoteData.error === BALANCE_ERROR ? false : !quoteData.token
					}
				/>
				<Dialog
					isOpen={!!end && showQuickTradeModal}
					label="quick-trade-modal"
					onCloseDialog={this.onCloseDialog}
					shouldCloseOnOverlayClick={false}
					showCloseText={!order.fetching && !order.completed}
					style={{ 'z-index': 100 }}
				>
					{!order.fetching && !order.completed ? (
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
					)}
				</Dialog>
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	const pair = store.app.pair;
	const pairData = store.app.pairs[pair];
	return {
		pair,
		pairData,
		quoteData: store.orderbook.quoteData,
		activeLanguage: store.app.language
	};
};

const mapDispatchToProps = (dispatch) => ({
	changePair: bindActionCreators(changePair, dispatch),
	requestQuote: bindActionCreators(requestQuote, dispatch),
	executeQuote: bindActionCreators(executeQuote, dispatch),
	changeSymbol: bindActionCreators(changeSymbol, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(
	QuickTradeContainer
);
