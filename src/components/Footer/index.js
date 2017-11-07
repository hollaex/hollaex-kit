import React from 'react';
import classnames from 'classnames';

const Footer = ({ title, status, className }) => {
  return (
    <div className={classnames('footer-container', className)}>
    footer
    </div>
  )
}

Footer.defaultProps = {
  className: '',
};

export default Footer;
