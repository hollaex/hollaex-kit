import React, { useRef, useState } from 'react';
import { Button, Checkbox, message } from 'antd';
import QR from 'qrcode.react';
import { STATIC_ICONS } from 'config/icons';

const EditToken = ({ record, displayQR, handleEditData, inx }) => {
	const textRef = useRef(null);
	const [editData, setEditData] = useState(record);
	const { apiKey, secret } = record;
	const { can_read, can_trade, can_withdraw } = editData;

	const isDisable = (record) => {
		const accessPermissionKeys = ['can_read', 'can_trade', 'can_withdraw'];
		let enabled = true;
		accessPermissionKeys.forEach((item) => {
			if (record[item] !== editData[item]) {
				enabled = false;
			}
		});
		return enabled;
	};

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
							<div className="content-size">
								<p>IP address that works with this API key is: </p>
								{editData?.whitelisted_ips?.map((ipAddress) => {
									return <span className="ip-field mt-1">{ipAddress}</span>;
								})}
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
						onClick={() => handleEditData({ type: 'edit', data: editData })}
						disabled={isDisable(record)}
					>
						Save
					</Button>
				</div>
			</div>
		</div>
	);
};

export default EditToken;
