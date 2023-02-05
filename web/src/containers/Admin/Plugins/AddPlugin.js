import React from 'react';
import { Button, Input, Radio } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const radioStyle = {
	display: 'flex',
	alignItems: 'center',
	height: '30px',
	lineHeight: '1.2',
	padding: '24px 0',
	margin: 0,
	paddingLeft: '1px',
	whiteSpace: 'normal',
	letterSpacing: '-0.15px',
};

const AddThirdPartyPlugin = ({
	header = '',
	handleChange,
	thirdPartyType,
	handleFileChange,
	handleURL,
	thirdPartyError,
	handleBack,
	thirdParty,
	getJSONFromURL,
	updateState,
	handleStep,
}) => {
	return (
		<div className="admin-plugin-modal-wrapper">
			<h2>
				<b>{header}</b>
			</h2>
			<div>
				<Radio.Group
					name="thirdPartyType"
					onChange={handleChange}
					value={thirdPartyType}
				>
					<Radio value={'upload_json'} style={radioStyle}>
						Upload a json file
					</Radio>
					{thirdPartyType === 'upload_json' ? (
						<div className="plugin-file-wrapper">
							<div className="plugin-file-container">
								<div className="plugin-img-content">
									<DownloadOutlined />
									<label className="upload-link">
										<span>Upload</span>
										<input
											type="file"
											accept="application/JSON"
											name="upload"
											onChange={handleFileChange}
										/>
									</label>
								</div>
							</div>
						</div>
					) : null}
					<Radio value={'input_url'} style={radioStyle}>
						Input URL path
					</Radio>
					{thirdPartyType === 'input_url' ? (
						<div>
							<span className="url-path">URL path</span>
							<Input
								placeholder="Input URL path"
								className="mt-2"
								onChange={handleURL}
							/>
						</div>
					) : null}
				</Radio.Group>
				{thirdPartyError ? (
					<div className="field-wrapper error">{thirdPartyError}</div>
				) : null}
			</div>
			<div className="my-4 btn-wrapper d-flex justify-content-between">
				<Button
					type="primary"
					size="large"
					className={'add-btn w-48'}
					onClick={handleBack}
				>
					Back
				</Button>
				<Button
					type="primary"
					size="large"
					className={'add-btn w-48'}
					onClick={() => {
						if (
							thirdPartyType === 'upload_json' &&
							thirdParty?.name &&
							!thirdPartyError
						) {
							handleStep(3);
						} else if (thirdPartyType === 'input_url') {
							getJSONFromURL();
						} else if (thirdPartyType === 'upload_json' && !thirdParty.name) {
							updateState('Upload a valid JSON');
						}
					}}
				>
					Next
				</Button>
			</div>
		</div>
	);
};

export default AddThirdPartyPlugin;
