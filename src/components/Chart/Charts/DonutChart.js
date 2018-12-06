import React, { Component } from 'react';
import { pie, arc } from 'd3-shape';
import { Link } from 'react-router';

import STRINGS from '../../../config/localizedStrings';

const colors_currencies = {
    fiat: '#00a651',
    btc: '#f7941e',
    bch: '#ec008c',
    eth: '#2e3192',
    ltc: '#58595b',
    noData: '#cccbcb'
};

function translate(x, y) {
    return `translate(${x}, ${y})`;
};

function rotate (d) {
    return `rotate(${180 / Math.PI * (d.startAngle + d.endAngle) / 2 + 45})`;
};

class DonutChart extends Component {

    state = {
        width: 0,
        height: 0,
        isData: true
    }

    componentDidMount() {
        const donutContainer = document.getElementById("donut-container");
        const rect = donutContainer.getBoundingClientRect();
        const checkFilter = this.checkData(this.props.chartData);
        this.setState({ width: rect.width, height: rect.height, isData: checkFilter });
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.chartData) !== JSON.stringify(nextProps.chartData)) {
            this.setState({ isData: this.checkData(nextProps.chartData) });
        }
    }

    checkData = (data = []) => {
        const checkFilter = data.filter(value => value.balance > 0);
        return !!checkFilter.length;
    };

    render() {
        const { width, height, isData } = this.state;
        const data = isData ? this.props.chartData : [{ balance: 100 }];
        let pieJ = pie()
            .value(function (d) {
                return d.balance;
            });
        const pieData = []
        pieJ(data).map((value, i) => {
            pieData.push(value)
        });
        const pieMax = [...pieData.sort((a, b) => a.index - b.index)];
        let pieMin = pieMax.splice(pieMax.length / 2, pieMax.length);
        pieMin = pieMin.sort((a, b) => a.data.balance - b.data.balance);
        let temp = pieMax.length > pieMin.length ? pieMax : pieMin;
        let sortedData = [];
        let count = -1;
        let nextStartAngle = 0;
        temp.map((value, index) => {
            if (pieMax[index]) {
                count += 1;
                let maxData = pieMax[index];
                let tempData = pieData.filter(val => val.index === count)[0];
                let diffangle = maxData.endAngle - maxData.startAngle;
                sortedData = [
                    ...sortedData,
                    {
                        ...tempData,
                        startAngle: nextStartAngle,
                        endAngle: nextStartAngle + diffangle,
                        data: maxData.data,
                        value: maxData.value
                    }
                ];
                nextStartAngle += diffangle;
            }
            if (pieMin[index]) {
                count += 1;
                let minData = pieMin[index];
                let tempData = pieData.filter(val => val.index === count)[0];
                let diffangle = minData.endAngle - minData.startAngle;
                sortedData = [
                    ...sortedData,
                    {
                        ...tempData,
                        startAngle: nextStartAngle,
                        endAngle: nextStartAngle + diffangle,
                        data: minData.data,
                        value: minData.value
                    }
                ];
                nextStartAngle += diffangle;
            }
        });
        let x = width / 2;
        let y = height / 2;

        return (
            <div id="donut-container" className="w-100 h-100">
                <svg width="100%" height="100%">
                    <g transform={translate(x, y)}>
                        {pieJ(data).map((value, i) =>
                            this.renderSlice(value, i, width, height)
                        )}
                    </g>
                </svg>
            </div>
        );
    }

    renderSlice = (value, i, width, height) => {
        let minViewportSize = Math.min(width, height);
        let radius = this.state.isData ? (minViewportSize * .9) / 3 : (minViewportSize * .9) / 2;
        let innerRadius = radius * .60;
        let outerRadius = radius;
        let labelRadious = radius + 30;
        let cornerRadius = 0;
        let arcj = arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .cornerRadius(cornerRadius);
        let centriod = arcj.centroid(value),
            x = centriod[0],
            y = centriod[1],
            // pythagorean theorem for hypotenuse
            hypotenuse = Math.sqrt(x * x + y * y);
        let valX = x / hypotenuse * labelRadious;
        let valY = y / hypotenuse * labelRadious;
        let data = value.data;
        if (!this.state.isData) {
            return (
                <g key={i}>
                    <path d={arcj(value)} fill={colors_currencies.noData} />
                    <text
                        transform={translate(5 - innerRadius, -10)}
                        dy=".35em"
                        className="donut-label-no-price">
                        <tspan>{STRINGS.ZERO_ASSET}</tspan>
                    </text>
                    <text
                        transform={translate(10 - innerRadius, 10)}
                        dy=".35em"
                        className="donut-label-no-price">
                        <Link to='/wallet' className="deposite-asset">{STRINGS.DEPOSIT_ASSETS.toUpperCase()}</Link>
                    </text>
                </g>
            );
        } else if (data.balance > 0) {
            return (
                <g key={i}>
                    <path d={arcj(value)} fill={colors_currencies[data.symbol]} />
                    <text transform={translate(valX, valY)}
                        dy="20px"
                        textAnchor="middle"
                        className="donut-label-percentage">
                        {data.balancePercentage}
                    </text>
                    <text transform={translate(valX, valY - 12)}
                        dy="20px"
                        textAnchor="middle"
                        className="donut-label-pair">
                        {data.shortName}
                    </text>
                </g>
            );
        } else {
            return null;
        }
    }
}

export default DonutChart;