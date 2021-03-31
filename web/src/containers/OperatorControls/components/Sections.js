import React, { Component } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import Modal from 'components/Dialog/DesktopDialog';
import { Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

const SortableItem = SortableElement(({ section: { name }, order }) => (
	<tr className="sortable_section">
		<td>{order + 1}</td>
		<td>{name}</td>
		<td>
			<MenuOutlined />
		</td>
	</tr>
));

const SortableList = SortableContainer(({ items }) => {
	return (
		<table className="mt-4" style={{ fontSize: '1rem', width: '30rem' }}>
			<thead>
				<tr>
					<th>Order</th>
					<th>Section</th>
					<th>Move</th>
				</tr>
			</thead>
			<tbody>
				{items.map(({ key, ...section }, index) => (
					<SortableItem
						key={`item-${key}`}
						index={index}
						section={section}
						order={index}
					/>
				))}
			</tbody>
		</table>
	);
});

class SectionsModal extends Component {
	constructor(props) {
		super(props);
		const { sections } = this.props;
		const activeSectionsArray = Object.entries(sections)
			.filter(([_, { is_active }]) => is_active)
			.sort(
				([_, { order: order_a }], [__, { order: order_b }]) => order_a - order_b
			)
			.map(([key, section], index) => ({ key, ...section }));

		const inactiveSectionsArray = Object.entries(sections)
			.filter(([_, { is_active }]) => !is_active)
			.map(([key, section], index) => ({ key, ...section }));

		this.state = {
			items: activeSectionsArray,
			inactiveItems: inactiveSectionsArray,
		};
	}

	onSortEnd = ({ oldIndex, newIndex }) => {
		this.setState(({ items }) => ({
			items: arrayMove(items, oldIndex, newIndex),
		}));
	};

	confirmSectionsOrder = () => {
		const { onSave } = this.props;
		const { items, inactiveItems } = this.state;
		const sections = {};
		[...items, ...inactiveItems].forEach(({ key, ...rest }, order) => {
			sections[key] = {
				...rest,
				order,
			};
		});

		onSave(sections);
	};

	render() {
		const { isOpen, onCloseDialog, onLinkClick } = this.props;
		const { items } = this.state;

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
					<div className="operator-controls__modal-title">Sections</div>
				</div>

				<div style={{ width: '40rem' }}>
					Add and remove sections on your home page. Drag and drop the sections
					below to change order displayed on your home page.
				</div>

				<div
					className="underline-text pointer pl-2 pt-4"
					onClick={() => {
						onCloseDialog();
						onLinkClick();
					}}
				>
					Add/remove section
				</div>

				<SortableList items={items} onSortEnd={this.onSortEnd} />

				<div className="d-flex justify-content-end pt-4 mt-4">
					<Button
						type="primary"
						className="operator-controls__save-button confirm"
						onClick={this.confirmSectionsOrder}
					>
						Confirm
					</Button>
				</div>
			</Modal>
		);
	}
}

export default SectionsModal;
