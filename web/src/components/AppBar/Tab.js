import React from 'react';
import classnames from 'classnames';

import { PriceChange } from 'components';
import { formatToCurrency } from 'utils/currency';
import { ThunderboltFilled } from '@ant-design/icons';

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
		key,
		pair: { increment_price } = {},
		ticker: { close } = {},
		display_name,
		type
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
				onClick={() => onTabClick(tab, type && type !== 'pro')}
			>
				<div className="app_bar-pair-font d-flex align-items-center justify-content-between">
					<div className="app_bar-currency-txt">{display_name}</div>
					{increment_price && (
						<>
							<div className="title-font ml-1">
								<span className="app_bar-currency-txt">:</span>
								{formatToCurrency(close, increment_price)}
							</div>
							<PriceChange market={market} key={key} />
						</>
					)}
					{type && type !== 'pro' && (
						<div className="d-flex align-items-center ml-1 summary-quick-icon">
							<ThunderboltFilled />
						</div>
					)}
					
				</div>
			</div>
		</div>
	);
};

export default Tab;
