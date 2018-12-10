import React from 'react';

import { Button } from '../../components';
import STRINGS from '../../config/localizedStrings';

const MobileVerificationHome = ({ user }) => {
    const { phone_number } = user;
    if (!phone_number) {
        return (
            <div>
                <Button label={STRINGS.USER_VERIFICATION.START_PHONE_VERIFICATION} />
            </div>
        );
    } else {
        return <div></div>
    }
};

export default MobileVerificationHome;