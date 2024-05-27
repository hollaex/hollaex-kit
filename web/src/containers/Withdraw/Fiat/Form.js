import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { change } from 'redux-form';
import { message } from 'antd';

import { generateFormValues, generateInitialValues } from './FormUtils';
import WithdrawalForm, { FORM_NAME, selector } from './WithdrawalForm';
import {
	getFiatWithdrawalFee,
	getFiatWithdrawalLimit,
} from 'containers/Deposit/Fiat/utils';
import { withdrawalOptionsSelector } from './utils';
import withConfig from 'components/ConfigProvider/withConfig';
import { getWithdrawalMax } from 'actions/appActions';

class Form extends Component {
	state = {
		formValues: {},
		initialValues: {},
		activeTab: 'bank',
	};

	componentDidMount() {
		const {
			currency,
			user: { balance, verification_level },
			coins,
			banks,
			prices,
			getWithdrawCurrency,
		} = this.props;
		const { activeTab } = this.state;
		const currentCurrency = getWithdrawCurrency
			? getWithdrawCurrency
			: currency;

		let initialBank;
		if (banks && banks.length === 1) {
			initialBank = banks[0]['id'];
		}

		this.generateFormValues(
			activeTab,
			currentCurrency,
			balance,
			coins,
			verification_level,
			banks,
			initialBank,
			prices
		);
	}

	UNSAFE_componentWillUpdate(nextProps, nextState) {
		const { selectedBank, prices, getWithdrawCurrency } = this.props;
		const { activeTab } = this.state;
		if (
			nextProps.selectedBank !== selectedBank ||
			nextState.activeTab !== activeTab
		) {
			const {
				currency,
				user: { balance, verification_level },
				coins,
				banks,
			} = this.props;
			const currentCurrency = getWithdrawCurrency
				? getWithdrawCurrency
				: currency;

			let initialBank;
			if (nextState.activeTab === activeTab) {
				if (banks && banks.length === 1) {
					initialBank = banks[0]['id'];
				} else {
					initialBank = nextProps.selectedBank;
				}
			} else {
				if (banks && banks.length !== 0) {
					initialBank = banks[0]['id'];
				}
			}

			this.generateFormValues(
				nextState.activeTab,
				currentCurrency,
				balance,
				coins,
				verification_level,
				banks,
				initialBank,
				prices
			);
		}
	}

	componentDidUpdate(prevProps) {
		const { banks } = this.props;

		if (banks.length !== prevProps.banks.length) {
			const {
				currency,
				user: { balance, verification_level },
				coins,
				prices,
				getWithdrawCurrency,
			} = this.props;
			const { activeTab } = this.state;

			let initialBank;
			if (banks && banks.length === 1) {
				initialBank = banks[0]['id'];
			}
			const currentCurrency = getWithdrawCurrency
				? getWithdrawCurrency
				: currency;

			this.generateFormValues(
				activeTab,
				currentCurrency,
				balance,
				coins,
				verification_level,
				banks,
				initialBank,
				prices
			);
		}
	}

	setActiveTab = (activeTab) => {
		this.setState({ activeTab });
	};

	onCalculateMax = () => {
		const { currency, change } = this.props;

		getWithdrawalMax(currency, 'fiat')
			.then((res) => {
				change(FORM_NAME, 'amount', res.data.amount);
			})
			.catch((err) => {
				message.error(err.response.data.message);
			});
	};

	generateFormValues = (
		activeTab,
		currency,
		balance,
		coins,
		verification_level,
		banks,
		selectedBank,
		prices
	) => {
		const { icons: ICONS, activeTheme, activeLanguage, constants } = this.props;
		const balanceAvailable = balance[`${currency}_available`];

		const withdrawal_limit = getFiatWithdrawalLimit(currency);
		const { rate: withdrawal_fee } = getFiatWithdrawalFee(currency);

		const formValues = generateFormValues(
			constants,
			currency,
			balanceAvailable,
			this.onCalculateMax,
			coins,
			verification_level,
			activeTheme,
			activeLanguage,
			ICONS['BLUE_PLUS'],
			'BLUE_PLUS',
			banks,
			selectedBank,
			activeTab,
			withdrawal_limit,
			withdrawal_fee,
			prices
		);

		const initialValues = generateInitialValues(
			currency,
			coins,
			banks,
			selectedBank,
			withdrawal_fee
		);

		this.setState({ formValues, initialValues });
	};

	render() {
		const { initialValues, formValues, activeTab } = this.state;
		const {
			currency,
			user: { balance },
			prices = {},
			withdrawInformation,
		} = this.props;
		const { setActiveTab } = this;

		const balanceAvailable = balance[`${currency}_available`];

		const formProps = {
			balanceAvailable,
			...this.props,
			initialValues,
			formValues,
			setActiveTab,
			activeTab,
			currentPrice: prices[currency],
			withdrawInformation,
		};

		return (
			<div>
				<WithdrawalForm {...formProps} />
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
	user: state.user,
	coins: state.app.coins,
	selectedBank: selector(state, 'bank'),
	amount: selector(state, 'amount'),
	activeLanguage: state.app.language,
	activeTheme: state.app.theme,
	constants: state.app.constants,
	banks: withdrawalOptionsSelector(state, ownProps),
	prices: state.asset.oraclePrices,
	getWithdrawCurrency: state.app.withdrawFields.withdrawCurrency,
});

const mapDispatchToProps = (dispatch) => ({
	change: bindActionCreators(change, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Form));
