import React from 'react';
import classnames from 'classnames';
import ReactSvg from 'react-svg';
import { ActionNotification } from '../';

const AccordionSection = ({
	accordionClassName = '',
	index,
	title,
	titleClassName = '',
	titleInformation,
	content,
	openSection,
	allowClose = true,
	isOpen = false,
	disabled = false,
	notification,
	subtitle = '',
	showActionText = false,
	icon = ''
}) => {
	const onClick = () => {
		if (!disabled) {
			openSection(index, !isOpen);
		}
	};
	const headerProps = {
		className: classnames(
			'accordion_section_title d-flex',
			{
				'accordion_section--open': isOpen,
				'justify-content-between': !icon,
				pointer: !disabled && allowClose
			}
		)
	};

	if (allowClose) {
		headerProps.onClick = onClick;
	}

	return (
		<div
			className={classnames('accordion_section', accordionClassName, {
				disabled: disabled
			})}
		>
			{<div {...headerProps}>
				<span className={classnames('sidebar_hub-icon', {
					'd-flex align-items-center justify-content-center': icon
				})}>
					{icon && <span><ReactSvg path={icon} wrapperClassName="sidebar_hub-section-icon" /></span>}
					<span
						className={classnames(
							'accordion_section_content_text',
							titleClassName,
							{ with_arrow: !disabled && allowClose }
						)}
					>
						{title}{' '}
						{subtitle && (
							<span className="accordion_section_content_text-subtitle">
								{subtitle}
							</span>
						)}
					</span>
				</span>
				{titleInformation}
				{notification && (
					<ActionNotification
						{...notification}
						onClick={
							notification.allowClick
								? notification.onClick ? notification.onClick : onClick
								: openSection
						}
						showPointer={notification.allowClick}
						useSvg={true}
						showActionText={showActionText}
					/>
				)}
			</div>}
			{isOpen && <div className="accordion_section_content">{content}</div>}
		</div>
	);
};

export default AccordionSection;
