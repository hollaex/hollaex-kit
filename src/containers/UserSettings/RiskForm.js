import React from 'react';

import { Accordion } from '../../components';
import STRINGS from '../../config/localizedStrings';

const RiskForm = ({  }) => {
    const sections = [
        {
            title: STRINGS.USER_SETTINGS.CREATE_ORDER_WARING,
            content: <div>
                <p>{STRINGS.USER_SETTINGS.RISK_MANAGEMENT.INFO_TEXT}</p>
                <p>{STRINGS.formatString(STRINGS.USER_SETTINGS.RISK_MANAGEMENT.INFO_TEXT_1, '100').join('')}</p>
            </div>
        }
    ]
    return <Accordion sections={sections} />;
};

export default RiskForm;