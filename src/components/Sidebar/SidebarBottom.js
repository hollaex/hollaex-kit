import React from 'react';
import { Link } from 'react-router';
import ReactSVG from 'react-svg';
import classnames from 'classnames';
import { ICONS } from '../../config/constants';

const SidebarButtom = ({ path = '', iconPath = '', active = false }) => {
	return (
		<Link to={path} className={classnames('sidebar-bottom-button', { active })}>
			<ReactSVG path={iconPath} wrapperClassName="sidebar-bottom-icon" />
		</Link>
	);
};

export const SidebarBottom = ({ activePath = 'x', pair = '', isLogged }) => {
	return (
		isLogged ?
			<div className="sidebar-bottom-wrapper d-flex justify-content-between">
				<SidebarButtom
					path={"/account"} 
					iconPath={ICONS.SIDEBAR_ACCOUNT_ACTIVE}
					active={ activePath === 'account' }
				/>
				<SidebarButtom
					path={`/quick-trade/${pair}`}
					iconPath={activePath === 'quick-trade' ? ICONS.SIDEBAR_QUICK_TRADING_ACTIVE : ICONS.SIDEBAR_QUICK_TRADING_INACTIVE}
					active={activePath === 'quick-trade'}
				/>
				<SidebarButtom
					path={`/trade/${pair}`}
					iconPath={ICONS.SIDEBAR_TRADING_ACTIVE}
					active={activePath === 'trade'}
				/>
				<SidebarButtom
					path={`/chat`}
					iconPath={ICONS.CHAT}
					active={activePath === 'chat'}
				/>
				<SidebarButtom
					path="/wallet"
					iconPath={ICONS.SIDEBAR_WALLET_ACTIVE}
					active={activePath === 'wallet'}
				/>
			</div>: 
			<div></div>
	);
};
