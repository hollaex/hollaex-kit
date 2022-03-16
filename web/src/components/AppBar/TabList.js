import React from 'react';
import Tab from './Tab';
import { isLoggedIn } from 'utils/token';

const TabList = ({
	items,
	selectedToOpen,
	selectedToRemove,
	activePairTab,
	onTabClick,
	markets,
}) => (
	<div className="d-flex align-items-center h-100">
		{isLoggedIn() &&
			items.map((tab, index) => {
				const market = markets.find(({ key }) => key === tab);
				return (
					<Tab
						key={`item-${index}`}
						index={index}
						tab={tab}
						selectedToOpen={selectedToOpen}
						selectedToRemove={selectedToRemove}
						activePairTab={activePairTab}
						sortId={index}
						onTabClick={onTabClick}
						market={market}
					/>
				);
			})}
	</div>
);

export default TabList;
