import React from 'react';
import classnames from 'classnames';

import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';
import { donutFormatPercentage, formatToCurrency } from 'utils/currency';

const Tab = ({
	pair = {},
	tab,
	ticker = {},
	coins = {},
	activePairTab,
	onTabClick,
	selectedToOpen,
	selectedToRemove,
	sortId,
}) => {
	const { symbol } =
		coins[pair.pair_base || BASE_CURRENCY] || DEFAULT_COIN_DATA;
	const pairTwo = coins[pair.pair_2 || BASE_CURRENCY] || DEFAULT_COIN_DATA;
	const { increment_price } = pair;
	const priceDifference =
		ticker.open === 0 ? 0 : (ticker.close || 0) - (ticker.open || 0);
	const tickerPercent =
		priceDifference === 0 || ticker.open === 0
			? 0
			: (priceDifference / ticker.open) * 100;
	const priceDifferencePercent = isNaN(tickerPercent)
		? donutFormatPercentage(0)
		: donutFormatPercentage(tickerPercent);
	return (
		<div
			id={`trade-tab-${sortId}`}
			className={classnames(
				'app_bar-pair-content',
				'd-flex',
				'justify-content-between',
				'app_bar-pair-tab',
				{
					'active-tab-pair': activePairTab === tab,
					transition_open: selectedToOpen === tab,
					transition_close: selectedToRemove === tab,
				}
			)}
		>
			<div
				className="favourite-tab d-flex w-100 content-center"
				onClick={() => onTabClick(tab)}
			>
				<div className="app_bar-pair-font d-flex align-items-center justify-content-between">
					<div className="app_bar-currency-txt">
						{symbol.toUpperCase()}/{pairTwo.symbol.toUpperCase()}:
					</div>
					<div className="title-font ml-1">
						{formatToCurrency(ticker.close, increment_price)}
					</div>
					<div
						className={
							priceDifference < 0
								? 'app-price-diff-down app-bar-price_diff_down'
								: 'app-bar-price_diff_up app-price-diff-up'
						}
					/>
					<div
						className={
							priceDifference < 0
								? 'title-font app-price-diff-down'
								: priceDifference > 0 ? 'title-font app-price-diff-up' : "title-font"
						}
					>
						{priceDifferencePercent}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Tab;
