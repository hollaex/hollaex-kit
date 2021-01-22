import React, { Component } from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisBottom, axisRight } from 'd3-axis';
import * as d3 from 'd3-selection';
import moment from 'moment';
import { connect } from 'react-redux';

import {
	BAR_CHART_LIMIT_CAPACITY,
	BASE_CURRENCY,
} from '../../../config/constants';
import {
	formatToCurrency,
	formatAverage,
	formatBtcAmount,
} from '../../../utils/currency';

function translate(x, y) {
	return `translate(${x}, ${y})`;
}

class BarChart extends Component {
	state = {
		margin: 60,
		width: 0,
		height: 0,
		chartData: {},
	};

	componentDidMount() {
		const donutContainer = document.getElementById('bar-container');
		const rect = donutContainer.getBoundingClientRect();
		this.setState(
			{ width: rect.width - 120, height: rect.height - 130 },
			() => {
				if (!this.props.loading) {
					this.generateChart(this.props.chartData, this.props.limitContent);
				}
			}
		);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			JSON.stringify(this.props.chartData) !==
				JSON.stringify(nextProps.chartData) &&
			!nextProps.loading
		) {
			this.generateChart(
				nextProps.chartData,
				nextProps.limitContent,
				nextProps.peakVolume
			);
		}
	}

	generateChart = (chartData, limitContent, peakVolume) => {
		const { yAxisLimits, activeTheme } = this.props;
		const { margin, height, width } = this.state;
		const SvgElement = d3.select(this.BarSVG);
		const upperLimit = peakVolume || yAxisLimits[yAxisLimits.length - 1];
		// const currentMonth = moment().month();
		if (SvgElement) {
			const tooltip = d3
				.select('body')
				.append('div')
				.attr(
					'class',
					activeTheme === 'dark' ? 'bar-tooltip-dark' : 'bar-tooltip'
				)
				.style('display', 'none');
			const chart = SvgElement.append('g').attr(
				'transform',
				translate(10, margin)
			);
			const yScale = scaleLinear().range([height, 0]).domain([0, upperLimit]);
			const xScale = scaleBand()
				.range([0, width])
				.domain(chartData.map((s) => s.month))
				.padding(0.2);
			chart
				.append('g')
				.attr('class', 'bar_yAxis')
				.attr('transform', translate(width, 0))
				.call(
					axisRight()
						.scale(yScale)
						.ticks(3)
						.tickValues([0, ...yAxisLimits])
						.tickSize(-width)
						.tickFormat((d) =>
							d !== 0 && upperLimit <= BAR_CHART_LIMIT_CAPACITY[1]
								? formatAverage(d).toUpperCase()
								: ''
						)
				)
				.call((g) => g.select('.domain').remove());
			chart
				.append('g')
				.attr('class', 'bar_xAxis')
				.attr('transform', translate(0, height))
				.call(axisBottom(xScale));
			chart.select('.bar_xAxis path').attr('d', `M0.5,1V0.5H${width}.5V1`);
			chart.selectAll('.bar_xAxis .tick text').call((t) => {
				t.each((d, key, node) => {
					const data = chartData[key];
					// const totalTxt = data.key - 1 === currentMonth
					//     ? 'Pending'
					//     : data.total !== 0
					//         ? formatAverage(data.total).toUpperCase()
					//         : '';
					// const totalTxt = data.total !== 0
					//         ? formatAverage(data.total).toUpperCase()
					//         : '';
					let dateTxt = (key + 1) % 3 === 0 ? moment().date() : '';
					const self = d3.select(node[key]);
					self.text('');
					self
						.append('tspan')
						.attr(
							'class',
							data.total >= yAxisLimits[0]
								? 'axis_month axis_month-active'
								: 'axis_month'
						)
						.attr('x', 0)
						.attr('dy', '.8em')
						.text(dateTxt);
					if ((key + 1) % 3 === 0) {
						self
							.append('tspan')
							.attr(
								'class',
								data.total >= yAxisLimits[0]
									? 'axis_month-total axis_month-total-active'
									: 'axis_month-total'
							)
							.attr('x', 2)
							.attr('dy', '1.3em')
							.text(d);
					}
				});
			});
			chart.selectAll('.bar_yAxis .tick text').call((t) => {
				t.each((d, key, node) => {
					const self = d3.select(node[key]);
					self.attr('x', 10);
					if (d !== 0) {
						chart
							.append('svg')
							.attr('class', 'bar_axis_triangle')
							.attr('x', width)
							.attr('y', yScale(d) - 5)
							.append('path')
							.attr('d', 'M 2 5 L 7 1 L 7 10 L 2 5');
					}
				});
			});
			if (limitContent.length && upperLimit <= BAR_CHART_LIMIT_CAPACITY[0]) {
				yAxisLimits.map((limits, index) => {
					let content = limitContent[index];
					if (content) {
						let scale = yScale(limits) + yScale(limits) * 0.01;
						let scaleTxt = scale + (32 + index * 10);
						if (content.icon) {
							chart
								.append('svg')
								.append('svg:image')
								.attr('xlink:href', content.icon)
								.attr('class', 'limit_contnet-icon')
								.attr('x', width + 15)
								.attr('y', scale + 5)
								.attr('viewBox', '0 0 1024 1024')
								.attr('width', '3rem');
						}
						if (content.text) {
							chart
								.append('foreignObject')
								.attr('x', width + 15)
								.attr('y', scaleTxt)
								.attr('width', '6rem')
								.append('xhtml:div')
								.attr('class', 'limit_content-text')
								.html(`<span>${content.text}</span>`);
						}
					}
					return 0;
				});
			}
			const bars = chart.selectAll().data(chartData).enter();
			bars.each((d, key, node) => {
				let barEnter = d3.select(node[key]);
				let barKeys = Object.keys(d.pairWisePrice);
				let count = 0;
				// if (d.key - 1 === currentMonth) {
				//     barEnter.append("svg:image")
				//         .attr("xlink:href", ICONS.VOLUME_PENDING)
				//         .attr('class', 'bar_pending-icon')
				//         .attr('x', (xScale(d.month) + 5))
				//         .attr('y', (yScale(0) - 20))
				//         .attr('viewBox', '0 0 1024 1024')
				//         .attr('height', 18)
				//         .attr('width', xScale.bandwidth());
				// } else {
				barKeys.map((pair) => {
					barEnter
						.append('rect')
						.attr('class', `chart_${pair}`)
						.attr('x', xScale(d.month))
						.attr('y', (s) => {
							count += d.pairWisePrice[pair];
							return yScale(count);
						})
						.attr('height', (s) => {
							let total = d.pairWisePrice[pair];
							return height - yScale(total);
						})
						.attr('width', xScale.bandwidth())
						.on('mouseover', (d) => {
							let checkKey = d.key === 1 ? 12 : d.key - 1;
							let filterData = chartData.filter(
								(cData) => cData.key === checkKey
							);
							let mBetweenTxt = `${moment().date()} ${d.month}`;
							let beforeVolume = filterData[0];
							if (beforeVolume && beforeVolume.month) {
								mBetweenTxt = `${moment().date()} ${
									beforeVolume.month
								} - ${moment().date()} ${d.month}`;
							}
							let currencyFormat = this.props.coins[pair] || {};
							let baseFormat = this.props.coins[BASE_CURRENCY] || {
								symbol: '',
							};
							let volume = currencyFormat
								? formatToCurrency(d.pairVolume[pair], currencyFormat.min)
								: formatBtcAmount(d.pairVolume[pair]);
							tooltip.selectAll('*').remove();
							tooltip
								.style('display', 'block')
								.style('top', d3.event.pageY - 10 + 'px')
								.style('left', d3.event.pageX + 10 + 'px')
								.append('div')
								.attr('class', 'tool_tip-pair-volume')
								.text(mBetweenTxt);
							tooltip
								.append('div')
								.attr('class', 'tool_tip-pair-volume')
								.text(`${pair.toUpperCase()}: ${formatAverage(volume)}`);
							tooltip
								.append('div')
								.attr('class', 'tool_tip-pair-price')
								.text(
									`~ ${baseFormat.symbol.toUpperCase()}: ${formatAverage(
										formatToCurrency(d.pairWisePrice[pair], baseFormat.min)
									)}`
								);
						})
						.on('mousemove', function () {
							return tooltip
								.style('top', d3.event.pageY - 10 + 'px')
								.style('left', d3.event.pageX + 10 + 'px');
						})
						.on('mouseout', function () {
							return tooltip.style('display', 'none');
						});
					return 0;
				});
				// }
			});
		}
	};

	render() {
		return (
			<div id="bar-container" className="bar_wrapper w-100">
				<svg
					ref={(el) => {
						this.BarSVG = el;
					}}
					width="100%"
					height="100%"
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	coins: state.app.coins,
});

BarChart.defaultProps = {
	loading: false,
};

export default connect(mapStateToProps)(BarChart);
