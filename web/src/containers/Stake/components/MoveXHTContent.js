import React, { Component } from 'react';
import { connect } from 'react-redux';
import mathjs from 'mathjs';
import { bindActionCreators } from 'redux';
import { DEFAULT_COIN_DATA } from 'config/constants';
import { openContactForm } from 'actions/appActions';
import withConfig from 'components/ConfigProvider/withConfig';
import { OtpForm, Loader } from 'components';

import MovePrompt from './MovePrompt';
import MoveAmount from './MoveAmount';
import ReviewModalContent from 'containers/Withdraw/ReviewModalContent';

const CONTENT_TYPE = {
	PROMPT: 'PROMPT',
	AMOUNT: 'AMOUNT',
	CONFIRM: 'CONFIRM',
	OTP: 'OTP',
	LOADING: 'LOADING',
	EMAIL: 'EMAIL',
};

class MoveXHTContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: CONTENT_TYPE.PROMPT,
			amount: '',
		};
	}

	setAmount = ({ target: { value } }) => {
		const { balance, coins } = this.props;
		const currency = 'xht';
		const { min } = coins[currency] || DEFAULT_COIN_DATA;
		const available = balance[`${currency}_available`];

		let amount;
		if (mathjs.larger(value, available)) {
			amount = available;
		} else if (mathjs.smaller(value, min)) {
			amount = min;
		} else {
			amount = value;
		}
		this.setState({ amount });
	};

	onSubmitOtp = () => {
		this.setContent(CONTENT_TYPE.EMAIL);
	};

	renderContent = (type) => {
		const { amount } = this.state;
		const { setContent } = this;
		const {
			account,
			onCloseDialog,
			coins,
			prices,
			openContactForm,
			balance,
		} = this.props;
		const currency = 'xht';

		const { min } = coins[currency] || DEFAULT_COIN_DATA;
		const available = balance[`${currency}_available`];

		const data = {
			network: '',
			address: account,
			amount,
			fee: '',
			captcha: '',
			fee_coin: '',
		};

		switch (type) {
			case CONTENT_TYPE.PROMPT:
				return (
					<MovePrompt
						account={account}
						// onBack={onCloseDialog}
						// onNext={() => setContent(CONTENT_TYPE.AMOUNT)}
						onClose={onCloseDialog}
					/>
				);
			case CONTENT_TYPE.AMOUNT:
				return (
					<MoveAmount
						currency={currency}
						min={min}
						available={available}
						onBack={onCloseDialog}
						onNext={() => setContent(CONTENT_TYPE.CONFIRM)}
						onClose={onCloseDialog}
						amount={amount}
						setAmount={this.setAmount}
					/>
				);
			case CONTENT_TYPE.CONFIRM:
				return (
					<ReviewModalContent
						coins={coins}
						currency={currency}
						data={data}
						price={prices[currency]}
						onClickAccept={() => setContent(CONTENT_TYPE.OTP)}
						onClickCancel={onCloseDialog}
						hasDestinationTag={false}
					/>
				);
			case CONTENT_TYPE.OTP:
				return (
					<OtpForm onSubmit={this.onSubmitOtp} onClickHelp={openContactForm} />
				);
			case CONTENT_TYPE.LOADING:
				return <Loader relative={true} background={false} />;
			default:
				return <div>No Content</div>;
		}
	};

	setContent = (type) => {
		this.setState({
			type,
		});
	};

	render() {
		const { type } = this.state;

		return <div className="w-100">{this.renderContent(type)}</div>;
	}
}

const mapStateToProps = (store) => ({
	account: store.stake.account,
	coins: store.app.coins,
	balance: store.user.balance,
	prices: store.orderbook.prices,
});

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(MoveXHTContent));
