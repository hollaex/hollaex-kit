import React from 'react';
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
	
};

export const MiniSparkLine = ({ chartData, isArea }) => {
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={{
                ...DEFAULT_CHART_OPTIONS,
                series: [{
                    name: 'price',
                    data: chartData,
                    pointStart: 0,
                    type: isArea ? 'area' : 'line',
                }
            ]}}
            containerProps={{
                style: { height: '100%', width: '100%' },
            }}
        />
    )
};