import React, { Component } from 'react';
import classnames from 'classnames';
import { SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import STRINGS from '../../config/localizedStrings';
import { CURRENCIES, ICONS } from '../../config/constants';

import { QuickTrade, Dialog, Countdown, IconTitle } from '../../components';
import { requestQuote, executeQuote } from '../../actions/orderbookAction';
import { formatBtcAmount, formatFiatAmount } from '../../utils/currency';

import { FLEX_CENTER_CLASSES } from '../../config/constants';

import QuoteResult from './QuoteResult';

class QuickTradeContainer extends Component {
	state = {
		showQuickTradeModal: false,
		side: 'buy',
		quote: {},
		interval: undefined
	};

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
	}

	componentWillUnmount() {
		this.onClearQuoteInterval();
	}

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
		this.onClearQuoteInterval();
		this.onOpenDialog();
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
		const { requestQuote, executeQuote, quoteData, symbol } = this.props;
		const { showQuickTradeModal, side } = this.state;

		const name = STRINGS[`${symbol.toUpperCase()}_NAME`];
		const { data, order } = quoteData;
		const end = quoteData.data.exp;
		return (
			<div
				className={classnames(...FLEX_CENTER_CLASSES, 'f-1', 'quote-container')}
			>
				<QuickTrade
					onReviewQuickTrade={this.onReviewQuickTrade}
					onRequestMarketValue={this.onRequestQuote}
					symbol={symbol}
					quickTradeData={quoteData}
					onChangeSide={this.onChangeSide}
					disabled={!quoteData.token}
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

const mapStateToProps = (store) => ({
	symbol: store.orderbook.symbol,
	quoteData: store.orderbook.quoteData,
	activeLanguage: store.app.language
});

const mapDispatchToProps = (dispatch) => ({
	requestQuote: bindActionCreators(requestQuote, dispatch),
	executeQuote: bindActionCreators(executeQuote, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(
	QuickTradeContainer
);
