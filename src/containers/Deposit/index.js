import React, { Component } from 'react';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
	ICONS,
	CURRENCIES,
	DEPOSIT_LIMITS,
	BALANCE_ERROR
} from '../../config/constants';
import { fiatSymbol } from '../../utils/currency';

import { openContactForm } from '../../actions/appActions';

import { renderInformation, renderTitleSection } from '../Wallet/components';

import {
	generateFiatInformation,
	renderContent,
	renderExtraInformation
} from './utils';

import BankDeposit from './BankDeposit';

class Deposit extends Component {
	state = {
		depositPrice: 0
	};

	componentWillMount() {
		if (this.props.quoteData.error === BALANCE_ERROR) {
			this.setState({ depositPrice: this.props.quoteData.data.price });
		}
	}
	render() {
		const { id, crypto_wallet, symbol, openContactForm, balance } = this.props;
		const { depositPrice } = this.state;

		if (!id) {
			return <div />;
		}

		const { name } = CURRENCIES[symbol];
		const balanceAvailable = balance[`${symbol}_available`];

		const limit = DEPOSIT_LIMITS[symbol] ? DEPOSIT_LIMITS[symbol].DAILY : 0;
		const min = DEPOSIT_LIMITS[symbol] ? DEPOSIT_LIMITS[symbol].MIN : 0;
		const max = DEPOSIT_LIMITS[symbol] ? DEPOSIT_LIMITS[symbol].MAX : 0;

		return (
			<div className="presentation_container  apply_rtl">
				{renderTitleSection(
					symbol,
					'deposit',
					symbol === fiatSymbol ? ICONS.DEPOSIT_FIAT : ICONS.DEPOSIT_BITCOIN
				)}
				<div
					className={classnames(
						'inner_container',
						'with_border_top',
						'with_border_bottom'
					)}
				>
					{renderInformation(
						symbol,
						balance,
						openContactForm,
						generateFiatInformation,
						'deposit'
					)}
					{symbol === fiatSymbol ? (
						<BankDeposit
							available={balanceAvailable}
							minAmount={min}
							maxAmount={max}
							currencyName={name}
							depositPrice={depositPrice}
						/>
					) : (
						renderContent(symbol, crypto_wallet)
					)}
					{renderExtraInformation(limit)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	id: store.user.id,
	symbol: store.orderbook.symbol,
	crypto_wallet: store.user.crypto_wallet,
	balance: store.user.balance,
	activeLanguage: store.app.language,
	quoteData: store.orderbook.quoteData
});

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Deposit);
