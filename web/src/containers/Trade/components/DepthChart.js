import React, { Component } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { connect } from 'react-redux';
import { depthChartSelector } from '../utils';

class DepthChart extends Component {
	render() {
		const { containerProps, series } = this.props;

		const chartOptions = {
			chart: {
				type: 'area',
				zoomType: 'x',
			},
			title: {
				text: null,
			},
			xAxis: [
				{
					title: {
						text: null,
					},
					width: '50%',
				},
				{
					title: {
						text: null,
					},
					offset: 0,
					width: '50%',
					left: '50%',
				},
			],
			yAxis: [
				{
					lineWidth: 1,
					gridLineWidth: 1,
					title: null,
					tickWidth: 1,
					tickLength: 5,
					tickPosition: 'inside',
					labels: {
						align: 'left',
						x: 8,
					},
				},
				{
					opposite: true,
					linkedTo: 0,
					lineWidth: 1,
					gridLineWidth: 0,
					title: null,
					tickWidth: 1,
					tickLength: 5,
					tickPosition: 'inside',
					labels: {
						align: 'right',
						x: -8,
					},
				},
			],
			legend: {
				enabled: false,
			},
			plotOptions: {
				area: {
					fillOpacity: 0.2,
					lineWidth: 1,
					step: 'center',
				},
			},
			tooltip: {
				headerFormat:
					'<span style="font-size=10px;">Price: {point.key}</span><br/>',
				valueDecimals: 2,
			},
			series,
		};

		return (
			<HighchartsReact
				highcharts={Highcharts}
				options={chartOptions}
				containerProps={containerProps}
			/>
		);
	}
}

const mapStateToProps = (store) => {
	return {
		...depthChartSelector(store),
	};
};

export default connect(mapStateToProps)(DepthChart);
