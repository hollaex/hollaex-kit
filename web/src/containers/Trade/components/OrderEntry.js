import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { formValueSelector, submit, change } from 'redux-form';
import mathjs from 'mathjs';

import Review from './OrderEntryReview';
import Form, { FORM_NAME } from './OrderEntryForm';
import {
	formatNumber,
	// formatBaseAmount,
	roundNumber,
	formatToCurrency,
} from '../../../utils/currency';
import {
	getDecimals,
	playBackgroundAudioNotification,
} from '../../../utils/utils';
import {
	evaluateOrder,
	required,
	minValue,
	maxValue,
	minValueNE,
	maxValueNE,
	checkMarketPrice,
	step,
	normalizeFloat,
} from '../../../components/Form/validations';
import { Loader, Tooltip } from '../../../components';
import { takerFee, DEFAULT_COIN_DATA } from '../../../config/constants';

import STRINGS from '../../../config/localizedStrings';
import { isLoggedIn } from '../../../utils/token';
import { openFeesStructureandLimits } from '../../../actions/appActions';
import { orderbookSelector, marketPriceSelector } from '../utils';

const ORDER_OPTIONS = [
	{
		label: 'Regular',
		value: 'regular',
	},
	{
		label: 'Stops',
		value: 'stops',
	},
];

class OrderEntry extends Component {
	state = {
		formValues: {},
		initialValues: {
			side: STRINGS.SIDES[0].value,
			type: STRINGS.TYPES[1].value,
		},
		orderPrice: 0,
		orderFees: 0,
		outsideFormError: '',
		orderType: 'regular',
	};

	componentDidMount() {
		if (this.props.pair_base) {
			this.generateFormValues(this.props);
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { pair_2, pair_base } = this.props;
		if (
			nextProps.size !== this.props.size ||
			nextProps.side !== this.props.side ||
			nextProps.price !== this.props.price ||
			nextProps.type !== this.props.type ||
			nextProps.activeLanguage !== this.props.activeLanguage
		) {
			this.calculateOrderPrice(nextProps);
		}
		if (
			nextProps.activeLanguage !== this.props.activeLanguage ||
			nextProps.side !== this.props.side ||
			nextProps.balance[`${nextProps.pair_base}_available`] !==
				this.props.balance[`${pair_base}_available`] ||
			nextProps.balance[`${nextProps.pair_2}_available`] !==
				this.props.balance[`${pair_2}_available`]
		) {
			this.generateFormValues(nextProps);
		}
		if (nextProps.marketPrice && !this.state.initialValues.price) {
			this.setState({
				initialValues: {
					...this.state.initialValues,
					price: this.props.marketPrice,
				},
			});
		}
	}

	calculateOrderForBudget = (budget, orders = []) =>
		orders.reduce(
			([accumulatedPrice, accumulatedSize], [price = 0, size = 0]) => {
				if (mathjs.larger(budget, accumulatedPrice)) {
					const remainingBudget = mathjs.subtract(budget, accumulatedPrice);
					const orderPrice = mathjs.multiply(size, price);
					if (mathjs.largerEq(remainingBudget, orderPrice)) {
						return [
							mathjs.sum(accumulatedPrice, orderPrice),
							mathjs.sum(accumulatedSize, size),
						];
					} else {
						const remainingSize = mathjs.divide(remainingBudget, price);
						return [
							mathjs.sum(accumulatedPrice, remainingBudget),
							mathjs.sum(accumulatedSize, remainingSize),
						];
					}
				} else {
					return [accumulatedPrice, accumulatedSize];
				}
			},
			[0, 0]
		);

	calculateMarketOrder = (percent) => {
		const { pair_2, balance = {}, side, pairsOrderbooks, pair } = this.props;

		const availableBalance = balance[`${pair_2}_available`];
		const budget = mathjs.multiply(
			availableBalance,
			mathjs.divide(percent, 100)
		);

		const { [side === 'buy' ? 'asks' : 'bids']: orders = [] } =
			pairsOrderbooks[pair] || {};

		return this.calculateOrderForBudget(budget, orders);
	};

	setMax = (percent = 100) => {
		const {
			side,
			balance = {},
			pair_base,
			increment_size,
			pair_2,
			asks,
			type,
		} = this.props;

		const size = parseFloat(this.props.size || 0);
		let price = parseFloat(this.props.price || 0);
		let maxSize = balance[`${pair_base}_available`] || 0;

		if (side === 'buy') {
			if (type === 'market') {
				if (asks && asks.length) {
					price = asks[asks.length - 1][0];
				}
			}
			maxSize = mathjs.divide(balance[`${pair_2}_available`] || 0, price);
		}

		let calculatedSize;
		if (type === 'market' && side === 'buy') {
			calculatedSize = this.calculateMarketOrder(percent)[1];
		} else {
			calculatedSize = mathjs.multiply(maxSize, mathjs.divide(percent, 100));
		}

		if (calculatedSize !== size) {
			this.props.change(
				FORM_NAME,
				'size',
				roundNumber(calculatedSize, getDecimals(increment_size))
			);
		}
	};

	calculateOrderPrice = (props) => {
		const { type, side, fees, orderLimits } = props;
		const size = parseFloat(props.size || 0);
		const price = parseFloat(props.price || 0);

		let orderPrice = 0;
		if (
			orderLimits[this.props.pair] &&
			size >= orderLimits[this.props.pair].SIZE.MIN &&
			!(type === 'limit' && price === 0)
		) {
			if (props.side === 'sell') {
				const { bids } = props;
				orderPrice = checkMarketPrice(size, bids, type, side, price);
			} else {
				const { asks } = props;
				orderPrice = checkMarketPrice(size, asks, type, side, price);
			}
		}

		let orderFees = mathjs
			.chain(orderPrice)
			.multiply(fees && fees.taker_fee ? fees.taker_fee : takerFee)
			.divide(100)
			.done();
		let outsideFormError = '';

		if (
			type === 'market' &&
			orderPrice === 0 &&
			size >= orderLimits[this.props.pair].SIZE.MIN
		) {
			outsideFormError = STRINGS['QUICK_TRADE_ORDER_NOT_FILLED'];
		} else if (type === 'market' && side === 'buy') {
			const values = {
				size,
				side,
				type,
				price,
			};
			const { pair_base, pair_2, balance } = props;

			outsideFormError = evaluateOrder(
				pair_base,
				pair_2,
				balance,
				values,
				type,
				side,
				orderPrice
			);
		}

		this.setState({ orderPrice, orderFees, outsideFormError });
	};

	evaluateOrder = (values) => {
		const { side, type } = values;
		const { pair_base, pair_2, balance } = this.props;
		return evaluateOrder(pair_base, pair_2, balance, values, type, side);
	};

	onSubmit = (values) => {
		const {
			increment_size,
			increment_price,
			settings,
			price,
			size,
			side,
			type,
			balance = {},
			pair_base,
			pair_2,
			change,
			focusOnSizeInput,
		} = this.props;

		const order = {
			...values,
			size: formatNumber(values.size, getDecimals(increment_size)),
			symbol: this.props.pair,
		};

		if (values.type === 'market') {
			delete order.price;
		} else if (values.price) {
			order.price = formatNumber(values.price, getDecimals(increment_price));
		}

		if (values.order_type === 'stops') {
			order.stop = formatNumber(values.stop, getDecimals(increment_price));
		} else {
			delete order.stop;
		}

		if (values.post_only) {
			order.meta = {
				post_only: values.post_only,
			};
		}

		delete order.post_only;
		delete order.order_type;

		return this.props.submitOrder(order).then(() => {
			if (
				values.type === 'market' &&
				!values.stop &&
				settings.audio &&
				settings.audio.order_completed
			) {
				playBackgroundAudioNotification(
					'orderbook_market_order',
					this.props.settings
				);
			} else if (
				values.type === 'market' &&
				values.stop &&
				settings.audio &&
				settings.audio.order_completed
			) {
				playBackgroundAudioNotification(
					'orderbook_limit_order',
					this.props.settings
				);
			}

			if (
				type === values.type &&
				price === values.price &&
				size === values.size &&
				side === values.side
			) {
				let availableBalance;
				if (side === 'buy') {
					availableBalance = balance[`${pair_2}_available`];
					if (
						mathjs.larger(mathjs.multiply(2, price, size), availableBalance)
					) {
						change(FORM_NAME, 'size', '');
						focusOnSizeInput();
					}
				} else {
					availableBalance = balance[`${pair_base}_available`];
					if (mathjs.larger(mathjs.multiply(2, size), availableBalance)) {
						change(FORM_NAME, 'size', '');
						focusOnSizeInput();
					}
				}
			}

			// this.setState({ initialValues: values });
		});
	};

	onReview = () => {
		const {
			// showPopup,
			type,
			side,
			price,
			size,
			// pair,
			pair_base,
			pair_2,
			increment_size,
			increment_price,
			openCheckOrder,
			onRiskyTrade,
			submit,
			settings: { risk = {}, notification = {} },
			balance,
		} = this.props;
		const orderTotal = mathjs.add(
			mathjs.fraction(this.state.orderPrice),
			mathjs.fraction(this.state.orderFees)
		);
		const order = {
			type,
			side,
			price,
			size: formatNumber(size, getDecimals(increment_size)),
			symbol: pair_base,
			orderPrice: orderTotal,
			orderFees: this.state.orderFees,
		};
		// const orderPriceInBaseCoin = calculatePrice(orderTotal, this.props.prices[pair_2]);
		let coin_balance = 0;
		if (side === 'buy') {
			coin_balance = balance[`${pair_2.toLowerCase()}_balance`];
		} else {
			coin_balance = balance[`${pair_base.toLowerCase()}_balance`];
		}
		// const riskySize = ((this.props.totalAsset / 100) * risk.order_portfolio_percentage);
		let riskySize = (coin_balance / 100) * risk.order_portfolio_percentage;
		riskySize = formatNumber(riskySize, getDecimals(increment_size));

		if (type === 'market') {
			delete order.price;
		} else if (price) {
			order.price = formatNumber(price, getDecimals(increment_price));
		}
		if (notification.popup_order_confirmation) {
			openCheckOrder(order, () => {
				if (risk.popup_warning && riskySize <= size) {
					order['order_portfolio_percentage'] = risk.order_portfolio_percentage;
					onRiskyTrade(order, () => {
						submit(FORM_NAME);
					});
				} else {
					submit(FORM_NAME);
				}
			});
		} else if (risk.popup_warning && riskySize <= size) {
			order['order_portfolio_percentage'] = risk.order_portfolio_percentage;
			onRiskyTrade(order, () => {
				submit(FORM_NAME);
			});
		} else {
			submit(FORM_NAME);
		}
	};

	reset = () => {
		const { change } = this.props;
		change(FORM_NAME, 'stop', '');
		change(FORM_NAME, 'price', '');
		change(FORM_NAME, 'size', '');
	};

	generateFormValues = (props, buyingPair = '') => {
		const {
			min_size,
			max_size,
			increment_size,
			increment_price,
			min_price,
			max_price,
			coins,
			pair_base,
			pair_2,
			balance = {},
			marketPrice,
			pair = '',
			side = 'buy',
		} = props;

		const { symbol } = coins[pair] || DEFAULT_COIN_DATA;
		const buyData = coins[buyingPair] || DEFAULT_COIN_DATA;
		const formValues = {
			orderType: {
				name: 'order_type',
				type: 'dropdown',
				options: ORDER_OPTIONS,
				onChange: (orderType) => this.setState({ orderType }),
			},
			type: {
				name: 'type',
				type: 'tab',
				options: STRINGS['TYPES'],
				validate: [required],
			},
			side: {
				name: 'side',
				type: 'select',
				options: STRINGS['SIDES'],
				validate: [required],
			},
			clear: {
				name: 'clear',
				type: 'clear',
				onClick: this.reset,
			},
			stop: {
				name: 'stop',
				label: 'Trigger price',
				type: 'number',
				placeholder: '0',
				normalize: (value = '') => normalizeFloat(value, increment_price),
				step: increment_price,
				...(side === 'buy'
					? {
							min: marketPrice,
							validate: [
								required,
								minValueNE(marketPrice),
								step(increment_price),
							],
					  }
					: {
							max: marketPrice,
							validate: [
								required,
								maxValueNE(marketPrice),
								step(increment_price),
							],
					  }),
			},
			price: {
				name: 'price',
				label: STRINGS['PRICE'],
				type: 'number',
				placeholder: '0',
				normalize: (value = '') => normalizeFloat(value, increment_price),
				step: increment_price,
				min: min_price,
				max: max_price,
				validate: [
					required,
					minValue(min_price),
					maxValue(max_price),
					step(increment_price),
				],
				currency: buyData.symbol.toUpperCase(),
				setRef: this.props.setPriceRef,
			},
			size: {
				name: 'size',
				label: (
					<div className="d-flex justify-content-between">
						<div className="d-flex">{STRINGS['SIZE']}</div>
						<div>
							Balance{' '}
							<span
								className="pointer text-uppercase blue-link"
								onClick={() => this.setMax()}
							>
								{side === 'buy'
									? formatToCurrency(
											balance[`${pair_2}_available`],
											increment_price
									  )
									: formatToCurrency(
											balance[`${pair_base}_available`],
											increment_size
									  )}{' '}
								{side === 'buy'
									? pair_2.toUpperCase()
									: pair_base.toUpperCase()}
							</span>
						</div>
					</div>
				),
				type: 'number',
				placeholder: '0.00',
				normalize: (value = '') => normalizeFloat(value, increment_size),
				step: increment_size,
				min: min_size,
				max: max_size,
				validate: [required, minValue(min_size), maxValue(max_size)],
				currency: symbol.toUpperCase(),
				setRef: this.props.setSizeRef,
			},
			slider: {
				name: 'size-slider',
				type: 'slider',
				onClick: this.setMax,
			},
			postOnly: {
				name: 'post_only',
				label: (
					<Tooltip text={STRINGS['POST_ONLY_TOOLTIP']} className="light-theme">
						<span className="px-1 post-only-txt">{STRINGS['POST_ONLY']}</span>
					</Tooltip>
				),
				type: 'checkbox',
				className: 'align-start my-0',
			},
		};

		this.setState({ formValues });
	};

	formKeyDown = (e) => {
		if (e.key === 'Enter' && e.shiftKey === false) {
			e.preventDefault();
			this.onReview();
		}
	};

	onFeeStructureAndLimits = () => {
		this.props.openFeesStructureandLimits({
			verification_level: this.props.user.verification_level,
			discount: this.props.user.discount || 0,
		});
	};

	render() {
		const {
			balance,
			type,
			side,
			pair_base,
			pair_2,
			price,
			coins,
			size,
			increment_price,
		} = this.props;
		const {
			initialValues,
			formValues,
			orderPrice,
			orderFees,
			outsideFormError,
			orderType,
		} = this.state;
		const pairBase = coins[pair_base] || DEFAULT_COIN_DATA;
		const pairTwo = coins[pair_2] || DEFAULT_COIN_DATA;

		const currencyName = pairBase.fullname;
		const buyingName = pairTwo.symbol.toUpperCase();
		if (isLoggedIn() && !balance.hasOwnProperty(`${pair_2}_balance`)) {
			return <Loader relative={true} background={false} />;
		}

		return (
			<div
				className={classnames(
					'trade_order_entry-wrapper',
					'd-flex',
					'flex-column',
					`order_side-selector-${side}`
				)}
			>
				<Form
					currencyName={currencyName}
					evaluateOrder={this.evaluateOrder}
					onSubmit={this.onSubmit}
					onReview={this.onReview}
					formValues={formValues}
					formKeyDown={this.formKeyDown}
					initialValues={initialValues}
					outsideFormError={outsideFormError}
					orderType={orderType}
				>
					<Review
						side={side}
						price={price}
						size={size}
						type={type}
						currency={buyingName}
						orderPrice={orderPrice}
						fees={orderFees}
						increment_price={increment_price}
						formatToCurrency={formatToCurrency}
						onFeeStructureAndLimits={this.onFeeStructureAndLimits}
					/>
				</Form>
			</div>
		);
	}
}

const selector = formValueSelector(FORM_NAME);

const mapStateToProps = (state) => {
	const formValues = selector(state, 'price', 'size', 'side', 'type', 'stop');
	const { asks, bids } = orderbookSelector(state);
	const pair = state.app.pair;
	const {
		pair_base,
		pair_2,
		max_price,
		max_size,
		min_size,
		min_price,
		increment_size,
		increment_price,
	} = state.app.pairs[pair] || { pair_base: '', pair_2: '' };
	const marketPrice = marketPriceSelector(state);

	return {
		...formValues,
		activeLanguage: state.app.language,
		pair,
		pair_base,
		pair_2,
		max_price,
		max_size,
		min_size,
		increment_size,
		min_price,
		increment_price,
		orderLimits: state.app.orderLimits,
		prices: state.orderbook.prices,
		balance: state.user.balance,
		user: state.user,
		settings: state.user.settings,
		coins: state.app.coins,
		pairsOrderbooks: state.orderbook.pairsOrderbooks,
		asks,
		bids,
		marketPrice,
		// totalAsset: state.asset.totalAsset
	};
};

const mapDispatchToProps = (dispatch) => ({
	submit: bindActionCreators(submit, dispatch),
	change: bindActionCreators(change, dispatch),
	openFeesStructureandLimits: bindActionCreators(
		openFeesStructureandLimits,
		dispatch
	),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderEntry);
