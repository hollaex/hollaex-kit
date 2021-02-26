import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';

import STRINGS from '../../config/localizedStrings';
import { Button } from '../../components';
import { STATIC_ICONS } from 'config/icons';
import renderFields from '../../components/Form/factoryFields';
import withConfig from 'components/ConfigProvider/withConfig';
import { required } from '../Form/validations';

const FORM_NAME = 'CheckDeposit';

const CheckDeposit = ({
	onCloseDialog,
	requestDeposit,
	isLoading,
	message,
	handleSubmit,
	coins,
	pristine,
	submitting,
	valid,
	error,
	...props
}) => {
	const coinOptions = [];
	Object.keys(coins).forEach((data) => {
		let temp = coins[data];
		if (temp) {
			coinOptions.push({
				label: `${temp.fullname} (${temp.symbol})`,
				value: data,
			});
		}
	});

	const formFields = {
		transaction_id: {
			type: 'text',
			placeholder: STRINGS['DEPOSIT_STATUS.SEARCH_FIELD_LABEL'],
			label: STRINGS['DEPOSIT_STATUS.TRANSACTION_ID'],
			validate: [required],
			fullWidth: true,
		},
		currency: {
			type: 'select',
			placeholder: STRINGS['DEPOSIT_STATUS.CURRENCY_FIELD_LABEL'],
			label: STRINGS['COINS'],
			options: coinOptions,
			validate: [required],
			fullWidth: true,
		},
		address: {
			type: 'text',
			placeholder: STRINGS['DEPOSIT_STATUS.ADDRESS_FIELD_LABEL'],
			label:
				STRINGS[
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.ADDRESS_LABEL'
				],
			validate: [required],
			fullWidth: true,
		},
	};

	return (
		<form className="check-deposit-modal-wrapper" onSubmit={handleSubmit}>
			<div className="d-flex justify-content-center align-items-center flex-column">
				<img
					src={STATIC_ICONS.SEARCH}
					alt="search"
					className="search-icon mb-4"
				/>
				<h2>{STRINGS['DEPOSIT_STATUS.CHECK_DEPOSIT_STATUS']}</h2>
			</div>
			<div className="inner-content">
				<span className="field-header">
					{STRINGS['DEPOSIT_STATUS.CHECK_DEPOSIT_STATUS']}
				</span>
				<div className="mb-5">
					{STRINGS['DEPOSIT_STATUS.STATUS_DESCRIPTION']}
				</div>
				{renderFields(formFields)}
				{message ? (
					<div className="d-flex">
						<img
							src={STATIC_ICONS.VERIFICATION_ICON}
							alt="verification_tick"
							className="verification_icon"
						/>
						<p className="success-msg">{message}</p>
					</div>
				) : null}
				{error && <div className="warning_text">{error}</div>}
			</div>
			<div className="w-100 buttons-wrapper d-flex justify-content-between mt-3">
				<Button label="BACK" onClick={onCloseDialog} className="mr-3" />
				<Button
					label={STRINGS['SUBMIT']}
					disabled={pristine || submitting || !valid}
				/>
			</div>
		</form>
	);
};

const CheckDepositForm = reduxForm({
	form: FORM_NAME,
	enableReinitialize: true,
})(CheckDeposit);

const mapStateToProps = (state) => ({
	formValues: getFormValues(FORM_NAME)(state),
	coins: state.app.coins,
});

export default connect(mapStateToProps)(withConfig(CheckDepositForm));
