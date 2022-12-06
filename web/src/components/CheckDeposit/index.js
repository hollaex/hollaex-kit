import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';

import STRINGS from 'config/localizedStrings';
import { Button, EditWrapper, IconTitle } from 'components';
import { STATIC_ICONS } from 'config/icons';
import renderFields from 'components/Form/factoryFields';
import withConfig from 'components/ConfigProvider/withConfig';
import { required } from 'components/Form/validations';
import { getNetworkNameByKey } from 'utils/wallet';

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
	formValues,
	icons: ICONS,
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

	const formFields = {};
	formFields.transaction_id = {
		type: 'text',
		stringId: 'DEPOSIT_STATUS.TRANSACTION_ID,DEPOSIT_STATUS.SEARCH_FIELD_LABEL',
		label: STRINGS['DEPOSIT_STATUS.TRANSACTION_ID'],
		placeholder: STRINGS['DEPOSIT_STATUS.SEARCH_FIELD_LABEL'],
		validate: [required],
		fullWidth: true,
	};

	formFields.currency = {
		type: 'select',
		stringId: 'COINS,DEPOSIT_STATUS.CURRENCY_FIELD_LABEL',
		label: STRINGS['COINS'],
		placeholder: STRINGS['DEPOSIT_STATUS.CURRENCY_FIELD_LABEL'],
		options: coinOptions,
		validate: [required],
		fullWidth: true,
	};

	if (
		formValues &&
		formValues.currency &&
		coins[formValues.currency] &&
		coins[formValues.currency].network
	) {
		const { network: networks = '' } = coins[formValues.currency];
		const networkOptions = networks.split(',').map((network) => ({
			value: network,
			label: getNetworkNameByKey(network),
		}));

		formFields.network = {
			type: 'select',
			stringId:
				'WITHDRAWALS_FORM_NETWORK_LABEL,WITHDRAWALS_FORM_NETWORK_PLACEHOLDER',
			label: STRINGS['WITHDRAWALS_FORM_NETWORK_LABEL'],
			placeholder: STRINGS['WITHDRAWALS_FORM_NETWORK_PLACEHOLDER'],
			validate: [required],
			options: networkOptions,
			fullWidth: true,
		};
	} else if (formValues) {
		delete formValues.network;
	}

	formFields.address = {
		type: 'text',
		stringId:
			'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.ADDRESS_LABEL,DEPOSIT_STATUS.ADDRESS_FIELD_LABEL',
		label:
			STRINGS[
				'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.ADDRESS_LABEL'
			],
		placeholder: STRINGS['DEPOSIT_STATUS.ADDRESS_FIELD_LABEL'],
		validate: [required],
		fullWidth: true,
	};

	if (formValues && formValues.currency) {
		if (formValues.currency === 'xrp') {
			formFields.destination_tag = {
				type: 'number',
				stringId:
					'DEPOSIT_STATUS.DESTINATION_TAG_LABEL,DEPOSIT_STATUS.DESTINATION_TAG_PLACEHOLDER',
				label: STRINGS['DEPOSIT_STATUS.DESTINATION_TAG_LABEL'],
				placeholder: STRINGS['DEPOSIT_STATUS.DESTINATION_TAG_PLACEHOLDER'],
				fullWidth: true,
			};
		} else if (formValues.currency === 'xlm' || formValues.network === 'xlm') {
			formFields.destination_tag = {
				type: 'text',
				stringId: 'DEPOSIT_STATUS.MEMO_LABEL,DEPOSIT_STATUS.MEMO_PLACEHOLDER',
				label: STRINGS['DEPOSIT_STATUS.MEMO_LABEL'],
				placeholder: STRINGS['DEPOSIT_STATUS.MEMO_PLACEHOLDER'],
				fullWidth: true,
			};
		}
	}

	return (
		<form className="check-deposit-modal-wrapper" onSubmit={handleSubmit}>
			<div className="d-flex justify-content-center align-items-center flex-column">
				<IconTitle
					stringId="DEPOSIT_STATUS.CHECK_DEPOSIT_STATUS"
					text={STRINGS['DEPOSIT_STATUS.CHECK_DEPOSIT_STATUS']}
					textType="title"
					iconPath={ICONS['SEARCH_BLOCKCHAIN']}
					iconId="SEARCH_BLOCKCHAIN"
				/>
			</div>
			<div className="inner-content">
				<div>
					<EditWrapper stringId="DEPOSIT_STATUS.SEARCH_BLOCKCHAIN_FOR_DEPOSIT">
						{STRINGS['DEPOSIT_STATUS.SEARCH_BLOCKCHAIN_FOR_DEPOSIT']}
					</EditWrapper>
				</div>
				<div className="mb-5 field-header">
					<EditWrapper stringId="DEPOSIT_STATUS.STATUS_DESCRIPTION">
						{STRINGS['DEPOSIT_STATUS.STATUS_DESCRIPTION']}
					</EditWrapper>
				</div>
				{renderFields(formFields)}
				{message && (
					<div className="d-flex">
						<img
							src={STATIC_ICONS.VERIFICATION_ICON}
							alt="verification_tick"
							className="verification_icon"
						/>
						<p className="success-msg">{message}</p>
					</div>
				)}
				{error && <div className="warning_text">{error}</div>}
			</div>

			<div className="d-flex justify-content-center align-items-center mt-2">
				<div className="f-1 d-flex justify-content-end verification-buttons-wrapper">
					<EditWrapper stringId="BACK" />
					<Button label={STRINGS['BACK']} onClick={onCloseDialog} />
				</div>
				<div className="separator" />
				<div className="f-1 d-flex justify-content-end verification-buttons-wrapper">
					<EditWrapper stringId="SUBMIT" />
					<Button
						label={STRINGS['SUBMIT']}
						disabled={pristine || submitting || !valid}
					/>
				</div>
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
