import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';

import STRINGS from '../../config/localizedStrings';

import {
	required,
	minValue,
	maxValue,
	checkBalance // eslint-disable-line
} from '../../components/Form/validations';
import { requestFiatDeposit } from '../../actions/walletActions';
import { Dialog } from '../../components';

import DepositForm from './Form';
import ReviewBankDeposit from './ReviewBankDeposit';

class BankDeposit extends Component {
	state = {
		dialogIsOpen: false,
		symbol: 'fiat',
		formFields: {},
		initialValues: {},
		data: {},
		ready: false
	};

	componentDidMount() {
		const { minAmount, maxAmount, available, fee, currencyName, depositPrice } = this.props;
		this.generateFormFields(available, fee, minAmount, maxAmount, currencyName, depositPrice);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			const { minAmount, maxAmount, available, fee, currencyName, depositPrice } = nextProps;
			this.generateFormFields(
				available,
				fee,
				minAmount,
				maxAmount,
				currencyName,
				depositPrice
			);
		}
	}

	generateFormFields = (
		available = 0,
		fee = 0,
		minAmount,
		maxAmount,
		currencyName,
		depositPrice = 0
	) => {
		const formFields = {
			amount: {
				type: 'number',
				min: minAmount,
				max: maxAmount,
				validate: [
					required,
					minValue(minAmount, STRINGS.WITHDRAWALS_MIN_VALUE_ERROR),
					maxValue(maxAmount, STRINGS.WITHDRAWALS_MAX_VALUE_ERROR)
					// checkBalance(available, STRINGS.formatString(STRINGS.WITHDRAWALS_LOWER_BALANCE, currencyName), fee),
				],
				label: STRINGS.formatString(
					STRINGS.DEPOSITS_FORM_AMOUNT_LABEL,
					currencyName
				),
				placeholder: STRINGS.formatString(
					STRINGS.DEPOSITS_FORM_AMOUNT_PLACEHOLDER,
					currencyName
				)
			}
		};

		const initialValues = {
			amount: depositPrice > minAmount ? depositPrice : minAmount
		};
		this.setState({ formFields, initialValues, ready: true });
	};

	onSubmitDeposit = ({ amount }) => {
		return requestFiatDeposit(amount)
			.then(({ data }) => {
				this.setState({ data });
				this.onOpenDialog();
			})
			.catch((err) => {
				// console.log(err);
				const _error = err.response.data
					? err.response.data.message
					: err.message;

				throw new SubmissionError({ _error });
			});
	};

	onOpenDialog = () => {
		this.setState({ dialogIsOpen: true });
	};

	onCloseDialog = () => {
		this.setState({ dialogIsOpen: false });
	};

	render() {
		const { formFields, dialogIsOpen, data, initialValues, ready } = this.state;

		if (!ready) {
			return <div />;
		}

		return (
			<div>
				<DepositForm
					onSubmit={this.onSubmitDeposit}
					formFields={formFields}
					buttonLabel={STRINGS.DEPOSITS_BUTTON_TEXT}
					initialValues={initialValues}
				/>
				<Dialog
					isOpen={dialogIsOpen}
					label="deposit-modal"
					onCloseDialog={this.onCloseDialog}
					shouldCloseOnOverlayClick={false}
					showCloseText={true}
				>
					<ReviewBankDeposit data={data} onClickPay={this.onCloseDialog} />
				</Dialog>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	activeLanguage: store.app.language
});

export default connect(mapStateToProps)(BankDeposit);
