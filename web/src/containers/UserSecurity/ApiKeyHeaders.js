import React from 'react';
import Image from 'components/Image';
import classnames from 'classnames';
import STRINGS from '../../config/localizedStrings';
import { getFormatTimestamp } from '../../utils/utils';
import { Tooltip } from '../../components';

const NOT_REVOKED = 'pointer blue-link';

export const generateHeaders = (revokeToken, otp_enabled, ICONS) => {
	return [
		{
			label: '',
			key: 'icon',
			renderCell: ({ revoked }, key, index) => (
				<td
					key={key}
					className={classnames('tokens-icon', { 'small-icon': !revoked })}
				>
					<Image
						iconId={revoked ? 'TOKEN_REVOKED' : 'TOKEN_ACTIVE'}
						icon={revoked ? ICONS['TOKEN_REVOKED'] : ICONS['TOKEN_ACTIVE']}
						wrapperClassName="tokens-icon-svg"
					/>
				</td>
			),
		},
		{
			stringId: 'DEVELOPERS_TOKENS_TABLE.NAME',
			label: STRINGS['DEVELOPERS_TOKENS_TABLE.NAME'],
			key: 'name',
			className: 'tokens-name',
			renderCell: ({ id, name }, key, index) => (
				<td key={`${key}-${id}-name`} className="tokens-name">
					{name}
				</td>
			),
		},
		{
			stringId: 'DEVELOPERS_TOKENS_TABLE.API_KEY',
			label: STRINGS['DEVELOPERS_TOKENS_TABLE.API_KEY'],
			key: 'apiKey',
			className: 'text-center tokens-tokenkey',
			renderCell: ({ id, apiKey }, key, index) => (
				<td key={`${key}-${id}-token`} className="text-center tokens-tokenkey">
					{apiKey}
				</td>
			),
		},
		{
			stringId: 'DEVELOPERS_TOKENS_TABLE.SECRET',
			label: STRINGS['DEVELOPERS_TOKENS_TABLE.SECRET'],
			key: 'secret',
			className: 'text-center tokens-tokenkey',
			renderCell: ({ id, secret }, key, index) => (
				<td key={`${key}-${id}-secret`} className="text-center tokens-tokenkey">
					{secret}
				</td>
			),
		},
		{
			stringId: 'DEVELOPERS_TOKENS_TABLE.CREATED',
			label: STRINGS['DEVELOPERS_TOKENS_TABLE.CREATED'],
			key: 'created',
			className: 'tokens-cell tokens-date',
			renderCell: ({ id, created }, key, index) => (
				<td key={`${key}-${id}-date`} className="tokens-date">
					{getFormatTimestamp(created)}
				</td>
			),
		},
		{
			stringId:
				'DEVELOPERS_TOKENS_TABLE.REVOKE,DEVELOPERS_TOKENS_TABLE.REVOKED,DEVELOPERS_TOKENS_TABLE.REVOKE_TOOLTIP',
			label: STRINGS['DEVELOPERS_TOKENS_TABLE.REVOKE'],
			key: 'revoke',
			className: 'text-center tokens-revoke',
			renderCell: ({ id, revoked }, key, index) => (
				<td
					key={`${key}-${id}-revoked`}
					className={classnames(
						'text-center',
						revoked || !otp_enabled ? '' : NOT_REVOKED,
						{
							'text-uppercase': !revoked,
							'token-no-otp': !revoked && !otp_enabled,
						}
					)}
					onClick={!revoked && otp_enabled ? () => revokeToken(id) : () => {}}
				>
					{revoked ? (
						STRINGS['DEVELOPERS_TOKENS_TABLE.REVOKED']
					) : otp_enabled ? (
						STRINGS['DEVELOPERS_TOKENS_TABLE.REVOKE']
					) : (
						<Tooltip
							text={STRINGS['DEVELOPERS_TOKENS_TABLE.REVOKE_TOOLTIP']}
							className="light-theme"
						>
							<div>{STRINGS['DEVELOPERS_TOKENS_TABLE.REVOKE']}</div>
						</Tooltip>
					)}
				</td>
			),
		},
	];
};
