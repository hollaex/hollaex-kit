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
}

class DonutChart extends Component {

    state = {
        width: 0,
        height: 0,
        isData: true
    }

    componentDidMount() {
        const donutContainer = document.getElementById("donut-container");
        const rect = donutContainer.getBoundingClientRect();
        const checkFilter = this.checkData(this.props.data);
        this.setState({ width: rect.width, height: rect.height, isData: checkFilter });
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
            this.setState({ isData: this.checkData(nextProps.data) });
        }
    }

    checkData = (data = []) => {
        const checkFilter = data.filter(value => value > 0);
        return !!checkFilter.length;
    };

    render() {
        const { width, height, isData } = this.state;
        const data = isData ? this.props.data : [100];
        let pieJ = pie();
        let x = width / 2;
        let y = height / 2;
        return (
            <div id="donut-container" className="w-100 h-100">
                <svg width="100%" height="100%">
                    <g transform={translate(x, y)}>
                        {pieJ(data).map((value, i) =>
                            this.renderSlice(value, i ,width, height)
                        )}
                    </g>
                </svg>
            </div>
        );
    }

    renderSlice = (value, i, width, height) => {
        const { chartData } = this.props;
        let minViewportSize = Math.min(width, height);
        let radius = (minViewportSize * .9) / 3;
        let innerRadius = radius * .60;
        let outerRadius = radius;
        let labelRadious = radius + 25;
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
        let data = chartData[i];
        if (!this.state.isData) {
            return (
                <g key={i}>
                    <path d={arcj(value)} fill={colors_currencies.noData} />
                    <text
                        transform={translate(5 - innerRadius, -10)}
                        dy=".35em"
                        className="donut-label-percentage">
                        {STRINGS.ZERO_ASSET}
                    </text>
                    <text
                        transform={translate(10 - innerRadius, 10)}
                        dy=".35em"
                        className="donut-label-percentage deposite-asset">
                        <Link to='/wallet'>{STRINGS.DEPOSIT_ASSETS.toUpperCase()}</Link>
                    </text>
                </g>
            );
        } else if (value.data > 0) {
            return (
                <g key={i}>
                    <path d={arcj(value)} fill={colors_currencies[data.symbol]} />
                    <text transform={translate(valX, valY)}
                        dy=".35em"
                        className="donut-label-percentage">
                        {data.balancePercentage}
                    </text>
                    <text transform={translate(valX - 3, valY - 15)}
                        dy=".35em"
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