import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	IconTitle,
	CurrencyBallWithPrice,
	Button,
	ActionNotification,
	Accordion
} from '../../components';
import { changeSymbol } from '../../actions/orderbookAction';
import { ICONS, FLEX_CENTER_CLASSES, CURRENCIES } from '../../config/constants';
import {
	calculateBalancePrice,
	generateWalletActionsText
} from '../../utils/currency';
import STRINGS from '../../config/localizedStrings';

import { AssetsBlock } from './AssetsBlock';
const fiatSymbol = 'fiat';
const fiatCurrencySymbol = CURRENCIES.fiat.currencySymbol;
const fiatFormatToCurrency = CURRENCIES.fiat.formatToCurrency;

class Wallet extends Component {
	state = {
		sections: [],
		isOpen: true,
		totalAssets: 0
	};

	componentDidMount() {
		this.generateSections(
			this.props.changeSymbol,
			this.props.balance,
			this.props.prices,
			this.state.isOpen
		);
	}

	componentWillReceiveProps(nextProps) {
		this.generateSections(
			nextProps.changeSymbol,
			nextProps.balance,
			nextProps.prices,
			this.state.isOpen
		);
	}

	calculateTotalAssets = (balance, prices) => {
		const total = calculateBalancePrice(balance, prices);
		return `${fiatCurrencySymbol}${fiatFormatToCurrency(total)}`;
	};

	generateSections = (changeSymbol, balance, prices, isOpen = false) => {
		const totalAssets = this.calculateTotalAssets(balance, prices);

		const sections = [
			{
				title: STRINGS.WALLET_ALL_ASSETS,
				content: (
					<AssetsBlock
						balance={balance}
						prices={prices}
						totalAssets={totalAssets}
						changeSymbol={changeSymbol}
					/>
				),
				isOpen: true,
				notification: {
					text: isOpen ? STRINGS.HIDE_TEXT : totalAssets,
					status: 'information',
					iconPath: isOpen ? ICONS.BLUE_PLUS : ICONS.BLUE_CLIP,
					allowClick: true,
					className: isOpen ? '' : 'wallet-notification'
				}
			}
		];
		this.setState({ sections, totalAssets, isOpen });
	};

	goToPage = (path = '') => {
		this.props.router.push(path);
	};
	goToDeposit = () => this.goToPage('deposit');
	goToWithdraw = () => this.goToPage('withdraw');
	goToTransactionsHistory = () => this.goToPage('transactions');

	notifyOnOpen = (index, isOpen) => {
		this.generateSections(
			this.props.changeSymbol,
			this.props.balance,
			this.props.prices,
			isOpen
		);
	};

	renderWalletHeaderBlock = (symbol, price, balance) => {
		const balanceValue = balance[`${symbol}_balance`] || 0;
		return (
			<div className="wallet-header_block">
				<div className="wallet-header_block-currency_title">
					{STRINGS.formatString(
						STRINGS.CURRENCY_BALANCE_TEXT,
						STRINGS[`${symbol.toUpperCase()}_FULLNAME`]
					)}
					<ActionNotification
						text={STRINGS.TRADE_HISTORY}
						status="information"
						iconPath={ICONS.BLUE_CLIP}
						onClick={this.goToTransactionsHistory}
					/>
				</div>
				<CurrencyBallWithPrice
					symbol={symbol}
					amount={balanceValue}
					price={price}
				/>
			</div>
		);
	};

	renderButtonsBlock = (symbol) => {
		const { depositText, withdrawText } = generateWalletActionsText(symbol);

		return (
			<div
				className={classnames(...FLEX_CENTER_CLASSES, 'wallet-buttons_action')}
			>
				<Button label={depositText} onClick={this.goToDeposit} />
				<div className="separator" />
				<Button label={withdrawText} onClick={this.goToWithdraw} />
			</div>
		);
	};

	render() {
		const { symbol, balance, price } = this.props;
		const { sections } = this.state;

		return (
			<div className="presentation_container apply_rtl">
				<IconTitle
					text={STRINGS.WALLET_TITLE}
					iconPath={
						symbol === fiatSymbol ? ICONS.FIAT_WALLET : ICONS.BITCOIN_WALLET
					}
					textType="title"
				/>
				<div className={classnames('wallet-container')}>
					{this.renderWalletHeaderBlock(symbol, price, balance)}
					{this.renderButtonsBlock(symbol)}
					<Accordion sections={sections} notifyOnOpen={this.notifyOnOpen} />
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	symbol: store.orderbook.symbol,
	price: store.orderbook.price,
	prices: store.orderbook.prices,
	balance: store.user.balance,
	activeLanguage: store.app.language
});

const mapDispatchToProps = (dispatch) => ({
	changeSymbol: bindActionCreators(changeSymbol, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
