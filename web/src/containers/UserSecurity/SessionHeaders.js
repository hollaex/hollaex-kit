import React from 'react';
import classnames from 'classnames';
import { PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons';
import { EditWrapper, Image, Tooltip } from 'components';
import STRINGS from 'config/localizedStrings';
import { getFormatTimestamp } from 'utils/utils';

export const generateHeaders = (revokeSession, ICONS = {}) => {
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
			renderCell: ({ meta, id, status }, key) => (
				<td key={`${key}-${id}-status`} className={classnames('text-center')}>
					<div className="d-flex justify-content-center">
						{meta?.is_sharedaccount && (
							<Tooltip
								className="account-tab-options-tooltip mr-2"
								overlayClassName="account-tab-options-tooltip ml-2"
								text={STRINGS?.['ACCOUNT_SHARING.SHARED_ACCOUNT_TOOLTIP']}
								placement="bottom"
								arrow={false}
							>
								<div>
									<Image
										iconId="ACCOUNT_SHARING_SHARED_ACCOUNT_BY_YOU"
										icon={ICONS?.['ACCOUNT_SHARING_SHARED_ACCOUNT_BY_YOU']}
										svgWrapperClassName="shared-account-icon-session-table"
									/>
								</div>
							</Tooltip>
						)}
						<div
							className={`mx-2 status-label ${
								meta?.is_sharedaccount ? 'ml-0 ' : 'pl-3'
							}`}
						>
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
