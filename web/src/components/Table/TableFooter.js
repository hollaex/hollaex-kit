import React from 'react';

const TableHeader = ({ data }) => (
	<tfoot className="table_footer-wrapper">
		<tr className="table_footer-row">
			{data.map(({ label }, index) => (
				<td key={index}>{label}</td>
			))}
		</tr>
	</tfoot>
);

export default TableHeader;
