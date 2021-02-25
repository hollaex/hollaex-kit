import React, { Component, Fragment } from 'react';
import Modal from 'components/Dialog/DesktopDialog';
import { bool, array, func } from 'prop-types';
import { Input, Select, Button, Table, Modal as ConfirmationModal } from 'antd';
import ImageUpload from './ImageUpload';
import { KeyOutlined } from '@ant-design/icons';
import { upload } from 'actions/operatorActions';

const { Option } = Select;
const { Search } = Input;

class AllIconsModal extends Component {
	state = {
		selectedFiles: {},
	};

	getColumns = () => {
		const { themeOptions, selectedThemes, onSelect } = this.props;
		return selectedThemes.map((theme, index) => ({
			title: () => (
				<Select
					value={theme}
					bordered={false}
					size="default"
					onSelect={(value) => onSelect(value, index)}
					dropdownStyle={{ zIndex: '10003' }}
				>
					{themeOptions.map(({ value }) => (
						<Option value={value} key={value}>
							{value}
						</Option>
					))}
				</Select>
			),
			dataIndex: theme,
			key: theme,
			ellipsis: true,
			render: (iconPath, { key }) => {
				return (
					<Fragment>
						<span className="operator-controls__string-key">
							<KeyOutlined /> {key}
						</span>
						<ImageUpload
							iconKey={key}
							themeKey={theme}
							iconPath={iconPath}
							onFileChange={this.onFileChange}
							beforeInjection={(svg) => {
								svg.setAttribute('width', '80px');
								svg.setAttribute('height', '76px');
							}}
						/>
					</Fragment>
				);
			},
		}));
	};

	onFileChange = ({ target: { name, files } }) => {
		const [theme, iconKey] = name.split(',');

		this.setState(
			(prevState) => ({
				...prevState,
				selectedFiles: {
					...prevState.selectedFiles,
					[theme]: {
						...prevState.selectedFiles[theme],
						[iconKey]: files[0],
					},
				},
			}),
			() => {
				if (files) {
					this.openConfirm();
				}
			}
		);
	};

	openConfirm = () => {
		ConfirmationModal.confirm({
			content: 'Do you want to save this icon?',
			okText: 'Save',
			cancelText: 'Cancel',
			onOk: this.handleSave,
			onCancel: () => this.setState({ selectedFiles: {} }),
			zIndex: 10003,
		});
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
									selectedFiles: {},
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

		onSave(icons, true);

		this.setState({
			selectedFiles: {},
		});
	};

	render() {
		const { isOpen, icons, onCloseDialog, searchValue, onSearch } = this.props;

		const modalContent = document.getElementById('all-icons-content');
		const modalContentHeight = modalContent ? modalContent.clientHeight : 0;
		const tableContentHeight = Math.max(0, modalContentHeight - 240);

		return (
			<Modal
				isOpen={isOpen}
				label="operator-controls-modal"
				className="operator-controls__modal extended"
				disableTheme={true}
				onCloseDialog={onCloseDialog}
				shouldCloseOnOverlayClick={true}
				showCloseText={true}
				bodyOpenClassName="operator-controls__modal-open"
			>
				{isOpen && (
					<div className="h-100" id="all-icons-content">
						<div className="operator-controls__all-strings-header">
							<div className="operator-controls__modal-title">All graphics</div>
							<div className="d-flex justify-content-end mr-3">
								<Search
									style={{ width: '134px' }}
									defaultValue={searchValue}
									onChange={onSearch}
									enterButton={false}
									bordered={false}
									placeholder="Search..."
								/>
							</div>
						</div>
						<div>Upload a graphic to a specific theme.</div>
						<div>
							<b>When uploading new content a file size under 1mb</b> is
							recommended.
						</div>
						<Table
							className="operator-controls__table"
							columns={this.getColumns()}
							dataSource={icons}
							size="small"
							sticky={true}
							pagination={{
								pageSize: icons.length ? Math.ceil(icons.length / 4) : 0,
								hideOnSinglePage: false,
								showSizeChanger: false,
								showQuickJumper: false,
								showLessItems: false,
								showTotal: false,
							}}
							scroll={{ y: tableContentHeight }}
							style={{ width: '820px' }}
						/>
						<div className="d-flex justify-content-end pt-4 mt-4">
							<Button
								type="primary"
								onClick={onCloseDialog}
								className="operator-controls__save-button confirm"
							>
								Confirm
							</Button>
						</div>
					</div>
				)}
			</Modal>
		);
	}
}

AllIconsModal.propTypes = {
	isOpen: bool.isRequired,
	icons: array.isRequired,
	onCloseDialog: func.isRequired,
	selectedThemes: array.isRequired,
	onSave: func.isRequired,
};

export default AllIconsModal;
