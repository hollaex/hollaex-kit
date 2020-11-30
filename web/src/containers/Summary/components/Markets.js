import React from 'react';

import { Table } from '../../../components';
import withConfig from 'components/ConfigProvider/withConfig';
import { generateMarketHeaders } from './utils';

const Markets = ({ pairs = {}, coins = {}, icons }) => {
	const headers = generateMarketHeaders(pairs, coins, icons);
	return (
		<div className="markets-section-wrapper">
			<Table
				rowKey={(data) => {
					return data.id;
				}}
				headers={headers}
				data={[]}
				count={2}
				displayPaginator={false}
			/>
		</div>
	);
};

export default withConfig(Markets);
