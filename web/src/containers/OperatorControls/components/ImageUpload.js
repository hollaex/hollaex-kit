import React from 'react';
import Image from 'components/Image';
// import { Button } from 'antd';
// import { DeleteOutlined } from '@ant-design/icons';

const ImageUpload = ({
	iconKey,
	themeKey,
	iconPath,
	onFileChange,
	beforeInjection,
	// onReset,
	// loading,
}) => {
	return (
		<div className="image-upload">
			<div className="image-upload__file-container">
				<div className="image-upload__file-img-content">
					<Image
						icon={iconPath}
						wrapperClassName="image-upload_image"
						beforeInjection={beforeInjection}
					/>
				</div>
				<div>
					<div>{`${themeKey} theme`}</div>
					<div>
						<label>
							<span className="image-upload__anchor">Upload</span>
							<input
								name={`${themeKey},${iconKey}`}
								type="file"
								accept="image/*"
								onChange={onFileChange}
								className="image-upload__input"
							/>
						</label>
					</div>
				</div>
			</div>
			{/*<Button*/}
			{/*name={iconKey}*/}
			{/*ghost*/}
			{/*shape="circle"*/}
			{/*size="small"*/}
			{/*disabled={loading}*/}
			{/*className="operator-controls__all-strings-settings-button"*/}
			{/*onClick={onReset}*/}
			{/*icon={<DeleteOutlined />}*/}
			{/*/>*/}
		</div>
	);
};

export default ImageUpload;
