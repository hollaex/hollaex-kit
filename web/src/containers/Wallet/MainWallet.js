import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import { isMobile } from 'react-device-detect';
import {
	IconTitle,
	Accordion,
	MobileBarTabs,
	NotLoggedIn,
	Button,
	MobileBarBack,
} from 'components';
import { TransactionsHistory, Stake } from 'containers';
import { changeSymbol } from 'actions/orderbookAction';
import {
	BASE_CURRENCY,
	CURRENCY_PRICE_FORMAT,
	DEFAULT_COIN_DATA,
} from 'config/constants';
import { formatCurrencyByIncrementalUnit } from 'utils/currency';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

import AssetsBlock from './AssetsBlock';
import MobileWallet from './MobileWallet';
import DustSection from './DustSection';
import HeaderSection from './HeaderSection';
import { STATIC_ICONS } from 'config/icons';
import { isStakingAvailable, STAKING_INDEX_COIN } from 'config/contracts';
import { assetsSelector, searchAssets } from './utils';
import ProfitLossSection from './ProfitLossSection';
import { setPricesAndAsset } from 'actions/assetActions';
import { setActiveBalanceHistory } from 'actions/walletActions';

const ZERO_BALANCE_KEY = 'isZeroBalanceHidden';

class Wallet extends Component {
	constructor(props) {
		super(props);

		const isZeroBalanceHidden =
			localStorage.getItem(ZERO_BALANCE_KEY) === 'true';

		this.state = {
			activeTab: 0,
			sections: [],
			mobileTabs: [],
			isOpen: true,
			isZeroBalanceHidden,
			showDustSection: false,
			activeBalanceHistory: false,
			baseCurrency: BASE_CURRENCY,
		};
	}

	componentDidMount() {
		this.generateSections(
			this.props.changeSymbol,
			this.props.balance,
			this.props.prices,
			this.state.isOpen,
			this.props.bankaccount,
			this.props.coins,
			this.props.pairs,
			this.props.totalAsset,
			this.props.oraclePrices,
			this.props.constants,
			this.props.contracts,
			this.props.isFetching,
			this.props.assets
		);
		this.props.setPricesAndAsset(this.props.balance, this.props.coins);

		if (this.props.location.pathname === '/wallet/history') {
			this.setState({ activeBalanceHistory: true });
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.generateSections(
			nextProps.changeSymbol,
			nextProps.balance,
			nextProps.prices,
			this.state.isOpen,
			nextProps.bankaccount,
			nextProps.coins,
			nextProps.pairs,
			nextProps.totalAsset,
			nextProps.oraclePrices,
			nextProps.constants,
			nextProps.contracts,
			nextProps.isFetching,
			nextProps.assets
		);
	}

	componentDidUpdate(_, prevState) {
		const {
			searchValue,
			isZeroBalanceHidden,
			showDustSection,
			activeBalanceHistory,
		} = this.state;
		const { getActiveBalanceHistory } = this.props;
		if (
			searchValue !== prevState.searchValue ||
			isZeroBalanceHidden !== prevState.isZeroBalanceHidden ||
			showDustSection !== prevState.showDustSection
		) {
			this.generateSections(
				this.props.changeSymbol,
				this.props.balance,
				this.props.prices,
				this.state.isOpen,
				this.props.bankaccount,
				this.props.coins,
				this.props.pairs,
				this.props.totalAsset,
				this.props.oraclePrices,
				this.props.constants,
				this.props.contracts,
				this.props.isFetching,
				this.props.assets
			);
		}
		if (getActiveBalanceHistory !== activeBalanceHistory) {
			this.setState({ activeBalanceHistory: getActiveBalanceHistory });
		}
		if (
			this.props.user?.settings?.interface?.display_currency &&
			this.props.user?.settings?.interface?.display_currency !==
				this.state?.baseCurrency
		) {
			this.setState({
				baseCurrency: this.props.user?.settings?.interface?.display_currency,
			});

			setTimeout(() => {
				this.props.setPricesAndAsset(this.props.balance, this.props.coins);
			}, [1000]);
		}
	}

	getMobileSlider = (coins, oraclePrices) => {
		const result = {};
		Object.keys(coins).map((key) => {
			const temp = coins[key];
			return (result[key] = { ...temp, oraclePrice: oraclePrices[key] });
		});
		return { ...result };
	};

	handleSearch = (_, value) => {
		this.setState({ searchValue: value });
	};

	onToggleZeroBalance = (isZeroBalanceHidden) => {
		localStorage.setItem(ZERO_BALANCE_KEY, isZeroBalanceHidden);
		this.setState({ isZeroBalanceHidden });
	};

	handleBalanceHistory = (value) => {
		this.props.setActiveBalanceHistory(value);
		this.setState({ activeBalanceHistory: value }, () => {
			if (value) {
				this.props.router.push('/wallet/history');
			} else {
				this.props.router.push('/wallet');
			}
		});
	};

	setBaseCurrency = (baseCurrency) => {
		this.setState({ baseCurrency });
	};

	generateSections = (
		changeSymbol,
		balance,
		prices,
		isOpen = false,
		bankaccount,
		coins,
		pairs,
		total,
		oraclePrices,
		{ features: { stake_page = false, cefi_stake = false } = {} } = {},
		contracts = {},
		isFetching,
		assets
	) => {
		const {
			showDustSection,
			isZeroBalanceHidden,
			searchValue,
			baseCurrency,
		} = this.state;
		const { router } = this.props;
		const { increment_unit, display_name } =
			coins[baseCurrency] || DEFAULT_COIN_DATA;
		const totalAssets = STRINGS.formatString(
			CURRENCY_PRICE_FORMAT,
			display_name,
			formatCurrencyByIncrementalUnit(total, increment_unit)
		);

		const sections = [
			{
				stringId: 'WALLET_ALL_ASSETS',
				title: STRINGS['WALLET_ALL_ASSETS'],
				content: (
					<AssetsBlock
						coins={coins}
						pairs={pairs}
						totalAssets={totalAssets}
						changeSymbol={changeSymbol}
						navigate={this.goToPage}
						assets={searchAssets(assets, searchValue, isZeroBalanceHidden)}
						handleSearch={this.handleSearch}
						onToggle={this.onToggleZeroBalance}
						hasEarn={
							isStakingAvailable(STAKING_INDEX_COIN, contracts) &&
							stake_page &&
							!isMobile
						}
						loading={isFetching}
						contracts={contracts}
						goToDustSection={this.goToDustSection}
						showDustSection={showDustSection}
						goToWallet={this.goToWallet}
						isZeroBalanceHidden={isZeroBalanceHidden}
						handleBalanceHistory={this.handleBalanceHistory}
						setActiveTab={this.setActiveTab}
						setBaseCurrency={this.setBaseCurrency}
					/>
				),
				isOpen: true,
				allowClose: false,
				notification: !isMobile && {
					stringId: 'TRADE_HISTORY',
					text: STRINGS['TRADE_HISTORY'],
					status: 'information',
					iconId: 'PAPER_CLIP',
					iconPath: STATIC_ICONS['CLOCK'],
					allowClick: true,
					className: isOpen
						? 'paper-clip-icon'
						: 'paper-clip-icon wallet-notification',
					onClick: () => {
						router.push('/transactions');
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
						balance={balance}
						prices={prices}
						navigate={this.goToPage}
						coins={coins}
						searchResult={this.getMobileSlider(coins, oraclePrices)}
						router={this.props.router}
						totalAssets={totalAssets}
						loading={isFetching}
						BASE_CURRENCY={BASE_CURRENCY}
					/>
				),
			},
			{
				title: STRINGS['WALLET_TAB_TRANSACTIONS'],
				content: <TransactionsHistory />,
			},
		];

		if (stake_page || cefi_stake) {
			mobileTabs.push({
				title: STRINGS['ACCOUNTS.TAB_STAKE'],
				content: <Stake />,
			});
		}

		this.setState({ sections, isOpen, mobileTabs });
	};

	goToPage = (path = '') => {
		this.props.router.push(path);
	};

	setActiveTab = (activeTab) => {
		this.setState({ activeTab });
	};

	goToDustSection = () => {
		this.setState({ showDustSection: true });
	};

	goToWallet = () => {
		this.setState({ showDustSection: false });
	};

	goBack = () => {
		this.handleBalanceHistory(false);
	};

	render() {
		const { sections, activeTab, mobileTabs, showDustSection } = this.state;
		const { icons: ICONS, router, assets, isFetching, pairs } = this.props;

		const isNotWalletHistory = router?.location?.pathname !== '/wallet/history';
		const isWalletHistory = router?.location?.pathname === '/wallet/history';

		if (mobileTabs.length === 0) {
			return <div />;
		}
		return (
			<div className="apply_rtl">
				{isMobile ? (
					<div>
						{isNotWalletHistory && (
							<MobileBarTabs
								tabs={mobileTabs}
								activeTab={activeTab}
								setActiveTab={this.setActiveTab}
							/>
						)}
						{isWalletHistory && (
							<MobileBarBack onBackClick={() => this.goBack()} />
						)}
						<div className="content-with-bar d-flex">
							{mobileTabs[activeTab].content}
						</div>
					</div>
				) : (
					<div
						className={classnames(
							'presentation_container',
							'apply_rtl',
							'wallet-wrapper',
							{ settings_container: showDustSection }
						)}
					>
						<IconTitle
							stringId="WALLET_TITLE"
							text={STRINGS['WALLET_TITLE']}
							iconPath={ICONS['TAB_WALLET']}
							iconId="TAB_WALLET"
							textType="title"
						/>
						<div
							className={classnames('wallet-container', {
								'no-border': showDustSection,
							})}
						>
							{showDustSection ? (
								<DustSection goToWallet={this.goToWallet} />
							) : (
								<>
									<HeaderSection icons={ICONS} />
									<NotLoggedIn>
										{!this.state.activeBalanceHistory ? (
											<Accordion sections={sections} showHeader={false} />
										) : (
											<ProfitLossSection
												handleBalanceHistory={this.handleBalanceHistory}
												assets={assets}
												loading={isFetching}
												navigate={this.goToPage}
												pairs={pairs}
											/>
										)}
									</NotLoggedIn>
								</>
							)}
						</div>
					</div>
				)}
				{isMobile &&
					router?.location?.pathname === '/wallet' &&
					this.state.activeTab === 0 && (
						<div
							className={`bottom-bar-button ${
								router?.location?.pathname === '/wallet' && 'footer-button'
							}`}
						>
							<div className="bottom-bar-deposit-button">
								<Button
									onClick={() => this.goToPage('/wallet/deposit')}
									label={STRINGS['WALLET_BUTTON_BASE_DEPOSIT']}
								/>
							</div>
							<div className="bottom-bar-withdraw-button">
								<Button
									onClick={() => this.goToPage('/wallet/withdraw')}
									label={STRINGS['WALLET_BUTTON_BASE_WITHDRAW']}
								/>
							</div>
						</div>
					)}
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	user: store.user,
	coins: store.app.coins,
	constants: store.app.constants,
	pairs: store.app.pairs,
	prices: store.orderbook.prices,
	balance: store.user.balance,
	activeLanguage: store.app.language,
	bankaccount: store.user.userData.bank_account,
	totalAsset: store.asset.totalAsset,
	oraclePrices: store.asset.oraclePrices,
	isFetching: store.asset.isFetching,
	contracts: store.app.contracts,
	assets: assetsSelector(store),
	getActiveBalanceHistory: store.wallet.activeBalanceHistory,
});

const mapDispatchToProps = (dispatch) => ({
	changeSymbol: bindActionCreators(changeSymbol, dispatch),
	setPricesAndAsset: bindActionCreators(setPricesAndAsset, dispatch),
	setActiveBalanceHistory: bindActionCreators(
		setActiveBalanceHistory,
		dispatch
	),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Wallet));
