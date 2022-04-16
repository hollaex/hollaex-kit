import React from 'react';
import classnames from 'classnames';

import { PriceChange } from 'components';
import { formatToCurrency } from 'utils/currency';

const Tab = ({
	tab,
	activePairTab,
	onTabClick,
	selectedToOpen,
	selectedToRemove,
	sortId,
	market = {},
}) => {
	const {
		pair: { increment_price } = {},
		ticker: { close } = {},
		display_name,
	} = market;

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
					<div className="app_bar-currency-txt">{display_name}:</div>
					<div className="title-font ml-1">
						{formatToCurrency(close, increment_price)}
					</div>
					<PriceChange market={market} />
				</div>
			</div>
		</div>
	);
};

export default Tab;
