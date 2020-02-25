import { required } from '../../../components/Form/validations';

export const getPluginsForm = (key) => {
    if (key === 'sns') {
        return {
            access_Key: {
                type: 'input',
                label: 'Access key',
                placeholder: 'AWS SNS Access key',
                validate: [required]
            },
            secret_Key: {
                type: 'input',
                label: 'Secret key',
                placeholder: 'AWS SNS Secret key',
                validate: [required]
            },
            region: {
                type: 'input',
                label: 'Region',
                placeholder: 'AWS SNS Region',
                validate: [required]
            }
        };
    } else if (key === 'freshdesk') {
        return {
            access_key: {
              type: 'input',
              label: 'Freshdesk Host URL',
              placeholder: 'Freshdesk Host URL',
              validate: [required]
            },
            secret_key: {
              type: 'input',
              label: 'Freshdesk Access key',
              placeholder: 'Freshdesk Access key',
              validate: [required]
            },
            region: {
              type: 'input',
              label: 'Freshdesk Auth key',
              placeholder: 'Freshdesk Auth key',
              validate: [required]
            }
          }
    } else {
        return {
            name: {
                type: 'input',
                label: 'ID DOCS BUCKET',
                placeholder: 'ID DOCS BUCKET',
                validate: [required]
            },
            access_key: {
                type: 'input',
                label: 'Access key',
                placeholder: 'AWS S3 Access key',
                validate: [required]
            },
            secret_key: {
                type: 'input',
                label: 'Secret key',
                placeholder: 'AWS S3 Secret Key',
                validate: [required]
            }
        };
    }
}