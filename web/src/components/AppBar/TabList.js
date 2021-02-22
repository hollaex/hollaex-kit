import React from 'react';
import Tab from './Tab';
import { isLoggedIn } from 'utils/token';

const TabList = ({
	items,
	pairs,
	tickers,
	coins,
	selectedToOpen,
	selectedToRemove,
	activePairTab,
	onTabClick,
}) => (
	<div className="d-flex align-items-center h-100">
		{isLoggedIn() &&
			items.map((tab, index) => {
				const pair = pairs[tab];
				const ticker = tickers[tab];
				return (
					<Tab
						key={`item-${index}`}
						index={index}
						tab={tab}
						pair={pair}
						ticker={ticker}
						coins={coins}
						selectedToOpen={selectedToOpen}
						selectedToRemove={selectedToRemove}
						activePairTab={activePairTab}
						sortId={index}
						onTabClick={onTabClick}
					/>
				);
			})}
	</div>
);

export default TabList;
