import React from 'react';
import Tab from './Tab';
import { isLoggedIn } from 'utils/token';
import { Loading } from 'containers/DigitalAssets/components/utils';

const TabList = ({
	items,
	selectedToOpen,
	selectedToRemove,
	activePairTab,
	onTabClick,
	markets,
	isLoading = false,
}) => {
	return (
		<div className="d-flex align-items-center h-100">
			{isLoggedIn() &&
				items.map((tab, index) => {
					const market = markets.find(
						({ key, symbol }) => key === tab || symbol === tab
					);
					return !isLoading ? (
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
					) : (
						<Loading index={index} />
					);
				})}
		</div>
	);
};

export default TabList;
