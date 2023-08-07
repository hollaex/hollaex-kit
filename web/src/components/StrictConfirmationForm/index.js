import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import renderFields from 'components/Form/factoryFields';
import { EditWrapper, Button } from 'components';
import { formValueSelector } from 'redux-form';

import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const FORM_NAME = 'ConfirmationForm';
const selector = formValueSelector(FORM_NAME);

class StrictConfirmation extends Component {
	state = {
		formValues: {},
	};

	UNSAFE_componentWillMount() {
		this.setFormValues();
	}

	UNSAFE_componentWillReceiveProps = (nextProps) => {
		const { dirty, submitFailed, valid } = this.props;
		if (
			dirty !== nextProps.dirty ||
			submitFailed !== nextProps.submitFailed ||
			valid !== nextProps.valid
		) {
			if (nextProps.dirty && nextProps.submitFailed && !nextProps.valid) {
				this.setFormRef(this.formRef);
			}
		}
	};

	setFormValues = () => {
		const formValues = {
			confirmationText: {
				type: 'text',
				label: '',
				stringId: 'USER_SETTINGS.DELETE_ACCOUNT.CONFIRMATION.PLACEHOLDER',
				placeholder:
					STRINGS['USER_SETTINGS.DELETE_ACCOUNT.CONFIRMATION.PLACEHOLDER'],
				fullWidth: true,
			},
		};

		this.setState({ formValues });
	};

	setFormRef = (el) => {
		if (el) {
			this.formRef = el;
			el.getElementsByTagName('input')[0].focus();
		}
	};

	disableProceed = () => {
		const { confirmationText } = this.props;
		return (
			!confirmationText ||
			confirmationText !==
				STRINGS['USER_SETTINGS.DELETE_ACCOUNT.CONFIRMATION.KEY']
		);
	};

	render() {
		const {
			onClose,
			handleSubmit,
			submitting,
			pristine,
			error,
			valid,
			pending,
			children,
		} = this.props;
		const { formValues } = this.state;

		return (
			<div className="otp_form-wrapper">
				{children}
				<form className="w-100" ref={this.setFormRef}>
					<div className="w-100 otp_form-fields">
						{renderFields(formValues)}
						{error && <div className="warning_text">{error}</div>}
					</div>

					<div className="d-flex mt-4 pt-4">
						<div className="w-50">
							<EditWrapper stringId="USER_SETTINGS.DELETE_ACCOUNT.CONFIRMATION.CANCEL" />
							<Button
								label={
									STRINGS['USER_SETTINGS.DELETE_ACCOUNT.CONFIRMATION.CANCEL']
								}
								onClick={onClose}
							/>
						</div>

						<div className="separator" />

						<div className="w-50">
							<EditWrapper stringId="USER_SETTINGS.DELETE_ACCOUNT.CONFIRMATION.DELETE" />
							<Button
								className="caps button-fail"
								label={
									STRINGS['USER_SETTINGS.DELETE_ACCOUNT.CONFIRMATION.DELETE']
								}
								onClick={handleSubmit}
								disabled={
									this.disableProceed() ||
									pristine ||
									submitting ||
									!valid ||
									pending
								}
							/>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

const StrictConfirmationForm = reduxForm({
	form: FORM_NAME,
})(StrictConfirmation);

const mapStateToForm = (state) => ({
	confirmationText: selector(state, 'confirmationText'),
});

const StrictConfirmationFormValues = connect(mapStateToForm)(
	StrictConfirmationForm
);

export default withConfig(StrictConfirmationFormValues);
