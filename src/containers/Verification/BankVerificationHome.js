import React from 'react';

import { Button } from '../../components';
import STRINGS from '../../config/localizedStrings';

const BankVerificationHome = ({ user }) => {
    const { bank_account } = user;
    return (
        <div>
            {bank_account.status === 0
                ? <div>
                    <Button label={STRINGS.USER_VERIFICATION.START_BANK_VERIFICATION} />
                </div>
                : <div></div>
            }
        </div>
    );
};

export default BankVerificationHome;