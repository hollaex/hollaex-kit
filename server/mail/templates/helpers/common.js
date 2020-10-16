'use strict';

const {
	BITHOLLA_DOMAIN,
	BITHOLLA_LOGO_BLACK,
	EMAIL_ICONS
} = require('../../constants');
const { DOMAIN, GET_KIT_CONFIG } = require('../../../constants');
const LOGO_PATH = () => GET_KIT_CONFIG().logo_path;
const DEFAULT_LANGUAGE = () => GET_KIT_CONFIG().defaults.language;
const LINKS = () => GET_KIT_CONFIG().links;

const styles = require('./styles');

exports.Button = (link, text) => `
  <div style="${styles.buttonWrapper}">
    <a href="${link}" target="_blank">
      <Button style="${styles.button}">${text}</Button>
    </a>
  </div>
`;

const footerTemplate = (language = DEFAULT_LANGUAGE(), domain = DOMAIN) => {
	const { FOOTER } = require('../../strings').languageFile(language);
	return `
			<div style="${styles.footer}">
				<div style="float: left">
					${(LINKS().terms) ? `<a style="${styles.link}" href="${domain}">${FOOTER.PRIVACY_POLICY}</a>
					|
					<a style="${styles.link}" href="${domain}">${FOOTER.TERMS}</a>` : ''}
					<p>${FOOTER.INVITE_YOUR_FRIENDS} <a style="${styles.link_blue}" href="${domain}">${domain}</a><p>
				</div>
				<div style="float: right; font-size: 8px; text-align: right;">
					<div>
						<a href="${LINKS().twitter}">
							<img style="padding-right: 5px" src="${EMAIL_ICONS.TWITTER}" height="20"/>
						</a>
						<a href="${LINKS().facebook}">
							<img src="${EMAIL_ICONS.FACEBOOK}" height="20"/>
						</a>
					</div>
					<div style="${styles.poweredby}">
						${FOOTER.POWERED_BY} <a href="${BITHOLLA_DOMAIN}"><img src="${BITHOLLA_LOGO_BLACK}" height="10"/></a>
					</div>
				</div>
			</div>
		`;
};

const RTL = 'direction: rtl;';

const LOGO_TEMPLATE = ({ domain = DOMAIN, logoPath = LOGO_PATH() }) => `
  <div style="${styles.logo}">
    <a href="${domain}"><img src="${logoPath}" height="40"/></a>
  </div>
`;

const HEADER_TEMPLATE = ({ title, imagePath = '' }) => `
  <div style="${styles.header}">
    ${imagePath &&
			`
      <div style="${styles.header_icon_wrapper}">
        <img style="${styles.header_icon}" src="${imagePath}"/>
      </div>
    `}
    <div style="${styles.header_icon_title}">${title}</div>
  </div>
`;

const rtlLanguage = (lang) => (lang === 'fa' || lang === 'ar') ? RTL : '';

exports.TemplateEmail = (
	headerProps = {},
	content = '',
	language = DEFAULT_LANGUAGE(),
	domain = DOMAIN
) => {
	const bodyStyle = styles.body.concat('');

	return `
    <div style="${bodyStyle}">
      <div style="${styles.wrapper}">
			${LOGO_TEMPLATE(domain)}
				<div style="${styles.box_shadow}">
				  ${HEADER_TEMPLATE(headerProps)}
	        <div style="${styles.container}${rtlLanguage(language)}">
	  				${content}
	        </div>
	        ${footerTemplate(language, domain)}
				</div>
      </div>
    </div>
  `;
};
