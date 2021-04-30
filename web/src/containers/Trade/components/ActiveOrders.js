import React from 'react';
import classnames from 'classnames';
import math from 'mathjs';

import { Table, ActionNotification } from '../../../components';
import { getFormatTimestamp } from '../../../utils/utils';
import { formatBaseAmount, formatToCurrency } from '../../../utils/currency';
import { isMobile } from 'react-device-detect';
import { subtract } from '../utils';
import STRINGS from '../../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const generateHeaders = (pairData = {}, onCancel, onCancelAll, ICONS) => [
	{
		label: STRINGS['PAIR'],
		key: 'pair',
		exportToCsv: ({ symbol }) => symbol.toUpperCase(),
		renderCell: ({ symbol }, key, index) => {
			return (
				<td key={index} className="text-uppercase">
					{symbol}
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
	{
		label: STRINGS['TIME'],
		key: 'created_At',
		renderCell: ({ created_at = '' }, key, index) => {
			return <td key={index}>{getFormatTimestamp(created_at)}</td>;
		},
	},
	{
		label: STRINGS['PRICE'],
		key: 'price',
		renderCell: ({ price = 0 }, key, index) => {
			return (
				<td key={index}>{formatToCurrency(price, pairData.increment_price)}</td>
			);
		},
	},
	{
		label: STRINGS['AMOUNT'],
		key: 'size',
		exportToCsv: ({ size = 0 }) => size,
		renderCell: ({ size = 0, ...rest }, key, index) => {
			return (
				<td key={index}>{formatToCurrency(size, pairData.increment_size)}</td>
			);
		},
	},
	{
		label: STRINGS['REMAINING'],
		key: 'remaining',
		renderCell: ({ size = 0, filled = 0 }, key, index) => {
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
	{
		label: STRINGS['TRIGGER_CONDITIONS'],
		key: 'type',
		exportToCsv: ({ stop }) =>
			stop && formatToCurrency(stop, pairData.increment_price),
		renderCell: ({ stop }, key, index) => {
			return (
				<td key={index} className="px-2">
					{stop && formatToCurrency(stop, pairData.increment_price)}
				</td>
			);
		},
	},
	{
		label: (
			<span className="trade__active-orders_cancel-All">
				<ActionNotification
					stringId="CANCEL_ALL"
					text={STRINGS['CANCEL_ALL']}
					iconId="CANCEL_CROSS_ACTIVE"
					iconPath={ICONS['CANCEL_CROSS_ACTIVE']}
					onClick={() => onCancelAll()}
					status="information"
					textPosition="left"
				/>
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
	pairData,
	orders,
	onCancel,
	onCancelAll,
	maxHeight,
	height,
	cancelDelayData,
	icons: ICONS,
}) => {
	return (
		<div
			className={
				height && maxHeight && height > maxHeight
					? 'trade_active_orders-wrapper trade_active-lg-view'
					: 'trade_active_orders-wrapper'
			}
		>
			<Table
				headers={generateHeaders(pairData, onCancel, onCancelAll, ICONS)}
				cancelDelayData={cancelDelayData}
				data={orders}
				count={orders.length}
				showAll={true}
				displayPaginator={false}
				rowKey={(data) => {
					return data.id;
				}}
			/>
		</div>
	);
};

ActiveOrders.defaultProps = {
	orders: [],
	onCancel: () => {},
};
export default withConfig(ActiveOrders);
