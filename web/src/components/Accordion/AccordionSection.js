import React from 'react';
import classnames from 'classnames';

const AccordionSection = ({
	accordionClassName = '',
	index,
	content,
	openSection,
	allowClose = true,
	isOpen = false,
	disabled = false,
	icon = '',
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
			{isOpen && <div className="accordion_section_content">{content}</div>}
		</div>
	);
};

export default AccordionSection;
