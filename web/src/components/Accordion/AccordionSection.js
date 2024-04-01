import React from 'react';
import classnames from 'classnames';
import Image from 'components/Image';
import { EditWrapper } from 'components';
import { ActionNotification } from '../';

const AccordionSection = ({
	accordionClassName = '',
	index,
	stringId,
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
	icon = '',
	iconId,
	showHeader = true,
}) => {
	const onClick = () => {
		if (!disabled) {
			openSection(index, !isOpen);
		}
	};
	const headerProps = {
		className: classnames('accordion_section_title d-flex', {
			'accordion_section--open': isOpen,
			'justify-content-between': !icon,
			pointer: !disabled && allowClose,
		}),
	};

	if (allowClose) {
		headerProps.onClick = onClick;
	}

	return (
		<div
			className={classnames('accordion_section', accordionClassName, {
				disabled: disabled,
			})}
		>
			{showHeader && (
				<div {...headerProps}>
					<span
						className={classnames('sidebar_hub-icon', {
							'd-flex align-items-center justify-content-center': icon,
						})}
					>
						<span>
							<Image icon={icon} wrapperClassName="sidebar_hub-section-icon" />
						</span>
						<span
							className={classnames(
								'accordion_section_content_text',
								titleClassName,
								{ with_arrow: !disabled && allowClose }
							)}
						>
							<EditWrapper stringId={title}>{title} </EditWrapper>
							{subtitle && (
								<span className="accordion_section_content_text-subtitle">
									<EditWrapper stringId={subtitle}>{subtitle}</EditWrapper>
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
									? notification.onClick
										? notification.onClick
										: onClick
									: openSection
							}
							showPointer={notification.allowClick}
							showActionText={showActionText}
						/>
					)}
				</div>
			)}
			{isOpen && <div className="accordion_section_content">{content}</div>}
		</div>
	);
};

export default AccordionSection;
