import React from 'react';
import classnames from 'classnames';

import { FLEX_CENTER_CLASSES } from '../../config/constants';

const ToogleButton = ({ onToogle, values, selected }) => (
	<div className={classnames('toogle_button-wrapper', 'd-flex')}>
		<div className="toogle-side_line f-1" />
		<div
			className={classnames(
				'toogle-content',
				'f-0',
				...FLEX_CENTER_CLASSES,
				'direction_ltr'
			)}
		>
			<div className={classnames({ selected: values[0].value === selected })}>
				{values[0].label}
			</div>
			<div
				onClick={onToogle}
				className={classnames('toogle-action_button', {
					left: values[0].value === selected,
					right: values[1].value === selected,
				})}
			>
				<div className="toogle-action_button-display" />
			</div>
			<div className={classnames({ selected: values[1].value === selected })}>
				{values[1].label}
			</div>
		</div>
		<div className="toogle-side_line f-1" />
	</div>
);

export default ToogleButton;
