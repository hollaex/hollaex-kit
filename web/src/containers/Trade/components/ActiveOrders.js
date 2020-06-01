import React from 'react';
import classnames from 'classnames';
import math from 'mathjs';

import { ICONS } from '../../../config/constants';
import { Table, ActionNotification } from '../../../components';
import { getFormatTimestamp } from '../../../utils/utils';
import {
	formatBaseAmount,
	formatToCurrency
} from '../../../utils/currency';
import { isMobile } from 'react-device-detect';
import { subtract } from '../utils';
import STRINGS from '../../../config/localizedStrings';

const generateHeaders = (pairData = {}, onCancel) => [
	{
		label: STRINGS.PAIR,
		key: 'pair',
		exportToCsv: ({ symbol }) => symbol.toUpperCase(),
		renderCell: ({ symbol }, key, index) => {
			return (
				<td key={index} className="text-uppercase">
					{symbol}
				</td>
			);
		}
	},
	{
		label: STRINGS.SIDE,
		key: 'side',
		renderCell: ({ side = '' }, key, index) => {
			return (
				<td key={index} className={classnames('cell_box-type')}>
					<div className={classnames(side)}>
						{STRINGS.SIDES_VALUES[side]}
					</div>
				</td>
			);
		}
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
		label: STRINGS.TIME,
		key: 'created_At',
		renderCell: ({ created_at = '' }, key, index) => {
			return <td key={index}>{getFormatTimestamp(created_at)}</td>;
		}
	},
	{
		label: STRINGS.PRICE,
		key: 'price',
		renderCell: ({ price = 0 }, key, index) => {
			return <td key={index}>{formatToCurrency(price, pairData.increment_price)}</td>;
		}
	},
	{
		label: STRINGS.AMOUNT,
		key: 'size',
		exportToCsv: ({ size = 0 }) => size,
		renderCell: ({ size = 0, ...rest }, key, index) => {
			return <td key={index}>{formatToCurrency(size, pairData.increment_size)}</td>;
		}
	},
	{
		label: STRINGS.REMAINING,
		key: 'remaining',
		renderCell: ({ size = 0, filled = 0 }, key, index) => {
			return <td key={index}>{formatToCurrency(subtract(size, filled), pairData.increment_price)}</td>;
		}
	},
	!isMobile && {
		label: STRINGS.STATUS,
		key: 'status',
		renderCell: ({ size = 0, filled = 0 }, key, index) => {
			const fullfilled = formatBaseAmount(
				math
					.chain(filled)
					.divide(size)
					.multiply(100)
					.done()
			);
			return (
				<td
					key={index}
					className={classnames('cell_box-type', 'fullfilled')}
				>
					<div className="cell-wrapper">
						<div className="cell_value-wrapper text_overflow">
							{STRINGS.formatString(STRINGS.FULLFILLED, fullfilled)}
							<span
								className="cell_value-bar"
								style={{ width: `${fullfilled}%` }}
							/>
						</div>
					</div>
				</td>
			);
		}
	},
	{
		label: STRINGS.CANCEL,
		key: 'cancel',
		renderCell: ({ size = 0, filled = 0, id }, key, index) => {
			return (
				<td key={index} style={{ position: 'relative' }}>
					<ActionNotification
						text={STRINGS.CANCEL}
						iconPath={ICONS.CANCEL_CROSS_ACTIVE}
						onClick={() => onCancel(id)}
						className="relative"
						status="information"
						textPosition="left"
						useSvg={true}
						showActionText={true}
					/>
				</td>
			);
		}
	}
];

const ActiveOrders = ({
	pairData,
	orders,
	onCancel,
	maxHeight,
	height,
	cancelDelayData
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
				headers={generateHeaders(pairData, onCancel)}
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
	onCancel: () => {}
};
export default ActiveOrders;
