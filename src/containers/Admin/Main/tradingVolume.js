import React, { Component } from 'react';
import { Table, Select, Alert, Row, Col, Spin } from 'antd';
import { getMonthlyTradingVolume, requestFees } from './actions';
import { Sparklines, SparklinesLine, SparklinesBars } from 'react-sparklines';
import BlockchainTransaction from '../Fees/index';

import Moment from 'react-moment';
import { isAdmin, isSupport, formatCurrency } from '../../../utils';

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

	getData = (selectedPair) => {
		getMonthlyTradingVolume(selectedPair == null ? 'btc-eur' : selectedPair)
			.then((data) => {
				const sortedData = data.sort((a, b) => a.date > b.date);
				const chartData = sortedData.map((obj) => obj.volume);
				this.setState({
					chartData
				});
				// const tableData = data.sort((a, b) =>  a.date < b.date);
				// this.setState({data:tableData});
				const tableData = data.sort((a, b) => {
					return new Date(b.date) - new Date(a.date);
				});
				this.setState({ data: tableData });
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
				this.setState({ newPair, loadChart: false });
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				// this.setState({
				//   loading: false,
				//   error: message
				// });
			});
	};

	handleChange = (selectedPair) => {
		this.getData(selectedPair);
		this.setState({ loadChart: true });
	};

	render() {
		const { error, data, chartData, newPair, loadChart } = this.state;
		return (
			<div className="">
				{error && (
					<Alert
						message="Error"
						className="m-top"
						description={error}
						type="error"
						showIcon
						style={{ width: '50%' }}
					/>
				)}
				{data && (
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
									{newPair.map((currency, index) => {
										return <Option key={index} value={currency}>{currency}</Option>;
									})}
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
								</div>
							)}
							<div className="fees">
								<BlockchainTransaction />
							</div>
						</div>
						<div className="row-2">
							<Table columns={VOLUME} dataSource={data} />
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default TradingVolume;
