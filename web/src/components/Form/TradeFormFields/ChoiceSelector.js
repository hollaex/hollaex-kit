import React from 'react';
import classnames from 'classnames';
import { EditWrapper } from 'components';

const ChoiceSelector = (props) => {
	const { input, options } = props;

	return (
		<div className="trade_order_entry-action_selector d-flex">
			{options.map((option, index) => (
				<div
					key={`action-${index}`}
					className={classnames(
						'text-uppercase',
						'd-flex',
						'justify-content-center',
						'align-items-center',
						'pointer',
						option.value !== input.value ? option.className : '',
						'holla-button-font',
						{ active: option.value === input.value }
					)}
					onClick={() => input.onChange(option.value)}
				>
					<EditWrapper>{option.label}</EditWrapper>
				</div>
			))}
		</div>
	);
};

export default ChoiceSelector;
