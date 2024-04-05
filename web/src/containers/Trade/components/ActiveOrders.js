import React, { useState } from 'react';
import classnames from 'classnames';
import math from 'mathjs';
import { CaretUpOutlined, CaretDownFilled } from '@ant-design/icons';

import { Table, ActionNotification, Coin } from 'components';
import { getFormatTimestamp } from 'utils/utils';
import { formatBaseAmount, formatToCurrency } from 'utils/currency';
import { isMobile } from 'react-device-detect';
import { subtract } from '../utils';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const rendercaret = (label, onHandleClick) => {
	return (
		<div className="d-flex mt-2">
			{STRINGS[label]}
			<div className="d-flex flex-column mx-2">
				<CaretUpOutlined onClick={() => onHandleClick('caretUp', label)} />
				<CaretDownFilled onClick={() => onHandleClick('caretDown', label)} />
			</div>
		</div>
	);
};

const generateHeaders = (
	pairs = {},
	onCancel,
	onCancelAll,
	ICONS,
	activeOrdersMarket,
	orders,
	onHandleClick
) => [
	{
		stringId: 'PAIR',
		label: STRINGS['PAIR'],
		key: 'pair',
		exportToCsv: ({ display_name }) => display_name,
		renderCell: ({ display_name, icon_id }, key, index) => {
			return (
				<td key={index} className="text-uppercase">
					<div className="d-flex align-items-center">
						<Coin iconId={icon_id} type="CS7" />
						<div>{display_name}</div>
					</div>
				</td>
			);
		},
	},
	{
		label: STRINGS['ORDER_TYPE'],
		key: 'type',
		exportToCsv: ({ type, stop }) => (stop ? `Stop ${type}` : type),
		renderCell: ({ type, stop }, key, index) => {
			return <td key={index}>{stop ? `Stop ${type}` : type}</td>;
		},
	},
	{
		label: STRINGS['SIDE'],
		key: 'side',
		renderCell: ({ side = '' }, key, index) => {
			return (
				<td key={index} className={classnames('cell_box-type')}>
					<div className={classnames(side)}>
						{STRINGS[`SIDES_VALUES.${side}`]}
					</div>
				</td>
			);
		},
	},
	// {
	//   label: 'Type',
	//   key: 'type',
	//   renderCell: ({ type = '' }, key, index) => {
	//     return (
	//       <td key={index} className="text-capitalize">{type || 'market'}</td>
	//     );
	//   },
	// },
	!isMobile && {
		label: rendercaret('TIME', onHandleClick),
		key: 'created_At',
		renderCell: ({ created_at = '' }, key, index) => {
			return <td key={index}>{getFormatTimestamp(created_at)}</td>;
		},
	},
	{
		label: rendercaret('PRICE', onHandleClick),
		key: 'price',
		renderCell: ({ price = 0, symbol }, key, index) => {
			let pairData = pairs[symbol] || {};
			return (
				<td key={index}>{formatToCurrency(price, pairData.increment_price)}</td>
			);
		},
	},
	{
		label: STRINGS['SIZE'],
		key: 'size',
		exportToCsv: ({ size = 0 }) => size,
		renderCell: ({ size = 0, symbol }, key, index) => {
			let pairData = pairs[symbol] || {};
			return (
				<td key={index}>{formatToCurrency(size, pairData.increment_size)}</td>
			);
		},
	},
	{
		label: STRINGS['REMAINING'],
		key: 'remaining',
		renderCell: ({ size = 0, filled = 0, symbol }, key, index) => {
			let pairData = pairs[symbol] || {};
			return (
				<td key={index}>
					{formatToCurrency(subtract(size, filled), pairData.increment_size)}
				</td>
			);
		},
	},
	!isMobile && {
		label: STRINGS['STATUS'],
		key: 'status',
		renderCell: ({ size = 0, filled = 0 }, key, index) => {
			const fullfilled = formatBaseAmount(
				math.chain(filled).divide(size).multiply(100).done()
			);
			return (
				<td key={index} className={classnames('cell_box-type', 'fullfilled')}>
					<div className="cell-wrapper">
						<div className="cell_value-wrapper text_overflow">
							{STRINGS.formatString(STRINGS['FULLFILLED'], fullfilled)}
							<span
								className="cell_value-bar"
								style={{ width: `${fullfilled}%` }}
							/>
						</div>
					</div>
				</td>
			);
		},
	},
	!isMobile && {
		label: STRINGS['TRIGGER_CONDITIONS'],
		key: 'type',
		exportToCsv: ({ stop, symbol }) => {
			let pairData = pairs[symbol] || {};
			return stop && formatToCurrency(stop, pairData.increment_price);
		},
		renderCell: ({ stop, symbol }, key, index) => {
			let pairData = pairs[symbol] || {};
			return (
				<td key={index} className="px-2">
					{stop && formatToCurrency(stop, pairData.increment_price)}
				</td>
			);
		},
	},
	{
		label: !isMobile ? (
			<span className="trade__active-orders_cancel-All">
				<ActionNotification
					stringId="CANCEL_ALL"
					text={STRINGS['CANCEL_ALL']}
					iconId="CANCEL_CROSS_ACTIVE"
					iconPath={ICONS['CANCEL_CROSS_ACTIVE']}
					onClick={() => onCancelAll()}
					status="information"
					textPosition="left"
					disable={activeOrdersMarket === ''}
				/>
			</span>
		) : (
			<span className="trade__active-orders_cancel-All">
				{STRINGS['CANCEL']}
			</span>
		),
		key: 'cancel',
		className: 'trade__active-orders-header_cancel-All',
		renderCell: ({ size = 0, filled = 0, id }, key, index) => {
			return (
				<td key={index} style={{ position: 'relative' }}>
					<ActionNotification
						stringId="CANCEL"
						text={STRINGS['CANCEL']}
						iconId="CANCEL_CROSS_ACTIVE"
						iconPath={ICONS['CANCEL_CROSS_ACTIVE']}
						onClick={() => onCancel(id)}
						className="relative"
						status="information"
						textPosition="left"
						showActionText={true}
					/>
				</td>
			);
		},
	},
];

const ActiveOrders = ({
	pairs,
	orders,
	onCancel,
	onCancelAll,
	maxHeight,
	height,
	cancelDelayData,
	icons: ICONS,
	activeOrdersMarket,
	pageSize,
}) => {
	const [filteredOrders, setFilteredOrders] = useState([...orders]);

	const onHandleClick = (type, label) => {
		const filteredData = filteredOrders.sort((a, b) => {
			if (label === 'TIME') {
				return type === 'caretUp'
					? new Date(a.created_at) - new Date(b.created_at)
					: new Date(b.created_at) - new Date(a.created_at);
			} else {
				return type === 'caretUp' ? a.price - b.price : b.price - a.price;
			}
		});
		setFilteredOrders((prev) => [...prev, ...filteredData]);
	};

	return (
		<div
			className={
				height && maxHeight && height > maxHeight
					? 'trade_active_orders-wrapper trade_active-lg-view'
					: 'trade_active_orders-wrapper'
			}
		>
			<Table
				headers={generateHeaders(
					pairs,
					onCancel,
					onCancelAll,
					ICONS,
					activeOrdersMarket,
					orders,
					onHandleClick
				)}
				cancelDelayData={cancelDelayData}
				data={filteredOrders}
				count={orders.length}
				showAll={true}
				displayPaginator={false}
				rowKey={(data) => {
					return data.id;
				}}
				pageSize={pageSize}
				cssTransitionClassName="general-record"
			/>
		</div>
	);
};

ActiveOrders.defaultProps = {
	orders: [],
	onCancel: () => {},
};
export default withConfig(ActiveOrders);
