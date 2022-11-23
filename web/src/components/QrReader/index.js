import React, { Component } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const qrcodeRegionId = 'html5qr-code-full-region';

class QrReader extends Component {
	componentDidMount() {
		const { qrCodeSuccessCallback, qrCodeErrorCallback } = this.props;

		const config = this.createConfig(this.props);
		const verbose = this.props.verbose === true;

		if (!qrCodeSuccessCallback) {
			throw new Error('qrCodeSuccessCallback is required callback.');
		}

		this.html5QrcodeScanner = new Html5QrcodeScanner(
			qrcodeRegionId,
			config,
			verbose
		);

		this.html5QrcodeScanner.render(qrCodeSuccessCallback, qrCodeErrorCallback);
	}

	componentWillUnmount() {
		this.html5QrcodeScanner.clear().catch((error) => {
			console.error('Failed to clear html5QrcodeScanner. ', error);
		});
	}

	createConfig = ({ fps, qrbox, aspectRatio, disableFlip }) => {
		const config = {};
		if (fps) {
			config.fps = fps;
		}
		if (qrbox) {
			config.qrbox = qrbox;
		}
		if (aspectRatio) {
			config.aspectRatio = aspectRatio;
		}
		if (disableFlip !== undefined) {
			config.disableFlip = disableFlip;
		}
		return config;
	};

	render() {
		return <div id={qrcodeRegionId} />;
	}
}

export default QrReader;
