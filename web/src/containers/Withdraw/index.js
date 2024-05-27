import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { formValueSelector, change } from 'redux-form';
import { isMobile } from 'react-device-detect';
import math from 'mathjs';
import { message } from 'antd';

import WithdrawCryptocurrency from './form';
import strings from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Loader, MobileBarBack } from 'components';
import { getCurrencyFromName } from 'utils/currency';
import {
	performWithdraw,
	// requestWithdrawFee
} from 'actions/walletActions';
import { errorHandler } from 'components/OtpForm/utils';
import {
	openContactForm,
	getWithdrawalMax,
	withdrawAddress,
	setReceiverEmail,
} from 'actions/appActions';
import { generateFormValues, generateInitialValues } from './formUtils';
import { renderNeedHelpAction, renderTitleSection } from '../Wallet/components';
import { FORM_NAME } from './form';
import { STATIC_ICONS } from 'config/icons';
import { renderBackToWallet } from 'containers/Deposit/utils';
import { IconTitle } from 'hollaex-web-lib';

class Withdraw extends Component {
	state = {
		formValues: {},
		initialValues: {},
		checked: false,
		currency: '',
		selectedMethodData: 'address',
		qrScannerOpen: false,
	};

	UNSAFE_componentWillMount() {
		if (this.props.verification_level) {
			this.validateRoute(this.props.routeParams.currency, this.props.coins);
		}
		this.setCurrency(this.props.routeParams.currency);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (!this.state.checked) {
			if (
				nextProps.verification_level &&
				nextProps.verification_level !== this.props.verification_level
			) {
				this.validateRoute(nextProps.routeParams.currency, this.props.coins);
			}
		} else if (
			nextProps.activeLanguage !== this.props.activeLanguage ||
			nextProps.selectedNetwork !== this.props.selectedNetwork
		) {
			this.generateFormValues(
				getCurrencyFromName(nextProps.routeParams.currency, nextProps.coins),
				nextProps.balance,
				nextProps.coins,
				nextProps.verification_level,
				this.state.networks,
				nextProps.selectedNetwork,
				this.handleMethodChange
			);
		}

		if (nextProps.selectedMethod !== this.props.selectedMethod) {
			this.generateFormValues(
				getCurrencyFromName(nextProps.routeParams.currency, nextProps.coins),
				nextProps.balance,
				nextProps.coins,
				nextProps.verification_level,
				this.state.networks,
				nextProps.selectedNetwork,
				nextProps.selectedMethod,
				this.handleMethodChange
			);
		}
		if (nextProps.routeParams.currency !== this.props.routeParams.currency) {
			this.setCurrency(nextProps.routeParams.currency);
		}
	}

	componentWillUnmount() {
		this.props.setWithdrawAddress('');
		this.props.setReceiverEmail('');
	}

	validateRoute = (currency, coins) => {
		if (this.props.isDepositAndWithdraw) {
			this.props.router.push('/wallet/withdraw');
		} else if (!coins[currency]) {
			this.props.router.push('/wallet');
		} else if (currency) {
			this.setState({ checked: true });
		}
	};

	setCurrency = (currencyName) => {
		const currency = getCurrencyFromName(currencyName, this.props.coins);
		if (currency) {
			const { coins } = this.props;
			const coin = coins[currency];
			const networks = coin.network && coin.network.split(',');
			let initialNetwork;
			if (networks && networks.length === 1) {
				initialNetwork = networks[0];
			}

			this.setState(
				{
					currency,
					checked: false,
					networks,
				},
				() => {
					this.validateRoute(this.props.routeParams.currency, this.props.coins);
					this.generateFormValues(
						currency,
						this.props.balance,
						this.props.coins,
						this.props.verification_level,
						networks,
						initialNetwork,
						this.state.selectedMethod,
						this.handleMethodChange
					);
				}
			);
			// if (currency === 'btc' || currency === 'bch' || currency === 'eth') {
			// 	this.props.requestWithdrawFee(currency);
			// }
		} else if (this.props.isDepositAndWithdraw) {
			this.props.router.push('/wallet/withdraw');
		} else {
			this.props.router.push('/wallet');
		}
	};

	handleMethodChange = (selectedMethodData) => {
		this.setState({ selectedMethodData });
	};

	generateFormValues = (
		currency,
		balance,
		coins,
		verification_level,
		networks,
		network,
		selectedMethod,
		handleMethodChange
	) => {
		const {
			icons: ICONS,
			router: {
				location: { query },
			},
			coin_customizations,
		} = this.props;
		const formValues = generateFormValues(
			currency,
			balance,
			this.onCalculateMax,
			coins,
			verification_level,
			this.props.activeTheme,
			STATIC_ICONS['MAX_ICON'],
			'MAX_ICON',
			networks,
			network,
			ICONS,
			selectedMethod,
			handleMethodChange,
			this.openQRScanner
		);

		let initialValues = generateInitialValues(
			currency,
			coins,
			networks,
			network,
			query,
			verification_level,
			selectedMethod,
			coin_customizations
		);

		this.setState({ formValues, initialValues });
	};

	onSubmitWithdraw = (currency) => (values) => {
		const { destination_tag, network, ...rest } = values;
		const { getWithdrawCurrency, selectedWithdrawMethod } = this.props;

		const currentCurrency = getWithdrawCurrency
			? getWithdrawCurrency
			: this.state.currency;

		let address = rest.address.trim();
		if (destination_tag) address = `${rest.address.trim()}:${destination_tag}`;

		let paramData = {
			...(network ? { network } : {}),
			...rest,
			address,
			amount: math.eval(values.amount),
			currency: currentCurrency,
			method: selectedWithdrawMethod === 'Email' ? 'email' : 'address',
			network: selectedWithdrawMethod === 'Email' ? 'email' : network,
		};

		delete paramData.fee_type;
		delete paramData.fee;

		if (values && values.email) {
			paramData = {
				...paramData,
				network: 'email',
				address: values && values.email && values.email.toLowerCase(),
			};
			delete paramData.email;
		}

		return performWithdraw(currentCurrency, paramData)
			.then((response) => {
				return { ...response.data, currency: this.state.currency };
			})
			.catch(errorHandler);
	};

	onCalculateMax = () => {
		const { selectedNetwork, selectedMethod, dispatch } = this.props;
		const { currency } = this.state;

		const emailMethod = selectedMethod === 'email';
		getWithdrawalMax(currency, !emailMethod ? selectedNetwork : 'email')
			.then((res) => {
				dispatch(change(FORM_NAME, 'amount', res.data.amount));
			})
			.catch((err) => {
				message.error(err.response.data.message);
			});
	};

	openQRScanner = () => {
		this.setState({ qrScannerOpen: true });
	};

	closeQRScanner = () => {
		this.setState({ qrScannerOpen: false });
	};

	getQRData = (data) => {
		const { currency } = this.state;
		const { dispatch, selectedNetwork } = this.props;

		if (
			currency === 'xrp' ||
			currency === 'xlm' ||
			selectedNetwork === 'xlm' ||
			selectedNetwork === 'ton'
		) {
			const [address = '', destinationTag = ''] = data?.split(':') || [];
			dispatch(change(FORM_NAME, 'address', address));
			dispatch(change(FORM_NAME, 'destination_tag', destinationTag));
		} else {
			dispatch(change(FORM_NAME, 'address', data));
		}
	};

	onGoBack = () => {
		this.props.router.push('/wallet');
	};

	render() {
		const {
			balance,
			prices,
			otp_enabled,
			openContactForm,
			activeLanguage,
			router,
			icons: ICONS,
			selectedNetwork,
			email,
			orders,
			coins,
			getWithdrawCurrency,
			isDepositAndWithdraw,
		} = this.props;
		const { links = {} } = this.props.constants;
		const {
			formValues,
			initialValues,
			currency,
			checked,
			selectedMethodData,
			qrScannerOpen,
		} = this.state;
		if ((!currency || !checked) && !this.props.isDepositAndWithdraw) {
			return <div />;
		}

		const balanceAvailable = balance[`${currency}_available`];

		if (balanceAvailable === undefined && !this.props.isDepositAndWithdraw) {
			return <Loader />;
		}

		const isFiat = coins[getWithdrawCurrency]?.type === 'fiat';

		const formProps = {
			currency,
			onSubmitWithdrawReq: this.onSubmitWithdraw(currency),
			onOpenDialog: this.onOpenDialog,
			otp_enabled,
			openContactForm,
			formValues,
			initialValues,
			activeLanguage,
			balanceAvailable,
			currentPrice: prices[currency],
			router,
			icons: ICONS,
			selectedNetwork,
			email,
			selectedMethodData,
			closeQRScanner: this.closeQRScanner,
			qrScannerOpen,
			getQRData: this.getQRData,
			balance,
			links,
			orders,
			isFiat,
			isDepositAndWithdraw,
		};

		return (
			<div>
				{isMobile && (
					<MobileBarBack onBackClick={this.onGoBack}></MobileBarBack>
				)}
				<div className="presentation_container apply_rtl withdrawal-container">
					{!isMobile &&
						isFiat &&
						renderTitleSection(
							getWithdrawCurrency,
							'withdraw',
							ICONS['WITHDRAW'],
							coins,
							'WITHDRAW'
						)}
					{/* // This commented code can be used if you want to enforce user to have a verified bank account before doing the withdrawal
					{verification_level >= MIN_VERIFICATION_LEVEL_TO_WITHDRAW &&
					verification_level <= MAX_VERIFICATION_LEVEL_TO_WITHDRAW ? ( */}
					<div className="inner_container">
						{!isFiat && (
							<IconTitle
								stringId="WITHDRAW_PAGE.WITHDRAW"
								text={strings['WITHDRAW_PAGE.WITHDRAW']}
								iconId="WITHDRAW_TITLE"
								iconPath={ICONS['WITHDRAW_TITLE']}
								className="withdraw-icon mb-3 withdraw-main-icon"
							/>
						)}
						<div
							className={
								isFiat ? 'mt-5 information_block' : 'information_block'
							}
						>
							<div className="information_block-text_wrapper" />
							{renderBackToWallet()}
							{openContactForm &&
								renderNeedHelpAction(
									openContactForm,
									links,
									ICONS['BLUE_QUESTION'],
									'BLUE_QUESTION'
								)}
						</div>
						<WithdrawCryptocurrency {...formProps} />
						{/* {renderExtraInformation(currency, bank_account, ICONS["BLUE_QUESTION"])} */}
					</div>
					{/* // This commented code can be used if you want to enforce user to have a verified bank account before doing the withdrawal
						) : (
						<div className={classnames('inner_container', 'with_border_top')}>
							<WarningVerification level={verification_level} />
						</div>
					)} */}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	prices: store.asset.oraclePrices,
	balance: store.user.balance,
	// fee: store.user.fee,
	verification_level: store.user.verification_level,
	otp_enabled: store.user.otp_enabled,
	bank_account: store.user.userData.bank_account,
	activeLanguage: store.app.language,
	// btcFee: store.wallet.btcFee,
	selectedFee: formValueSelector(FORM_NAME)(store, 'fee'),
	fee_coin: formValueSelector(FORM_NAME)(store, 'fee_coin'),
	fee_type: formValueSelector(FORM_NAME)(store, 'fee_type'),
	selectedNetwork: formValueSelector(FORM_NAME)(store, 'network'),
	selectedMethod: formValueSelector(FORM_NAME)(store, 'method'),
	email: formValueSelector(FORM_NAME)(store, 'email'),
	coins: store.app.coins,
	activeTheme: store.app.theme,
	constants: store.app.constants,
	config_level: store.app.config_level,
	orders: store.order.activeOrders,
	coin_customizations: store.app.constants.coin_customizations,
	getWithdrawCurrency: store.app.withdrawFields.withdrawCurrency,
	getWithdrawNetwork: store.app.withdrawFields.withdrawNetwork,
	isDepositAndWithdraw: store.app.depositAndWithdraw,
	selectedWithdrawMethod: store.app.selectedWithdrawMethod,
});

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch),
	setWithdrawAddress: bindActionCreators(withdrawAddress, dispatch),
	setReceiverEmail: bindActionCreators(setReceiverEmail, dispatch),
	// requestWithdrawFee: bindActionCreators(requestWithdrawFee, dispatch),
	dispatch,
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(Withdraw));
