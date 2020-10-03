import React from 'react';
import ReactSVG from 'react-svg';

import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';
import { ActionNotification } from '../../components';

const HeaderSection = ({ title, children, openContactForm, icon }) => {
    return (
        <div className="header_title-wrapper d-flex flex-column w-100 f-1">
            <div className="d-flex">
                {!!icon && <div className="mr-2">
                    <ReactSVG path={icon} wrapperClassName="header_title-icon" />
                </div>}
                <div>
                    <div className="d-flex justify-content-between w-100 f-1">
                        <div className="header_title-text font-weight-bold">{title}</div>
                        {!!openContactForm && <div className="header_title-action">
                            <ActionNotification
                                stringId="NEED_HELP_TEXT"
                                text={STRINGS["NEED_HELP_TEXT"]}
                                status="information"
                                iconPath={ICONS.BLUE_QUESTION}
                                onClick={openContactForm}
                                useSvg={true}
                            />
                        </div>}
                    </div>
                    {children && <div className="header_title-children">{children}</div>}
                </div>
            </div>
        </div>
    );
};

export default HeaderSection;
