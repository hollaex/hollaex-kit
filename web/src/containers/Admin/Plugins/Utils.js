import { validateRequired, checkS3bucketUrl } from '../../../components/AdminForm/validations';

export const getPluginsForm = (key) => {
    if (key === 'sns') {
        return {
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
        };
    } else if (key === 'freshdesk') {
        return {
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
          }
    } else {
        return {
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
        };
    }
}