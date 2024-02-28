import React from 'react';
import classnames from 'classnames';
import STRINGS from 'config/localizedStrings';
import { ButtonLink, Image, EditWrapper } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import { QuickTradeFooter, ProTradeFooter } from './utlis';

const SidebarButton = ({
	title = '',
	iconPath = '',
	active = false,
	onClick,
	tradeTab = false,
	activeTrades = {},
	isVisibleTrade = {},
}) => {
	const { isProTrade, isQuickTrade } = activeTrades;
	const { renderProTrade, renderQuickTrade } = isVisibleTrade;
	const isTradeTabActive = tradeTab && title === 'Trade';
	const isActiveTrades = isProTrade && isQuickTrade && title === 'Trade';
	const isAssetsOrWallet = renderProTrade && renderQuickTrade;

	return (
		<div
			onClick={onClick}
			className={
				isTradeTabActive || isActiveTrades
					? classnames(
							`sidebar-bottom-button sidebar-bottom-button-${title.toLowerCase()}`,
							'active'
					  )
					: classnames(
							`sidebar-bottom-button sidebar-bottom-button-${title.toLowerCase()}`,
							!tradeTab && { active },
							isAssetsOrWallet && title === 'Assets'
								? 'footer-assets'
								: isAssetsOrWallet && title === 'Wallet' && 'footer-wallet'
					  )
			}
		>
			<Image icon={iconPath} wrapperClassName="sidebar-bottom-icon" />
			<div
				className={
					isTradeTabActive || isActiveTrades
						? 'bottom-text-acttive bottom-bar-text'
						: active && !tradeTab
						? 'bottom-text-acttive bottom-bar-text'
						: 'bottom-bar-text'
				}
			>
				<EditWrapper>{title}</EditWrapper>
			</div>
		</div>
	);
};

const ButtonsSection = () => (
	<div className="d-flex w-100 p-4">
		<div className="w-50">
			<ButtonLink
				link={'/signup'}
				type="button"
				label={STRINGS['SIGNUP_TEXT']}
			/>
		</div>
		<div className="separator" />
		<div className="w-50">
			<ButtonLink link={'/login'} type="button" label={STRINGS['LOGIN_TEXT']} />
		</div>
	</div>
);

const SidebarBottom = ({
	menuItems,
	activePath,
	isLogged,
	icons: ICONS = {},
	onMenuChange,
	tradeTab,
	onHandleTradeTabs,
	pairs,
	isProTrade,
	isQuickTrade,
	isVisibleTrade,
}) => {
	const activeTrades = { isProTrade, isQuickTrade };

	return isLogged ? (
		<div className="sidebar-bottom-wrapper d-flex">
			{menuItems.map(
				(
					{ path, icon_id, string_id, hide_from_bottom_nav, activePaths },
					index
				) => {
					return (
						!hide_from_bottom_nav && (
							<>
								<SidebarButton
									key={`bottom_nav_item_${index}`}
									path={path}
									title={STRINGS[string_id]}
									iconPath={ICONS[icon_id]}
									active={
										activePaths
											? activePaths.includes(activePath)
											: path === activePath
									}
									onClick={() => onMenuChange(path, null, true)}
									tradeTab={tradeTab}
									activeTrades={activeTrades}
									isVisibleTrade={isVisibleTrade}
								/>
								{tradeTab && (
									<div className="mobile-trade-wrapper d-flex">
										<ProTradeFooter
											pairs={pairs}
											onHandleTradeTabs={onHandleTradeTabs}
										/>
										<QuickTradeFooter
											pairs={pairs}
											onHandleTradeTabs={onHandleTradeTabs}
										/>
									</div>
								)}
							</>
						)
					);
				}
			)}
		</div>
	) : (
		<ButtonsSection />
	);
};

export default withConfig(SidebarBottom);
