import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector, reset } from 'redux-form';
import math from 'mathjs';
import { Button, Dialog, OtpForm, Loader } from '../../components';
import renderFields from '../../components/Form/factoryFields';
import {
	setWithdrawNotificationSuccess,
	setWithdrawNotificationError
} from './notifications';
import { fiatSymbol } from '../../utils/currency';
import { calculateFiatFee } from './utils';

import STRINGS from '../../config/localizedStrings';

import ReviewModalContent from './ReviewModalContent';

export const FORM_NAME = 'WithdrawCryptocurrencyForm';

const selector = formValueSelector(FORM_NAME);

const validate = (values, props) => {
	const errors = {};
	const amount = math.fraction(values.amount || 0);
	const fee = math.fraction(values.fee || 0);
	const balance = math.fraction(props.balanceAvailable || 0);

	const totalTransaction = math.add(fee, amount);
	if (math.larger(totalTransaction, balance)) {
		errors.amount = STRINGS.formatString(
			STRINGS.WITHDRAWALS_LOWER_BALANCE,
			math.number(totalTransaction)
		);
	}

	return errors;
};

class Form extends Component {
	state = {
		dialogIsOpen: false,
		dialogOtpOpen: false
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.symbol !== this.props.symbol) {
			nextProps.dispatch(reset(FORM_NAME));
		}
		if (
			!nextProps.submitting &&
			nextProps.submitting !== this.props.submitting
		) {
			this.onCloseDialog();
		}

		if (
			nextProps.symbol === fiatSymbol &&
			(nextProps.data.amount !== this.props.data.amount ||
				(nextProps.symbol === fiatSymbol &&
					nextProps.amount !== this.props.symbol))
		) {
			const fee = calculateFiatFee(nextProps.data.amount);
			if (fee !== nextProps.data.fee) {
				nextProps.change('fee', fee);
			}
		}
	}

	onOpenDialog = (ev) => {
		if (ev && ev.preventDefault) {
			ev.preventDefault();
		}
		this.setState({ dialogIsOpen: true });
	};

	onCloseDialog = (ev) => {
		if (ev && ev.preventDefault) {
			ev.preventDefault();
		}
		this.setState({ dialogIsOpen: false, dialogOtpOpen: false });
	};

	onAcceptDialog = () => {
		if (this.props.otp_enabled) {
			this.setState({ dialogOtpOpen: true });
		} else {
			// this.onCloseDialog();
			this.props.submit();
		}
	};

	onSubmitOtp = ({ otp_code = '' }) => {
		const values = this.props.data;
		return this.props
			.onSubmit({
				...values,
				amount: math.eval(values.amount),
				fee: values.fee ? math.eval(values.fee) : 0,
				otp_code
			})
			.then(({ data }) => {
				this.onCloseDialog();
				return { data };
			})
			.catch((error) => {
				if (error.errors && !error.errors.otp_code) {
					setWithdrawNotificationError(error.errors, this.props.dispatch);
					this.onCloseDialog();
				}
				// console.log(error.errors);
				this.onCloseDialog();
				throw error;
			});
	};

	render() {
		const {
			handleSubmit,
			submitting,
			pristine,
			error,
			valid,
			initialValues, // eslint-disable-line
			symbol,
			data,
			openContactForm,
			formValues,
			currentPrice
		} = this.props;

		const { dialogIsOpen, dialogOtpOpen } = this.state;

		return (
			<form onSubmit={handleSubmit}>
				{renderFields(formValues)}
				{error && <div className="warning_text">{error}</div>}
				<Button
					label={STRINGS.WITHDRAWALS_BUTTON_TEXT}
					disabled={pristine || submitting || !valid}
					onClick={this.onOpenDialog}
				/>
				<Dialog
					isOpen={dialogIsOpen}
					label="withdraw-modal"
					onCloseDialog={this.onCloseDialog}
					shouldCloseOnOverlayClick={dialogOtpOpen}
				>
					{dialogOtpOpen ? (
						<OtpForm
							onSubmit={this.onSubmitOtp}
							onClickHelp={openContactForm}
						/>
					) : !submitting ? (
						<ReviewModalContent
							symbol={symbol}
							data={data}
							price={currentPrice}
							onClickAccept={this.onAcceptDialog}
							onClickCancel={this.onCloseDialog}
						/>
					) : (
						<Loader relative={true} background={false} />
					)}
				</Dialog>
			</form>
		);
	}
}

const WithdrawForm = reduxForm({
	form: FORM_NAME,
	onSubmitFail: setWithdrawNotificationError,
	onSubmitSuccess: ({ data }, dispatch) => {
		dispatch(reset(FORM_NAME));
		dispatch(setWithdrawNotificationSuccess(data, dispatch));
	},
	enableReinitialize: true,
	validate
})(Form);

const mapStateToForm = (state) => ({
	data: selector(state, 'address', 'amount', 'fee')
});

const WithdrawFormWithValues = connect(mapStateToForm)(WithdrawForm);

export default WithdrawFormWithValues;
