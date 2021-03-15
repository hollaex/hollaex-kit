import React from 'react';
import PropTypes from 'prop-types';

const VERTICAL = 'VERTICAL';
const HORIZONTAL = 'HORIZONTAL';

let draggingIndex = null;

function SortableComposition(Component, flowDirection = VERTICAL) {
	class Sortable extends React.Component {
		static propTypes = {
			items: PropTypes.array.isRequired,
			onSortItems: PropTypes.func.isRequired,
			sortId: PropTypes.number,
		};

		sortEnd = (e) => {
			e.preventDefault();
			draggingIndex = null;
		};

		swapArrayElements = (items, indexFrom, indexTo) => {
			var item = items[indexTo];
			items[indexTo] = items[indexFrom];
			items[indexFrom] = item;
			return items;
		};

		isMouseBeyond = (mousePos, elementPos) => {
			var breakPoint;
			breakPoint = 0;
			var mouseOverlap = mousePos - elementPos;
			return mouseOverlap > breakPoint;
		};
		sortStart = (e) => {
			draggingIndex = e.currentTarget.dataset.id;
			let dt = e.dataTransfer;
			if (dt !== undefined) {
				e.dataTransfer.setData('text', e.target.innerHTML);
				if (dt.setDragImage && e.currentTarget.tagName.toLowerCase() === 'a') {
					dt.setDragImage(e.target, 0, 0);
				}
			}
		};

		dragOver = (e) => {
			e.preventDefault();
			// const { blockindex } = this.props;
			const overEl = e.currentTarget;
			const indexDragged = Number(overEl.dataset.id);
			const indexFrom = Number(draggingIndex);
			const positionX = e.clientX;
			const positionY = e.clientY;
			const topOffset = overEl.getBoundingClientRect().top;
			const leftOffset = overEl.getBoundingClientRect().left;
			let mouseBeyond;
			let { items } = this.props;

			if (flowDirection === VERTICAL) {
				mouseBeyond = this.isMouseBeyond(positionY, topOffset);
			}

			if (flowDirection === HORIZONTAL) {
				mouseBeyond = this.isMouseBeyond(positionX, leftOffset);
			}
			if (
				indexDragged !== indexFrom &&
				mouseBeyond
				//  &&
				// (blockindex === false || (indexFrom !== blockindex && indexDragged !== blockindex))
			) {
				items = this.swapArrayElements(items, indexFrom, indexDragged);
				draggingIndex = indexDragged;
				this.props.onSortItems(items);
			}
		};

		render() {
			let newProps = Object.assign({}, this.props);
			delete newProps.onSortItems;
			const { sortId, ...props } = newProps;
			return (
				<Component
					draggable={true}
					onDragOver={this.dragOver}
					onDragStart={this.sortStart}
					onDragEnd={this.sortEnd}
					onTouchStart={this.sortStart}
					onTouchMove={this.dragOver}
					onTouchEnd={this.sortEnd}
					data-id={sortId}
					{...props}
				/>
			);
		}
	}
	return Sortable;
}
export { SortableComposition as Sortable };
