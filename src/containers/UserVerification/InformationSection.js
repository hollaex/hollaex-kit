import React from 'react';

export const InformationSection = ({ title, children }) => (
  <div className="information_section">
    <span className="information_section_title">
      {title}
    </span>
    {children}
  </div>
);
