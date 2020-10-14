import React, { Component } from 'react';
import classnames from 'classnames';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { BALANCE_ERROR } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { getCurrencyFromName } from '../../utils/currency';

import {
	openContactForm,
	setSnackNotification
} from '../../actions/appActions';

import { Button, MobileBarBack } from '../../components';
import { renderInformation, renderTitleSection } from '../Wallet/components';

import { generateBaseInformation, renderContent } from './utils';

import withConfig from 'components/ConfigProvider/withConfig';

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
				this.props.crypto_wallet,
				this.props.coins
			);
		}
		this.setCurrency(this.props.routeParams.currency);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.routeParams.currency !== this.props.routeParams.currency) {
			this.setCurrency(nextProps.routeParams.currency);
		} else if (!this.state.checked) {
			if (nextProps.verification_level) {
				this.validateRoute(
					nextProps.routeParams.currency,
					nextProps.crypto_wallet,
					this.props.coins
				);
			}
		}
	}

	setCurrency = (currencyName) => {
		const currency = getCurrencyFromName(currencyName, this.props.coins);
		if (currency) {
			this.setState({ currency, checked: false }, () => {
				this.validateRoute(
					this.props.routeParams.currency,
					this.props.crypto_wallet,
					this.props.coins
				);
			});
		} else {
			this.props.router.push('/wallet');
		}
	};

	validateRoute = (currency, crypto_wallet, coins) => {
		if (coins[currency] && !crypto_wallet[currency]) {
			this.props.router.push('/wallet');
		} else if (currency) {
			this.setState({ checked: true });
		}
	};

	onCopy = () => {
		const { icons: ICONS, setSnackNotification } = this.props;
		setSnackNotification({
			icon: ICONS.COPY_NOTIFICATION,
			content: STRINGS["COPY_SUCCESS_TEXT"]
		});
	};

	onGoBack = () => {
		this.props.router.push('/wallet');
	};

	render() {
		const { id, crypto_wallet, openContactForm, balance, coins, constants = { links: {} }, icons: ICONS } = this.props;
		const { currency, checked, copied } = this.state;
		if (!id || !currency || !checked) {
			return <div />;
		}
		return (
			<div>
				{isMobile && <MobileBarBack onBackClick={this.onGoBack} />}
				<div className="presentation_container  apply_rtl">
					{!isMobile &&
						renderTitleSection(
							currency,
							'deposit',
							ICONS['DEPOSIT_BITCOIN'],
							coins,
              'DEPOSIT_BITCOIN',
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
							generateBaseInformation,
							coins,
							'deposit',
							constants.links,
              ICONS["BLUE_QUESTION"],
						)}
						{renderContent(currency, crypto_wallet, coins, this.onCopy)}
						{isMobile && (
							<CopyToClipboard
								text={crypto_wallet[`${currency.toLowerCase()}`]}
								onCopy={() => this.setState({ copied: true })}
							>
								<Button
									onClick={this.onCopy}
									label={
										copied
											? STRINGS["SUCCESFUL_COPY"]
											: STRINGS["COPY_ADDRESS"]
									}
								/>
							</CopyToClipboard>
						)}
					</div>
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
	quoteData: store.orderbook.quoteData,
	coins: store.app.coins,
	constants: store.app.constants
});

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch),
	setSnackNotification: bindActionCreators(setSnackNotification, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(Deposit));
