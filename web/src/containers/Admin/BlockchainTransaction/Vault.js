import React from 'react';

import { AdminHocForm } from '../../../components';
import { validateRequired } from '../../../components/AdminForm/validations';

const Form = AdminHocForm('VAULT_FORM', 'transaction-form');

const Vault = ({ handleSubmitVault }) => {
    return (
        <div className="mb-4">
            <Form
                onSubmit={handleSubmitVault}
                buttonText="Submit"
                fields={{
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
                }}
            />
        </div>
    );
}

export default Vault;
