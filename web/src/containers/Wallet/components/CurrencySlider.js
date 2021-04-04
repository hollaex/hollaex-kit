import React, { Component } from 'react';
import { Button } from '../../../components';
import { calculatePrice } from '../../../utils/currency';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from '../../../config/constants';
import Currency from './Currency';
import Arrow from './Arrow';
import STRINGS from '../../../config/localizedStrings';

class CurrencySlider extends Component {
	state = {
		currentCurrency: '',
	};

	componentWillMount() {
		const currency = Object.keys(this.props.coins)[0];
		const currencyIndex = this.findCurrentCurrencyIndex(currency);
		this.setcurrentCurrency(currency);
		this.setcurrentCurrencyIndex(currencyIndex);
	}

	setcurrentCurrency = (currency) => {
		this.setState({ currentCurrency: currency });
	};

	setcurrentCurrencyIndex = (currentCurrencyIndex) => {
		this.setState({ currentCurrencyIndex });
	};

	nextCurrency = () => {
		const { currentCurrency } = this.state;
		const currencyArray = Object.keys(this.props.coins);
		const currenciesLength = currencyArray.length;
		const currencyIndex = this.findCurrentCurrencyIndex(currentCurrency);
		const currentCurrencyIndex =
			currencyIndex >= currenciesLength - 1 ? 0 : currencyIndex + 1;

		this.setState({
			currentCurrency: currencyArray[currentCurrencyIndex],
		});
	};

	previousCurrency = () => {
		const { currentCurrency } = this.state;
		const currencyArray = Object.keys(this.props.coins);
		const currencyIndex = this.findCurrentCurrencyIndex(currentCurrency);
		const currentCurrencyIndex =
			currencyIndex <= 0 ? currencyArray.length - 1 : currencyIndex - 1;
		this.setState({
			currentCurrency: currencyArray[currentCurrencyIndex],
		});
	};

	findCurrentCurrencyIndex = (currentCurrency) =>
		Object.keys(this.props.coins).findIndex(
			(currency) => currency === currentCurrency
		);

	render() {
		const { balance, prices, navigate, coins } = this.props;
		const { currentCurrency } = this.state;
		const balanceValue = balance[`${currentCurrency}_balance`];
		const baseBalance =
			currentCurrency !== BASE_CURRENCY &&
			calculatePrice(balanceValue, prices[currentCurrency]);
		const { fullname, allow_deposit, allow_withdrawal } =
			coins[currentCurrency] || DEFAULT_COIN_DATA;

		return (
			<div className="d-flex flex-column justify-content-end currency-list-container f-1">
				<div className="d-flex mb-5 flex-row">
					<div className="d-flex align-items-center arrow-container">
						<Arrow className="left" onClick={() => this.previousCurrency()} />
					</div>
					{
						<Currency
							currency={currentCurrency}
							balance={balance}
							balanceValue={balanceValue}
							balanceText={baseBalance}
							coins={coins}
						/>
					}
					<div className="d-flex align-items-center arrow-container">
						<Arrow className="right" onClick={() => this.nextCurrency()} />
					</div>
				</div>

				<div className="mb-4 button-container">
					<div className="d-flex justify-content-between flew-row ">
						{allow_deposit && (
							<Button
								className="mr-4"
								label={STRINGS.formatString(
									STRINGS['RECEIVE_CURRENCY'],
									fullname
								).join('')}
								onClick={() => navigate(`wallet/${currentCurrency}/deposit`)}
							/>
						)}
						{allow_withdrawal && (
							<Button
								label={STRINGS.formatString(
									STRINGS['SEND_CURRENCY'],
									fullname
								).join('')}
								onClick={() => navigate(`wallet/${currentCurrency}/withdraw`)}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default CurrencySlider;
