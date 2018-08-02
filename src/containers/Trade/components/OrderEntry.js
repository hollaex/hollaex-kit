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
	formatFiatAmount,
	roundNumber,
	fiatSymbol
} from '../../../utils/currency';
import { getDecimals } from '../../../utils/utils';
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
import { ORDER_LIMITS } from '../../../config/constants';

import STRINGS from '../../../config/localizedStrings';

class OrderEntry extends Component {
	state = {
		formValues: {},
		initialValues: {
			side: STRINGS.SIDES[0].value,
			type: STRINGS.TYPES[1].value
		},
		orderPrice: 0,
		orderFees: 0,
		outsideFormError: ''
	};

	componentDidMount() {
		if (this.props.pair_base) {
			this.generateFormValues(this.props.pair);
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
	}

	setMax = () => {
		const { side, balance, pair_base } = this.props;
		const size = parseFloat(this.props.size || 0);
		const price = parseFloat(this.props.price || 0);
		let maxSize = balance[`${pair_base}_available`];
		if (side === 'buy') {
			maxSize = mathjs.divide(balance[`fiat_available`], price);
		}
		if (maxSize !== size) {
			this.props.change(FORM_NAME, 'size', roundNumber(maxSize, 4));
		}
	};

	calculateOrderPrice = (props) => {
		const { type, side, fees } = props;
		const size = parseFloat(props.size || 0);
		const price = parseFloat(props.price || 0);

		let orderPrice = 0;
		if (
			size >= ORDER_LIMITS[this.props.pair].SIZE.MIN &&
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
			.multiply(fees.taker_fee)
			.divide(100)
			.done();
		let outsideFormError = '';

		if (
			type === 'market' &&
			orderPrice === 0 &&
			size >= ORDER_LIMITS[this.props.pair].SIZE.MIN
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
		const { pair, min_size, tick_size } = this.props;

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
				getDecimals(tick_size)
			);
		}

		return this.props.submitOrder(order).then(() => {
			this.setState({ initialValues: values });
		});
	};

	onReview = () => {
		const {
			showPopup,
			type,
			side,
			price,
			size,
			pair,
			pair_base,
			pair_2,
			min_size,
			tick_size,
			openCheckOrder,
			submit
		} = this.props;
		const order = {
			type,
			side,
			price,
			size: formatNumber(size, getDecimals(min_size)),
			symbol: pair_base,
			orderPrice: this.state.orderPrice,
			orderFees: this.state.orderFees
		};

		if (type === 'market') {
			delete order.price;
		} else if (price) {
			order.price = formatNumber(price, getDecimals(tick_size))

		}

		if (showPopup) {
			openCheckOrder(order, () => {
				submit(FORM_NAME);
			});
		} else {
			submit(FORM_NAME);
		}
	};

	generateFormValues = (pair = '', byuingPair = '') => {
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
				step: ORDER_LIMITS[pair].SIZE.STEP,
				min: ORDER_LIMITS[pair].SIZE.MIN,
				max: ORDER_LIMITS[pair].SIZE.MAX,
				validate: [
					required,
					minValue(ORDER_LIMITS[pair].SIZE.MIN),
					maxValue(ORDER_LIMITS[pair].SIZE.MAX)
				],
				currency: STRINGS[`${pair.toUpperCase()}_SHORTNAME`]
			},
			price: {
				name: 'price',
				label: STRINGS.PRICE,
				type: 'number',
				placeholder: '0',
				normalize: normalizeFloat,
				step: ORDER_LIMITS[pair].PRICE.STEP,
				min: ORDER_LIMITS[pair].PRICE.MIN,
				max: ORDER_LIMITS[pair].PRICE.MAX,
				validate: [
					required,
					minValue(ORDER_LIMITS[pair].PRICE.MIN),
					maxValue(ORDER_LIMITS[pair].PRICE.MAX),
					step(ORDER_LIMITS[pair].PRICE.STEP)
				],
				currency: STRINGS[`${byuingPair.toUpperCase()}_SHORTNAME`]
			}
		};

		this.setState({ formValues });
	};

	render() {
		const { balance, type, side, pair_base, pair_2 } = this.props;
		const {
			initialValues,
			formValues,
			orderPrice,
			orderFees,
			outsideFormError
		} = this.state;

		const currencyName = STRINGS[`${pair_base.toUpperCase()}_NAME`];
		const buyingName = STRINGS[`${pair_2.toUpperCase()}_SHORTNAME`];
		if (!balance.hasOwnProperty(`${pair_2}_balance`)) {
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
					initialValues={initialValues}
					outsideFormError={outsideFormError}
				>
					<Review
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
	const { pair_base, pair_2, max_price, max_size, min_size, min_price, tick_size } = state.app.pairs[state.app.pair];
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
		tick_size

	};
};

const mapDispatchToProps = (dispatch) => ({
	submit: bindActionCreators(submit, dispatch),
	change: bindActionCreators(change, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderEntry);
