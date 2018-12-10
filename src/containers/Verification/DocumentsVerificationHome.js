import React from 'react';

import { Button } from '../../components';
import STRINGS from '../../config/localizedStrings';

const DocumentsVerificationHome = () => {
    return (
        <div>
            <Button label={STRINGS.USER_VERIFICATION.START_DOCUMENTATION_SUBMISSION} />
        </div>
    );
};

export default DocumentsVerificationHome;