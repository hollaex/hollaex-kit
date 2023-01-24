import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';
import { EditWrapper, Button } from 'components';
import STRINGS from 'config/localizedStrings';

const QrCode = ({ closeQRCode, data = '', currency = '', onCopy }) => {
	const [address = '', destinationTag = ''] = data?.split(':') || [];

	return (
		<div className="margin-auto">
			{address && (
				<div className="deposit_info-qr-wrapper d-flex flex-column align-items-center justify-content-center">
					<div className="qr-title">
						<EditWrapper stringId="DEPOSIT.QR_CODE_TITLE">
							{STRINGS.formatString(
								STRINGS['DEPOSIT.QR_CODE_TITLE'],
								currency.toUpperCase()
							)}
						</EditWrapper>
					</div>

					<div className="qr_code-wrapper d-flex flex-column">
						<div className="qr-code-bg d-flex justify-content-center align-items-center">
							<QRCode includeMargin={true} value={address} />
						</div>
					</div>

					<div className="mb-2">
						<CopyToClipboard text={address} onCopy={onCopy}>
							<span className="blue-link pointer underline-text font-small">
								{address}
							</span>
						</CopyToClipboard>
					</div>

					{destinationTag && (
						<div className="mb-2">
							<CopyToClipboard text={destinationTag} onCopy={onCopy}>
								<span className="blue-link pointer underline-text font-small">
									{destinationTag}
								</span>
							</CopyToClipboard>
						</div>
					)}

					<div className="qr-text">
						<EditWrapper stringId="DEPOSIT.QR_CODE">
							{STRINGS['DEPOSIT.QR_CODE']}
						</EditWrapper>
					</div>
				</div>
			)}
			<div className="w-100">
				<EditWrapper stringId="BACK_TEXT" />
				<Button label={STRINGS['BACK_TEXT']} onClick={closeQRCode} />
			</div>
		</div>
	);
};

export default QrCode;
