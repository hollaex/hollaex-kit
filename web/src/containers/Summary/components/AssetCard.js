import React from 'react';
import classnames from 'classnames';
import { Image } from 'components';

import { BASE_CURRENCY, FLEX_CENTER_CLASSES } from 'config/constants';
import { formatAverage } from 'utils/currency';
import withConfig from 'components/ConfigProvider/withConfig';

const AssetCard = ({
	value: { symbol, icon_id, balanceFormat },
	currencyBalance,
	icons: ICONS,
	name,
}) => {
	return (
		<div className="price-content text-center">
			<div className={classnames('coin-price-container', FLEX_CENTER_CLASSES)}>
				<Image
					iconId={icon_id}
					icon={ICONS[icon_id]}
					wrapperClassName="coin-price"
					imageWrapperClassName="currency-ball-image-wrapper"
				/>
			</div>
			<div className="price-text">
				{`${name} ${formatAverage(currencyBalance)}`}
			</div>
			{symbol !== BASE_CURRENCY && (
				<div className="price-text">{`~${formatAverage(balanceFormat)}`}</div>
			)}
		</div>
	);
};

export default withConfig(AssetCard);
