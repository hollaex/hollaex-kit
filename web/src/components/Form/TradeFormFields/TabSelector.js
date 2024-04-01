import React from 'react';
import classnames from 'classnames';
import { EditWrapper } from 'components';

const TabSelector = (props) => {
	const { input, options } = props;

	return (
		<div className="trade_order_entry-selector d-flex">
			{options.map((option, index) => (
				<div
					key={`type-${index}`}
					className={classnames(
						'text-uppercase',
						'text-center',
						'pointer',
						input.value !== option.value ? option.className : '',
						{
							active: input.value === option.value,
						}
					)}
					onClick={() => input.onChange(option.value)}
				>
					<EditWrapper>{option.label}</EditWrapper>
				</div>
			))}
		</div>
	);
};

export default TabSelector;
