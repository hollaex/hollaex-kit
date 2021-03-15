import React from 'react';
import { EditWrapper } from 'components';

const TableHeader = ({ headers }) => (
	<thead className="table_header-wrapper">
		<tr className="table_header-row">
			{headers.map(({ label, className = '', stringId }, index) => (
				<th key={index} className={className}>
					<EditWrapper stringId={stringId}>{label}</EditWrapper>
				</th>
			))}
		</tr>
	</thead>
);

export default TableHeader;
