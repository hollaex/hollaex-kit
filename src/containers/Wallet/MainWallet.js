import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	IconTitle,
	Button,
	Dialog,
	Accordion,
	Notification
} from '../../components';
import { changeSymbol } from '../../actions/orderbookAction';
import { NOTIFICATIONS } from '../../actions/appActions';
import { createAddress } from '../../actions/userAction';
import { ICONS, FLEX_CENTER_CLASSES, CURRENCIES } from '../../config/constants';
import {
	calculateBalancePrice,
	generateWalletActionsText
} from '../../utils/currency';
import STRINGS from '../../config/localizedStrings';

import { AssetsBlock } from './AssetsBlock';

const fiatFormatToCurrency = CURRENCIES.fiat.formatToCurrency;

class Wallet extends Component {
	state = {
		sections: [],
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
		return STRINGS.formatString(
			STRINGS.FIAT_PRICE_FORMAT,
			fiatFormatToCurrency(total),
			STRINGS.FIAT_CURRENCY_SYMBOL
		);
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
					useSvg: true,
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

	onOpenDialog = () => {
		this.setState({ dialogIsOpen: true });
	};
	onCloseDialog = () => {
		this.setState({ dialogIsOpen: false, selectedCurrency: '' });
	};
	onCreateAddress = () => {
		if (this.state.selectedCurrency && !this.props.addressRequest.error) {
			this.props.createAddress(this.state.selectedCurrency);
		}
	};

	render() {
		const { sections, dialogIsOpen, selectedCurrency } = this.state;
		const { activeTheme, addressRequest } = this.props;
		return (
			<div className="presentation_container apply_rtl">
				<IconTitle
					text={STRINGS.WALLET_TITLE}
					iconPath={ICONS.BITCOIN_WALLET}
					useSvg={true}
					textType="title"
				/>
				<div className="wallet-container">
					<Accordion sections={sections} notifyOnOpen={this.notifyOnOpen} />
				</div>
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
						/>
					)}
				</Dialog>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	symbol: store.orderbook.symbol,
	price: store.orderbook.price,
	prices: store.orderbook.prices,
	balance: store.user.balance,
	addressRequest: store.user.addressRequest,
	activeTheme: store.app.theme,
	activeLanguage: store.app.language
});

const mapDispatchToProps = (dispatch) => ({
	createAddress: bindActionCreators(createAddress, dispatch),
	changeSymbol: bindActionCreators(changeSymbol, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
