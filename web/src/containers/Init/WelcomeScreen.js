import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router';
import { ReactSVG } from 'react-svg';

import { STATIC_ICONS } from 'config/icons';

const WelcomeScreen = ({ onChangeStep }) => {
	return (
		<div className="welcome-screen">
			<div className="content">
				<ReactSVG
					src={STATIC_ICONS.HOLLAEX_INIT_LOGO}
					fallback={() => <span>logo</span>}
					className="logo"
				/>
				<div className="body-content">
					<div className="header">
						First-time exchange operator detected Proceed with administrator
						account creation
					</div>
					<div className="description">
						This procedure must only be completed by the exchange owner. When
						creating your operator administrators account it is important to
						memorize the details as it will be unrecoverable upon creation.
					</div>
					<div className="btn-container">
						<Button onClick={() => onChangeStep('email')}>
							Begin account creation
						</Button>
					</div>
				</div>
			</div>
			<div className="footer">
				Why am I seeing this page? This page is a one-time page for the original
				exchange administrator. Upon admin account creation this page will no
				longer be reachable. For further assistance contact{' '}
				<Link>support@bitholla.com</Link>
			</div>
		</div>
	);
};

export default WelcomeScreen;
