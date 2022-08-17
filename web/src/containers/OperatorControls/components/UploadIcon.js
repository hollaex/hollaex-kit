import React, { Component } from 'react';
import Modal from 'components/Dialog/DesktopDialog';
import { bool, func, array } from 'prop-types';
import { Button, Divider, Collapse } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import { upload } from 'actions/operatorActions';
import ImageUpload from './ImageUpload';
import merge from 'lodash.merge';

class UploadIcon extends Component {
	state = {
		selectedFiles: {},
		loading: false,
		error: false,
		preview: {},
		isRemove: false,
		removedKeys: [],
	};

	componentWillUnmount() {
		const { preview } = this.state;
		Object.entries(preview).forEach(([_, icons = {}]) => {
			Object.entries(icons).forEach(([_, objectUrl]) => {
				URL.revokeObjectURL(objectUrl);
			});
		});
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
			preview: {
				...prevState.preview,
				[theme]: {
					...prevState.preview[theme],
					[iconKey]: URL.createObjectURL(files[0]),
				},
			},
		}));
	};

	handleSave = async () => {
		const { onSave } = this.props;
		const { selectedFiles, isRemove } = this.state;
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

		if (isRemove) {
			const { removedKeys } = this.state;
			localStorage.setItem(
				'removedBackgroundItems',
				JSON.stringify(removedKeys)
			);
			setTimeout(() => {
				onSave(icons);
				this.setState({
					loading: false,
				});
			}, 2500);
		} else {
			onSave(icons);
			this.setState({
				loading: false,
			});
		}
	};

	getIconPath = (theme, id) => {
		if (
			JSON.parse(localStorage.getItem('removedBackgroundItems')) &&
			JSON.parse(localStorage.getItem('removedBackgroundItems')).length &&
			JSON.parse(localStorage.getItem('removedBackgroundItems'))?.includes(
				`${id}__${theme}`
			)
		) {
			return undefined;
		} else {
			const { iconsEditData: editData } = this.props;
			const { preview } = this.state;
			const icons = merge({}, editData, preview);
			return icons[theme][id];
		}
	};

	onReset = (themeKey, iconKey) => {
		let currentTheme = 'white';
		if (themeKey && themeKey !== 'white') {
			currentTheme = 'dark';
		}
		let removedKeys = [...this.state.removedKeys];
		const val = JSON.parse(localStorage.getItem('removedBackgroundItems'));
		if (val?.length && !removedKeys.includes(`${iconKey}__${currentTheme}`)) {
			removedKeys = [...val, `${iconKey}__${currentTheme}`];
		} else if (!removedKeys.includes(`${iconKey}__${currentTheme}`)) {
			removedKeys = [...removedKeys, `${iconKey}__${currentTheme}`];
		}
		this.setState({ isRemove: true, removedKeys });
		this.props.removeIcon(themeKey, iconKey);
	};

	render() {
		const { isOpen, onCloseDialog, editId, themeOptions } = this.props;
		const { loading, error } = this.state;
		const { getIconPath } = this;

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
												iconPath={getIconPath(theme, id)}
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
												iconPath={getIconPath(theme, id)}
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
