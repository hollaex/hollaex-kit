import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Select } from 'antd';

import { CurrencyBall } from '../../../components';

const { Option } = Select;

const Assets = ({
	coins = {},
	pairs,
	constants = {},
	handleNext,
	updateConstants,
}) => {
	const getDefaultNativeCurrency = () => {
		if (Object.keys(coins).length !== 0) {
			if (coins['usdt']) {
				return coins['usdt'].symbol;
			}

			const [firstFiatCoinKey] =
				Object.entries(coins).find(
					([_, { meta: { is_fiat } = {} }]) => is_fiat
				) || [];
			if (firstFiatCoinKey) {
				return coins[firstFiatCoinKey].symbol;
			}

			if (coins['btc']) {
				return coins['btc'].symbol;
			}

			if (coins['eth']) {
				return coins['eth'].symbol;
			}

			const firstCoinKey = Object.keys(coins)[0];
			return coins[firstCoinKey].symbol;
		}
	};

	const [native_currency, setCurrency] = useState(getDefaultNativeCurrency());
	useEffect(() => {
		let base_coin = Object.keys(coins).length ? Object.keys(coins)[0] : '';
		setCurrency(base_coin);
	}, [coins]);
	useEffect(() => {
		setCurrency(constants.native_currency || getDefaultNativeCurrency());
		//  TODO: Fix react-hooks/exhaustive-deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [constants.native_currency]);
	const onChange = (key) => {
		setCurrency(key);
	};
	const handleStore = () => {
		const formValues = {
			kit: {
				native_currency,
			},
		};
		updateConstants(formValues, () => handleNext(3));
	};

	const open = (link) => {
		if (window) {
			window.open(link, '_blank');
		}
	};

	return (
		<div className="asset-content show-scroll">
			<div className="title-text">Native currency</div>
			<div>
				The selected native currency will be used as the currency unit to value
				certain aspects of your exchange such as deposit and withdrawal limits.
			</div>
			<div className="coin-wrapper">
				<Select onChange={onChange} value={native_currency}>
					{Object.keys(coins).map((symbol, index) => {
						const coinData = coins[symbol];
						return (
							<Option key={index} value={symbol}>
								<div className="asset-list">
									<CurrencyBall symbol={symbol} name={symbol} size="m" />
									<div className="select-coin-text">{coinData.fullname}</div>
								</div>
							</Option>
						);
					})}
				</Select>
			</div>
			<div className="title-text">Review assets</div>
			<div>
				Don't see your asset?{' '}
				<span
					className="step-link"
					onClick={() => open('https://dash.bitholla.com/financial')}
				>
					Create or add your asset here.
				</span>
			</div>
			<div className="coin-wrapper">
				{Object.keys(coins).map((symbol, index) => {
					const coinData = coins[symbol];
					return (
						<div className="asset-list" key={index}>
							<CurrencyBall symbol={symbol} name={symbol} size="m" />
							<div className="title-text">{coinData.fullname}</div>
						</div>
					);
				})}
			</div>
			<div className="title-text">Review pairs</div>
			<div>
				Don't see your pair?{' '}
				<span
					className="step-link"
					onClick={() => open('https://dash.bitholla.com/trade')}
				>
					Create or add your pair here.
				</span>
			</div>
			<div className="coin-wrapper last">
				{Object.keys(pairs).map((pair, index) => {
					const { pair_2 = '', pair_base = '' } = pairs[pair] || {};
					const pairData = coins[pair_2];
					const pairBaseData = coins[pair_base];
					return (
						<div className="asset-list" key={index}>
							<div className="title-text">{pairData.fullname}</div>
							<CurrencyBall symbol={pair_2} name={pair_2} size="m" />
							<div className="cross">X</div>
							<div className="title-text">{pairBaseData.fullname}</div>
							<CurrencyBall symbol={pair_base} name={pair_base} size="m" />
						</div>
					);
				})}
			</div>
			<div className="asset-btn-wrapper">
				<div className="btn-container">
					<Button onClick={handleStore} disabled={!native_currency}>
						Proceed
					</Button>
				</div>
				{/* <span className="step-link" onClick={() => handleNext(3)}>
					Skip this step
				</span> */}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
	pairs: state.app.pairs,
	user: state.user,
});

export default connect(mapStateToProps)(Assets);
