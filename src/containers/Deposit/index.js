import React, { Component } from 'react';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ICONS, BALANCE_ERROR } from '../../config/constants';
import { getCurrencyFromName } from '../../utils/currency';

import { openContactForm } from '../../actions/appActions';

import { renderInformation, renderTitleSection } from '../Wallet/components';

import { generateFiatInformation, renderContent } from './utils';

class Deposit extends Component {
	state = {
		depositPrice: 0,
		currency: '',
		checked: false
	};

	componentWillMount() {
		if (this.props.quoteData.error === BALANCE_ERROR) {
			this.setState({ depositPrice: this.props.quoteData.data.price });
		}
		if (this.props.verification_level) {
			this.validateRoute(
				this.props.routeParams.currency,
				this.props.crypto_wallet
			);
		}
		this.setCurrency(this.props.routeParams.currency);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.routeParams.currency !== this.props.routeParams.currency) {
			this.setCurrency(nextProps.routeParams.currency);
		} else if (!this.state.checked) {
			if (nextProps.verification_level) {
				this.validateRoute(
					nextProps.routeParams.currency,
					nextProps.crypto_wallet
				);
			}
		}
	}

	setCurrency = (currencyName) => {
		const currency = getCurrencyFromName(currencyName);
		if (currency) {
			this.setState({ currency, checked: false }, () => {
				this.validateRoute(
					this.props.routeParams.currency,
					this.props.crypto_wallet
				);
			});
		} else {
			this.props.router.push('/wallet');
		}
	};

	validateRoute = (currency, crypto_wallet) => {
		if (
			(currency === 'eth' && !crypto_wallet.ethereum) ||
			(currency === 'btc' && !crypto_wallet.bitcoin)
		) {
			this.props.router.push('/wallet');
		} else if (currency) {
			this.setState({ checked: true });
		}
	};

	render() {
		const { id, crypto_wallet, openContactForm, balance } = this.props;
		const { currency, checked } = this.state;

		if (!id || !currency || !checked) {
			return <div />;
		}

		return (
			<div className="presentation_container  apply_rtl">
				{renderTitleSection(currency, 'deposit', ICONS.DEPOSIT_BITCOIN)}
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
					{renderContent(currency, crypto_wallet)}
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
