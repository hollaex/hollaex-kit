import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { formValueSelector, submit, change } from 'redux-form';
import mathjs from 'mathjs';

import Review from './OrderEntryReview';
import Form, { FORM_NAME } from './OrderEntryForm';
import {
	toFixed,
	formatNumber,
	formatFiatAmount,
	roundNumber,
	// fiatSymbol,
	calculatePrice,
	calculateBalancePrice
} from '../../../utils/currency';
import { getDecimals, playBackgroundAudioNotification } from '../../../utils/utils';
import {
	evaluateOrder,
	required,
	minValue,
	maxValue,
	checkMarketPrice,
	step,
	normalizeFloat
} from '../../../components/Form/validations';
import { Loader } from '../../../components';
import { takerFee } from '../../../config/constants';

import STRINGS from '../../../config/localizedStrings';
import { isLoggedIn } from '../../../utils/token';

class OrderEntry extends Component {
	state = {
		formValues: {},
		initialValues: {
			side: STRINGS.SIDES[0].value,
			type: STRINGS.TYPES[1].value
		},
		orderPrice: 0,
		orderFees: 0,
		outsideFormError: '',
		totalAssets: ''
	};

	componentDidMount() {
		if (this.props.pair_base) {
			this.generateFormValues(this.props.pair);
		}
		if (this.props.user.id) {
			this.calculateSections(this.props);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.size !== this.props.size ||
			nextProps.side !== this.props.side ||
			nextProps.price !== this.props.price ||
			nextProps.type !== this.props.type ||
			nextProps.activeLanguage !== this.props.activeLanguage
		) {
			this.calculateOrderPrice(nextProps);
		}
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.generateFormValues(nextProps.pair);
		}
		if (nextProps.marketPrice && !this.state.initialValues.price) {
			this.setState({
				initialValues: {
					...this.state.initialValues,
					price: this.props.marketPrice
				}
			});
		}
		if (this.props.priceInitialized !== nextProps.priceInitialized) {
			this.generateFormValues(nextProps.pair, '', nextProps.priceInitialized);
		}
		if (this.props.sizeInitialized !== nextProps.sizeInitialized) {
			this.generateFormValues(nextProps.pair, '', nextProps.priceInitialized, nextProps.sizeInitialized);
		}
		if (JSON.stringify(this.props.prices) !== JSON.stringify(nextProps.prices) ||
			JSON.stringify(this.props.balance) !== JSON.stringify(nextProps.balance)) {
			this.calculateSections(nextProps);
		}
	}

	calculateSections = ({ balance, prices }) => {
		const totalAssets = calculateBalancePrice(balance, prices);
		this.setState({ totalAssets });
	};

	setMax = () => {
		const { side, balance, pair_base, min_size , pair_2} = this.props;
		const size = parseFloat(this.props.size || 0);
		const price = parseFloat(this.props.price || 0);
		let maxSize = balance[`${pair_base}_available`];
		if (side === 'buy') {
			maxSize = mathjs.divide(balance[`${pair_2}_available`], price);
		}
		if (maxSize !== size) {
			this.props.change(FORM_NAME, 'size', roundNumber(maxSize, getDecimals(min_size)));
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
			.multiply(fees ? fees.taker_fee : takerFee)
			.divide(100)
			.done();
		let outsideFormError = '';

		if (
			type === 'market' &&
			orderPrice === 0 &&
			size >= orderLimits[this.props.pair].SIZE.MIN
		) {
			outsideFormError = STRINGS.QUICK_TRADE_ORDER_NOT_FILLED;
		} else if (type === 'market' && side === 'buy') {
			const values = {
				size,
				side,
				type,
				price
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
		const { min_size, increment_price, settings } = this.props;

		const order = {
			...values,
			size: formatNumber(
				values.size,
				getDecimals(min_size)
			),
			symbol: this.props.pair
		};

		if (values.type === 'market') {
			delete order.price;
		} else if (values.price) {
			order.price = formatNumber(
				values.price,
				getDecimals(increment_price)
			);
		}

		return this.props.submitOrder(order).then(() => {
			if (values.type === 'market'
				&& settings.audio && settings.audio.order_completed) {
				playBackgroundAudioNotification('orderbook_market_order');
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
			min_size,
			increment_price,
			openCheckOrder,
			onRiskyTrade,
			submit,
			settings: { risk = {}, notification = {} }
		} = this.props;
		const orderTotal = mathjs.add(
			mathjs.fraction(this.state.orderPrice),
			mathjs.fraction(this.state.orderFees)
		);
		const order = {
			type,
			side,
			price,
			size: formatNumber(size, getDecimals(min_size)),
			symbol: pair_base,
			orderPrice: orderTotal,
			orderFees: this.state.orderFees
		};
		const orderPriceInFiat = calculatePrice(orderTotal, this.props.prices[pair_2]);
		const riskyPrice = ((this.state.totalAssets / 100) * risk.order_portfolio_percentage);

		if (type === 'market') {
			delete order.price;
		} else if (price) {
			order.price = formatNumber(price, getDecimals(increment_price))
		}
		if (notification.popup_order_confirmation) {
			openCheckOrder(order, () => {
				if (risk.popup_warning && riskyPrice < orderPriceInFiat) {
					order['order_portfolio_percentage'] = risk.order_portfolio_percentage
					onRiskyTrade(order, () => {
						submit(FORM_NAME);
					});
				} else {
					submit(FORM_NAME);
				}
			});
		} else if (risk.popup_warning && riskyPrice < orderPriceInFiat) {
			order['order_portfolio_percentage'] = risk.order_portfolio_percentage
			onRiskyTrade(order, () => {
				submit(FORM_NAME);
			});
		} else {
			submit(FORM_NAME);
		}
	};

	generateFormValues = (pair = '', byuingPair = '', priceInitialized = false, sizeInitialized = false) => {
		const {

			min_size,
			max_size,
			increment_price,
			min_price,
			max_price,

		} = this.props;
		const formValues = {
			type: {
				name: 'type',
				type: 'tab',
				options: STRINGS.TYPES,
				validate: [required]
			},
			side: {
				name: 'side',
				type: 'select',
				options: STRINGS.SIDES,
				validate: [required]
			},
			size: {
				name: 'size',
				label: (
					<div style={{ display: 'flex' }}>
						{STRINGS.formatString(
							STRINGS.STRING_WITH_PARENTHESIS,
							STRINGS.SIZE,
							<div
								className="pointer text-uppercase blue-link"
								onClick={this.setMax}
							>
								{STRINGS.CALCULATE_MAX}
							</div>
						)}
					</div>
				),
				type: 'number',
				placeholder: '0.00',
				normalize: normalizeFloat,
				step: min_size,
				min: min_size,
				max: max_size,
				validate: [
					required,
					minValue(min_size),
					maxValue(max_size)
				],
				currency: STRINGS[`${pair.toUpperCase()}_SHORTNAME`],
				initializeEffect: sizeInitialized,
				parse: (value = '') => {
					let decimal = getDecimals(min_size);
					let decValue = toFixed(value);
					let valueDecimal = getDecimals(decValue);

					let result = value;
					if (decimal < valueDecimal) {
						result = decValue.toString().substring(0, (decValue.toString().length - (valueDecimal - decimal)));
					}
					return result;
				}
			},
			price: {
				name: 'price',
				label: STRINGS.PRICE,
				type: 'number',
				placeholder: '0',
				normalize: normalizeFloat,
				step: increment_price,
				min: min_price,
				max: max_price,
				validate: [
					required,
					minValue(min_price),
					maxValue(max_price),
					step(increment_price)
				],
				currency: STRINGS[`${byuingPair.toUpperCase()}_SHORTNAME`],
				initializeEffect: priceInitialized
			}
		};

		this.setState({ formValues });
	};

	formKeyDown = (e) => {
		if (e.key === 'Enter' && e.shiftKey === false) {
			e.preventDefault();
			this.onReview();
		}
	};

	render() {
		const { balance, type, side, pair_base, pair_2, price } = this.props;
		const {
			initialValues,
			formValues,
			orderPrice,
			orderFees,
			outsideFormError
		} = this.state;

		const currencyName = STRINGS[`${pair_base.toUpperCase()}_NAME`];
		const buyingName = STRINGS[`${pair_2.toUpperCase()}_SHORTNAME`];
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
				>
					<Review
						price={price}
						type={type}
						currency={buyingName}
						orderPrice={orderPrice}
						fees={orderFees}
						formatToCurrency={formatFiatAmount}
					/>
				</Form>
			</div>
		);
	}
}

const selector = formValueSelector(FORM_NAME);

const mapStateToProps = (state) => {
	const formValues = selector(state, 'price', 'size', 'side', 'type');
	const { pair_base, pair_2, max_price, max_size, min_size, min_price, increment_price } = state.app.pairs[state.app.pair];
	const fees = state.user.fees[state.app.pair];

	return {
		...formValues,
		activeLanguage: state.app.language,
		fees,
		pair: state.app.pair,
		pair_base,
		pair_2,
		max_price,
		max_size,
		min_size,
		min_price,
		increment_price,
		orderLimits: state.app.orderLimits,
		prices: state.orderbook.prices,
		balance: state.user.balance,
		user: state.user,
		settings: state.user.settings,
	};
};

const mapDispatchToProps = (dispatch) => ({
	submit: bindActionCreators(submit, dispatch),
	change: bindActionCreators(change, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderEntry);
