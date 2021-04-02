import React, { Component } from 'react';
import classnames from 'classnames';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { BALANCE_ERROR } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { getCurrencyFromName } from '../../utils/currency';
import { createAddress, cleanCreateAddress } from 'actions/userAction';
import { NOTIFICATIONS } from 'actions/appActions';

import {
	openContactForm,
	setSnackNotification,
} from '../../actions/appActions';

import { Button, MobileBarBack, Dialog, Notification } from 'components';
import { renderInformation, renderTitleSection } from '../Wallet/components';

import { getWallet } from 'utils/wallet';
import { generateBaseInformation, RenderContent } from './utils';

import withConfig from 'components/ConfigProvider/withConfig';

class Deposit extends Component {
	state = {
		depositPrice: 0,
		currency: '',
		checked: false,
		copied: false,
		dialogIsOpen: false,
		selectedNetwork: '',
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
		if (nextProps.routeParams.currency !== this.props.routeParams.currency) {
			this.setCurrency(nextProps.routeParams.currency);
		} else if (!this.state.checked) {
			if (nextProps.verification_level) {
				this.validateRoute(nextProps.routeParams.currency, this.props.coins);
			}
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
			let selectedNetwork;
			if (networks && networks.length === 1) {
				selectedNetwork = networks[0];
			}

			this.setState(
				{
					currency,
					networks,
					selectedNetwork,
					checked: false,
				},
				() => {
					this.validateRoute(this.props.routeParams.currency, this.props.coins);
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
		const { addressRequest, createAddress } = this.props;
		const { currency, selectedNetwork } = this.state;
		if (currency && !addressRequest.error) {
			createAddress(currency, selectedNetwork);
		}
	};

	onSelect = (selectedNetwork) => {
		this.setState({ selectedNetwork });
	};

	render() {
		const {
			id,
			wallet,
			openContactForm,
			balance,
			coins,
			constants = { links: {} },
			icons: ICONS,
			addressRequest,
		} = this.props;

		const {
			dialogIsOpen,
			currency,
			checked,
			copied,
			selectedNetwork,
			networks,
		} = this.state;

		if (!id || !currency || !checked) {
			return <div />;
		}
		return (
			<div>
				{isMobile && <MobileBarBack onBackClick={this.onGoBack} />}
				<div className="presentation_container  apply_rtl">
					{!isMobile &&
						renderTitleSection(
							currency,
							'deposit',
							ICONS['DEPOSIT_BITCOIN'],
							coins,
							'DEPOSIT_BITCOIN'
						)}
					<div
						className={classnames(
							'inner_container',
							'with_border_top',
							'with_border_bottom'
						)}
					>
						{renderInformation(
							currency,
							balance,
							openContactForm,
							generateBaseInformation,
							coins,
							'deposit',
							constants.links,
							ICONS['BLUE_QUESTION'],
							'BLUE_QUESTION'
						)}
						<RenderContent
							currency={currency}
							wallet={wallet}
							coins={coins}
							onCopy={this.onCopy}
							selectedNetwork={selectedNetwork}
							onSelect={this.onSelect}
							onOpen={this.onOpenDialog}
							networks={networks}
						/>
						{isMobile && (
							<CopyToClipboard
								text={getWallet(
									currency.toLowerCase(),
									selectedNetwork,
									wallet,
									networks
								)}
								onCopy={() => this.setState({ copied: true })}
							>
								<Button
									onClick={this.onCopy}
									label={
										copied ? STRINGS['SUCCESFUL_COPY'] : STRINGS['COPY_ADDRESS']
									}
								/>
							</CopyToClipboard>
						)}
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
