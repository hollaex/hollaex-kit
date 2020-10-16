import React, { Component } from 'react';
import classnames from 'classnames';
import math from 'mathjs';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { formValueSelector, change } from 'redux-form';
import { isMobile } from 'react-device-detect';

import { Loader, MobileBarBack } from '../../components';
import withConfig from 'components/ConfigProvider/withConfig';
import {
	MIN_VERIFICATION_LEVEL_TO_WITHDRAW,
	MAX_VERIFICATION_LEVEL_TO_WITHDRAW,
	DEFAULT_COIN_DATA
} from '../../config/constants';
import { getCurrencyFromName, roundNumber } from '../../utils/currency';
import { getDecimals } from '../../utils/utils';
import {
	performWithdraw,
	// requestWithdrawFee
} from '../../actions/walletActions';
import { errorHandler } from '../../components/OtpForm/utils';

import { openContactForm } from '../../actions/appActions';

import WithdrawCryptocurrency from './form';
import { generateFormValues, generateInitialValues } from './formUtils';
import { generateBaseInformation } from './utils';

import { renderInformation, renderTitleSection } from '../Wallet/components';

import { FORM_NAME } from './form';

class Withdraw extends Component {
	state = {
		formValues: {},
		initialValues: {},
		checked: false
	};

	componentWillMount() {
		// if (
		// 	this.props.verification_level >= MIN_VERIFICATION_LEVEL_TO_WITHDRAW &&
		// 	this.props.verification_level <= MAX_VERIFICATION_LEVEL_TO_WITHDRAW
		// ) {
		// 	this.props.requestBtcWithdrawFee();
		// 	this.generateFormValues(
		// 		getCurrencyFromName(this.props.routeParams.currency),
		// 		this.props.balance,
		// 		this.props.btcFee
		// 	);
		// }
		if (this.props.verification_level) {
			this.validateRoute(
				this.props.routeParams.currency,
				this.props.bank_account,
				this.props.crypto_wallet,
				this.props.coins
			);
		}
		this.setCurrency(this.props.routeParams.currency);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (!this.state.checked) {
			if (nextProps.verification_level) {
				this.validateRoute(
					nextProps.routeParams.currency,
					nextProps.bank_account,
					nextProps.crypto_wallet,
					nextProps.coins
				);
			}
		} else if (
			nextProps.verification_level >= MIN_VERIFICATION_LEVEL_TO_WITHDRAW &&
			nextProps.verification_level <= MAX_VERIFICATION_LEVEL_TO_WITHDRAW &&
			(nextProps.activeLanguage !== this.props.activeLanguage ||
				nextProps.routeParams.currency !== this.props.routeParams.currency)
		) {
			this.generateFormValues(
				getCurrencyFromName(nextProps.routeParams.currency, nextProps.coins),
				nextProps.balance,
				nextProps.coins,
				nextProps.verification_level
			);
		}
		if (nextProps.routeParams.currency !== this.props.routeParams.currency) {
			this.setCurrency(nextProps.routeParams.currency);
		}
	}

	validateRoute = (currency, bank_account, crypto_wallet, coins) => {
		if (coins[currency] && !crypto_wallet[currency]) {
			this.props.router.push('/wallet');
		} else if (currency) {
			this.setState({ checked: true });
		}
	};

	setCurrency = (currencyName) => {
		const currency = getCurrencyFromName(currencyName, this.props.coins);
		if (currency) {
			this.setState({ currency, checked: false }, () => {
				this.validateRoute(
					this.props.routeParams.currency,
					this.props.bank_account,
					this.props.crypto_wallet,
					this.props.coins
				);
			});
			// if (currency === 'btc' || currency === 'bch' || currency === 'eth') {
			// 	this.props.requestWithdrawFee(currency);
			// }

			this.generateFormValues(
				currency,
				this.props.balance,
				this.props.coins,
				this.props.verification_level
			);
		} else {
			this.props.router.push('/wallet');
		}
	};

	generateFormValues = (currency, balance, coins, verification_level) => {
		const { icons: ICONS } = this.props;
		const balanceAvailable = balance[`${currency}_available`];
		const formValues = generateFormValues(
			currency,
			balanceAvailable,
			this.onCalculateMax,
			coins,
			verification_level,
			this.props.activeTheme,
      ICONS["BLUE_PLUS"]
		);
		const initialValues = generateInitialValues(currency, coins);

		this.setState({ formValues, initialValues });
	};

	onSubmitWithdraw = (currency) => (values) => {
		const { destination_tag, ...rest } = values;
		let address = rest.address;
		if (destination_tag)
			address = `${rest.address}:${destination_tag}`;
		return performWithdraw(currency, {
			...rest,
			address,
			amount: math.eval(values.amount),
			fee: values.fee ? math.eval(values.fee) : 0,
			currency
		})
			.then((response) => {
				return { ...response.data, currency: this.state.currency };
			})
			.catch(errorHandler);
	};

	onCalculateMax = () => {
		const { balance, selectedFee = 0, dispatch, verification_level, coins } = this.props;
		const { currency } = this.state;
		const balanceAvailable = balance[`${currency}_available`];
		const { increment_unit, withdrawal_limits = {} } = coins[currency] || DEFAULT_COIN_DATA;
		// if (currency === BASE_CURRENCY) {
		// 	const fee = calculateBaseFee(balanceAvailable);
		// 	const amount = math.number(
		// 		math.subtract(math.fraction(balanceAvailable), math.fraction(fee))
		// 	);
		// 	dispatch(change(FORM_NAME, 'amount', math.floor(amount)));
		// } else {
			let amount = math.number(
				math.subtract(
					math.fraction(balanceAvailable),
					math.fraction(selectedFee)
				)
			);
			if (amount < 0) {
				amount = 0;
			} else if (
				math.larger(
					amount,
					math.number(withdrawal_limits[verification_level])
				)
				&& withdrawal_limits[verification_level] !== 0
				&& withdrawal_limits[verification_level] !== -1) {
				amount = math.number(
					math.subtract(
						math.fraction(withdrawal_limits[verification_level]),
						math.fraction(selectedFee)
					)
				);
			}
			dispatch(change(FORM_NAME, 'amount', roundNumber(amount, getDecimals(increment_unit))));
		// }
	};

	onGoBack = () => {
		this.props.router.push('/wallet');
	};

	render() {
		const {
			balance,
			verification_level,
			prices,
			otp_enabled,
			openContactForm,
			activeLanguage,
			router,
			coins,
			icons: ICONS,
		} = this.props;
		const { links = {} } = this.props.constants;
		const { formValues, initialValues, currency, checked } = this.state;
		if (!currency || !checked) {
			return <div />;
		}

		const balanceAvailable = balance[`${currency}_available`];

		if (
			verification_level >= MIN_VERIFICATION_LEVEL_TO_WITHDRAW &&
			verification_level <= MAX_VERIFICATION_LEVEL_TO_WITHDRAW &&
			(balanceAvailable === undefined)
		) {
			return <Loader />;
		}

		const formProps = {
			currency,
			onSubmitWithdrawReq: this.onSubmitWithdraw(currency),
			onOpenDialog: this.onOpenDialog,
			otp_enabled,
			openContactForm: () => openContactForm({ helpdesk: links.helpdesk }),
			formValues,
			initialValues,
			activeLanguage,
			balanceAvailable,
			currentPrice: prices[currency],
			router
		};

		return (
			<div>
				{isMobile && <MobileBarBack onBackClick={this.onGoBack}>
				</MobileBarBack> }
				<div className="presentation_container apply_rtl">
					{!isMobile && renderTitleSection(currency, 'withdraw', ICONS['WITHDRAW'], coins, 'WITHDRAW')}
					{/* // This commented code can be used if you want to enforce user to have a verified bank account before doing the withdrawal
					{verification_level >= MIN_VERIFICATION_LEVEL_TO_WITHDRAW &&
					verification_level <= MAX_VERIFICATION_LEVEL_TO_WITHDRAW ? ( */}
						<div className={classnames('inner_container', 'with_border_top')}>
							{renderInformation(
								currency,
								balance,
								openContactForm,
								generateBaseInformation,
								coins,
								'withdraw',
								links,
                ICONS["BLUE_QUESTION"],
								"BLUE_QUESTION",
							)}
							<WithdrawCryptocurrency {...formProps} />
							{/* {renderExtraInformation(currency, bank_account, ICONS["BLUE_QUESTION"])} */}
						</div>
					{/* // This commented code can be used if you want to enforce user to have a verified bank account before doing the withdrawal
						) : (
						<div className={classnames('inner_container', 'with_border_top')}>
							<WarningVerification level={verification_level} />
						</div>
					)} */}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	prices: store.orderbook.prices,
	balance: store.user.balance,
	// fee: store.user.fee,
	verification_level: store.user.verification_level,
	otp_enabled: store.user.otp_enabled,
	bank_account: store.user.userData.bank_account,
	crypto_wallet: store.user.crypto_wallet,
	activeLanguage: store.app.language,
	// btcFee: store.wallet.btcFee,
	selectedFee: formValueSelector(FORM_NAME)(store, 'fee'),
	coins: store.app.coins,
	activeTheme: store.app.theme,
	constants: store.app.constants
});

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch),
	// requestWithdrawFee: bindActionCreators(requestWithdrawFee, dispatch),
	dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Withdraw));
