import React from 'react';
import { Button, Input } from 'antd';
import { STATIC_ICONS } from 'config/icons';

const ConfirmPlugin = ({
	onHandleChange,
	header,
	description,
	pluginData,
	isShowThumbnail = false,
	isConfirm,
	onHandleBack,
	okBtnlabel,
	onHandleSubmit = () => {},
}) => {
	return (
		<div className="admin-plugin-modal-wrapper">
			<div className="confirm-plugin-wrapper">
				<h5>
					<b>{header}</b>
				</h5>
				<div>{description}</div>
				{isShowThumbnail ? (
					<div className="d-flex">
						<img
							src={
								pluginData.icon
									? pluginData.icon
									: STATIC_ICONS.DEFAULT_PLUGIN_THUMBNAIL
							}
							alt="plugin-icons"
							className="plugins-icon"
						/>
						<div className="my-5 mx-3">
							<h2>{pluginData.name}</h2>
							<div>
								<b>Version:</b> {pluginData.version}
							</div>
						</div>
					</div>
				) : null}
				<div>
					Type 'I UNDERSTAND' to confirm
					<Input className="mt-2" onChange={onHandleChange} />
				</div>

				<div className="my-4 btn-wrapper d-flex justify-content-between">
					<Button
						type="primary"
						className="add-btn"
						onClick={() => onHandleBack()}
					>
						Back
					</Button>
					<Button
						type="primary"
						className="remove-btn"
						onClick={() => onHandleSubmit()}
						disabled={isConfirm}
					>
						{okBtnlabel}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmPlugin;
