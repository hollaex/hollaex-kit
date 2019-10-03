import React from 'react';

import renderFields from '../../../components/AdminForm/utils';
import STRINGS from '../../../config/localizedStrings';

const UserLimitForm = ({ fields }) => {
    return (
        <div>
            <div className='d-flex mb-2'>
                <div className='verification_label'>{STRINGS.USER_LEVEL}</div>
                <div className='verification_content'>{STRINGS.LIMIT_AMOUNT}</div>
            </div>
            {Object.keys(fields).map((key, index) => (
                <div key={index} className='d-flex'>
                    <div className='verification_label'>{key}</div>
                    <div className='verification_content'>
                        {fields[key] && renderFields(fields[key])}
                    </div>
                </div>
            ))}
        </div>
    )
};

export default UserLimitForm;
