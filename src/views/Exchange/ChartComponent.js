import React, { Component } from 'react';
import io from 'socket.io-client';
import { TypeChooser } from "react-stockcharts/lib/helper";
import CandleChart from "./Chart";

const EMPTY_DATA = {
  Open: 0,
  Close: 0,
  High: 0,
  Low: 0,
};

class ChartComponent extends Component {
  state = {
    width: 0,
    tickers: {},
    timestamp: null,
    chartData: {},
  }

  componentWillMount() {
    const chartSocket =  io.connect('http://35.158.234.195/chart');
    chartSocket.on('data', this.prepareChartData);
    chartSocket.on('ticker', this.setTickData);
  }

  componentDidMount() {
    this.setState({ width: this.wrapper.offsetWidth > 600 ? 600 : this.wrapper.offsetWidth })
  }

  getCurrentBlockTimestamp() {
    const timestamp = (new Date()).toString();
    const timestampRoundedToMinutes = timestamp.substring(0, timestamp.lastIndexOf(':'));
    const timestampDate = new Date(timestampRoundedToMinutes);
    // To group every 5 minutes gap
    timestampDate.setMinutes(timestampDate.getMinutes() - timestampDate.getMinutes() % 5 + 5);
    const timestampString = timestampDate.toISOString();
    return timestampString;
  }

  prepareChartData = ({ data, timestamp }) => {
    const { chartData } = this.state;
    Object.keys(data).forEach((symbol) => {
      if (!chartData[symbol]) {
        chartData[symbol] = [];
      }
      if (Array.isArray(data[symbol])) {
        chartData[symbol] = data[symbol].map((item) => ({
          date: item.date || item.Date,
          open: item.open || item.Open,
          close: item.close || item.Close,
          high: item.high || item.High,
          low: item.low || item.Low,
        }));
      } else if (data[symbol].date && chartData[symbol].length > 0 && data[symbol].date === chartData[symbol][chartData[symbol].length -1].date) {
        chartData[symbol][chartData[symbol].length -1] = data[symbol];
      } else if (data[symbol].date) {
        chartData[symbol] = chartData[symbol].push(data[symbol]);
      }
    })

    this.setState({ chartData, timestamp });
  }

  setTickData = ({ data, timestamp }) => {
    const { tickers, chartData } = this.state;
    Object.keys(data).forEach((symbol) => {
      if (!tickers[symbol]) {
        tickers[symbol] = 0;
      }
      tickers[symbol] = data[symbol];
    })
    const keys = Object.keys(data);
    if (keys.length === 1) {
      const symbol = keys[0];
      const currentBlockTimestamp = this.getCurrentBlockTimestamp();
      if (chartData[symbol][chartData[symbol].length - 1].date === currentBlockTimestamp) {
        const lastData = chartData[symbol][chartData[symbol].length - 1];
        if (lastData.low > tickers[symbol]) {
          lastData.low = tickers[symbol]
        } else if (lastData.high < tickers[symbol]) {
          lastData.high = tickers[symbol]
        }
        lastData.close = tickers[symbol]
        chartData[symbol][chartData[symbol].length - 1] = lastData;
      } else {
        chartData[symbol].push({
          date: currentBlockTimestamp,
          high: tickers[symbol],
          low: tickers[symbol],
          open: tickers[symbol],
          close: tickers[symbol],
        })
      }
    }
    this.setState({ tickers, chartData, timestamp });
  }

  render() {
    const { height } = this.props;
    const { chartData, tickers, timestamp, width } = this.state;

    return (
      <div
        ref={(el) => { this.wrapper = el; } }
        style={{ width: '100%', height: '100%', border: '1px solid blue', position: 'relative'}}
      >
        {chartData.btc && chartData.btc.length > 0 ?
          <CandleChart
            serieName="BTC"
            type="hybrid"
            data={chartData.btc}
            width={width}
            height={height}
          /> :
          <div>Loading</div>
        }
      </div>
    );
  }
}

export default ChartComponent;
