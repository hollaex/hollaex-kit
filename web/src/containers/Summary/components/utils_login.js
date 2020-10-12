import React from 'react';
import moment from 'moment';
import ReactSvg from 'react-svg';
import { Link } from 'react-router';
import classnames from 'classnames';

import STRINGS from '../../../config/localizedStrings';
import { BASE_CURRENCY, ICONS } from '../../../config/constants';

export const generateWaveHeaders = (onCancel) => [
	{
		label: STRINGS.SUMMARY.WAVE_NUMBER,
		key: 'id',
		renderCell: ({ no = 0, status = '' }, key, index) => {
			return (
				<td
					key={index}
					className={classnames({
						'wave-phase-completed': status === true,
						'wave-phase-pending': status === false
					})}
				>
					<div className="d-flex">
						<ReactSvg
							path={ICONS.INCOMING_WAVE}
							wrapperClassName="wave-auction-icon"
						/>
						<div className="ml-1">{no}</div>
					</div>
				</td>
			);
		}
	},
	{
		label: STRINGS.AMOUNT,
		key: 'amount',
		renderCell: ({ amount = '', status = '' }, key, index) => {
			return (
				<td
					key={index}
					className={classnames({
						'wave-phase-completed': status === true,
						'wave-phase-pending': status === false
					})}
				>
					{amount}
				</td>
			);
		}
	},
	{
		label: STRINGS.FILLED,
		key: 'filled',
		renderCell: ({ filled = 0, status = '' }, key, index) => {
			return (
				<td
					key={index}
					className={classnames({
						'wave-phase-completed': status === true,
						'wave-phase-pending': status === false
					})}
				>
					{filled}
				</td>
			);
		}
	},
	{
		label: STRINGS.formatString(
			STRINGS.LOWEST_PRICE,
			BASE_CURRENCY.toUpperCase()
		).join(''),
		key: 'low',
		renderCell: ({ low = 0, status = '' }, key, index) => {
			return status === 'TBA' ? (
				<td key={index}>{low}</td>
			) : status === true ? (
				<td key={index} className="wave-phase-completed">
					{low}
				</td>
			) : (
				<td key={index} className="wave-phase-pending">
					{STRINGS.PENDING}
				</td>
			);
		}
	},
	{
		label: STRINGS.PHASE,
		key: 'phase',
		renderCell: ({ phase = 0, status = '' }, key, index) => {
			return (
				<td
					key={index}
					className={classnames({
						'wave-phase-completed': status === true,
						'wave-phase-pending': status === false
					})}
				>
					{phase}
				</td>
			);
		}
	},
	{
		label: STRINGS.STATUS,
		key: 'status',
		renderCell: ({ status = '', updated_at = '' }, key, index) => {
			let statusTxt =
				status === true
					? STRINGS.USER_VERIFICATION.COMPLETED
					: STRINGS.INCOMING;
			let updated =
				status === true ? (
					`(${moment(updated_at).format('MMMM Do YYYY, hh:mm:ss')})`
				) : (
					<Link className="blue-link" to="/trade/xht-usdt">
						({STRINGS.GO_TRADE})
					</Link>
				);
			return status === 'TBA' ? (
				<td key={index}>{status}</td>
			) : (
				<td
					key={index}
					className={classnames({
						'wave-phase-completed': status === true,
						'wave-phase-pending': status === false
					})}
				>
					{statusTxt} {updated}
				</td>
			);
		}
	}
];
