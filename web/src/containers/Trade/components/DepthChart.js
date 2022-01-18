import React, { Component } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { connect } from 'react-redux';
import { depthChartSelector } from '../utils';

class DepthChart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			chartOptions: {
				chart: {
					type: 'area',
					zoomType: 'xy',
				},
				title: {
					text: null,
				},
				xAxis: {
					minPadding: 0,
					maxPadding: 0,
					title: {
						text: null,
					},
				},
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
				series: [
					{
						name: 'Bids',
						data: [],
					},
					{
						name: 'Asks',
						data: [],
					},
				],
			},
		};
	}

	render() {
		const { chartOptions } = this.state;
		const { containerProps, data } = this.props;

		return (
			<HighchartsReact
				highcharts={Highcharts}
				options={{
					...chartOptions,
					series: data,
				}}
				containerProps={containerProps}
			/>
		);
	}
}

const mapStateToProps = (store) => {
	return {
		data: depthChartSelector(store),
	};
};

export default connect(mapStateToProps)(DepthChart);
