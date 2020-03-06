import React from 'react';
import { validateRequired, checkS3bucketUrl } from '../../../components/AdminForm/validations';
import { ICONS } from '../../../config/constants';

export const allPlugins = ['kyc', 'sns', 'bank', 'sms', 's3', 'freshdesk', 'zendesk', 'chat', 'vault'];

export const allPluginsData = {
    'vault': {
        key: 'vault',
        title: 'Vault',
        sub_title: <div>
            <div>Add your Vault crypto business wallet to manage your exchange, payments, user balances and more in a secure manner</div>
            <div>
                <a className="blue-link" href="https://bitholla.com/vault/" target="blank">
                    https://bitholla.com/vault/
                </a>
            </div>
        </div>,
        icon: ICONS.PLUGINS_VAULT
    },
    'kyc': {
        key: 's3',
        title: 'Verification System',
        sub_title: 'Add a KYC verification module',
        description: 'Upload documents, input identity info, send SMS verification (requires SMS plugin).',
        icon: ICONS.PLUGINS_VERIFICATION
    },
    'freshdesk': {
        key: 'freshdesk',
        title: 'Customer Support',
        sub_title: 'Dedicated customer support system.',
        description: <div>
            <div>Requires an account with Freshdesk.</div>
            <div>
                <a className="blue-link" href="https://freshdesk.com/signup" target="blank">
                    https://freshdesk.com/signup
                </a>
            </div>
        </div>,
        icon: ICONS.PLUGINS_FRESHDESK
    },
    'zendesk': {
        key: 'zendesk',
        title: 'Zendesk',
        sub_title: 'Dedicated customer support system.',
        description: <div>
            <div>Requires an account with Zendesk.</div>
            <div>
                <a className="blue-link" href="https://zendesk.com/signup" target="blank">
                    https://zendesk.com/signup
                </a>
            </div>
        </div>,
        icon: ICONS.PLUGINS_ZENDESK
    },
    'chat': {
        key: 'chat',
        title: 'Chat Troll Box',
        sub_title: 'Add a troll box (chat system) for your traders to troll the crypto markets all day long.',
        description: 'Chat can be popped out. Admin can delete message.',
        icon: ICONS.PLUGINS_CHAT
    },
    'sms': {
        key: 'sns',
        title: 'Automatic SMS',
        sub_title: 'Verify your users by SMS without making them deal with verification codes.',
        description: 'Requires outside setup',
        icon: ICONS.PLUGINS_SMS
    },
    'bank': {
        key: 'bank',
        title: 'Bank',
        sub_title: 'Add a bank service module to allow for fiat currency deposit and withdrawal into your exchange',
        icon: ICONS.PLUGINS_BANK
    }
};

export const getPluginsForm = (key) => {
    const formData = {
        'kyc': {
            id_docs_bucket: {
                type: 'input',
                label: 'ID DOCS BUCKET',
                placeholder: 'ID DOCS BUCKET',
                validate: [validateRequired, checkS3bucketUrl]
            },
            key: {
                type: 'input',
                label: 'Access key',
                placeholder: 'AWS S3 Access key',
                validate: [validateRequired]
            },
            secret: {
                type: 'input',
                label: 'Secret key',
                placeholder: 'AWS S3 Secret Key',
                validate: [validateRequired]
            }
        },
        'sms': {
            key: {
                type: 'input',
                label: 'Access key',
                placeholder: 'AWS SNS Access key',
                validate: [validateRequired]
            },
            secret: {
                type: 'input',
                label: 'Secret key',
                placeholder: 'AWS SNS Secret key',
                validate: [validateRequired]
            },
            region: {
                type: 'input',
                label: 'Region',
                placeholder: 'AWS SNS Region',
                validate: [validateRequired]
            }
        },
        'freshdesk': {
            host: {
                type: 'input',
                label: 'Freshdesk Host URL',
                placeholder: 'Freshdesk Host URL',
                validate: [validateRequired]
            },
            key: {
                type: 'input',
                label: 'Freshdesk Access key',
                placeholder: 'Freshdesk Access key',
                validate: [validateRequired]
            },
            auth: {
                type: 'input',
                label: 'Freshdesk Auth key',
                placeholder: 'Freshdesk Auth key',
                validate: [validateRequired]
            }
        },
        'vault': {
            // name: {
            //     type: 'input',
            //     label: 'Name',
            //     placeholder: 'Vault name',
            //     validate: [validateRequired]
            // },
            key: {
                type: 'input',
                label: 'Access key',
                placeholder: 'Vault access key',
                validate: [validateRequired]
            },
            secret: {
                type: 'input',
                label: 'Secret key',
                placeholder: 'Vault secret key',
                validate: [validateRequired]
            }
        }
    };
    return formData[key] || {};
}