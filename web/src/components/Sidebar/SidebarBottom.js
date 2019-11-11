import React from 'react';
import { Link } from 'react-router';
import ReactSVG from 'react-svg';
import classnames from 'classnames';
import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';
import { ButtonLink } from '../../components';


const SidebarButtom = ({ title= '', path = '', iconPath = '', active = false }) => {
	return (
		<Link to={path} className={classnames('sidebar-bottom-button', { active })}>
			<ReactSVG path={iconPath} wrapperClassName="sidebar-bottom-icon" />
			<div className={ active ? 'bottom-text-acttive bottom-bar-text' : 'bottom-bar-text'} >{title}</div>
		</Link>
	);
};

export const SidebarBottom = ({ activePath = 'x', pair = '', isLogged }) => {
	return (
		isLogged ?
			<div className="sidebar-bottom-wrapper d-flex justify-content-between">
				<SidebarButtom
					path={"/account"} 
					title= {STRINGS.ACCOUNT_TEXT}
					iconPath={ICONS.SIDEBAR_ACCOUNT_ACTIVE}
					active={ activePath === 'account' }
				/>
				<SidebarButtom
					path={`/quick-trade/${pair}`}
					title={STRINGS.QUICK_TRADE}
					iconPath={activePath === 'quick-trade' ? ICONS.SIDEBAR_QUICK_TRADING_ACTIVE : ICONS.SIDEBAR_QUICK_TRADING_INACTIVE}
					active={activePath === 'quick-trade'}
				/>
				<SidebarButtom
					path={`/trade/${pair}`}
					title={STRINGS.PRO_TRADE}
					iconPath={ICONS.SIDEBAR_TRADING_ACTIVE}
					active={activePath === 'trade'}
				/>
				<SidebarButtom
					path={`/chat`}
					title={STRINGS.USER_SETTINGS.TITLE_CHAT}
					iconPath={ICONS.CHAT}
					active={activePath === 'chat'}
				/>
				<SidebarButtom
					path="/wallet"
					title={STRINGS.WALLET_TITLE}
					iconPath={ICONS.SIDEBAR_WALLET_ACTIVE}
					active={activePath === 'wallet'}
				/>
			</div> :
			<div className="d-flex w-100 p-4">
				<div className="w-50">
					<ButtonLink
						link={'/signup'}
						type="button"
						label={STRINGS.SIGNUP_TEXT}
					/>
				</div>
				<div className="separator" />
				<div className="w-50">
					<ButtonLink
						link={'/login'}
						type="button"
						label={STRINGS.LOGIN_TEXT}
					/>
				</div>
			</div>
	);
};
