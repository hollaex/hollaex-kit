import React, { Component } from 'react';
import classnames from 'classnames';
import EventListener from 'react-event-listener';
import { connect } from 'react-redux';

import { subtract, asksSelector, bidsSelector } from '../utils';
import { formatToFixed, formatToCurrency } from '../../../utils/currency';
import STRINGS from '../../../config/localizedStrings';
import { DEFAULT_COIN_DATA } from '../../../config/constants';

const PriceRow = (side, increment_price, increment_size, onPriceClick, onAmountClick) => (
	[price, amount],
	index
) => (
	<div key={`${side}-${price}`} className="d-flex value-row align-items-center">
		<div
			className={`f-1 trade_orderbook-cell trade_orderbook-cell-price ${side} pointer`}
			onClick={onPriceClick(price)}
		>
			{formatToCurrency(price, increment_price)}
		</div>
		<div
			className="f-1 trade_orderbook-cell trade_orderbook-cell-amount pointer"
			onClick={onAmountClick(amount)}
		>
			{formatToCurrency(amount, increment_size)}
		</div>
	</div>
);

const calculateSpread = (asks, bids, pair, pairData) => {
	const lowerAsk = asks.length > 0 ? asks[0][0] : 0;
	const higherBid = bids.length > 0 ? bids[0][0] : 0;
	if (lowerAsk && higherBid) {
		return formatToFixed(subtract(lowerAsk, higherBid), pairData.increment_price);
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

	UNSAFE_componentWillReceiveProps(nextProps) {
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
		const { asks, bids, pairData = {}, pair, coins } = this.props;
		// const blockStyle = {};
		const { dataBlockHeight } = this.state;
		const blockStyle =
			dataBlockHeight > 0
				? {
						// maxHeight: dataBlockHeight,
						minHeight: dataBlockHeight
				  }
				: {};

		const pairBase = pairData.pair_base.toUpperCase();
		const { symbol } = coins[pairData.pair_2] || DEFAULT_COIN_DATA;
		return (
			<div className="trade_orderbook-wrapper d-flex flex-column f-1 apply_rtl">
				<EventListener target="window" onResize={this.scrollTop} />
				<div className="trade_orderbook-headers d-flex">
					<div className="f-1 trade_orderbook-cell">
						{STRINGS.formatString(STRINGS["PRICE_CURRENCY"], symbol.toUpperCase())}
					</div>
					<div className="f-1 trade_orderbook-cell">
						{STRINGS.formatString(STRINGS["AMOUNT_SYMBOL"], pairBase)}
					</div>
				</div>
				<div className="trade_asks-limit_bar">
					<LimitBar text={STRINGS["ORDERBOOK_SELLERS"]} />
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
						{asks.map(
							PriceRow(
								'ask',
								pairData.increment_price,
								pairData.increment_size,
								this.onPriceClick,
								this.onAmountClick
							)
						)}
					</div>
					<div
						className="trade_orderbook-spread d-flex align-items-center"
						ref={this.setRefs('spreadWrapper')}
					>
						{STRINGS.formatString(
							STRINGS["ORDERBOOK_SPREAD"],
							<div className="trade_orderbook-spread-text">
								{STRINGS.formatString(
									STRINGS["ORDERBOOK_SPREAD_PRICE"],
									calculateSpread(asks, bids, pair, pairData),
									symbol.toUpperCase()
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
						{bids.map(
							PriceRow(
								'bids',
								pairData.increment_price,
								pairData.increment_size,
								this.onPriceClick,
								this.onAmountClick
							)
						)}
					</div>
				</div>
				<div className="trade_bids-limit_bar">
					<LimitBar text={STRINGS["ORDERBOOK_BUYERS"]} />
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
	pair: store.app.pair,
	asks: asksSelector(store),
	bids: bidsSelector(store)
});

export default connect(mapStateToProps)(Orderbook);
