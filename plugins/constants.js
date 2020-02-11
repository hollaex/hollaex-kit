exports.PLUGINS = process.env.PLUGINS || 'kyc,bank,sms';
exports.PULGIN_PORT = process.env.PLUGIN_PORT || 10011;

// AWS_CONSTANTS -----------------------------
const ID_DOCS_BUCKET = process.env.ID_DOCS_BUCKET || '';
const [S3_BUCKET_NAME] = ID_DOCS_BUCKET.split(':');
exports.ID_DOCS_BUCKET = ID_DOCS_BUCKET;
exports.S3_BUCKET_NAME = S3_BUCKET_NAME || '';
exports.S3_WRITE_ACCESSKEYID = process.env.S3_WRITE_ACCESSKEYID || '';
exports.S3_WRITE_SECRETACCESSKEY = process.env.S3_WRITE_SECRETACCESSKEY || '';
exports.S3_READ_ACCESSKEYID = process.env.S3_READ_ACCESSKEYID || '';
exports.S3_READ_SECRETACCESSKEY = process.env.S3_READ_SECRETACCESSKEY || '';

exports.SES_ACCESSKEYID = process.env.SES_ACCESSKEYID || '';
exports.SES_SECRETACCESSKEY = process.env.SES_SECRETACCESSKEY || '';
exports.SES_REGION = process.env.SES_REGION || '';

exports.SNS_ACCESSKEYID = process.env.SNS_ACCESSKEYID || '';
exports.SNS_SECRETACCESSKEY = process.env.SNS_SECRETACCESSKEY || '';
exports.SNS_REGION = process.env.SNS_REGION || '';

// SMTP CONSTANTS --------------------------------
exports.SMTP_SERVER = process.env.SMTP_SERVER || 'smtp.gmail.com';
exports.SMTP_PORT = process.env.SMTP_PORT || 587;
exports.SMTP_USER = process.env.SMTP_USER;
exports.SMTP_PASSWORD = process.env.SMTP_PASSWORD;

// FRESHDESK_CONSTANTS
exports.FRESHDESK_HOST = process.env.FRESHDESK_HOST || '';
exports.FRESHDESK_KEY = process.env.FRESHDESK_KEY || '';
exports.FRESHDESK_AUTH = process.env.FRESHDESK_AUTH || '';

// SMS_CONSTANTS
exports.SMS_CODE_KEY = 'user:sms';
exports.SMS_CODE_EXPIRATION_TIME = 6 * 60; // seconds -> 6 min

// EMAIL_CONSTANTS
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

exports.BANK_FIELDS = [
	'id',
	'bank_name',
	'card_number',
	'account_number',
	'status'
];

exports.ADDRESS_FIELDS = ['city', 'address', 'country', 'postal_code'];

exports.ID_FIELDS = [
	'type',
	'number',
	'issued_date',
	'expiration_date',
	'status'
];

exports.USER_FIELD_ADMIN_LOG = [
	'full_name',
	'email',
	'dob',
	'gender',
	'nationality',
	'phone_number',
	'address',
	'id_data',
	'bank_account',
	'settings',
	'username'
];

exports.DEFAULT_TIMEZONE = process.env.EMAILS_TIMEZONE || '';

