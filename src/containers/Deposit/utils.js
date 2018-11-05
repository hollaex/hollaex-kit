import React from 'react';
import QRCode from 'qrcode.react';
import classnames from 'classnames';
import { fiatSymbol } from '../../utils/currency';
import STRINGS from '../../config/localizedStrings';

import { isMobile } from 'react-device-detect';
import { renderDumbField } from '../Wallet/components'; // eslint-disable-line

export const generateFiatInformation = (id = '') => (
	<div className="text">
		{STRINGS.DEPOSIT.INFORMATION_MESSAGES.map((message, index) => (
			<p key={index}>{message}</p>
		))}
		{id && (
			<p>
				{STRINGS.formatString(STRINGS.DEPOSIT_BANK_REFERENCE, id).join(' ')}
			</p>
		)}
	</div>
);

const renderBTCContent = (label = '', address = '') =>
	address ? (
		<div
			className={classnames(
				'deposit_info-wrapper d-flex align-items-center',
				isMobile && 'flex-column-reverse'
			)}
		>
			<div className="deposit_info-crypto-wrapper">
				{renderDumbField({
					label,
					value: address,
					fullWidth: true,
					allowCopy: true
				})}
			</div>
			<div className="deposit_info-qr-wrapper d-flex align-items-center justify-content-center">
				<div className="qr_code-wrapper d-flex flex-column">
					<div className="qr-code-bg d-flex justify-content-center align-items-center">
						<QRCode value={address} />
					</div>
					<div className="qr-text">{STRINGS.DEPOSIT.QR_CODE}</div>
				</div>
			</div>
		</div>
	) : (
		<div>{STRINGS.DEPOSIT.NO_DATA}</div>
	);

export const renderContent = (symbol, crypto_wallet = {}) => {
	switch (symbol) {
		case 'btc':
			return renderBTCContent(
				STRINGS.DEPOSIT.CRYPTO_LABELS.BTC,
				crypto_wallet.bitcoin
			);
		case 'eth':
			return renderBTCContent(
				STRINGS.DEPOSIT.CRYPTO_LABELS.ETH,
				crypto_wallet.ethereum
			);
		case 'bch':
			return renderBTCContent(
				STRINGS.DEPOSIT.CRYPTO_LABELS.BCH,
				crypto_wallet.bitcoincash
			);
		case fiatSymbol:
		default:
			return <div>{STRINGS.DEPOSIT.NO_DATA}</div>;
	}
};
