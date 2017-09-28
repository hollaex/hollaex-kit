import React from 'react';

const IconTitle = ({ text, iconPath }) => (
  <div className="icon_title-wrapper">
    <img src={iconPath} alt={text}  className="icon_title-image" />
    <div className="icon_title-text">{text}</div>
  </div>
)

export default IconTitle;
