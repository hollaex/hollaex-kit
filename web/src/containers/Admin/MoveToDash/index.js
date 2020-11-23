import React from 'react';
import { Button } from 'antd';
import ReactSVG from 'react-svg';

import { STATIC_ICONS } from 'config/icons';
import './index.css';

const MoveToDash = () => {
	return (
		<div className="Trade-wrapper">
			<div className="content">
				To view this page you must go back to master admin dashboard
			</div>
			<ReactSVG
				path={STATIC_ICONS.ADMIN_MISSING_GO_BACK}
				wrapperClassName="master-admin-img"
			/>
			<div>
				<a
					href="https://dash.testnet.hollaex.com/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button type="primary">Go to master admin</Button>
				</a>
			</div>
		</div>
	);
};

export default MoveToDash;
