import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { EditWrapper } from 'components';
import Image from 'components/Image';

import '@material/button/dist/mdc.button.css';
import withConfig from 'components/ConfigProvider/withConfig';

const Button = ({
	label,
	onClick,
	type,
	disabled,
	className,
	autoFocus = false,
	iconId,
	iconList,
	position,
	lineHeight,
	currencyWallet,
	btnLabel,
	icons,
}) => {
	const getIcon = (iconId, iconList) => (
		<Image iconId={iconId} icon={iconList[iconId]} height={16} width={16} />
	);

	return (
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
								? icons['ARROW_DOWN']
								: icons['ARROW_UP']
						}
					/>
					<EditWrapper>{label}</EditWrapper>
				</div>
			) : (
				<EditWrapper>
					<div
						className={classnames('d-flex', {
							'reverse-direction': position === 'right',
						})}
					>
						{iconId && (
							<div className="flex button-icon">
								{getIcon(iconId, iconList)}
							</div>
						)}
						<div>{label}</div>
					</div>
				</EditWrapper>
			)}
		</button>
	);
};

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

export default withConfig(Button);
