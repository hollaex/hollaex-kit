import React, { Component } from 'react';
import Modal from 'components/Dialog/DesktopDialog';
import { bool, func, array } from 'prop-types';
import { Button, Divider, Collapse } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import { upload } from 'actions/operatorActions';
import ImageUpload from './ImageUpload';

class UploadIcon extends Component {
	constructor(props) {
		super(props);
		const { iconsEditData: editData } = this.props;
		this.state = {
			selectedFiles: {},
			loading: false,
			error: false,
			editData,
		};
	}

	onFileChange = ({ target: { name, files } }) => {
		const [theme, iconKey] = name.split(',');

		this.setState((prevState) => ({
			...prevState,
			selectedFiles: {
				...prevState.selectedFiles,
				[theme]: {
					...prevState.selectedFiles[theme],
					[iconKey]: files[0],
				},
			},
		}));
	};

	onReset = ({ target: { name } }) => {
		return console.log('reset', name);
	};

	handleSave = async () => {
		const { onSave } = this.props;
		const { selectedFiles } = this.state;
		const icons = {};

		this.setState({
			error: false,
			loading: true,
		});

		for (const themeKey in selectedFiles) {
			if (selectedFiles.hasOwnProperty(themeKey)) {
				icons[themeKey] = {};

				for (const key in selectedFiles[themeKey]) {
					if (selectedFiles[themeKey].hasOwnProperty(key)) {
						const file = selectedFiles[themeKey][key];
						if (file) {
							const formData = new FormData();
							const { name: fileName } = file;
							const uniqueId = Date.now();
							const extension = fileName.split('.').pop();
							const name = `${key}__${themeKey}___${uniqueId}.${extension}`;

							formData.append('name', name);
							formData.append('file', file);

							try {
								const {
									data: { path },
								} = await upload(formData);
								icons[themeKey][key] = path;
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
			}
		}

		this.setState({
			loading: false,
		});

		onSave(icons);
	};

	render() {
		const {
			isOpen,
			onCloseDialog,
			editId,
			iconsEditData: editData,
			themeOptions,
		} = this.props;
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
					<div className="operator-controls__modal-title pb-3">
						Upload graphic
					</div>
				</div>
				<div style={{ width: '320px' }}>
					<b>When uploading new content a file size under 1mb</b> is
					recommended.
				</div>
				<div>
					{editId.map((id) => (
						<div key={id}>
							<Divider orientation="left">
								<span className="operator-controls__string-key">
									<KeyOutlined /> {id}
								</span>
							</Divider>
							<Collapse defaultActiveKey={['1']} bordered={false} ghost>
								<Collapse.Panel showArrow={false} key="1" disabled={true}>
									{themeOptions
										.filter(({ value: theme }) => theme === 'dark')
										.map(({ value: theme }) => (
											<ImageUpload
												key={`${theme}-${id}`}
												iconKey={id}
												themeKey={theme}
												iconPath={editData[theme][id]}
												loading={loading}
												onFileChange={this.onFileChange}
												onReset={this.onReset}
											/>
										))}
								</Collapse.Panel>
								<Collapse.Panel
									showArrow={false}
									header={
										<span className="underline-text">
											Theme Specific Graphics
										</span>
									}
									key="2"
								>
									{themeOptions
										.filter(({ value: theme }) => theme !== 'dark')
										.map(({ value: theme }) => (
											<ImageUpload
												key={`${theme}-${id}`}
												iconKey={id}
												themeKey={theme}
												iconPath={editData[theme][id]}
												loading={loading}
												onFileChange={this.onFileChange}
												onReset={this.onReset}
											/>
										))}
								</Collapse.Panel>
							</Collapse>
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
