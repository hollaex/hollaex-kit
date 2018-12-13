import React from 'react';

import { Button } from '../../components';
import STRINGS from '../../config/localizedStrings';

const IdentityVerificationHome = ({ user }) => {
    const { address } = user;
    if (!address.country) {
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