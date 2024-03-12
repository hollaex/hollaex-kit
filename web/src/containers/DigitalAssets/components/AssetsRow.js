import React from 'react';
import { PriceChange, Coin, ActionNotification } from 'components';
import TradeInputGroup from 'containers/Wallet/components/TradeInputGroup';
import { MiniSparkLine } from 'containers/TradeTabs/components/MiniSparkLine';
import { getLastValuesFromParts } from 'utils/array';
import STRINGS from 'config/localizedStrings';
import { isMobile } from 'react-device-detect';
import { browserHistory } from 'react-router';
import { unique } from 'utils/data';

const Loading = ({ index }) => {
	return (
		<div
			className="loading-anime"
			style={{
				animationDelay: `.${index + 1}s`,
			}}
		/>
	);
};

const AssetsRow = ({ coinData, loading, index, quicktrade, pairs, icons }) => {
	const {
		icon_id,
		symbol,
		fullname,
		chartData,
		priceDifference,
		priceDifferencePercent,
		oneDayPriceDifference,
		oneDayPriceDifferencePercent,
		lastPrice,
		key,
	} = coinData;

	const getAllAvailableMarkets = (key) => {
		if (quicktrade?.length) {
			const quickTrade = quicktrade
				.filter(({ symbol = '', active }) => {
					const [base, to] = symbol.split('-');
					return active && (base === key || to === key);
				})
				.map(({ symbol }) => symbol);

			const trade = [...findPair(key, 'pair_base'), ...findPair(key, 'pair_2')];

			return unique([...quickTrade, ...trade]);
		}
		return [];
	};

	const isMarketAvailable = (pair) => {
		return pair && pairs[pair] && pairs[pair].active;
	};

	const findPair = (key, field) => {
		const availableMarketsArray = [];

		Object.entries(pairs).map(([pairKey, pairObject]) => {
			if (
				pairObject &&
				pairObject[field] === key &&
				isMarketAvailable(pairKey)
			) {
				availableMarketsArray.push(pairKey);
			}

			return pairKey;
		});

		return availableMarketsArray;
	};

	const getFlippedPair = (pair) => {
		let flippedPair = pair.split('-');
		flippedPair.reverse().join('-');
		return flippedPair;
	};

	const goToTrade = (pair) => {
		const flippedPair = getFlippedPair(pair);
		const isQuickTrade = !!quicktrade.filter(
			({ symbol, active, type }) =>
				!!active &&
				type !== 'pro' &&
				(symbol === pair || symbol === flippedPair)
		).length;
		if (pair && isQuickTrade) {
			return browserHistory.push(`/quick-trade/${pair}`);
		} else if (pair && !isQuickTrade) {
			return browserHistory.push(`/trade/${pair}`);
		}
	};

	const markets = getAllAvailableMarkets(symbol);

	return (
		<tr id={`market-list-row-${key}`} className="table-row table-bottom-border">
			<td className="sticky-col">
				{!loading ? (
					<div
						className="d-flex align-items-center"
						onClick={() => browserHistory.push(`/assets/coin/${symbol}`)}
					>
						<Coin iconId={icon_id} />
						<div className="px-2">{fullname}</div>
					</div>
				) : (
					<Loading index={index} />
				)}
			</td>
			<td>
				{!loading ? (
					<div className="ml-1">{symbol.toUpperCase()}</div>
				) : (
					<Loading index={index} />
				)}
			</td>
			<td>
				{!loading ? (
					<div>
						<span className="title-font ml-1">{lastPrice}</span>
						<span className="title-font ml-2">{'USDT'}</span>
					</div>
				) : (
					<Loading index={index} />
				)}
			</td>
			<td>
				{!loading ? (
					<PriceChange
						market={{
							priceDifference: oneDayPriceDifference,
							priceDifferencePercent: oneDayPriceDifferencePercent,
						}}
						key={key}
					/>
				) : (
					<Loading index={index} />
				)}
			</td>
			<td>
				{!loading ? (
					<PriceChange
						market={{
							priceDifference: priceDifference,
							priceDifferencePercent: priceDifferencePercent,
						}}
						key={key}
					/>
				) : (
					<Loading index={index} />
				)}
			</td>
			<td className="pr-4">
				{!loading ? (
					<MiniSparkLine
						chartData={getLastValuesFromParts(chartData?.price || [])}
						isArea
					/>
				) : (
					<Loading index={index} />
				)}
			</td>
			<td className="td-trade align-items-center justify-content-between">
				{!loading ? (
					markets.length > 1 ? (
						<TradeInputGroup
							quicktrade={quicktrade}
							markets={markets}
							goToTrade={goToTrade}
							pairs={pairs}
						/>
					) : (
						<ActionNotification
							stringId="TRADE_TAB_TRADE"
							text={STRINGS['TRADE_TAB_TRADE']}
							iconId="BLUE_TRADE_ICON"
							iconPath={icons['BLUE_TRADE_ICON']}
							onClick={() => goToTrade(markets[0])}
							className="csv-action"
							showActionText={isMobile}
							disable={markets.length === 0}
						/>
					)
				) : (
					<Loading index={index} />
				)}
			</td>
		</tr>
	);
};

export default AssetsRow;
