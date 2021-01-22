import React from 'react';
import classnames from 'classnames';

export const MobileDropdown = ({
	options = [],
	onChange,
	className,
	pairs,
	pair,
}) => {
	return (
		<div className="d-flex align-items-center">
			<select
				className={classnames(
					'd-flex',
					'flex-row',
					'drop-down',
					'default-coin',
					className,
					pair
				)}
				onChange={onChange}
			>
				{Object.entries(options).map(([key, value]) => {
					const pairCurrency = value.replace('/', '-');
					const { pair_base } = pairs[pairCurrency] || {};
					return (
						<option
							className={classnames('option', 'default-coin', pair_base)}
							key={key}
							value={value}
						>
							{value.toUpperCase()}
						</option>
					);
				})}
			</select>
			<div className="with_arrow_trade"></div>
		</div>
	);
};
