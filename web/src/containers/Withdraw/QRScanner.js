import React, { useState } from 'react';
// import { isMobile } from 'react-device-detect';
import { Button, EditWrapper, QrReader } from 'components';
import STRINGS from 'config/localizedStrings';

const QRScanner = ({ closeQRScanner, getQRData }) => {
	const [result, setResult] = useState('No result');

	const handleScan = (data) => {
		if (data) {
			setResult(data);
			getQRData(data);
			setTimeout(closeQRScanner, 2500);
		}
	};

	const handleError = (err) => {
		console.log('err', err);
	};

	return (
		<div className="margin-auto">
			<div className="qr_reader_wrapper">
				<QrReader
					fps={10}
					qrbox={250}
					disableFlip={false}
					qrCodeSuccessCallback={handleScan}
					qrCodeErrorCallback={handleError}
				/>
			</div>
			<p className="text-center">{result}</p>
			<div className="w-100">
				<EditWrapper stringId="BACK_TEXT" />
				<Button label={STRINGS['BACK_TEXT']} onClick={closeQRScanner} />
			</div>
		</div>
	);
};

export default QRScanner;
