import React, { Component, Fragment } from 'react';
import math from 'mathjs';
import { connect } from 'react-redux';
import {
	reduxForm,
	formValueSelector,
	reset,
	SubmissionError,
	stopSubmit,
} from 'redux-form';
import renderFields from 'components/Form/factoryFields';
import ReviewModalContent from './ReviewModalContent';
import {
	Button,
	IconTitle,
	EditWrapper,
	Dialog,
	OtpForm,
	Coin,
} from 'components';
import { DEFAULT_COIN_DATA } from 'config/constants';
import { getDecimals } from 'utils/utils';
import PendingWithdrawal from './PendingWithdrawal';
import { withdrawFiat } from 'actions/walletActions';
import { withRouter } from 'react-router';
import STRINGS from 'config/localizedStrings';
import { getFiatWithdrawalFee } from 'containers/Deposit/Fiat/utils';

export const FORM_NAME = 'FiatWithdrawalForm';
export const selector = formValueSelector(FORM_NAME);

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

class Index extends Component {
	state = {
		dialogIsOpen: false,
		dialogOtpOpen: false,
		successfulRequest: false,
		otp_code: '',
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
	}

	componentWillUnmount() {
		if (errorTimeOut) {
			clearTimeout(errorTimeOut);
		}
	}

	onSubmitWithdrawReq = (values) => {
		const { currency } = this.props;
		const { bank, ...rest } = values;
		const data = {
			...rest,
			bank_id: bank,
			currency,
		};

		return withdrawFiat(data);
	};

	onAcceptDialog = () => {
		const {
			user: { otp_enabled },
			currency,
			coins,
		} = this.props;
		const { increment_unit } = coins[currency] || DEFAULT_COIN_DATA;
		const decimals = getDecimals(increment_unit);

		if (otp_enabled) {
			this.setState({ dialogOtpOpen: true });
		} else {
			this.onCloseDialog();
			// this.props.submit();
			const values = this.props.data;
			return this.onSubmitWithdrawReq({
				...values,
				amount: math.round(values.amount, decimals),
			})
				.then((response) => {
					this.props.onSubmitSuccess(
						{ ...response.data, currency: this.props.currency },
						this.props.dispatch
					);
					this.setState({ successfulRequest: true });
					this.onOpenDialog();
					return response;
				})
				.catch((err = { response: { data: {} } }) => {
					const error = {
						_error: err.response.data.message
							? err.response.data.message
							: err.message,
						...err.errors,
					};
					this.props.onSubmitFail(err.errors || err, this.props.dispatch);
					this.onCloseDialog();
					this.props.dispatch(stopSubmit(FORM_NAME, error));
					// throw new SubmissionError(error);
				});
		}
	};

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
		this.setState({
			dialogIsOpen: false,
			dialogOtpOpen: false,
			successfulRequest: false,
		});
	};

	onSubmitOtp = ({ otp_code = '' }) => {
		const { coins, currency } = this.props;
		const { increment_unit } = coins[currency] || DEFAULT_COIN_DATA;
		const decimals = getDecimals(increment_unit);

		const values = this.props.data;
		return this.onSubmitWithdrawReq({
			...values,
			amount: math.round(values.amount, decimals),
			otp_code,
		})
			.then((response) => {
				this.onCloseDialog();
				this.props.onSubmitSuccess(
					{ ...response.data, currency: this.props.currency },
					this.props.dispatch
				);
				this.setState({ successfulRequest: true });
				this.onOpenDialog();
				return response;
			})
			.catch((err = { response: { data: {} } }) => {
				if (err instanceof SubmissionError) {
					if (err.errors && !err.errors.otp_code) {
						const error = {
							_error: err.response.data.message
								? err.response.data.message
								: err.message,
							...err.errors,
						};
						this.props.onSubmitFail(err.errors, this.props.dispatch);
						this.onCloseDialog();
						this.props.dispatch(stopSubmit(FORM_NAME, error));
					}
					throw err;
				} else {
					const error = {
						_error: err.response.data.message
							? err.response.data.message
							: err.message,
					};
					this.props.onSubmitFail(error, this.props.dispatch);
					this.onCloseDialog();
					this.props.dispatch(stopSubmit(FORM_NAME, error));
					throw new SubmissionError(error);
				}
			});
	};

	renderContent = () => {
		return this.renderBankContent();
	};

	renderButtonSection = () => {
		return this.renderBankButtonSection();
	};

	renderBankContent = () => {
		const { formValues } = this.props;

		return <Fragment>{renderFields(formValues)}</Fragment>;
	};

	renderBankButtonSection = () => {
		const {
			data,
			submitting,
			pristine,
			valid,
			router,
			user: { id_data = {} } = {},
			banks,
		} = this.props;

		const is_verified = id_data.status === 3;
		const has_verified_bank_account = !!banks.length;

		return (
			<Fragment>
				{(!is_verified || !has_verified_bank_account) && (
					<Button
						label={STRINGS['PROCEED']}
						stringId="PROCEED"
						onClick={() => router.push('/verification?banks')}
						className="mb-3"
					/>
				)}
				{is_verified && has_verified_bank_account && data.bank && (
					<Button
						label={STRINGS['WITHDRAWALS_BUTTON_TEXT']}
						stringId="WITHDRAWALS_BUTTON_TEXT"
						disabled={pristine || submitting || !valid}
						onClick={this.onOpenDialog}
						className="mb-3"
					/>
				)}
			</Fragment>
		);
	};

	render() {
		const {
			user: { id_data = {} } = {},
			submitting,
			error,
			currency,
			data,
			coins,
			currentPrice,
			titleSection,
			icons: ICONS,
			activeTab,
			router,
			banks,
			fiat_fees,
			withdrawInformation,
			getWithdrawCurrency,
		} = this.props;
		const { dialogIsOpen, dialogOtpOpen, successfulRequest } = this.state;

		const is_verified = id_data.status === 3;
		const has_verified_bank_account = !!banks.length;

		const { icon_id } = coins[getWithdrawCurrency] || coins[currency];

		const { rate: fee } = getFiatWithdrawalFee(
			currency,
			0,
			'',
			getWithdrawCurrency
		);
		const customFee = getWithdrawCurrency
			? fiat_fees?.[getWithdrawCurrency]?.withdrawal_fee
			: fiat_fees?.[currency]?.withdrawal_fee;

		return (
			<div className="withdraw-form-wrapper">
				<div className="withdraw-form">
					<Coin iconId={icon_id} type="CS9" />
					{withdrawInformation}
					{titleSection}
					{!is_verified && (
						<Fragment>
							<IconTitle
								text={STRINGS['VERIFICATION_TITLE']}
								stringId="VERIFICATION_TITLE"
								iconId="FIAT_KYC"
								iconPath={ICONS['FIAT_KYC']}
								className="flex-direction-column"
							/>
							<div className="text-align-center py-4">
								<EditWrapper stringId="VERIFY_BANK_WITHDRAW">
									{STRINGS['VERIFY_BANK_WITHDRAW']}
								</EditWrapper>
							</div>
						</Fragment>
					)}
					{!has_verified_bank_account && (
						<Fragment>
							<IconTitle
								text={STRINGS['NO_VERIFIED_BANK']}
								stringId="NO_VERIFIED_BANK"
								iconId="FIAT_KYC"
								iconPath={ICONS['FIAT_KYC']}
								className="flex-direction-column"
							/>
							<div className="text-align-center py-4">
								<EditWrapper stringId="NO_VERIFIED_BANK_DESC">
									{STRINGS.formatString(
										STRINGS['NO_VERIFIED_BANK_DESC'],
										coins[currency].fullname
									)}
								</EditWrapper>
							</div>
						</Fragment>
					)}
					{is_verified && has_verified_bank_account && (
						<Fragment>
							<div className="py-4">
								<EditWrapper stringId="WITHDRAW_NOTE">
									{STRINGS['WITHDRAW_NOTE']}
								</EditWrapper>
							</div>
							{customFee ? (
								<div>
									<div>
										Fee:{' '}
										<span style={{ fontWeight: 'bold' }}>
											{customFee} {currency?.toUpperCase()}
										</span>
									</div>
								</div>
							) : (
								<></>
							)}
							{this.renderContent()}
						</Fragment>
					)}
					{error && <div className="warning_text">{error}</div>}
				</div>

				<div className="btn-wrapper">{this.renderButtonSection()}</div>

				<Dialog
					isOpen={dialogIsOpen}
					label="withdraw-modal"
					onCloseDialog={this.onCloseDialog}
					shouldCloseOnOverlayClick={dialogOtpOpen}
					showCloseText={false}
				>
					{dialogOtpOpen ? (
						<OtpForm onSubmit={this.onSubmitOtp} />
					) : successfulRequest ? (
						<PendingWithdrawal
							onOkay={() => router.push('/transactions?tab=3')}
						/>
					) : !submitting ? (
						<ReviewModalContent
							activeTab={activeTab}
							banks={banks}
							coins={coins}
							currency={currency}
							data={{ ...data, fee: customFee || fee }}
							price={currentPrice}
							onClickAccept={this.onAcceptDialog}
							onClickCancel={this.onCloseDialog}
						/>
					) : null}
				</Dialog>
			</div>
		);
	}
}

const FiatWithdrawalForm = reduxForm({
	form: FORM_NAME,
	enableReinitialize: true,
	onSubmitFail: () => console.log('failed'),
	onSubmitSuccess: (data, dispatch) => {
		dispatch(reset(FORM_NAME));
	},
	validate,
})(Index);

const mapStateToProps = (state) => ({
	data: selector(state, 'bank', 'amount', 'fee'),
	fiat_fees: state.app.constants.fiat_fees,
	getWithdrawCurrency: state.app.withdrawFields.withdrawCurrency,
});

export default connect(mapStateToProps)(withRouter(FiatWithdrawalForm));
