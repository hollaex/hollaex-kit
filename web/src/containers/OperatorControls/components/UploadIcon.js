import React, { Component } from 'react';
import Modal from 'components/Dialog/DesktopDialog';
import { bool, func, array } from 'prop-types';
import { Button, Divider } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import { upload } from 'actions/operatorActions';
import { DeleteOutlined } from '@ant-design/icons';

class UploadIcon extends Component {
	state = {
		selectedFiles: {},
		loading: false,
		error: false,
	};

	onFileChange = ({ target: { name, files } }) => {
		this.setState((prevState) => ({
			...prevState,
			selectedFiles: {
				...prevState.selectedFiles,
				[name]: files[0],
			},
		}));
	};

	handleSave = async () => {
		const { onSave } = this.props;
		const { selectedFiles } = this.state;
		const icons = {};

		this.setState({
			error: false,
			loading: true,
		});

		for (const key in selectedFiles) {
			if (selectedFiles.hasOwnProperty(key)) {
				const file = selectedFiles[key];
				if (file) {
					const formData = new FormData();
					const { name: fileName } = file;
					const extension = fileName.split('.').pop();
					const name = `${key}.${extension}`;

					formData.append('name', name);
					formData.append('file', file);

					try {
						const {
							data: { path },
						} = await upload(formData);
						icons[key] = path;
					} catch (error) {
						this.setState({
							loading: false,
							error: 'Something went wrong!',
						});
						return;
					}
				}
			}
		}

		this.setState({
			loading: false,
		});

		onSave(icons);
	};

	render() {
		const { isOpen, onCloseDialog, editId, onReset } = this.props;
		const { loading, error } = this.state;

		return (
			<Modal
				isOpen={isOpen}
				label="operator-controls-modal"
				className="operator-controls__modal"
				disableTheme={true}
				onCloseDialog={onCloseDialog}
				shouldCloseOnOverlayClick={!loading}
				showCloseText={!loading}
				bodyOpenClassName="operator-controls__modal-open"
			>
				<div className="operator-controls__all-strings-header">
					<div className="operator-controls__modal-title pb-3">Upload Icon</div>
				</div>
				<div>
					{editId.map((id) => (
						<div key={id} className="pb-3">
							<Divider orientation="left">
								<span className="operator-controls__string-key">
									<KeyOutlined /> {id}
								</span>
							</Divider>
							<div className="d-flex pt-1">
								<input
									name={id}
									type="file"
									accept="image/*"
									style={{ width: '232px' }}
									onChange={this.onFileChange}
								/>
								<Button
									ghost
									shape="circle"
									size="small"
									disabled={loading}
									className="operator-controls__all-strings-settings-button"
									onClick={() => onReset(id)}
									icon={<DeleteOutlined />}
								/>
							</div>
						</div>
					))}
				</div>
				{error && (
					<div style={{ color: 'red' }} className="pt-2">
						{error}
					</div>
				)}
				<div className="d-flex justify-content-end pt-3 mt-3">
					<Button
						block
						type="primary"
						className="operator-controls__save-button"
						loading={loading}
						onClick={this.handleSave}
					>
						Save
					</Button>
				</div>
			</Modal>
		);
	}
}

UploadIcon.propTypes = {
	editId: array.isRequired,
	isOpen: bool.isRequired,
	onCloseDialog: func.isRequired,
	onSave: func.isRequired,
};

export default UploadIcon;
