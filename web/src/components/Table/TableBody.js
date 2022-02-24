import React, { Component, Fragment } from 'react';
import classnames from 'classnames';

const RENDER_CELL = (row, key, cellIndex) => (
	<td key={cellIndex}>{row[key]}</td>
);

class TableRow extends Component {
	state = {
		isExpanded: false,
	};

	setIsExpanded = () => {
		this.setState((prevState) => ({
			...prevState,
			isExpanded: !prevState.isExpanded,
		}));
	};

	onExpand = () => {
		const {
			expandable: { rowExpandable },
			row,
		} = this.props;
		const isExpandable = rowExpandable(row);
		if (isExpandable) {
			this.setIsExpanded();
		}
	};

	render() {
		const {
			expandable: { rowExpandable, expandedRowRender },
			cancelDelayData,
			row,
			rowIndex,
			headers,
		} = this.props;
		const { isExpanded } = this.state;
		const isRemoveData = cancelDelayData.filter((data) => data === row.id);
		const isExpandable = rowExpandable(row);

		return (
			<Fragment>
				<tr
					className={classnames('table_body-row', {
						'cancel-row-color': !!isRemoveData.length,
						pointer: isExpandable,
					})}
					key={`row_${rowIndex}`}
					onClick={this.onExpand}
				>
					{headers.map(({ key, renderCell = RENDER_CELL }, cellIndex) =>
						renderCell(row, key, cellIndex, isExpandable, isExpanded)
					)}
				</tr>
				{isExpandable && isExpanded && (
					<tr key={`expandable_row_${rowIndex}`}>
						<td colSpan={6}>
							<div>{expandedRowRender(row)}</div>
						</td>
					</tr>
				)}
			</Fragment>
		);
	}
}

const TableBody = ({
	withIcon,
	data,
	headers,
	cancelDelayData,
	expandable,
}) => (
	<tbody
		className={classnames('table_body-wrapper', {
			with_icon: withIcon || false,
		})}
	>
		{data.map((row, rowIndex) => (
			<TableRow
				headers={headers}
				cancelDelayData={cancelDelayData}
				expandable={expandable}
				row={row}
				rowIndex={rowIndex}
			/>
		))}
	</tbody>
);

export default TableBody;
