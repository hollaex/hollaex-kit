import React from 'react';

import { Button } from '../../components';
import STRINGS from '../../config/localizedStrings';

const IdentityVerificationHome = ({ user }) => {
    const { id_data } = user;
    if (id_data.status === 0) {
        return (
            <div>
                <Button label={STRINGS.USER_VERIFICATION.START_IDENTITY_VERIFICATION} />
            </div>
        )
    } else {
        return <div></div>;
    }
};

export default IdentityVerificationHome;