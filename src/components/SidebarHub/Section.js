import React from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';

export const Section = ({
	title,
	onClickTitle,
	icon,
	children,
	childrenClassName,
	active,
	onClickHeader
}) => {
	const headerProps = {};
	if (onClickHeader) {
		headerProps.onClick = onClickHeader;
	}
	return (
		<div
			className={classnames('sidebar_hub-section d-flex flex-column', {
				'section-active': active
			})}
		>
			<div
				className={classnames('sidebar_hub-section-header d-flex', {
					pointer: onClickHeader
				})}
				{...headerProps}
			>
				<ReactSVG path={icon} wrapperClassName="sidebar_hub-section-icon" />
				<div className="sidebar_hub-section-title f-1 text-uppercase title-font">
					{title}
				</div>
			</div>
			{children && (
				<div className={`sidebar_hub-section-content f-1 ${childrenClassName}`}>
					{children}
				</div>
			)}
		</div>
	);
};

Section.defaultProps = {
	active: false,
	childrenClassName: ''
};
