import React from 'react';
import QRCode from 'qrcode.react';

import { fiatSymbol } from '../../utils/currency';
import STRINGS from '../../config/localizedStrings';

import { renderBankInformation, renderDumbField } from '../Wallet/components'; // eslint-disable-line

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
		<div className="deposit_info-wrapper d-flex align-items-center">
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
					<QRCode value={address} />
					<div className="qr-text">{STRINGS.DEPOSIT.QR_CODE}</div>
				</div>
			</div>
		</div>
	) : (
		<div>{STRINGS.DEPOSIT.NO_DATA}</div>
	);

export const renderContent = (symbol, crypto_wallet = {}) => {
	switch (symbol) {
		case fiatSymbol:
			// return renderBankInformation(BANK_INFORMATION);
			return;
		case 'btc': {
			const CRYPTO_LABELS = {
				btc: STRINGS.DEPOSIT.CRYPTO_LABELS.BTC
			};
			return renderBTCContent(CRYPTO_LABELS.btc, crypto_wallet.bitcoin);
		}
		default:
			return <div>{STRINGS.DEPOSIT.NO_DATA}</div>;
	}
};

export const renderExtraInformation = (limit = 0) => {
	if (limit === 0) {
		return;
	}

	return (
		<div className="extra_information-wrapper d-flex">
			{STRINGS.DEPOSIT.LIMIT_MESSAGE}
		</div>
	);
};
