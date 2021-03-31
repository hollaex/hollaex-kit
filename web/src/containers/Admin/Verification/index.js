import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import {
	performVerificationLevelUpdate,
	performUserRoleUpdate,
	verifyData,
	revokeData,
} from './actions';
import { Card, Button, Modal } from 'antd';
import { ClockCircleFilled } from '@ant-design/icons';

import { AdminHocForm } from '../../../components';
// import {
// 	validateRequired,
// 	validateRange
// } from '../../../components/AdminForm/validations';
import DataDisplay, {
	renderRowImages,
	// renderRowInformation
} from './DataDisplay';
import UploadIds from '../UploadIds';

import './index.css';

import { isSupport, isSupervisor } from '../../../utils/token';
import { formatTimestampGregorian, DATETIME_FORMAT } from '../../../utils/date';

// const VERIFICATION_LEVELS_SUPPORT = ['1', '2', '3'];
// const VERIFICATION_LEVELS_ADMIN = VERIFICATION_LEVELS_SUPPORT.concat([
// 	'4', '5', '6'
// ]);

// const ROLE = [
// 	{ label: 'admin', value: 'admin' },
// 	{ label: 'support', value: 'support' },
// 	{ label: 'supervisor', value: 'supervisor' },
// 	{ label: 'kyc', value: 'kyc' },
// 	{ label: 'tech', value: 'tech' },
// 	{ label: 'user', value: 'user' }
// ];

const IDForm = AdminHocForm('ID_DATA_FORM');
const IDRevokeForm = AdminHocForm('ID_DATA_REVOKE_FORM');
// const BankRevokeForm = HocForm('BANK_DATA_REVOKE_FORM');
// const VerificationForm = AdminHocForm('VERIFICATION_FORM');
// const UserRoleForm = AdminHocForm('USER_ROLE_FORM');

class Verification extends Component {
	constructor(props) {
		super(props);
		this.state = {
			note: '',
			isConfirm: false,
		};
	}
	onSubmit = (refreshData) => (values) => {
		// redux form set numbers as string, se we have to parse them
		const postValues = {
			user_id: this.props.user_id,
			verification_level: parseInt(values.verification_level, 10),
		};
		return performVerificationLevelUpdate(postValues)
			.then(() => {
				refreshData(postValues);
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				throw new SubmissionError({ _error: error });
			});
	};

	onVerify = (refreshData) => (values) => {
		const { id_data } = this.props.userInformation;
		const postData = {
			id_data: {
				...id_data,
				status: values.hasOwnProperty('id_data') ? values.id_data : 3,
			},
		};
		return verifyData(values)
			.then(() => {
				refreshData(postData);
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				throw new SubmissionError({ _error: error });
			});
	};

	onRevoke = (refreshData) => (values) => {
		const { id_data, bank_account } = this.props.userInformation;
		const postData = {
			id_data: {
				...id_data,
				status: values.hasOwnProperty('id_data') ? 2 : bank_account.provided,
			},
		};
		return revokeData(values)
			.then(() => {
				refreshData(postData, 'reject');
				this.handleClose();
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				throw new SubmissionError({ _error: error });
			});
	};

	handleNoteChange = (event) => {
		this.setState({ note: event.target.value });
	};

	onRoleChange = (refreshData) => (values) => {
		const postValues = {
			user_id: this.props.user_id,
			role: values,
		};
		return performUserRoleUpdate(postValues)
			.then((response) => {
				const { email, ...res } = response;
				refreshData({ ...res, user_id: this.props.user_id });
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				throw new SubmissionError({ _error: error });
			});
	};

	handleConfirmation = () => {
		this.setState({ isConfirm: true });
	};

	handleClose = () => {
		this.setState({ isConfirm: false });
		this.props.closeUpload();
	};

	render() {
		const {
			userImages,
			userInformation,
			refreshData,
			isUpload,
			closeUpload,
			// constants
		} = this.props;
		const { id, id_data = {} } = userInformation;
		// let VERIFICATION_LEVELS =
		// 	isSupport() || isSupervisor()
		// 		? VERIFICATION_LEVELS_SUPPORT
		// 		: VERIFICATION_LEVELS_ADMIN;
		// if (constants.user_level_number) {
		// 	const temp = [];
		// 	for (let level = 1; level <= constants.user_level_number; level++) {
		// 		temp.push(level.toString());
		// 	}
		// 	VERIFICATION_LEVELS = temp;
		// }
		return (
			<div className="d-flex">
				<div className="verification_data_container">
					{/* <Card title="Verification Level" style={{ width: 300 }}>
						<VerificationForm
							onSubmit={this.onSubmit(refreshData)}
							buttonText="Update"
							initialValues={verificationInitialValues}
							fields={{
								verification_level: {
									type: 'select',
									options: VERIFICATION_LEVELS,
									label: 'Verification Level',
									validate: [
										validateRequired,
										validateRange(
											VERIFICATION_LEVELS.map((value) => `${value}`)
										)
									]
								}
							}}
						/>
					</Card>
					<Card title="Role" style={{ width: 300 }}>
						<UserRoleForm
							onSubmit={this.onRoleChange(refreshData)}
							buttonText="Update"
							initialValues={roleInitialValues}
							fields={{
								role: {
									type: 'select',
									options: ROLE,
									label: 'role',
									validate: [
										validateRequired
									],
									disabled: is_admin
								}
							}}
						/>
					</Card> */}
					{id_data.status === 3 ? (
						<div className="verified-container">
							<p>Type: {id_data.type}</p>
							<p>Number: {id_data.number}</p>
							{id_data.issued_date && (
								<p>
									Issue date:{' '}
									{formatTimestampGregorian(
										id_data.issued_date,
										DATETIME_FORMAT
									)}{' '}
								</p>
							)}
							{id_data.expiration_date && (
								<p>
									Expire date:{' '}
									{formatTimestampGregorian(
										id_data.expiration_date,
										DATETIME_FORMAT
									)}{' '}
								</p>
							)}
						</div>
					) : id_data.status === 1 ? (
						<Card
							title={
								<div>
									<ClockCircleFilled
										style={{ color: '#F28041', marginRight: '5px' }}
									/>
									Pending ID data
								</div>
							}
							style={{ width: 300 }}
						>
							<p>Type: {id_data.type}</p>
							<p>Number: {id_data.number}</p>
							{id_data.issued_date && (
								<p>
									Issue date:{' '}
									{formatTimestampGregorian(
										id_data.issued_date,
										DATETIME_FORMAT
									)}{' '}
								</p>
							)}
							{id_data.expiration_date && (
								<p>
									Expire date:{' '}
									{formatTimestampGregorian(
										id_data.expiration_date,
										DATETIME_FORMAT
									)}{' '}
								</p>
							)}
							<div className="verification_data_container--actions">
								{(!isSupport() || !isSupervisor()) && id_data.status === 1 && (
									<div>
										<Button
											// onSubmit={() =>
											// 	this.onRevoke(refreshData)({
											// 		user_id: id,
											// 		message: this.state.note
											// 	})
											// }
											// buttonText={'Reject'}
											type="primary"
											size="small"
											danger
											onClick={this.handleConfirmation}
										>
											Reject
										</Button>
										{/* <Input.TextArea
														rows={4}
														value={this.state.note}
														onChange={this.handleNoteChange}
													/> */}
									</div>
								)}
								{id_data.status === 1 && (
									<IDForm
										onSubmit={() =>
											this.onVerify(refreshData)({
												user_id: id,
											})
										}
										buttonText={'Approve'}
										small
									/>
								)}
							</div>
						</Card>
					) : null}
				</div>
				<div className="verification_data_container">
					<DataDisplay
						className={'d-flex flex-wrap'}
						data={userImages}
						renderRow={renderRowImages}
					/>
					{/* <DataDisplay
						data={userInformation}
						title="User Information"
						renderRow={renderRowInformation}
					/> */}
				</div>
				<Modal
					title={this.state.isConfirm ? 'Reject ID' : 'Upload files'}
					width={this.state.isConfirm ? 520 : 350}
					visible={this.state.isConfirm || isUpload}
					footer={null}
					onCancel={this.handleClose}
				>
					{this.state.isConfirm ? (
						<div className="verification-confirm-modal">
							<p>Are you sure you want to reject the ID?</p>
							<IDRevokeForm
								fields={{
									message: {
										type: 'textarea',
										label: 'Reason (this will be sent to the user)',
									},
								}}
								onSubmit={(formProps) => {
									this.onRevoke(refreshData)({
										user_id: id,
										message: formProps.message,
									});
								}}
								buttonText="Confirm"
								small
							/>
						</div>
					) : (
						<div>
							<p>Upload ID supporting files to user database</p>
							<UploadIds
								user_id={id}
								refreshData={refreshData}
								closeUpload={closeUpload}
							/>
						</div>
					)}
				</Modal>
			</div>
		);
	}
}

Verification.defaultProps = {
	verificationInitialValues: {},
};

export default Verification;
