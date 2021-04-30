import React, { Component, Fragment } from 'react';
import { pie, arc } from 'd3-shape';
import { Link } from 'react-router';
import classnames from 'classnames';

import STRINGS from '../../../config/localizedStrings';
import { BASE_CURRENCY } from '../../../config/constants';

const colors_currencies = {
	eur: '#00a651',
	btc: '#f7941e',
	bch: '#9ec51e',
	eth: '#2e3192',
	ltc: '#58595b',
	noData: '#cccbcb',
};

function translate(x, y) {
	return `translate(${x}, ${y})`;
}

// function rotate (d) {
//     return `rotate(${180 / Math.PI * (d.startAngle + d.endAngle) / 2 + 45})`;
// };

class DonutChart extends Component {
	state = {
		width: 0,
		height: 0,
		isData: true,
		hoverId: '',
		higherId: '',
	};

	componentDidMount() {
		const donutContainer = document.getElementById(this.props.id);
		let rect = {};
		if (donutContainer) {
			rect = donutContainer.getBoundingClientRect();
		}
		const checkFilter = this.checkData(this.props.chartData);
		this.setState({
			width: rect.width,
			height: rect.height,
			isData: checkFilter,
		});
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			JSON.stringify(this.props.chartData) !==
			JSON.stringify(nextProps.chartData)
		) {
			this.setState({ isData: this.checkData(nextProps.chartData) });
		}
	}

	checkData = (data = []) => {
		let largerValue = 0;
		let largerId = '';
		data.forEach((value) => {
			if (parseFloat(value.balancePercentage) > largerValue) {
				largerId = value.symbol;
				largerValue = parseFloat(value.balancePercentage);
			}
		});
		this.setState({ higherId: largerId, hoverId: largerId });

		const checkFilter = data.filter((value) => value.balance > 0);
		return !!checkFilter.length;
	};

	handleHover = (symbol) => {
		this.setState({ hoverId: symbol });
	};

	handleOut = () => {
		this.setState({ hoverId: this.state.higherId });
	};

	render() {
		const { width, height, isData } = this.state;
		const data = isData ? this.props.chartData : [{ balance: 100 }];
		let pieJ = pie().value(function (d) {
			return d.balance;
		});
		const pieData = [];
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
				let tempData = pieData.filter((val) => val.index === count)[0];
				let diffangle = maxData.endAngle - maxData.startAngle;
				sortedData = [
					...sortedData,
					{
						...tempData,
						startAngle: nextStartAngle,
						endAngle: nextStartAngle + diffangle,
						data: maxData.data,
						value: maxData.value,
					},
				];
				nextStartAngle += diffangle;
			}
			if (pieMin[index]) {
				count += 1;
				let minData = pieMin[index];
				let tempData = pieData.filter((val) => val.index === count)[0];
				let diffangle = minData.endAngle - minData.startAngle;
				sortedData = [
					...sortedData,
					{
						...tempData,
						startAngle: nextStartAngle,
						endAngle: nextStartAngle + diffangle,
						data: minData.data,
						value: minData.value,
					},
				];
				nextStartAngle += diffangle;
			}
			return '';
		});
		let x = width / 2;
		let y = height / 2 - 11;

		return (
			<div id={this.props.id} className="w-100 h-100">
				<svg width="100%" height="100%">
					<g transform={translate(x, y)}>
						{sortedData.map((value, i) => {
							return this.renderSlice(value, i, width, height);
						})}
					</g>
				</svg>
			</div>
		);
	}

	renderSlice = (value, i, width, height) => {
		const { showOpenWallet } = this.props;
		let data = value.data;
		let minViewportSize = Math.min(width, height);
		let activeSlice = this.state.hoverId === data.symbol;
		let radius = this.state.isData
			? (minViewportSize * 0.9) / 3.2
			: (minViewportSize * 0.9) / 2;
		let innerRadius = radius * 0.6;
		let outerRadius = radius;
		let labelRadious = radius + 30;
		let cornerRadius = 0;
		if (activeSlice) {
			innerRadius += 5;
			outerRadius += 5;
			labelRadious += 5;
		}
		let arcj = arc()
			.innerRadius(innerRadius)
			.outerRadius(outerRadius)
			.cornerRadius(cornerRadius);
		let centriod = arcj.centroid(value),
			x = centriod[0],
			y = centriod[1],
			// pythagorean theorem for hypotenuse
			hypotenuse = Math.sqrt(x * x + y * y);
		let valX = (x / hypotenuse) * labelRadious;
		let valY = (y / hypotenuse) * labelRadious;
		if (!this.state.isData) {
			return (
				<g key={i}>
					<path d={arcj(value)} fill={colors_currencies.noData} />
					<text
						transform={translate(0, -10)}
						dy=".35em"
						className="donut-label-no-price"
						textAnchor="middle"
					>
						<tspan>{STRINGS['ZERO_ASSET']}</tspan>
					</text>
					{showOpenWallet && (
						<text
							transform={translate(0, 10)}
							dy=".35em"
							className="donut-label-no-price"
							textAnchor="middle"
						>
							<Link to="/wallet" className="deposit-asset">
								{STRINGS['DEPOSIT_ASSETS'].toUpperCase()}
							</Link>
						</text>
					)}
				</g>
			);
		} else if (data.balance > 0) {
			const { symbol = '' } =
				this.props.coins[data.symbol || BASE_CURRENCY] || {};
			return (
				<g key={i}>
					<path
						d={arcj(value)}
						className={classnames(`chart_${data.symbol}`, {
							slice_active: activeSlice,
						})}
						onMouseOver={() => this.handleHover(data.symbol)}
						onMouseOut={this.handleOut}
					/>
					{activeSlice ? (
						<Fragment>
							<text
								transform={translate(valX, valY)}
								dy="20px"
								textAnchor="middle"
								className="donut-label-percentage"
							>
								{data.balancePercentage}
							</text>
							<text
								transform={translate(valX, valY - 12)}
								dy="20px"
								textAnchor="middle"
								className="donut-label-pair"
							>
								{symbol.toUpperCase()}
							</text>
							{showOpenWallet && (
								<text dy="5px" textAnchor="middle" className="donut-label-link">
									<Link to="/wallet" className="deposit-asset">
										{STRINGS['OPEN_WALLET'].toUpperCase()}
									</Link>
								</text>
							)}
						</Fragment>
					) : null}
				</g>
			);
		} else {
			return null;
		}
	};
}

DonutChart.defaultProps = {
	id: 'donut-container',
	showOpenWallet: true,
};

export default DonutChart;
