import React, { Component } from 'react';
import { Table, Select, Alert, Row, Col, Spin } from 'antd';
import { getMonthlyTradingVolume, requestFees } from './actions';
import { Sparklines, SparklinesLine, SparklinesBars } from 'react-sparklines';
import BlockchainTransaction from '../Fees/index';

import Moment from 'react-moment';
import { formatCurrency } from '../../../utils';
import { isAdmin } from '../../../utils/token';

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
	{ title: 'Close', dataIndex: 'close', key: 'close', render: formatNum }
];

class TradingVolume extends Component {
	state = {
		data: [],
		chartData: [],
		error: '',
		newPair: [],
		loadChart: false
	};

	componentWillMount() {
		this.getData();
	}

	getData = (selectedPair = 'btc-eur') => {
		let tableData = [],
			chartData = [];
		getMonthlyTradingVolume(selectedPair)
			.then((data) => {
				const sortedData = data.sort((a, b) => a.date > b.date);
				chartData = sortedData.map((obj) => obj.volume);

				tableData = data.sort((a, b) => {
					return new Date(b.date) - new Date(a.date);
				});
				if (isAdmin()) {
					return requestFees();
				} else {
					throw new Error('not authorized');
				}
			})
			.then((data) => {
				const newPair = [];
				const sortedData = data.data.sort((a, b) => a.id > b.id);
				sortedData.forEach(({ name }) => {
					newPair.push(name);
				});
				this.setState({
					data: tableData,
					chartData,
					newPair,
					loadChart: false
				});
			});
	};

	handleChange = (selectedPair) => {
		this.setState(
			{
				loadChart: true
			},
			() => {
				this.getData(selectedPair);
			}
		);
	};

	render() {
		const { error, data, chartData, newPair, loadChart } = this.state;
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
									defaultValue="btc-eur"
									style={{ width: 120 }}
									onChange={this.handleChange}
								>
									{Options}
								</Select>
							</Col>
						</Row>
						<div className="row-1">
							{loadChart ? (
								<Spin size={'large'} className="sparks" />
							) : (
								<div className="sparks">
									<Sparklines data={chartData}>
										<SparklinesBars
											style={{
												stroke: 'white',
												fill: '#41c3f9',
												fillOpacity: '.25'
											}}
										/>
										<SparklinesLine
											style={{ stroke: '#41c3f9', fill: 'none' }}
										/>
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
							)}
							<div className="fees">
								<BlockchainTransaction />
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default TradingVolume;
