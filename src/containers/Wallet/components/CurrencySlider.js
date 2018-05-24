import React, { Component } from 'react';
import { Button } from '../../../components';
import { CURRENCIES } from '../../../config/constants';
import {
	calculatePrice,
	fiatFormatToCurrency,
	fiatSymbol
} from '../../../utils/currency';
import Currency from './Currency';
import Arrow from './Arrow';
import STRINGS from '../../../config/localizedStrings';

class CurrencySlider extends Component {
	state = {
		currenctCurrency: '',
		currenctCurrencyIndex: 0
	};

	componentWillMount() {
		const currency = Object.keys(CURRENCIES)[0];
		const currencyIndex = this.findCurrentCurrencyIndex(currency);
		this.setcurrenctCurrency(currency);
		this.setCurrenctCurrencyIndex(currencyIndex);
	}

	setcurrenctCurrency = (currency) => {
		this.setState({ currenctCurrency: currency });
	};

	setCurrenctCurrencyIndex = (currenctCurrencyIndex) => {
		this.setState({ currenctCurrencyIndex });
	};

	nextCurrency = () => {
		const { currenctCurrency } = this.state;
		const currencyIndex = this.findCurrentCurrencyIndex(currenctCurrency);
		const currenciesLength = Object.keys(CURRENCIES).length;

		if (currencyIndex > -1 && currencyIndex < currenciesLength) {
			this.setState({
				currenctCurrency: Object.keys(CURRENCIES)[currencyIndex + 1]
			});
		}
	};

	previousCurrency = () => {
		const { currenctCurrency } = this.state;
		const currencyIndex = this.findCurrentCurrencyIndex(currenctCurrency);

		if (currencyIndex > 0) {
			const currenctCurrencyIndex = currencyIndex - 1;
			this.setState({
				currenctCurrency: Object.keys(CURRENCIES)[currenctCurrencyIndex],
				currenctCurrencyIndex
			});
		}
	};

	findCurrentCurrencyIndex = (currenctCurrency) =>
		Object.keys(CURRENCIES).findIndex(
			(currency) => currency === currenctCurrency
		);

	render() {
		const { wallets, balance, prices, navigate } = this.props;
		const { currenctCurrency } = this.state;
		const currenctCurrencyIndex = this.findCurrentCurrencyIndex(
			currenctCurrency
		);
		const balanceValue = balance[`${currenctCurrency}_balance`];
		const balanceText =
			currenctCurrency === fiatSymbol
				? fiatFormatToCurrency(balanceValue)
				: fiatFormatToCurrency(
						calculatePrice(balanceValue, prices[currenctCurrency])
					);

		return (
			<div className="d-flex flex-column justify-content-end currency-list-container f-1">
				<div className="d-flex mb-5 flex-row">
					<div className="d-flex arrow-container">
						{currenctCurrencyIndex > 0 && (
							<Arrow onClick={() => this.previousCurrency()} label="<" />
						)}
					</div>
					{
						<Currency
							currency={currenctCurrency}
							balance={balance}
							balanceValue={balanceValue}
							balanceText={balanceText}
						/>
					}
					<div className="d-flex arrow-container">
						{currenctCurrencyIndex < Object.keys(CURRENCIES).length - 1 && (
							<Arrow onClick={() => this.nextCurrency()} label=">" />
						)}
					</div>
				</div>
				{wallets[CURRENCIES[currenctCurrency].fullName.toLowerCase()] && (
					<div className="d-flex justify-content-between flew-row mb-4">
						<Button
							className="mr-4"
							label={STRINGS.formatString(
								STRINGS.RECEIVE_CURRENCY,
								CURRENCIES[currenctCurrency].fullName
							).join('')}
							onClick={() => navigate(`wallet/${currenctCurrency}/deposit`)}
						/>
						<Button
							label={STRINGS.formatString(
								STRINGS.SEND_CURRENCY,
								CURRENCIES[currenctCurrency].fullName
							).join('')}
							onClick={() => navigate(`wallet/${currenctCurrency}/withdraw`)}
						/>
					</div>
				)}
			</div>
		);
	}
}

export default CurrencySlider;
