import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { DisplayTable, EditWrapper } from 'components';
import { getFormatTimestamp } from 'utils/utils';
import STRINGS from 'config/localizedStrings';
import { formatToCurrency } from '../../../utils/currency';
// import { roundNumber } from '../../../utils/currency';
// import { getDecimals } from '../../../utils/utils';
import { tradeHistorySelector } from '../utils';
import withConfig from 'components/ConfigProvider/withConfig';
import { calcPercentage } from 'utils/math';
import { Select } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import math from 'mathjs';
import { opacifyNumber } from 'helpers/opacify';
import debounce from 'lodash.debounce';

const { Option } = Select;

class TradeHistory extends Component {
	state = {
		headers: [],
		data: [],
		isprevious: false,
		isBase: true,
		isOpen: false,
		isLoading: true,
	};

	UNSAFE_componentWillMount() {
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

	componentWillUnmount() {
		if (this.setIsLoading) {
			this.setIsLoading.cancel();
		}
	}

	calculateHeaders = () => {
		const headers = this.generateHeaders(this.props.pairs[this.props.pair]);
		this.setState({ headers });
	};

	setIsLoading = debounce(() => this.setState({ isLoading: false }), 250);

	generateData = (data) => {
		this.setState({ isLoading: true });
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
		this.setIsLoading();
	};

	onSelect = (isBase) => this.setState({ isBase });

	dropdownVisibleChange = (isOpen) => {
		this.setState({ isOpen });
	};

	generateHeaders = (pairs) => {
		const { icons: ICONS, maxAmount } = this.props;
		const { isBase, isOpen } = this.state;
		const { pairData } = this.props;
		const { pair_base_display, pair_2_display } = pairData;

		return [
			{
				key: 'price',
				label: (
					<div className="d-flex justify-content-start">
						<EditWrapper stringId="PRICE">{STRINGS['PRICE']}</EditWrapper>
					</div>
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
						<EditWrapper stringId="SIZE">{STRINGS['SIZE']}</EditWrapper>
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
								<Option value={false}>{pair_2_display}</Option>
								<Option value={true}>{pair_base_display}</Option>
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
							{opacifyNumber(isBase ? size : sizePrice, {
								zerosClassName: 'public-sale_zeros',
								digitsClassName: 'public-sale_digits',
							})}
						</div>
					);
				},
			},
			{
				key: 'timestamp',
				label: (
					<div className="d-flex justify-content-end">
						<EditWrapper stringId="TIME">{STRINGS['TIME']}</EditWrapper>
					</div>
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
					cssTransitionClassName="trade-history-record"
					loading={this.state.isLoading}
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
	};
};

export default connect(mapStateToProps)(withConfig(TradeHistory));
