import React, { useEffect, useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const DEFAULT_CHART_OPTIONS = {
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
		width: 200,
		height: (9 / 16) * 60 + '%',
	},
	xAxis: {
		visible: false,
		minorTickInterval: 'auto',
		labels: {
			enabled: false,
		},
		minPadding: 0.05,
		maxPadding: 0.05,
	},
	yAxis: {
		visible: false,
		minorTickInterval: 'auto',
		tickAmount: 10,
		labels: {
			enabled: false,
		},
		title: false,
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
};

export const MiniSparkLine = ({ chartData, isArea }) => {
	const [finalChartData, setFinalChartData] = useState([]);

	useEffect(() => {
		const updatedChartData = [...chartData];
		const chartLen = updatedChartData.length - 1;
		updatedChartData[chartLen] = {
			y: updatedChartData[chartLen],
			marker: {
				enabled: true,
			},
		};
		setFinalChartData(updatedChartData);
	}, [chartData]);

	return (
		<HighchartsReact
			highcharts={Highcharts}
			options={{
				...DEFAULT_CHART_OPTIONS,
				series: [
					{
						name: 'price',
						data: finalChartData?.length ? finalChartData : [],
						threshold: finalChartData[0],
						type: isArea ? 'area' : 'line',
					},
				],
			}}
			containerProps={{
				style: { height: '100%', width: '100%' },
			}}
		/>
	);
};
