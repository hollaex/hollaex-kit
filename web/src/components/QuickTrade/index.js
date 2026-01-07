import React, { useRef, useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { withRouter, browserHistory } from 'react-router';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { SwapOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Input, Tooltip } from 'antd';
import moment from 'moment';
import classnames from 'classnames';
import math from 'mathjs';
import debounce from 'lodash.debounce';

import STRINGS from 'config/localizedStrings';
import InputGroup from './InputGroup';
import Details from 'containers/QuickTrade/components/Details';
import Header from 'containers/QuickTrade/components/Header';
import Footer from 'containers/QuickTrade/components/Footer';
import Balance from 'containers/QuickTrade/components/Balance';
import ActiveOTCLimitOrders from 'containers/QuickTrade/components/ActiveOTCLimitOrders';
import QuoteResult from 'containers/QuickTrade/QuoteResult';
import ReviewOrder from 'containers/QuickTrade/components/ReviewOrder';
import QuoteExpiredBlock from './QuoteExpiredBlock';
import withConfig from 'components/ConfigProvider/withConfig';
import {
	changePair,
	setIsActiveFavQuickTrade,
	setIsQuickTrade,
	setTransactionPair,
} from 'actions/appActions';
import { isLoggedIn } from 'utils/token';
import { Button, EditWrapper, Dialog, Image, Coin } from 'components';
import { getMiniCharts } from 'actions/chartAction';
import { getDecimals } from 'utils/utils';
import { MarketsSelector } from 'containers/Trade/utils';
import { flipPair } from 'containers/QuickTrade/components/utils';
import {
	getSourceOptions,
	quicktradePairSelector,
} from 'containers/QuickTrade/components/utils';
import {
	getQuickTrade,
	executeQuickTrade,
	createLimitOrder,
} from 'actions/quickTradeActions';
import { FieldError } from 'components/Form/FormFields/FieldWrapper';
import { translateError } from 'components/QuickTrade/utils';
import {
	countDecimals,
	formatPercentage,
	formatToCurrency,
	roundNumber,
	formatNumber,
} from 'utils/currency';
import { cancelOrder, cancelAllOrders } from 'actions/orderAction';
import { getOrders } from 'actions/walletActions';

export const PAIR2_STATIC_SIZE = 0.000001;
export const SPENDING = {
	SOURCE: 'SOURCE',
	TARGET: 'TARGET',
};
export const TYPES = {
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
	setIsQuickTrade,
	isActiveFavQuickTrade,
	setIsActiveFavQuickTrade,
	transactionPair,
	setTransactionPair,
	cancelOrder,
	cancelAllOrders,
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
	const initialPair = (transactionPair
		? transactionPair
		: queryPair || Object.keys(quicktradePairs)[0]
	).split('-');
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
	const [isHighSlippageDetected, setIsHighSlippageDetected] = useState(false);
	const [slippagePercentage, setSlippagePercentage] = useState(0);
	const [isSwap, setSwap] = useState(true);
	const [isSourceSelected, setIsSourceSelected] = useState(false);
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [customInvertedPrice, setCustomInvertedPrice] = useState(null);
	const [limitOrderPriceDisplay, setLimitOrderPriceDisplay] = useState('');
	const [isSelectTarget, setIsSelectTarget] = useState(false);
	const [showLimitOrderSuccess, setShowLimitOrderSuccess] = useState(false);
	const [limitOrderData, setLimitOrderData] = useState(null);
	const [orderHistory, setOrderHistory] = useState([]);
	const [isLoadingOrders, setIsLoadingOrders] = useState(false);

	const errorRef = useRef(null);
	const chartDataRef = useRef(null);
	const lineChartRef = useRef(null);
	const cancelingOrderRef = useRef(false);
	const selectTargetRef = useRef(null);
	const loadingTimeoutRef = useRef(null);
	const targetAmountRecalcTimeoutRef = useRef(null);
	const fetchOrdersDebounceRef = useRef(null);
	const isFetchingOrdersRef = useRef(false);
	const ordersContainerRef = useRef(null);

	const resetForm = () => {
		setTargetAmount();
		setSourceAmount();
		setSpending();
		setToken();
		setExpiry();
		setShowAdvanced(false);
		setCustomInvertedPrice(null);
		setLimitOrderPriceDisplay('');
	};

	const onCloseDialog = (autoHide) => {
		setIsReview(true);
		setData({});
		setShowModal(false);
		if (autoHide) {
			errorRef.current = setTimeout(() => setError(), 5000);
		} else {
			setError();
		}
	};

	const onCloseLimitOrderSuccess = () => {
		setShowLimitOrderSuccess(false);
		setLimitOrderData(null);
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
	const isQuickTradeLimitOrder = !!(
		quicktradePairs[symbol] || quicktradePairs[flippedPair]
	);

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

	const onChangeTargetAmount = (value) => {
		setSpending(SPENDING.TARGET);
		setTargetAmount(value);

		if (
			isQuickTradeLimitOrder &&
			customInvertedPrice !== null &&
			customInvertedPrice > 0 &&
			value &&
			selectedSource
		) {
			if (targetAmountRecalcTimeoutRef.current) {
				clearTimeout(targetAmountRecalcTimeoutRef.current);
			}

			targetAmountRecalcTimeoutRef.current = setTimeout(() => {
				const numValue = parseFloat(value);
				if (!isNaN(numValue) && numValue > 0) {
					if (loadingTimeoutRef.current) {
						clearTimeout(loadingTimeoutRef.current);
					}
					setLoading(true);
					const calculatedSource = numValue * customInvertedPrice;
					const decimalPoint = getDecimals(
						coins[selectedSource]?.increment_unit || PAIR2_STATIC_SIZE
					);
					const roundedSource = roundNumber(calculatedSource, decimalPoint);
					setSourceAmount(roundedSource);
					loadingTimeoutRef.current = setTimeout(() => {
						setLoading(false);
						loadingTimeoutRef.current = null;
					}, 100);
				}
				targetAmountRecalcTimeoutRef.current = null;
			}, 500);
		}
	};

	const onToggleAdvanced = () => {
		const currentShowAdvanced = showAdvanced;
		setShowAdvanced(!currentShowAdvanced);
		if (currentShowAdvanced) {
			setCustomInvertedPrice(null);
			setLimitOrderPriceDisplay('');

			if (
				isQuickTradeLimitOrder &&
				sourceAmount &&
				selectedTarget &&
				selectedSource
			) {
				const calculatedInvertedPrice = calculateInvertedPrice();

				if (calculatedInvertedPrice && calculatedInvertedPrice > 0) {
					if (loadingTimeoutRef.current) {
						clearTimeout(loadingTimeoutRef.current);
					}
					setLoading(true);
					const calculatedTarget = sourceAmount / calculatedInvertedPrice;
					const targetDecimalPoint = getDecimals(
						coins[selectedTarget]?.increment_unit || PAIR2_STATIC_SIZE
					);
					const roundedTarget = roundNumber(
						calculatedTarget,
						targetDecimalPoint
					);
					setTargetAmount(roundedTarget);
					loadingTimeoutRef.current = setTimeout(() => {
						setLoading(false);
						loadingTimeoutRef.current = null;
					}, 100);
				}
			}
		}
	};

	const convertDisplayPriceToInvertedPrice = (displayPrice) => {
		if (!isQuickTradeLimitOrder || !displayPrice) return displayPrice;

		const quickTradePairSymbol = getQuickTradePairInfo();
		if (!quickTradePairSymbol) return displayPrice;

		const [pairBase, pairQuote] = quickTradePairSymbol?.split('-') || [];
		const fromAsset = selectedSource?.toLowerCase();
		const toAsset = selectedTarget?.toLowerCase();
		const pairBaseLower = pairBase?.toLowerCase();
		const pairQuoteLower = pairQuote?.toLowerCase();

		if (fromAsset === pairBaseLower && toAsset === pairQuoteLower) {
			return 1 / displayPrice;
		}

		if (fromAsset === pairQuoteLower && toAsset === pairBaseLower) {
			return displayPrice;
		}

		return displayPrice;
	};

	const onChangeCustomPrice = (value) => {
		setLimitOrderPriceDisplay(value);
		const numValue = parseFloat(value);
		if (!isNaN(numValue) && numValue > 0) {
			const invertedPriceValue = convertDisplayPriceToInvertedPrice(numValue);
			setCustomInvertedPrice(invertedPriceValue);

			if (sourceAmount && invertedPriceValue && selectedTarget) {
				if (loadingTimeoutRef.current) {
					clearTimeout(loadingTimeoutRef.current);
				}
				setLoading(true);
				setSpending(SPENDING.SOURCE);
				const calculatedTarget = sourceAmount / invertedPriceValue;
				const decimalPoint = getDecimals(
					coins[selectedTarget]?.increment_unit || PAIR2_STATIC_SIZE
				);
				const roundedTarget = roundNumber(calculatedTarget, decimalPoint);
				setTargetAmount(roundedTarget);
				loadingTimeoutRef.current = setTimeout(() => {
					setLoading(false);
					loadingTimeoutRef.current = null;
				}, 100);
			}
		} else if (value === '' || value === null || value === undefined) {
			setCustomInvertedPrice(null);
		}
	};

	const onSelectSource = (value) => {
		setSpending();
		setSourceAmount();
		setTargetAmount();
		setSelectedSource(value);
		setIsActiveFavQuickTrade(false);
		setIsSourceSelected(true);
		setToken();
		setExpiry();
		setShowAdvanced(false);
		setCustomInvertedPrice(null);
		setLimitOrderPriceDisplay('');
	};

	const onSelectTarget = (value) => {
		setSpending();
		setSourceAmount();
		setTargetAmount();
		setIsActiveFavQuickTrade(false);
		setSelectedTarget(value);
		setIsSelectTarget(true);
		setToken();
		setExpiry();
		setShowAdvanced(false);
		setCustomInvertedPrice(null);
		setLimitOrderPriceDisplay('');
	};

	const goTo = (path) => {
		router.push(path);
	};

	const isActiveSlippage = slippagePercentage > 5;

	const isLimitOrderWithPrice =
		isQuickTradeLimitOrder &&
		customInvertedPrice !== null &&
		customInvertedPrice !== undefined;

	const onReview = () => {
		if (preview) {
			if (isLoggedIn()) {
				goTo(`/quick-trade/${pair}`);
			} else {
				goTo('/login');
			}
		} else {
			if (!isLimitOrderWithPrice && isActiveSlippage) {
				setIsHighSlippageDetected(true);
			} else {
				setIsReview(true);
				setShowModal(true);
			}
		}
	};

	const onExecuteTrade = async (token) => {
		setSubmitting(true);
		setIsReview(false);

		try {
			if (shouldPlaceLimitOrder()) {
				const quickTradePairInfo =
					quicktradePairs[symbol] || quicktradePairs[flipPair(symbol)];
				const quickTradePair = quickTradePairInfo?.symbol || symbol;
				const [pairBase, pairQuote] = quickTradePair?.split('-') || [];
				const fromAsset = selectedSource?.toLowerCase();
				const toAsset = selectedTarget?.toLowerCase();
				const isSameDirection =
					fromAsset === pairBase?.toLowerCase() &&
					toAsset === pairQuote?.toLowerCase();
				const direction = quicktradePairs[symbol] ? 'sell' : 'buy';

				const rawOrderPrice = customInvertedPrice
					? isSameDirection
						? 1 / customInvertedPrice
						: customInvertedPrice
					: null;

				const pairData = pairs[quickTradePair] || {};
				const incrementPrice =
					pairData?.increment_price ||
					(pairQuote ? coins[pairQuote]?.increment_unit : null) ||
					PAIR2_STATIC_SIZE;
				const incrementSize =
					pairData?.increment_size ||
					(pairBase ? coins[pairBase]?.increment_unit : null) ||
					PAIR2_STATIC_SIZE;

				const priceDecimalPoint = getDecimals(incrementPrice);
				const sizeDecimalPoint = getDecimals(incrementSize);

				let orderPrice = null;
				if (rawOrderPrice) {
					if (incrementPrice > 0) {
						let roundedPrice = formatNumber(rawOrderPrice, priceDecimalPoint);
						roundedPrice = math.multiply(
							math.floor(math.divide(roundedPrice, incrementPrice)),
							incrementPrice
						);
						orderPrice = formatNumber(roundedPrice, priceDecimalPoint);
					} else {
						orderPrice = formatNumber(rawOrderPrice, priceDecimalPoint);
					}
				}

				const rawOrderSize =
					fromAsset === pairBase?.toLowerCase() ? sourceAmount : targetAmount;
				let orderSize = null;
				if (rawOrderSize) {
					if (incrementSize > 0) {
						let roundedSize = formatNumber(rawOrderSize, sizeDecimalPoint);
						roundedSize = math.multiply(
							math.floor(math.divide(roundedSize, incrementSize)),
							incrementSize
						);
						orderSize = formatNumber(roundedSize, sizeDecimalPoint);
					} else {
						orderSize = formatNumber(rawOrderSize, sizeDecimalPoint);
					}
				}

				const pairType = quickTradePairInfo?.type;
				const orderData = {
					side: direction,
					symbol: quickTradePair?.toLowerCase(),
					price: orderPrice,
					size: orderSize,
					type: 'limit',
					...(pairType === TYPES.NETWORK || pairType === TYPES.BROKER
						? {
								meta: {
									broker: 'otc',
								},
						  }
						: {}),
				};

				const { data } = await createLimitOrder(orderData);
				setData(data);
				const conversionDisplay = getConversionPriceForDisplay();
				const getDisplayPriceForSuccess = () => {
					if (
						limitOrderPriceDisplay &&
						parseFloat(limitOrderPriceDisplay) > 0
					) {
						const userPrice = parseFloat(limitOrderPriceDisplay);
						if (conversionDisplay?.base && conversionDisplay?.quote) {
							return {
								base: conversionDisplay.base,
								quote: conversionDisplay.quote,
								price: userPrice,
							};
						}
					}
					return conversionDisplay;
				};
				setLimitOrderData({
					sourceAmount,
					targetAmount,
					selectedSource,
					selectedTarget,
					invertedPrice,
					conversionPriceDisplay: getDisplayPriceForSuccess(),
				});
				setShowModal(false);
				setShowLimitOrderSuccess(true);
				resetForm();
				if (fetchOrdersDebounceRef.current) {
					clearTimeout(fetchOrdersDebounceRef.current);
				}
				fetchOrdersDebounceRef.current = setTimeout(() => {
					fetchOrders();
					fetchOrdersDebounceRef.current = null;
				}, 500);
			} else {
				const { data } = await executeQuickTrade(token);
				setData(data);
				resetForm();
			}
		} catch (error) {
			handleError(error);
		} finally {
			setSubmitting(false);
		}
	};

	const sourceTotalBalance = (value) => {
		const decimalPoint = getDecimals(
			coins[selectedSource]?.increment_unit || PAIR2_STATIC_SIZE
		);
		const decimalPointValue = Math.pow(10, decimalPoint);
		const decimalValue =
			math.floor(value * decimalPointValue) / decimalPointValue;
		if (value) {
			setSpending(SPENDING.SOURCE);
			setSourceAmount(decimalValue);
			setSelectedBalance(value);

			if (
				isQuickTradeLimitOrder &&
				customInvertedPrice !== null &&
				customInvertedPrice > 0 &&
				selectedTarget
			) {
				if (loadingTimeoutRef.current) {
					clearTimeout(loadingTimeoutRef.current);
				}
				setLoading(true);
				const calculatedTarget = decimalValue / customInvertedPrice;
				const targetDecimalPoint = getDecimals(
					coins[selectedTarget]?.increment_unit || PAIR2_STATIC_SIZE
				);
				const roundedTarget = roundNumber(calculatedTarget, targetDecimalPoint);
				setTargetAmount(roundedTarget);
				loadingTimeoutRef.current = setTimeout(() => {
					setLoading(false);
					loadingTimeoutRef.current = null;
				}, 100);
			}
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
		chartDataRef.current = setTimeout(() => {
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

	const getPricingData = (price = []) => {
		const firstPrice = price[0];
		const lastPrice = price[price?.length - 1];
		const priceDifference = lastPrice - firstPrice;
		const priceDifferencePercent = formatPercentage(
			(priceDifference / firstPrice) * 100
		);
		const minVal = Math.min(...price);
		const high = Math.max(...price);

		const formattedNumber = (val) =>
			formatToCurrency(val, 0, val < 1 && countDecimals(val) > 8);

		return {
			priceDifference,
			priceDifferencePercent,
			low: formattedNumber(minVal),
			high: formattedNumber(high),
			lastPrice: formattedNumber(lastPrice),
		};
	};

	const calculateSlippage = () => {
		const { price = [] } = chartData[symbol] || chartData[flippedPair] || {};
		const pricingData = getPricingData(price);
		const lastPrice = parseFloat(pricingData?.lastPrice?.replace(/,/g, ''));

		const sourcePrice = parseFloat(sourceAmount);
		const targetPrice = parseFloat(targetAmount);
		if (!sourcePrice || !targetPrice || isNaN(lastPrice) || lastPrice === 0) {
			setSlippagePercentage(0);
			return;
		}

		const isSourceFiat = coins[selectedSource]?.type === 'fiat';
		const isTargetCrypto = coins[selectedTarget]?.type === 'blockchain';
		const executedPrice =
			!isSourceFiat && !isTargetCrypto
				? targetPrice / sourcePrice
				: sourcePrice / targetPrice;

		const slippage = ((executedPrice - lastPrice) / lastPrice) * 100;
		setSlippagePercentage(slippage);
	};

	const normalizePair = (pairSymbol) => {
		if (!pairSymbol || !quicktradePairs) return pairSymbol;
		const quickTradePairInfo =
			quicktradePairs[pairSymbol] || quicktradePairs[flipPair(pairSymbol)];
		return quickTradePairInfo?.symbol || pairSymbol;
	};

	const getOrdersCountForSymbol = () => {
		if (!selectedSource || !selectedTarget || !orderHistory?.length) return 0;
		const currentSymbol = `${selectedSource?.toLowerCase()}-${selectedTarget?.toLowerCase()}`;
		const flippedSymbol = `${selectedTarget?.toLowerCase()}-${selectedSource?.toLowerCase()}`;
		return orderHistory.filter(
			(order) =>
				order?.symbol?.toLowerCase() === currentSymbol ||
				order?.symbol?.toLowerCase() === flippedSymbol
		).length;
	};

	const handleScrollToOrders = () => {
		if (ordersContainerRef.current) {
			ordersContainerRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}
	};

	const renderOrdersCountLink = () => {
		const ordersCount = getOrdersCountForSymbol();
		if (!ordersCount || ordersCount === 0) {
			return null;
		}
		return (
			<>
				<span className="secondary-text px-2">•</span>
				<EditWrapper stringId={'QUICK_TRADE_COMPONENT.ORDERS_COUNT'}>
					<span
						className="pointer blue-link underline-text"
						onClick={handleScrollToOrders}
					>
						{STRINGS.formatString(
							STRINGS['QUICK_TRADE_COMPONENT.ORDERS_COUNT'],
							ordersCount
						)}
					</span>
				</EditWrapper>
			</>
		);
	};

	const fetchOrders = async () => {
		if (preview || cancelingOrderRef.current || isFetchingOrdersRef.current) {
			return;
		}

		if (fetchOrdersDebounceRef.current) {
			clearTimeout(fetchOrdersDebounceRef.current);
		}

		fetchOrdersDebounceRef.current = setTimeout(async () => {
			isFetchingOrdersRef.current = true;
			setIsLoadingOrders(true);
			try {
				const params = { open: true };
				const response = await getOrders(params);
				const ordersData = response?.data?.data || response?.data || [];
				const ordersArray = Array.isArray(ordersData) ? ordersData : [];
				setOrderHistory(ordersArray);
				isFetchingOrdersRef.current = false;
				setIsLoadingOrders(false);
			} catch (error) {
				console.error(`Error fetching orders:`, error);
				setOrderHistory([]);
				isFetchingOrdersRef.current = false;
				setIsLoadingOrders(false);
			}
			fetchOrdersDebounceRef.current = null;
		}, 300);
	};

	const handleCancelOrder = (orderId) => {
		cancelingOrderRef.current = true;

		setOrderHistory((prevOrders) =>
			prevOrders.filter((order) => order?.id !== orderId)
		);

		setTimeout(() => {
			cancelOrder(orderId, {});
			setTimeout(() => {
				cancelingOrderRef.current = false;
				fetchOrders();
			}, 1000);
		}, 100);
	};

	const handleCancelAllOrders = (symbol) => {
		cancelingOrderRef.current = true;
		cancelAllOrders(symbol);
		setTimeout(() => {
			cancelingOrderRef.current = false;
			fetchOrders();
		}, 1000);
	};

	useEffect(() => {
		if (!isLimitOrderWithPrice) {
			calculateSlippage();
		}
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		sourceAmount,
		targetAmount,
		symbol,
		flippedPair,
		chartData,
		selectedSource,
		selectedTarget,
		expiry,
		customInvertedPrice,
	]);

	useEffect(() => {
		if (mounted) {
			const options = getTargetOptions(selectedSource);
			const selectedOption =
				selectedSource !== sourceOptions[0]
					? sourceOptions[0]
					: sourceOptions[1];
			if (chain_trade_config?.active) {
				if (isSwap) {
					if (isActiveFavQuickTrade) {
						setSelectedSource(initialSelectedSource);
						setSelectedTarget(initialSelectedTarget);
						resetForm();
					} else if (isSourceSelected) {
						setSelectedTarget(selectedOption);
						setIsSourceSelected(false);
					}
				} else {
					setSwap(true);
				}
			} else {
				setTargetOptions(options);
				if (isSwap && isActiveFavQuickTrade) {
					setSelectedSource(initialSelectedSource);
					setSelectedTarget(initialSelectedTarget);
					resetForm();
				} else if (isSwap && (!isSelectTarget || isSourceSelected)) {
					setSelectedTarget(options[0]);
				}
				setIsSelectTarget(false);
				setIsSourceSelected(false);
				setSwap(true);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSource, pair]);

	useEffect(() => {
		if (selectedSource === selectedTarget) return;
		const symbol = `${selectedSource}-${selectedTarget}`;
		const flippedSymbol = flipPair(symbol);

		let currentSymbol = null;
		if (quicktradePairs[symbol] || chain_trade_config?.active) {
			currentSymbol = symbol;
		} else if (quicktradePairs[flippedSymbol]) {
			currentSymbol = flippedSymbol;
		}

		if (currentSymbol) {
			setSymbol(currentSymbol);
			goToPair(currentSymbol);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSource, selectedTarget, quicktradePairs]);

	useEffect(() => {
		if (isQuickTradeLimitOrder && customInvertedPrice !== null) {
			return;
		}
		debouncedQuote.current({
			sourceAmount,
			targetAmount,
			selectedSource,
			selectedTarget,
			spending,
		});
	}, [
		sourceAmount,
		targetAmount,
		selectedSource,
		selectedTarget,
		spending,
		isQuickTradeLimitOrder,
		customInvertedPrice,
	]);

	useEffect(() => {
		const clearDebouncedQuote = debouncedQuote?.current;
		setMounted(true);
		if (window.location.pathname.includes(`/quick-trade`)) {
			setIsQuickTrade(true);
		}
		return () => {
			setIsQuickTrade(false);
			setTransactionPair(null);
			const refs = [errorRef, chartDataRef, lineChartRef, selectTargetRef];
			refs.forEach((ref) => {
				if (ref?.current) {
					clearInterval(ref?.current);
				}
			});
			if (loadingTimeoutRef?.current) {
				clearTimeout(loadingTimeoutRef.current);
			}
			if (targetAmountRecalcTimeoutRef?.current) {
				clearTimeout(targetAmountRecalcTimeoutRef.current);
			}
			if (fetchOrdersDebounceRef?.current) {
				clearTimeout(fetchOrdersDebounceRef.current);
			}
			clearDebouncedQuote && clearDebouncedQuote.cancel();
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
		lineChartRef.current = setTimeout(() => {
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

	useEffect(() => {
		fetchOrders();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const isExpired = !isLimitOrderWithPrice && time.isAfter(moment(expiry));

	const { balance: userBalance } = user;

	const selectedSourceBalance =
		selectedSource && userBalance[`${selectedSource.toLowerCase()}_available`];
	const selectedTargetBalance =
		selectedTarget && userBalance[`${selectedTarget.toLowerCase()}_available`];

	const disabled =
		!isLoggedIn() ||
		(!isLimitOrderWithPrice && !token) ||
		loading ||
		submitting ||
		isExpired ||
		!sourceAmount ||
		!targetAmount;
	const pairData = pairs[symbol] || {};
	const [loadingSource, loadingTarget] =
		spending && spending === SPENDING.SOURCE
			? [false, loading]
			: [loading, false];

	const onCloseHighSlippage = () => {
		setIsHighSlippageDetected(false);
	};

	const onSourceAmountChange = (value) => {
		setSpending(SPENDING.SOURCE);
		setSourceAmount(value);

		if (
			isQuickTradeLimitOrder &&
			customInvertedPrice !== null &&
			customInvertedPrice > 0 &&
			selectedTarget
		) {
			if (loadingTimeoutRef.current) {
				clearTimeout(loadingTimeoutRef.current);
			}
			if (value) {
				const numValue = parseFloat(value);
				if (!isNaN(numValue) && numValue > 0) {
					setLoading(true);
					loadingTimeoutRef.current = setTimeout(() => {
						const calculatedTarget = numValue / customInvertedPrice;
						const decimalPoint = getDecimals(
							coins[selectedTarget]?.increment_unit || PAIR2_STATIC_SIZE
						);
						const roundedTarget = roundNumber(calculatedTarget, decimalPoint);
						setTargetAmount(roundedTarget);
						setLoading(false);
						loadingTimeoutRef.current = null;
					}, 100);
				} else {
					setTargetAmount('');
				}
			} else {
				setTargetAmount('');
			}
		}
	};

	const onCustomPriceChange = (e) => {
		onChangeCustomPrice(e.target.value);
	};

	const onSwapClick = () => {
		onSwap(selectedSource, selectedTarget);
	};

	const onSwap = (selectedSource, selectedTarget) => {
		onSelectSource(selectedTarget);
		// ToDo: to remove that jump issue from the swap, the use Effect logic shuold be integrated to the select function
		selectTargetRef.current = setTimeout(
			() => onSelectTarget(selectedSource),
			0.1
		);
		setSwap(false);
		setIsSourceSelected(false);
		resetForm();
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

	const onHandleReview = () => {
		setIsHighSlippageDetected(false);
		setIsReview(true);
		setShowModal(true);
	};

	const activeProTradePair =
		Object.keys(pairs).filter(
			(data) => data === pair || data === flipPair(pair)
		) || [];

	const getOrderbookPrice = () => {
		if (!isQuickTradeLimitOrder) {
			if (!selectedSource || !selectedTarget) return null;

			const chartDataKey = activeQuickTradePair ? activeQuickTradePair : pair;
			const chartPriceData =
				lineChartData?.price || chartData[chartDataKey]?.price;

			if (chartPriceData && chartPriceData.length > 0) {
				const lastPrice = chartPriceData[chartPriceData?.length - 1];
				const [chartBase, chartQuote] = chartDataKey?.split('-');

				if (chartBase === selectedSource && chartQuote === selectedTarget) {
					return lastPrice;
				} else if (
					chartBase === selectedTarget &&
					chartQuote === selectedSource
				) {
					return 1 / lastPrice;
				}
			}

			const expectedSymbol = `${selectedSource}-${selectedTarget}`;
			const expectedFlippedSymbol = `${selectedTarget}-${selectedSource}`;

			if (
				chartData[expectedSymbol]?.price &&
				chartData[expectedSymbol]?.price?.length > 0
			) {
				return chartData[expectedSymbol]?.price[
					chartData[expectedSymbol]?.price?.length - 1
				];
			}
			if (
				chartData[expectedFlippedSymbol]?.price &&
				chartData[expectedFlippedSymbol]?.price?.length > 0
			) {
				return (
					1 /
					chartData[expectedFlippedSymbol]?.price[
						chartData[expectedFlippedSymbol]?.price?.length - 1
					]
				);
			}

			return null;
		}

		const quickTradePairSymbol = getQuickTradePairInfo();
		if (!quickTradePairSymbol) return null;

		const chartDataKey = activeQuickTradePair || quickTradePairSymbol;
		const chartPriceData =
			lineChartData?.price || chartData[chartDataKey]?.price;

		if (chartPriceData && chartPriceData?.length > 0) {
			return chartPriceData[chartPriceData?.length - 1];
		}

		if (
			chartData[quickTradePairSymbol]?.price &&
			chartData[quickTradePairSymbol]?.price?.length > 0
		) {
			return chartData[quickTradePairSymbol]?.price[
				chartData[quickTradePairSymbol]?.price?.length - 1
			];
		}

		return null;
	};

	const shouldPlaceLimitOrder = () => {
		if (!isQuickTradeLimitOrder) return false;

		const currentCalculatedInvertedPrice = calculateInvertedPrice();
		const isCustomPriceSet =
			customInvertedPrice !== null && customInvertedPrice !== undefined;
		const priceDiffers =
			isCustomPriceSet && currentCalculatedInvertedPrice !== null
				? customInvertedPrice !== currentCalculatedInvertedPrice
				: false;

		return (
			isCustomPriceSet &&
			priceDiffers &&
			currentCalculatedInvertedPrice &&
			sourceAmount
		);
	};

	const getQuickTradePairInfo = () => {
		if (!isQuickTradeLimitOrder) {
			return null;
		}
		const quickTradePairInfo =
			quicktradePairs[symbol] || quicktradePairs[flipPair(symbol)];
		return quickTradePairInfo?.symbol || null;
	};

	const getDisplayPrice = (actualOrderbookPrice, base, quote) => {
		if (!actualOrderbookPrice || !base || !quote) return null;
		return {
			base,
			quote,
			price: actualOrderbookPrice,
		};
	};

	const getConversionPriceForDisplay = () => {
		if (!isQuickTradeLimitOrder) {
			return {
				base: selectedTarget,
				quote: selectedSource,
				price: invertedPrice,
			};
		}

		const quickTradePairSymbol = getQuickTradePairInfo();
		if (!quickTradePairSymbol) {
			return {
				base: selectedTarget,
				quote: selectedSource,
				price: invertedPrice,
			};
		}

		const [pairBase, pairQuote] = quickTradePairSymbol?.split('-') || [];
		const orderbookPrice = getOrderbookPrice();

		if (orderbookPrice) {
			return getDisplayPrice(orderbookPrice, pairBase, pairQuote);
		}

		return {
			base: pairBase,
			quote: pairQuote,
			price: invertedPrice || 0,
		};
	};

	const calculateInvertedPrice = () => {
		if (!isQuickTradeLimitOrder) {
			const marketLastPrice = getOrderbookPrice();
			return marketLastPrice ? 1 / marketLastPrice : null;
		}

		const orderbookPrice = getOrderbookPrice();
		if (!orderbookPrice) return null;

		const quickTradePairSymbol = getQuickTradePairInfo();
		if (!quickTradePairSymbol) return null;

		const [pairBase, pairQuote] = quickTradePairSymbol?.split('-') || [];
		const fromAsset = selectedSource?.toLowerCase();
		const toAsset = selectedTarget?.toLowerCase();
		const pairBaseLower = pairBase?.toLowerCase();
		const pairQuoteLower = pairQuote?.toLowerCase();

		if (fromAsset === pairBaseLower && toAsset === pairQuoteLower) {
			return 1 / orderbookPrice;
		}

		if (fromAsset === pairQuoteLower && toAsset === pairBaseLower) {
			return orderbookPrice;
		}

		return null;
	};

	const marketLastPrice = getOrderbookPrice();
	const calculatedInvertedPrice = calculateInvertedPrice();
	const invertedPrice =
		customInvertedPrice !== null
			? customInvertedPrice
			: calculatedInvertedPrice;

	const conversionPriceDisplay = getConversionPriceForDisplay();

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
					{!isLimitOrderWithPrice && (
						<Dialog
							isOpen={isHighSlippageDetected}
							label="high-slippage-popup"
							className="high-slippage-popup-wrapper"
							onCloseDialog={onCloseHighSlippage}
						>
							<div className="high-slippage-popup-container">
								<div className="high-slippage-popup-title mt-2">
									<Image
										icon={ICONS['HIGH_SLIPPAGE_WARNING']}
										wrapperClassName="high-slippage-warning-icon"
									/>
									<div className="mt-3 mb-2">
										<EditWrapper stringId="QUICK_TRADE_COMPONENT.HIGH_SLIPPAGE_DETECTED">
											<span className="title-text">
												{
													STRINGS[
														'QUICK_TRADE_COMPONENT.HIGH_SLIPPAGE_DETECTED'
													]
												}
											</span>
										</EditWrapper>
									</div>
								</div>
								<div className="high-slippage-popup-content">
									<EditWrapper stringId="QUICK_TRADE_COMPONENT.HIGH_SLIPPAGE_DESC_1">
										<span className="font-weight-bold">
											{STRINGS['QUICK_TRADE_COMPONENT.HIGH_SLIPPAGE_DESC_1']}
										</span>
									</EditWrapper>
									<EditWrapper stringId="QUICK_TRADE_COMPONENT.HIGH_SLIPPAGE_DESC_2">
										{STRINGS['QUICK_TRADE_COMPONENT.HIGH_SLIPPAGE_DESC_2']}
									</EditWrapper>
									<EditWrapper stringId="QUICK_TRADE_COMPONENT.CONTINUE_TEXT">
										{STRINGS['QUICK_TRADE_COMPONENT.CONTINUE_TEXT']}
									</EditWrapper>
								</div>
								<div className="button-container">
									<Button
										label={STRINGS['CLOSE_TEXT']}
										onClick={onCloseHighSlippage}
										type="button"
										className="w-100"
									/>
									<Button
										label={STRINGS['QUICK_TRADE_COMPONENT.REVIEW_ORDER']}
										onClick={onHandleReview}
										type="button"
										className="w-100"
									/>
								</div>
							</div>
						</Dialog>
					)}
					{isQuickTradeLimitOrder && (
						<Dialog
							isOpen={showLimitOrderSuccess}
							label="limit-order-success-popup"
							className="limit-order-success-popup-wrapper"
							onCloseDialog={onCloseLimitOrderSuccess}
						>
							<div className="limit-order-success-popup-container">
								<div className="limit-order-success-popup-title mt-2">
									<Image
										icon={ICONS['GREEN_CHECK']}
										wrapperClassName="limit-order-success-icon"
									/>
									<EditWrapper stringId="QUICK_TRADE_COMPONENT.LIMIT_ORDER_SUCCESS_TITLE">
										<span className="title-text">
											{
												STRINGS[
													'QUICK_TRADE_COMPONENT.LIMIT_ORDER_SUCCESS_TITLE'
												]
											}
										</span>
									</EditWrapper>
								</div>
								<div className="limit-order-success-popup-content">
									<div className="limit-order-success-order-details pb-2">
										<EditWrapper stringId="QUICK_TRADE_COMPONENT.ORDER_DETAILS">
											<span className="order-details-label">
												{STRINGS['QUICK_TRADE_COMPONENT.ORDER_DETAILS']}
											</span>
										</EditWrapper>
										{limitOrderData && (
											<div className="order-details-text">
												{coins[limitOrderData.selectedSource]?.icon_id && (
													<span className="mr-2 limit-order-asset-icon">
														<Coin
															iconId={
																coins[limitOrderData?.selectedSource]?.icon_id
															}
															type="CS6"
														/>
													</span>
												)}
												<EditWrapper stringId="QUICK_TRADE_COMPONENT.CONVERT_ORDER_DETAILS">
													{STRINGS.formatString(
														STRINGS[
															'QUICK_TRADE_COMPONENT.CONVERT_ORDER_DETAILS'
														],
														formatToCurrency(
															limitOrderData?.sourceAmount,
															coins[limitOrderData?.selectedSource]
																?.increment_unit || PAIR2_STATIC_SIZE,
															limitOrderData?.sourceAmount < 1 &&
																countDecimals(limitOrderData?.sourceAmount) > 8
														),
														limitOrderData?.selectedSource?.toUpperCase(),
														formatToCurrency(
															limitOrderData?.targetAmount,
															coins[limitOrderData?.selectedTarget]
																?.increment_unit || PAIR2_STATIC_SIZE,
															limitOrderData?.targetAmount < 1 &&
																countDecimals(limitOrderData?.targetAmount) > 8
														),
														limitOrderData?.selectedTarget?.toUpperCase()
													)}
												</EditWrapper>
												{coins[limitOrderData?.selectedTarget]?.icon_id && (
													<span className="ml-2 limit-order-asset-icon">
														<Coin
															iconId={
																coins[limitOrderData?.selectedTarget]?.icon_id
															}
															type="CS6"
														/>
													</span>
												)}
											</div>
										)}
										{limitOrderData && limitOrderData?.conversionPriceDisplay && (
											<div className="conversion-price-text">
												<EditWrapper stringId="QUICK_TRADE_COMPONENT.CONVERSION_PRICE">
													({STRINGS['QUICK_TRADE_COMPONENT.CONVERSION_PRICE']}{' '}
													<span className="important-text">
														{STRINGS.formatString(
															STRINGS[
																'QUICK_TRADE_COMPONENT.CONVERSION_ASSET_PRICE'
															],
															limitOrderData?.conversionPriceDisplay?.base?.toUpperCase(),
															formatToCurrency(
																limitOrderData?.conversionPriceDisplay?.price,
																0,
																limitOrderData?.conversionPriceDisplay?.price <
																	1 &&
																	countDecimals(
																		limitOrderData?.conversionPriceDisplay
																			?.price
																	) > 8
															),
															limitOrderData?.conversionPriceDisplay?.quote?.toUpperCase()
														)}
													</span>
													)
												</EditWrapper>
											</div>
										)}
									</div>
									<div className="limit-order-success-note">
										<EditWrapper stringId="QUICK_TRADE_COMPONENT.LIMIT_ORDER_NOTE">
											{STRINGS['QUICK_TRADE_COMPONENT.LIMIT_ORDER_NOTE']}
										</EditWrapper>
									</div>
									{limitOrderData && (
										<div className="limit-order-success-balance-reminder">
											<EditWrapper stringId="QUICK_TRADE_COMPONENT.LIMIT_ORDER_BALANCE_REMINDER">
												{STRINGS.formatString(
													STRINGS[
														'QUICK_TRADE_COMPONENT.LIMIT_ORDER_BALANCE_REMINDER'
													],
													<span className="bold important-text">
														{formatToCurrency(
															limitOrderData.sourceAmount,
															coins[limitOrderData?.selectedSource]
																?.increment_unit || PAIR2_STATIC_SIZE,
															limitOrderData.sourceAmount < 1 &&
																countDecimals(limitOrderData.sourceAmount) > 8
														)}
													</span>,
													<span className="bold important-text">
														{limitOrderData?.selectedSource?.toUpperCase()}
													</span>
												)}
											</EditWrapper>
										</div>
									)}
								</div>
								<div className="button-container">
									<Button
										label={STRINGS['USER_VERIFICATION.OKAY']}
										onClick={onCloseLimitOrderSuccess}
										type="button"
										className="w-100"
									/>
								</div>
							</div>
						</Dialog>
					)}

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
										incrementUnit={
											coins[selectedSource]?.increment_unit || PAIR2_STATIC_SIZE
										}
									/>
								</div>
								<InputGroup
									options={sourceOptions.filter(
										(coin) => coin !== selectedTarget
									)}
									inputValue={sourceAmount}
									selectValue={selectedSource}
									onSelect={onSelectSource}
									onInputChange={onSourceAmountChange}
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
										<div className="pointer blue-link" onClick={onSwapClick}>
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
										incrementUnit={
											coins[selectedTarget]?.increment_unit || PAIR2_STATIC_SIZE
										}
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

								{isQuickTradeLimitOrder && (
									<div className="quick_trade-last-price d-flex flex-column align-items-start secondary-text mt-2">
										{!showAdvanced ? (
											<div className="d-flex align-items-center w-100 justify-content-between">
												<div className="d-flex align-items-center gap-2">
													<div
														className="pointer blue-link"
														onClick={onToggleAdvanced}
													>
														<EditWrapper stringId={'ORDER_ENTRY_SHOW_ADVANCE'}>
															<span className="underline-text">
																{STRINGS['ORDER_ENTRY_SHOW_ADVANCE']}
															</span>
														</EditWrapper>
													</div>
													{renderOrdersCountLink()}
												</div>
												<EditWrapper
													stringId={
														'QUICK_TRADE_COMPONENT.CONVERSION_ASSET_PRICE'
													}
												>
													{STRINGS.formatString(
														STRINGS[
															'QUICK_TRADE_COMPONENT.CONVERSION_ASSET_PRICE'
														],
														conversionPriceDisplay?.base?.toUpperCase(),
														formatToCurrency(
															conversionPriceDisplay?.price,
															0,
															conversionPriceDisplay?.price < 1 &&
																countDecimals(conversionPriceDisplay?.price) > 8
														),
														conversionPriceDisplay?.quote?.toUpperCase()
													)}
												</EditWrapper>
											</div>
										) : (
											<>
												<div className="d-flex align-items-center w-100 justify-content-between mb-2">
													<div className="d-flex align-items-center gap-2">
														<div
															className="pointer blue-link"
															onClick={onToggleAdvanced}
														>
															<EditWrapper
																stringId={'ORDER_ENTRY_HIDE_ADVANCE'}
															>
																<span className="underline-text">
																	{STRINGS['ORDER_ENTRY_HIDE_ADVANCE']}
																</span>
															</EditWrapper>
														</div>
														{renderOrdersCountLink()}
													</div>
												</div>
												<div className="w-100 mt-2">
													<div className="mb-2 d-flex align-items-start">
														{coins[selectedTarget]?.icon_id && (
															<span className="mr-1 limit-order-asset-icon">
																<Coin
																	iconId={coins[selectedTarget]?.icon_id}
																	type="CS6"
																/>
															</span>
														)}
														<EditWrapper
															stringId={'QUICK_TRADE_COMPONENT.MARKET_RATE'}
														>
															<span className="mr-1">
																{STRINGS['QUICK_TRADE_COMPONENT.MARKET_RATE']}
															</span>
															<Tooltip
																title={
																	STRINGS['QUICK_TRADE_COMPONENT.PRICE_TOOLTIP']
																}
															>
																<InfoCircleOutlined className="secondary-text" />
															</Tooltip>
														</EditWrapper>
													</div>
													<div className="d-flex align-items-center justify-content-end mb-2">
														<span className="mr-2 conversion-asset-text">
															{conversionPriceDisplay?.base &&
															conversionPriceDisplay?.quote
																? STRINGS.formatString(
																		STRINGS[
																			'QUICK_TRADE_COMPONENT.PRICE_PER_FORMAT'
																		],
																		conversionPriceDisplay.base.toUpperCase(),
																		conversionPriceDisplay.quote.toUpperCase()
																  )
																: STRINGS.formatString(
																		STRINGS[
																			'QUICK_TRADE_COMPONENT.PRICE_PER_FORMAT'
																		],
																		selectedTarget?.toUpperCase(),
																		selectedSource?.toUpperCase()
																  )}
														</span>
														<Input
															type="number"
															value={limitOrderPriceDisplay}
															onChange={onCustomPriceChange}
															step="any"
															min="0"
															className="w-50 quick-trade-advanced-input"
														/>
													</div>
												</div>
											</>
										)}
									</div>
								)}
							</div>

							{error?.length ? (
								<FieldError
									error={translateError(error)}
									displayError={true}
									className="input-group__error-wrapper"
								/>
							) : !isLimitOrderWithPrice && isExpired ? (
								<>
									<FieldError
										error={STRINGS['QUICK_TRADE_QUOTE_EXPIRED']}
										displayError={true}
										className="input-group__error-wrapper"
									/>
								</>
							) : null}
							{!isLimitOrderWithPrice && hasExpiredOnce && (
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
								activeProTradePair={activeProTradePair[0]}
							/>
						</div>
					</div>
				</div>
				{!preview && isLoggedIn() && (
					<ActiveOTCLimitOrders
						orders={orderHistory}
						coins={coins}
						onCancelOrder={handleCancelOrder}
						onCancelAllOrders={handleCancelAllOrders}
						selectedSource={selectedSource}
						selectedTarget={selectedTarget}
						quicktradePairs={quicktradePairs}
						isLoadingOrders={isLoadingOrders}
						ordersContainerRef={ordersContainerRef}
						normalizePair={normalizePair}
					/>
				)}
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
							time={!isLimitOrderWithPrice ? time : null}
							expiry={!isLimitOrderWithPrice ? expiry : null}
							coins={coins}
							isActiveSlippage={
								!isLimitOrderWithPrice ? isActiveSlippage : false
							}
							isQuickTradeLimitOrder={isQuickTradeLimitOrder}
							marketLastPrice={marketLastPrice}
							calculatedInvertedPrice={calculatedInvertedPrice}
							limitOrderPriceDisplay={limitOrderPriceDisplay}
							isLimitOrderWithPrice={isLimitOrderWithPrice}
							conversionPriceDisplay={conversionPriceDisplay}
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
	setIsActiveFavQuickTrade: bindActionCreators(
		setIsActiveFavQuickTrade,
		dispatch
	),
	setTransactionPair: bindActionCreators(setTransactionPair, dispatch),
	cancelOrder: bindActionCreators(cancelOrder, dispatch),
	cancelAllOrders: bindActionCreators(cancelAllOrders, dispatch),
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
		isActiveFavQuickTrade: store.app.isActiveFavQuickTrade,
		transactionPair: store.app.transactionPair,
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(withConfig(QuickTrade)));
