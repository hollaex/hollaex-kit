import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import Review from './OrderEntryReview';
import Form, { FORM_NAME } from './OrderEntryForm';
import { formatNumber, formatFiatAmount } from '../../../utils/currency';
import {
	evaluateOrder,
	required,
	minValue,
	maxValue,
	checkMarketPrice,
	step
} from '../../../components/Form/validations';
import { Loader } from '../../../components';
import { LIMIT_VALUES, CURRENCIES } from '../../../config/constants';

import STRINGS from '../../../config/localizedStrings';

const FIAT_NAME = CURRENCIES.fiat.shortName;

class OrderEntry extends Component {
	state = {
		formValues: {},
		initialValues: {
			side: STRINGS.SIDES[0].value,
			type: STRINGS.TYPES[1].value
		},
		orderPrice: 0,
		outsideFormError: ''
	};

	componentDidMount() {
		this.generateFormValues();
	}

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.size !== this.props.size ||
			nextProps.side !== this.props.side ||
			nextProps.price !== this.props.price ||
			nextProps.type !== this.props.type
		) {
			this.calculateOrderPrice(nextProps);
		}
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.generateFormValues();
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

	calculateOrderPrice = (props) => {
		const { type, side } = props;
		const size = parseFloat(props.size || 0);
		const price = parseFloat(props.price || 0);

		let orderPrice = 0;
		if (size > 0 && !(type === 'limit' && price === 0)) {
			if (props.side === 'sell') {
				const { bids } = props;
				orderPrice = checkMarketPrice(size, bids, type, side, price);
			} else {
				const { asks } = props;
				orderPrice = checkMarketPrice(size, asks, type, side, price);
			}
		}

		let outsideFormError = '';

		if (type === 'market' && side === 'buy') {
			const values = {
				size,
				side,
				type,
				price
			};
			const { symbol, balance } = props;

			outsideFormError = evaluateOrder(
				symbol,
				balance,
				values,
				type,
				side,
				orderPrice
			);
		}
		this.setState({ orderPrice, outsideFormError });
	};

	evaluateOrder = (values) => {
		const { side, type } = values;
		const { symbol, balance } = this.props;

		return evaluateOrder(symbol, balance, values, type, side);
	};

	onSubmit = (values) => {
		const order = {
			...values,
			size: formatNumber(values.size, 4),
			symbol: this.props.symbol
		};

		if (values.type === 'market') {
			delete order.price;
		} else if (values.price) {
			order.price = formatNumber(values.price);
		}

		return this.props.submitOrder(order).then(() => {
			this.setState({ initialValues: values });
		});
	};

	generateFormValues = () => {
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
				label: STRINGS.SIZE,
				type: 'number',
				placeholder: '0.00',
				step: LIMIT_VALUES.SIZE.STEP,
				min: LIMIT_VALUES.SIZE.MIN,
				max: LIMIT_VALUES.SIZE.MAX,
				validate: [
					required,
					minValue(LIMIT_VALUES.SIZE.MIN),
					maxValue(LIMIT_VALUES.SIZE.MAX)
				],
				currency: STRINGS.BTC_SHORTNAME
			},
			price: {
				name: 'price',
				label: STRINGS.PRICE,
				type: 'number',
				placeholder: '0',
				step: LIMIT_VALUES.PRICE.STEP,
				min: LIMIT_VALUES.PRICE.MIN,
				max: LIMIT_VALUES.PRICE.MAX,
				validate: [
					required,
					minValue(LIMIT_VALUES.PRICE.MIN),
					maxValue(LIMIT_VALUES.PRICE.MAX),
					step(LIMIT_VALUES.PRICE.STEP)
				],
				// normalize: normalizeInt,
				currency: STRINGS.FIAT_SHORTNAME
			}
		};

		this.setState({ formValues });
	};

	render() {
		const { balance, symbol, type, side } = this.props;
		const {
			initialValues,
			formValues,
			orderPrice,
			outsideFormError
		} = this.state;
		const currencyName = STRINGS[`${symbol.toUpperCase()}_NAME`];

		const fees = 0;

		if (!balance.hasOwnProperty(`${symbol}_balance`)) {
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
					formValues={formValues}
					initialValues={initialValues}
					outsideFormError={outsideFormError}
				>
					<Review
						type={type}
						currency={FIAT_NAME}
						orderPrice={orderPrice}
						fees={fees}
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
	return {
		...formValues,
		activeLanguage: state.app.language
	};
};

export default connect(mapStateToProps)(OrderEntry);
