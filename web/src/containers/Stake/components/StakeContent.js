import React, { Component } from 'react';
import { connect } from 'react-redux';
import mathjs from 'mathjs';
import { bindActionCreators } from 'redux';
import { approve, addStake } from 'actions/stakingActions';
import withConfig from 'components/ConfigProvider/withConfig';
import {
	generateTableData,
	getAllUserStakes,
	getPendingTransactions,
	getTokenAllowance,
} from 'actions/stakingActions';
import { open } from 'helpers/link';
import { STAKING_INDEX_COIN } from 'config/contracts';
import { DEFAULT_COIN_DATA } from 'config/constants';
import { toFixed } from 'utils/currency';
import { getDecimals } from 'utils/utils';
import { minValue, maxValue, required } from 'components/Form/validations';
import STRINGS from 'config/localizedStrings';

import AllowanceLoader from './AllowanceLoader';
import AmountContent from './AmountContent';
import PeriodContent from './PeriodContent';
import ReviewContent from './ReviewContent';
import WaitingContent from './WaitingContent';
import SuccessfulStakeContent from './SuccessfulStakeContent';
import ErrorContent from './ErrorContent';

const CONTENT_TYPE = {
	AMOUNT: 'AMOUNT',
	PERIOD: 'PERIOD',
	REVIEW: 'REVIEW',
	WAITING: 'WAITING',
	SUCCESS: 'SUCCESS',
	ERROR: 'ERROR',
	LOADING: 'LOADING',
};

const ACTION_TYPE = {
	STAKE: 'STAKE',
	WITHDRAW: 'WITHDRAW',
};

class StakeContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: CONTENT_TYPE.AMOUNT,
			amount: '',
			period: '',
			action: ACTION_TYPE.STAKE,
			pending: false,
			isValid: false,
			error: '',
		};
	}

	setPeriod = ({ target: { value: period } }) => {
		this.setState({ period });
	};

	parse = (value = '') => {
		const { coins, tokenData } = this.props;
		const { symbol } = tokenData;
		const { increment_unit } = coins[symbol] || DEFAULT_COIN_DATA;
		const decimal = getDecimals(increment_unit);
		const decValue = toFixed(value);
		const valueDecimal = getDecimals(decValue);

		let result = value;
		if (decimal < valueDecimal) {
			result = decValue
				.toString()
				.substring(0, decValue.toString().length - (valueDecimal - decimal));
		}
		return result;
	};

	setAmount = ({ target: { value: amount } }) => {
		const {
			tokenData: { available, display_name },
		} = this.props;

		if (amount) {
			if (mathjs.larger(amount, available)) {
				this.setState({
					amount,
					isValid: false,
					error: maxValue(
						available,
						STRINGS.formatString(
							STRINGS['WITHDRAWALS_LOWER_BALANCE'],
							`${amount} ${display_name}`
						)
					)(amount),
				});
			} else if (mathjs.smaller(amount, 1)) {
				this.setState({
					amount,
					isValid: false,
					error: minValue(1, STRINGS['WITHDRAWALS_MIN_VALUE_ERROR'])(amount),
				});
			} else {
				this.setState({
					amount,
					isValid: true,
					error: '',
				});
			}
		} else {
			this.setState({
				amount,
				isValid: false,
				error: required(amount),
			});
		}
	};

	approveAndStake = (symbol) => async ({ amount, period, account }) => {
		const {
			generateTableData,
			getAllUserStakes,
			getPendingTransactions,
		} = this.props;

		this.setContent(CONTENT_TYPE.LOADING);

		try {
			const allowance = await getTokenAllowance(symbol)(account);
			if (mathjs.largerEq(allowance, amount)) {
				this.setAction(ACTION_TYPE.STAKE, false);
				this.setContent(CONTENT_TYPE.WAITING);
				await addStake(symbol)({
					amount,
					period,
					account,
					cb: () => this.setAction(ACTION_TYPE.STAKE, true),
				});
				await Promise.all([
					generateTableData(account),
					getAllUserStakes(account),
					getPendingTransactions(account),
				]);
				this.setContent(CONTENT_TYPE.SUCCESS);
			} else {
				this.setAction(ACTION_TYPE.WITHDRAW, false);
				this.setContent(CONTENT_TYPE.WAITING);

				await approve(symbol)({
					amount,
					account,
					cb: () => this.setAction(ACTION_TYPE.WITHDRAW, true),
				});
				this.setAction(ACTION_TYPE.STAKE, false);
				await addStake(symbol)({
					amount,
					period,
					account,
					cb: () => this.setAction(ACTION_TYPE.STAKE, true),
				});
				await Promise.all([
					generateTableData(account),
					getAllUserStakes(account),
					getPendingTransactions(account),
				]);
				this.setContent(CONTENT_TYPE.SUCCESS);
			}
		} catch (err) {
			console.error(err);
			this.setContent(CONTENT_TYPE.ERROR);
		}
	};

	renderContent = (type) => {
		const {
			periods,
			currentBlock,
			tokenData,
			onCloseDialog,
			account,
			penalties,
			coins,
		} = this.props;
		const { period, amount, action, isPending, isValid, error } = this.state;
		const { symbol } = tokenData;
		switch (type) {
			case CONTENT_TYPE.LOADING:
				return <AllowanceLoader coins={coins} symbol={symbol} />;
			case CONTENT_TYPE.AMOUNT:
				return (
					<AmountContent
						tokenData={tokenData}
						onClose={onCloseDialog}
						onBack={onCloseDialog}
						onNext={() => this.setContent(CONTENT_TYPE.PERIOD)}
						amount={amount}
						setAmount={this.setAmount}
						isValid={isValid}
						error={error}
					/>
				);
			case CONTENT_TYPE.PERIOD:
				return (
					<PeriodContent
						tokenData={tokenData}
						periods={periods}
						onClose={onCloseDialog}
						onBack={() => this.setContent(CONTENT_TYPE.AMOUNT)}
						onReview={() => this.setContent(CONTENT_TYPE.REVIEW)}
						setPeriod={this.setPeriod}
						currentBlock={currentBlock}
						period={period}
						amount={amount}
						openReadMore={this.openReadMore}
					/>
				);
			case CONTENT_TYPE.REVIEW:
				return (
					<ReviewContent
						tokenData={tokenData}
						onClose={onCloseDialog}
						onCancel={() => this.setContent(CONTENT_TYPE.PERIOD)}
						onProceed={() =>
							this.approveAndStake(symbol)({ amount, period, account })
						}
						currentBlock={currentBlock}
						period={period}
						amount={amount}
						penalty={penalties[symbol]}
					/>
				);
			case CONTENT_TYPE.WAITING:
				return (
					<WaitingContent
						isPending={isPending}
						action={action}
						amount={amount}
						symbol={symbol}
						onClose={onCloseDialog}
					/>
				);
			case CONTENT_TYPE.SUCCESS:
				return (
					<SuccessfulStakeContent
						tokenData={tokenData}
						account={account}
						action={action}
						period={period}
						amount={amount}
						symbol={symbol}
						currentBlock={currentBlock}
						onOkay={onCloseDialog}
					/>
				);
			case CONTENT_TYPE.ERROR:
				return <ErrorContent action={action} onOkay={onCloseDialog} />;
			default:
				return <div>No Content</div>;
		}
	};

	setContent = (type) => {
		this.setState({
			type,
		});
	};

	setAction = (action, isPending) => {
		this.setState({ action, isPending });
	};

	openReadMore = () => {
		const {
			contracts: {
				[STAKING_INDEX_COIN]: { whitepaper },
			},
		} = this.props;
		if (whitepaper) {
			open(whitepaper);
		}
	};

	render() {
		const { type } = this.state;

		return <div className="w-100">{this.renderContent(type)}</div>;
	}
}

const mapStateToProps = (store) => ({
	coins: store.app.coins,
	account: store.stake.account,
	network: store.stake.network,
	currentBlock: store.stake.currentBlock,
	stakables: store.stake.stakables,
	periods: store.stake.periods,
	penalties: store.stake.penalties,
	contracts: store.app.contracts,
});

const mapDispatchToProps = (dispatch) => ({
	generateTableData: bindActionCreators(generateTableData, dispatch),
	getAllUserStakes: bindActionCreators(getAllUserStakes, dispatch),
	getPendingTransactions: bindActionCreators(getPendingTransactions, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(StakeContent));
