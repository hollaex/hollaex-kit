import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import ReactSVG from 'react-svg';
import { DisplayTable } from '../../../components';
import { getFormatTimestamp } from '../../../utils/utils';
import STRINGS from '../../../config/localizedStrings';
import { IS_XHT, ICONS } from '../../../config/constants';
import { formatToCurrency } from '../../../utils/currency';
// import { roundNumber } from '../../../utils/currency';
// import { getDecimals } from '../../../utils/utils';
import { tradeHistorySelector } from '../utils';

const generateHeaders = (pairs) => {
	return [
		{
			key: 'price',
			label: STRINGS["PRICE"],
			renderCell: ({ side, price = 0, isSameBefore, upDownRate, timestamp }, index) => {
				const isArrow = upDownRate < 0;
				return (
					<div
						className={classnames('trade_history-row d-flex flex-row', side)}
						key={`time-${index}`}
					>
						{!isSameBefore
							? <ReactSVG
								path={isArrow
									? ICONS.DOWN_ARROW
									: ICONS.UP_ARROW
								}
								wrapperClassName={'trade_history-icon'}
							/>
							: <div className='trade_history-icon' />
						}
						{price}
					</div>
				)
			}
		},
		{
			key: 'size',
			label: STRINGS["SIZE"],
			renderCell: ({ size = 0, side }, index) => { 
				// const { increment_size } = pairs;
				// const minSize = roundNumber(size, getDecimals(increment_size));
				return (
					IS_XHT
						? <div
							className={classnames('trade_history-row', side)}
							key={`size-${index}`}
						>
							{size}
						</div>
						: size
				)
			}
		},
		{
			key: 'timestamp',
			label: STRINGS["TIME"],
			renderCell: ({ timestamp, side }, index) => IS_XHT
				? <div
					className={classnames('trade_history-row', side)}
					key={`timestamp-${index}`}
				>
					{getFormatTimestamp(timestamp, STRINGS["HOUR_FORMAT"])}
				</div>
				: getFormatTimestamp(timestamp, STRINGS["HOUR_FORMAT"])
		}
	];
}

class TradeHistory extends Component {
	state = {
		headers: [],
		data: [],
		isprevious: false
	};

	componentWillMount() {
		this.calculateHeaders();
		if (this.props.data.length) {
			this.generateData(this.props.data);
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.language !== this.props.language) {
			this.calculateHeaders();
		}
	}

	componentDidUpdate(prevProps) {
		if (JSON.stringify(this.props.data) !== JSON.stringify(prevProps.data)) {
			this.generateData(this.props.data);
		}
	}

	calculateHeaders = () => {
		const headers = generateHeaders(this.props.pairs[this.props.pair]);
		this.setState({ headers });
	};

	generateData = (data) => {
		let pairData = this.props.pairs[this.props.pair] || {};
		let constructedData = data.map((value, index) => {
			// let temp = data[index - 1] ? data[index - 1] : {};
			let tempRate = data[index + 1] ? data[index + 1] : {};
			let isSameBefore = tempRate.price === value.price;
			let upDownRate = value.price - (tempRate.price || 0);
			let price = formatToCurrency(value.price, pairData.increment_price);
			return { ...value, isSameBefore, upDownRate, price };
		});
		this.setState({ data: constructedData });
	};

	render() {
		const { data } = this.state;
		return (
			<div className="flex-auto d-flex apply_rtl trade_history-wrapper">
				<DisplayTable headers={this.state.headers} data={data} />
			</div>
		);
	}
}

TradeHistory.defaultProps = {
	data: []
};

const mapStateToProps = (store) => ({
	pair: store.app.pair,
	pairs: store.app.pairs,
	data: tradeHistorySelector(store)
});

export default connect(mapStateToProps)(TradeHistory);
