import React from 'react';
import { Button } from 'antd';
import { ReactSVG } from 'react-svg';

import { STATIC_ICONS } from 'config/icons';
import './index.css';

const MoveToDash = ({ path }) => {
	let data = '';
	if (path) {
		data = path.split('/')[2];
		if (data === 'apikeys') {
			data = 'mypage/apikey';
		} else if (data === 'financials') {
			data = 'financial';
		}
	}
	return (
		<div className="Trade-wrapper">
			<div className="content">
				To view this page you must go back to Holla Dash
			</div>
			<ReactSVG
				src={STATIC_ICONS.ADMIN_MISSING_GO_BACK}
				className="master-admin-img"
			/>
			<div>
				<a
					href={`https://dash.bitholla.com/${data}`}
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
