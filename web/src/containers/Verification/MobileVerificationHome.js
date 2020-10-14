import React from 'react';

import { getCountryFromNumber } from './utils';
import { Button, PanelInformationRow } from '../../components';
import STRINGS from '../../config/localizedStrings';

const MobileVerificationHome = ({ user, setActivePageContent }) => {
    const { phone_number } = user;
    if (!phone_number) {
        return (
            <div>
                <Button label={STRINGS["USER_VERIFICATION.START_PHONE_VERIFICATION"]} onClick={() => setActivePageContent('sms')} />
            </div>
        );
    } else {
        return <div className="my-3">
            <PanelInformationRow
                label={STRINGS["USER_VERIFICATION.PHONE_COUNTRY_ORIGIN"]}
                information={getCountryFromNumber(phone_number).name}
                className="title-font"
                disable />
            <PanelInformationRow
                label={STRINGS["USER_VERIFICATION.MOBILE_NUMBER"]}
                information={phone_number}
                className="title-font"
                disable />
        </div>
    }
};

export default MobileVerificationHome;