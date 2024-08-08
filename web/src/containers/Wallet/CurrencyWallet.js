import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { isMobile } from 'react-device-detect';

import {
	ButtonLink,
	Coin,
	EditWrapper,
	DonutChart,
	Help,
	ActionNotification,
} from 'components';
import { DEFAULT_COIN_DATA, BASE_CURRENCY } from 'config/constants';
import {
	formatCurrencyByIncrementalUnit,
	calculateOraclePrice,
} from 'utils/currency';
import { assetsSelector } from './utils';
import { formatToCurrency, getCurrencyFromName } from 'utils/currency';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { isStakingAvailable } from 'config/contracts';
import TradeInputGroup from './components/TradeInputGroup';
import { unique } from 'utils/data';
import { STATIC_ICONS } from 'config/icons';

class Wallet extends Component {
	state = {
		currency: '',
	};

	UNSAFE_componentWillMount() {
		this.setCurrency(this.props.routeParams.currency);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.routeParams.currency !== this.props.routeParams.currency) {
			this.setCurrency(nextProps.routeParams.currency);
		}
	}

	setCurrency = (currencyName) => {
		const currency = getCurrencyFromName(currencyName, this.props.coins);
		if (currency) {
			this.setState({ currency });
		} else {
			this.props.router.push('/wallet');
		}
	};

	goToPage = (path = '') => {
		this.props.router.push(path);
	};

	goToTrade = (pair) => {
		const flippedPair = this.getFlippedPair(pair);
		const isQuickTrade = !!this.props.quicktrade.filter(
			({ symbol, active, type }) =>
				!!active &&
				type !== 'pro' &&
				(symbol === pair || symbol === flippedPair)
		).length;
		if (pair && isQuickTrade) {
			return this.goToPage(`/quick-trade/${pair}`);
		} else if (pair && !isQuickTrade) {
			return this.goToPage(`/trade/${pair}`);
		}
	};

	getFlippedPair = (pair) => {
		let flippedPair = pair.split('-');
		flippedPair.reverse().join('-');
		return flippedPair;
	};

	isMarketAvailable = (pair) => {
		const { pairs } = this.props;
		return pair && pairs[pair] && pairs[pair].active;
	};

	findPair = (key, field) => {
		const availableMarketsArray = [];
		const { pairs } = this.props;

		Object.entries(pairs).map(([pairKey, pairObject]) => {
			if (
				pairObject &&
				pairObject[field] === key &&
				this.isMarketAvailable(pairKey)
			) {
				availableMarketsArray.push(pairKey);
			}

			return pairKey;
		});

		return availableMarketsArray;
	};

	getAllAvailableMarkets = (key) => {
		const { quicktrade } = this.props;
		const quickTrade = quicktrade
			.filter(({ symbol = '', active }) => {
				const [base, to] = symbol.split('-');
				return active && (base === key || to === key);
			})
			.map(({ symbol }) => symbol);
		const trade = [
			...this.findPair(key, 'pair_base'),
			...this.findPair(key, 'pair_2'),
		];
		return unique([...quickTrade, ...trade]);
	};

	render() {
		const { currency } = this.state;
		if (!currency) {
			return <div />;
		}

		const {
			balance,
			coins,
			icons: ICONS,
			quicktrade,
			chartData,
			contracts,
			pairs,
		} = this.props;
		const hasEarn = !isStakingAvailable(currency, contracts);
		const markets = this.getAllAvailableMarkets(currency);
		const { fullname, min, icon_id, symbol } =
			coins[currency] || DEFAULT_COIN_DATA;
		const balanceValue = balance[`${currency}_balance`] || 0;
		const availableBalanceValue = balance[`${currency}_available`] || 0;
		const baseCoin = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
		const filteredAssets = this.props.assets.filter(
			(val) => val[1].symbol === currency
		);
		const [assetsValue] = filteredAssets.map(
			([_, { increment_unit, oraclePrice }]) => ({
				increment_unit,
				oraclePrice,
			})
		);
		const balanceText =
			assetsValue &&
			assetsValue.increment_unit &&
			assetsValue &&
			assetsValue.oraclePrice
				? currency === BASE_CURRENCY
					? formatCurrencyByIncrementalUnit(
							balanceValue,
							assetsValue.increment_unit
					  )
					: formatCurrencyByIncrementalUnit(
							calculateOraclePrice(balanceValue, assetsValue.oraclePrice),
							baseCoin.increment_unit
					  )
				: null;
		return (
			<div className="currency-wallet-wrapper">
				<div className="d-flex mt-5 mb-5">
					<Coin iconId={icon_id} type="CS12" />
					<div className="d-flex title-wrapper">
						<EditWrapper
							stringId={`${symbol?.toUpperCase()}_FULLNAME`}
							className="fullname-label"
						>
							{fullname}
						</EditWrapper>
						<EditWrapper stringId="WALLET_TITLE">
							{STRINGS['WALLET_TITLE']}
						</EditWrapper>
					</div>
				</div>
				<Fragment>
					<div className="link-container d-flex justify-content-between mb-4 mt-3">
						<EditWrapper stringId="CURRENCY_WALLET.WALLET_PAGE">
							{STRINGS.formatString(
								STRINGS['CURRENCY_WALLET.WALLET_PAGE'],
								<Link className="link-content" to="wallet">
									{STRINGS['CURRENCY_WALLET.BACK']}
								</Link>
							)}
						</EditWrapper>
						{!isMobile && (
							<div className="trade-link-wrapper">
								{markets.length > 1 ? (
									<TradeInputGroup
										quicktrade={quicktrade}
										markets={markets}
										goToTrade={this.goToTrade}
										pairs={pairs}
										tradeClassName="trade-notify-wrapper"
									/>
								) : (
									<ActionNotification
										stringId="TRADE_TAB_TRADE"
										text={STRINGS['TRADE_TAB_TRADE']}
										iconId="BLUE_TRADE_ICON"
										iconPath={ICONS['BLUE_TRADE_ICON']}
										onClick={() => this.goToTrade(markets[0])}
										className="csv-action"
										showActionText={isMobile}
										disable={markets.length === 0}
										tradeClassName="trade-notify-wrapper"
									/>
								)}
							</div>
						)}
					</div>
				</Fragment>
				<div className="d-flex wallet-content-wrapper">
					<div className="wallet-details-wrapper w-75">
						<div className="d-flex flex-column balance-wrapper">
							<span className="mb-3">
								<EditWrapper stringId="CURRENCY_WALLET.TOTAL_BALANCE">
									{STRINGS.formatString(
										STRINGS['CURRENCY_WALLET.TOTAL_BALANCE'],
										formatToCurrency(balanceValue, min),
										currency.toUpperCase()
									)}
								</EditWrapper>
							</span>
							{!isMobile &&
								(currency !== BASE_CURRENCY ? (
									parseFloat(balanceText || 0) > 0 ? (
										<p className="estimated-balance">
											{`(≈ ${baseCoin.display_name} ${balanceText})`}
										</p>
									) : (
										balanceText !== '0' && (
											<div
												className="loading-row-anime w-half"
												style={{
													animationDelay: `.${0 + 1}s`,
												}}
											/>
										)
									)
								) : null)}
							<p className="available-balance-wrapper">
								<EditWrapper stringId="CURRENCY_WALLET.AVAILABLE_BALANCE">
									{STRINGS.formatString(
										STRINGS['CURRENCY_WALLET.AVAILABLE_BALANCE'],
										formatToCurrency(availableBalanceValue, min),
										currency.toUpperCase(),
										<Help tip={STRINGS['CURRENCY_WALLET.TOOLTIP']}></Help>
									)}
								</EditWrapper>
							</p>
						</div>
						{!hasEarn && (
							<div className="link-container mb-3">
								<EditWrapper stringId="CURRENCY_WALLET.EARN_BY">
									{STRINGS.formatString(
										STRINGS['CURRENCY_WALLET.EARN_BY'],
										<Link to={`/stake`} className="link-content">
											{STRINGS['CURRENCY_WALLET.STAKING']}{' '}
											{currency.toUpperCase()}
										</Link>
									)}
								</EditWrapper>
							</div>
						)}
						<div className="link-container mb-3">
							<EditWrapper stringId="CURRENCY_WALLET.LEARN_MORE">
								{STRINGS.formatString(
									STRINGS['CURRENCY_WALLET.LEARN_MORE'],
									<Link
										to={`/prices/coin/${currency}`}
										className="link-content"
									>
										{STRINGS['CURRENCY_WALLET.ABOUT']} {currency.toUpperCase()}
									</Link>
								)}
							</EditWrapper>
						</div>
						<div className="link-container mb-5">
							<EditWrapper stringId="ADDRESS_BOOK.ADD_ADDRESS_DESC">
								{STRINGS.formatString(
									STRINGS['ADDRESS_BOOK.ADD_ADDRESS_DESC'],
									<Link
										to="/wallet/address-book"
										className="link-content text-lowercase"
									>
										{STRINGS['ADDRESS_BOOK.ADDRESS_BOOK']}
									</Link>
								)}
							</EditWrapper>
						</div>
						<div className="d-flex btn-wrapper">
							<div className="deposit-wrapper w-75">
								{coins[currency].allow_deposit ? (
									<ButtonLink
										label={STRINGS['WALLET_BUTTON_BASE_DEPOSIT']}
										link={`/wallet/${currency}/deposit`}
										className="deposit-btn"
										lineHeight="currency-wallet-btn"
										currencyWallet={true}
										btnLabel="deposit"
									/>
								) : null}
							</div>
							<div className="separator" />
							<div className="withdraw-wrapper w-25">
								{coins[currency].allow_withdrawal ? (
									<ButtonLink
										label={STRINGS['WALLET_BUTTON_BASE_WITHDRAW']}
										link={`/wallet/${currency}/withdraw`}
										lineHeight="currency-wallet-btn"
										currencyWallet={true}
										btnLabel="withdraw"
									/>
								) : null}
							</div>
						</div>
					</div>
					<div className="donut-wrapper p-4">
						<span className="text-center donut-title">
							<EditWrapper stringId="CURRENCY_WALLET.PERCENTAGE_SHARE">
								{STRINGS.formatString(
									STRINGS['CURRENCY_WALLET.PERCENTAGE_SHARE'],
									currency.toUpperCase()
								)}
							</EditWrapper>
						</span>
						{availableBalanceValue <= 0 ? (
							<React.Fragment>
								<div className="wallet-icon-wrapper">
									<img
										alt="deposit-icon"
										src={STATIC_ICONS['NO_ACTIVE_DEPOSITS']}
									/>
								</div>
								<EditWrapper stringId="CURRENCY_WALLET.WALLET_HAS_BALANCE_PERCENTAGE">
									{STRINGS.formatString(
										STRINGS['CURRENCY_WALLET.WALLET_HAS_BALANCE_PERCENTAGE'],
										currency.toUpperCase()
									)}
								</EditWrapper>
								{coins[currency].allow_deposit &&
								coins[currency].allow_withdrawal ? (
									<EditWrapper stringId="CURRENCY_WALLET.WALLET_DEPOSIT">
										{STRINGS.formatString(
											STRINGS['CURRENCY_WALLET.WALLET_DEPOSIT'],
											<Link
												className="deposit-link"
												to={`/wallet/${currency}/withdraw`}
											>
												{currency.toUpperCase()}
											</Link>,
											<Link
												className="buy-link"
												to={`/prices/coin/${currency}`}
											>
												here
											</Link>
										)}
									</EditWrapper>
								) : null}
							</React.Fragment>
						) : chartData.length ? (
							<DonutChart
								coins={coins}
								chartData={chartData}
								showOpenWallet={false}
								currency={currency}
								isCurrencyWallet={true}
							/>
						) : (
							<div className="animation-wrapper">
								<div className="rounded-loading">
									<div className="inner-round" />
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	const {
		app,
		orderbook,
		user,
		asset: { chartData },
	} = store;
	return {
		coins: app.coins,
		price: orderbook.price,
		balance: user.balance,
		activeLanguage: app.language,
		contracts: app.contracts,
		constants: app.constants,
		quicktrade: app.quicktrade,
		pairs: app.pairs,
		pair: app.pair,
		chartData,
		assets: assetsSelector(store),
	};
};

export default connect(mapStateToProps)(withConfig(Wallet));
