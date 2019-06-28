import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import {
	IconTitle,
	Dialog,
	Accordion,
	Notification,
	MobileBarTabs
} from '../../components';
import { TransactionsHistory } from '../';
import { changeSymbol } from '../../actions/orderbookAction';
import { NOTIFICATIONS } from '../../actions/appActions';
import { createAddress, cleanCreateAddress } from '../../actions/userAction';
import { ICONS, BASE_CURRENCY } from '../../config/constants';
import { calculateBalancePrice, formatToCurrency } from '../../utils/currency';
import STRINGS from '../../config/localizedStrings';

import { AssetsBlock } from './AssetsBlock';
import MobileWallet from './MobileWallet';

class Wallet extends Component {
	state = {
		activeTab: 0,
		sections: [],
		mobileTabs: [],
		isOpen: true,
		totalAssets: '',
		dialogIsOpen: false,
		selectedCurrency: ''
	};

	componentDidMount() {
		this.generateSections(
			this.props.changeSymbol,
			this.props.balance,
			this.props.prices,
			this.state.isOpen,
			this.props.wallets,
			this.props.bankaccount,
			this.props.coins
		);
	}

	componentWillReceiveProps(nextProps) {
		this.generateSections(
			nextProps.changeSymbol,
			nextProps.balance,
			nextProps.prices,
			this.state.isOpen,
			nextProps.wallets,
			nextProps.bankaccount,
			nextProps.coins
		);
		if (
			nextProps.addressRequest.success === true &&
			nextProps.addressRequest.success !== this.props.addressRequest.success
		) {
			this.onCloseDialog();
		}
	}

	calculateTotalAssets = (balance, prices, coins) => {
		const total = calculateBalancePrice(balance, prices);
		const { min } = coins[BASE_CURRENCY] || {};
		return STRINGS.formatString(
			STRINGS[`${BASE_CURRENCY.toUpperCase()}_PRICE_FORMAT`],
			formatToCurrency(total, min),
			STRINGS[`${BASE_CURRENCY.toUpperCase()}_CURRENCY_SYMBOL`]
		);
	};

	generateSections = (
		changeSymbol,
		balance,
		prices,
		isOpen = false,
		wallets,
		bankaccount,
		coins
	) => {
		const totalAssets = this.calculateTotalAssets(balance, prices, coins);

		const sections = [
			{
				title: STRINGS.WALLET_ALL_ASSETS,
				content: (
					<AssetsBlock
						balance={balance}
						prices={prices}
						coins={coins}
						totalAssets={totalAssets}
						changeSymbol={changeSymbol}
						wallets={wallets}
						onOpenDialog={this.onOpenDialog}
						bankaccount={bankaccount}
						navigate={this.goToPage}
					/>
				),
				isOpen: true,
				allowClose: false,
				notification: !isMobile && {
					text: STRINGS.TRADE_HISTORY,
					status: 'information',
					iconPath: ICONS.BLUE_CLIP,
					allowClick: true,
					useSvg: true,
					className: isOpen ? '' : 'wallet-notification',
					onClick: () => {
						this.props.router.push('/transactions');
					}
				}
			}
		];
		const mobileTabs = [
			{
				title: STRINGS.WALLET_TAB_WALLET,
				content: <MobileWallet sections={sections}
				wallets={wallets}
				balance={balance}
				prices={prices}
				navigate={this.goToPage}
				coins={coins}
			/>
			},
			{
				title: STRINGS.WALLET_TAB_TRANSACTIONS,
				content: <TransactionsHistory />
			}
		];
		this.setState({ sections, totalAssets, isOpen, mobileTabs });
	};

	goToPage = (path = '') => {
		this.props.router.push(path);
	};
	goToDeposit = () => this.goToPage('deposit');
	goToWithdraw = () => this.goToPage('withdraw');
	goToTransactionsHistory = () => this.goToPage('transactions');

	onOpenDialog = (selectedCurrency) => {
		this.setState({ dialogIsOpen: true, selectedCurrency });
		this.props.cleanCreateAddress();
	};

	onCloseDialog = () => {
		this.setState({ dialogIsOpen: false, selectedCurrency: '' });
	};

	onCreateAddress = () => {
		if (this.state.selectedCurrency && !this.props.addressRequest.error) {
			this.props.createAddress(this.state.selectedCurrency);
		}
	};

	setActiveTab = (activeTab) => {
		this.setState({ activeTab });
	};

	render() {
		const {
			sections,
			dialogIsOpen,
			selectedCurrency,
			activeTab,
			mobileTabs
		} = this.state;
		const { activeTheme, addressRequest } = this.props;
		if (mobileTabs.length === 0) {
			return <div />;
		}
		return (
			<div className="apply_rtl">
				{isMobile ? (
					<div>
						<MobileBarTabs
							tabs={mobileTabs}
							activeTab={activeTab}
							setActiveTab={this.setActiveTab}
						/>
						<div className="content-with-bar d-flex">
							{mobileTabs[activeTab].content}
						</div>
					</div>
				) : (
					<div className="presentation_container apply_rtl">
						<IconTitle
							text={STRINGS.WALLET_TITLE}
							// iconPath={ICONS.BITCOIN_WALLET}
							useSvg={true}
							textType="title"
						/>
						<div className="wallet-container">
							<Accordion sections={sections} />
						</div>
					</div>
				)}
				<Dialog
					isOpen={dialogIsOpen}
					label="hollaex-modal"
					className="app-dialog"
					onCloseDialog={this.onCloseDialog}
					shouldCloseOnOverlayClick={false}
					theme={activeTheme}
					showCloseText={true}
					style={{ 'z-index': 100 }}
				>
					{dialogIsOpen &&
						selectedCurrency && (
							<Notification
								type={NOTIFICATIONS.GENERATE_ADDRESS}
								onBack={this.onCloseDialog}
								onGenerate={this.onCreateAddress}
								currency={selectedCurrency}
								data={addressRequest}
							/>
						)}
				</Dialog>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	coins: store.app.coins,
	symbol: store.orderbook.symbol,
	price: store.orderbook.price,
	prices: store.orderbook.prices,
	balance: store.user.balance,
	addressRequest: store.user.addressRequest,
	activeTheme: store.app.theme,
	activeLanguage: store.app.language,
	bankaccount: store.user.userData.bank_account,
	wallets: store.user.crypto_wallet
});

const mapDispatchToProps = (dispatch) => ({
	createAddress: bindActionCreators(createAddress, dispatch),
	cleanCreateAddress: bindActionCreators(cleanCreateAddress, dispatch),
	changeSymbol: bindActionCreators(changeSymbol, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
