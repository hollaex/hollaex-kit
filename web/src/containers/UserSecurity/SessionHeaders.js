import React from 'react';
import classnames from 'classnames';
import { PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons';
import { EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import { getFormatTimestamp } from 'utils/utils';

export const generateHeaders = (revokeSession) => {
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
			stringId: 'SESSIONS.CONTENT.TABLE.HEADER.LAST_SEEN.TITLE',
			label: STRINGS['SESSIONS.CONTENT.TABLE.HEADER.LAST_SEEN.TITLE'],
			key: 'last_seen',
			className: 'session-login-date',
			renderCell: ({ id, last_seen }, key) => (
				<td key={`${key}-${id}-last_seen`} className="tokens-date">
					{getFormatTimestamp(last_seen)}
				</td>
			),
		},
		{
			stringId: 'SESSIONS.CONTENT.TABLE.HEADER.SESSION_STARTED',
			label: STRINGS['SESSIONS.CONTENT.TABLE.HEADER.SESSION_STARTED'],
			key: 'created_at',
			className: 'session-login-date',
			renderCell: ({ id, created_at }, key) => (
				<td key={`${key}-${id}-created_at`} className="tokens-date">
					{getFormatTimestamp(created_at)}
				</td>
			),
		},
		{
			stringId: 'SESSIONS.CONTENT.TABLE.HEADER.SESSION_EXPIRY',
			label: STRINGS['SESSIONS.CONTENT.TABLE.HEADER.SESSION_EXPIRY'],
			key: 'expiry_date',
			className: 'session-login-date',
			renderCell: ({ id, expiry_date }, key) => (
				<td key={`${key}-${id}-expiry_date`} className="tokens-date">
					{getFormatTimestamp(expiry_date)}
				</td>
			),
		},
		{
			stringId: 'SESSIONS.CONTENT.TABLE.HEADER.STATUS',
			label: STRINGS['SESSIONS.CONTENT.TABLE.HEADER.STATUS'],
			key: 'status',
			className: 'text-center',
			renderCell: ({ id, status }, key) => (
				<td key={`${key}-${id}-status`} className={classnames('text-center')}>
					<div className="d-flex justify-content-center">
						<div className="mx-2">
							<EditWrapper stringId="SESSIONS.CONTENT.TABLE.CELL.ACTIVE,SESSIONS.CONTENT.SUBTITLE.LINK">
								{STRINGS['SESSIONS.CONTENT.TABLE.CELL.ACTIVE']}
							</EditWrapper>
						</div>
						<div
							className="pointer blue-link underline-text mx-2"
							onClick={status ? () => revokeSession(id) : () => {}}
						>
							{STRINGS['SESSIONS.CONTENT.SUBTITLE.LINK']}
						</div>
					</div>
				</td>
			),
		},
	];
};
