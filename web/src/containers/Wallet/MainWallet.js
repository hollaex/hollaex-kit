import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import { isMobile } from 'react-device-detect';
import { IconTitle, Accordion, MobileBarTabs } from 'components';
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
		const { searchValue, isZeroBalanceHidden, showDustSection } = this.state;
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
	}

	componentWillUnmount() {
		const { isZeroBalanceHidden } = this.state;
		localStorage.setItem(ZERO_BALANCE_KEY, isZeroBalanceHidden);
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
		this.setState({ isZeroBalanceHidden });
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
		{ features: { stake_page = false } = {} } = {},
		contracts = {},
		isFetching,
		assets
	) => {
		const { showDustSection, isZeroBalanceHidden, searchValue } = this.state;
		const { broker, router } = this.props;
		const { increment_unit, display_name } =
			coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
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
						broker={broker}
						goToDustSection={this.goToDustSection}
						showDustSection={showDustSection}
						goToWallet={this.goToWallet}
						isZeroBalanceHidden={isZeroBalanceHidden}
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
					/>
				),
			},
			{
				title: STRINGS['WALLET_TAB_TRANSACTIONS'],
				content: <TransactionsHistory />,
			},
		];

		if (stake_page) {
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

	render() {
		const { sections, activeTab, mobileTabs, showDustSection } = this.state;
		const { icons: ICONS } = this.props;

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
									<Accordion sections={sections} showHeader={false} />
								</>
							)}
						</div>
					</div>
				)}
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
	activeLanguage: store.app.language,
	bankaccount: store.user.userData.bank_account,
	totalAsset: store.asset.totalAsset,
	oraclePrices: store.asset.oraclePrices,
	isFetching: store.asset.isFetching,
	contracts: store.app.contracts,
	broker: store.app.broker,
	assets: assetsSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
	changeSymbol: bindActionCreators(changeSymbol, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Wallet));
