import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';

import { TEXTS } from './constants';

const Footer = ({ title, status, className }) => {
  return (
    <div className={classnames('footer-container', 'd-flex', 'flex-column', className)}>
      <div className={classnames('d-flex', 'justify-content-around', 'footer-row-content')}>
        <div className={classnames('d-flex', 'justify-content-center', 'align-items-start', 'footer-links-section')}>
          {TEXTS.SECTIONS.map(({ TITLE, LINKS }, index) => (
            <div key={index} className={classnames('d-flex', 'flex-column', 'footer-links-group')}>
              <div className="footer-links-section--title">{TITLE}</div>
              <div className={classnames('d-flex', 'flex-column', 'footer-links-section--list')}>
                {LINKS.map(({ link, text}, indexLink) => <Link to={link || '#'}  key={indexLink}>{text}</Link>)}
              </div>
            </div>
          ))}
        </div>

        <div className={classnames('d-flex', 'justify-content-center', 'footer-public-section', 'flex-column')}>
          <div className="footer-public-texts">
            {TEXTS.PUBLIC.TEXTS.map((text, index) => (
              <div key={index} className="footer-public-texts-text">{text}</div>
            ))}
          </div>
          <div className="footer-public-links d-flex">
            {TEXTS.PUBLIC.LINKS.map(({ icon, link, type }, index) => (
              <Link to={link || '#'} key={index}>
                <img src={icon} alt={type} className="footer-public-links-icon" />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className={classnames('d-flex', 'justify-content-between', 'footer-row-bottom', 'f-1')}>
        <div>
          <span className="text-weight-bold">{TEXTS.LANGUAGE.TEXT}:</span>
          {TEXTS.LANGUAGE.LANGUAGES.join(' ')}
        </div>
        <div>{TEXTS.COPYRIGHT}</div>
      </div>
    </div>
  )
}

Footer.defaultProps = {
  className: '',
};

export default Footer;
