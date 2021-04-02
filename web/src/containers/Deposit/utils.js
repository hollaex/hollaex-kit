import React from 'react';
import QRCode from 'qrcode.react';
import classnames from 'classnames';
import { DEFAULT_COIN_DATA } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { EditWrapper, Button } from 'components';
import { Select } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';

import { getWallet } from 'utils/wallet';
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

const RenderBTCContent = ({
	label = '',
	address = '',
	onCopy,
	copyOnClick,
	destinationAddress = '',
	destinationLabel = '',
	selectedNetwork,
	networks,
	onSelect,
	onOpen,
}) => {
	const showGenerateButton =
		(!address && networks && selectedNetwork) || (!address && !networks);

	return (
		<div
			className={classnames(
				'deposit_info-wrapper d-flex align-items-center',
				isMobile && 'flex-column-reverse'
			)}
		>
			<div>
				<div className="deposit_info-crypto-wrapper">
					{address &&
						renderDumbField({
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
			{networks && (
				<Select
					value={selectedNetwork}
					size="small"
					onSelect={onSelect}
					bordered={false}
					suffixIcon={<CaretDownOutlined />}
					className="custom-select-input-style appbar elevated"
					dropdownClassName="custom-select-style"
				>
					{networks.map((network) => (
						<Select.Option value={network} key={network}>
							{network}
						</Select.Option>
					))}
				</Select>
			)}
			{showGenerateButton && (
				<div className="d-flex justify-content-center">
					<Button
						stringId="GENERATE_WALLET"
						label={STRINGS['GENERATE_WALLET']}
						onClick={onOpen}
					/>
				</div>
			)}
		</div>
	);
};

export const RenderContent = ({
	currency: symbol,
	wallet = [],
	coins = {},
	onCopy,
	selectedNetwork = '',
	onSelect,
	onOpen: onOpenDialog,
	networks,
}) => {
	if (coins[symbol]) {
		const { fullname } = coins[symbol] || DEFAULT_COIN_DATA;
		let address = getWallet(symbol, selectedNetwork, wallet, networks) || '';
		let destinationAddress = '';
		if (
			symbol === 'xrp' ||
			symbol === 'xlm' ||
			coins[symbol].network === 'stellar'
		) {
			const temp = address.split(':');
			address = temp[0] ? temp[0] : address;
			destinationAddress = temp[1] ? temp[1] : '';
		}
		const additionalText =
			symbol === 'xlm' || coins[symbol].network === 'stellar'
				? STRINGS['DEPOSIT.CRYPTO_LABELS.MEMO']
				: STRINGS['DEPOSIT.CRYPTO_LABELS.DESTINATION_TAG'];

		const onOpen = () => onOpenDialog(symbol);

		return (
			<RenderBTCContent
				label={STRINGS.formatString(
					STRINGS['DEPOSIT.CRYPTO_LABELS.ADDRESS'],
					fullname
				)}
				address={address}
				onCopy={onCopy}
				copyOnClick={true}
				destinationAddress={destinationAddress}
				destinationLabel={STRINGS.formatString(additionalText, fullname)}
				selectedNetwork={selectedNetwork}
				networks={networks}
				onSelect={onSelect}
				onOpen={onOpen}
			/>
		);
	} else {
		return <div>{STRINGS['DEPOSIT.NO_DATA']}</div>;
	}
};
