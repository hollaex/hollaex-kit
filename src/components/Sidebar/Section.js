import React from 'react';

const Section = ({ title, goToSection, goToSectionText, active, children }) => {
  return (
    <div className={`sidebar_section-container ${active ? 'active' : ''}`}>
      <div className="sidebar_section-title pointer" onClick={goToSection}>
        <div className="sidebar_section-title-text">{title}</div>
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
