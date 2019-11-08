import React from 'react';
import ReactSVG from 'react-svg';
import { Link } from 'react-router';
import classnames from 'classnames';

import { ICONS } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';

const LogoutInfoOrder = ({ activeTheme }) => {
    const SIGN_IN = <Link to="/login" className={classnames('blue-link', 'dialog-link', 'pointer')} >
        {STRINGS.SIGNUP_TEXT}
    </Link>
    return (
        <div className='text-center'>
            <div className={'flex-row d-flex justify-content-center'}>
                <ReactSVG path={activeTheme === 'white' ? ICONS.HEX_LOGO_LIGHT : ICONS.HEX_LOGO_DARK} wrapperClassName="hex-logo" />
            </div>
            <div className="hex-order-heading">
                {STRINGS.TERMS_OF_SERVICES.HEX_ORDER_TXT_1}
            </div>
            <div className="my-2">
                {STRINGS.TERMS_OF_SERVICES.HEX_ORDER_TXT_2}
            </div>
            <div className="my-2">
                {STRINGS.formatString(
                    STRINGS.TERMS_OF_SERVICES.HEX_ORDER_TXT_3,
                    SIGN_IN,
                    <Link to="/login" className={classnames('blue-link', 'dialog-link', 'pointer')} >
                        {STRINGS.TERMS_OF_SERVICES.LOGIN_HERE} </Link>

                )}
            </div>
        </div>
    )
};
export default LogoutInfoOrder;