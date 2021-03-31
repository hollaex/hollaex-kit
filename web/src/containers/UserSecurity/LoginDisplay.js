import React from 'react';
import { Table } from '../../components';
import { TABLE_PAGE_SIZE } from './constants';

const LoginDisplay = (props) => {
	const {
		title,
		headers,
		data: { data, count },
		handleNext,
		jumpToPage,
	} = props;

	return (
		<div className="history_block-wrapper">
			<div className="title text-capitalize">{title}</div>

			<Table
				data={data}
				count={count}
				headers={headers}
				pageSize={TABLE_PAGE_SIZE}
				rowKey={(data) => {
					return data.id;
				}}
				title={title}
				handleNext={handleNext}
				jumpToPage={jumpToPage}
			/>
		</div>
	);
};

export default LoginDisplay;
