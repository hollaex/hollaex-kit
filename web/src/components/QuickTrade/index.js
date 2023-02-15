import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { object, func, bool, array } from 'prop-types';
import classnames from 'classnames';
import { isMobile } from 'react-device-detect';
import math from 'mathjs';
import { withRouter } from 'react-router';

import { isLoggedIn } from 'utils/token';
import { Button, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import InputGroup from './InputGroup';
import { getSparklines } from 'actions/chartAction';
import { getDecimals } from 'utils/utils';
import { MarketsSelector } from 'containers/Trade/utils';
import Details from 'containers/QuickTrade/components/Details';
import Header from 'containers/QuickTrade/components/Header';
import Footer from 'containers/QuickTrade/components/Footer';
import Balance from 'containers/QuickTrade/components/Balance';
import { flipPair } from 'containers/QuickTrade/components/utils';
import { getSourceOptions } from 'containers/QuickTrade/components/utils';

const PAIR2_STATIC_SIZE = 0.000001;

const QuickTrade = ({
	orderLimits: { SIZE, PRICE },
	pairs,
	symbol,
	markets,
	onReviewQuickTrade,
	sourceOptions,
	autoFocus = true,
	coins,
	user,
	brokerPairs,
}) => {
	const getTargetOptions = (source) =>
		sourceOptions.filter((key) => {
			const pairKey = `${key}-${source}`;
			const flippedKey = flipPair(pairKey);

			return (
				pairs[pairKey] ||
				pairs[flippedKey] ||
				brokerPairs[pairKey] ||
				brokerPairs[flippedKey]
			);
		});

	const initialPair = Object.keys(pairs)[0];
	const [, initialSelectedSource = sourceOptions[0]] = initialPair.split('-');
	const initialTargetOptions = getTargetOptions(initialSelectedSource);
	const [initialSelectedTarget = initialTargetOptions[0]] = initialPair.split(
		'-'
	);

	const [chartData, setChartData] = useState({});
	const [selectedBalance, setSelectedBalance] = useState(0);
	const [sourceAmount, setSourceAmount] = useState();
	const [targetAmount, setTargetAmount] = useState();
	const [selectedSource, setSelectedSource] = useState(initialSelectedSource);
	const [selectedTarget, setSelectedTarget] = useState(initialSelectedTarget);

	const targetOptions = getTargetOptions(selectedSource);

	const flippedPair = flipPair(symbol);
	const isShowChartDetails = pairs[symbol] || pairs[flippedPair];
	const side =
		pairs[symbol] || brokerPairs[symbol]
			? 'buy'
			: pairs[flippedPair] || brokerPairs[flippedPair]
			? 'sell'
			: undefined;

	const market = markets.find(
		({ pair: { pair_base, pair_2 } }) =>
			(pair_base === selectedSource && pair_2 === selectedTarget) ||
			(pair_2 === selectedSource && pair_base === selectedTarget)
	);

	const { key, increment_size, display_name } = market || {};

	const onChangeSourceAmount = (value) => {
		setSourceAmount(value);
	};

	const onChangeTargetAmount = (value) => {
		setTargetAmount(value);
	};

	const onSelectSource = (value) => {
		setSelectedSource(value);
	};

	const onSelectTarget = (value) => {
		setSelectedTarget(value);
	};

	const forwardSourceError = (sourceError) => {};

	const forwardTargetError = (targetError) => {};

	const sourceTotalBalance = (value) => {
		let isUseBroker = false;
		if (brokerPairs[symbol] || brokerPairs[flippedPair]) {
			if (pairs[symbol] !== undefined || pairs[flippedPair] !== undefined) {
				isUseBroker = true;
			} else {
				isUseBroker = true;
			}
		} else {
			isUseBroker = false;
		}
		const increment_unit = isUseBroker ? SIZE && SIZE.STEP : increment_size;
		const decimalPoint = getDecimals(
			side === 'buy' ? PAIR2_STATIC_SIZE : increment_unit
		);
		const decimalPointValue = Math.pow(10, decimalPoint);
		const decimalValue =
			math.floor(value * decimalPointValue) / decimalPointValue;
		if (value) {
			onChangeSourceAmount(decimalValue);
			setSelectedBalance(value);
		}
	};

	const targetTotalBalance = (value) => {
		if (value) {
			onChangeTargetAmount(value);
		}
	};

	useEffect(() => {
		getSparklines(Object.keys(pairs)).then((chartData) =>
			setChartData(chartData)
		);
	}, [pairs]);

	useEffect(() => {
		setSelectedTarget(targetOptions[0]);
		//  TODO: Fix react-hooks/exhaustive-deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSource]);

	const { balance: userBalance } = user;

	const lineChartData = {
		...chartData[key],
		name: 'Line',
		type: 'line',
	};

	const selectedSourceBalance =
		selectedSource && userBalance[`${selectedSource.toLowerCase()}_available`];
	const selectedTargetBalance =
		selectedTarget && userBalance[`${selectedTarget.toLowerCase()}_available`];

	let isUseBroker = false;
	if (brokerPairs[symbol] || brokerPairs[flippedPair]) {
		if (pairs[symbol] !== undefined || pairs[flippedPair] !== undefined) {
			isUseBroker = true;
		} else {
			isUseBroker = true;
		}
	} else {
		isUseBroker = false;
	}
	const increment_unit = isUseBroker ? SIZE && SIZE.STEP : increment_size;
	const disabled = !isLoggedIn();

	return (
		<div className="quick_trade-container">
			<Header />

			<div
				className={classnames('quick_trade-wrapper', 'd-flex', {
					'width-none': !isShowChartDetails,
				})}
			>
				{!isMobile && isShowChartDetails && market && (
					<Details market={market} lineChartData={lineChartData} />
				)}
				<div className="d-flex flex-column trade-section">
					<div className="inner-content">
						<div className="small-text">
							<EditWrapper
								stringId="QUICK_TRADE_COMPONENT.GO_TO_TEXT"
								renderWrapper={(children) => (
									<div className="mr-2">{children}</div>
								)}
							>
								{STRINGS['QUICK_TRADE_COMPONENT.GO_TO_TEXT']}
							</EditWrapper>{' '}
							<Link to="/wallet">
								<span>
									<EditWrapper stringId="WALLET_TITLE">
										{STRINGS['WALLET_TITLE']}
									</EditWrapper>
								</span>
							</Link>
						</div>

						<Balance
							text={coins[selectedSource]?.display_name}
							balance={selectedSourceBalance}
							onClick={sourceTotalBalance}
						/>

						<InputGroup
							name={STRINGS['CONVERT']}
							stringId={'CONVERT'}
							options={sourceOptions}
							inputValue={sourceAmount}
							selectValue={selectedSource}
							onSelect={onSelectSource}
							onInputChange={onChangeSourceAmount}
							forwardError={forwardSourceError}
							limits={side === 'buy' ? PRICE : SIZE}
							autoFocus={autoFocus}
							decimal={side === 'buy' ? PAIR2_STATIC_SIZE : increment_unit}
							availableBalance={selectedSourceBalance}
							pair={isUseBroker ? symbol : key ? key : ''}
							coins={coins}
							selectedBalance={selectedBalance}
						/>
						<InputGroup
							name={STRINGS['TO']}
							stringId={'TO'}
							options={targetOptions}
							inputValue={targetAmount}
							selectValue={selectedTarget}
							onSelect={onSelectTarget}
							onInputChange={onChangeTargetAmount}
							forwardError={forwardTargetError}
							limits={side === 'buy' ? SIZE : PRICE}
							decimal={side === 'buy' ? increment_unit : PAIR2_STATIC_SIZE}
							pair={isUseBroker ? symbol : key ? key : ''}
							coins={coins}
						/>

						<Balance
							text={coins[selectedTarget]?.display_name}
							balance={selectedTargetBalance}
							onClick={targetTotalBalance}
						/>

						<div
							className={classnames(
								'quick_trade-section_wrapper',
								'd-flex',
								'flex-column',
								'align-items-end',
								'btn-wrapper'
							)}
						>
							<EditWrapper stringId={'QUICK_TRADE_COMPONENT.BUTTON'} />
							<Button
								label={STRINGS['QUICK_TRADE_COMPONENT.BUTTON']}
								onClick={onReviewQuickTrade}
								disabled={disabled}
								type="button"
								className={!isMobile ? 'w-50' : 'w-100'}
							/>
						</div>
						<Footer brokerUsed={isUseBroker} name={display_name} />
					</div>
				</div>
			</div>
		</div>
	);
};

QuickTrade.propTypes = {
	onReviewQuickTrade: func.isRequired,
	disabled: bool.isRequired,
	pairs: object.isRequired,
	coins: object.isRequired,
	constants: object.isRequired,
	markets: array.isRequired,
	orderLimits: object.isRequired,
	sourceOptions: array,
};

QuickTrade.defaultProps = {
	sourceOptions: [],
	onReviewQuickTrade: () => {},
	disabled: false,
};

const mapStateToProps = (store) => {
	const sourceOptions = getSourceOptions(store.app.pairs, store.app.broker);
	const brokerPairs = Object.fromEntries(
		store.app.broker.map((data) => [data.symbol, data])
	);

	return {
		pair: store.app.pair,
		brokerPairs,
		sourceOptions,
		pairs: store.app.pairs,
		coins: store.app.coins,
		constants: store.app.constants,
		markets: MarketsSelector(store),
		user: store.user,
	};
};

export default connect(mapStateToProps)(withRouter(QuickTrade));
