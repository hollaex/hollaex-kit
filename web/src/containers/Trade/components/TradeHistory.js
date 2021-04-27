import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { DisplayTable } from '../../../components';
import { getFormatTimestamp } from '../../../utils/utils';
import STRINGS from '../../../config/localizedStrings';
import { formatToCurrency } from '../../../utils/currency';
import { DEFAULT_COIN_DATA } from 'config/constants';
// import { roundNumber } from '../../../utils/currency';
// import { getDecimals } from '../../../utils/utils';
import { tradeHistorySelector } from '../utils';
import withConfig from 'components/ConfigProvider/withConfig';
import { calcPercentage } from 'utils/math';
import { Select } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import math from 'mathjs';

const { Option } = Select;

class TradeHistory extends Component {
	state = {
		headers: [],
		data: [],
		isprevious: false,
		isBase: true,
		isOpen: false,
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

	componentDidUpdate(prevProps, prevState) {
		if (JSON.stringify(this.props.data) !== JSON.stringify(prevProps.data)) {
			this.generateData(this.props.data);
		}

		if (
			prevState.isBase !== this.state.isBase ||
			prevState.isOpen !== this.state.isOpen
		) {
			this.calculateHeaders();
		}
	}

	calculateHeaders = () => {
		const headers = this.generateHeaders(this.props.pairs[this.props.pair]);
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
			const sizePrice = formatToCurrency(
				math.multiply(math.fraction(value.size), math.fraction(value.price)),
				pairData.increment_price
			);
			return { ...value, isSameBefore, upDownRate, price, sizePrice };
		});
		this.setState({ data: constructedData });
	};

	onSelect = (isBase) => this.setState({ isBase });

	dropdownVisibleChange = (isOpen) => {
		this.setState({ isOpen });
	};

	generateHeaders = (pairs) => {
		const { icons: ICONS, maxAmount } = this.props;
		const { isBase, isOpen } = this.state;
		const { coins, pairData } = this.props;
		const pairBase = pairData.pair_base.toUpperCase();
		const { symbol } = coins[pairData.pair_2] || DEFAULT_COIN_DATA;

		return [
			{
				key: 'price',
				label: (
					<div className="d-flex justify-content-start">{STRINGS['PRICE']}</div>
				),
				renderCell: (
					{ side, price = 0, isSameBefore, upDownRate, timestamp },
					index
				) => {
					const isArrow = upDownRate < 0;
					return (
						<div
							className={classnames('trade_history-row d-flex flex-row', side)}
							key={`time-${index}`}
						>
							{!isSameBefore ? (
								<ReactSVG
									src={isArrow ? ICONS['ARROW_DOWN'] : ICONS['ARROW_UP']}
									className={'trade_history-icon'}
								/>
							) : (
								<div className="trade_history-icon" />
							)}
							{price}
						</div>
					);
				},
			},
			{
				key: 'size',
				label: (
					<div className="d-flex align-items-baseline content-center public-history__header">
						<div>{STRINGS['SIZE']}</div>
						<div>
							<Select
								bordered={false}
								defaultValue={false}
								size="small"
								suffixIcon={
									<CaretDownOutlined
										onClick={() => this.dropdownVisibleChange(!isOpen)}
									/>
								}
								value={isBase}
								onSelect={this.onSelect}
								open={isOpen}
								onDropdownVisibleChange={this.dropdownVisibleChange}
								className="custom-select-input-style order-entry no-border"
								dropdownClassName="custom-select-style trade-select-option-wrapper"
								dropdownStyle={{ minWidth: '7rem' }}
							>
								<Option value={false}>{symbol.toUpperCase()}</Option>
								<Option value={true}>{pairBase}</Option>
							</Select>
						</div>
					</div>
				),
				renderCell: ({ size = 0, side, sizePrice = 0 }, index) => {
					const fillClassName = `fill fill-${side}`;
					const fillStyle = {
						backgroundSize: `${calcPercentage(size, maxAmount)}% 100%`,
					};

					return (
						<div
							className={classnames('trade_history-row', side, fillClassName)}
							style={fillStyle}
							key={`size-${index}`}
						>
							{isBase ? size : sizePrice}
						</div>
					);
				},
			},
			{
				key: 'timestamp',
				label: (
					<div className="d-flex justify-content-end">{STRINGS['TIME']}</div>
				),
				renderCell: ({ timestamp, side }, index) => (
					<div
						className={classnames('trade_history-row', side)}
						key={`timestamp-${index}`}
					>
						{getFormatTimestamp(timestamp, STRINGS['HOUR_FORMAT'])}
					</div>
				),
			},
		];
	};

	render() {
		const { data } = this.state;
		return (
			<div className="flex-auto d-flex  apply_rtl trade_history-wrapper">
				<DisplayTable
					headers={this.state.headers}
					data={data}
					// rowClassName="trade_history-row-wrapper"
				/>
			</div>
		);
	}
}

TradeHistory.defaultProps = {
	data: [],
};

const mapStateToProps = (store) => {
	const { data, maxAmount } = tradeHistorySelector(store);
	return {
		pair: store.app.pair,
		pairs: store.app.pairs,
		data,
		maxAmount,
		coins: store.app.coins,
	};
};

export default connect(mapStateToProps)(withConfig(TradeHistory));
