import { Card } from 'antd';
import React, { Fragment } from 'react';
import ReactSVG from 'react-svg';
import { Button } from 'antd';

import { ICONS } from '../../../config/constants';
import {
	formatTimestampGregorian,
	DATETIME_FORMAT,
} from '../../../utils/date';

const AboutData = ({ userData = {}, disableOTP, flagUser, freezeAccount }) => {
    return (
        <div className="about-wrapper">
            <div className="d-flex justify-content-end">
                <div className="d-flex align-items-center">
                    <div className="about-info d-flex align-items-center justify-content-center">
                        {userData.otp_enabled
                            ? <Fragment>
                                <div className="about-info-content">
                                    <div>2FA enabled</div>
                                    <div className="info-link" onClick={disableOTP}>Disable</div>
                                </div>
                                <div className={"about-icon-active"}>
                                    <ReactSVG path={ICONS.TWO_STEP_KEY_ICON} wrapperClassName={"about-icon"} />
                                </div>
                            </Fragment>
                            : <Fragment>
                                <div>
                                    <div>2FA disabled</div>
                                </div>
                                <div>
                                    <ReactSVG path={ICONS.TWO_STEP_KEY_ICON} wrapperClassName={"about-icon"} />
                                </div>
                            </Fragment>
                        }
                    </div>
                    <div className="about-info d-flex align-items-center justify-content-center">
                        {!userData.activated
                            ? <Fragment>
                                <div className="about-info-content">
                                    <div>Account frozen</div>
                                    <div className="info-link" onClick={() => freezeAccount(!userData.activated)}>Unfreeze</div>
                                </div>
                                <div className={"about-icon-active"}>
                                    <ReactSVG path={ICONS.ACC_FREEZE} wrapperClassName={"about-icon"} />
                                </div>
                            </Fragment>
                            : <Fragment>
                                <div>
                                    <div className="info-link" onClick={() => freezeAccount(!userData.activated)}>Freeze account</div>
                                </div>
                                <div>
                                    <ReactSVG path={ICONS.ACC_FREEZE} wrapperClassName={"about-icon"} />
                                </div>
                            </Fragment>
                        }
                    </div>
                    <div className="about-info d-flex align-items-center justify-content-center">
                        {userData.flagged
                            ? <Fragment>
                                <div className="about-info-content">
                                    <div>This user is flagged</div>
                                    <div
                                        className="info-link"
                                        onClick={() => flagUser(!userData.flagged)}
                                    >
                                        Unflag user
                                    </div>
                                </div>
                                <div className="about-icon-active">
                                    <ReactSVG path={ICONS.ACC_FLAG} wrapperClassName={"about-icon"} />
                                </div>
                            </Fragment>
                            : <Fragment>
                                <div>
                                    <div
                                        className="info-link"
                                        onClick={() => flagUser(!userData.flagged)}
                                    >
                                        Flag user
                                    </div>
                                </div>
                                <div>
                                    <ReactSVG path={ICONS.ACC_FLAG} wrapperClassName={"about-icon"} />
                                </div>
                            </Fragment>
                        }
                    </div>
                </div>
            </div>
            <div className="d-flex">
                <div className="about-verification-content">
                    <div className="about-title">
                        User identification files
                    </div>
                    <div className="d-flex justify-content-between">
                        <div>
                            {userData.id_data.status > 0
                                ? <Card title="Pending ID data">
                                    <p>Type: {userData.id_data.type}</p>
                                    <p>Number: {userData.id_data.number}</p>
                                    {userData.id_data.issued_date && (
                                        <p>
                                            Issue date:{' '}
                                            {formatTimestampGregorian(
                                                userData.id_data.issued_date,
                                                DATETIME_FORMAT
                                            )}{' '}
                                        </p>
                                    )}
                                    {userData.id_data.expiration_date && (
                                        <p>
                                            Expire date:{' '}
                                            {formatTimestampGregorian(
                                                userData.id_data.expiration_date,
                                                DATETIME_FORMAT
                                            )}{' '}
                                        </p>
                                    )}
                                </Card>
                                : <div>
                                    <p>Type: {userData.id_data.type}</p>
                                    <p>Number: {userData.id_data.number}</p>
                                    {userData.id_data.issued_date && (
                                        <p>
                                            Issue date:{' '}
                                            {formatTimestampGregorian(
                                                userData.id_data.issued_date,
                                                DATETIME_FORMAT
                                            )}{' '}
                                        </p>
                                    )}
                                    {userData.id_data.expiration_date && (
                                        <p>
                                            Expire date:{' '}
                                            {formatTimestampGregorian(
                                                userData.id_data.expiration_date,
                                                DATETIME_FORMAT
                                            )}{' '}
                                        </p>
                                    )}
                                </div>
                            }
                        </div>
                        <div>
                            <Button type="primary">Upload</Button>
                        </div>
                    </div>
                </div>
                <div className="about-notes-content">
                    <div className="about-title">
                        Notes
                    </div>
                    <div>
                        {userData.note}
                    </div>
                    <div className="d-flex">
                        <Button type="primary">Delete</Button>
                        <Button>Edit</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutData;
