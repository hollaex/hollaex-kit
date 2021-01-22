import React, { Component } from 'react';
import Modal from 'components/Dialog/DesktopDialog';
import { bool, array, func, string } from 'prop-types';
import { Input, Select, Button, Table } from 'antd';

const { Search } = Input;
const { Option } = Select;

class AllStringsModal extends Component {
	getColumns = () => {
		const { languageOptions, selectedLanguages, onSelect } = this.props;
		return selectedLanguages.map((lang, index) => ({
			title: () => (
				<Select
					value={lang}
					bordered={false}
					size="default"
					onSelect={(value) => onSelect(value, index)}
					dropdownStyle={{ zIndex: '10003' }}
				>
					{languageOptions.map(({ label, value }) => (
						<Option value={value} key={value}>
							{label}
						</Option>
					))}
				</Select>
			),
			dataIndex: lang,
			key: lang,
			ellipsis: true,
		}));
	};

	handleRowClick = (key) => {
		const { onRowClick } = this.props;
		const clickEvent = { target: { dataset: { stringId: key } } };
		onRowClick(clickEvent, true);
	};

	render() {
		const {
			isOpen,
			strings,
			onCloseDialog,
			onSearch,
			searchValue,
			onSettingsClick,
		} = this.props;

		const modalContent = document.getElementById('all-strings-content');
		const modalContentHeight = modalContent ? modalContent.clientHeight : 0;
		const tableContentHeight = Math.max(0, modalContentHeight - 205);

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
					<div className="h-100" id="all-strings-content">
						<div className="operator-controls__all-strings-header">
							<div className="operator-controls__modal-title">All strings</div>
							<div className="d-flex justify-content-end">
								<Search
									style={{ width: '134px' }}
									defaultValue={searchValue}
									onChange={onSearch}
									enterButton={false}
									bordered={false}
									placeholder="Search..."
								/>
								<Button
									onClick={onSettingsClick}
									className="operator-controls__all-strings-settings-button mx-4"
									type="primary"
									shape="round"
									size="small"
									ghost
								>
									Settings
								</Button>
							</div>
						</div>
						<Table
							className="operator-controls__table"
							rowClassName="pointer"
							columns={this.getColumns()}
							dataSource={strings}
							size="small"
							sticky={true}
							pagination={{
								pageSize: strings.length ? Math.ceil(strings.length / 4) : 0,
								hideOnSinglePage: false,
								showSizeChanger: false,
								showQuickJumper: false,
								showLessItems: false,
								showTotal: false,
							}}
							scroll={{ y: tableContentHeight }}
							onRow={({ key }) => {
								return {
									onClick: () => this.handleRowClick(key),
								};
							}}
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

AllStringsModal.propTypes = {
	isOpen: bool.isRequired,
	strings: array.isRequired,
	onCloseDialog: func.isRequired,
	selectedLanguages: array.isRequired,
	onSettingsClick: func.isRequired,
	onSearch: func.isRequired,
	searchValue: string,
};

export default AllStringsModal;
