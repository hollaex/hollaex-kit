import React, { useState, Fragment } from 'react';
import classnames from 'classnames';

const RENDER_CELL = (row, key, cellIndex) => (
	<td key={cellIndex}>{row[key]}</td>
);

const renderRow = (headers = [], cancelDelayData, expandable = {}) => (
	row,
	rowIndex
) => {
	const { rowExpandable, expandedRowRender } = expandable;
	const [isExpanded, setIsExpanded] = useState(false);
	const isRemoveData = cancelDelayData.filter((data) => data === row.id);
	const isExpandable = rowExpandable(row);

	const onExpand = () => {
		if (isExpandable) {
			setIsExpanded(!isExpanded);
		}
	};

	return (
		<Fragment>
			<tr
				className={classnames('table_body-row', {
					'cancel-row-color': !!isRemoveData.length,
				})}
				key={`row_${rowIndex}`}
				onClick={onExpand}
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
};

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
		{data.map(renderRow(headers, cancelDelayData, expandable))}
	</tbody>
);

export default TableBody;
