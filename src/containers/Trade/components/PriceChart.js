import React, { Component } from 'react';
import io from 'socket.io-client';
import { AreaChart as Chart } from '../../../components';
import { WS_URL } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';

class ChartComponent extends Component {
	state = {
		width: 0,
		tickers: {},
		timestamp: null,
		chartData: {},
		chartSocket: undefined,
		ready: false
	};

	componentWillMount() {
		const chartSocket = io.connect(`${WS_URL}/chart`, {
			query: {
				symbol: 'btc'
			}
		});
		this.setState({ chartSocket });
		chartSocket.on('data', this.setChartData);
		chartSocket.on('ticker', this.setTickData);
	}

	componentWillUnmount() {
		if (this.state.chartSocket) {
			this.state.chartSocket.close();
		}
	}

	getCurrentBlockTimestamp() {
		const timestamp = new Date().toString();
		const timestampRoundedToMinutes = timestamp.substring(
			0,
			timestamp.lastIndexOf(':')
		);
		const timestampDate = new Date(timestampRoundedToMinutes);
		// To group every 5 minutes gap
		timestampDate.setMinutes(
			timestampDate.getMinutes() - timestampDate.getMinutes() % 5 + 5
		);
		const timestampString = timestampDate.toISOString();
		return timestampString;
	}

	setChartData = ({ data, timestamp }) => {
		const { chartData } = this.state;
		Object.keys(data).forEach((symbol) => {
			if (!chartData[symbol]) {
				chartData[symbol] = [];
			}
			if (Array.isArray(data[symbol])) {
				chartData[symbol] = data[symbol].map((item) => ({
					date: item.date,
					open: item.open,
					close: item.close,
					high: item.high,
					low: item.low
				}));
			} else if (
				data[symbol].date &&
				chartData[symbol].length > 0 &&
				data[symbol].date ===
					chartData[symbol][chartData[symbol].length - 1].date
			) {
				chartData[symbol][chartData[symbol].length - 1] = data[symbol];
			} else if (data[symbol].date) {
				chartData[symbol] = chartData[symbol].push(data[symbol]);
			}
		});

		this.setState({ chartData, timestamp, ready: true });
	};

	setTickData = ({ data, timestamp }) => {
		const { tickers, chartData } = this.state;
		Object.keys(data).forEach((symbol) => {
			if (!tickers[symbol]) {
				tickers[symbol] = 0;
			}
			tickers[symbol] = data[symbol];
		});

		const keys = Object.keys(data);
		if (keys.length === 1) {
			const symbol = keys[0];
			const currentBlockTimestamp = this.getCurrentBlockTimestamp();
			if (
				chartData[symbol].length > 0 &&
				chartData[symbol][chartData[symbol].length - 1].date ===
					currentBlockTimestamp
			) {
				const lastData = chartData[symbol][chartData[symbol].length - 1];
				if (lastData.low > tickers[symbol]) {
					lastData.low = tickers[symbol];
				} else if (lastData.high < tickers[symbol]) {
					lastData.high = tickers[symbol];
				}
				lastData.close = tickers[symbol];
				chartData[symbol][chartData[symbol].length - 1] = lastData;
			} else {
				// const openValue = chartData[symbol].length > 0 ? chartData[symbol][chartData[symbol].length - 1].open : tickers[symbol];
				chartData[symbol].push({
					date: currentBlockTimestamp,
					high: tickers[symbol],
					low: tickers[symbol],
					open: tickers[symbol],
					close: tickers[symbol]
				});
			}
		}
		this.setState({ tickers, chartData, timestamp });
	};

	render() {
		const { height, width } = this.props;
		const { chartData, ready } = this.state;
		return (
			<div
				style={{
					width: '100%',
					height: '100%',
					position: 'relative',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center'
				}}
				className="direction_ltr"
			>
				{ready && chartData.btc && chartData.btc.length > 1 ? (
					<Chart
						serieName="BTC"
						type="hybrid"
						data={chartData.btc}
						width={width}
						height={height}
					/>
				) : (
					<div>{ready ? STRINGS.NO_DATA : STRINGS.LOADING}</div>
				)}
			</div>
		);
	}
}

export default ChartComponent;
