import React from 'react';
import QRCode from 'qrcode.react';
import classnames from 'classnames';
import { DEFAULT_COIN_DATA } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { EditWrapper } from 'components';

import { isMobile } from 'react-device-detect';
import { renderDumbField } from '../Wallet/components'; // eslint-disable-line

export const generateBaseInformation = (id = '') => (
	<div className="text">
		{id && (
			<p>
				{STRINGS.formatString(STRINGS['DEPOSIT_BANK_REFERENCE'], id).join(' ')}
			</p>
		)}
	</div>
);

const renderBTCContent = (
	label = '',
	address = '',
	onCopy,
	copyOnClick,
	destinationAddress = '',
	destinationLabel = ''
) =>
	address ? (
		<div
			className={classnames(
				'deposit_info-wrapper d-flex align-items-center',
				isMobile && 'flex-column-reverse'
			)}
		>
			<div>
				<div className="deposit_info-crypto-wrapper">
					{renderDumbField({
						label,
						value: address,
						fullWidth: true,
						allowCopy: true,
						onCopy,
						copyOnClick,
					})}
				</div>
				{destinationAddress ? (
					<div className="deposit_info-crypto-wrapper">
						{renderDumbField({
							label: destinationLabel,
							value: destinationAddress,
							fullWidth: true,
							allowCopy: true,
							onCopy,
							copyOnClick,
						})}
					</div>
				) : null}
			</div>
			<div className="deposit_info-qr-wrapper d-flex align-items-center justify-content-center">
				<div className="qr_code-wrapper d-flex flex-column">
					<div className="qr-code-bg d-flex justify-content-center align-items-center">
						<QRCode value={address} />
					</div>
					<div className="qr-text">
						<EditWrapper stringId="DEPOSIT.QR_CODE">
							{STRINGS['DEPOSIT.QR_CODE']}
						</EditWrapper>
					</div>
				</div>
			</div>
		</div>
	) : (
		<div>{STRINGS['DEPOSIT.NO_DATA']}</div>
	);

export const renderContent = (
	symbol,
	crypto_wallet = {},
	coins = {},
	onCopy
) => {
	if (coins[symbol]) {
		const { fullname } = coins[symbol] || DEFAULT_COIN_DATA;
		let address = crypto_wallet[symbol];
		let destinationAddress = '';
		if (symbol === 'xrp' || symbol === 'xlm' || coins[symbol].network === 'stellar') {
			const temp = address.split(':');
			address = temp[0] ? temp[0] : address;
			destinationAddress = temp[1] ? temp[1] : '';
		}
		const additionalText =
			symbol === 'xlm' || coins[symbol].network === 'stellar'
				? STRINGS['DEPOSIT.CRYPTO_LABELS.MEMO']
				: STRINGS['DEPOSIT.CRYPTO_LABELS.DESTINATION_TAG'];

		return renderBTCContent(
			STRINGS.formatString(STRINGS['DEPOSIT.CRYPTO_LABELS.ADDRESS'], fullname),
			address,
			onCopy,
			true,
			destinationAddress,
			STRINGS.formatString(additionalText, fullname)
		);
	} else {
		return <div>{STRINGS['DEPOSIT.NO_DATA']}</div>;
	}
};
