import React from 'react';
import { reduxForm } from 'redux-form';
import QRCode from 'qrcode.react';
import STRINGS from '../../config/localizedStrings';
import { EditWrapper, Button } from 'components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { required } from 'components/Form/validations';

import renderFields from 'components/Form/factoryFields';
import { isMobile } from 'react-device-detect';

export const generateBaseInformation = (id = '') => (
	<div className="text">
		{id && (
			<p>
				{STRINGS.formatString(STRINGS['DEPOSIT_BANK_REFERENCE'], id).join(' ')}
			</p>
		)}
	</div>
);

export const generateFormFields = ({
	networks,
	address,
	label,
	onCopy,
	copyOnClick,
	destinationAddress,
	destinationLabel,
}) => {
	const fields = {};

	if (networks) {
		const networkOptions = networks.map((network) => ({
			value: network,
			label: network,
		}));

		fields.network = {
			type: 'select',
			stringId:
				'WITHDRAWALS_FORM_NETWORK_LABEL,WITHDRAWALS_FORM_NETWORK_PLACEHOLDER',
			label: STRINGS['WITHDRAWALS_FORM_NETWORK_LABEL'],
			placeholder: STRINGS['WITHDRAWALS_FORM_NETWORK_PLACEHOLDER'],
			validate: [required],
			fullWidth: true,
			options: networkOptions,
			ishorizontalfield: true,
		};
	}

	if (address) {
		fields.address = {
			type: 'dumb',
			label,
			fullWidth: true,
			allowCopy: true,
			onCopy,
			copyOnClick,
			ishorizontalfield: true,
		};
	}

	if (destinationAddress) {
		fields.destinationAddress = {
			type: 'dumb',
			label: destinationLabel,
			fullWidth: true,
			allowCopy: true,
			onCopy,
			copyOnClick,
			ishorizontalfield: true,
		};
	}

	return fields;
};

const RenderContentForm = ({
	currency,
	coins = {},
	onCopy,
	onOpen,
	setCopied,
	copied,
	address,
	showGenerateButton,
	formFields,
}) => {
	if (coins[currency]) {
		return (
			<div className="withdraw-form-wrapper">
				<div className="withdraw-form">
					{renderFields(formFields)}
					{address && (
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
					)}
				</div>
				{showGenerateButton && (
					<div className="btn-wrapper">
						<Button
							stringId="GENERATE_WALLET"
							label={STRINGS['GENERATE_WALLET']}
							onClick={onOpen}
						/>
					</div>
				)}
				{isMobile && address && (
					<div className="btn-wrapper">
						<CopyToClipboard text={address} onCopy={setCopied}>
							<Button
								onClick={onCopy}
								label={
									copied ? STRINGS['SUCCESFUL_COPY'] : STRINGS['COPY_ADDRESS']
								}
							/>
						</CopyToClipboard>
					</div>
				)}
			</div>
		);
	} else {
		return <div>{STRINGS['DEPOSIT.NO_DATA']}</div>;
	}
};

export default reduxForm({
	form: 'GenerateWalletForm',
	enableReinitialize: true,
})(RenderContentForm);
