import React, { Component } from 'react';
import classnames from 'classnames';
import EventListener from 'react-event-listener';
import { connect } from 'react-redux';

import { subtract } from '../utils';
import { formatCurrency, formatFiatAmount, formatBtcFullAmount, checkNonFiatPair } from '../../../utils/currency';
import STRINGS from '../../../config/localizedStrings';

const PriceRow = (pairBase, pairTwo, side, onPriceClick, onAmountClick) => (
	[price, amount],
	index
) => (
	<div key={`${side}-${price}`} className="d-flex value-row align-items-center">
		<div
			className={`f-1 trade_orderbook-cell trade_orderbook-cell-price ${side} pointer`}
			onClick={onPriceClick(price)}
		>
			{formatCurrency(price, pairTwo)}
		</div>
		<div
			className="f-1 trade_orderbook-cell trade_orderbook-cell-amount pointer"
			onClick={onAmountClick(amount)}
		>
			{formatCurrency(amount, pairBase)}
		</div>
	</div>
);

const calculateSpread = (asks, bids, pair) => {
	const lowerAsk = asks.length > 0 ? asks[0][0] : 0;
	const higherBid = bids.length > 0 ? bids[0][0] : 0;
	const isNonFiatPair = checkNonFiatPair(pair);
	if (lowerAsk && higherBid) {
		return isNonFiatPair ? formatBtcFullAmount(subtract(lowerAsk, higherBid)) : formatFiatAmount(subtract(lowerAsk, higherBid));
	}
	return '-';
};

const LimitBar = ({ text }) => (
	<div className="d-flex align-items-center orderbook-limit_bar-wrapper">
		<div className="f-1 orderbook-limit_bar-line" />
		<span className="orderbook-limit_bar-text font-weight-bold">{text}</span>
	</div>
);

class Orderbook extends Component {
	state = {
		dataBlockHeight: 0
	};

	componentDidMount() {
		this.scrollTop();
	}

	componentWillReceiveProps(nextProps) {
		// this.scrollTop();
	}

	setRefs = (key) => (el) => {
		this[key] = el;
	};

	scrollTop = () => {
		if (this.wrapper && this.spreadWrapper) {
			const maxContentHeight =
				this.wrapper.offsetHeight - this.spreadWrapper.offsetHeight;
			const accumulatedHeight =
				this.bidsWrapper.scrollHeight + this.asksWrapper.scrollHeight;
			const dataBlockHeight = maxContentHeight / 2;
			const needScroll = accumulatedHeight > maxContentHeight;
			const askDif = this.asksWrapper.scrollHeight - dataBlockHeight;

			if (needScroll && askDif > 0) {
				this.wrapper.scrollTop = askDif;
			}
			this.setState({ dataBlockHeight });
		}
	};

	onPriceClick = (price) => () => {
		this.props.onPriceClick(price);
	};

	onAmountClick = (price) => () => {
		this.props.onAmountClick(price);
	};

	render() {
		const { asks, bids, pairData, pair } = this.props;
		const { dataBlockHeight } = this.state;
		const blockStyle =
			dataBlockHeight > 0
				? {
						maxHeight: dataBlockHeight,
						minHeight: dataBlockHeight
					}
				: {};

		const pairBase = pairData.pair_base.toUpperCase();
		const pairTwo = pairData.pair_2.toUpperCase();
		return (
			<div className="trade_orderbook-wrapper d-flex flex-column f-1 apply_rtl">
				<EventListener target="window" onResize={this.scrollTop} />
				<div className="trade_orderbook-headers d-flex">
					<div className="f-1 trade_orderbook-cell">
						{STRINGS.formatString(
							STRINGS.PRICE_CURRENCY,
							STRINGS[`${pairTwo}_CURRENCY_SYMBOL`]
						)}
					</div>
					<div className="f-1 trade_orderbook-cell">
						{STRINGS.formatString(STRINGS.AMOUNT_SYMBOL, pairBase)}
					</div>
				</div>
				<div
					ref={this.setRefs('wrapper')}
					className={classnames('trade_orderbook-content', 'f-1', 'overflow-y')}
				>
					<div
						className={classnames(
							'trade_orderbook-asks',
							'd-flex',
							'flex-column-reverse'
						)}
						style={blockStyle}
						ref={this.setRefs('asksWrapper')}
					>
						{asks.map(PriceRow(pairBase, pairTwo, 'ask', this.onPriceClick, this.onAmountClick))}
						<LimitBar text={STRINGS.ORDERBOOK_SELLERS} />
					</div>
					<div
						className="trade_orderbook-spread d-flex align-items-center"
						ref={this.setRefs('spreadWrapper')}
					>
						{STRINGS.formatString(
							STRINGS.ORDERBOOK_SPREAD,
							<div className="trade_orderbook-spread-text">
								{STRINGS.formatString(
									STRINGS.ORDERBOOK_SPREAD_PRICE,
									calculateSpread(asks, bids, pair),
									STRINGS[`${pairTwo}_CURRENCY_SYMBOL`]
								)}
							</div>
						)}
					</div>
					<div
						className={classnames(
							'trade_orderbook-bids',
							'd-flex',
							'flex-column'
						)}
						ref={this.setRefs('bidsWrapper')}
						style={blockStyle}
					>
						{bids.map(PriceRow(pairBase, pairTwo, 'bids', this.onPriceClick, this.onAmountClick))}
						<LimitBar text={STRINGS.ORDERBOOK_BUYERS} />
					</div>
				</div>
			</div>
		);
	}
}

Orderbook.defaultProps = {
	asks: [],
	bids: [],
	ready: false,
	onPriceClick: () => {},
	onAmountClick: () => {}
};

const mapStateToProps = (store) => ({
	pair: store.app.pair
});

export default connect(mapStateToProps)(Orderbook);
