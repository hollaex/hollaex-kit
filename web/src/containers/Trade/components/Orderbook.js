import React, { Component } from 'react';
import classnames from 'classnames';
import EventListener from 'react-event-listener';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	PlusSquareOutlined,
	MinusSquareOutlined,
	CaretDownOutlined,
} from '@ant-design/icons';
import { Button, Select } from 'antd';
import math from 'mathjs';

import { calcPercentage } from 'utils/math';
import { subtract, orderbookSelector, marketPriceSelector } from '../utils';
import { formatToFixed, formatToCurrency } from '../../../utils/currency';
import STRINGS from '../../../config/localizedStrings';
import { DEFAULT_COIN_DATA } from '../../../config/constants';
import { setOrderbookDepth } from 'actions/orderbookAction';

const { Option } = Select;

const DEPTH_LEVELS = [1, 10, 100, 1000];

const PriceRow = (
	side,
	increment_price,
	increment_size,
	onPriceClick,
	onAmountClick,
	maxCumulative,
	isBase
) => ([price, amount, cumulative, cumulativePrice], index) => {
	const ACCFillClassName = `fill fill-${side}`;
	const ACCFillStyle = {
		backgroundSize: `${calcPercentage(cumulative, maxCumulative)}% 100%`,
	};

	const fillClassName = `fill fill-${side}`;
	const fillStyle = {
		backgroundSize: `${calcPercentage(amount, maxCumulative)}% 100%`,
	};
	const totalAmount = isBase ? cumulative : cumulativePrice;

	return (
		<div
			key={`${side}-${price}`}
			className={classnames('price-row-wrapper', ACCFillClassName)}
			style={ACCFillStyle}
		>
			<div
				className={classnames(
					'd-flex value-row align-items-center',
					fillClassName
				)}
				style={fillStyle}
			>
				<div
					className={`f-1 trade_orderbook-cell trade_orderbook-cell-price pointer`}
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
				<div
					className="f-1 trade_orderbook-cell trade_orderbook-cell_total pointer"
					onClick={onAmountClick(totalAmount)}
				>
					{isBase
						? formatToCurrency(cumulative, increment_size)
						: formatToCurrency(cumulativePrice, increment_price)}
				</div>
			</div>
		</div>
	);
};

const calculateSpread = (asks, bids, pair, pairData) => {
	const lowerAsk = asks.length > 0 ? asks[0][0] : 0;
	const higherBid = bids.length > 0 ? bids[0][0] : 0;
	if (lowerAsk && higherBid) {
		return formatToFixed(
			subtract(lowerAsk, higherBid),
			pairData.increment_price
		);
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
		dataBlockHeight: 0,
		isBase: true,
		positioned: false,
		isOpen: false,
	};

	componentDidMount() {
		const { orderbookFetched } = this.props;
		if (orderbookFetched) {
			this.setDataBlockHeight();
			setTimeout(() => {
				window.dispatchEvent(new Event('resize'));
			}, 1000);
		}
	}

	componentDidUpdate(prevProps) {
		const { orderbookFetched } = this.props;
		const { positioned } = this.state;
		if (
			!positioned &&
			prevProps.orderbookFetched === false &&
			orderbookFetched === true
		) {
			this.setDataBlockHeight();
			setTimeout(() => {
				window.dispatchEvent(new Event('resize'));
			}, 1000);
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { asks } = this.props;
		const { positioned } = this.state;
		if (positioned && nextProps.asks.length !== asks) {
			const asksWrapperScrollHeight = this.asksWrapper.scrollHeight;
			const wrapperScrollTop = this.wrapper.scrollTop;
			this.setState({ asksWrapperScrollHeight, wrapperScrollTop }, () => {
				const { asksWrapperScrollHeight, wrapperScrollTop } = this.state;
				this.preserveScroll(asksWrapperScrollHeight, wrapperScrollTop);
			});
		}
	}

	componentWillUnmount() {
		const { depth } = this.props;
		localStorage.setItem('orderbook_depth', depth);
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
			const dataBlockHeight = maxContentHeight;
			const needScroll = !(accumulatedHeight < maxContentHeight);
			const askDif = this.asksWrapper.scrollHeight - dataBlockHeight / 2;

			if (needScroll && askDif > 0) {
				this.wrapper.scrollTop = askDif;
			}
			this.setState({ dataBlockHeight, positioned: true });
		}
	};

	preserveScroll = (prevAsksWrapperScrollHeight, prevWrapperScrollTop) => {
		const deltaAsksHeight =
			this.asksWrapper.scrollHeight - prevAsksWrapperScrollHeight;
		this.wrapper.scrollTop = Math.max(
			prevWrapperScrollTop + deltaAsksHeight,
			0
		);
	};

	setDataBlockHeight = () => {
		const dataBlockHeight =
			this.wrapper.offsetHeight - this.spreadWrapper.offsetHeight;
		this.setState({ dataBlockHeight });
	};

	onPriceClick = (price) => () => {
		this.props.onPriceClick(price);
	};

	onAmountClick = (price) => () => {
		this.props.onAmountClick(price);
	};

	increaseDepth = () => {
		const { depth, setOrderbookDepth } = this.props;
		const lastIndex = DEPTH_LEVELS.length - 1;
		const depthIndex = DEPTH_LEVELS.findIndex(
			(depthLevel) => depthLevel === depth
		);
		if (depthIndex < lastIndex) {
			setOrderbookDepth(DEPTH_LEVELS[depthIndex + 1]);
		}
	};

	decreaseDepth = () => {
		const { depth, setOrderbookDepth } = this.props;
		const depthIndex = DEPTH_LEVELS.findIndex(
			(depthLevel) => depthLevel === depth
		);
		if (depthIndex > 0) {
			setOrderbookDepth(DEPTH_LEVELS[depthIndex - 1]);
		}
	};

	disableIncrease = () => {
		const { depth } = this.props;
		const lastIndex = DEPTH_LEVELS.length - 1;
		const depthIndex = DEPTH_LEVELS.findIndex(
			(depthLevel) => depthLevel === depth
		);
		return depthIndex === lastIndex;
	};

	disableDecrease = () => {
		const { depth } = this.props;
		const depthIndex = DEPTH_LEVELS.findIndex(
			(depthLevel) => depthLevel === depth
		);
		return depthIndex === 0;
	};

	onSelect = (isBase) => this.setState({ isBase });

	dropdownVisibleChange = (isOpen) => {
		this.setState({ isOpen });
	};

	render() {
		const {
			asks,
			bids,
			pairData = {},
			pair,
			coins,
			maxCumulative,
			increment_price = 1,
			depth = 1,
			lastPrice,
		} = this.props;

		const { isBase, positioned, isOpen } = this.state;
		// const blockStyle = {};
		const { dataBlockHeight } = this.state;
		const blockStyle =
			dataBlockHeight > 0
				? {
						// maxHeight: dataBlockHeight,
						minHeight: dataBlockHeight,
				  }
				: {};

		const pairBase = pairData.pair_base.toUpperCase();
		const { symbol } = coins[pairData.pair_2] || DEFAULT_COIN_DATA;
		return (
			<div className="trade_orderbook-wrapper d-flex flex-column f-1 apply_rtl">
				<EventListener target="window" onResize={this.scrollTop} />
				<div className="trade_orderbook-depth-selector d-flex align-center">
					<Button
						type="text"
						disabled={this.disableDecrease()}
						onClick={() => this.decreaseDepth()}
					>
						<MinusSquareOutlined />
					</Button>
					<div className="trade_orderbook-depth bold">
						{math.multiply(depth, increment_price)}
					</div>
					<Button
						type="text"
						disabled={this.disableIncrease()}
						onClick={() => this.increaseDepth()}
					>
						<PlusSquareOutlined />
					</Button>
				</div>
				<div className="trade_orderbook-headers d-flex align-end">
					<div className="f-1 trade_orderbook-cell">
						<div>{STRINGS['PRICE_CURRENCY']}</div>
						<div>({symbol.toUpperCase()})</div>
					</div>
					<div className="f-1 trade_orderbook-cell">
						<div>{STRINGS['AMOUNT_SYMBOL']}</div>
						<div>({pairBase})</div>
					</div>
					<div className="f-1 trade_orderbook-cell">
						<div className="d-flex align-items-center">
							{STRINGS['CUMULATIVE_AMOUNT_SYMBOL']}
						</div>
						<Select
							bordered={false}
							defaultValue={false}
							size="small"
							suffixIcon={
								<CaretDownOutlined
									onClick={() => this.dropdownVisibleChange(!isOpen)}
								/>
							}
							value={isBase}
							onSelect={this.onSelect}
							onDropdownVisibleChange={this.dropdownVisibleChange}
							open={isOpen}
							className="custom-select-input-style order-entry no-border"
							dropdownClassName="custom-select-style trade-select-option-wrapper"
							dropdownStyle={{ minWidth: '7rem' }}
						>
							<Option value={false}>{symbol.toUpperCase()}</Option>
							<Option value={true}>{pairBase}</Option>
						</Select>
					</div>
				</div>
				<div className="trade_asks-limit_bar">
					<LimitBar text={STRINGS['ORDERBOOK_SELLERS']} />
				</div>
				<div
					ref={this.setRefs('wrapper')}
					className={classnames('trade_orderbook-content', 'f-1', 'overflow-y')}
					style={{ visibility: positioned ? 'visible' : 'hidden' }}
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
								this.onAmountClick,
								maxCumulative,
								isBase
							)
						)}
					</div>
					<div
						className="trade_orderbook-spread d-flex align-items-center justify-content-between"
						ref={this.setRefs('spreadWrapper')}
					>
						<div className="d-flex align-items-center">
							<div className="trade_orderbook-market-price">
								{formatToFixed(lastPrice, increment_price)}
							</div>
						</div>
						<div className="d-flex align-items-center">
							{STRINGS.formatString(
								STRINGS['ORDERBOOK_SPREAD'],
								<div className="trade_orderbook-spread-text">
									{calculateSpread(asks, bids, pair, pairData)}
								</div>
							)}
						</div>
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
								'bid',
								pairData.increment_price,
								pairData.increment_size,
								this.onPriceClick,
								this.onAmountClick,
								maxCumulative,
								isBase
							)
						)}
					</div>
				</div>
				<div className="trade_bids-limit_bar">
					<LimitBar text={STRINGS['ORDERBOOK_BUYERS']} />
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
	onAmountClick: () => {},
};

const mapStateToProps = (store) => {
	const { asks, bids, maxCumulative } = orderbookSelector(store);
	const lastPrice = marketPriceSelector(store);
	const {
		app: { pair, pairs },
		orderbook: { depth },
	} = store;
	const { increment_price } = pairs[pair] || { pair_base: '', pair_2: '' };

	return {
		pair,
		increment_price,
		asks,
		bids,
		maxCumulative,
		depth,
		lastPrice,
	};
};

const mapDispatchToProps = (dispatch) => ({
	setOrderbookDepth: bindActionCreators(setOrderbookDepth, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Orderbook);
