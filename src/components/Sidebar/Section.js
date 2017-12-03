import React from 'react';
import classnames from 'classnames';

const Section = ({ title, goToSection, active, children }) => {
  return (
    <div className={classnames('sidebar_section-container', { active })}>
      <div
        className={classnames(
          'sidebar_section-title',
          {
            pointer: goToSection
          }
        )}
        onClick={goToSection}
      >
        <div className="sidebar_section-title-text">{title}</div>
      </div>
      {children}
    </div>
  )
}

Section.defaultProps = {
  title: '',
  active: false
}

export default Section;
