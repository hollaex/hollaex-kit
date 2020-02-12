// SMTP CONSTANTS --------------------------------
exports.SMTP_SERVER = process.env.SMTP_SERVER || 'smtp.gmail.com';
exports.SMTP_PORT = process.env.SMTP_PORT || 587;
exports.SMTP_USER = process.env.SMTP_USER;
exports.SMTP_PASSWORD = process.env.SMTP_PASSWORD;

// EMAIL_CONSTANTS
const API_NAME = process.env.API_NAME;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL;
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'support@bitholla.com';
exports.SUPPORT_SOURCE = `'${API_NAME} Support <${SENDER_EMAIL}>'`;

const SEND_EMAIL_TO_SUPPORT =
	(process.env.SEND_EMAIL_TO_SUPPORT &&
		process.env.SEND_EMAIL_TO_SUPPORT === 'true') ||
	process.env.NODE_ENV === 'production';
exports.SEND_EMAIL_TO_SUPPORT = SEND_EMAIL_TO_SUPPORT;
exports.SUPPORT_EMAIL = SUPPORT_EMAIL;
exports.INQUIRY_EMAIL = SUPPORT_EMAIL;
exports.MASTER_EMAIL = ADMIN_EMAIL;
exports.BCC_ADDRESSES = SEND_EMAIL_TO_SUPPORT ? [exports.MASTER_EMAIL] : [];

exports.EMAIL_ICONS = {
	LOGO: 'https://s18.postimg.org/3tvqmytgp/exir_color_logos_1.png',
	EMAIL_ICON: 'https://s18.postimg.org/aquidipih/email.png',
	FACEBOOK:
		'https://s3.ap-northeast-2.amazonaws.com/public-holla-images/exir/facebook_icon.png',
	TWITTER:
		'https://s3.ap-northeast-2.amazonaws.com/public-holla-images/exir/twitter_icon.png'
};

exports.BITHOLLA_LOGO_BLACK =
	'https://s3.ap-northeast-2.amazonaws.com/public-holla-images/bitholla-logo.png';

exports.BITHOLLA_DOMAIN = 'https://bitholla.com';

exports.DEFAULT_TIMEZONE = process.env.EMAILS_TIMEZONE || '';


exports.SES_ACCESSKEYID = process.env.SES_ACCESSKEYID || '';
exports.SES_SECRETACCESSKEY = process.env.SES_SECRETACCESSKEY || '';
exports.SES_REGION = process.env.SES_REGION || '';