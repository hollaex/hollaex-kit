import React from 'react';
import { ActionNotification } from '../';

const Section = ({ title, goToSection, goToSectionText, active, children }) => {
  console.log(active)
  return (
    <div className={`sidebar_section-container ${active ? 'active' : ''}`}>
      <div className="sidebar_section-title">
        <div className="sidebar_section-title-text">{title}</div>
        <ActionNotification
          text={goToSectionText}
          onClick={goToSection}
          iconPath={`${process.env.PUBLIC_URL}/assets/acounts/account-icons-07.png`}
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
