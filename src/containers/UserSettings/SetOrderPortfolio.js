import React from 'react';
import { reduxForm } from 'redux-form';
import { isMobile } from 'react-device-detect';

import renderFields from '../../components/Form/factoryFields';
import { getErrorLocalized } from '../../utils/errors';
import { required } from '../../components/Form/validations';
import { IconTitle, Button } from '../../components';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

const SetOrderPortfolio = (props) => {
    const { portfolioPercent = '', onClose, handleSubmit,
        submitting,
        pristine,
        error,
        valid,
        initialValues } = props;
    console.log('props', props);
    const fields = {
        order_portfolio_percentage: {
            type: 'text',
            validate: [required],
            label: STRINGS.USER_SETTINGS.ORDER_PORTFOLIO_LABEL,
            fullWidth: true
        }
    };
    return (
        <div className="portfolio-wrapper">
            <IconTitle
                text={STRINGS.USER_SETTINGS.CREATE_ORDER_WARING}
                iconPath={ICONS.SETTING_RISK_ADJUST_ICON}
                textType="title"
                useSvg={true}
                underline={true}
            />
            <div className="mt-1">{STRINGS.formatString(STRINGS.USER_SETTINGS.CREATE_ORDER_WARING_TEXT, portfolioPercent).join('')}</div>
            <form onSubmit={handleSubmit}>
                <div className="w-75 my-3">
                    {renderFields(fields)}
                </div>
                {error && <div className="warning_text">{getErrorLocalized(error)}</div>}
                <div className="d-flex mt-3">
                    <Button label={STRINGS.BACK_TEXT} onClick={onClose} />
                    <div className="mx-2"></div>
                    <Button label={STRINGS.USER_SETTINGS.SET_TXT} disabled={pristine || submitting || !valid} />
                </div>
            </form>
        </div>
    );
};

export default reduxForm({
    form: 'orderWarningPortfolio'
})(SetOrderPortfolio);