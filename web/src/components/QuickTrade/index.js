import React, { useRef, useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import classnames from 'classnames';
import { isMobile } from 'react-device-detect';
import math from 'mathjs';
import { withRouter, browserHistory } from 'react-router';
import debounce from 'lodash.debounce';

import { changePair } from 'actions/appActions';
import { isLoggedIn } from 'utils/token';
import { Button, EditWrapper, Dialog } from 'components';
import STRINGS from 'config/localizedStrings';
import InputGroup from './InputGroup';
import { getSparklines } from 'actions/chartAction';
import { getDecimals } from 'utils/utils';
import { MarketsSelector } from 'containers/Trade/utils';
import Details from 'containers/QuickTrade/components/Details';
import Header from 'containers/QuickTrade/components/Header';
import Footer from 'containers/QuickTrade/components/Footer';
import Balance from 'containers/QuickTrade/components/Balance';
import QuoteResult from 'containers/QuickTrade/QuoteResult';
import ReviewOrder from 'containers/QuickTrade/components/ReviewOrder';
import { flipPair } from 'containers/QuickTrade/components/utils';
import {
	getSourceOptions,
	brokerPairsSelector,
} from 'containers/QuickTrade/components/utils';
import {
	QuickTradeLimitsSelector,
	BrokerLimitsSelector,
} from 'containers/QuickTrade/utils';
import { getQuickTrade, executeQuickTrade } from 'actions/quickTradeActions';
import { FieldError } from 'components/Form/FormFields/FieldWrapper';
import { translateError } from 'components/QuickTrade/utils';

const PAIR2_STATIC_SIZE = 0.000001;
const SPENDING = {
	SOURCE: 'SOURCE',
	TARGET: 'TARGET',
};

const QuickTrade = ({
	pair,
	orderLimits: { SIZE, PRICE } = {},
	pairs,
	markets,
	sourceOptions,
	autoFocus = true,
	coins,
	user,
	brokerPairs,
	preview,
	router,
	changePair,
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

	const initialPair = (router.params?.pair || Object.keys(pairs)[0]).split('-');
	const [, initialSelectedSource = sourceOptions[0]] = initialPair;
	const initialTargetOptions = getTargetOptions(initialSelectedSource);
	const [initialSelectedTarget = initialTargetOptions[0]] = initialPair;

	const [symbol, setSymbol] = useState();
	const [chartData, setChartData] = useState({});
	const [selectedBalance, setSelectedBalance] = useState(0);
	const [sourceAmount, setSourceAmount] = useState();
	const [targetAmount, setTargetAmount] = useState();
	const [selectedSource, setSelectedSource] = useState(initialSelectedSource);
	const [selectedTarget, setSelectedTarget] = useState(initialSelectedTarget);
	const [targetOptions, setTargetOptions] = useState(initialTargetOptions);
	const [showModal, setShowModal] = useState(false);
	const [isReview, setIsReview] = useState(true);
	const [loading, setLoading] = useState(false);
	const [spending, setSpending] = useState();
	const [token, setToken] = useState();
	const [error, setError] = useState();
	const [submitting, setSubmitting] = useState(false);
	const [data, setData] = useState({});
	const [reversed, setReversed] = useState(false);
	const [mounted, setMounted] = useState(false);

	const onCloseDialog = (autoHide) => {
		setIsReview(true);
		setData({});
		setShowModal(false);
		if (autoHide) {
			setTimeout(() => setError(), 5000);
		} else {
			setError();
		}
	};

	const handleError = (err, autoClose) => {
		const error =
			err.response && err.response.data
				? err.response.data.message
					? err.response.data.message
					: err.response.data
				: err.message;
		setError(error);

		if (autoClose) {
			onCloseDialog(true);
		}
	};

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

	const isUseBroker = brokerPairs[symbol] || brokerPairs[flippedPair];
	const increment_unit = isUseBroker ? SIZE && SIZE.STEP : increment_size;

	const onChangeSourceAmount = (value) => {
		setSpending(SPENDING.SOURCE);
		setSourceAmount(value);
	};

	const onChangeTargetAmount = (value) => {
		setSpending(SPENDING.TARGET);
		setTargetAmount(value);
	};

	const onSelectSource = (value) => {
		setSpending();
		setSourceAmount();
		setTargetAmount();
		setSelectedSource(value);
	};

	const onSelectTarget = (value) => {
		setSpending();
		setSourceAmount();
		setTargetAmount();
		setSelectedTarget(value);
	};

	const goTo = (path) => {
		router.push(path);
	};

	const onReview = () => {
		if (preview) {
			if (isLoggedIn()) {
				goTo(`/quick-trade/${pair}`);
			} else {
				goTo('/login');
			}
		} else {
			setIsReview(true);
			setShowModal(true);
		}
	};

	const onExecuteTrade = (token) => {
		setSubmitting(true);
		setIsReview(false);

		executeQuickTrade(token)
			.then(({ data }) => {
				setData(data);
			})
			.catch(handleError)
			.finally(() => {
				setSubmitting(false);
			});
	};

	const forwardSourceError = (sourceError) => {};

	const forwardTargetError = (targetError) => {};

	const sourceTotalBalance = (value) => {
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

	const goToPair = (pair) => {
		if (preview) {
			changePair(pair);
		} else {
			changePair(pair);
			browserHistory.push(`/quick-trade/${pair}`);
		}
	};

	const getQuote = ({
		sourceAmount,
		targetAmount,
		selectedSource,
		selectedTarget,
		spending,
	}) => {
		if (spending) {
			const spending_amount =
				spending === SPENDING.SOURCE ? sourceAmount : targetAmount;
			const [spending_currency, receiving_currency] =
				spending === SPENDING.SOURCE
					? [selectedSource, selectedTarget]
					: [selectedTarget, selectedSource];
			const [setSpendingAmount, setReceivingAmount] =
				spending === SPENDING.SOURCE
					? [setSourceAmount, setTargetAmount]
					: [setTargetAmount, setSourceAmount];

			if (spending_amount && spending_currency && receiving_currency) {
				setLoading(true);
				setReceivingAmount();
				setToken();

				getQuickTrade({
					spending_amount,
					spending_currency,
					receiving_currency,
				})
					.then(({ data: { token, spending_amount, receiving_amount } }) => {
						setSpending();
						setToken(token);
						setReceivingAmount(receiving_amount);
						setSpendingAmount(spending_amount);
					})
					.catch((err) => handleError(err, true))
					.finally(() => {
						setLoading(false);
					});
			} else {
				setReceivingAmount();
				setSpending();
				setToken();
			}
		}
	};

	const debouncedQuote = useRef(debounce(getQuote, 1000));

	useEffect(() => {
		getSparklines(Object.keys(pairs)).then((chartData) =>
			setChartData(chartData)
		);
	}, [pairs]);

	useEffect(() => {
		if (mounted) {
			const options = getTargetOptions(selectedSource);
			setTargetOptions(options);
			setSelectedTarget(options[0]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSource]);

	useEffect(() => {
		const symbol = `${selectedSource}-${selectedTarget}`;
		const flippedSymbol = flipPair(symbol);
		if (
			pairs[symbol] ||
			brokerPairs[symbol] ||
			pairs[flippedSymbol] ||
			brokerPairs[flippedSymbol]
		) {
			setSymbol(symbol);
			goToPair(symbol);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSource, selectedTarget, pairs, brokerPairs]);

	useEffect(() => {
		setError();
		debouncedQuote.current({
			sourceAmount,
			targetAmount,
			selectedSource,
			selectedTarget,
			spending,
		});
	}, [sourceAmount, targetAmount, selectedSource, selectedTarget, spending]);

	useEffect(() => {
		if (spending === SPENDING.SOURCE) {
			setReversed(false);
		} else if (spending === SPENDING.TARGET) {
			setReversed(true);
		}
	}, [spending]);

	useEffect(() => {
		setMounted(true);
	}, []);

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

	const disabled = !isLoggedIn() || !token || loading || submitting;
	const pairData = pairs[symbol] || {};
	const decimalPoint = getDecimals(pairData.increment_size);
	const [loadingSource, loadingTarget] =
		spending === SPENDING.SOURCE ? [false, loading] : [loading, false];
	const [
		[spendingAmount, spendingCurrency],
		[receivingAmount, receivingCurrency],
	] = [
		[sourceAmount, selectedSource],
		[targetAmount, selectedTarget],
	][reversed ? 'reverse' : 'slice']();

	return (
		<Fragment>
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
								loading={loadingSource}
								disabled={loadingSource}
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
								loading={loadingTarget}
								disabled={loadingTarget}
							/>

							<Balance
								text={coins[selectedTarget]?.display_name}
								balance={selectedTargetBalance}
								onClick={targetTotalBalance}
							/>

							{error && (
								<FieldError
									error={translateError(error)}
									displayError={true}
									className="input-group__error-wrapper"
								/>
							)}

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
									onClick={onReview}
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
			<Dialog
				isOpen={showModal}
				label="quick-trade-modal"
				onCloseDialog={onCloseDialog}
				shouldCloseOnOverlayClick={false}
				showCloseText={false}
				style={{ 'z-index': 100 }}
			>
				{showModal &&
					(isReview ? (
						<ReviewOrder
							onCloseDialog={onCloseDialog}
							onExecuteTrade={() => onExecuteTrade(token)}
							selectedSource={spendingCurrency}
							decimalPoint={decimalPoint}
							sourceAmount={spendingAmount}
							targetAmount={receivingAmount}
							selectedTarget={receivingCurrency}
							disabled={submitting}
						/>
					) : (
						<QuoteResult
							coins={coins}
							pairData={pairData}
							fetching={submitting}
							error={error}
							data={data}
							onClose={onCloseDialog}
							onConfirm={() => goTo('/wallet')}
						/>
					))}
			</Dialog>
		</Fragment>
	);
};

const mapDispatchToProps = (dispatch) => ({
	changePair: bindActionCreators(changePair, dispatch),
});

const mapStateToProps = (store) => {
	const {
		app: { pair, broker, pairs },
	} = store;
	const sourceOptions = getSourceOptions(store.app.pairs, store.app.broker);

	const flippedPair = flipPair(pair);
	const qtlimits = !!broker.filter(
		({ symbol }) => symbol === pair || symbol === flippedPair
	)
		? BrokerLimitsSelector(store)
		: QuickTradeLimitsSelector(store);

	return {
		pair,
		brokerPairs: brokerPairsSelector(store),
		sourceOptions,
		pairs,
		coins: store.app.coins,
		constants: store.app.constants,
		markets: MarketsSelector(store),
		user: store.user,
		orderLimits: qtlimits,
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(QuickTrade));
