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
import { fiatSymbol, getCurrencyFromName } from '../../utils/currency';

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
		depositPrice: 0,
		currency: ''
	};

	componentWillMount() {
		if (this.props.quoteData.error === BALANCE_ERROR) {
			this.setState({ depositPrice: this.props.quoteData.data.price });
		}
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

	render() {
		const { id, crypto_wallet, openContactForm, balance } = this.props;
		const { depositPrice, currency } = this.state;

		if (!id || !currency) {
			return <div />;
		}

		const { name } = CURRENCIES[currency];
		const balanceAvailable = balance[`${currency}_available`];

		const limit = DEPOSIT_LIMITS[currency] ? DEPOSIT_LIMITS[currency].DAILY : 0;
		const min = DEPOSIT_LIMITS[currency] ? DEPOSIT_LIMITS[currency].MIN : 0;
		const max = DEPOSIT_LIMITS[currency] ? DEPOSIT_LIMITS[currency].MAX : 0;

		return (
			<div className="presentation_container  apply_rtl">
				{renderTitleSection(
					currency,
					'deposit',
					currency === fiatSymbol ? ICONS.DEPOSIT_FIAT : ICONS.DEPOSIT_BITCOIN
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
						generateFiatInformation,
						'deposit'
					)}
					{currency === fiatSymbol ? (
						<BankDeposit
							available={balanceAvailable}
							minAmount={min}
							maxAmount={max}
							currencyName={name}
							depositPrice={depositPrice}
						/>
					) : (
						renderContent(currency, crypto_wallet)
					)}
					{renderExtraInformation(limit)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	id: store.user.id,
	crypto_wallet: store.user.crypto_wallet,
	balance: store.user.balance,
	activeLanguage: store.app.language,
	quoteData: store.orderbook.quoteData
});

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Deposit);
