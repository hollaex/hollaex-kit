import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	reduxForm,
	formValueSelector,
	reset,
	SubmissionError,
	stopSubmit,
} from 'redux-form';
import { bindActionCreators } from 'redux';
import math from 'mathjs';
import { Dialog, OtpForm, Loader, SmartTarget } from 'components';
import {
	setWithdrawEmailConfirmation,
	setWithdrawNotificationError,
} from './notifications';
import { BASE_CURRENCY } from 'config/constants';
import {
	calculateBaseFee,
	calculateFeeCoin,
	generateBaseInformation,
	renderLabel,
	renderNetworkField,
} from './utils';
import { setWithdrawOptionaltag, withdrawCurrency } from 'actions/appActions';
import { renderInformation } from 'containers/Wallet/components';
import { assetsSelector } from 'containers/Wallet/utils';
import Fiat from './Fiat';
import Image from 'components/Image';
import STRINGS from 'config/localizedStrings';
import ReviewModalContent from './ReviewModalContent';
import QRScanner from './QRScanner';
import TransactionsHistory from 'containers/TransactionsHistory';
import RenderWithdraw from './Withdraw';
import { isMobile } from 'react-device-detect';

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
		currency: '',
		renderFiat: false,
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
		const { setWithdrawCurrency } = this.props;
		if (errorTimeOut) {
			clearTimeout(errorTimeOut);
		}
		setWithdrawCurrency('');
	}

	onOpenDialog = (ev) => {
		// if (ev && ev.preventDefault) {
		// 	ev.preventDefault();
		// }
		// const emailMethod = this.props?.data?.method === 'email';
		// const currentCurrency = coins[getWithdrawCurrency]?.symbol || currency;
		// const network = getWithdrawNetworkOptions ? getWithdrawNetworkOptions : getWithdrawNetwork ? getWithdrawNetwork : !emailMethod ? this.props?.data?.network : 'email'
		// const amount = getWithdrawAmount ? getWithdrawAmount : this.props?.data?.amount
		// getWithdrawalMax(
		// 	currentCurrency,
		// 	network
		// )
		// .then((res) => {
		// 		if (math.larger(amount, res?.data?.amount)) {
		// 			message.error(
		// 				`requested amount exceeds maximum withrawal limit of ${res?.data?.amount
		// 				} ${currentCurrency.toUpperCase()}`
		// 			);
		// 		} else {
		// 			this.setState({ dialogIsOpen: true });
		// 		}
		// 	})
		// 	.catch((err) => {
		// 		message.error(err?.response?.data?.message);
		// 	});

		this.setState({ dialogIsOpen: true });
	};

	onCloseDialog = (ev) => {
		if (ev && ev.preventDefault) {
			ev.preventDefault();
		}
		this.setState({ dialogIsOpen: false, dialogOtpOpen: false });
	};

	onAcceptDialog = () => {
		const {
			data,
			email,
			getWithdrawNetworkOptions,
			getWithdrawNetwork,
			getWithdrawAmount,
			getWithdrawAddress,
			getWithdrawCurrency,
			currency,
			coins,
			optionalTag,
		} = this.props;
		const currentCurrency = getWithdrawCurrency
			? getWithdrawCurrency
			: currency;
		const coinLength =
			coins[getWithdrawCurrency]?.network &&
			coins[getWithdrawCurrency]?.network.split(',');
		const network =
			coinLength && coinLength === 1
				? getWithdrawNetworkOptions
					? getWithdrawNetworkOptions
					: getWithdrawNetwork
				: renderNetworkField(getWithdrawNetworkOptions)?.toLowerCase();
		const defaultNetwork =
			currentCurrency &&
			coins[currentCurrency]?.network &&
			coins[currentCurrency]?.network !== 'other'
				? coins[currentCurrency]?.network
				: coins[currentCurrency]?.symbol;
		if (this.props.otp_enabled) {
			this.setState({ dialogOtpOpen: true });
		} else {
			this.onCloseDialog();
			// this.props.submit();
			let values = {
				...data,
				email: email,
				amount: getWithdrawAmount,
				address: optionalTag
					? `${getWithdrawAddress}:${optionalTag}`
					: getWithdrawAddress,
				fee_coin: currentCurrency,
				network: network ? network : defaultNetwork,
			};
			if (!coins[currentCurrency]?.network) {
				delete values.network;
			}
			return this.props
				.onSubmitWithdrawReq({
					...values,
					amount: math.eval(values.amount),
				})
				.then((response) => {
					this.props.onSubmitSuccess(
						{ ...response.data, currency: currentCurrency },
						this.props.dispatch
					);
					return response;
				})
				.catch((err) => {
					const error = { _error: err.message, ...err.errors };
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
		const {
			data,
			coins,
			currency,
			getWithdrawCurrency,
			getWithdrawAmount,
			getWithdrawAddress,
			selectedMethod,
			receiverWithdrawalEmail,
			getWithdrawNetworkOptions,
			getWithdrawNetwork,
			optionalTag,
		} = this.props;
		const network = getWithdrawNetworkOptions
			? getWithdrawNetworkOptions
			: getWithdrawNetwork;
		const currentCurrency = getWithdrawCurrency
			? getWithdrawCurrency
			: currency;
		const defaultNetwork =
			currentCurrency &&
			coins[currentCurrency]?.network &&
			coins[currentCurrency]?.network !== 'other'
				? coins[currentCurrency]?.network
				: coins[currentCurrency]?.symbol;
		let values = { ...data };
		if (selectedMethod === 'Email') {
			values = {
				...data,
				email: receiverWithdrawalEmail,
				amount: getWithdrawAmount,
				address: '',
				method: 'email',
				network: network ? network : defaultNetwork,
			};
		} else {
			values = {
				...data,
				amount: getWithdrawAmount,
				address: optionalTag
					? `${getWithdrawAddress}:${optionalTag}`
					: getWithdrawAddress,
				network: network ? network : defaultNetwork,
			};
		}
		if (!coins[currentCurrency]?.network) {
			delete values.network;
		}
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
						this.props.onSubmitFail(err.errors, this.props.dispatch);
						this.onCloseDialog();
						this.props.dispatch(stopSubmit(FORM_NAME, error));
					}
					throw err;
				} else {
					const error = { _error: err.message };
					this.props.onSubmitFail(error, this.props.dispatch);
					this.onCloseDialog();
					this.props.dispatch(stopSubmit(FORM_NAME, error));
					throw new SubmissionError(error);
				}
			});
	};

	UpdateCurrency = (currency) => {
		this.setState({ currency });
	};

	render() {
		const {
			submitting,
			error,
			data,
			openContactForm,
			currentPrice,
			coins,
			titleSection,
			icons: ICONS,
			selectedNetwork,
			targets,
			qrScannerOpen,
			closeQRScanner,
			getQRData,
			balance,
			links,
			orders,
			pinnedAssets,
			assets,
			currency,
			getWithdrawAmount,
			getWithdrawAddress,
			getWithdrawCurrency,
			getWithdrawNetworkOptions,
			getWithdrawNetwork,
			getFee,
			isFiat,
			selectedMethod,
			receiverWithdrawalEmail,
			optionalTag,
			router,
			onHandleScan,
		} = this.props;

		const currentNetwork = getWithdrawNetworkOptions
			? getWithdrawNetworkOptions
			: getWithdrawNetwork;

		const feeCoin = calculateFeeCoin(
			currency,
			getWithdrawNetworkOptions,
			coins
		);

		const formData = {
			...data,
			fee: selectedMethod === 'Email' ? 0 : getFee,
			amount: getWithdrawAmount,
			destination_tag: optionalTag && optionalTag,
			address:
				selectedMethod === 'Email'
					? ''
					: // : optionalTag
					  // ? `${getWithdrawAddress}:${optionalTag}`
					  getWithdrawAddress,
			network: selectedMethod === 'Email' ? 'email' : currentNetwork,
			fee_coin: feeCoin,
			method: selectedMethod === 'Email' ? 'email' : 'address',
			email: selectedMethod === 'Email' ? receiverWithdrawalEmail : null,
		};
		const coinObject = coins[getWithdrawCurrency] || coins[currency];
		const { dialogIsOpen, dialogOtpOpen } = this.state;
		const hasDestinationTag =
			currency === 'xrp' ||
			currency === 'xlm' ||
			selectedNetwork === 'xlm' ||
			selectedNetwork === 'ton';
		const GENERAL_ID = 'REMOTE_COMPONENT__FIAT_WALLET_WITHDRAW';
		const currencySpecificId = `${GENERAL_ID}__${currency.toUpperCase()}`;
		const id = targets.includes(currencySpecificId)
			? currencySpecificId
			: GENERAL_ID;
		const currentCurrency = getWithdrawCurrency
			? getWithdrawCurrency
			: currency;

		const withdrawInformation = renderInformation(
			currentCurrency,
			balance,
			false,
			generateBaseInformation,
			coins,
			'withdraw',
			links,
			ICONS['BLUE_QUESTION'],
			'BLUE_QUESTION',
			orders
		);

		if ((coinObject && coinObject.type !== 'fiat') || !coinObject) {
			return (
				<SmartTarget
					id={currencySpecificId}
					titleSection={titleSection}
					currency={currency}
				>
					<form autoComplete="off" className="withdraw-form-wrapper">
						<div className="withdraw-form d-flex">
							<div className="w-100">
								{!coinObject?.allow_withdrawal && this.state.currency && (
									<div className="d-flex mb-5">
										<div className="withdraw-deposit-icon-wrapper">
											<Image
												iconId={'CLOCK'}
												icon={ICONS['CLOCK']}
												svgWrapperClassName="action_notification-svg withdraw-deposit-icon"
											/>
										</div>
										<span className="withdraw-deposit-content">
											{renderLabel('ACCORDIAN.DISABLED_WITHDRAW_CONTENT')}
										</span>
									</div>
								)}
								{this.state.currency && coinObject?.allow_withdrawal && (
									<div className="d-flex">
										<Image
											iconId="WITHDRAW"
											icon={ICONS['WITHDRAW']}
											wrapperClassName="form_currency-ball margin-aligner"
										/>
										{withdrawInformation}
									</div>
								)}
								<RenderWithdraw
									pinnedAssets={pinnedAssets}
									assets={assets}
									UpdateCurrency={this.UpdateCurrency}
									coins={coins}
									onOpenDialog={this.onOpenDialog}
									isFiat={isFiat}
									currency={currency}
									router={router}
									onHandleScan={onHandleScan}
									selectedNetwork={selectedNetwork}
								/>
								{!error && <div className="warning_text">{error}</div>}
							</div>
							{!isMobile && (
								<div className="side-icon-wrapper">
									<Image
										iconId={'WITHDRAW_TITLE'}
										icon={ICONS['WITHDRAW_TITLE']}
										alt={'text'}
										svgWrapperClassName="withdraw-main-icon"
									/>
								</div>
							)}
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
									isWithdraw={true}
								/>
							) : !submitting ? (
								<ReviewModalContent
									coins={coins}
									currency={currentCurrency}
									data={formData}
									price={currentPrice}
									onClickAccept={this.onAcceptDialog}
									onClickCancel={this.onCloseDialog}
									hasDestinationTag={hasDestinationTag}
									getWithdrawCurrency={getWithdrawCurrency}
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
					<TransactionsHistory
						isFromWallet={true}
						selectedAsset={getWithdrawCurrency}
					/>
				</SmartTarget>
			);
		} else if (coinObject && coinObject.type === 'fiat') {
			return (
				<Fiat
					id={id}
					titleSection={titleSection}
					currency={currency}
					withdrawInformation={withdrawInformation}
				/>
			);
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
		'fee',
		'fee_coin',
		'email',
		'fee_type',
		'method'
	),
	coins: state.app.coins,
	targets: state.app.targets,
	balance: state.user.balance,
	pinnedAssets: state.app.pinned_assets,
	assets: assetsSelector(state),
	getWithdrawCurrency: state.app.withdrawFields.withdrawCurrency,
	getWithdrawNetwork: state.app.withdrawFields.withdrawNetwork,
	getWithdrawNetworkOptions: state.app.withdrawFields.withdrawNetworkOptions,
	getWithdrawAddress: state.app.withdrawFields.withdrawAddress,
	getWithdrawAmount: state.app.withdrawFields.withdrawAmount,
	optionalTag: state.app.withdrawFields.optionalTag,
	getFee: state.app.withdrawFields.withdrawFee,
	isValidAddress: state.app.isValidAddress,
	selectedMethod: state.app.selectedWithdrawMethod,
	receiverWithdrawalEmail: state.app.receiverWithdrawalEmail,
});

const mapDispatchToProps = (dispatch) => ({
	setWithdrawCurrency: bindActionCreators(withdrawCurrency, dispatch),
	setWithdrawOptionaltag: bindActionCreators(setWithdrawOptionaltag, dispatch),
});

const WithdrawFormWithValues = connect(
	mapStateToForm,
	mapDispatchToProps
)(WithdrawForm);

export default WithdrawFormWithValues;
