import React from 'react';

const Section = ({ title, goToSection, children }) => {
  return (
    <div className="sidebar_section-container">
      <div className="sidebar_section-title">
        <div className="sidebar_section-title-text">{title}</div>
        <div onClick={goToSection} className="sidebar_section-title-action pointer">go</div>
      </div>
      {children}
    </div>
  )
}

Section.defaultProps = {
  title: 'section',
  goToSection: () => {},
}

export default Section;
