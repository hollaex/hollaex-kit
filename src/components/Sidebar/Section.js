import React from 'react';
import { ActionNotification } from '../';
import { ICONS } from '../../config/constants';

const Section = ({ title, goToSection, goToSectionText, active, children }) => {
  console.log(active)
  return (
    <div className={`sidebar_section-container ${active ? 'active' : ''}`}>
      <div className="sidebar_section-title">
        <div className="sidebar_section-title-text">{title}</div>
        <ActionNotification
          text={goToSectionText}
          onClick={goToSection}
          iconPath={ICONS.BLUE_PLUS}
          status="information"
        />
      </div>
      {children}
    </div>
  )
}

Section.defaultProps = {
  title: 'section',
  goToSection: () => {},
  goToSectionText: 'go',
  active: false
}

export default Section;
