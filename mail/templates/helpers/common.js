'use strict';

const {
	DOMAIN,
	BITHOLLA_DOMAIN,
	DEFAULT_LANGUAGE,
	LOGO_BLACK_PATH,
	BITHOLLA_LOGO_BLACK,
	API_NAME,
	EMAIL_ICONS
} = require('../../../constants');
const styles = require('./styles');

exports.Button = (link, text) => `
  <div style="${styles.buttonWrapper}">
    <a href="${link}" target="_blank">
      <Button style="${styles.button}">${text}</Button>
    </a>
  </div>
`;

const footerTemplate = (language = DEFAULT_LANGUAGE, domain = DOMAIN) => {
	const { FOOTER } = require(`../../strings/${language}`);
	return `
			<div style="${styles.footer}">
				<div style="float: left">
					<a style="${styles.link}" href="https://hollaex.com">${
		FOOTER.PRIVACY_POLICY
	}</a>
					|
					<a style="${styles.link}" href="https://hollaex.com">${FOOTER.TERMS}</a>
					<p>${FOOTER.INVITE_YOUR_FRIENDS} <a style="${
		styles.link_blue
	}" href="${domain}">hollaex.com</a><p>
				</div>
				<div style="float: right; font-size: 8px; text-align: right;">
					<div>
						<a href="https://facebook.com/bitholla">
							<img style="padding-right: 5px" src="${EMAIL_ICONS.TWITTER}" height="20"/>
						</a>
						<a href="https://twitter.com/bitholla">
							<img src="${EMAIL_ICONS.FACEBOOK}" height="20"/>
						</a>
					</div>
					<div style="${styles.poweredby}">
						${
							FOOTER.POWERED_BY
						} <a href="${BITHOLLA_DOMAIN}"><img src="${BITHOLLA_LOGO_BLACK}" height="10"/></a>
					</div>
				</div>
			</div>
		`;
};

const close = `<div style="color: #E3E5E7"><br /><br />This is the end of the message.<br />--</div>`;

const RTL = 'direction: rtl;';

const LOGO_TEMPLATE = ({ domain = DOMAIN, logoPath = LOGO_BLACK_PATH }) => `
  <div style="${styles.logo}">
    <a href="${domain}"><img src="${logoPath}" height="25"/></a>
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

exports.TemplateEmail = (
	headerProps = {},
	content = '',
	language = DEFAULT_LANGUAGE,
	domain = DOMAIN
) => {
	const bodyStyle = styles.body.concat('');
	return `
    <div style="${bodyStyle}">
      <div style="${styles.wrapper}">
			${LOGO_TEMPLATE(domain)}
				<div style="${styles.box_shadow}">
				  ${HEADER_TEMPLATE(headerProps)}
	        <div style="${styles.container}">
	  				${content}
	        </div>
	        ${footerTemplate(language, domain)}
				</div>
      </div>
    </div>
  `;
};
