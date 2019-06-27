import React, { Component } from 'react';
import { Button } from '../../../components';
import {
	calculatePrice,
	fiatSymbol
} from '../../../utils/currency';
import Currency from './Currency';
import Arrow from './Arrow';
import STRINGS from '../../../config/localizedStrings';

class CurrencySlider extends Component {
	state = {
		currentCurrency: ''
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
			currentCurrency: currencyArray[currentCurrencyIndex]
		});
	};

	previousCurrency = () => {
		const { currentCurrency } = this.state;
		const currencyArray = Object.keys(this.props.coins);
		const currencyIndex = this.findCurrentCurrencyIndex(currentCurrency);
		const currentCurrencyIndex =
			currencyIndex <= 0 ? currencyArray.length - 1 : currencyIndex - 1;
		this.setState({
			currentCurrency: currencyArray[currentCurrencyIndex]
		});
	};

	findCurrentCurrencyIndex = (currentCurrency) =>
		Object.keys(this.props.coins).findIndex(
			(currency) => currency === currentCurrency
		);

	render() {
		const { wallets, balance, prices, navigate, coins } = this.props;
		const { currentCurrency } = this.state;
		const balanceValue = balance[`${currentCurrency}_balance`];
		const balanceFiat =
			currentCurrency !== fiatSymbol
				&& calculatePrice(balanceValue, prices[currentCurrency]);

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
							balanceText={balanceFiat}
							coins={coins}
						/>
					}
					<div className="d-flex align-items-center arrow-container">
						<Arrow className="right" onClick={() => this.nextCurrency()} />
					</div>
				</div>

				<div className="mb-4 button-container">
					{wallets[STRINGS[`${currentCurrency.toUpperCase()}_FULLNAME`].toLowerCase()] && (
						<div className="d-flex justify-content-between flew-row ">
							<Button
								className="mr-4"
								label={STRINGS.formatString(
									STRINGS.RECEIVE_CURRENCY,
									STRINGS[`${currentCurrency.toUpperCase()}_FULLNAME`]
								).join('')}
								onClick={() => navigate(`wallet/${currentCurrency}/deposit`)}
							/>
							<Button
								label={STRINGS.formatString(
									STRINGS.SEND_CURRENCY,
									STRINGS[`${currentCurrency.toUpperCase()}_FULLNAME`]
								).join('')}
								onClick={() => navigate(`wallet/${currentCurrency}/withdraw`)}
							/>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default CurrencySlider;
