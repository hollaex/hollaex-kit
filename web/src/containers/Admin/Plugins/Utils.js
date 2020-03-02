import React from 'react';
import { validateRequired, checkS3bucketUrl } from '../../../components/AdminForm/validations';
import { ICONS } from '../../../config/constants';

export const allPlugins = ['kyc', 'sns', 'bank', 'sms', 's3', 'freshdesk', 'zendesk', 'chat', 'vault'];

export const allPluginsData = {
    'kyc': {
        title: 'Verification System',
        sub_title: 'Add a KYC verification module',
        description: 'Upload documents, input identity info, send SMS verification (requires SMS plugin).',
        icon: ICONS.PLUGINS_VERIFICATION
    },
    'sns': {
        title: 'SNS',
        sub_title: 'Add a Simple Notification Service module',
        icon: ICONS.PLUGINS_SMS
    },
    'bank': {
        title: 'Bank',
        sub_title: 'Add a Bank Service module',
        icon: ICONS.PLUGINS_LIQUIDITY
    },
    'sms': {
        title: 'Automatic SMS',
        sub_title: 'Verify your users by SMS without making them deal with verification codes.',
        description: 'Requires outside setup',
        icon: ICONS.PLUGINS_SMS
    },
    's3': {
        title: 'S3',
        sub_title: 'Add a S3 module',
        icon: ICONS.PLUGINS_SHUFTI
    },
    'freshdesk': {
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
        title: 'Chat Troll Box',
        sub_title: 'Add a troll box (chat system) for your traders to troll the crypto markets all day long.',
        description: 'Chat can be popped out. Admin can delete message.',
        icon: ICONS.PLUGINS_CHAT
    },
    'vault': {
        title: 'Vault',
        sub_title: 'Add a Vault service',
        icon: ICONS.PLUGINS_CHAT
    }
};

export const getPluginsForm = (key, all = false) => {
    const formData = {
        's3': {
            id_docs_bucket: {
                type: 'input',
                label: 'ID DOCS BUCKET',
                placeholder: 'ID DOCS BUCKET',
                validate: [validateRequired, checkS3bucketUrl]
            },
            access_key: {
                type: 'input',
                label: 'Access key',
                placeholder: 'AWS S3 Access key',
                validate: [validateRequired]
            },
            secret_key: {
                type: 'input',
                label: 'Secret key',
                placeholder: 'AWS S3 Secret Key',
                validate: [validateRequired]
            }
        },
        'sns': {
            access_Key: {
                type: 'input',
                label: 'Access key',
                placeholder: 'AWS SNS Access key',
                validate: [validateRequired]
            },
            secret_Key: {
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
            access_key: {
                type: 'input',
                label: 'Freshdesk Access key',
                placeholder: 'Freshdesk Access key',
                validate: [validateRequired]
            },
            auth_key: {
                type: 'input',
                label: 'Freshdesk Auth key',
                placeholder: 'Freshdesk Auth key',
                validate: [validateRequired]
            }
        },
        'vault': {
            vault_name: {
                type: 'input',
                label: 'Name',
                placeholder: 'Vault name',
                validate: [validateRequired]
            },
            vault_key: {
                type: 'input',
                label: 'Access key',
                placeholder: 'Vault access key',
                validate: [validateRequired]
            },
            vault_secret: {
                type: 'input',
                label: 'Secret key',
                placeholder: 'Vault secret key',
                validate: [validateRequired]
            }
        }
    };
    if (all) return formData;
    return formData[key] || {};
}