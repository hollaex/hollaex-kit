import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	IconTitle,
	CurrencyBallWithPrice,
	ButtonLink,
	ActionNotification
} from '../../components';
import { changeSymbol } from '../../actions/orderbookAction';
import { ICONS, FLEX_CENTER_CLASSES } from '../../config/constants';
import {
	generateWalletActionsText,
	getCurrencyFromName
} from '../../utils/currency';
import STRINGS from '../../config/localizedStrings';

class Wallet extends Component {
	state = {
		currency: ''
	};

	componentWillMount() {
		this.setCurrency(this.props.routeParams.currency);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.routeParams.currency !== this.props.routeParams.currency) {
			this.setCurrency(nextProps.routeParams.currency);
		}
	}

	setCurrency = (currencyName) => {
		const currency = getCurrencyFromName(currencyName);
		if (currency) {
			this.setState({ currency });
		} else {
			this.props.router.push('/wallet');
		}
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
						useSvg={true}
						onClick={() => {
							this.props.router.push('/transactions');
						}}
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

	render() {
		const { balance, price } = this.props;
		const { currency } = this.state;
		if (!currency) {
			return <div />;
		}

		const { depositText, withdrawText } = generateWalletActionsText(currency);

		return (
			<div className="presentation_container apply_rtl">
				<IconTitle
					text={STRINGS.WALLET_TITLE}
					iconPath={ICONS.BITCOIN_WALLET}
					useSvg={true}
					textType="title"
				/>
				<div className="wallet-container">
					{this.renderWalletHeaderBlock(currency, price, balance)}
          <div
    				className={classnames(...FLEX_CENTER_CLASSES, 'wallet-buttons_action')}
    			>
    				<ButtonLink label={depositText} link={`/wallet/${currency}/deposit`} />
    				<div className="separator" />
    				<ButtonLink label={withdrawText} link={`/wallet/${currency}/withdraw`} />
    			</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	price: store.orderbook.price,
	prices: store.orderbook.prices,
	balance: store.user.balance,
	activeLanguage: store.app.language
});

const mapDispatchToProps = (dispatch) => ({
	changeSymbol: bindActionCreators(changeSymbol, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
