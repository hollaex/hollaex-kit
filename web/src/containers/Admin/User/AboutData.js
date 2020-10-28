import React, { Fragment, useState } from 'react';
import ReactSVG from 'react-svg';
import { Button, Modal } from 'antd';

import { ICONS } from '../../../config/constants';
import Verification from '../Verification';
import Notes from './Notes';
import { ExclamationCircleFilled } from '@ant-design/icons';

const AboutData = ({
    userData = {},
    userImages = {},
    constants = {},
    refreshData,
    disableOTP,
    flagUser,
    freezeAccount,
    onChangeSuccess
}) => {
    const [isUpload, setUpload] = useState(false);
    const [isEdit, setEdit] = useState(false);
    const userDocs = {
        front: userImages.front ? userImages.front : '',
        back: userImages.back ? userImages.back : '',
        proof_of_residency: userImages.proof_of_residency ? userImages.proof_of_residency : ''
    }
    const handleNotesRemove = () => {
        Modal.confirm({
            icon: <ExclamationCircleFilled />,
            content: <div>Are you sure want to delete this?</div>,
            onOk() {
                console.log('OK');
            }
        })
    };
    const handleClose = () => { setEdit(false) };
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
                        <div className="d-flex">
                            <Verification
                                isUpload={isUpload}
                                constants={constants}
                                user_id={userData.id}
                                userImages={userDocs}
                                userInformation={userData}
                                refreshData={refreshData}
                                closeUpload={() => setUpload(false)}
                            />
                        </div>
                        <div>
                            <Button
                                type="primary"
                                className="green-btn"
                                onClick={() => setUpload(true)}
                            >
                                Upload
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="about-notes-content">
                    <div className="about-title">
                        Notes
                    </div>
                    <div className="about-notes-text">
                        {userData.note}
                    </div>
                    <div className="d-flex justify-content-end">
                        <Button
                            type="primary"
                            size="small"
                            danger
                            onClick={handleNotesRemove}
                        >
                            Delete
                        </Button>
                        <div className="separator"></div>
                        <Button
                            type="primary"
                            className="green-btn"
                            size="small"
                            onClick={() => { setEdit(true) }}
                        >
                            Edit
                        </Button>
                    </div>
                </div>
            </div>
            <Modal
                visible={isEdit}
                footer={null}
                onCancel={handleClose}
            >
                <Notes
                    initialValues={{
                        id: userData.id,
                        note: userData.note
                    }}
                    userInfo={userData}
                    onChangeSuccess={onChangeSuccess}
                    handleClose={handleClose}
                />
            </Modal>
        </div>
    );
}

export default AboutData;
