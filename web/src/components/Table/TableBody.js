import React from 'react';
import classnames from 'classnames';

const RENDER_CELL = (row, key, cellIndex) => (
	<td key={cellIndex}>{row[key]}</td>
);

const renderRow = (headers = [], cancelDelayData) => (row, rowIndex) => {
	const isRemoveData = cancelDelayData.filter((data) => data === row.id);
	return (
		<tr
			className={classnames('table_body-row', {
				'cancel-row-color': !!isRemoveData.length,
			})}
			key={`row_${rowIndex}`}
		>
			{headers.map(({ key, renderCell = RENDER_CELL }, cellIndex) =>
				renderCell(row, key, cellIndex)
			)}
		</tr>
	);
};

const TableBody = ({ withIcon, data, headers, cancelDelayData }) => (
	<tbody
		className={classnames('table_body-wrapper', {
			with_icon: withIcon || false,
		})}
	>
		{data.map(renderRow(headers, cancelDelayData))}
	</tbody>
);

export default TableBody;
