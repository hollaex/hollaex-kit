import React from 'react';
import classnames from 'classnames';

const RENDER_CELL = (row, key, cellIndex) => <td key={cellIndex}>{row[key]}</td>;

const renderRow = (headers = []) => (row, rowIndex) => (
	<tr className="table_body-row" key={`row_${rowIndex}`}>
		{headers.map(({ key, renderCell = RENDER_CELL }, cellIndex) =>
			renderCell(row, key, cellIndex)
		)}
	</tr>
);

const TableBody = ({ withIcon, data, headers }) => (
	<tbody
		className={classnames('table_body-wrapper', {
			with_icon: withIcon || false
		})}
	>
		{data.map(renderRow(headers))}
	</tbody>
);

export default TableBody;
