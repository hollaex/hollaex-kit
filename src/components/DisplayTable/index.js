import React from 'react';
import classnames from 'classnames';

const DisplayTable = (props) => {
	const { headers, data } = props;

	return (
		<div
			className={classnames(
				'display_table-wrapper',
				'd-flex',
				'flex-column',
				'f-1'
			)}
		>
			<div className={classnames('display_table-header', 'd-flex')}>
				{headers.map(({ label }, index) => (
					<div key={index} className="display_table-cell f-1">
						{label}
					</div>
				))}
			</div>
			<div
				className={classnames(
					'display_table-body',
					'd-flex',
					'flex-column',
					'f-1'
				)}
			>
				{data.map((row, rowIndex) => {
					return (
						<div key={rowIndex} className="display_table-cell d-flex">
							{headers.map(({ key, renderCell }, cellIndex) => (
								<div
									key={`${rowIndex}-${cellIndex}`}
									className="f-1 text_overflow"
								>
									{renderCell(row, `${rowIndex}-${cellIndex}`)}
								</div>
							))}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default DisplayTable;
