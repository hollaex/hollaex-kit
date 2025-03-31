import React, { useRef, useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import moment from 'moment';
import classnames from 'classnames';
import { isMobile } from 'react-device-detect';
import math from 'mathjs';
import { withRouter, browserHistory } from 'react-router';
import debounce from 'lodash.debounce';
import { SwapOutlined } from '@ant-design/icons';

import { changePair, setIsQuickTrade } from 'actions/appActions';
import { isLoggedIn } from 'utils/token';
import { Button, EditWrapper, Dialog, Image } from 'components';
import STRINGS from 'config/localizedStrings';
import InputGroup from './InputGroup';
import { getMiniCharts } from 'actions/chartAction';
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
	quicktradePairSelector,
} from 'containers/QuickTrade/components/utils';
import { getQuickTrade, executeQuickTrade } from 'actions/quickTradeActions';
import { FieldError } from 'components/Form/FormFields/FieldWrapper';
import { translateError } from 'components/QuickTrade/utils';
import QuoteExpiredBlock from './QuoteExpiredBlock';
import withConfig from 'components/ConfigProvider/withConfig';

const PAIR2_STATIC_SIZE = 0.000001;
const SPENDING = {
	SOURCE: 'SOURCE',
	TARGET: 'TARGET',
};
const TYPES = {
	PRO: 'pro',
	BROKER: 'broker',
	NETWORK: 'network',
};

const QuickTrade = ({
	pair,
	pairs,
	markets,
	sourceOptions,
	autoFocus = true,
	coins,
	user,
	quicktradePairs,
	preview,
	router,
	router: { params },
	changePair,
	icons: ICONS,
	chain_trade_config,
	constants,
	setIsQuickTrade,
}) => {
	const getTargetOptions = (source) =>
		sourceOptions.filter((key) => {
			const pairKey = `${key}-${source}`;
			const flippedKey = flipPair(pairKey);

			return quicktradePairs[pairKey] || quicktradePairs[flippedKey];
		});

	const queryPair = (
		quicktradePairs[params?.pair] || quicktradePairs[flipPair(params?.pair)]
	)?.symbol;
	const initialPair = (queryPair || Object.keys(quicktradePairs)[0]).split('-');
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
	const [targetOptions, setTargetOptions] = useState(
		chain_trade_config?.active ? sourceOptions : initialTargetOptions
	);
	const [showModal, setShowModal] = useState(false);
	const [isReview, setIsReview] = useState(true);
	const [loading, setLoading] = useState(false);
	const [spending, setSpending] = useState();
	const [token, setToken] = useState();
	const [error, setError] = useState();
	const [submitting, setSubmitting] = useState(false);
	const [data, setData] = useState({});
	const [mounted, setMounted] = useState(false);
	const [expiry, setExpiry] = useState();
	const [hasExpiredOnce, setHasExpiredOnce] = useState(false);
	const [time, setTime] = useState(moment());
	const [lineChartData, setLineChartData] = useState({});
	const [allChartsData, setAllChartsData] = useState({});
	const [showPriceTrendModal, setShowPriceTrendModal] = useState(false);
	const [isOpenTopField, setIsOpenTopField] = useState(false);
	const [isOpenBottomField, setIsOpenBottomField] = useState(false);

	const resetForm = () => {
		setTargetAmount();
		setSourceAmount();
		setSpending();
		setToken();
		setExpiry();
	};

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

	const market = markets.find(
		({ pair: { pair_base, pair_2 } }) =>
			(pair_base === selectedSource && pair_2 === selectedTarget) ||
			(pair_2 === selectedSource && pair_base === selectedTarget)
	);

	const { key, display_name } = market || {};

	const isUseBroker =
		(quicktradePairs[symbol] || quicktradePairs[flippedPair])?.type ===
		TYPES.BROKER;
	const isNetwork =
		(quicktradePairs[symbol] || quicktradePairs[flippedPair])?.type ===
		TYPES.NETWORK;

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
				resetForm();
			})
			.catch(handleError)
			.finally(() => {
				setSubmitting(false);
			});
	};

	const sourceTotalBalance = (value) => {
		const decimalPoint = getDecimals(
			coins[selectedSource]?.increment_unit || PAIR2_STATIC_SIZE
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

	const addSecondsToExpiry = (expiry) => {
		const expiryDate = new Date(expiry);

		if (!expiry || !moment(expiryDate).isBefore(moment())) {
			return expiry;
		}

		const dateObj = new Date();
		const SECONDS_TO_ADD = 20;
		expiryDate.setTime(dateObj.getTime() + SECONDS_TO_ADD * 1000);

		const updatedExpiry = expiryDate.toISOString();

		return updatedExpiry;
	};

	const getQuote = ({
		sourceAmount: spending_amount,
		targetAmount: receiving_amount,
		selectedSource: spending_currency,
		selectedTarget: receiving_currency,
		spending,
	}) => {
		if (spending) {
			const [amount, amountPayload] =
				spending === SPENDING.SOURCE
					? [spending_amount, { spending_amount }]
					: [receiving_amount, { receiving_amount }];

			if (amount && spending_currency && receiving_currency) {
				setLoading(true);
				setToken();
				setExpiry();
				setError();

				getQuickTrade({
					...amountPayload,
					spending_currency,
					receiving_currency,
				})
					.then(
						({
							data: { token, spending_amount, receiving_amount, expiry },
						}) => {
							setSpending();
							setToken(token);
							setExpiry(addSecondsToExpiry(expiry));
							setTargetAmount(receiving_amount);
							setSourceAmount(spending_amount);
						}
					)
					.catch((err) => handleError(err, true))
					.finally(() => {
						setLoading(false);
					});
			} else {
				resetForm();
			}
		}
	};

	const debouncedQuote = useRef(debounce(getQuote, 1000));
	const activeQuickTradePair =
		quicktradePairs[pair]?.symbol || quicktradePairs[flipPair(pair)]?.symbol;

	useEffect(() => {
		setTimeout(() => {
			const pairBase = activeQuickTradePair
				? activeQuickTradePair?.split('-')[1]
				: pair.split('-')[1];
			const assetValues = Object.keys(coins)
				.map((val) => coins[val].code)
				.toLocaleString();
			const chartValue = allChartsData[pairBase];

			if (chartValue) {
				setChartData(chartValue);
			} else {
				getMiniCharts(assetValues, pairBase).then((chartValues) => {
					setChartData(chartValues);
					setAllChartsData((prev) => ({
						...prev,
						...{
							[pairBase]: chartValues,
						},
					}));
				});
			}
		}, 0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [coins, pair]);

	useEffect(() => {
		if (mounted) {
			const options = getTargetOptions(selectedSource);
			const selectedOption =
				selectedSource !== sourceOptions[0]
					? sourceOptions[0]
					: sourceOptions[1];
			if (chain_trade_config?.active) {
				setSelectedTarget(selectedOption);
			} else {
				setTargetOptions(options);
				setSelectedTarget(options[0]);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSource]);

	useEffect(() => {
		if (selectedSource === selectedTarget) return;
		const symbol = `${selectedSource}-${selectedTarget}`;
		const flippedSymbol = flipPair(symbol);

		if (quicktradePairs[symbol] || chain_trade_config?.active) {
			setSymbol(symbol);
			goToPair(symbol);
		} else if (quicktradePairs[flippedSymbol]) {
			setSymbol(flippedSymbol);
			goToPair(flippedSymbol);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSource, selectedTarget, quicktradePairs]);

	useEffect(() => {
		debouncedQuote.current({
			sourceAmount,
			targetAmount,
			selectedSource,
			selectedTarget,
			spending,
		});
	}, [sourceAmount, targetAmount, selectedSource, selectedTarget, spending]);

	useEffect(() => {
		setMounted(true);
		if (window.location.pathname.includes(`/quick-trade`)) {
			setIsQuickTrade(true);
		}
		return () => {
			setIsQuickTrade(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(moment());
			return () => clearInterval(interval);
		}, 1000);
	}, []);

	useEffect(() => {
		if (!hasExpiredOnce && time.isAfter(moment(expiry))) {
			setHasExpiredOnce(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasExpiredOnce, time]);

	useEffect(() => {
		setTimeout(() => {
			const lineData = {
				...chartData[`${activeQuickTradePair ? activeQuickTradePair : pair}`],
			};
			setLineChartData({
				...lineData,
				name: 'Line',
				type: 'line',
			});
		}, 0);
	}, [pair, chartData, activeQuickTradePair]);

	const isExpired = time.isAfter(moment(expiry));

	const { balance: userBalance } = user;

	const selectedSourceBalance =
		selectedSource && userBalance[`${selectedSource.toLowerCase()}_available`];
	const selectedTargetBalance =
		selectedTarget && userBalance[`${selectedTarget.toLowerCase()}_available`];

	const disabled =
		!isLoggedIn() || !token || loading || submitting || isExpired;
	const pairData = pairs[symbol] || {};
	const [loadingSource, loadingTarget] =
		spending && spending === SPENDING.SOURCE
			? [false, loading]
			: [loading, false];

	const onSwap = (selectedSource, selectedTarget) => {
		onSelectSource(selectedTarget);
		// ToDo: to remove that jump issue from the swap, the use Effect logic shuold be integrated to the select function
		setTimeout(() => onSelectTarget(selectedSource), 0.1);
	};

	const onRequoteClick = () => {
		getQuote({
			sourceAmount,
			targetAmount,
			selectedSource,
			selectedTarget,
			spending: true,
		});
	};

	const handlePriceTrendsModal = () => {
		setShowPriceTrendModal(true);
	};

	const handlePriceTrendClose = () => {
		setShowPriceTrendModal(false);
	};

	return (
		<Fragment>
			<div className="quick_trade-container">
				<Header viewTrendsClick={handlePriceTrendsModal} />

				<div className={classnames('quick_trade-wrapper', 'd-flex')}>
					<Details
						coinChartData={lineChartData}
						pair={activeQuickTradePair ? activeQuickTradePair : pair}
						brokerUsed={isUseBroker}
						networkName={display_name}
						isNetwork={isNetwork}
						showOnlyTitle={isMobile}
					/>
					<Dialog
						isOpen={showPriceTrendModal}
						label="price-trend-modal"
						onCloseDialog={handlePriceTrendClose}
						shouldCloseOnOverlayClick={false}
						showCloseText
						style={{ 'z-index': 100 }}
					>
						<div>
							<div className="d-flex price-title-wrapper">
								<div>
									<Image
										iconId="CHART_VIEW"
										icon={ICONS['CHART_VIEW']}
										wrapperClassName="quick_trade_price_trend_icon price_trend_title_icon"
									/>

									{STRINGS['QUICK_TRADE_COMPONENT.PRICE_TREND']}
								</div>
								<div onClick={handlePriceTrendClose}>
									<Image
										iconId="CLOSE_CROSS"
										icon={ICONS['CLOSE_CROSS']}
										wrapperClassName="close-modal-icon"
									/>
								</div>
							</div>
							<Details
								coinChartData={lineChartData}
								pair={activeQuickTradePair ? activeQuickTradePair : pair}
								brokerUsed={isUseBroker}
								networkName={display_name}
								isNetwork={isNetwork}
							/>
						</div>
					</Dialog>

					<div className="d-flex flex-column trade-section">
						<div className="inner-content">
							<div className="balance-text mb-3 goto-wallet-container">
								<EditWrapper
									stringId="QUICK_TRADE_COMPONENT.GO_TO_TEXT"
									renderWrapper={(children) => (
										<div className="mr-2">{children}</div>
									)}
								>
									{STRINGS['QUICK_TRADE_COMPONENT.GO_TO_TEXT']}
								</EditWrapper>{' '}
								<Link to="/wallet">
									<span className="go-to-text">
										<EditWrapper stringId="WALLET_TITLE">
											{STRINGS['WALLET_TITLE']}
										</EditWrapper>
									</span>
								</Link>
							</div>

							<div
								className={
									isOpenTopField
										? 'active-border quick-trade-input'
										: 'quick-trade-input'
								}
							>
								<div className="d-flex justify-content-between mb-3">
									<div className="bold caps-first">
										<EditWrapper stringId={'CONVERT'}>
											{STRINGS['CONVERT']}
										</EditWrapper>
									</div>
									<Balance
										text={coins[selectedSource]?.display_name}
										balance={selectedSourceBalance}
										onClick={sourceTotalBalance}
									/>
								</div>
								<InputGroup
									options={sourceOptions.filter(
										(coin) => coin !== selectedTarget
									)}
									inputValue={sourceAmount}
									selectValue={selectedSource}
									onSelect={onSelectSource}
									onInputChange={onChangeSourceAmount}
									forwardError={() => {}}
									autoFocus={isMobile ? false : autoFocus}
									decimal={
										coins[selectedSource]?.increment_unit || PAIR2_STATIC_SIZE
									}
									availableBalance={selectedSourceBalance}
									pair={isUseBroker ? symbol : key ? key : ''}
									coins={coins}
									selectedBalance={selectedBalance}
									loading={loadingSource}
									disabled={loadingSource}
									setIsOpenTopField={setIsOpenTopField}
								/>
							</div>
							<div className="d-flex swap-wrapper-wrapper">
								<div className="swap-wrapper">
									<div className="swap-container">
										<div
											className="pointer blue-link"
											onClick={() => onSwap(selectedSource, selectedTarget)}
										>
											<SwapOutlined className="px-2" rotate={90} />
											<EditWrapper stringId={'SWAP'}>
												{STRINGS['SWAP']}
											</EditWrapper>
										</div>
									</div>
								</div>
							</div>
							<div
								className={
									isOpenBottomField
										? 'active-border quick-trade-input'
										: 'quick-trade-input'
								}
							>
								<div className="d-flex justify-content-between mb-3">
									<div className="bold caps-first">
										<EditWrapper stringId={'TO'}>{STRINGS['TO']}</EditWrapper>
									</div>
									<Balance
										text={coins[selectedTarget]?.display_name}
										balance={selectedTargetBalance}
										onClick={targetTotalBalance}
										className="balance-wallet"
									/>
								</div>
								<InputGroup
									options={targetOptions.filter(
										(coin) => coin !== selectedSource
									)}
									inputValue={targetAmount}
									selectValue={selectedTarget}
									onSelect={onSelectTarget}
									onInputChange={onChangeTargetAmount}
									forwardError={() => {}}
									decimal={
										coins[selectedTarget]?.increment_unit || PAIR2_STATIC_SIZE
									}
									pair={isUseBroker ? symbol : key ? key : ''}
									coins={coins}
									loading={loadingTarget}
									disabled={loadingTarget}
									setIsOpenBottomField={setIsOpenBottomField}
								/>
							</div>

							{error?.length ? (
								<FieldError
									error={translateError(error)}
									displayError={true}
									className="input-group__error-wrapper"
								/>
							) : isExpired ? (
								<>
									<FieldError
										error={STRINGS['QUICK_TRADE_QUOTE_EXPIRED']}
										displayError={true}
										className="input-group__error-wrapper"
									/>
								</>
							) : null}
							{hasExpiredOnce && (
								<QuoteExpiredBlock
									onRequoteClick={onRequoteClick}
									isExpired={isExpired}
								/>
							)}
							<div
								className={classnames(
									'quick_trade-section_wrapper',
									'd-flex',
									'flex-column',
									'align-items-end',
									'btn-wrapper',
									{
										'btn-margin-wrapper': !hasExpiredOnce,
									}
								)}
							>
								<EditWrapper stringId={'QUICK_TRADE_COMPONENT.BUTTON'} />
								<Button
									label={STRINGS['QUICK_TRADE_COMPONENT.BUTTON']}
									onClick={onReview}
									disabled={disabled}
									type="button"
									className={!isMobile ? 'w-50' : 'w-100'}
									iconId={'QUICK_TRADE_TAB_ACTIVE'}
									iconList={ICONS}
								/>
							</div>
							<Footer
								brokerUsed={isUseBroker}
								name={display_name}
								isNetwork={isNetwork}
								pair={pair}
							/>
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
							selectedSource={selectedSource}
							sourceDecimalPoint={
								coins[selectedSource]?.increment_unit || PAIR2_STATIC_SIZE
							}
							targetDecimalPoint={
								coins[selectedTarget]?.increment_unit || PAIR2_STATIC_SIZE
							}
							sourceAmount={sourceAmount}
							targetAmount={targetAmount}
							selectedTarget={selectedTarget}
							disabled={submitting}
							time={time}
							expiry={expiry}
							coins={coins}
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
	setIsQuickTrade: bindActionCreators(setIsQuickTrade, dispatch),
});

const mapStateToProps = (store) => {
	const {
		app: { pair, pairs },
	} = store;
	const sourceOptions = getSourceOptions(store.app.quicktrade);

	return {
		pair,
		quicktradePairs: quicktradePairSelector(store),
		sourceOptions,
		pairs,
		coins: store.app.coins,
		constants: store.app.constants,
		markets: MarketsSelector(store),
		user: store.user,
		chain_trade_config: store.app.constants.chain_trade_config,
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(withConfig(QuickTrade)));
