import React from 'react';
import classnames from 'classnames';

const IconTitle = ({ text, iconPath, textType, underline, className }) => (
  <div className={classnames('icon_title-wrapper', { underline }, className)}>
    {iconPath &&
      <img src={iconPath} alt={text} className="icon_title-image" />
    }
    <div className={classnames('icon_title-text', textType)}>
      {text}
    </div>
  </div>
);

IconTitle.defaultProps = {
  iconPath: '',
  textType: '',
  underline: false,
}

export default IconTitle;
