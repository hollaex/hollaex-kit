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

import withConfig from 'components/ConfigProvider/withConfig';

const verifiedBankStatus = 3;

export const getFiatWithdrawalLimit = (verification_level, tiers) => {
	const { withdrawal_limit } = tiers[verification_level] || {};
	return withdrawal_limit;
};

export const getFiatWithdrawalFee = (currency, coins) => {
	const { withdrawal_fee, withdrawal_fees } =
		coins[currency] || DEFAULT_COIN_DATA;
	let fee = 0;
	if (withdrawal_fees && currency && withdrawal_fees[currency]) {
		fee = withdrawal_fees[currency].value;
	} else if (coins[currency]) {
		fee = withdrawal_fee;
	}

	return fee;
};

class Form extends Component {
	state = {
		formValues: {},
		initialValues: {},
		activeTab: 'bank',
	};

	componentDidMount() {
		const {
			currency,
			user: { balance, verification_level, bank_account = [] },
			coins,
		} = this.props;
		const { activeTab } = this.state;

		const banks = bank_account.filter(
			({ status, account_number, account_name, bank_name }) =>
				status === verifiedBankStatus &&
				account_number &&
				account_name &&
				bank_name
		);
		const filtered_banks = banks.filter(({ pay_id }) =>
			activeTab === 'osko' ? !!pay_id : true
		);

		let initialBank;
		if (filtered_banks && filtered_banks.length === 1) {
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
				user: { balance, verification_level, bank_account = [] },
				coins,
			} = this.props;
			const banks = bank_account.filter(
				({ status, account_number, account_name, bank_name }) =>
					status === verifiedBankStatus &&
					account_number &&
					account_name &&
					bank_name
			);
			const filtered_banks = banks.filter(({ pay_id }) =>
				nextState.activeTab === 'osko' ? !!pay_id : true
			);
			let initialBank;
			if (nextState.activeTab === activeTab) {
				if (filtered_banks && filtered_banks.length === 1) {
					initialBank = filtered_banks[0]['id'];
				} else {
					initialBank = nextProps.selectedBank;
				}
			} else {
				if (filtered_banks && filtered_banks.length !== 0) {
					initialBank = filtered_banks[0]['id'];
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
		const {
			user: { bank_account = [] },
		} = this.props;
		const {
			user: { bank_account: prevBankAccount = [] },
		} = prevProps;
		if (bank_account.length !== prevBankAccount.length) {
			const {
				currency,
				user: { balance, verification_level },
				coins,
			} = this.props;
			const { activeTab } = this.state;

			const banks = bank_account.filter(
				({ status, account_number, account_name, bank_name }) =>
					status === verifiedBankStatus &&
					account_number &&
					account_name &&
					bank_name
			);
			const filtered_banks = banks.filter(({ pay_id }) =>
				activeTab === 'osko' ? !!pay_id : true
			);

			let initialBank;
			if (filtered_banks && filtered_banks.length === 1) {
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
			tiers,
		} = this.props;

		const withdrawal_limit = getFiatWithdrawalLimit(verification_level, tiers);
		const withdrawal_fee = getFiatWithdrawalFee(currency, coins);
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
		const {
			icons: ICONS,
			activeTheme,
			activeLanguage,
			constants,
			tiers,
		} = this.props;
		const balanceAvailable = balance[`${currency}_available`];

		const filtered_banks = banks.filter(({ pay_id }) =>
			activeTab === 'osko' ? !!pay_id : true
		);

		const withdrawal_limit = getFiatWithdrawalLimit(verification_level, tiers);
		const withdrawal_fee = getFiatWithdrawalFee(currency, coins);

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
			filtered_banks,
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
		};

		return (
			<div>
				<WithdrawalForm {...formProps} />
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user,
	coins: state.app.coins,
	tiers: state.app.config_level,
	selectedBank: selector(state, 'bank'),
	amount: selector(state, 'amount'),
	activeLanguage: state.app.language,
	activeTheme: state.app.theme,
	constants: state.app.constants,
});

const mapDispatchToProps = (dispatch) => ({
	change: bindActionCreators(change, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Form));
