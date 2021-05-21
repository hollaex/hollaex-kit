import React, { Component } from 'react';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { BALANCE_ERROR } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { getCurrencyFromName } from '../../utils/currency';
import { createAddress, cleanCreateAddress } from 'actions/userAction';
import { NOTIFICATIONS } from 'actions/appActions';
import { DEFAULT_COIN_DATA } from 'config/constants';

import {
	openContactForm,
	setSnackNotification,
} from '../../actions/appActions';

import { MobileBarBack, Dialog, Notification } from 'components';
import {
	renderInformation,
	renderTitleSection,
	renderNeedHelpAction,
} from '../Wallet/components';
import RenderContent, {
	generateBaseInformation,
	generateFormFields,
} from './utils';
import { getWallet } from 'utils/wallet';

import withConfig from 'components/ConfigProvider/withConfig';

class Deposit extends Component {
	state = {
		depositPrice: 0,
		currency: '',
		checked: false,
		copied: false,
		dialogIsOpen: false,
		formFields: {},
		initialValues: {},
	};

	componentWillMount() {
		if (this.props.quoteData.error === BALANCE_ERROR) {
			this.setState({ depositPrice: this.props.quoteData.data.price });
		}
		if (this.props.verification_level) {
			this.validateRoute(this.props.routeParams.currency, this.props.coins);
		}
		this.setCurrency(this.props.routeParams.currency);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { selectedNetwork, wallet, coins } = this.props;
		const { currency, networks } = this.state;

		if (!this.state.checked) {
			if (nextProps.verification_level) {
				this.validateRoute(nextProps.routeParams.currency, this.props.coins);
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
				nextProps.coins
			);
		}

		if (nextProps.routeParams.currency !== this.props.routeParams.currency) {
			this.setCurrency(nextProps.routeParams.currency);
		}

		if (
			nextProps.addressRequest.success === true &&
			nextProps.addressRequest.success !== this.props.addressRequest.success
		) {
			this.onCloseDialog();
		}
	}

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
					networks,
					initialNetwork,
					checked: false,
				},
				() => {
					const { currency, initialNetwork, networks } = this.state;
					const { wallet, coins } = this.props;
					this.validateRoute(this.props.routeParams.currency, coins);
					this.generateFormFields(
						currency,
						initialNetwork,
						wallet,
						networks,
						coins
					);
				}
			);
		} else {
			this.props.router.push('/wallet');
		}
	};

	validateRoute = (currency, coins) => {
		if (!coins[currency]) {
			this.props.router.push('/wallet');
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
		this.props.router.push('/wallet');
	};

	onOpenDialog = () => {
		this.setState({ dialogIsOpen: true });
		this.props.cleanCreateAddress();
	};

	onCloseDialog = () => {
		this.setState({ dialogIsOpen: false });
	};

	onCreateAddress = () => {
		const { addressRequest, createAddress, selectedNetwork } = this.props;
		const { currency } = this.state;
		if (currency && !addressRequest.error) {
			createAddress(currency, selectedNetwork);
		}
	};

	generateFormFields = (currency, network, wallet, networks, coins) => {
		let address = getWallet(currency, network, wallet, networks);
		let destinationAddress = '';

		if (currency === 'xrp' || currency === 'xlm' || network === 'xlm') {
			const temp = address.split(':');
			address = temp[0] ? temp[0] : address;
			destinationAddress = temp[1] ? temp[1] : '';
		}

		const additionalText =
			currency === 'xlm' || network === 'xlm'
				? STRINGS['DEPOSIT.CRYPTO_LABELS.MEMO']
				: STRINGS['DEPOSIT.CRYPTO_LABELS.DESTINATION_TAG'];

		const { fullname } = coins[currency] || DEFAULT_COIN_DATA;
		const destinationLabel = STRINGS.formatString(additionalText, fullname);
		const label = STRINGS.formatString(
			STRINGS['DEPOSIT.CRYPTO_LABELS.ADDRESS'],
			fullname
		);

		const showGenerateButton =
			(!address && networks && network) || (!address && !networks);

		const formFields = generateFormFields({
			networks,
			address,
			label,
			onCopy: this.onCopy,
			copyOnClick: true,
			destinationAddress,
			destinationLabel,
		});

		const initialValues = {
			...(address ? { address } : {}),
			...(destinationAddress ? { destinationAddress } : {}),
			network,
		};

		this.setState({ address, formFields, initialValues, showGenerateButton });
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
		} = this.state;

		if (!id || !currency || !checked) {
			return <div />;
		}

		return (
			<div>
				{isMobile && <MobileBarBack onBackClick={this.onGoBack} />}
				<div className="presentation_container apply_rtl withdrawal-container">
					{!isMobile &&
						renderTitleSection(
							currency,
							'deposit',
							ICONS['DEPOSIT_BITCOIN'],
							coins,
							'DEPOSIT_BITCOIN'
						)}
					<div className={classnames('inner_container')}>
						<div className="information_block">
							<div
								className="information_block-text_wrapper"
								style={{ height: '1.5rem' }}
							/>
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
								currency,
								balance,
								false,
								generateBaseInformation,
								coins,
								'deposit',
								constants.links,
								ICONS['BLUE_QUESTION'],
								'BLUE_QUESTION'
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
					{dialogIsOpen && currency && (
						<Notification
							type={NOTIFICATIONS.GENERATE_ADDRESS}
							onBack={this.onCloseDialog}
							onGenerate={this.onCreateAddress}
							currency={currency}
							data={addressRequest}
							coins={coins}
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
});

const mapDispatchToProps = (dispatch) => ({
	createAddress: bindActionCreators(createAddress, dispatch),
	cleanCreateAddress: bindActionCreators(cleanCreateAddress, dispatch),
	openContactForm: bindActionCreators(openContactForm, dispatch),
	setSnackNotification: bindActionCreators(setSnackNotification, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(Deposit));
