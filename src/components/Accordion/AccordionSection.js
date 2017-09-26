import React from 'react';
import classnames from 'classnames';

const AccordionSection = ({ index, title, content, openSection, isOpen = false, disabled = false }) => {
  const onClick = () => {
    if (!disabled) {
      openSection(index, !isOpen);
    }
  }

  return (
    <div className={classnames('accordion_section', {
      'accordion_section--open': isOpen,
      'disabled': disabled,
    })}>
      <div onClick={onClick} className="accordion_section_title">
        <span className="accordion_section_content_text">
          {title}
        </span>
      </div>
      {isOpen && <div className="accordion_section_content">{content}</div>}
    </div>
  );
}

export default AccordionSection;
