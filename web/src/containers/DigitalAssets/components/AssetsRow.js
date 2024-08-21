import React from 'react';
import { connect } from 'react-redux';

import TradeInputGroup from 'containers/Wallet/components/TradeInputGroup';
import STRINGS from 'config/localizedStrings';
import { PriceChange, Coin, ActionNotification } from 'components';
import { MiniSparkLine } from 'containers/TradeTabs/components/MiniSparkLine';
import { getLastValuesFromParts } from 'utils/array';
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

const AssetsRow = ({
	coinData,
	loading,
	index,
	quicktrade,
	pairs,
	icons,
	coins,
}) => {
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
					isMobile ? (
						<div
							className="d-flex align-items-center"
							onClick={() => browserHistory.push(`/prices/coin/${symbol}`)}
						>
							<Coin iconId={icon_id} type="CS10" />
							<div className="px-2 ml-2 d-flex flex-column table-asset-container">
								<span className="asset-text">{symbol?.toUpperCase()}</span>
								<span className="coin-symbol">{fullname}</span>
							</div>
						</div>
					) : (
						<div
							className="d-flex align-items-center"
							onClick={() => browserHistory.push(`/prices/coin/${symbol}`)}
						>
							<Coin iconId={icon_id} />
							<div className="px-2">
								<span className="asset-text">{fullname}</span>
								<span className="ml-2 coin-symbol">
									{symbol?.toUpperCase()}
								</span>
							</div>
						</div>
					)
				) : (
					<Loading index={index} />
				)}
			</td>
			{isMobile && (
				<td>
					{!loading ? (
						<div>
							<div className="d-flex justify-content-end">
								<span className="title-font last-price-label">
									{lastPrice && '$'}
								</span>
								<span className="title-font last-price-label">
									{lastPrice ? lastPrice : '-'}
								</span>
							</div>
							{(oneDayPriceDifferencePercent && oneDayPriceDifference) ||
							oneDayPriceDifference === 0 ? (
								<PriceChange
									market={{
										priceDifference: oneDayPriceDifference,
										priceDifferencePercent: oneDayPriceDifferencePercent,
									}}
									key={key}
								/>
							) : (
								<span className="d-flex justify-content-end font-raleway">
									0%
								</span>
							)}
						</div>
					) : (
						<Loading index={index} />
					)}
				</td>
			)}
			{isMobile && (
				<td>
					{!loading ? (
						<div className="d-flex flex-column justify-content-end">
							{(priceDifference && priceDifferencePercent) ||
							priceDifference === 0 ? (
								<PriceChange
									market={{
										priceDifference: priceDifference,
										priceDifferencePercent: priceDifferencePercent,
									}}
									key={key}
									isMobileMarket={true}
								/>
							) : (
								<span className="font-raleway">0%</span>
							)}
							{chartData?.price ? (
								<MiniSparkLine
									chartData={getLastValuesFromParts(chartData?.price || [])}
									isArea
								/>
							) : (
								<span> {'- '}</span>
							)}
						</div>
					) : (
						<Loading index={index} />
					)}
				</td>
			)}
			{!isMobile && (
				<td>
					{!loading ? (
						<div className="d-flex justify-content-end">
							<span className="title-font last-price-label">
								{lastPrice && '$'}
							</span>
							<span className="title-font last-price-label">
								{lastPrice ? lastPrice : '-'}
							</span>
						</div>
					) : (
						<Loading index={index} />
					)}
				</td>
			)}
			{!isMobile && (
				<td>
					{!loading ? (
						(oneDayPriceDifferencePercent && oneDayPriceDifference) ||
						oneDayPriceDifference === 0 ? (
							<PriceChange
								market={{
									priceDifference: oneDayPriceDifference,
									priceDifferencePercent: oneDayPriceDifferencePercent,
								}}
								key={key}
							/>
						) : (
							<span className="font-raleway">0%</span>
						)
					) : (
						<Loading index={index} />
					)}
				</td>
			)}
			{!isMobile && (
				<td>
					{!loading ? (
						(priceDifference && priceDifferencePercent) ||
						priceDifference === 0 ? (
							<PriceChange
								market={{
									priceDifference: priceDifference,
									priceDifferencePercent: priceDifferencePercent,
								}}
								key={key}
							/>
						) : (
							<span className="font-raleway">0%</span>
						)
					) : (
						<Loading index={index} />
					)}
				</td>
			)}
			{!isMobile && (
				<td className="market-chart">
					{!loading ? (
						chartData?.price ? (
							<MiniSparkLine
								chartData={getLastValuesFromParts(chartData?.price || [])}
								isArea
							/>
						) : (
							'-'
						)
					) : (
						<Loading index={index} />
					)}
				</td>
			)}
			{!isMobile && (
				<td>
					{!loading ? (
						<div className="ml-1 market-capital mr-3">
							{coins[symbol]?.market_cap ? (
								coins[symbol].market_cap.toLocaleString('en-US', {
									style: 'currency',
									currency: 'USD',
								})
							) : (
								<span className="font-raleway">0</span>
							)}
						</div>
					) : (
						<Loading index={index} />
					)}
				</td>
			)}
			<td className="td-trade align-items-center justify-content-center">
				{!loading ? (
					markets.length > 1 ? (
						<TradeInputGroup
							quicktrade={quicktrade}
							markets={markets}
							goToTrade={goToTrade}
							pairs={pairs}
							tradeClassName="market-asset-row"
						/>
					) : (
						<ActionNotification
							stringId={STRINGS.formatString(
								STRINGS['MARKETS_TABLE.BUY'],
								<span>/</span>,
								<span>{STRINGS['SIDES.SELL']}</span>
							)}
							text={STRINGS.formatString(
								STRINGS['MARKETS_TABLE.BUY'],
								<span>/</span>,
								<span>{STRINGS['SIDES.SELL']}</span>
							)}
							onClick={() => goToTrade(markets[0])}
							className="csv-action"
							showActionText={isMobile}
							disable={markets.length === 0}
							tradeClassName="market-asset-row"
						/>
					)
				) : (
					<Loading index={index} />
				)}
			</td>
		</tr>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
});

export default connect(mapStateToProps)(AssetsRow);
