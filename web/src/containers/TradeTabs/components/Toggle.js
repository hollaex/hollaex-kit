import React from 'react';
import classnames from 'classnames';
import { EditWrapper } from 'components';
import { FLEX_CENTER_CLASSES } from 'config/constants';

const Toggle = ({ selected, options = [], toggle }) => {
	return (
		<div>
			<div className={classnames('toggle_button-wrapper', 'd-flex')}>
				<div
					className={classnames(
						'toggle-content',
						'f-0',
						...FLEX_CENTER_CLASSES,
						'direction_ltr'
					)}
				>
					<div className={classnames('selected', selected)}>
						<div
							className={'app-bar-account-content app-bar-account-moon-content'}
						>
							<EditWrapper>{options[0].label}</EditWrapper>
						</div>
					</div>
					<div
						onClick={toggle}
						className={classnames('toggle-action_button', {
							left: options[0].value === selected,
							right: options[1].value === selected,
						})}
					>
						<div className="toggle-action_button-display" />
					</div>
					<div className={classnames('selected', selected)}>
						<div className="app-bar-account-content app-bar-account-moon-content">
							<EditWrapper>{options[1].label}</EditWrapper>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Toggle;
