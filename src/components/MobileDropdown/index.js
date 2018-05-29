import React from 'react';
import classnames from 'classnames';

export const MobileDropdown = ({ options = [], onChange, className }) => (
	<select
		className={classnames('d-flex', 'flex-row', 'drop-down', className)}
		onChange={onChange}
	>
		{Object.entries(options).map(([key, value]) => (
			<option key={key} value={value}>
				{value.toUpperCase()}
			</option>
		))}
	</select>
);
