import React, { Component } from 'react';
import classnames from 'classnames';
import EventListener from 'react-event-listener';
import { subtract } from '../utils';
import { formatFiatAmount, formatBtcAmount } from '../../../utils/currency';
import STRINGS from '../../../config/localizedStrings';

const PriceRow = (side) => ([price, amount], index) => (
	<div key={`${side}-${index}`} className="d-flex value-row align-items-center">
		<div
			className={`f-1 trade_orderbook-cell trade_orderbook-cell-price ${side}`}
		>
			{formatFiatAmount(price)}
		</div>
		<div className="f-1 trade_orderbook-cell trade_orderbook-cell-amount">
			{formatBtcAmount(amount)}
		</div>
	</div>
);

const calculateSpread = (asks, bids) => {
	const lowerAsk = asks.length > 0 ? asks[0][0] : 0;
	const higherBid = bids.length > 0 ? bids[0][0] : 0;
	if (lowerAsk && higherBid) {
		return formatFiatAmount(subtract(lowerAsk, higherBid));
	}
	return '-';
};

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

	render() {
		const { asks, bids, symbol } = this.props;
		const { dataBlockHeight } = this.state;
		const blockStyle =
			dataBlockHeight > 0
				? {
						maxHeight: dataBlockHeight,
						minHeight: dataBlockHeight
					}
				: {};

		return (
			<div className="trade_orderbook-wrapper d-flex flex-column f-1 apply_rtl">
				<EventListener target="window" onResize={this.scrollTop} />
				<div className="trade_orderbook-headers d-flex">
					<div className="f-1 trade_orderbook-cell">
						{STRINGS.formatString(
							STRINGS.PRICE_CURRENCY,
							STRINGS.FIAT_CURRENCY_SYMBOL
						)}
					</div>
					<div className="f-1 trade_orderbook-cell">
						{STRINGS.formatString(STRINGS.AMOUNT_SYMBOL, symbol)}
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
						{asks.map(PriceRow('ask'))}
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
									calculateSpread(asks, bids),
									STRINGS.FIAT_CURRENCY_SYMBOL
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
						{bids.map(PriceRow('bids'))}
					</div>
				</div>
			</div>
		);
	}
}

Orderbook.defaultProps = {
	asks: [],
	bids: [],
	ready: false
};

export default Orderbook;
