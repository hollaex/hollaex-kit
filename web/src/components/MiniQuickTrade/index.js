import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { SwapOutlined } from '@ant-design/icons';
import debounce from 'lodash.debounce';

import EditWrapper from 'components/EditWrapper';
import STRINGS from 'config/localizedStrings';
import InputGroup from 'components/QuickTrade/InputGroup';
import withConfig from 'components/ConfigProvider/withConfig';
import {
	flipPair,
	getSourceOptions,
	quicktradePairSelector,
} from 'containers/QuickTrade/components/utils';
import { MarketsSelector } from 'containers/Trade/utils';
import { PAIR2_STATIC_SIZE, SPENDING, TYPES } from 'components/QuickTrade';
import { changePair } from 'actions/appActions';
import { getQuickTrade } from 'actions/quickTradeActions';
import { FieldError } from 'components/Form/FormFields/FieldWrapper';
import { translateError } from 'components/QuickTrade/utils';
import './_MiniQuickTrade.scss';

const MiniQuickTrade = ({
	sourceOptions = [],
	coins,
	quicktradePairs,
	markets,
	chain_trade_config,
	changePair,
	router: { params },
}) => {
	const convertInputRef = useRef(null);
	const toInputRef = useRef(null);

	const handleFocusInput = (ref) => {
		if (ref.current) {
			ref.current.focus();
		}
	};

	const getTargetOptions = (source) =>
		sourceOptions.filter((key) => {
			const pairKey = `${key}-${source}`;
			const flippedKey = flipPair(pairKey);

			return quicktradePairs[pairKey] || quicktradePairs[flippedKey];
		});

	const queryPair = (
		quicktradePairs[params.pair] || quicktradePairs[flipPair(params.pair)]
	)?.symbol;
	const initialPair = (queryPair || Object.keys(quicktradePairs)[0])?.split(
		'-'
	);
	const [, initialSelectedSource = sourceOptions[0]] = initialPair;
	const initialTargetOptions = getTargetOptions(initialSelectedSource);
	const [initialSelectedTarget = initialTargetOptions[0]] = initialPair;

	const [symbol, setSymbol] = useState();
	const [sourceAmount, setSourceAmount] = useState();
	const [targetAmount, setTargetAmount] = useState();
	const [selectedSource, setSelectedSource] = useState(initialSelectedSource);
	const [selectedTarget, setSelectedTarget] = useState(initialSelectedTarget);
	const [targetOptions, setTargetOptions] = useState(
		chain_trade_config?.active ? sourceOptions : initialTargetOptions
	);
	const [loading, setLoading] = useState(false);
	const [spending, setSpending] = useState();

	const [mounted, setMounted] = useState(false);
	const [isOpenTopField, setIsOpenTopField] = useState(false);
	const [isOpenBottomField, setIsOpenBottomField] = useState(false);
	const [error, setError] = useState();

	const resetForm = () => {
		setTargetAmount();
		setSourceAmount();
		setSpending();
	};

	const flippedPair = flipPair(symbol);

	const market = markets?.find(
		({ pair: { pair_base, pair_2 } }) =>
			(pair_base === selectedSource && pair_2 === selectedTarget) ||
			(pair_2 === selectedSource && pair_base === selectedTarget)
	);

	const { key } = market || {};

	const isUseBroker =
		(quicktradePairs[symbol] || quicktradePairs[flippedPair])?.type ===
		TYPES.BROKER;

	const onChangeSourceAmount = (value) => {
		setSpending(SPENDING.SOURCE);
		setSourceAmount(value);
		setError();
	};

	const onChangeTargetAmount = (value) => {
		setSpending(SPENDING.TARGET);
		setTargetAmount(value);
		setError();
	};

	const onSelectSource = (value) => {
		setSpending();
		setError();
		setSourceAmount();
		setTargetAmount();
		setSelectedSource(value);
	};

	const onSelectTarget = (value) => {
		setSpending();
		setError();
		setSourceAmount();
		setTargetAmount();
		setSelectedTarget(value);
	};

	const goToPair = (pair) => {
		changePair(pair);
	};

	const handleError = (err) => {
		const error =
			err.response && err.response.data
				? err.response.data.message
					? err.response.data.message
					: err.response.data
				: err.message;
		setError(error);
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
				setError();

				getQuickTrade({
					...amountPayload,
					spending_currency,
					receiving_currency,
				})
					.then(({ data: { spending_amount, receiving_amount } }) => {
						setSpending();
						setTargetAmount(receiving_amount);
						setSourceAmount(spending_amount);
					})
					.catch(handleError)
					.finally(() => {
						setLoading(false);
					});
			} else {
				resetForm();
			}
		}
	};

	const debouncedQuote = useRef(debounce(getQuote, 1000));

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
	}, []);

	const [loadingSource, loadingTarget] =
		spending && spending === SPENDING.SOURCE
			? [false, loading]
			: [loading, false];

	const onSwap = (selectedSource, selectedTarget) => {
		onSelectSource(selectedTarget);
		setTimeout(() => onSelectTarget(selectedSource), 0.1);
	};

	return (
		<div className="mini-quick-trade-container">
			<div
				className={
					isOpenTopField
						? 'active-border mini-quick-trade-converter'
						: 'mini-quick-trade-converter'
				}
			>
				<div
					className="header-wrapper"
					onClick={() => handleFocusInput(convertInputRef)}
				>
					<EditWrapper>
						<span className="title font-weight-bold">{STRINGS['CONVERT']}</span>
					</EditWrapper>
				</div>
				<div className="w-100">
					<InputGroup
						options={sourceOptions.filter((coin) => coin !== selectedTarget)}
						inputValue={sourceAmount}
						selectValue={selectedSource}
						onSelect={onSelectSource}
						onInputChange={onChangeSourceAmount}
						forwardError={() => {}}
						decimal={coins[selectedSource]?.increment_unit || PAIR2_STATIC_SIZE}
						pair={isUseBroker ? symbol : key ? key : ''}
						coins={coins}
						loading={loadingSource}
						disabled={loadingSource}
						setIsOpenTopField={setIsOpenTopField}
						isMiniCalculator={true}
						inputRef={convertInputRef}
					/>
				</div>
			</div>
			<div className="d-flex swap-wrapper-wrapper">
				<div className="swap-wrapper">
					<div className="swap-container">
						<div
							className="pointer blue-link"
							onClick={() => onSwap(selectedSource, selectedTarget)}
						>
							<SwapOutlined className="px-2" rotate={90} />
							<EditWrapper stringId={'SWAP'}>{STRINGS['SWAP']}</EditWrapper>
						</div>
					</div>
				</div>
			</div>
			<div
				className={
					isOpenBottomField
						? 'active-border mini-quick-trade-converter'
						: 'mini-quick-trade-converter'
				}
			>
				<div
					className="header-wrapper"
					onClick={() => handleFocusInput(toInputRef)}
				>
					<EditWrapper>
						<span className="title font-weight-bold">{STRINGS['TO']}</span>
					</EditWrapper>
				</div>
				<div className="w-100">
					<InputGroup
						options={targetOptions.filter((coin) => coin !== selectedSource)}
						inputValue={targetAmount}
						selectValue={selectedTarget}
						onSelect={onSelectTarget}
						onInputChange={onChangeTargetAmount}
						forwardError={() => {}}
						decimal={coins[selectedTarget]?.increment_unit || PAIR2_STATIC_SIZE}
						pair={isUseBroker ? symbol : key ? key : ''}
						coins={coins}
						loading={loadingTarget}
						disabled={loadingTarget}
						setIsOpenBottomField={setIsOpenBottomField}
						isMiniCalculator={true}
						inputRef={toInputRef}
					/>
					{error && (
						<FieldError
							error={translateError(error)}
							displayError={true}
							className="input-group__error-wrapper"
						/>
					)}
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	const sourceOptions = getSourceOptions(state.app.quicktrade);
	return {
		sourceOptions,
		coins: state.app.coins,
		pairs: state.app.pairs,
		quicktradePairs: quicktradePairSelector(state),
		markets: MarketsSelector(state),
		chain_trade_config: state.app.constants.chain_trade_config,
	};
};

const mapDispatchToProps = (dispatch) => ({
	changePair: bindActionCreators(changePair, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(withConfig(MiniQuickTrade)));
