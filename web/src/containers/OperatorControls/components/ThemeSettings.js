import React, { Component, Fragment } from 'react';
import Modal from 'components/Dialog/DesktopDialog';
import { bool, array, func } from 'prop-types';
import { Button, Table } from 'antd';
import { CloseOutlined, UndoOutlined } from '@ant-design/icons';
import withConfig from 'components/ConfigProvider/withConfig';

class ThemeSettingsModal extends Component {
	constructor(props) {
		super(props);
		const { defaultTheme } = this.props;

		this.state = {
			removedThemes: [],
			defaultTheme,
		};
	}

	state = {
		removedThemes: [],
	};

	columns = [
		{
			title: 'Themes',
			dataIndex: 'value',
			key: 'value',
			render: (_, { value }) => (
				<span className="caps-first">{value} (edit)</span>
			),
			onCell: ({ value }) => {
				return {
					onClick: () => this.props.onAddThemeClick(value),
				};
			},
		},
		{
			title: 'Default theme',
			dataIndex: 'value',
			key: 'value',
			render: (_, { value }) => (this.isDefault(value) ? 'Default' : ''),
			onCell: ({ value }) => {
				return {
					onClick: () => this.setDefault(value),
				};
			},
		},
		{
			dataIndex: 'value',
			key: 'value',
			render: (_, { value }) => (
				<Fragment>
					<Button
						shape="circle"
						size="small"
						ghost
						icon={!this.isRemoved(value) ? <CloseOutlined /> : <UndoOutlined />}
						className="operator-controls__all-strings-settings-button"
						disabled={this.isDefault(value)}
						onClick={() => {
							!this.isRemoved(value)
								? this.removeTheme(value)
								: this.revert(value);
						}}
					/>
					<span className="ml-2">
						{!this.isRemoved(value) ? 'Remove' : 'Removed'}
					</span>
				</Fragment>
			),
		},
	];

	removeTheme = (theme) => {
		this.setState((prevState) => ({
			...prevState,
			removedThemes: [...prevState.removedThemes, theme],
		}));
	};

	revert = (theme) => {
		this.setState((prevState) => ({
			...prevState,
			removedThemes: prevState.removedThemes.filter((key) => key !== theme),
		}));
	};

	isRemoved = (theme) => {
		const { removedThemes } = this.state;
		return removedThemes.includes(theme);
	};

	isDefault = (theme) => {
		const { defaultTheme } = this.state;
		return theme === defaultTheme;
	};

	setDefault = (defaultTheme) => {
		this.setState((prevState) => ({
			...prevState,
			defaultTheme,
			removedThemes: prevState.removedThemes.filter(
				(theme) => theme !== defaultTheme
			),
		}));
	};

	render() {
		const {
			isOpen,
			onCloseDialog,
			themes,
			onAddThemeClick,
			onConfirm,
		} = this.props;
		const { removedThemes, defaultTheme } = this.state;
		return (
			<Modal
				isOpen={isOpen}
				label="operator-controls-modal"
				className="operator-controls__modal"
				disableTheme={true}
				onCloseDialog={() => onCloseDialog(true)}
				shouldCloseOnOverlayClick={true}
				showCloseText={true}
				bodyOpenClassName="operator-controls__modal-open"
			>
				<div className="operator-controls__all-strings-header">
					<div className="operator-controls__modal-title">Theme settings</div>
				</div>
				<Table
					className="operator-controls__table"
					rowClassName="pointer"
					columns={this.columns}
					dataSource={themes}
					size="small"
					sticky={true}
					pagination={{
						pageSize: 1000,
						hideOnSinglePage: true,
						showSizeChanger: false,
						showQuickJumper: false,
						showLessItems: false,
						showTotal: false,
					}}
					scroll={{ y: 240 }}
					rowKey={({ value }) => value}
					style={{ width: '380px' }}
				/>
				<div className="pt-3">
					<Button
						onClick={() => onAddThemeClick()}
						className="operator-controls__all-strings-settings-button"
						type="primary"
						shape="round"
						size="small"
						ghost
					>
						Add theme
					</Button>
				</div>
				<div className="d-flex justify-content-end pt-4 mt-4">
					<Button
						type="primary"
						className="operator-controls__save-button confirm"
						onClick={() => onConfirm(removedThemes, defaultTheme)}
					>
						Confirm
					</Button>
				</div>
			</Modal>
		);
	}
}

ThemeSettingsModal.propTypes = {
	isOpen: bool.isRequired,
	onCloseDialog: func.isRequired,
	themes: array.isRequired,
	onAddThemeClick: func.isRequired,
	onConfirm: func.isRequired,
};

export default withConfig(ThemeSettingsModal);
