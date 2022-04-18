import React, { Component } from 'react';
import {
	Transition,
	TransitionGroup,
	CSSTransition,
} from 'react-transition-group';
import classnames from 'classnames';
import EventListener from 'react-event-listener';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	PlusSquareOutlined,
	MinusSquareOutlined,
	CaretDownOutlined,
	CaretUpOutlined,
} from '@ant-design/icons';
import { Button, Select } from 'antd';
import math from 'mathjs';

import { subtract, orderbookSelector, marketPriceSelector } from '../utils';
import { formatToFixed } from 'utils/currency';
import STRINGS from 'config/localizedStrings';
import { setOrderbookDepth } from 'actions/orderbookAction';
import PriceRow from './PriceRow';

const { Option } = Select;

const DEPTH_LEVELS = [1, 10, 100, 1000];

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
		priceDiff: 0,
		inProp: false,
		isAnimated: false,
	};

	componentDidMount() {
		const { orderbookFetched } = this.props;
		if (orderbookFetched) {
			this.setDataBlockHeight();
			setTimeout(() => {
				window.dispatchEvent(new Event('resize'));
				this.setState({ isAnimated: true });
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

		if (prevProps.orderbookFetched === false && orderbookFetched === true) {
			setTimeout(() => {
				this.setState({ isAnimated: true });
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

	UNSAFE_componentWillUpdate(nextProp) {
		const { lastPrice } = this.props;
		if (
			nextProp.lastPrice &&
			lastPrice &&
			!math.equal(nextProp.lastPrice, lastPrice)
		) {
			const priceDiff = math.subtract(nextProp.lastPrice, lastPrice);
			this.setState((prevState) => ({
				...prevState,
				priceDiff,
				inProp: !prevState.inProp,
			}));
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

	getDirBasedClass = (diff, baseClassName = '') => {
		const direction = diff < 0 ? 'down' : diff > 0 ? 'up' : '';
		return baseClassName ? `${baseClassName}-${direction}` : direction;
	};

	getArrow = (diff) => {
		if (diff > 0) {
			return <CaretUpOutlined />;
		} else if (diff < 0) {
			return <CaretDownOutlined />;
		} else {
			return null;
		}
	};

	render() {
		const {
			asks,
			bids,
			pairData = {},
			pair,
			maxCumulative,
			increment_price = 1,
			depth = 1,
			lastPrice,
		} = this.props;

		const {
			isBase,
			positioned,
			isOpen,
			priceDiff,
			inProp,
			dataBlockHeight,
			isAnimated,
		} = this.state;
		// const blockStyle = {};
		const blockStyle =
			dataBlockHeight > 0
				? {
						// maxHeight: dataBlockHeight,
						minHeight: dataBlockHeight,
				  }
				: {};

		const { pair_base_display, pair_2_display } = pairData;
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
						<div>({pair_2_display})</div>
					</div>
					<div className="f-1 trade_orderbook-cell text-align-right">
						<div>{STRINGS['AMOUNT_SYMBOL']}</div>
						<div>({pair_base_display})</div>
					</div>
					<div className="f-1 trade_orderbook-cell text-align-right">
						<div className="text-align-right">
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
							<Option value={false}>{pair_2_display}</Option>
							<Option value={true}>{pair_base_display}</Option>
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
						<TransitionGroup component={null}>
							{asks.map((record) => (
								<CSSTransition
									key={record[4]}
									timeout={1000}
									classNames={classnames({ orderbook_ask_row_: isAnimated })}
								>
									<PriceRow
										side="ask"
										record={record}
										increment_price={pairData.increment_price}
										increment_size={pairData.increment_size}
										onPriceClick={this.onPriceClick}
										onAmountClick={this.onAmountClick}
										maxCumulative={maxCumulative}
										isBase={isBase}
									/>
								</CSSTransition>
							))}
						</TransitionGroup>
					</div>
					<div
						className="trade_orderbook-spread d-flex align-items-center justify-content-between"
						ref={this.setRefs('spreadWrapper')}
					>
						<Transition in={inProp} timeout={1000}>
							{(state) => (
								<div className="d-flex align-items-center">
									<div
										className={classnames(
											'trade_orderbook-market-price',
											'last-price',
											state,
											this.getDirBasedClass(priceDiff)
										)}
									>
										{lastPrice
											? formatToFixed(lastPrice, increment_price)
											: null}
									</div>
									<div
										className={classnames(
											'px-2',
											'price-arrow',
											state,
											this.getDirBasedClass(priceDiff)
										)}
									>
										{this.getArrow(priceDiff)}
									</div>
								</div>
							)}
						</Transition>
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
						<TransitionGroup component={null}>
							{bids.map((record) => (
								<CSSTransition
									key={record[4]}
									timeout={1000}
									classNames={classnames({ orderbook_bid_row_: isAnimated })}
								>
									<PriceRow
										side="bid"
										record={record}
										increment_price={pairData.increment_price}
										increment_size={pairData.increment_size}
										onPriceClick={this.onPriceClick}
										onAmountClick={this.onAmountClick}
										maxCumulative={maxCumulative}
										isBase={isBase}
									/>
								</CSSTransition>
							))}
						</TransitionGroup>
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
	orderbookFetched: false,
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
