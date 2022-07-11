import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import math from 'mathjs';
import { change } from 'redux-form';
import { getDecimals } from 'utils/utils';
import { roundNumber } from 'utils/currency';
import { DEFAULT_COIN_DATA } from 'config/constants';

import { generateFormValues, generateInitialValues } from './FormUtils';
import WithdrawalForm, { FORM_NAME, selector } from './WithdrawalForm';
import {
	getFiatWithdrawalFee,
	getFiatWithdrawalLimit,
} from 'containers/Deposit/Fiat/utils';
import { withdrawalOptionsSelector } from './utils';
import withConfig from 'components/ConfigProvider/withConfig';

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
		} = this.props;
		const { activeTab } = this.state;

		let initialBank;
		if (banks && banks.length === 1) {
			initialBank = banks[0]['id'];
		}

		this.generateFormValues(
			activeTab,
			currency,
			balance,
			coins,
			verification_level,
			banks,
			initialBank
		);
	}

	UNSAFE_componentWillUpdate(nextProps, nextState) {
		const { selectedBank } = this.props;
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
				currency,
				balance,
				coins,
				verification_level,
				banks,
				initialBank
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
			} = this.props;
			const { activeTab } = this.state;

			let initialBank;
			if (banks && banks.length === 1) {
				initialBank = banks[0]['id'];
			}

			this.generateFormValues(
				activeTab,
				currency,
				balance,
				coins,
				verification_level,
				banks,
				initialBank
			);
		}
	}

	setActiveTab = (activeTab) => {
		this.setState({ activeTab });
	};

	onCalculateMax = () => {
		const {
			user: { balance, verification_level },
			change,
			coins,
			currency,
		} = this.props;

		const withdrawal_limit = getFiatWithdrawalLimit(verification_level);
		const { rate: withdrawal_fee } = getFiatWithdrawalFee(currency);
		const balanceAvailable = balance[`${currency}_available`];
		const { increment_unit } = coins[currency] || DEFAULT_COIN_DATA;

		let amount = math.number(
			math.max(
				math.subtract(
					math.fraction(balanceAvailable),
					math.fraction(withdrawal_fee)
				),
				0
			)
		);

		if (
			withdrawal_limit !== 0 &&
			withdrawal_limit !== -1 &&
			math.larger(amount, withdrawal_limit)
		) {
			amount = withdrawal_limit;
		}

		change(
			FORM_NAME,
			'amount',
			roundNumber(amount, getDecimals(increment_unit))
		);
		// }
	};

	generateFormValues = (
		activeTab,
		currency,
		balance,
		coins,
		verification_level,
		banks,
		selectedBank
	) => {
		const { icons: ICONS, activeTheme, activeLanguage, constants } = this.props;
		const balanceAvailable = balance[`${currency}_available`];

		const withdrawal_limit = getFiatWithdrawalLimit(verification_level);
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
			withdrawal_fee
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
});

const mapDispatchToProps = (dispatch) => ({
	change: bindActionCreators(change, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Form));
