import React from 'react';
import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';
import { formatTimestamp } from '../../utils/utils';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

const NOT_REVOKED = 'pointer blue-link';

export const generateHeaders = (revokeToken, otp_enabled) => {
	return [
		{
			label: '',
			key: 'icon',
			renderCell: ({ revoked }, key, index) => (
				<td
					key={key}
					className={classnames('tokens-icon', { 'small-icon': !revoked })}
				>
					<ReactSVG
						path={revoked ? ICONS.TOKEN_REVOKED : ICONS.TOKEN_ACTIVE}
						wrapperClassName="tokens-icon-svg"
					/>
				</td>
			)
		},
		{
			label: STRINGS.DEVELOPERS_TOKENS_TABLE.NAME,
			key: 'name',
			className: 'tokens-name',
			renderCell: ({ id, name }, key, index) => (
				<td key={`${key}-${id}-name`} className="tokens-name">
					{name}
				</td>
			)
		},
		{
			label: STRINGS.DEVELOPERS_TOKENS_TABLE.API_KEY,
			key: 'apikey',
			className: 'text-center tokens-tokenkey',
			renderCell: ({ id, token }, key, index) => (
				<td key={`${key}-${id}-token`} className="text-center tokens-tokenkey">
					{token}
				</td>
			)
		},
		{
			label: STRINGS.DEVELOPERS_TOKENS_TABLE.CREATED,
			key: 'created',
			className: 'tokens-cell tokens-date',
			renderCell: ({ id, created }, key, index) => (
				<td key={`${key}-${id}-date`} className="tokens-date">
					{formatTimestamp(created)}
				</td>
			)
		},
		{
			label: STRINGS.DEVELOPERS_TOKENS_TABLE.REVOKE,
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
							'token-no-otp': !revoked && !otp_enabled
						}
					)}
					onClick={!revoked && otp_enabled ? () => revokeToken(id) : () => {}}
				>
					{revoked
						? STRINGS.DEVELOPERS_TOKENS_TABLE.REVOKED
						: STRINGS.DEVELOPERS_TOKENS_TABLE.REVOKE}
				</td>
			)
		}
	];
};
