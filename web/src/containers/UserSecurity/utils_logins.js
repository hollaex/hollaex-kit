import React  from 'react';
import { getFormatTimestamp } from '../../utils/utils';

export const generateLogins = () => {
	return [
		{
			label: "IP Address",
			key: 'ip',
			renderCell: ({ ip }, key, index) => {
				return <td key={index}>{ip}</td>;
			}
		},

		{
			label: "Country",
			key: 'ip',
			renderCell: ({ ip }, key, index) => {
				return <td key={index} >{ip}</td>;
			}
		},

		{
			label: "Date/Time",
			key: 'timestamp',
			renderCell: ({ timestamp }, key, index) => {
				return <td key={index}>{getFormatTimestamp(timestamp)}</td>;
			}
		}

	];
};
