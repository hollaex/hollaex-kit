import React from 'react';
import classnames from 'classnames';
import { ActionNotification } from '../';

const AccordionSection = ({
  accordionClassName = '',
  index,
  title,
  titleClassName = '',
  titleInformation,
  content,
  openSection,
  isOpen = false,
  disabled = false,
  notification,
  subtitle = '',
}) => {
  const onClick = () => {
    if (!disabled) {
      openSection(index, !isOpen);
    }
  }

  return (
    <div className={classnames('accordion_section', accordionClassName, {
      'accordion_section--open': isOpen,
      'disabled': disabled,
    })}>
      <div
        onClick={onClick}
        className={classnames('accordion_section_title d-flex justify-content-between', {
          'pointer': !disabled,
        })}
      >
        <span className={classnames('accordion_section_content_text', titleClassName, { 'with_arrow': !disabled })}>
          {title} {subtitle && <span className="accordion_section_content_text-subtitle">{subtitle}</span>}
        </span>
        {titleInformation}
        {notification &&
          <ActionNotification
            {...notification}
            onClick={notification.allowClick ? onClick : openSection}
            showPointer={notification.allowClick}
          />
        }
      </div>
      {isOpen && <div className="accordion_section_content">{content}</div>}

    </div>
  );
}

export default AccordionSection;
