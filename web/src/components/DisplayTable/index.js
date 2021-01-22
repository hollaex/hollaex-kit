import React from 'react';
import classnames from 'classnames';

const DisplayTable = (props) => {
	const { headers, data, rowClassName } = props;

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
				{headers.map(({ label, className = '' }, index) => (
					<div
						key={index}
						className={classnames('display_table-cell f-1', className)}
					>
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
						<div
							key={rowIndex}
							className={classnames('display_table-cell d-flex', rowClassName)}
						>
							{headers.map(({ key, renderCell, className }, cellIndex) => (
								<div
									key={`${rowIndex}-${cellIndex}`}
									className={classnames('f-1 text_overflow', className)}
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
