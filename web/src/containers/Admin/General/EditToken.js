import React, { useState } from 'react';
import { Button, Checkbox } from 'antd';
import QR from 'qrcode.react';
import { STATIC_ICONS } from 'config/icons';

const EditToken = ({ record, displayQR, handleEditData }) => {
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

	return (
		<div className="d-flex p-3 expandable-content">
			<div className="d-flex flex-column pt-2 scanner-content">
				{displayQR ? (
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
						<div className="underline-text blue-text content-size">
							{record.apiKey && apiKey}
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
								IP address that works with this API key is:{' '}
								<span className="ip-field">218.144.134.67</span>
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
