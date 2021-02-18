import React, { Fragment } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import STRINGS from '../../config/localizedStrings';
import { ButtonLink } from '../../components';
import withConfig from 'components/ConfigProvider/withConfig';
import Image from 'components/Image';

const SidebarButton = ({
	title = '',
	path = '',
	iconPath = '',
	active = false,
}) => {
	return (
		<Link to={path} className={classnames('sidebar-bottom-button', { active })}>
			<Image icon={iconPath} wrapperClassName="sidebar-bottom-icon" />
			<div
				className={
					active ? 'bottom-text-acttive bottom-bar-text' : 'bottom-bar-text'
				}
			>
				{title}
			</div>
		</Link>
	);
};

const SidebarBottom = ({
	activePath = 'x',
	pair = '',
	isLogged,
	enabledPlugins = [],
	features = {},
	icons: ICONS = {},
}) => {
	return isLogged ? (
		<div className="sidebar-bottom-wrapper d-flex justify-content-between">
			<SidebarButton
				path={'/account'}
				title={STRINGS['ACCOUNT_TEXT']}
				iconPath={ICONS.SIDEBAR_ACCOUNT_ACTIVE}
				active={activePath === 'account'}
			/>
			{/* <SidebarButton
					path={`/quick-trade/${pair}`}
					title={STRINGS["QUICK_TRADE"]}
					iconPath={activePath === 'quick-trade' ? ICONS.SIDEBAR_QUICK_TRADING_ACTIVE : ICONS.SIDEBAR_QUICK_TRADING_INACTIVE}
					active={activePath === 'quick-trade'}
				/> */}
			<SidebarButton
				path={`/trade/${pair}`}
				title={STRINGS['PRO_TRADE']}
				iconPath={ICONS.SIDEBAR_TRADING_ACTIVE}
				active={activePath === 'trade'}
			/>
			{features && features.chat ? (
				<SidebarButton
					path={`/chat`}
					title={STRINGS['USER_SETTINGS.TITLE_CHAT']}
					iconPath={ICONS.CHAT}
					active={activePath === 'chat'}
				/>
			) : (
				<Fragment />
			)}
			<SidebarButton
				path="/wallet"
				title={STRINGS['WALLET_TITLE']}
				iconPath={ICONS.SIDEBAR_WALLET_ACTIVE}
				active={activePath === 'wallet'}
			/>
			<SidebarButton
				path={'/home'}
				title={STRINGS['TRADE_TAB_POSTS']}
				iconPath={ICONS.SIDEBAR_POST_ACTIVE}
				active={activePath === 'home'}
			/>
		</div>
	) : (
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
				<ButtonLink
					link={'/login'}
					type="button"
					label={STRINGS['LOGIN_TEXT']}
				/>
			</div>
		</div>
	);
};

export default withConfig(SidebarBottom);
