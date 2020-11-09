import React from 'react';
import classnames from 'classnames';

import { QuickTrade } from '../../components';

import { FLEX_CENTER_CLASSES } from '../../config/constants';

const Section2 = ({
	style,
	onReviewQuickTrade,
	onRequestMarketValue,
	symbol,
	quickTradeData,
}) => (
	<div
		className={classnames(...FLEX_CENTER_CLASSES, 'quick_trade-section')}
		style={style}
	>
		<QuickTrade
			onReviewQuickTrade={onReviewQuickTrade}
			onRequestMarketValue={onRequestMarketValue}
			symbol={symbol}
			quickTradeData={quickTradeData}
		/>
	</div>
);

export default Section2;
