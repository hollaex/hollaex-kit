import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import {
	performVerificationLevelUpdate,
	performUserRoleUpdate,
	verifyData,
	revokeData,
} from './actions';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import {
	ClockCircleFilled,
	CloseCircleOutlined,
	FileSearchOutlined,
} from '@ant-design/icons';
import { ReactSVG } from 'react-svg';

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
import { STATIC_ICONS } from 'config/icons';

import './index.css';
import { updateIdData } from '../User/actions';

// import { isSupport, isSupervisor } from '../../../utils/token';
// import { formatTimestampGregorian, DATETIME_FORMAT } from '../../../utils/date';

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

const id_data_options = ['No status', 'Pending', 'Rejected', 'Approve'];
class Verification extends Component {
	constructor(props) {
		super(props);
		this.state = {
			note: '',
			isConfirm: false,
			isVisible: false,
			isEdit: false,
			is_dataDisplay: false,
			selectedImage: '',
			isNumberEdit: false,
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
		return verifyData(values, this.props.kycPluginName)
			.then(() => {
				refreshData(postData);
				this.handleClose();
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
				status: values.hasOwnProperty('id_data') ? bank_account.provided : 2,
			},
		};
		return revokeData(values, this.props.kycPluginName)
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
		this.setState({ isConfirm: false, is_dataDisplay: false, type: '' });
		this.props.closeUpload();
	};

	renderWidth = () => {
		if (this.state.isConfirm) {
			return '42rem';
		} else if (this.state.is_dataDisplay) {
			return '80rem';
		} else {
			return 350;
		}
	};

	renderPopupContent = (userImageData) => {
		const { refreshData, closeUpload, userInformation, isUpload } = this.props;

		const { id } = userInformation;

		if (this.state.isConfirm) {
			return (
				<div className="verification-confirm-modal">
					<div className="title">Check and confirm</div>
					{this.state.type === 'approve' ? (
						<div>
							<p>Are you sure you want to approve the ID?</p>
							<div className="data-display-wrapper">
								<DataDisplay
									className={'d-flex flex-wrap mb-5'}
									data={userImageData}
									renderRow={renderRowImages}
								/>
								<IDForm
									onSubmit={() =>
										this.onVerify(refreshData)({
											user_id: parseInt(id),
										})
									}
									onClose={this.handleClose}
									buttonText={'Approve'}
									buttonClass={'green-btn'}
									secondaryBtnTxt={'Back'}
									small
								/>
							</div>
						</div>
					) : (
						<div>
							<p>Are you sure you want to reject the ID?</p>
							<div className="data-display-wrapper">
								<DataDisplay
									className={'d-flex flex-wrap mb-5'}
									data={userImageData}
									renderRow={renderRowImages}
								/>
							</div>
							<IDRevokeForm
								fields={{
									message: {
										type: 'textarea',
										label: 'Reason (this will be sent to the user)',
									},
								}}
								onClose={this.handleClose}
								onSubmit={(formProps) => {
									return this.onRevoke(refreshData)({
										user_id: parseInt(id),
										message: formProps.message,
									});
								}}
								buttonType="danger"
								secondaryBtnTxt={'Back'}
								buttonText="Reject"
								small
							/>
						</div>
					)}
				</div>
			);
		} else if (this.state.is_dataDisplay) {
			return (
				<div className="image-wrapper">
					<div
						className="selected_image"
						style={{ backgroundImage: `url(${this.state.selectedImage})` }}
					/>
				</div>
			);
		} else if (isUpload) {
			return (
				<div>
					<p>Upload ID supporting files to user database</p>
					<UploadIds
						user_id={id}
						refreshData={refreshData}
						closeUpload={closeUpload}
					/>
				</div>
			);
		}
	};

	handleZoom = (icon) => {
		if (this.state.type !== 'approve' && this.state.type !== 'reject') {
			this.setState({ is_dataDisplay: true, selectedImage: icon });
		}
	};

	handleOpen = (type) => {
		this.setState({ isConfirm: true, type: type });
	};

	handleNumberEdit = (isNumberEdit) => {
		this.setState({ isNumberEdit });
	};

	renderContent = () => {
		const { isVisible, isEdit } = this.state;
		const { userInformation } = this.props;
		const { id_data = {} } = userInformation;

		if (id_data.status === 3) {
			return (
				<div>
					<div className="d-flex">
						<div>Document number: {id_data.number}</div>
						<span
							className="ml-1 edit-text"
							onClick={() => this.handleNumberEdit(true)}
						>
							(Edit)
						</span>
					</div>
					<div className="d-flex">
						Status:
						<ReactSVG
							src={STATIC_ICONS.VERIFICATION_ICON}
							className={'verification-icon mx-1'}
						/>
						<span className="approved-text">Approved</span>
						{isVisible && !isEdit ? (
							<span
								className="ml-1 edit-text"
								onClick={() => this.setState({ isEdit: true })}
							>
								(Edit)
							</span>
						) : null}
					</div>
				</div>
			);
		} else if (id_data.status === 2) {
			return (
				<div>
					<div className="d-flex">
						<div>Document number: {id_data.number}</div>
						<span
							className="ml-1 edit-text"
							onClick={() => this.handleNumberEdit(true)}
						>
							(Edit)
						</span>
					</div>
					<div>
						Status:
						<span className="rejected-text">
							<CloseCircleOutlined className="mx-2" />
							Rejected
						</span>
						{isVisible && !isEdit ? (
							<span
								className="ml-1 edit-text"
								onClick={() => this.setState({ isEdit: true })}
							>
								(Edit)
							</span>
						) : null}
					</div>
				</div>
			);
		} else if (id_data.status === 1) {
			return (
				<div>
					<div className="d-flex">
						<div>Document number: {id_data.number}</div>
						<span
							className="ml-1 edit-text"
							onClick={() => this.handleNumberEdit(true)}
						>
							(Edit)
						</span>
					</div>
					<div>
						Status:
						<span className="pending-text">
							<ClockCircleFilled style={{ margin: '0 5px' }} />
							Pending ID data
						</span>
					</div>
				</div>
			);
		} else {
			return (
				<div>
					<div className="d-flex">
						<div>Document number: {id_data.number}</div>
						<span
							className="ml-1 edit-text"
							onClick={() => this.handleNumberEdit(true)}
						>
							(Edit)
						</span>
					</div>
					<div>
						Status:
						<span className="pending-text">
							<ClockCircleFilled style={{ margin: '0 5px' }} />
							No status
						</span>
					</div>
				</div>
			);
		}
	};

	handleView = () => {
		this.setState({ isVisible: true });
	};

	handleSubmit = (formValues) => {
		const { userInformation, requestUserData } = this.props;
		const body = {
			id_data: {
				...formValues,
				status: id_data_options.indexOf(formValues.status),
			},
		};
		updateIdData(body, userInformation.id)
			.then((res) => {
				if (res) {
					requestUserData({ id: res.id });
					this.handleNumberEdit(false);
					message.success('Data saved successfully');
				}
			})
			.catch((error) => {
				const messageTxt = error.data ? error.data.message : error.message;
				message.error(messageTxt);
			});
	};

	render() {
		const {
			userImages,
			userInformation,
			// refreshData,
			isUpload,
			// closeUpload,
			// constants
		} = this.props;

		const { isVisible, isEdit } = this.state;
		let userImageData = {};
		Object.keys(userImages).map((key) => {
			return (userImageData = {
				...userImageData,
				[key]: {
					icon: userImages[key],
					onZoom: this.handleZoom,
				},
			});
		});

		const { id_data = {} } = userInformation;

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
					<div className="d-flex">{this.renderContent()}</div>
					{!isVisible && id_data.status !== 1 ? (
						<div>
							<div className="files-search-icon">
								<FileSearchOutlined />
							</div>
							{!(id_data.status === 0 || id_data.status === undefined) ? (
								<Button className="green-btn" onClick={this.handleView}>
									View data
								</Button>
							) : null}
						</div>
					) : (
						<div>
							{id_data.status === 3 || id_data.status === 2 ? (
								<div>
									{isEdit ? (
										<div className="mb-3">
											Edit status:
											{id_data.status === 1 || id_data.status === 3 ? (
												<Button
													className="mx-2"
													onClick={() => this.handleOpen('reject')}
													type="danger"
												>
													Reject
												</Button>
											) : null}
											{id_data.status === 1 || id_data.status === 2 ? (
												<Button
													type="primary"
													onClick={() => this.handleOpen('approve')}
													className="green-btn mx-2"
												>
													Approve
												</Button>
											) : null}
										</div>
									) : null}
									<DataDisplay
										className={'d-flex flex-wrap'}
										data={userImageData}
										renderRow={renderRowImages}
										popError={true}
									/>
								</div>
							) : (
								<div>
									<div>
										<DataDisplay
											className={'d-flex flex-wrap'}
											data={userImageData}
											renderRow={renderRowImages}
										/>
									</div>
									{id_data.status === 1 ? (
										<div className="mt-5">
											<Button
												className="mx-2"
												onClick={() => this.handleOpen('reject')}
												disabled={id_data.status === 2}
												type="danger"
											>
												Reject
											</Button>
											<Button
												type="primary"
												onClick={() => this.handleOpen('approve')}
												disabled={id_data.status === 3}
												className="green-btn"
											>
												Approve
											</Button>
										</div>
									) : null}
								</div>
							)}
						</div>
					)}
					{/* {id_data.status === 3 ? (
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
													/>
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
					) : null} */}
				</div>
				{/* <div className="verification_data_container">
					<DataDisplay
						className={'d-flex flex-wrap'}
						data={userImages}
						renderRow={renderRowImages}
					/>
					// <DataDisplay
					// 	data={userInformation}
					// 	title="User Information"
					// 	renderRow={renderRowInformation}
					// />
				</div> */}
				<Modal
					// title={this.state.isConfirm ? 'Reject ID' : 'Upload files'}
					width={this.renderWidth()}
					visible={
						this.state.isConfirm || isUpload || this.state.is_dataDisplay
					}
					footer={null}
					onCancel={this.handleClose}
					wrapClassName={this.state.is_dataDisplay ? 'zoom-image-modal' : ''}
				>
					{this.renderPopupContent(userImageData)}
				</Modal>
				<Modal
					visible={this.state.isNumberEdit}
					footer={null}
					onCancel={() => this.handleNumberEdit(false)}
				>
					<Form
						onFinish={this.handleSubmit}
						initialValues={{
							number: id_data.number,
							status: id_data_options[id_data.status],
						}}
						className="id_data_form"
					>
						<div>Document number</div>
						<Form.Item name="number">
							<Input />
						</Form.Item>
						<div>Status</div>
						<Form.Item name="status">
							<Select>
								{id_data_options.map((Item) => (
									<Select.Option key={Item}>{Item}</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Button type="primary" className="green-btn" htmlType="submit">
							Submit
						</Button>
					</Form>
				</Modal>
			</div>
		);
	}
}

Verification.defaultProps = {
	verificationInitialValues: {},
};

export default Verification;
