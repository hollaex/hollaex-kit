import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';

import { BALANCE_ERROR } from 'config/constants';
import STRINGS from 'config/localizedStrings';
import { getCurrencyFromName } from 'utils/currency';
import { createAddress, cleanCreateAddress } from 'actions/userAction';
import { NOTIFICATIONS, depositCurrency } from 'actions/appActions';
import { DEFAULT_COIN_DATA } from 'config/constants';
import { openContactForm, setSnackNotification } from 'actions/appActions';
import { MobileBarBack, Dialog, Notification, IconTitle } from 'components';
import {
	renderInformation,
	renderTitleSection,
	renderNeedHelpAction,
} from '../Wallet/components';
import RenderContent, {
	generateBaseInformation,
	generateFormFields,
	renderBackToWallet,
} from './utils';
import { getWallet } from 'utils/wallet';
import QRCode from './QRCode';
import withConfig from 'components/ConfigProvider/withConfig';
import strings from 'config/localizedStrings';

class Deposit extends Component {
	state = {
		depositPrice: 0,
		currency: '',
		checked: false,
		copied: false,
		dialogIsOpen: false,
		formFields: {},
		initialValues: {},
		qrCodeOpen: false,
		depositAddress: '',
	};

	UNSAFE_componentWillMount() {
		if (this.props?.quoteData?.error === BALANCE_ERROR) {
			this.setState({ depositPrice: this.props.quoteData.data.price });
		}
		if (this.props.verification_level) {
			this.validateRoute(this.props?.routeParams?.currency, this.props.coins);
		}
		this.setCurrency(this.props?.routeParams?.currency);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { selectedNetwork, wallet, coins } = this.props;
		const { currency, networks } = this.state;

		if (!this.state.checked) {
			if (
				nextProps.verification_level &&
				nextProps.verification_level !== this.props.verification_level
			) {
				this.validateRoute(nextProps.routeParams?.currency, this.props.coins);
			}
		} else if (
			nextProps.selectedNetwork !== selectedNetwork ||
			JSON.stringify(nextProps.wallet) !== JSON.stringify(wallet) ||
			JSON.stringify(nextProps.coins) !== JSON.stringify(coins)
		) {
			this.generateFormFields(
				currency,
				nextProps.selectedNetwork,
				nextProps.wallet,
				networks,
				nextProps.coins,
				nextProps.verification_level
			);
		}

		if (nextProps.routeParams?.currency !== this.props.routeParams?.currency) {
			this.setCurrency(nextProps.routeParams?.currency);
		}

		if (
			nextProps.addressRequest?.success === true &&
			nextProps.addressRequest?.success !== this.props.addressRequest.success
		) {
			this.onCloseDialog();
		}
	}

	componentDidUpdate(prevProps) {
		const { wallet, getDepositCurrency } = this.props;
		if (prevProps.wallet !== wallet) {
			this.updateAddress(getDepositCurrency);
		}
	}

	componentWillUnmount() {
		const { setDepositCurrency } = this.props;
		setDepositCurrency('');
	}

	updateAddress = (selectedCurrency, hasNetwork = false) => {
		const { wallet, getDepositCurrency, getDepositNetworkOptions } = this.props;
		const depositAddress = wallet.filter((val) => {
			if (hasNetwork) {
				return (
					val.network === selectedCurrency &&
					val.currency === getDepositCurrency
				);
			} else if (selectedCurrency) {
				if (getDepositNetworkOptions) {
					return (
						val.network === getDepositNetworkOptions &&
						val.currency === getDepositCurrency
					);
				} else {
					return val.currency === selectedCurrency;
				}
			}
			return wallet;
		});
		this.setState({ depositAddress: depositAddress[0]?.address });
	};

	setCurrency = (currencyName) => {
		const { getDepositCurrency } = this.props;
		const currency = getCurrencyFromName(currencyName, this.props.coins);
		const isDeposit =
			this.props?.router?.location?.pathname?.split('/')?.length === 3;
		if (currency || (getDepositCurrency && !isDeposit)) {
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
					networks,
					initialNetwork,
					checked: false,
				},
				() => {
					const { currency, initialNetwork, networks } = this.state;
					const { wallet, coins, verification_level } = this.props;
					this.validateRoute(this.props.routeParams?.currency, coins);
					this.generateFormFields(
						currency,
						initialNetwork,
						wallet,
						networks,
						coins,
						verification_level
					);
				}
			);
		} else if (
			this.props.isDepositAndWithdraw ||
			this.props.route.path === 'wallet/deposit'
		) {
			return this.props.router?.push('/wallet/deposit');
		} else {
			return this.props.router?.push('/wallet');
		}
	};

	validateRoute = (currency, coins) => {
		const { getDepositCurrency } = this.props;
		if (
			(this.props.isDepositAndWithdraw ||
				this.props.route.path === 'wallet/withdraw') &&
			!getDepositCurrency
		) {
			return this.props.router?.push('/wallet/deposit');
		} else if (!coins[currency]) {
			return this.props.router?.push('/wallet');
		} else if (currency) {
			this.setState({ checked: true });
		}
	};

	onCopy = () => {
		const { icons: ICONS, setSnackNotification } = this.props;
		setSnackNotification({
			icon: ICONS.COPY_NOTIFICATION,
			content: STRINGS['COPY_SUCCESS_TEXT'],
		});
	};

	onGoBack = () => {
		return this.props.router?.push('/wallet');
	};

	onOpenDialog = () => {
		this.setState({ dialogIsOpen: true });
		this.props.cleanCreateAddress();
	};

	onCloseDialog = () => {
		this.setState({ dialogIsOpen: false });
	};

	onCreateAddress = () => {
		const {
			addressRequest,
			createAddress,
			selectedNetwork,
			getDepositCurrency,
			getDepositNetwork,
			getDepositNetworkOptions,
			coins,
		} = this.props;
		const { currency } = this.state;
		const currentCurrency = getDepositCurrency ? getDepositCurrency : currency;
		const network = getDepositNetworkOptions
			? getDepositNetworkOptions
			: getDepositCurrency
			? getDepositNetwork
			: selectedNetwork;
		const hasNetwork = coins[currentCurrency]?.network;
		if (hasNetwork) {
			if (currentCurrency && !addressRequest.error) {
				createAddress(currentCurrency, network);
			}
		} else if (currentCurrency && !addressRequest.error) {
			createAddress(currentCurrency);
		}
	};

	generateFormFields = (
		currency,
		network,
		wallet,
		networks,
		coins,
		verification_level
	) => {
		let address = getWallet(currency, network, wallet, networks);
		let destinationAddress = '';

		if (
			currency === 'xrp' ||
			currency === 'xlm' ||
			network === 'xlm' ||
			network === 'ton'
		) {
			const temp = address.split(':');
			address = temp[0] ? temp[0] : address;
			destinationAddress = temp[1] ? temp[1] : '';
		}

		const additionalText = STRINGS['DEPOSIT.CRYPTO_LABELS.DESTINATION_TAG'];

		const { fullname, deposit_fees } = coins[currency] || DEFAULT_COIN_DATA;
		const destinationLabel = STRINGS.formatString(additionalText, fullname);
		const label = STRINGS.formatString(
			STRINGS['DEPOSIT.CRYPTO_LABELS.ADDRESS'],
			fullname
		);

		const showGenerateButton =
			(!address && networks && network) || (!address && !networks);

		let fee;
		const feeKey = networks ? network : currency;
		if (deposit_fees && deposit_fees[feeKey]) {
			const { value } = deposit_fees[feeKey];
			fee = value;
		}

		const formFields = generateFormFields({
			currency,
			networks,
			address,
			label,
			onCopy: this.onCopy,
			copyOnClick: true,
			destinationAddress,
			destinationLabel,
			coins,
			network,
			fee,
			openQRCode: this.openQRCode,
		});

		const initialValues = {
			...(address ? { address } : {}),
			...(destinationAddress ? { destinationAddress } : {}),
			...(fee ? { fee } : {}),
			network,
		};

		this.setState({ address, formFields, initialValues, showGenerateButton });
	};

	openQRCode = () => {
		this.setState({ qrCodeOpen: true });
	};

	closeQRCode = () => {
		this.setState({ qrCodeOpen: false });
	};

	render() {
		const {
			id,
			openContactForm,
			balance,
			coins,
			constants = { links: {} },
			icons: ICONS,
			addressRequest,
			selectedNetwork,
			router,
			orders,
			getDepositCurrency,
		} = this.props;

		const {
			dialogIsOpen,
			currency,
			checked,
			copied,
			formFields,
			address,
			initialValues,
			showGenerateButton,
			qrCodeOpen,
			depositAddress,
		} = this.state;

		const currentCurrency = getDepositCurrency ? getDepositCurrency : currency;
		const isFiat = getDepositCurrency
			? coins[getDepositCurrency]?.type === 'fiat'
			: coins[currency]?.type === 'fiat';

		if (
			(!id || !currency || !checked) &&
			!this.props.isDepositAndWithdraw &&
			this.props.route.path !== 'wallet/deposit'
		) {
			return <div />;
		}

		return (
			<div>
				{isMobile && <MobileBarBack onBackClick={this.onGoBack} />}
				<div className="presentation_container apply_rtl withdrawal-container">
					{!isMobile && !isFiat && (
						<IconTitle
							stringId="SUMMARY.DEPOSIT"
							text={strings['SUMMARY.DEPOSIT']}
							iconId="DEPOSIT_TITLE"
							iconPath={ICONS['DEPOSIT_TITLE']}
							className="withdraw-icon mb-3 withdraw-main-icon"
						/>
					)}
					{!isMobile &&
						isFiat &&
						renderTitleSection(
							currentCurrency,
							'deposit',
							ICONS['DEPOSIT'],
							coins,
							'DEPOSIT'
						)}
					<div className={isFiat ? 'mt-5 inner_container' : 'inner_container'}>
						<div className="information_block">
							<div className="information_block-text_wrapper" />
							{renderBackToWallet(this.onGoBack)}
							{openContactForm &&
								renderNeedHelpAction(
									openContactForm,
									constants.links,
									ICONS['BLUE_QUESTION'],
									'BLUE_QUESTION'
								)}
						</div>
						<RenderContent
							titleSection={renderInformation(
								currentCurrency,
								balance,
								false,
								generateBaseInformation,
								coins,
								'deposit',
								constants.links,
								ICONS['BLUE_QUESTION'],
								'BLUE_QUESTION',
								orders
							)}
							icons={ICONS}
							initialValues={initialValues}
							address={address}
							currency={currency}
							coins={coins}
							onCopy={this.onCopy}
							onOpen={() => this.onOpenDialog(currency)}
							copied={copied}
							setCopied={() => this.setState({ copied: true })}
							showGenerateButton={showGenerateButton}
							formFields={formFields}
							selectedNetwork={selectedNetwork}
							router={router}
							currentCurrency={currentCurrency}
							openQRCode={this.openQRCode}
							updateAddress={this.updateAddress}
							depositAddress={depositAddress}
						/>
					</div>
				</div>
				<Dialog
					isOpen={dialogIsOpen}
					label="hollaex-modal"
					className="app-dialog"
					onCloseDialog={this.onCloseDialog}
					shouldCloseOnOverlayClick={false}
					showCloseText={true}
					style={{ 'z-index': 100 }}
				>
					{dialogIsOpen && currentCurrency && (
						<Notification
							type={NOTIFICATIONS.GENERATE_ADDRESS}
							onBack={this.onCloseDialog}
							onGenerate={this.onCreateAddress}
							currency={currentCurrency}
							data={addressRequest}
							coins={coins}
							updateAddress={this.updateAddress}
						/>
					)}
				</Dialog>
				<Dialog
					isOpen={qrCodeOpen}
					label="hollaex-modal"
					className="app-dialog"
					onCloseDialog={this.closeQRCode}
					shouldCloseOnOverlayClick={false}
					showCloseText={true}
					style={{ 'z-index': 100 }}
				>
					{qrCodeOpen && (
						<QRCode
							closeQRCode={this.closeQRCode}
							data={depositAddress}
							currency={currentCurrency}
							onCopy={this.onCopy}
						/>
					)}
				</Dialog>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	id: store.user.id,
	wallet: store.user.wallet,
	balance: store.user.balance,
	activeLanguage: store.app.language,
	quoteData: store.orderbook.quoteData,
	coins: store.app.coins,
	constants: store.app.constants,
	addressRequest: store.user.addressRequest,
	selectedNetwork: formValueSelector('GenerateWalletForm')(store, 'network'),
	verification_level: store.user.verification_level,
	orders: store.order.activeOrders,
	isDepositAndWithdraw: store.app.depositAndWithdraw,
	getDepositCurrency: store.app.depositFields.depositCurrency,
	getDepositNetwork: store.app.depositFields.depositNetwork,
	getDepositNetworkOptions: store.app.depositFields.depositNetworkOptions,
});

const mapDispatchToProps = (dispatch) => ({
	createAddress: bindActionCreators(createAddress, dispatch),
	cleanCreateAddress: bindActionCreators(cleanCreateAddress, dispatch),
	openContactForm: bindActionCreators(openContactForm, dispatch),
	setSnackNotification: bindActionCreators(setSnackNotification, dispatch),
	setDepositCurrency: bindActionCreators(depositCurrency, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(Deposit));
