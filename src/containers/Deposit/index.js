import React, { Component } from 'react';
import classnames from 'classnames';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { ICONS, BALANCE_ERROR, CURRENCIES } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { getCurrencyFromName } from '../../utils/currency';

import { openContactForm, setSnackNotification } from '../../actions/appActions';

import { Button } from '../../components';
import { renderInformation, renderTitleSection } from '../Wallet/components';

import { generateFiatInformation, renderContent } from './utils';

class Deposit extends Component {
	state = {
		depositPrice: 0,
		currency: '',
		checked: false,
		copied: false
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
			(currency === 'btc' && !crypto_wallet.bitcoin) ||
			(currency === 'bch' && !crypto_wallet.bitcoincash)
		) {
			this.props.router.push('/wallet');
		} else if (currency) {
			this.setState({ checked: true });
		}
	};

	onCopy = () => {
		this.props.setSnackNotification({
			icon: ICONS.COPY_NOTIFICATION,
			content: STRINGS.COPY_SUCCESS_TEXT
		});
	};

	render() {
		const { id, crypto_wallet, openContactForm, balance } = this.props;
		const { currency, checked, copied } = this.state;

		if (!id || !currency || !checked) {
			return <div />;
		}

		return (
			<div className="presentation_container  apply_rtl">
				{!isMobile &&
					renderTitleSection(currency, 'deposit', ICONS.DEPOSIT_BITCOIN)}
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
					{renderContent(currency, crypto_wallet, this.onCopy)}
					{isMobile && (
						<CopyToClipboard
							text={
								crypto_wallet[`${CURRENCIES[currency].fullName.toLowerCase()}`]
							}
							onCopy={() => this.setState({ copied: true })}
						>
							<Button
								label={copied ? STRINGS.SUCCESFUL_COPY : STRINGS.COPY_ADDRESS}
							/>
						</CopyToClipboard>
					)}
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
	openContactForm: bindActionCreators(openContactForm, dispatch),
	setSnackNotification: bindActionCreators(setSnackNotification, dispatch)

});

export default connect(mapStateToProps, mapDispatchToProps)(Deposit);
