import React from 'react';
import classnames from 'classnames';
import { ReactSVG } from 'react-svg';
import { Link } from 'react-router';
export const Section = ({
	title,
	onClickTitle,
	icon,
	children,
	childrenClassName,
	active,
	path,
}) => {
	return (
		<div
			className={classnames('sidebar_hub-section d-flex flex-column', {
				'section-active': active,
			})}
		>
			<div className="sidebar_hub-section-header d-flex">
				<ReactSVG src={icon} className="sidebar_hub-section-icon" />
				<div className="sidebar_hub-section-title f-1 text-uppercase title-font">
					<Link to={path}>{title}</Link>
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
	childrenClassName: '',
};
