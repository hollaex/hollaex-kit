import React, { Fragment, useState } from 'react';
import ReactSVG from 'react-svg';
import { Button, Modal, Select } from 'antd';
import { Link } from 'react-router';
import { ExclamationCircleFilled, CaretUpFilled, CaretDownFilled } from '@ant-design/icons';
import { SubmissionError } from 'redux-form';

import Notes from './Notes';
import UserData from './UserData';
import { AdminHocForm } from '../../../components';
import Audits from '../Audits';
import Logins from '../Logins';
import Verification from '../Verification';
import DataDisplay, { renderRowInformation } from '../Verification/DataDisplay';
import { performVerificationLevelUpdate } from './actions';
import {
	validateRequired,
	validateRange
} from '../../../components/AdminForm/validations';
import { ICONS } from '../../../config/constants';
import { checkRole, isSupervisor, isSupport } from 'utils/token';

const VerificationForm = AdminHocForm('VERIFICATION_FORM');

const VERIFICATION_LEVELS_SUPPORT = ['1', '2', '3'];
const VERIFICATION_LEVELS_ADMIN = VERIFICATION_LEVELS_SUPPORT.concat([
	'4', '5', '6'
]);

const RenderModalContent = ({
    modalKey = '',
    userData,
    constants,
    onChangeSuccess,
    handleClose,
    refreshData
}) => {
    let VERIFICATION_LEVELS =
        isSupport() || isSupervisor()
            ? VERIFICATION_LEVELS_SUPPORT
            : VERIFICATION_LEVELS_ADMIN;
    if (constants.user_level_number) {
        const temp = [];
        for (let level = 1; level <= constants.user_level_number; level++) {
            temp.push(level.toString());
        }
        VERIFICATION_LEVELS = temp;
    }
    const onSubmit = (refreshData) => (values) => {
        // redux form set numbers as string, se we have to parse them
        const postValues = {
            user_id: userData.id,
            verification_level: parseInt(values.verification_level, 10)
        };
        return performVerificationLevelUpdate(postValues)
            .then(() => {
                refreshData(postValues);
                handleClose();
            })
            .catch((err) => {
                let error = err && err.data
                    ? err.data.message
                    : err.message;
                throw new SubmissionError({ _error: error });
            });
    };
    const renderLevelOptions = (levels) => (
        levels.map((level, index) => (
            <Select.Option key={index} value={level}>
                <div className='asset-list'>
                    <ReactSVG path={ICONS[`LEVEL_ACCOUNT_ICON_${level}`]} wrapperClassName="select-level-icon" />
                    <div className='select-coin-text'>
                        {`Account tier ${level}`}
                    </div>
                </div>
            </Select.Option>
        ))
    );
    switch (modalKey) {
        case 'notes':
            return (
                <Notes
                    initialValues={{
                        id: userData.id,
                        note: userData.note
                    }}
                    userInfo={userData}
                    onChangeSuccess={onChangeSuccess}
                    handleClose={handleClose}
                />
            );
        case 'users':
            return (
                <div className="user-data-form">
                    <div className="d-flex align-items-center mb-3">
                        <div>
                            <ReactSVG path={ICONS.USER_DETAILS_ICON} wrapperClassName="user-edit-icon" />
                        </div>
                        <h3>{`Edit user ${userData.id} data`}</h3>
                    </div>
                    <UserData
                        initialValues={userData}
                        onChangeSuccess={onChangeSuccess}
                        handleClose={handleClose}
                    />
                </div>
            );
        case 'verification-levels':
            return (
                <div className="user-data-form">
                    <h3>User level</h3>
                    <VerificationForm
                        onSubmit={onSubmit(refreshData)}
                        buttonText="Update"
                        buttonClass="green-btn"
                        initialValues={{
                            verification_level: userData.verification_level
                        }}
                        fields={{
                            verification_level: {
                                type: 'select',
                                renderOptions: renderLevelOptions,
                                options: VERIFICATION_LEVELS,
                                label: 'Adjust user level',
                                validate: [
                                    validateRequired,
                                    validateRange(
                                        VERIFICATION_LEVELS.map((value) => `${value}`)
                                    )
                                ]
                            }
                        }}
                    />
                </div>
            );
        default:
            return <div></div>;
    }

};

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
    const [showRemaining, setShow] = useState(false);
    const [modalKey, setModalKey] = useState('');
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
    const handleOpenModal = (key = '') => {
        setEdit(true);
        setModalKey(key);
    };
    const handleClose = () => {
        setEdit(false);
        setModalKey('');
    };
    const { email, full_name, gender, nationality, dob, phone_number, address, ...rest } = userData;
    const userInfo = {
        email,
        full_name,
        gender,
        nationality,
        dob,
        phone_number,
        country: address.country,
        address: address.address,
        postal_code: address.postal_code,
        city: address.city,
    };
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
                            onClick={() => handleOpenModal('notes')}
                        >
                            Edit
                        </Button>
                    </div>
                </div>
            </div>
            <div>
                <div className="about-title">
                    User info
                </div>
                <div className="d-flex m-4">
                    <div className="user-info-container">
                        <DataDisplay
                            data={userInfo}
                            renderRow={renderRowInformation}
                        />
                        <div>
                            <Button
                                type='primary'
                                className="green-btn"
                                size="small"
                                onClick={() => handleOpenModal('users')}
                            >
                                Edit
                            </Button>
                        </div>
                    </div>
                    <div className="user-info-separator"></div>
                    <div className="user-role-container">
                        <div>
							<img src={ICONS.BLUE_SCREEN_EYE_ICON} className="user-info-icon" alt="EyeIcon" />
						</div>
                        <div className="user-info-label">
                            Role: {checkRole()}
                        </div>
                        <div className="ml-4">
                            <Link to="/admin/roles">
                                <Button type='primary' className="green-btn" size="small" >Edit</Button>
                            </Link>
                        </div>
                    </div>
                    <div className="user-info-separator"></div>
                    <div className="user-level-container">
                        <div>
                            <ReactSVG path={ICONS.LEVEL_ACCOUNT_ICON_1} wrapperClassName="levels-icon" />
						</div>
                        <div className="user-info-label">
                            Verification level: {userData.verification_level}
                        </div>
                        <div className="ml-4">
                            <Button
                                type='primary'
                                className="green-btn"
                                size="small"
                                onClick={() => handleOpenModal('verification-levels')}
                            >
                                Edit
                            </Button>
                        </div>
                    </div>
                    <div className="user-info-separator"></div>
                </div>
                <div className="m-4">
                    {showRemaining
                        ? <DataDisplay
                            data={rest}
                            renderRow={renderRowInformation}
                        />
                        : null
                    }
                    <div onClick={() => setShow(!showRemaining)}>
                        {showRemaining
                            ? <Fragment>
                                <span className="info-link">
                                    View less details
                                        </span>
                                <CaretUpFilled />
                            </Fragment>
                            : <Fragment>
                                <span className="info-link">
                                    View details
                                        </span>
                                <CaretDownFilled />
                            </Fragment>
                        }
                    </div>
                </div>
            </div>
            <div>
                <div className="about-title">
                    Audit
                </div>
                <Audits userId={userData.id} />
            </div>
            <div>
                <div className="about-title">
                    Login
                </div>
                <Logins userId={userData.id} />
            </div>
            <Modal
                visible={isEdit}
                footer={null}
                onCancel={handleClose}
            >
                <RenderModalContent
                    modalKey={modalKey}
                    userData={userData}
                    constants={constants}
                    onChangeSuccess={onChangeSuccess}
                    handleClose={handleClose}
                    refreshData={refreshData}
                />
            </Modal>
        </div>
    );
}

export default AboutData;
