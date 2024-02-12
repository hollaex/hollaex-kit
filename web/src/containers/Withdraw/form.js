import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	reduxForm,
	formValueSelector,
	reset,
	SubmissionError,
	stopSubmit,
	change,
} from 'redux-form';
import math from 'mathjs';
import { Button, Dialog, OtpForm, Loader, SmartTarget } from 'components';
import renderFields from 'components/Form/factoryFields';
import {
	setWithdrawEmailConfirmation,
	setWithdrawNotificationError,
} from './notifications';
import { BASE_CURRENCY } from 'config/constants';
import { calculateBaseFee } from './utils';
import Fiat from './Fiat';
import Image from 'components/Image';
import STRINGS from 'config/localizedStrings';
import { message } from 'antd';
import { getWithdrawalMax } from 'actions/appActions';
import ReviewModalContent from './ReviewModalContent';
import QRScanner from './QRScanner';

export const FORM_NAME = 'WithdrawCryptocurrencyForm';

const selector = formValueSelector(FORM_NAME);
let errorTimeOut = null;

const validate = (values, props) => {
	const errors = {};
	const amount = math.fraction(values?.amount || 0);
	const balanceAvailable = math.fraction(props.balanceAvailable || 0);

	if (math.larger(amount, balanceAvailable)) {
		errors.fee = STRINGS.formatString(
			STRINGS['WITHDRAWALS_LOWER_BALANCE'],
			math.number(amount)
		);
	}

	return errors;
};

class Form extends Component {
	state = {
		dialogIsOpen: false,
		dialogOtpOpen: false,
		otp_code: '',
		prevFee: null,
	};

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.currency !== this.props.currency) {
			nextProps.dispatch(reset(FORM_NAME));
		}
		if (
			!nextProps.submitting &&
			nextProps.submitting !== this.props.submitting
		) {
			this.onCloseDialog();
		}

		if (
			nextProps.currency === BASE_CURRENCY &&
			(nextProps.data.amount !== this.props.data.amount ||
				(nextProps.currency === BASE_CURRENCY &&
					nextProps.amount !== this.props.currency))
		) {
			const fee = calculateBaseFee(nextProps.data.amount);
			if (fee !== nextProps.data.fee) {
				// nextProps.change('fee', fee);
			}
		}
		if (nextProps.selectedMethodData !== this.props.selectedMethodData) {
			if (
				nextProps.selectedMethodData &&
				nextProps.selectedMethodData === 'email'
			) {
				this.setState({ prevFee: nextProps.data.fee });
				nextProps.change('fee', 0);
			} else {
				if (this.state.prevFee) nextProps.change('fee', this.state.prevFee);
			}
		}
	}

	componentWillUnmount() {
		if (errorTimeOut) {
			clearTimeout(errorTimeOut);
		}
	}

	onOpenDialog = (ev) => {
		if (ev && ev.preventDefault) {
			ev.preventDefault();
		}
		getWithdrawalMax(this.props.currency, this.props?.data?.network)
			.then((res) => {
				if (math.larger(this.props?.data?.amount, res?.data?.amount)) {
					message.error(
						`requested amount exceeds maximum withrawal limit of ${
							res?.data?.amount
						} ${this?.props?.currency?.toUpperCase()}`
					);
				} else {
					this.setState({ dialogIsOpen: true });
				}
			})
			.catch((err) => {
				message.error(err.response.data.message);
			});
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
			this.onCloseDialog();
			// this.props.submit();
			const values = { ...this.props.data, email: this.props.email };
			return this.props
				.onSubmitWithdrawReq({
					...values,
					amount: math.eval(values.amount),
				})
				.then((response) => {
					this.props.onSubmitSuccess(
						{ ...response.data, currency: this.props.currency },
						this.props.dispatch
					);
					return response;
				})
				.catch((err) => {
					const error = { _error: err.message, ...err.errors };
					errorTimeOut = setTimeout(() => {
						this.props.dispatch(change(FORM_NAME, 'captcha', ''));
					}, 5000);
					this.props.onSubmitFail(err.errors || err, this.props.dispatch);
					this.onCloseDialog();
					this.props.dispatch(stopSubmit(FORM_NAME, error));
					// throw new SubmissionError(error);
				});
		}
	};

	onConfirmEmail = () => {
		this.onCloseDialog();
		this.props.router.push('/wallet');
	};

	onSubmitOtp = ({ otp_code = '' }) => {
		const values = this.props.data;
		return this.props
			.onSubmitWithdrawReq({
				...values,
				amount: math.eval(values.amount),
				otp_code,
			})
			.then((response) => {
				this.onCloseDialog();
				this.props.onSubmitSuccess(
					{ ...response.data, currency: this.props.currency },
					this.props.dispatch
				);
				return response;
			})
			.catch((err) => {
				if (err instanceof SubmissionError) {
					if (err.errors && !err.errors.otp_code) {
						const error = { _error: err.message, ...err.errors };
						errorTimeOut = setTimeout(() => {
							this.props.dispatch(change(FORM_NAME, 'captcha', ''));
						}, 5000);
						this.props.onSubmitFail(err.errors, this.props.dispatch);
						this.onCloseDialog();
						this.props.dispatch(stopSubmit(FORM_NAME, error));
					}
					throw err;
				} else {
					const error = { _error: err.message };
					errorTimeOut = setTimeout(() => {
						this.props.dispatch(change(FORM_NAME, 'captcha', ''));
					}, 5000);
					this.props.onSubmitFail(error, this.props.dispatch);
					this.onCloseDialog();
					this.props.dispatch(stopSubmit(FORM_NAME, error));
					throw new SubmissionError(error);
				}
			});
	};

	render() {
		const {
			submitting,
			pristine,
			error,
			valid,
			currency,
			data,
			openContactForm,
			formValues,
			currentPrice,
			coins,
			titleSection,
			icons: ICONS,
			selectedNetwork,
			targets,
			email,
			qrScannerOpen,
			closeQRScanner,
			getQRData,
		} = this.props;

		const formData = { ...data, email };

		const { dialogIsOpen, dialogOtpOpen } = this.state;
		const hasDestinationTag =
			currency === 'xrp' ||
			currency === 'xlm' ||
			selectedNetwork === 'xlm' ||
			selectedNetwork === 'ton';

		const coinObject = coins[currency];

		const GENERAL_ID = 'REMOTE_COMPONENT__FIAT_WALLET_WITHDRAW';
		const currencySpecificId = `${GENERAL_ID}__${currency.toUpperCase()}`;
		const id = targets.includes(currencySpecificId)
			? currencySpecificId
			: GENERAL_ID;

		if (coinObject && coinObject.type !== 'fiat') {
			return (
				<SmartTarget
					id={currencySpecificId}
					titleSection={titleSection}
					currency={currency}
				>
					<form autoComplete="off" className="withdraw-form-wrapper">
						<div className="withdraw-form">
							<div className="d-flex">
								<Image
									iconId="WITHDRAW"
									icon={ICONS['WITHDRAW']}
									wrapperClassName="form_currency-ball margin-aligner"
								/>
								{titleSection}
							</div>
							{renderFields(formValues)}
							{error && <div className="warning_text">{error}</div>}
						</div>
						<div className="btn-wrapper">
							<Button
								label={STRINGS['WITHDRAWALS_BUTTON_TEXT']}
								disabled={pristine || submitting || !valid}
								onClick={this.onOpenDialog}
								className="mb-3"
							/>
						</div>
						<Dialog
							isOpen={dialogIsOpen}
							label="withdraw-modal"
							onCloseDialog={this.onCloseDialog}
							shouldCloseOnOverlayClick={dialogOtpOpen}
							showCloseText={false}
						>
							{dialogOtpOpen ? (
								<OtpForm
									onSubmit={this.onSubmitOtp}
									onClickHelp={openContactForm}
								/>
							) : !submitting ? (
								<ReviewModalContent
									coins={coins}
									currency={currency}
									data={formData}
									price={currentPrice}
									onClickAccept={this.onAcceptDialog}
									onClickCancel={this.onCloseDialog}
									hasDestinationTag={hasDestinationTag}
								/>
							) : (
								<Loader relative={true} background={false} />
							)}
						</Dialog>
						<Dialog
							isOpen={qrScannerOpen}
							label="withdraw-modal"
							onCloseDialog={closeQRScanner}
							shouldCloseOnOverlayClick={false}
							showCloseText={true}
						>
							{qrScannerOpen && (
								<QRScanner
									closeQRScanner={closeQRScanner}
									getQRData={getQRData}
								/>
							)}
						</Dialog>
					</form>
				</SmartTarget>
			);
		} else if (coinObject && coinObject.type === 'fiat') {
			return <Fiat id={id} titleSection={titleSection} currency={currency} />;
		} else {
			return <div>{STRINGS['DEPOSIT.NO_DATA']}</div>;
		}
	}
}

const WithdrawForm = reduxForm({
	form: FORM_NAME,
	onSubmitFail: setWithdrawNotificationError,
	onSubmitSuccess: (data, dispatch) => {
		dispatch(reset(FORM_NAME));
		setWithdrawEmailConfirmation(data, dispatch);
	},
	enableReinitialize: true,
	validate,
})(Form);

const mapStateToForm = (state) => ({
	data: selector(
		state,
		'network',
		'address',
		'destination_tag',
		'amount',
		'captcha',
		'fee',
		'fee_coin',
		'email',
		'fee_type'
	),
	coins: state.app.coins,
	targets: state.app.targets,
	balance: state.user.balance,
});

const WithdrawFormWithValues = connect(mapStateToForm)(WithdrawForm);

export default WithdrawFormWithValues;
