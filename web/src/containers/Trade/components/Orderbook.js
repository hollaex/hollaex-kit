import React, { Component } from 'react';
import classnames from 'classnames';
import EventListener from 'react-event-listener';
import { connect } from 'react-redux';
import ReactSvg from 'react-svg';

import { subtract } from '../utils';
import { formatCurrency, formatBaseAmount, formatBtcFullAmount, checkNonBasePair } from '../../../utils/currency';
import STRINGS from '../../../config/localizedStrings'
import { DEFAULT_COIN_DATA, ICONS } from '../../../config/constants';

const PriceRow = (pairBase, pairTwo, side, onPriceClick, onAmountClick) => (
	[price, amount],
	index
) => (
		<div key={`${side}-${price}`} className="d-flex value-row align-items-center">
			<div
				className={`f-1 trade_orderbook-cell trade_orderbook-cell-price ${side} pointer`}
				onClick={onPriceClick(price)}
			>
				{formatCurrency(price, pairTwo, true)}
			</div>
			<div
				className="f-1 trade_orderbook-cell trade_orderbook-cell-amount pointer"
				onClick={onAmountClick(amount)}
			>
				{formatCurrency(amount, pairBase, true)}
			</div>
		</div>
	);

const calculateSpread = (asks, bids, pair, coins) => {
	const lowerAsk = asks.length > 0 ? asks[0][0] : 0;
	const higherBid = bids.length > 0 ? bids[0][0] : 0;
	const isNonBasePair = checkNonBasePair(pair, coins);
	if (lowerAsk && higherBid) {
		return isNonBasePair ? formatBtcFullAmount(subtract(lowerAsk, higherBid)) : formatBaseAmount(subtract(lowerAsk, higherBid));
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
		const { asks, bids, pairData, pair, coins } = this.props;
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
		const pairTwo = pairData.pair_2.toUpperCase();
		const { symbol } = coins[pairData.pair_2] || DEFAULT_COIN_DATA;
		return (
			<div className="trade_orderbook-wrapper d-flex flex-column f-1 apply_rtl">
				{pair === 'hex-usdt'
					? <div className="trade_orderbook-headers d-flex">
						<div>
							<ReactSvg path={ICONS.INCOMING_WAVE} wrapperClassName="waves-icon" />
						</div>
						<div className="ml-3" >
							<div className=" f-1 trade_orderbook-cell mb-2">
								<span className="wave-header mr-2">
									{STRINGS.WAVES.NEXT_WAVE}
								</span>
								<span className="wave-content">
									{`TBA`}
								</span>
							</div>
							<div className=" f-1 trade_orderbook-cell mb-2">
								<span className="wave-header mr-2">
									{STRINGS.WAVES.WAVE_AMOUNT}
								</span>
								<span className="wave-content">
									{`TBA HEX`}
								</span>
							</div>
							<div className=" f-1 trade_orderbook-cell mb-2">
								<span className="wave-header mr-2">
									{STRINGS.WAVES.FLOOR}
								</span>
								<span className="wave-content">
									{`0.2`}
								</span>
							</div>
							<div className=" f-1 trade_orderbook-cell mb-2">
								<span className="wave-header mr-2">
									{STRINGS.WAVES.LAST_WAVE}
								</span>
								<span className="wave-content">
									{`N/A`}
								</span>
							</div>
							<div className=" f-1 trade_orderbook-cell mb-3">
								<a
									href={"https://drive.google.com/file/d/15gILXIVpVMQtRGpty9GNLdhOZTdidT2U/view"}
									target="_blank"
									rel="noopener noreferrer"
									className="blue-link pointer">
									{STRINGS.HOME.SECTION_1_BUTTON_1}
								</a>
							</div>
						</div>
					</div>
					: null
				}
				<EventListener target="window" onResize={this.scrollTop} />
				<div className="trade_orderbook-headers d-flex">
					<div className="f-1 trade_orderbook-cell">
						{STRINGS.formatString(
							STRINGS.PRICE_CURRENCY,
							symbol.toUpperCase()
						)}
					</div>
					<div className="f-1 trade_orderbook-cell">
						{STRINGS.formatString(STRINGS.AMOUNT_SYMBOL, pairBase)}
					</div>
				</div>
				<div className="trade_asks-limit_bar">
					<LimitBar text={STRINGS.ORDERBOOK_SELLERS} />
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
									calculateSpread(asks, bids, pair, coins),
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
						{bids.map(PriceRow(pairBase, pairTwo, 'bids', this.onPriceClick, this.onAmountClick))}
					</div>
				</div>
				<div className="trade_bids-limit_bar">
					<LimitBar text={STRINGS.ORDERBOOK_BUYERS} />
				</div>
			</div>
		);
	}
}

Orderbook.defaultProps = {
	asks: [],
	bids: [],
	ready: false,
	onPriceClick: () => { },
	onAmountClick: () => { }
};

const mapStateToProps = (store) => ({
	pair: store.app.pair
});

export default connect(mapStateToProps)(Orderbook);
