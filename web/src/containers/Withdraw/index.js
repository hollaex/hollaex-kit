import React, { Component } from 'react';
import classnames from 'classnames';
import math from 'mathjs';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { formValueSelector, change } from 'redux-form';
import { isMobile } from 'react-device-detect';

import { Loader, MobileBarBack } from '../../components';
import withConfig from 'components/ConfigProvider/withConfig';
import { DEFAULT_COIN_DATA } from '../../config/constants';
import { getCurrencyFromName, roundNumber } from '../../utils/currency';
import { getDecimals } from '../../utils/utils';
import {
	performWithdraw,
	// requestWithdrawFee
} from '../../actions/walletActions';
import { errorHandler } from '../../components/OtpForm/utils';

import { openContactForm } from 'actions/appActions';

import WithdrawCryptocurrency from './form';
import { generateFormValues, generateInitialValues } from './formUtils';
import { generateBaseInformation } from './utils';

import {
	renderInformation,
	renderTitleSection,
	renderNeedHelpAction,
} from '../Wallet/components';

import { FORM_NAME } from './form';
import { limitNumberWithinRange } from 'utils/math';

class Withdraw extends Component {
	state = {
		formValues: {},
		initialValues: {},
		checked: false,
		currency: '',
		selectedMethodData: 'address',
	};

	componentWillMount() {
		if (this.props.verification_level) {
			this.validateRoute(this.props.routeParams.currency, this.props.coins);
		}
		this.setCurrency(this.props.routeParams.currency);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (!this.state.checked) {
			if (nextProps.verification_level) {
				this.validateRoute(nextProps.routeParams.currency, nextProps.coins);
			}
		} else if (
			nextProps.activeLanguage !== this.props.activeLanguage ||
			nextProps.selectedNetwork !== this.props.selectedNetwork
		) {
			this.generateFormValues(
				getCurrencyFromName(nextProps.routeParams.currency, nextProps.coins),
				nextProps.balance,
				nextProps.coins,
				nextProps.verification_level,
				this.state.networks,
				nextProps.selectedNetwork,
				this.handleMethodChange
			);
		}

		if (nextProps.selectedMethod !== this.props.selectedMethod) {
			this.generateFormValues(
				getCurrencyFromName(nextProps.routeParams.currency, nextProps.coins),
				nextProps.balance,
				nextProps.coins,
				nextProps.verification_level,
				this.state.networks,
				nextProps.selectedNetwork,
				nextProps.selectedMethod,
				this.handleMethodChange
			);
		}
		if (nextProps.routeParams.currency !== this.props.routeParams.currency) {
			this.setCurrency(nextProps.routeParams.currency);
		}
	}

	validateRoute = (currency, coins) => {
		if (!coins[currency]) {
			this.props.router.push('/wallet');
		} else if (currency) {
			this.setState({ checked: true });
		}
	};

	setCurrency = (currencyName) => {
		const currency = getCurrencyFromName(currencyName, this.props.coins);
		if (currency) {
			const { coins } = this.props;
			const coin = coins[currency];
			const networks = coin.network && coin.network.split(',');
			let initialNetwork;
			if (networks && networks.length === 1) {
				initialNetwork = networks[0];
			}

			this.setState(
				{
					currency,
					checked: false,
					networks,
				},
				() => {
					this.validateRoute(this.props.routeParams.currency, this.props.coins);
					this.generateFormValues(
						currency,
						this.props.balance,
						this.props.coins,
						this.props.verification_level,
						networks,
						initialNetwork,
						this.state.selectedMethod,
						this.handleMethodChange
					);
				}
			);
			// if (currency === 'btc' || currency === 'bch' || currency === 'eth') {
			// 	this.props.requestWithdrawFee(currency);
			// }
		} else {
			this.props.router.push('/wallet');
		}
	};

	handleMethodChange = (selectedMethodData) => {
		this.setState({ selectedMethodData });
	};

	generateFormValues = (
		currency,
		balance,
		coins,
		verification_level,
		networks,
		network,
		selectedMethod,
		handleMethodChange
	) => {
		const {
			icons: ICONS,
			router: {
				location: { query },
			},
		} = this.props;
		const formValues = generateFormValues(
			currency,
			balance,
			this.onCalculateMax,
			coins,
			verification_level,
			this.props.activeTheme,
			ICONS['BLUE_PLUS'],
			'BLUE_PLUS',
			networks,
			network,
			ICONS,
			selectedMethod,
			handleMethodChange
		);

		let initialValues = generateInitialValues(
			currency,
			coins,
			networks,
			network,
			query,
			verification_level,
			selectedMethod
		);

		this.setState({ formValues, initialValues });
	};

	onSubmitWithdraw = (currency) => (values) => {
		const { destination_tag, network, ...rest } = values;

		let address = rest.address.trim();
		if (destination_tag) address = `${rest.address.trim()}:${destination_tag}`;

		let paramData = {
			...(network ? { network } : {}),
			...rest,
			address,
			amount: math.eval(values.amount),
			currency,
		};

		delete paramData.fee_type;
		delete paramData.fee;

		if (values && values.email) {
			paramData = {
				...paramData,
				network: 'email',
				address: values && values.email && values.email.toLowerCase(),
			};
			delete paramData.email;
		}

		return performWithdraw(currency, paramData)
			.then((response) => {
				return { ...response.data, currency: this.state.currency };
			})
			.catch(errorHandler);
	};

	onCalculateMax = () => {
		const {
			balance,
			selectedFee = 0,
			dispatch,
			verification_level,
			coins,
			config_level = {},
			fee_coin,
			fee_type,
			selectedNetwork,
		} = this.props;
		const { withdrawal_limit } = config_level[verification_level] || {};
		const { currency } = this.state;
		const balanceAvailable = balance[`${currency}_available`];
		const { increment_unit, withdrawal_fees = {}, network } =
			coins[currency] || DEFAULT_COIN_DATA;
		const isPercentage = fee_type === 'percentage';
		// if (currency === BASE_CURRENCY) {
		// 	const fee = calculateBaseFee(balanceAvailable);
		// 	const amount = math.number(
		// 		math.subtract(math.fraction(balanceAvailable), math.fraction(fee))
		// 	);
		// 	dispatch(change(FORM_NAME, 'amount', math.floor(amount)));
		// } else {
		let amount = 0;
		let min;
		let max;

		if (withdrawal_fees && withdrawal_fees[selectedNetwork]) {
			min = withdrawal_fees[selectedNetwork].min;
			max = withdrawal_fees[selectedNetwork].max;
		} else if (!network && withdrawal_fees && withdrawal_fees[currency]) {
			min = withdrawal_fees[currency].min;
			max = withdrawal_fees[currency].max;
		}

		if (fee_coin && fee_coin !== currency && !isPercentage) {
			amount = math.number(math.fraction(balanceAvailable));
			if (amount < 0) {
				amount = 0;
			} else if (
				math.larger(amount, math.number(withdrawal_limit)) &&
				withdrawal_limit !== 0 &&
				withdrawal_limit !== -1
			) {
				amount = math.number(math.fraction(withdrawal_limit));
			}
		} else {
			let max_allowed = balanceAvailable;
			if (withdrawal_limit !== 0 && withdrawal_limit !== -1) {
				max_allowed = math.min(math.number(withdrawal_limit), balanceAvailable);
			}

			if (isPercentage) {
				amount = math.number(
					math.divide(
						math.fraction(max_allowed),
						math.add(
							math.fraction(math.divide(math.fraction(selectedFee), 100)),
							1
						)
					)
				);

				const calculatedFee = limitNumberWithinRange(
					math.multiply(
						math.fraction(amount),
						math.fraction(math.divide(math.fraction(selectedFee), 100))
					),
					min,
					max
				);
				amount = math.number(
					math.subtract(
						math.fraction(max_allowed),
						math.fraction(calculatedFee)
					)
				);
			} else {
				amount = math.number(
					math.subtract(math.fraction(max_allowed), math.fraction(selectedFee))
				);
			}

			if (amount < 0) {
				amount = 0;
			}
		}

		dispatch(
			change(
				FORM_NAME,
				'amount',
				roundNumber(amount, getDecimals(increment_unit))
			)
		);
		// }
	};

	onGoBack = () => {
		this.props.router.push('/wallet');
	};

	render() {
		const {
			balance,
			prices,
			otp_enabled,
			openContactForm,
			activeLanguage,
			router,
			coins,
			icons: ICONS,
			selectedNetwork,
			email,
		} = this.props;
		const { links = {} } = this.props.constants;
		const {
			formValues,
			initialValues,
			currency,
			checked,
			selectedMethodData,
		} = this.state;
		if (!currency || !checked) {
			return <div />;
		}

		const balanceAvailable = balance[`${currency}_available`];

		if (balanceAvailable === undefined) {
			return <Loader />;
		}

		const formProps = {
			currency,
			onSubmitWithdrawReq: this.onSubmitWithdraw(currency),
			onOpenDialog: this.onOpenDialog,
			otp_enabled,
			openContactForm,
			formValues,
			initialValues,
			activeLanguage,
			balanceAvailable,
			currentPrice: prices[currency],
			router,
			icons: ICONS,
			selectedNetwork,
			email,
			selectedMethodData,
		};

		return (
			<div>
				{isMobile && (
					<MobileBarBack onBackClick={this.onGoBack}></MobileBarBack>
				)}
				<div className="presentation_container apply_rtl withdrawal-container">
					{!isMobile &&
						renderTitleSection(
							currency,
							'withdraw',
							ICONS['WITHDRAW'],
							coins,
							'WITHDRAW'
						)}
					{/* // This commented code can be used if you want to enforce user to have a verified bank account before doing the withdrawal
					{verification_level >= MIN_VERIFICATION_LEVEL_TO_WITHDRAW &&
					verification_level <= MAX_VERIFICATION_LEVEL_TO_WITHDRAW ? ( */}
					<div className={classnames('inner_container')}>
						<div className="information_block">
							<div
								className="information_block-text_wrapper"
								style={{ height: '1.5rem' }}
							/>
							{openContactForm &&
								renderNeedHelpAction(
									openContactForm,
									links,
									ICONS['BLUE_QUESTION'],
									'BLUE_QUESTION'
								)}
						</div>
						<WithdrawCryptocurrency
							titleSection={renderInformation(
								currency,
								balance,
								false,
								generateBaseInformation,
								coins,
								'withdraw',
								links,
								ICONS['BLUE_QUESTION'],
								'BLUE_QUESTION'
							)}
							{...formProps}
						/>
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
	prices: store.asset.oraclePrices,
	balance: store.user.balance,
	// fee: store.user.fee,
	verification_level: store.user.verification_level,
	otp_enabled: store.user.otp_enabled,
	bank_account: store.user.userData.bank_account,
	activeLanguage: store.app.language,
	// btcFee: store.wallet.btcFee,
	selectedFee: formValueSelector(FORM_NAME)(store, 'fee'),
	fee_coin: formValueSelector(FORM_NAME)(store, 'fee_coin'),
	fee_type: formValueSelector(FORM_NAME)(store, 'fee_type'),
	selectedNetwork: formValueSelector(FORM_NAME)(store, 'network'),
	selectedMethod: formValueSelector(FORM_NAME)(store, 'method'),
	email: formValueSelector(FORM_NAME)(store, 'email'),
	coins: store.app.coins,
	activeTheme: store.app.theme,
	constants: store.app.constants,
	config_level: store.app.config_level,
});

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch),
	// requestWithdrawFee: bindActionCreators(requestWithdrawFee, dispatch),
	dispatch,
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(Withdraw));
