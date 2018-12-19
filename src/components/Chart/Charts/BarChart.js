import React, { Component } from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisBottom, axisRight} from 'd3-axis';
import * as d3 from 'd3-selection';
import moment from 'moment';

import { TRADING_VOLUME_CHART_LIMITS } from '../../../config/constants';
import { formatAverage } from '../../../utils/currency';

const barSample = [
    { key: 1, month: "Jan", pairWisePrice: { btc: 220000000, eth: 220000000, bch: 40000000 }, total: 48000000000 },
    { key: 2, month: "Feb", pairWisePrice: { btc: 44, eth: 23, bch: 50 }, total: 117 },
    { key: 3, month: "Mar", pairWisePrice: { btc: 30, eth: 20 }, total: 50 },
    { key: 4, month: "Apr", pairWisePrice: { btc: 60, eth: 25, bch: 35 }, total: 120 },
    { key: 5, month: "May", pairWisePrice: { btc: 52, eth: 71, bch: 43 }, total: 166 },
    { key: 6, month: "Jun", pairWisePrice: { eth: 202, bch: 105 }, total: 307 },
    { key: 7, month: "Jul", pairWisePrice: { btc: 103, bch: 55 }, total: 158 },
    { key: 8, month: "Aug", pairWisePrice: { btc: 304 }, total: 304 },
    { key: 9, month: "Sep", pairWisePrice: { btc: 38, eth: 42, bch: 55 }, total: 135 },
    { key: 10, month: "Oct", pairWisePrice: { bch: 205 }, total: 205 },
    { key: 11, month: "Nov", pairWisePrice: {}, total: 0 },
    { key: 12, month: "Dec", pairWisePrice: { btc: 300, eth: 55, bch: 45 }, total: 400 }
];

function translate(x, y) {
    return `translate(${x}, ${y})`;
};

class BarChart extends Component {
    state = {
        margin: 60,
        width: 0,
        height: 0,
        chartData: {}
    }

    componentDidMount() {
        const donutContainer = document.getElementById("bar-container");
        const rect = donutContainer.getBoundingClientRect();
        this.setState({ width: (rect.width - 60), height: (rect.height - 100) }, () => {
            this.generateChart(this.props.chartData);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.chartData) !== JSON.stringify(nextProps.chartData)) {
            this.generateChart(nextProps.chartData);
        }
    }

    generateChart = (chartData) => {
        // const chartData = barSample;
        const { margin, height, width } = this.state;
        const SvgElement = d3.select(this.BarSVG);
        const upperLimit = TRADING_VOLUME_CHART_LIMITS[TRADING_VOLUME_CHART_LIMITS.length - 1];
        if (SvgElement) {
            const chart = SvgElement.append('g')
                .attr('transform', translate(10, margin));
            const yScale = scaleLinear()
                .range([height, 0])
                .domain([0, upperLimit]);
            const xScale = scaleBand()
                .range([0, width])
                .domain(chartData.map((s) => s.month ))
                .padding(0.2);
            chart.append('g')
                .attr('class', 'bar_yAxis')
                .attr('transform', translate(width, 0))
                .call(axisRight()
                    .scale(yScale)
                    .ticks(3)
                    .tickValues([0, ...TRADING_VOLUME_CHART_LIMITS])
                    .tickSize(-width)
                    .tickFormat(d => formatAverage(d))
                )
                .call(g => g.select('.domain').remove());
            chart.append('g')
                .attr('class', 'bar_xAxis')
                .attr('transform', translate(0, height))
                .call(axisBottom(xScale))
            chart.selectAll('.bar_xAxis .tick text')
                .call((t) => {
                    t.each((d, key, node) => {
                        const data = chartData[key];
                        const totalTxt = data.key - 1 >= moment().month()
                            ? 'Pending'
                            : data.total !== 0
                                ? formatAverage(data.total)
                                : '';
                        const self = d3.select(node[key]);
                        self.text('');
                        self.append("tspan")
                            .attr("class",
                                data.total >= TRADING_VOLUME_CHART_LIMITS[0]
                                    ? 'axis_month axis_month-active'
                                    : 'axis_month')
                            .attr("x", 0)
                            .attr("dy", ".8em")
                            .text(d);
                        self.append("tspan")
                            .attr("class",
                                data.total >= TRADING_VOLUME_CHART_LIMITS[0]
                                    ? 'axis_month-total axis_month-total-active'
                                    : 'axis_month-total')
                            .attr("x", 2)
                            .attr("dy", "1.3em")
                            .text(totalTxt);
                    })
                });
            const bars = chart.selectAll()
                .data(chartData)
                .enter();
            bars.each((d, key, node) => {
                let barEnter = d3.select(node[key]);
                let barKeys = Object.keys(d.pairWisePrice);
                let count = 0;
                if (d.key - 1 < moment().month()) {
                    barKeys.map((pair) => {
                        barEnter.append('rect')
                            .attr('class', pair)
                            .attr('x', xScale(d.month))
                            .attr('y', (s) => {
                                count += d.pairWisePrice[pair];
                                return yScale(count);
                            })
                            .attr('height', (s) => {
                                let total = d.pairWisePrice[pair];
                                return height - yScale(total);
                            })
                            .attr('width', xScale.bandwidth());
                        return 0;
                    });
                } else {
                    // ToDo: code for appent pending icon
                }
            });
        }
    };
    
    render() {
        return (
            <div id="bar-container" className="bar_wrapper w-100 h-100">
                <svg ref={el => { this.BarSVG = el; }} width="100%" height="100%">
                </svg>
            </div>
        );
    }
}

export default BarChart;