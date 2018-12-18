import React, { Component } from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisBottom, axisRight} from 'd3-axis';
import * as d3 from 'd3-selection';

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
        this.setState({ width: (rect.width - 100), height: (rect.height - 100) }, () => {
            this.generateChart(this.props.chartData);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.chartData) !== JSON.stringify(nextProps.chartData)) {
            this.generateChart(nextProps.chartData);
        }
    }

    generateChart = (chartData) => {
        const { margin, height, width } = this.state;
        const SvgElement = d3.select(this.BarSVG);
        if (SvgElement) {
            const chart = SvgElement.append('g')
                .attr('transform', translate(margin, margin));
            const yScale = scaleLinear()
                .domain(chartData.map((s) => s.total))
                .range([height, 0]);
            const xScale = scaleBand()
                .range([0, width])
                .domain(chartData.map((s) => s.month ))
                .padding(0.2);
            chart.append('g')
                .attr('transform', translate(width, 0))
                .call(axisRight().ticks(5).scale(yScale))
                .call(g => g.select('.domain').remove());
            chart.append('g')
                .attr('transform', translate(0, height))
                .call(axisBottom(xScale));
            chart.selectAll()
                .data(chartData)
                .enter()
                .append('rect')
                .attr('x', (s) => xScale(s.month))
                .attr('y', (s) => yScale(s.total))
                .attr('height', (s) => height - yScale(s.total))
                .attr('width', xScale.bandwidth())
        }
    };
    
    render() {
        return (
            <div id="bar-container" className="w-100 h-100">
                <svg ref={el => { this.BarSVG = el; }} width="100%" height="100%">
                </svg>
            </div>
        );
    }
}

export default BarChart;