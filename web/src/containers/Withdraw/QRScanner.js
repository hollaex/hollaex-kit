import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

import STRINGS from 'config/localizedStrings';
import { Button, EditWrapper } from 'components';
import { setScannedAddress } from 'actions/walletActions';

const QRScanner = ({ closeQRScanner, getQRData, setScannedAddress }) => {
	const [result, setResult] = useState(STRINGS['QR_CODE.NO_RESULT']);
	const [error, setError] = useState();
	const [stopStream, setStopStream] = useState(false);
	const timeoutRef = useRef(null);

	const onUpdate = (err, data) => {
		if (data) {
			const { text } = data;
			setStopStream(true);
			setResult(text);
			setScannedAddress(text);
			getQRData(text);
			timeoutRef.current = setTimeout(closeQRScanner, 2000);
		} else {
			setResult(STRINGS['QR_CODE.NOT_FOUND']);
			setScannedAddress(STRINGS['QR_CODE.NOT_FOUND']);
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
		return () => {
			setStopStream(true);
			if (timeoutRef?.current) {
				clearTimeout(timeoutRef?.current);
			}
		};
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

const mapDispatchToProps = (dispatch) => ({
	setScannedAddress: bindActionCreators(setScannedAddress, dispatch),
});

export default connect('', mapDispatchToProps)(QRScanner);
