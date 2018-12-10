import React from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';

const CheckTitle = ({
	title,
	icon,
	notifications,
	className,
	titleClassName
}) => {
	return (
		<div className={classnames('check_title-container', className)}>
			{title && (
				<div className={classnames('check_title-label', titleClassName)}>
					{title}
				</div>
			)}
			<div className="check_title-icon">
				{icon &&
					(icon.indexOf('.svg') > 0 ? (
						<ReactSVG path={icon} wrapperClassName="check_title-svg" />
					) : (
						<img alt={icon} src={icon} className="check_title-img" />
					))}
				{!!notifications && (
					<div className="check_title-notification">{notifications}</div>
				)}
			</div>
		</div>
	);
};

CheckTitle.defaultProps = {
	title: '',
	status: '',
	notifications: '',
	className: '',
	titleClassName: ''
};

export const PanelInformationRow = ({
	label = '',
	information = '',
	className,
	bold = true,
	disable = false
}) => (
	<div
		className={classnames(
			'd-flex',
			'justify-content-start',
			'align-items-center',
			'panel-information-row',
			className,
			{ 'panel-information-row-disable': disable }
		)}
	>
		<span style={{ wordBreak: 'normal' }}>{bold ? <b>{label}</b> : label}: {information}</span>
	</div>
);

export default CheckTitle;
