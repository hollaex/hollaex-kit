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

exports.SNS_ACCESSKEYID = process.env.SNS_ACCESSKEYID || '';
exports.SNS_SECRETACCESSKEY = process.env.SNS_SECRETACCESSKEY || '';
exports.SNS_REGION = process.env.SNS_REGION || '';

// FRESHDESK_CONSTANTS
exports.FRESHDESK_HOST = process.env.FRESHDESK_HOST || '';
exports.FRESHDESK_KEY = process.env.FRESHDESK_KEY || '';
exports.FRESHDESK_AUTH = process.env.FRESHDESK_AUTH || '';

// SMS_CONSTANTS
exports.SMS_CODE_KEY = 'user:sms';
exports.SMS_CODE_EXPIRATION_TIME = 6 * 60; // seconds -> 6 min

// KYC_BANK_CONSTANTS
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
exports.ADDRESS_FIELDS = ['city', 'address', 'country', 'postal_code'];
exports.VERIFY_STATUS = {
	EMPTY: 0,
	PENDING: 1,
	REJECTED: 2,
	COMPLETED: 3
};
exports.SETTINGS_KEYS = [
	'language',
	'notification',
	'interface',
	'audio',
	'risk',
	'chat'
];