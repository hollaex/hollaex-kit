import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import {
	IconTitle,
	Dialog,
	Accordion,
	Notification,
	MobileBarTabs,
} from 'components';
import { TransactionsHistory } from 'containers';
import { changeSymbol } from 'actions/orderbookAction';
import { NOTIFICATIONS, openContactForm } from 'actions/appActions';
import { createAddress, cleanCreateAddress } from 'actions/userAction';
import {
	BASE_CURRENCY,
	CURRENCY_PRICE_FORMAT,
	DEFAULT_COIN_DATA,
} from 'config/constants';
import { calculateBalancePrice, formatToCurrency } from 'utils/currency';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

import AssetsBlock from './AssetsBlock';
import MobileWallet from './MobileWallet';

class Wallet extends Component {
	state = {
		activeTab: 0,
		sections: [],
		mobileTabs: [],
		isOpen: true,
		totalAssets: '',
		dialogIsOpen: false,
		selectedCurrency: '',
	};

	componentDidMount() {
		this.generateSections(
			this.props.changeSymbol,
			this.props.balance,
			this.props.prices,
			this.state.isOpen,
			this.props.wallets,
			this.props.bankaccount,
			this.props.coins,
			this.props.pairs
		);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.generateSections(
			nextProps.changeSymbol,
			nextProps.balance,
			nextProps.prices,
			this.state.isOpen,
			nextProps.wallets,
			nextProps.bankaccount,
			nextProps.coins,
			nextProps.pairs
		);
		if (
			nextProps.addressRequest.success === true &&
			nextProps.addressRequest.success !== this.props.addressRequest.success
		) {
			this.onCloseDialog();
		}
	}

	componentDidUpdate(_, prevState) {
		const { searchValue, isZeroBalanceHidden } = this.state;
		if (
			searchValue !== prevState.searchValue ||
			isZeroBalanceHidden !== prevState.isZeroBalanceHidden
		) {
			this.generateSections(
				this.props.changeSymbol,
				this.props.balance,
				this.props.prices,
				this.state.isOpen,
				this.props.wallets,
				this.props.bankaccount,
				this.props.coins,
				this.props.pairs
			);
		}
	}

	calculateTotalAssets = (balance, prices, coins) => {
		const total = calculateBalancePrice(balance, prices, coins);
		const { min, symbol = '' } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
		return STRINGS.formatString(
			CURRENCY_PRICE_FORMAT,
			symbol.toUpperCase(),
			formatToCurrency(total, min)
		);
	};

	getSearchResult = (coins, balance) => {
		const { searchValue = '', isZeroBalanceHidden = false } = this.state;

		const result = {};
		const searchTerm = searchValue.toLowerCase().trim();
		Object.keys(coins).map((key) => {
			const temp = coins[key];
			const { fullname } = coins[key] || DEFAULT_COIN_DATA;
			const coinName = fullname ? fullname.toLowerCase() : '';
			const hasCoinBalance = !!balance[`${key}_balance`];
			const isCoinHidden = isZeroBalanceHidden && !hasCoinBalance;
			if (
				!isCoinHidden &&
				(key.indexOf(searchTerm) !== -1 || coinName.indexOf(searchTerm) !== -1)
			) {
				result[key] = temp;
			}
			return key;
		});
		return { ...result };
	};

	handleSearch = (_, value) => {
		this.setState({ searchValue: value });
	};

	handleCheck = (_, value) => {
		this.setState({ isZeroBalanceHidden: value });
	};

	generateSections = (
		changeSymbol,
		balance,
		prices,
		isOpen = false,
		wallets,
		bankaccount,
		coins,
		pairs
	) => {
		const totalAssets = this.calculateTotalAssets(balance, prices, coins);
		const searchResult = this.getSearchResult(coins, balance);
		const { icons: ICONS } = this.props;

		const sections = [
			{
				stringId: 'WALLET_ALL_ASSETS',
				title: STRINGS['WALLET_ALL_ASSETS'],
				content: (
					<AssetsBlock
						balance={balance}
						prices={prices}
						coins={coins}
						pairs={pairs}
						totalAssets={totalAssets}
						isValidBase={this.props.isValidBase}
						changeSymbol={changeSymbol}
						wallets={wallets}
						onOpenDialog={this.onOpenDialog}
						bankaccount={bankaccount}
						navigate={this.goToPage}
						openContactUs={this.openContactUs}
						searchResult={searchResult}
						handleSearch={this.handleSearch}
						handleCheck={this.handleCheck}
					/>
				),
				isOpen: true,
				allowClose: false,
				notification: !isMobile && {
					stringId: 'TRADE_HISTORY',
					text: STRINGS['TRADE_HISTORY'],
					status: 'information',
					iconId: 'BLUE_CLIP',
					iconPath: ICONS['BLUE_CLIP'],
					allowClick: true,
					className: isOpen ? '' : 'wallet-notification',
					onClick: () => {
						this.props.router.push('/transactions');
					},
				},
			},
		];
		const mobileTabs = [
			{
				title: STRINGS['WALLET_TAB_WALLET'],
				content: (
					<MobileWallet
						sections={sections}
						wallets={wallets}
						balance={balance}
						prices={prices}
						navigate={this.goToPage}
						coins={coins}
					/>
				),
			},
			{
				title: STRINGS['WALLET_TAB_TRANSACTIONS'],
				content: <TransactionsHistory />,
			},
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

	openContactUs = () => {
		const { links = {} } = this.props.constants;
		this.props.openContactForm({
			category: 'bank_transfer',
			helpdesk: links.helpdesk,
		});
	};

	render() {
		const {
			sections,
			dialogIsOpen,
			selectedCurrency,
			activeTab,
			mobileTabs,
		} = this.state;
		const { activeTheme, addressRequest, coins } = this.props;
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
							stringId="WALLET_TITLE"
							text={STRINGS['WALLET_TITLE']}
							// iconPath={ICONS.BITCOIN_WALLET}
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
					{dialogIsOpen && selectedCurrency && (
						<Notification
							type={NOTIFICATIONS.GENERATE_ADDRESS}
							onBack={this.onCloseDialog}
							onGenerate={this.onCreateAddress}
							currency={selectedCurrency}
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
	coins: store.app.coins,
	constants: store.app.constants,
	pairs: store.app.pairs,
	prices: store.orderbook.prices,
	balance: store.user.balance,
	addressRequest: store.user.addressRequest,
	activeTheme: store.app.theme,
	activeLanguage: store.app.language,
	bankaccount: store.user.userData.bank_account,
	wallets: store.user.crypto_wallet,
	isValidBase: store.app.isValidBase,
});

const mapDispatchToProps = (dispatch) => ({
	createAddress: bindActionCreators(createAddress, dispatch),
	cleanCreateAddress: bindActionCreators(cleanCreateAddress, dispatch),
	changeSymbol: bindActionCreators(changeSymbol, dispatch),
	openContactForm: bindActionCreators(openContactForm, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Wallet));
