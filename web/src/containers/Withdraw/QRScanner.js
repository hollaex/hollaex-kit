import React, { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { Button, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';

const QRScanner = ({ closeQRScanner, getQRData }) => {
	const [result, setResult] = useState(STRINGS['QR_CODE.NO_RESULT']);
	const [error, setError] = useState();
	const [stopStream, setStopStream] = useState(false);

	const onUpdate = (err, data) => {
		if (data) {
			const { text } = data;
			setResult(text);
			getQRData(text);
			setTimeout(closeQRScanner, 2000);
		} else {
			setResult(STRINGS['QR_CODE.NOT_FOUND']);
		}
	};

	const onError = (error) => {
		if (error.name === 'NotAllowedError') {
			setError(STRINGS['QR_CODE.PERMISSION_DENIED']);
		} else {
			console.error(error);
		}
	};

	useEffect(() => {
		return setStopStream(true);
	}, []);

	const facingMode = isMobile ? 'environment' : 'user';

	return (
		<div className="margin-auto">
			<div className="qr_reader_wrapper">
				<BarcodeScannerComponent
					onUpdate={onUpdate}
					onError={onError}
					facingMode={facingMode}
					stopStream={stopStream}
				/>
			</div>
			{error ? (
				<p className="text-center warning_text">{error}</p>
			) : (
				<p className="text-center">{result}</p>
			)}
			<div className="w-100">
				<EditWrapper stringId="BACK_TEXT" />
				<Button label={STRINGS['BACK_TEXT']} onClick={closeQRScanner} />
			</div>
		</div>
	);
};

export default QRScanner;
