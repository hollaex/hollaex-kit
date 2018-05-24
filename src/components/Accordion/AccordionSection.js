import React from 'react';
import classnames from 'classnames';
import { isMobile } from 'react-device-detect';
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
	showActionText = false
}) => {
	const onClick = () => {
		if (!disabled) {
			openSection(index, !isOpen);
		}
	};
	const headerProps = {
		className: classnames(
			'accordion_section_title d-flex justify-content-between',
			{
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
				'accordion_section--open': isOpen,
				disabled: disabled
			})}
		>
			{<div {...headerProps}>
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
