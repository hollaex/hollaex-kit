import { validateRequired, email, urlCheck } from '../../../components/AdminForm/validations';
import LANGUAGES from '../../../config/languages';

export const generateAdminSettings = (key) => {
    if (key === 'links') {
        return {
            twitter_instagram: {
                fields: {
                    twitter: {
                        type: 'input',
                        label: 'Twitter',
                        placeholder: 'twitter URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    },
                    instagram: {
                        type: 'input',
                        label: 'Instagram',
                        placeholder: 'instagram URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    }
                },
            },
            telegram_facebook: {
                fields: {
                    telegram: {
                        type: 'input',
                        label: 'Telegram',
                        placeholder: 'telegram URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    },
                    facebook: {
                        type: 'input',
                        label: 'Facebook',
                        placeholder: 'facebook URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    }
                },
            },
            linkedin_github: {
                fields: {
                    linkedin: {
                        type: 'input',
                        label: 'Linkedin',
                        placeholder: 'linkedin URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    },
                    github: {
                        type: 'input',
                        label: 'Github',
                        placeholder: 'github URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    }
                },
            },
            contact_helpdesk: {
                fields: {
                    contact: {
                        type: 'input',
                        label: 'Contact',
                        placeholder: 'contact URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    },
                    helpdesk: {
                        type: 'input',
                        label: 'Helpdesk',
                        placeholder: 'helpdesk URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    }
                },
            },
            terms_privacy: {
                fields: {
                    terms: {
                        type: 'input',
                        label: 'Terms',
                        placeholder: 'terms URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    },
                    privacy: {
                        type: 'input',
                        label: 'Privacy',
                        placeholder: 'privacy URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    }
                },
            },
            api_whitepaper: {
                fields: {
                    api: {
                        type: 'input',
                        label: 'API',
                        placeholder: 'api URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    },
                    whitepaper: {
                        type: 'input',
                        label: 'Whitepaper',
                        placeholder: 'whitepaper URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    }
                },
            },
            website_information: {
                fields: {
                    website: {
                        type: 'input',
                        label: 'Website',
                        placeholder: 'website URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    },
                    information: {
                        type: 'input',
                        label: 'Information',
                        placeholder: 'information URL',
                        // validate: [validateRequired],
                        className: 'w-50 mx-2'
                    }
                },
            }
        }
    } else if (key === 'security') {
        return {
            admin_whitelist: {
                type: 'select',
                mode: 'tags',
                label: 'Admin Whitelist IPs',
                placeholder: 'Admin whitelist',
                tokenSeparators: [',', ' ', '   '],
                validate: [validateRequired]
            },
            allowed_domains: {
                type: 'select',
                mode: 'tags',
                label: 'Allowed domains',
                placeholder: 'Allowed domains',
                tokenSeparators: [',', ' ', '   '],
                validate: [validateRequired]
            },
            site_key: {
                type: 'input',
                label: 'Captcha site key (Google ReCaptcha V3)',
                placeholder: 'Captcha site key (Google ReCaptcha V3)',
                validate: [validateRequired]
            },
            secret_key: {
                type: 'input',
                label: 'Captcha secret key (Google ReCaptcha V3)',
                placeholder: 'Captcha secret key (Google ReCaptcha V3)',
                validate: [validateRequired]
            }
        };
    } else if (key === 'email') {
        return {
            email_distribution_list: {
                admin: {
                    type: 'input',
                    label: 'Admin email',
                    placeholder: 'admin email',
                    validate: [validateRequired, email]
                },
                support: {
                    type: 'input',
                    label: 'Support email',
                    placeholder: 'Support email',
                    validate: [validateRequired, email]
                }
            },
            email_configuration: {
                sender: {
                    type: 'input',
                    label: 'Sender email (appears in the emails sent to the user as sender)',
                    placeholder: 'Sender email',
                    validate: [validateRequired, email]
                },
                send_email_to_support: {
                    type: 'checkbox',
                    label: 'send email to support',
                    // placeholder: 'send email to support',
                    // validate: [validateRequired]
                },
                timezone: {
                    type: 'select',
                    label: 'Email timezone',
                    placeholder: 'Select email timezone',
                    validate: [validateRequired],
                    options: minimalTimezoneSet
                },
                server: {
                    type: 'input',
                    label: 'SMTP server',
                    placeholder: 'SMTP sever',
                    validate: [validateRequired]
                },
                port: {
                    type: 'input',
                    label: 'SMTP port',
                    placeholder: 'SMTP port',
                    validate: [validateRequired]
                },
                user: {
                    type: 'input',
                    label: 'SMTP username',
                    placeholder: 'SMTP username',
                    validate: [validateRequired]
                },
                password: {
                    type: 'password',
                    label: 'SMTP password',
                    placeholder: 'SMTP password',
                    validate: [validateRequired]
                }
            }
        };
    } else {
        return {
            api_name: {
                type: 'input',
                label: 'Exchange Name',
                placeholder: 'Exchange Name',
                validate: [validateRequired]
            },
            title: {
                type: 'input',
                label: 'Title',
                placeholder: 'Title',
                validate: [validateRequired]
            },
            description: {
                type: 'textarea',
                label: 'Description',
                placeholder: 'Description',
                validate: [validateRequired]
            },
            new_user_is_activated: {
                type: 'checkbox',
                label: 'Allow new signups (If disabled new users can\'t signup on the platform)',
                // placeholder: 'New user is activated',
                // validate: [validateRequired]
            },
            language: {
                type: 'select',
                label: 'Default Language',
                placeholder: 'Select default language',
                validate: [validateRequired],
                options: LANGUAGES
            },
            valid_languages: {
                type: 'select',
                label: 'Valid languages',
                placeholder: 'Valid languages',
                validate: [validateRequired],
                multiSelect: true,
                options: LANGUAGES
            },
            theme: {
                type: 'select',
                label: 'Default Theme',
                placeholder: 'Select default theme',
                validate: [validateRequired],
                options: [
                    { label: 'White', value: 'white' },
                    { label: 'Dark', value: 'dark' }
                ]
            },
            logo_path: {
                type: 'input',
                label: 'Logo (Dark Color)',
                placeholder: 'Insert the logo path',
                validate: [validateRequired, urlCheck]
            },
            logo_black_path: {
                type: 'input',
                label: 'Logo (Light Color)',
                placeholder: 'Insert the logo path',
                validate: [validateRequired, urlCheck]
            }
        };
    }
};

export const minimalTimezoneSet = [
    { offset: '', label: 'UTC', value: 'UTC' },
    { offset: '-11:00', label: '(GMT-11:00) Pago Pago', value: 'Pacific/Pago_Pago' },
    { offset: '-10:00', label: '(GMT-10:00) Hawaii Time', value: 'Pacific/Honolulu' },
    { offset: '-10:00', label: '(GMT-10:00) Tahiti', value: 'Pacific/Tahiti' },
    { offset: '-09:00', label: '(GMT-09:00) Alaska Time', value: 'America/Anchorage' },
    { offset: '-08:00', label: '(GMT-08:00) Pacific Time', value: 'America/Los_Angeles' },
    { offset: '-07:00', label: '(GMT-07:00) Mountain Time', value: 'America/Denver' },
    { offset: '-06:00', label: '(GMT-06:00) Central Time', value: 'America/Chicago' },
    { offset: '-05:00', label: '(GMT-05:00) Eastern Time', value: 'America/New_York' },
    { offset: '-04:00', label: '(GMT-04:00) Atlantic Time - Halifax', value: 'America/Halifax' },
    { offset: '-03:00', label: '(GMT-03:00) Buenos Aires', value: 'America/Argentina/Buenos_Aires' },
    { offset: '-02:00', label: '(GMT-02:00) Sao Paulo', value: 'America/Sao_Paulo' },
    { offset: '-01:00', label: '(GMT-01:00) Azores', value: 'Atlantic/Azores' },
    { offset: '+00:00', label: '(GMT+00:00) London', value: 'Europe/London' },
    { offset: '+01:00', label: '(GMT+01:00) Berlin', value: 'Europe/Berlin' },
    { offset: '+01:00', label: '(GMT+01:00) Paris', value: 'Europe/Paris' },
    { offset: '+01:00', label: '(GMT+01:00) Rome', value: 'Europe/Rome' },
    { offset: '+02:00', label: '(GMT+02:00) Helsinki', value: 'Europe/Helsinki' },
    { offset: '+03:00', label: '(GMT+03:00) Moscow', value: 'Europe/Moscow' },
    { offset: '+03:00', label: '(GMT+03:00) Istanbul', value: 'Europe/Istanbul' },
    { offset: '+04:00', label: '(GMT+03:30) Tehran', value: 'Asia/Tehran' },
    { offset: '+04:00', label: '(GMT+04:00) Dubai', value: 'Asia/Dubai' },
    { offset: '+04:30', label: '(GMT+04:30) Kabul', value: 'Asia/Kabul' },
    { offset: '+05:00', label: '(GMT+05:00) Maldives', value: 'Indian/Maldives' },
    { offset: '+05:30', label: '(GMT+05:30) India Standard Time', value: 'Asia/Calcutta' },
    { offset: '+05:45', label: '(GMT+05:45) Kathmandu', value: 'Asia/Kathmandu' },
    { offset: '+06:00', label: '(GMT+06:00) Dhaka', value: 'Asia/Dhaka' },
    { offset: '+06:30', label: '(GMT+06:30) Cocos', value: 'Indian/Cocos' },
    { offset: '+07:00', label: '(GMT+07:00) Bangkok', value: 'Asia/Bangkok' },
    { offset: '+08:00', label: '(GMT+08:00) Hong Kong', value: 'Asia/Hong_Kong' },
    { offset: '+08:00', label: '(GMT+08:00) Kuala Lumpur', value: 'Asia/Kuala_Lumpur' },
    { offset: '+08:00', label: '(GMT+08:00) Singapore', value: 'Asia/Singapore' },
    { offset: '+08:00', label: '(GMT+08:00) Manila', value: 'Asia/Manila' },
    { offset: '+08:30', label: '(GMT+08:30) Pyongyang', value: 'Asia/Pyongyang' },
    { offset: '+09:00', label: '(GMT+09:00) Seoul', value: 'Asia/Seoul' },
    { offset: '+09:00', label: '(GMT+09:00) Tokyo', value: 'Asia/Tokyo' },
    { offset: '+09:30', label: '(GMT+09:30) Central Time - Darwin', value: 'Australia/Darwin' },
    { offset: '+10:00', label: '(GMT+10:00) Eastern Time - Brisbane', value: 'Australia/Brisbane' },
    { offset: '+10:30', label: '(GMT+10:30) Central Time - Adelaide', value: 'Australia/Adelaide' },
    { offset: '+11:00', label: '(GMT+11:00) Eastern Time - Melbourne, Sydney', value: 'Australia/Sydney' },
    { offset: '+12:00', label: '(GMT+12:00) Nauru', value: 'Pacific/Nauru' },
    { offset: '+13:00', label: '(GMT+13:00) Auckland', value: 'Pacific/Auckland' },
    { offset: '+14:00', label: '(GMT+14:00) Kiritimati', value: 'Pacific/Kiritimati' }
  ];
