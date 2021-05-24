import React, { Component } from 'react';
import Modal from 'components/Dialog/DesktopDialog';
import { bool, array, func } from 'prop-types';
import { Select, Button } from 'antd';

const { Option } = Select;

class AddLanguageModal extends Component {
	constructor(props) {
		super(props);

		const { languages } = this.props;

		this.state = {
			selectedLanguage: !!languages.length && languages[0].value,
		};
	}

	handleSelect = (selectedLanguage) => {
		this.setState({ selectedLanguage });
	};

	addLanguage = () => {
		const { selectedLanguage } = this.state;
		const { onSave } = this.props;

		onSave(selectedLanguage);
	};

	render() {
		const { isOpen, onCloseDialog, languages } = this.props;
		const { selectedLanguage } = this.state;
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
					<div className="operator-controls__modal-title">Add language</div>
				</div>
				<div className="py-4 mx-4">
					<Select
						value={selectedLanguage}
						style={{ width: '290px' }}
						size="large"
						onSelect={this.handleSelect}
						dropdownStyle={{ zIndex: '10003' }}
					>
						{languages.map(({ label, value }) => (
							<Option value={value} key={value}>
								{label}
							</Option>
						))}
					</Select>
				</div>
				<div className="pt-4">
					<Button
						block
						type="primary"
						size="large"
						className="operator-controls__save-button"
						onClick={this.addLanguage}
						disabled={!languages.length}
					>
						Save
					</Button>
				</div>
			</Modal>
		);
	}
}

AddLanguageModal.defaultProps = {
	isOpen: bool.isRequired,
	onCloseDialog: func.isRequired,
	languages: array.isRequired,
};

export default AddLanguageModal;
