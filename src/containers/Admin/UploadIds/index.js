import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { uploadFiles } from './actions';
import { message as AntdMessage } from 'antd';

import { AdminHocForm } from '../../../components';

// import { isSupport } from '../../../utils';

const UploadForm = AdminHocForm('UPLOAD_FORM');

const FORM_FIELDS = {
	front: {
		type: 'file',
		label: 'Front',
		validate: []
	},
	back: {
		type: 'file',
		label: 'Back',
		validate: []
	},
	proof_of_residency: {
		type: 'file',
		label: 'Proof of Residence',
		validate: []
	},
	type: {
		type: 'select',
		label: 'Type',
		options: [
			{ label: 'National Id', value: 'id' },
			{ label: 'Passport', value: 'passport' }
		]
	},
	number: {
		type: 'text',
		label: 'Document number',
		validate: []
	}
};

class UploadIds extends Component {
	onSubmit = (refreshData) => (values) => {
		return uploadFiles(this.props.user_id, values)
			.then(({ success, data: { data, user } }) => {
				refreshData(data, 'files');
				refreshData(user);
				AntdMessage.success('Files upload successfully', 5);
			})
			.catch((err) => {
				const message = err.data.message || err.message;
				AntdMessage.error(message, 5);
				throw new SubmissionError({ _error: message });
			});
	};

	render() {
		const { refreshData } = this.props;
		return (
			<div>
				<UploadForm
					fields={FORM_FIELDS}
					onSubmit={this.onSubmit(refreshData)}
					buttonText="Upload"
				/>
			</div>
		);
	}
}
export default UploadIds;
