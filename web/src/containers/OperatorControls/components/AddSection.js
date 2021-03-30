import React, { Component } from 'react';
import Modal from 'components/Dialog/DesktopDialog';
import { Button, Checkbox } from 'antd';

class SectionsModal extends Component {
	constructor(props) {
		super(props);
		const { sections } = this.props;
		this.state = {
			sections,
		};
	}

	toggleSection = ({ target: { name, checked: is_active } }) => {
		this.setState((prevState) => ({
			...prevState,
			sections: {
				...prevState.sections,
				[name]: {
					...prevState.sections[name],
					is_active,
				},
			},
		}));
	};

	render() {
		const { isOpen, onCloseDialog, onSave } = this.props;

		const { sections } = this.state;

		return (
			<Modal
				isOpen={isOpen}
				label="operator-controls-modal"
				className="operator-controls__modal"
				disableTheme={true}
				onCloseDialog={onCloseDialog}
				shouldCloseOnOverlayClick={true}
				showCloseText={true}
				bodyOpenClassName="operator-controls__modal-open"
			>
				<div className="operator-controls__all-strings-header">
					<div className="operator-controls__modal-title">Add section</div>
				</div>

				<div style={{ width: '40rem' }}>Add a section to your home page.</div>

				<table className="mt-4" style={{ fontSize: '1rem' }}>
					<thead>
						<tr>
							<th style={{ width: '5rem' }}>Select</th>
							<th>Section</th>
						</tr>
					</thead>
					<tbody>
						{Object.entries(sections).map(([key, { name, is_active }]) => (
							<tr key={`item-${key}`}>
								<td>
									<Checkbox
										checked={is_active}
										name={key}
										onChange={this.toggleSection}
									/>
								</td>
								<td>{name}</td>
							</tr>
						))}
					</tbody>
				</table>

				<div className="d-flex justify-content-end pt-4 mt-4">
					<Button
						type="primary"
						className="operator-controls__save-button confirm"
						onClick={() => onSave(sections)}
					>
						Confirm
					</Button>
				</div>
			</Modal>
		);
	}
}

export default SectionsModal;
