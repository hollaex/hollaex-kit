import math from 'mathjs';
import { createSelector } from 'reselect';
import { DIGITAL_ASSETS_SORT } from 'actions/appActions';
import { unsortedMarketsSelector, getPairs } from 'containers/Trade/utils';
import { getPinnedAssets } from 'containers/Wallet/utils';

const getSortMode = (state) => state.app.digital_assets_sort.mode;
const getSortDir = (state) => state.app.digital_assets_sort.is_descending;
const getSelectedSource = (_, props) => props.selectedSource;
const getQuickTrade = (state) => state.app.quicktrade;
const getCoins = (state) => state.app.coins;

const getSortFunction = (mode) => {
	switch (mode) {
		case DIGITAL_ASSETS_SORT.CHANGE:
		default:
			return (a, b) => math.subtract(b.tickerPercent, a.tickerPercent);
	}
};

const sortedMarketsSelector = createSelector(
	[unsortedMarketsSelector, getSortMode, getSortDir],
	(markets, mode, is_descending) => {
		const sortedMarkets = markets.sort(getSortFunction(mode, is_descending));
		return is_descending ? sortedMarkets : [...sortedMarkets].reverse();
	}
);

const pinnedMarketsSelector = createSelector(
	[getPairs, getPinnedAssets],
	(pairs, pinnedAssets) => {
		const pinnedMarkets = [];

		pinnedAssets.forEach((pin) => {
			for (const key in pairs) {
				const { pair_base } = pairs[key];
				if (pin === pair_base) {
					pinnedMarkets.push(key);
					break;
				}
			}
		});

		return pinnedMarkets;
	}
);

export const MarketsSelector = createSelector(
	[sortedMarketsSelector, pinnedMarketsSelector],
	(markets, pins = []) => {
		const pinnedMarkets = [];
		const restMarkets = markets.filter(({ key }) => !pins.includes(key));

		pins.forEach((pin) => {
			const market = markets.find(({ key }) => key === pin);
			if (market) {
				pinnedMarkets.push(market);
			}
		});

		return [...pinnedMarkets, ...restMarkets];
	}
);

export const dataSelector = createSelector(
	[getSelectedSource, MarketsSelector, getPairs, getQuickTrade, getCoins],
	(selectedSource, markets, pairs, quicktrade, coins) => {
		const data = {};

		if (!selectedSource || selectedSource === 'all') {
			markets.forEach((market) => {
				const [coinKey] = market.key.split('-');

				if (!Object.keys(data).includes(coinKey)) {
					data[coinKey] = { ...market, pairBase: coins[coinKey] };
				}
			});

			quicktrade
				.filter(({ active, type }) => !!active && type !== 'pro')
				.forEach(({ symbol, type }) => {
					const [coinKey, sourceKey] = symbol.split('-');
					if (!Object.keys(data).includes(coinKey)) {
						data[coinKey] = {
							key: symbol,
							symbol: coinKey,
							sourceType: type,
							ticker: {},
							pairTwo: coins[sourceKey],
							pairBase: coins[coinKey],
							...coins[coinKey],
						};
					}
				});
		} else if (selectedSource === 'pro') {
			markets.forEach((market) => {
				const [coinKey] = market.key.split('-');

				if (!Object.keys(data).includes(coinKey)) {
					data[coinKey] = { ...market, pairBase: coins[coinKey] };
				}
			});
		} else if (selectedSource === 'network') {
			quicktrade
				.filter(({ active, type }) => !!active && type === 'network')
				.forEach(({ symbol, type }) => {
					const [coinKey, sourceKey] = symbol.split('-');
					if (!Object.keys(data).includes(coinKey)) {
						data[coinKey] = {
							key: symbol,
							symbol: coinKey,
							sourceType: type,
							ticker: {},
							pairTwo: coins[sourceKey],
							pairBase: coins[coinKey],
							...coins[coinKey],
						};
					}
				});
		} else if (selectedSource === 'broker') {
			quicktrade
				.filter(({ active, type }) => !!active && type === 'broker')
				.forEach(({ symbol, type }) => {
					const [coinKey, sourceKey] = symbol.split('-');
					if (!Object.keys(data).includes(coinKey)) {
						data[coinKey] = {
							key: symbol,
							symbol: coinKey,
							sourceType: type,
							ticker: {},
							pairTwo: coins[sourceKey],
							pairBase: coins[coinKey],
							...coins[coinKey],
						};
					}
				});
		} else {
			markets.forEach((market) => {
				const [coinKey, sourceKey] = market.key.split('-');

				if (sourceKey === selectedSource) {
					data[coinKey] = market;
				}
			});
		}

		return Object.values(data);
	}
);

// export const RenderLoading = () => {
// 	const renderCaret = () => (
// 		<div className="market-list__caret d-flex flex-direction-column mx-1 secondary-text">
// 			<CaretUpOutlined />
// 			<CaretDownOutlined />
// 		</div>
// 	);

// 	return (
// 		<div>
// 			<div className="d-flex justify-content-around custom-header-wrapper">
// 				<div>
// 					<EditWrapper stringId="MARKETS_TABLE.ASSET">
// 						{STRINGS['MARKETS_TABLE.ASSET']}
// 					</EditWrapper>
// 				</div>
// 				{!isMobile && <div>
// 					<EditWrapper stringId="PRICE">
// 						{STRINGS['PRICE']}
// 					</EditWrapper>
// 				</div>}
// 				{!isMobile && <div className="d-flex pointer">
// 					<EditWrapper stringId={STRINGS.formatString(
// 						STRINGS['MARKETS_TABLE.PERCENTAGE'],
// 						STRINGS['MARKETS_TABLE.24H']
// 					)}>
// 						{STRINGS.formatString(
// 							STRINGS['MARKETS_TABLE.PERCENTAGE'],
// 							STRINGS['MARKETS_TABLE.24H']
// 						)}
// 					</EditWrapper>
// 					{renderCaret()}
// 				</div>}
// 				{!isMobile && <div className="d-flex pointer">
// 					<EditWrapper stringId={STRINGS.formatString(
// 						STRINGS['MARKETS_TABLE.PERCENTAGE'],
// 						STRINGS['QUICK_TRADE_COMPONENT.7D']
// 					)}>
// 						{STRINGS.formatString(
// 							STRINGS['MARKETS_TABLE.PERCENTAGE'],
// 							STRINGS['QUICK_TRADE_COMPONENT.7D']
// 						)}
// 					</EditWrapper>
// 					{renderCaret()}
// 				</div>}
// 				{isMobile && <div className='d-flex justify-content-center'>
// 					<EditWrapper stringId="DIGITAL_ASSETS.PRICE_24H">
// 						{STRINGS['DIGITAL_ASSETS.PRICE_24H']}
// 					</EditWrapper>
// 				</div>}
// 				<div>
// 					<EditWrapper stringId="MARKETS_TABLE.TREND_7D">
// 						{STRINGS['MARKETS_TABLE.TREND_7D']}
// 					</EditWrapper>
// 				</div>
// 				{!isMobile && <div>
// 					<EditWrapper stringId="DIGITAL_ASSETS.CARDS.MARKET_CAP">
// 						{STRINGS['DIGITAL_ASSETS.CARDS.MARKET_CAP']}
// 					</EditWrapper>
// 				</div>}
// 				<div>
// 					<EditWrapper stringId="TRADE_TAB_TRADE">
// 						{STRINGS['TRADE_TAB_TRADE']}
// 					</EditWrapper>
// 				</div>
// 			</div>
// 			<div className="custom-border-bottom"></div>
// 			<Spin
// 				className="d-flex justify-content-center"
// 				loading={true}
// 				size="large"
// 			></Spin>
// 			<div className="text-center">
// 				<EditWrapper stringId="DIGITAL_ASSETS.LOADING_PRICES">
// 					{STRINGS['DIGITAL_ASSETS.LOADING_PRICES']}
// 				</EditWrapper>
// 			</div>
// 		</div>
// 	);
// };
