import React, { useRef, useState } from 'react';
import { Button, Checkbox, message, Input, Tag } from 'antd';
import QR from 'qrcode.react';
import { STATIC_ICONS } from 'config/icons';
import { EditOutlined } from '@ant-design/icons';
import isEqual from 'lodash.isequal';

const EditToken = ({ record, displayQR, handleEditData, inx }) => {
	const textRef = useRef(null);
	const [editData, setEditData] = useState(record);
	const [ipAddress, setIpAddress] = useState('');
	const [isEdit, setIsEdit] = useState(false);
	const { apiKey, secret } = record;
	const { can_read, can_trade, can_withdraw } = editData;

	const onHandleCopy = () => {
		const range = document.createRange();
		range.selectNode(textRef.current);
		const selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
		document.execCommand('copy');
		selection.removeAllRanges();
		message.success('Text copied');
	};

	const onChangeIp = (e) => {
		setIpAddress(e);
	};

	const addIP = () => {
		setEditData((prevState) => ({
			...prevState,
			whitelisted_ips: [
				...prevState.whitelisted_ips.filter((value) => value !== ipAddress),
				ipAddress,
			],
		}));
		setIpAddress('');
	};

	const removeIp = (ip) => {
		setEditData((prevState) => ({
			...prevState,
			whitelisted_ips: [
				...prevState.whitelisted_ips.filter((value) => value !== ip),
			],
		}));
	};

	const validateIp = () => {
		const rx = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/;
		return rx.test(ipAddress);
	};

	const onHandleSave = () => {
		if (editData?.whitelisted_ips?.length > 0) {
			handleEditData({ type: 'edit', data: editData });
			setIsEdit(false);
		} else {
			message.error('You should have at least one IP');
		}
	};

	return (
		<div className="d-flex p-3 expandable-content">
			<div className="d-flex flex-column pt-2 scanner-content">
				{displayQR && inx === 0 ? (
					<>
						<QR value={apiKey} size={134} className="qr-scanner" />
						<div className="content-size qr-width text-center pt-2">
							QR code will be removed upon page refresh
						</div>
					</>
				) : (
					<img
						src={STATIC_ICONS.TRANSPARENT_KEY}
						alt="key"
						className="transparent-key-icon"
					/>
				)}
			</div>
			<div className="flex-column right-container">
				<div className="d-flex">
					<div>
						<span className="sub-title">API Key</span>
						<div className="d-flex border-bottom">
							<div className=" blue-text content-size" ref={textRef}>
								{record.apiKey && apiKey}
							</div>
							<div
								className=" blue-text content-size ml-5 pointer"
								onClick={onHandleCopy}
							>
								COPY
							</div>
						</div>
					</div>
					<div className="ml-5">
						<span className="sub-title">
							Secret Key
							<span className="content-size ml-1">
								(key will removed from view upon page refresh)
							</span>
						</span>
						<div className="content-size">{secret}</div>
					</div>
				</div>
				<div>
					<div className="sub-title mt-5 mb-2">Access</div>
					<div className="d-flex">
						<div>
							<span className="font-size-small bold">Basic access</span>
							<div className="content-size">
								<strong>Select what this API key can access.</strong>
							</div>
							<div>
								<Checkbox
									name={'can_read'}
									checked={can_read}
									onChange={() =>
										setEditData({ ...editData, can_read: !can_read })
									}
								>
									Reading (wallets balances, etc)
								</Checkbox>
							</div>
							<Checkbox
								name={'can_trade'}
								checked={can_trade}
								onChange={() =>
									setEditData({ ...editData, can_trade: !can_trade })
								}
							>
								Trading
							</Checkbox>
						</div>
						<div className="ml-5">
							<span className="font-size-small bold">Assigned IP</span>
							<div className="content-size edit-ip-wrapper">
								<p>IP address that works with this API key is: </p>
								{!isEdit && (
									<div className="d-flex">
										{editData &&
											editData?.whitelisted_ips?.map((ipAddress) => {
												return (
													<span className="ip-field mt-1">{ipAddress}</span>
												);
											})}
										<EditOutlined
											className="edit-icon ml-2 mt-1"
											onClick={() => setIsEdit(true)}
										/>
									</div>
								)}
								{isEdit && (
									<div>
										{editData?.whitelisted_ips?.map((ip) => {
											return (
												<Tag
													key={ip}
													closable={true}
													className="edit-ip"
													onClose={() => removeIp(ip)}
												>
													{ip}
												</Tag>
											);
										})}
										<div>
											<div className="d-flex">
												<Input
													placeholder={
														'Enter IP address. You can add multiple IPs'
													}
													bordered={false}
													className="edit-ip-input"
													value={ipAddress}
													onChange={(e) => onChangeIp(e?.target?.value)}
												/>
												{validateIp() && (
													<div className="add" onClick={addIP}>
														ADD
													</div>
												)}
											</div>
											<div className="kit-divider"></div>
										</div>
									</div>
								)}
							</div>
						</div>
						<div className="ml-5">
							<span className="font-size-small bold">Advanced access</span>
							<div className="content-size">
								Fund withdrawal API access (use cautiously)
							</div>
							<Checkbox
								name="can_withdraw"
								checked={can_withdraw}
								onChange={() =>
									setEditData({ ...editData, can_withdraw: !can_withdraw })
								}
							>
								Withdrawals
							</Checkbox>
							{editData?.can_withdraw === true && (
								<div className="d-flex items-center mt-2 ml-1">
									<div className="custom-withdraw"></div>
									<div className="content-size warning-content  ml-2">
										<span className="warning-text">WARNING:</span> Enabling API
										Withdrawals is EXTREMELY RISKY!
									</div>
								</div>
							)}
						</div>
					</div>
					<Button
						type="primary"
						onClick={() => onHandleSave()}
						disabled={isEqual(record, editData)}
					>
						Save
					</Button>
				</div>
			</div>
		</div>
	);
};

export default EditToken;
