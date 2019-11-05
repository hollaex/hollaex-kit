import React from 'react';

const TableHeader = ({ headers }) => (
	<thead className="table_header-wrapper">
		<tr className="table_header-row">
			{headers.map(({ label, className = '' }, index) => <th key={index} className={className}>{label}</th>)}
		</tr>
	</thead>
);

export default TableHeader;
