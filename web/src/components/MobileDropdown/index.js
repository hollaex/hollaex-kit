import React from 'react';
import classnames from 'classnames';

export const MobileDropdown = ({ options = [], onChange, className }) => (
	<div className='d-flex align-items-center'>
		<select
			className={classnames('d-flex', 'flex-row', 'drop-down', className)}
			onChange={onChange}
		>
			{Object.entries(options).map(([key, value]) => (
				<option className="option" key={key} value={value}>
					{value.toUpperCase()}
				</option>
			))}
		</select>
		<div className='with_arrow_trade'></div>
	</div>
);
