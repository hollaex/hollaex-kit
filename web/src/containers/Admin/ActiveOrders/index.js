import React, { useEffect, useState } from 'react';
import { Row, Select } from 'antd';
import { connect } from 'react-redux';

import PairsSection from './PairsSection';

const TYPE_OPTIONS = [
	{ value: true, label: 'Active' },
	{ value: false, label: 'Closed' },
];

const ActiveOrders = ({ pairs, userId, cancelOrder }) => {
	const [options, setOptions] = useState([]);
	const [pair, setPair] = useState(null);
	const [type, setType] = useState(true);

	useEffect(() => {
		setOptions(getOptions(pairs));
	}, [pairs]);

	const getOptions = (pairs) => {
		const options = [{ value: null, label: 'All' }];
		Object.keys(pairs).forEach((pair) => {
			options.push({
				label: pair,
				value: pair,
			});
		});
		return options;
	};

	return (
		<div className="app_container-content">
			<h1>Active Orders</h1>
			<div>
				<Select
					style={{
						width: 100,
					}}
					options={options}
					value={pair}
					onChange={setPair}
				/>
				<Select
					style={{
						width: 100,
					}}
					options={TYPE_OPTIONS}
					value={type}
					onChange={setType}
				/>
			</div>
			<Row>
				<PairsSection
					key={`${pair}_${type}`}
					userId={userId}
					pair={pair}
					open={type}
					cancelOrder={cancelOrder}
				/>
			</Row>
		</div>
	);
};

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
});

export default connect(mapStateToProps)(ActiveOrders);
