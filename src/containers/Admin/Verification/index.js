import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import {
	performVerificationLevelUpdate,
	verifyData,
	revokeData
} from './actions';
import { Card, Input } from 'antd';

import { AdminHocForm } from '../../../components';
import {
	validateRequired,
	validateRange
} from '../../../components/AdminForm/validations';
import DataDisplay, {
	renderRowImages,
	renderRowInformation
} from './DataDisplay';

import './index.css';

import { isSupport, isSupervisor } from '../../../utils';
import {
	formatTimestampGregorian,
	formatTimestampFarsi,
	DATETIME_FORMAT,
	DATETIME_FORMAT_FA
} from '../../../utils/date';

const VERIFICATION_LEVELS_SUPPORT = ['1', '2', '3'];
const VERIFICATION_LEVELS_ADMIN = VERIFICATION_LEVELS_SUPPORT.concat([
	'4',
	'5',
	'6'
]);

const IDForm = AdminHocForm('ID_DATA_FORM');
const IDRevokeForm = AdminHocForm('ID_DATA_REVOKE_FORM');
// const BankRevokeForm = HocForm('BANK_DATA_REVOKE_FORM');
const VerificationForm = AdminHocForm('VERIFICATION_FORM');

class Verification extends Component {
	constructor(props) {
		super(props);
		this.state = {
			note: ''
		};
	}
	onSubmit = (refreshData) => (values) => {
		// redux form set numbers as string, se we have to parse them
		const postValues = {
			user_id: this.props.user_id,
			verification_level: parseInt(values.verification_level, 10)
		};
		console.log(postValues);
		return performVerificationLevelUpdate(postValues)
			.then(() => {
				refreshData(postValues);
			})
			.catch((err) => {
				throw new SubmissionError({ _error: err.data.message });
			});
	};

	onVerify = (refreshData) => (values) => {
		const { id_data, bank_account } = this.props.userInformation;
		const postData = {
			id_data: {
				...id_data,
				status: values.hasOwnProperty('id_data') ? values.id_data : 3
			}
		};
		return verifyData(values)
			.then(() => {
				refreshData(postData);
			})
			.catch((err) => {
				throw new SubmissionError({ _error: err.data.message });
			});
	};

	onRevoke = (refreshData) => (values) => {
		const { id_data, bank_account } = this.props.userInformation;
		const postData = {
			id_data: {
				...id_data,
				status: values.hasOwnProperty('id_data') ? 2 : bank_account.provided
			}
		};
		return revokeData(values)
			.then(() => {
				refreshData(postData);
			})
			.catch((err) => {
				throw new SubmissionError({ _error: err.data.message });
			});
	};

	handleNoteChange = (event) => {
		this.setState({ note: event.target.value });
	};

	render() {
		const { userImages, userInformation, refreshData } = this.props;
		const { id, id_data, bank_account } = userInformation;
		const VERIFICATION_LEVELS =
			isSupport() || isSupervisor()
				? VERIFICATION_LEVELS_SUPPORT
				: VERIFICATION_LEVELS_ADMIN;
		return (
			<div>
				<div className="verification_data_container">
					<Card title="Verification Level" style={{ width: 300 }}>
						<VerificationForm
							onSubmit={this.onSubmit(refreshData)}
							buttonText="Update"
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
					{id_data.status > 0 && (
						<Card
							title="ID Data"
							extra={
								<div className="verification_data_container--actions">
									{id_data.status === 1 && (
										<IDForm
											onSubmit={() =>
												this.onVerify(refreshData)({
													user_id: id
												})
											}
											buttonText={'Verify'}
										/>
									)}
									{(!isSupport() || !isSupervisor()) && id_data.status === 1 && (
										<div>
											<IDRevokeForm
												onSubmit={() =>
													this.onRevoke(refreshData)({
														user_id: id,
														message: this.state.note
													})
												}
												buttonText={'Revoke'}
											/>
											<Input.TextArea
												rows={4}
												value={this.state.note}
												onChange={this.handleNoteChange}
											/>
										</div>
									)}
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
									-{' '}
									{formatTimestampFarsi(
										id_data.issued_date,
										DATETIME_FORMAT_FA
									)}
								</p>
							)}
							{id_data.expiration_date && (
								<p>
									Expire date:{' '}
									{formatTimestampGregorian(
										id_data.expiration_date,
										DATETIME_FORMAT
									)}{' '}
									-{' '}
									{formatTimestampFarsi(
										id_data.expiration_date,
										DATETIME_FORMAT_FA
									)}
								</p>
							)}
						</Card>
					)}
				</div>
				<div className="verification_data_container">
					<DataDisplay
						data={userImages}
						title="User Identication Ids"
						renderRow={renderRowImages}
					/>
					<DataDisplay
						data={userInformation}
						title="User Information"
						renderRow={renderRowInformation}
					/>
				</div>
			</div>
		);
	}
}
export default Verification;
