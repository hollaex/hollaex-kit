import React from 'react';
import classnames from 'classnames';

const TabSelector = (props) => {
	const { input, options } = props;

	return (
		<div className="trade_order_entry-selector d-flex">
			{options.map((option, index) => (
				<div
					key={`type-${index}`}
					className={classnames('text-uppercase', 'text-center', 'pointer', {
						active: input.value === option.value,
					})}
					onClick={() => input.onChange(option.value)}
				>
					{option.label}
				</div>
			))}
		</div>
	);
};

export default TabSelector;
