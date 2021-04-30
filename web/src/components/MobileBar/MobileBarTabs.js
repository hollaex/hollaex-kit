import React, { Fragment, useState } from 'react';
import classnames from 'classnames';
import { MobileBarWrapper } from '.';
import MarketSelector from 'components/AppBar/MarketSelector';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import Image from 'components/Image';

const renderMobileTab = ({
	title,
	key,
	className = '',
	active = false,
	notifications = '',
	onClick,
}) => {
	return (
		<div
			key={key}
			className={classnames(
				'mobile-bar-tab f-1 d-flex justify-content-center align-items-center',
				className,
				{ active }
			)}
			onClick={onClick}
		>
			<div className="bartab-text-wrapper">
				{title}
				{notifications && (
					<div className="bartab-notification">{notifications}</div>
				)}
			</div>
		</div>
	);
};

export const MobileBarTabs = ({
	showMarketSelector,
	tabs,
	className,
	activeTab,
	setActiveTab,
	renderTab = renderMobileTab,
	pair,
	goToPair,
	goToMarkets,
	icons: ICONS,
}) => {
	const [isMarketSelectorOpen, setIsMarketSelectorOpen] = useState(false);

	const toggleMarketSelector = () => {
		setIsMarketSelectorOpen(!isMarketSelectorOpen);
	};

	const closeAddTabMenu = () => {
		setIsMarketSelectorOpen(false);
	};

	let pair_base = '';
	if (pair) {
		const pairArray = pair.split('-');
		pair_base = pairArray[0];
	}

	return (
		<Fragment>
			<MobileBarWrapper className="d-flex justify-content-between">
				{tabs.map((tab, index) => {
					const tabProps = {
						key: `tab_item-${index}`,
						active: index === activeTab,
						...tab,
					};
					if (setActiveTab) {
						tabProps.onClick = () => setActiveTab(index);
					}
					return renderTab(tabProps);
				})}
			</MobileBarWrapper>
			{showMarketSelector && (
				<div
					className={classnames(
						'app_bar-pair-content',
						'd-flex',
						'px-2',
						'justify-content-between',
						'mobile-market-selector-trigger'
					)}
				>
					<div
						className="d-flex align-items-center ml-2"
						onClick={toggleMarketSelector}
					>
						{pair_base && (
							<Image
								icon={
									ICONS[`${pair_base.toUpperCase()}_ICON`]
										? ICONS[`${pair_base.toUpperCase()}_ICON`]
										: ICONS.DEFAULT_ICON
								}
								wrapperClassName="mobile-tab_market-indicator pt-3"
							/>
						)}
						<span className="pt-2 trade-tab__market-selector pr-2">{pair}</span>
						{isMarketSelectorOpen ? (
							<CaretUpOutlined style={{ fontSize: '14px' }} />
						) : (
							<CaretDownOutlined style={{ fontSize: '14px' }} />
						)}
					</div>
					{isMarketSelectorOpen && (
						<MarketSelector
							triggerId="market-selector"
							onViewMarketsClick={goToMarkets}
							closeAddTabMenu={closeAddTabMenu}
							addTradePairTab={goToPair}
						/>
					)}
				</div>
			)}
		</Fragment>
	);
};

MobileBarWrapper.defaultProps = {
	tabs: [],
};
