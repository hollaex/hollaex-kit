import React, { Component } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import _get from 'lodash/get';

class SparkLine extends Component {
	constructor(props) {
		super(props);
		const { data: { close = [], open = 0 } = {} } = this.props;
		this.state = {
			chartOptions: {
				tooltip: {
					enabled: false,
				},
				title: {
					text: null,
				},
				legend: {
					enabled: false,
				},
				chart: {
					styledMode: true,
				},
				xAxis: {
					type: 'linear',
					allowDecimals: false,
					visible: false,
				},
				yAxis: {
					visible: false,
				},
				plotOptions: {
					series: {
						className: 'main-color',
						negativeColor: true,
						marker: {
							enabled: false,
							states: {
								hover: {
									enabled: false,
								},
							},
						},
					},
				},
				pane: {
					size: '100%',
				},
				series: [
					{
						name: 'Area',
						type: 'area',
						data: close,
						threshold: open,
					},
				],
			},
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { data, renderDefaultLine } = this.props;
		if (data?.close?.length === 1 && renderDefaultLine) {
			data.close.push(data.close[0]);
		}
		if (JSON.stringify(data) !== JSON.stringify(nextProps.data)) {
			this.setState((prevState) => ({
				...prevState,
				chartOptions: {
					...prevState.chartOptions,
					series: [
						{
							...prevState.chartOptions.series,
							name: _get(nextProps, 'data.name')
								? _get(nextProps, 'data.name')
								: _get(prevState, 'chartOptions.series.name'),
							type: _get(nextProps, 'data.type')
								? _get(nextProps, 'data.type')
								: _get(prevState, 'chartOptions.series.type'),
							data: nextProps.data.close,
							threshold: nextProps.data.open,
						},
					],
				},
			}));
		}
	}

	render() {
		const { chartOptions } = this.state;
		const { containerProps } = this.props;

		return (
			<HighchartsReact
				highcharts={Highcharts}
				options={chartOptions}
				containerProps={containerProps}
			/>
		);
	}
}

export default SparkLine;
