import React from 'react';
import { getFormatTimestamp } from '../../utils/utils';
import STRINGS from '../../config/localizedStrings';

export const generateLogins = () => {
	return [
		{
			label: STRINGS['ACCOUNT_SECURITY.LOGIN.IP_ADDRESS'],
			key: 'ip',
			renderCell: ({ ip }, key, index) => {
				return <td key={index}>{ip}</td>;
			},
		},
		{
			label: STRINGS['ACCOUNT_SECURITY.LOGIN.TIME'],
			key: 'timestamp',
			renderCell: ({ timestamp }, key, index) => {
				return <td key={index}>{getFormatTimestamp(timestamp)}</td>;
			},
		},
	];
};
