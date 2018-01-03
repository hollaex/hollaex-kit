import React from 'react';
import classnames from 'classnames';

import Section from './Section';
import { NotificationsList, Button, Wallet, Logout } from '../';
import STRINGS from '../../config/localizedStrings';

const Sidebar = ({
	goToWalletPage,
	goToTradePage,
	active,
	activePath,
	logout,
	notifications,
	symbol,
	goToQuickTradePage
}) => {
	return (
		<div className="sidebar-container apply_rtl">
			<div className={`sidebar-actions ${active ? 'active' : ''}`}>
				<Section
					title={STRINGS.WALLET_TITLE}
					goToSection={goToWalletPage}
					active={activePath === 'wallet'}
				>
					<Wallet />
				</Section>
				<Section
					title={STRINGS.TRADING_MODE_TITLE}
					goToSection={goToTradePage}
					active={activePath === 'trade' || activePath === 'quick-trade'}
				>
					<div className="sidebar-container-trade d-flex">
						<Button
							label={STRINGS.PRO_TRADE}
							onClick={goToTradePage}
							disabled={!goToTradePage}
							className={classnames('sidebar-trade-button', {
								active: activePath === 'trade',
								'not-active': activePath !== 'trade'
							})}
						/>
						<div className="separator" />
						<Button
							label={STRINGS.QUICK_TRADE}
							onClick={goToQuickTradePage}
							disabled={!goToQuickTradePage}
							className={classnames('sidebar-trade-button', {
								active: activePath === 'quick-trade',
								'not-active': activePath !== 'quick-trade'
							})}
						/>
					</div>
				</Section>
			</div>
			<div className="sidebar-notifications">
				<NotificationsList notifications={notifications} />
			</div>
			<Logout className="sidebar-logout" onLogout={logout} />
		</div>
	);
};

Sidebar.defaultProps = {
	active: false,
	activePath: '',
	notifications: []
};

export default Sidebar;
