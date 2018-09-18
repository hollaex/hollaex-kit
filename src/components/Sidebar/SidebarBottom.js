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
		<div className="sidebar-bottom-wrapper d-flex justify-content-between">
			<SidebarButtom
				path={isLogged ?"/account": "/login"} 
				iconPath={ICONS.SIDEBAR_ACCOUNT_ACTIVE}
				active={isLogged ? activePath === 'account' : activePath === 'login'}
			/>
			<SidebarButtom
				path={`/trade/${pair}`}
				iconPath={ICONS.SIDEBAR_TRADING_ACTIVE}
				active={activePath === 'trade' || activePath === 'quick-trade'}
			/>
			{isLogged ?
				<SidebarButtom
					path={`/chat`}
					iconPath={ICONS.CHAT}
					active={activePath === 'chat'}
				/>: ''}
			{isLogged ?
				<SidebarButtom
					path="/wallet"
					iconPath={ICONS.SIDEBAR_WALLET_ACTIVE}
					active={activePath === 'wallet'}
				/>
			: '' }
		</div>
	);
};
