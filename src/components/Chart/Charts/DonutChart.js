import React, { Component, Fragment } from 'react';
import { pie, arc } from 'd3-shape';
import { Link } from 'react-router';
import classnames from 'classnames';

import STRINGS from '../../../config/localizedStrings';

const colors_currencies = {
    eur: '#00a651',
    btc: '#f7941e',
    bch: '#9ec51e',
    eth: '#2e3192',
    ltc: '#58595b',
    noData: '#cccbcb'
};

function translate(x, y) {
    return `translate(${x}, ${y})`;
};

// function rotate (d) {
//     return `rotate(${180 / Math.PI * (d.startAngle + d.endAngle) / 2 + 45})`;
// };

class DonutChart extends Component {

    state = {
        width: 0,
        height: 0,
        isData: true,
        hoverId: '',
        higherId: ''
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
        let largerValue = 0;
        let largerId = '';
        data.map((value, index) => {
            if (value.balance > largerValue) {
                largerId = `slice-${index}`;
                largerValue = value.balance;
            }
            return null;
        });
        this.setState({ higherId: largerId, hoverId: largerId });

        const checkFilter = data.filter(value => value.balance > 0);
        return !!checkFilter.length;
    };

    handleHover = id => {
        this.setState({ hoverId: `slice-${id}` });
    };

    handleOut = () => {
        this.setState({ hoverId: this.state.higherId });
    };

    render() {
        const { width, height, isData } = this.state;
        const data = isData ? this.props.chartData : [{ balance: 100 }];
        let pieJ = pie()
            .value(function (d) {
                return d.balance;
            });
        const pieData = []
        pieJ(data).map((pieValue, i) => {
            if (pieValue.value !== 0) {
                pieData.push(pieValue);
            }
            return null;
        });
        const pieMax = [...pieData.sort((a, b) => b.data.balance - a.data.balance)];
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
            return '';
        });
        let x = width / 2;
        let y = (height / 2) - 15;

        return (
            <div id="donut-container" className="w-100 h-100">
                <svg width="100%" height="100%">
                    <g transform={translate(x, y)}>
                        {sortedData.map((value, i) => {
                            return this.renderSlice(value, i, width, height)
                        }
                        )}
                    </g>
                </svg>
            </div>
        );
    }

    renderSlice = (value, i, width, height) => {
        let minViewportSize = Math.min(width, height);
        let radius = this.state.isData ? (minViewportSize * .9) / 3.2 : (minViewportSize * .9) / 2;
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
                        transform={translate(0, -10)}
                        dy=".35em"
                        className="donut-label-no-price"
                        textAnchor="middle">
                        <tspan>{STRINGS.ZERO_ASSET}</tspan>
                    </text>
                    <text
                        transform={translate(0, 10)}
                        dy=".35em"
                        className="donut-label-no-price"
                        textAnchor="middle">
                        <Link to='/wallet' className="deposite-asset">{STRINGS.DEPOSIT_ASSETS.toUpperCase()}</Link>
                    </text>
                </g>
            );
        } else if (data.balance > 0) {
            return (
                <g key={i}>
                    <path
                        d={arcj(value)}
                        className={classnames(`chart_${data.symbol}`, { 'slice_active': this.state.hoverId === `slice-${i}` })}
                        onMouseOver={() => this.handleHover(i)}
                        onMouseOut={this.handleOut} />
                    {this.state.hoverId === `slice-${i}`
                        ? <Fragment>
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
                                {STRINGS[`${data.symbol.toUpperCase()}_SHORTNAME`]}
                            </text>
                        </Fragment>
                        : null
                    }
                </g>
            );
        } else {
            return null;
        }
    }
}

export default DonutChart;