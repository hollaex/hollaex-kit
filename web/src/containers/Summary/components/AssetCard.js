import React from 'react';
import classnames from 'classnames';
import { Coin } from 'components';

import { BASE_CURRENCY, FLEX_CENTER_CLASSES } from 'config/constants';
import { formatAverage } from 'utils/currency';

const AssetCard = ({
	value: { symbol, icon_id, balanceFormat },
	currencyBalance,
	name,
	hideBalance = false,
}) => {
	return (
		<div className="price-content text-center">
			<div className={classnames('coin-price-container', FLEX_CENTER_CLASSES)}>
				<Coin iconId={icon_id} />
			</div>
			<div className="price-text">
				{`${name} ${hideBalance ? '' : formatAverage(currencyBalance)}`}
			</div>
			{!hideBalance && symbol !== BASE_CURRENCY && (
				<div className="price-text">{`~${formatAverage(balanceFormat)}`}</div>
			)}
		</div>
	);
};

export default AssetCard;
