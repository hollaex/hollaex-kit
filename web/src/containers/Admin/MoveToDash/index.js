import React from 'react';
import { Button } from 'antd';
import ReactSVG from 'react-svg';

import { ICONS } from '../../../config/constants';
import './index.css';

const MoveToDash = () => {
	return (
		<div className="Trade-wrapper">
			<div className="content">
				To view this page you must go back to Holla Dash
			</div>
			<ReactSVG
				path={ICONS.ADMIN_MISSING_GO_BACK}
				wrapperClassName="master-admin-img"
			/>
			<div>
				<a
					href="https://dash.testnet.hollaex.com/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button type="primary">Go to Holla Dash</Button>
				</a>
			</div>
		</div>
	);
};

export default MoveToDash;
