import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { EditWrapper } from 'components';
import Image from 'components/Image';

import '@material/button/dist/mdc.button.css';
import { STATIC_ICONS } from 'config/icons';

const Button = ({
	label,
	onClick,
	type,
	disabled,
	className,
	autoFocus = false,
	lineHeight,
	currencyWallet,
	btnLabel,
}) => (
	<button
		type={type}
		onClick={onClick}
		className={classnames(
			'holla-button',
			'mdc-button',
			'mdc-button--unelevated',
			'holla-button-font',
			lineHeight,
			{
				disabled,
			},
			className
		)}
		disabled={disabled}
		autoFocus={autoFocus}
	>
		{currencyWallet && currencyWallet ? (
			<div className="d-flex justify-content-center align-items-center">
				<Image
					wrapperClassName="mr-1 arrow-up-down-icon"
					icon={
						btnLabel && btnLabel === 'deposit'
							? STATIC_ICONS['ARROW_DOWN']
							: STATIC_ICONS['ARROW_UP']
					}
				/>
				<EditWrapper>{label}</EditWrapper>
			</div>
		) : (
			<EditWrapper>{label}</EditWrapper>
		)}
	</button>
);

Button.propTypes = {
	label: PropTypes.string.isRequired,
	onClick: PropTypes.func,
	type: PropTypes.string,
	disabled: PropTypes.bool,
};

Button.defaultProps = {
	type: 'submit',
	disabled: false,
	className: '',
};

export default Button;
