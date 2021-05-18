'use strict';

const {
	BITHOLLA_DOMAIN,
	BITHOLLA_LOGO_BLACK,
} = require('../../constants');
const { DOMAIN, GET_KIT_CONFIG } = require('../../../constants');
const LOGO_IMAGE = () => GET_KIT_CONFIG().logo_image;
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
	const FOOTER = require('../../strings').getStringObject(language, 'FOOTER');
	return `
			<div style="${styles.footer}">
				<div style="float: left">
					<p><a style="${styles.link_blue}" href="${domain}">${domain}</a><p>
				</div>
				<div style="float: right; font-size: 8px; text-align: right;">
					${
						!LINKS().hide_referral_badge
							? `<div style="${styles.poweredby}">
							<a href="${
								LINKS().referral_link && LINKS().referral_label
									? LINKS().referral_link
									: BITHOLLA_DOMAIN
							}">
								${
									LINKS().referral_label
										? LINKS().referral_label
										: `${
												FOOTER.POWERED_BY
										  } <img src="${BITHOLLA_LOGO_BLACK}" height="10"/>`
								}
							</a>
						</div>`
							: ''
					}
				</div>
			</div>
		`;
};

const RTL = 'direction: rtl;';

const LOGO_TEMPLATE = ({ domain = DOMAIN, logoPath = LOGO_IMAGE() }) => `
  <div style="${styles.logo}">
    <a href="${domain}"><img src="${logoPath}" height="40"/></a>
  </div>
`;

const rtlLanguage = (lang) => (lang === 'fa' || lang === 'ar' ? RTL : '');

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
			<div style="${styles.box_shadow}">
				${LOGO_TEMPLATE(domain)}
				<div style="${styles.container}${rtlLanguage(language)}">
					${content}
				</div>
				${footerTemplate(language, domain)}
			</div>
		</div>
	</div>
  `;
};