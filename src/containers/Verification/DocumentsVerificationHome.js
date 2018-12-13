import React from 'react';

import { Button } from '../../components';
import STRINGS from '../../config/localizedStrings';

const DocumentsVerificationHome = ({ user }) => {
    const { id_data } = user;
    if (id_data.status === 0) {
        return (
            <div>
                <Button label={STRINGS.USER_VERIFICATION.START_DOCUMENTATION_SUBMISSION} />
            </div>
        );
    } else {
        return <div></div>;
    }
};

export default DocumentsVerificationHome;