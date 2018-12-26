import React from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

import { renderStatusIcon } from '../../components';

import { FLEX_CENTER_CLASSES } from '../../config/constants';

const status = {
    0: 'Incompleted',
    1: 'Pending',
    2: 'Rejected',
    3: 'Verified'
}

const MobileTabs = ({ title, icon, statusCode, className }) => {
    const statusText = status[statusCode];
    return (
        <div className={
            classnames(
                "d-flex",
                "justify-content-between"
            )}
        >
            <div className="d-flex">
                <ReactSVG
                    path={icon}
                    wrapperClassName="verification_icon-mobile"
                />
                <div className={classnames(FLEX_CENTER_CLASSES, "mobile-tab-title", "ml-3")}>
                    {title}
                </div>
            </div>
            <div className={
                classnames(
                    FLEX_CENTER_CLASSES,
                    statusText.toLowerCase()
                )}
            >
                <div>{statusText}</div>
                {renderStatusIcon(statusCode, "verification_status-icon ml-1")}
            </div>
        </div>
    );
};

export default MobileTabs;