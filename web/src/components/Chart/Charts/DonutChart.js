import React, { Component, Fragment } from 'react';
import { Link } from 'react-router';
import EventListener from 'react-event-listener';
import { pie, arc } from 'd3-shape';
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
const filterDonutPercentage = 8;
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
		const { chartData, currentCurrency } = this.props;
		if (
			JSON.stringify(chartData) !== JSON.stringify(nextProps.chartData) ||
			currentCurrency !== nextProps.currentCurrency
		) {
			this.setState({
				isData: this.checkData(nextProps.chartData, nextProps.currentCurrency),
			});
		}
	}

	checkData = (data = [], currency) => {
		let largerValue = 0;
		let largerId = '';
		data.forEach((value) => {
			if (parseFloat(value.balancePercentage) > largerValue) {
				largerId = value.symbol;
				largerValue = parseFloat(value.balancePercentage);
			}
		});
		this.setState({
			higherId: largerId,
			hoverId: this.props.currency ? this.props.currency : currency || largerId,
		});

		const checkFilter = data.filter((value) => value.balance > 0);
		return !!checkFilter.length;
	};

	handleHover = (symbol) => {
		this.setState({ hoverId: symbol });
	};

	handleOut = () => {
		const { currentCurrency } = this.props;
		this.setState({
			hoverId: this.props.currency
				? this.props.currency
				: currentCurrency || this.state.higherId,
		});
	};

	handleResize = () => {
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
		const isDonutValue = this.props && this.props.isCurrencyWallet;

		const filterByPercentage = () => {
			let coins = [];
			let othersTotalPercentage = 0;
			let isUpdated = false;
			let startAngle = 0;

			sortedData.forEach((value, i) => {
				const balancePercentageStr = value.data.balancePercentage;
				if (balancePercentageStr && balancePercentageStr.includes('%')) {
					const balancePercentage = Number(balancePercentageStr.split('%')[0]);
					if (
						balancePercentage > 0 &&
						balancePercentage <= filterDonutPercentage
					) {
						othersTotalPercentage += balancePercentage;
					} else if (balancePercentage >= filterDonutPercentage) {
						startAngle = value.endAngle;
						coins.push({ ...value });
					}
				}
			});
			if (!isUpdated && this.state.isData) {
				if (coins.length) {
					isUpdated = true;
					const updatedObj = {
						...coins[0],
						data: {
							...coins[0].data,
							display_name: 'Others',
							balancePercentage: `${othersTotalPercentage.toFixed(1)}%`,
							symbol: 'Others',
						},
						value: othersTotalPercentage,
						startAngle,
						endAngle:
							startAngle === nextStartAngle
								? nextStartAngle * 1.01
								: nextStartAngle,
					};
					coins.push(updatedObj);
				}
			}
			return coins;
		};

		const renderDonut = () => {
			const data = sortedData.map((value, i) =>
				this.renderSlice(value, i, width, height)
			);
			if (this.state && this.state.isData) {
				if (!isDonutValue) {
					return filterByPercentage().map((value, i) =>
						this.renderSlice(value, i, width, height)
					);
				} else {
					return data;
				}
			} else {
				return data;
			}
		};

		return (
			<Fragment>
				<EventListener target="window" onResize={this.handleResize} />
				<div id={this.props.id} className="w-100 h-100">
					<svg width="100%" height="100%">
						<g transform={translate(x, y)}>{renderDonut()}</g>
					</svg>
				</div>
			</Fragment>
		);
	}

	renderSlice = (value, i, width, height) => {
		const { showOpenWallet, centerText } = this.props;
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
					<path
						d={arcj(value)}
						fill={colors_currencies.noData}
						fill-opacity="0.2"
					/>
					<text
						transform={translate(0, -10)}
						dy=".35em"
						className="donut-label-no-price"
						textAnchor="middle"
					>
						<tspan x="0" dy="0">
							{STRINGS['ZERO_ASSET']}
						</tspan>
						<tspan x="0" dy="1.2em">
							{STRINGS['ZERO_ASSET_2']}
						</tspan>
						<tspan x="0" dy="1.2em">
							{STRINGS['ZERO_ASSET_3']}
						</tspan>
					</text>
					{showOpenWallet && (
						<text
							transform={translate(0, 10)}
							dy=".35em"
							className="donut-label-no-price"
							textAnchor="middle"
						>
							<Link to="/wallet" className="deposit-asset">
								<tspan dy="1.4em">
									{STRINGS['DEPOSIT_ASSETS'].toUpperCase()}
								</tspan>
							</Link>
						</text>
					)}
				</g>
			);
		} else if (data.balance > 0) {
			const { display_name = '' } =
				this.props.coins[data.symbol || BASE_CURRENCY] || {};
			return (
				<g key={i}>
					<path
						d={arcj(value)}
						className={
							data.symbol === 'Others'
								? 'others-color'
								: classnames(`chart_${data.symbol}`, 'chart_slice', {
										slice_active: activeSlice,
								  })
						}
						onMouseOver={() => this.handleHover(data.symbol)}
						onMouseOut={this.handleOut}
					/>
					{activeSlice ? (
						<Fragment>
							<text
								transform={translate(
									centerText ? 0 : valX,
									centerText ? 5 : valY
								)}
								x={centerText ? '0px' : '5px'}
								dy={
									this.state.higherId === this.state.hoverId
										? '5px'
										: centerText
										? '5px'
										: '25px'
								}
								textAnchor="middle"
								className="donut-label-percentage"
								style={{ fontSize: centerText ? '0.8rem' : '1rem' }}
							>
								{data.balancePercentage}
							</text>
							<text
								transform={translate(
									centerText ? 0 : valX,
									centerText ? -7 : valY - 12
								)}
								x={centerText ? '0px' : '5px'}
								dy={
									this.state.higherId === this.state.hoverId
										? '5px'
										: centerText
										? '5px'
										: '25px'
								}
								textAnchor="middle"
								className="donut-label-pair"
								style={{ fontSize: centerText ? '0.8rem' : '1rem' }}
							>
								{data.display_name === 'Others' ? 'Others' : display_name}
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
