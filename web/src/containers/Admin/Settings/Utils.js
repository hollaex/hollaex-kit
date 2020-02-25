import { required, email } from '../../../components/Form/validations';

export const generateAdminSettings = (key) => {
    if (key === 'security') {
        return {
            admin_whitelist: {
                type: 'input',
                label: 'Admin whitelist',
                placeholder: 'Admin whitelist',
                validate: [required]
            },
            allowed_domain: {
                type: 'input',
                label: 'Allowed domain',
                placeholder: 'Allowed domain',
                validate: [required]
            },
            web_captcha_site_key: {
                type: 'input',
                label: 'Captcha site key',
                placeholder: 'Captcha site key',
                validate: [required]
            },
            web_captcha_secret_key: {
                type: 'input',
                label: 'Captcha secret key',
                placeholder: 'Captcha secret key',
                validate: [required]
            }
        };
    } else if (key === 'email') {
        return {
            sender_email: {
                type: 'input',
                label: 'Sender email',
                placeholder: 'Sender email',
                validate: [required, email]
            },
            support_email: {
                type: 'input',
                label: 'Support email',
                placeholder: 'Support email',
                validate: [required, email]
            },
            admin_email: {
                type: 'input',
                label: 'Admin email',
                placeholder: 'admin email',
                validate: [required, email]
            },
            smtp_server: {
                type: 'input',
                label: 'SMTP server',
                placeholder: 'SMTP sever',
                validate: [required]
            },
            smtp_port: {
                type: 'input',
                label: 'SMTP port',
                placeholder: 'SMTP port',
                validate: [required]
            },
            smtp_username: {
                type: 'input',
                label: 'SMTP username',
                placeholder: 'SMTP username',
                validate: [required]
            },
            smtp_password: {
                type: 'password',
                label: 'SMTP password',
                placeholder: 'SMTP password',
                validate: [required]
            }
        };
    } else {
        return {
            api_name: {
                type: 'input',
                label: 'API name',
                placeholder: 'API name',
                validate: [required]
            },
            new_user_is_activated: {
                type: 'checkbox',
                label: 'New user is activated',
                // placeholder: 'New user is activated',
                validate: [required]
            },
            new_user_default_language: {
                type: 'select',
                label: 'Default language',
                placeholder: 'Select default language',
                validate: [required],
                options: [
                    { label: 'ko', value: 'ko' },
                    { label: 'en', value: 'en' }
                ]
            },
            email_timezone: {
                type: 'select',
                label: 'Email timezone',
                placeholder: 'Select email timezone',
                validate: [required],
                options: [
                    { label: 'Asia/Seoul', value: 'Asia/Seoul' },
                    { label: 'UTC', value: 'UTC' }
                ]
            },
            default_theme: {
                type: 'select',
                label: 'Default theme',
                placeholder: 'Select default theme',
                validate: [required],
                options: [
                    { label: 'white', value: 'white' },
                    { label: 'dark', value: 'dark' }
                ]
            },
            logo_path: {
                type: 'input',
                label: 'Logo path',
                placeholder: 'Logo path',
                validate: [required]
            },
            logo_dark_path: {
                type: 'input',
                label: 'Logo path in Dark theme',
                placeholder: 'Logo path in Dark theme',
                validate: [required]
            },
            valid_languages: {
                type: 'input',
                label: 'Valid languages',
                placeholder: 'Valid languages',
                validate: [required]
            },
            default_country: {
                type: 'select',
                label: 'Default country',
                placeholder: 'Select default country',
                validate: [required],
                options: [
                    { label: 'KR', value: 'KR' },
                    { label: 'US', value: 'US' }
                ]
            }
        };
    }
};

