import React from 'react';
import { Table, Select, Alert, Row, Col } from 'antd';
import { Sparklines, SparklinesLine, SparklinesBars } from 'react-sparklines';
import Moment from 'react-moment';

import BlockchainTransaction from '../Fees/index';
import { formatCurrency } from '../../../utils';

const Option = Select.Option;

const formatDate = (value) => {
	return <Moment format="YYYY/MM/DD">{value}</Moment>;
};

const formatNum = (value) => {
	return <div>{formatCurrency(value)}</div>;
};

const VOLUME = [
	{ title: 'Date', dataIndex: 'date', key: 'date', render: formatDate },
	{ title: 'Volume', dataIndex: 'volume', key: 'volume', render: formatNum },
	{ title: 'High', dataIndex: 'high', key: 'high', render: formatNum },
	{ title: 'Low', dataIndex: 'low', key: 'low', render: formatNum },
	{ title: 'Open', dataIndex: 'open', key: 'open', render: formatNum },
	{ title: 'Close', dataIndex: 'close', key: 'close', render: formatNum },
];

const TradingVolume = ({
	error,
	data,
	chartData,
	newPair,
	handleChange,
	selectedPair,
}) => {
	const Options = newPair.map((currency, index) => {
		return (
			<Option key={index} value={currency}>
				{currency}
			</Option>
		);
	});
	return (
		<div className="">
			{error !== '' ? (
				<Alert
					message="Error"
					className="m-top"
					description={error}
					type="error"
					showIcon
					style={{ width: '50%' }}
				/>
			) : (
				<div className="main-container">
					<Row>
						<Col span={12}>
							<h1 className="chart-title">Daily trading volume</h1>
						</Col>
						<Col span={12} pull={1}>
							<Select
								defaultValue={selectedPair}
								style={{ width: 120 }}
								onChange={handleChange}
							>
								{Options}
							</Select>
						</Col>
					</Row>
					<div className="row-1">
						<div className="sparks">
							<Sparklines data={chartData}>
								<SparklinesBars
									style={{
										stroke: 'white',
										fill: '#41c3f9',
										fillOpacity: '.25',
									}}
								/>
								<SparklinesLine style={{ stroke: '#41c3f9', fill: 'none' }} />
							</Sparklines>
							<Table
								columns={VOLUME}
								dataSource={data}
								rowKey={(data, index) => {
									const key = data.symbol + index;
									return key;
								}}
							/>
						</div>
						<div className="fees">
							<BlockchainTransaction />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TradingVolume;
