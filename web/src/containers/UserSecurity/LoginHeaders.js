import React, { Fragment } from 'react';
import STRINGS from 'config/localizedStrings';
import { PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons';
import { getFormatTimestamp } from 'utils/utils';
import { IntensityBar } from 'components';
import { getCountry } from 'containers/Verification/utils';

export const generateHeaders = () => {
	return [
		{
			key: 'icon',
			className: 'sticky-col expander-handle',
			renderCell: (_, key, index, isExpandable, isExpanded) => {
				return (
					<td key={index}>
						<div className="d-flex">
							{isExpanded ? <MinusSquareOutlined /> : <PlusSquareOutlined />}
						</div>
					</td>
				);
			},
		},
		{
			stringId: 'LOGINS_HISTORY.CONTENT.TABLE.HEADER.LAST_SEEN.TITLE',
			label: STRINGS['LOGINS_HISTORY.CONTENT.TABLE.HEADER.LAST_SEEN.TITLE'],
			key: 'timestamp',
			className: 'session-login-date',
			renderCell: ({ timestamp }, key) => (
				<td key={`${key}-${timestamp}-date`} className="tokens-date">
					{getFormatTimestamp(timestamp)}
				</td>
			),
		},
		{
			stringId: 'LOGINS_HISTORY.CONTENT.TABLE.HEADER.FAILED_ATTEMPTS',
			label: STRINGS['LOGINS_HISTORY.CONTENT.TABLE.HEADER.FAILED_ATTEMPTS'],
			key: 'attempt',
			className: '',
			renderCell: ({ timestamp, attempt, status }, key) => (
				<td key={`${key}-${timestamp}-attempt`} className="text-center">
					<div className="d-flex align-center">
						{!!attempt && status === false ? (
							<Fragment>
								<div className="px-1">
									{STRINGS.formatString(
										STRINGS['LOGINS_HISTORY.CONTENT.TABLE.CELL.FAILED_LOGIN'],
										attempt
									)}
								</div>
								<IntensityBar count={attempt} />
							</Fragment>
						) : (
							<Fragment>
								<div>✓</div>
								<div className="px-2">
									{STRINGS['LOGINS_HISTORY.CONTENT.TABLE.CELL.SUCCESS']}
								</div>
							</Fragment>
						)}
					</div>
				</td>
			),
		},
		{
			stringId: 'LOGINS_HISTORY.CONTENT.TABLE.HEADER.COUNTRY',
			label: STRINGS['LOGINS_HISTORY.CONTENT.TABLE.HEADER.COUNTRY'],
			key: 'country',
			className: '',
			renderCell: ({ country, timestamp }, key) => {
				const { name, flag } = getCountry(country);
				return (
					<td key={`${key}-${timestamp}-country`} className="text-center">
						<div className="d-flex">
							{country && (
								<Fragment>
									<div>{flag}</div>
									<div className="px-1">{name}</div>
								</Fragment>
							)}
						</div>
					</td>
				);
			},
		},
		{
			stringId: 'LOGINS_HISTORY.CONTENT.TABLE.HEADER.IP_ADDRESS',
			label: STRINGS['LOGINS_HISTORY.CONTENT.TABLE.HEADER.IP_ADDRESS'],
			key: 'ip',
			className: '',
			renderCell: ({ timestamp, ip }, key) => (
				<td key={`${key}-${timestamp}-ip`}>{ip}</td>
			),
		},
	];
};
