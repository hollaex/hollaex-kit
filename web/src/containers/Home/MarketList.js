import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import { setPairsData } from '../../actions/orderbookAction';

export const MarketListHome = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		console.log('xxxxxxxxxxxxxxxxxx ---- srinath -----');
		const getData = async () => {
			const from = moment().subtract('1', 'days').format('X');
			const to = moment().format('X');

			const { data = {} } = await axios({
				url: `/charts?resolution=D&from=${from}&to=${to}`,
				method: 'GET',
			});

			const chartData = {};
			Object.entries(data).forEach(([pairKey, pairData = []]) => {
				chartData[pairKey] = {};
				chartData[pairKey]['close'] = pairData.map(({ close }) => close);
				chartData[pairKey]['open'] = (pairData[0] && pairData[0]['open']) || 0;
			});

			setData(chartData);
			console.log('output dataXXXXXXXXXXX', data);
		};
	});

	return (
		<>
			<div className="bg-light-gray">
				<div className="container">
					<div> Market List</div>
				</div>
			</div>
		</>
	);
};
