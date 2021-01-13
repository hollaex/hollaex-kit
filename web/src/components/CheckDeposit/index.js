import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';

import STRINGS from '../../config/localizedStrings';
import { Button } from '../../components';
import { STATIC_ICONS } from 'config/icons';
import renderFields from '../../components/Form/factoryFields';
import withConfig from 'components/ConfigProvider/withConfig';

const FORM_NAME = 'CheckDeposit';

const CheckDeposit = ({
	onCloseDialog,
	requestDeposit,
	isLoading,
	message,
	successMsg,
	error,
	handleSearch = () => {},
	...props
}) => {
	const handleItemSearch = () => {
		handleSearch(props.formValues);
	};

	const formFields = {
		transaction_id: {
			type: 'text',
			placeholder: STRINGS['DEPOSIT_STATUS.SEARCH_FIELD_LABEL'],
			fullWidth: true,
			notification: {
				stringId: 'DEPOSIT_STATUS.SEARCH',
				text: isLoading
					? STRINGS['DEPOSIT_STATUS.SEARCHING']
					: STRINGS['DEPOSIT_STATUS.SEARCH'],
				iconPath: isLoading
					? props.icons['CONNECT_LOADING']
					: STATIC_ICONS.SEARCH,
				onClick: handleItemSearch,
			},
		},
	};

	return (
		<form className="check-deposit-modal-wrapper">
			<div className="d-flex justify-content-center align-items-center flex-column">
				<img
					src={STATIC_ICONS.SEARCH}
					alt="search"
					className="search-icon mb-4"
				/>
				<h2>{STRINGS['DEPOSIT_STATUS.CHECK_DEPOSIT_STATUS']}</h2>
			</div>
			<div className="inner-content">
				<span>{STRINGS['DEPOSIT_STATUS.CHECK_DEPOSIT_STATUS']}</span>
				<div className="mb-5">
					{STRINGS['DEPOSIT_STATUS.STATUS_DESCRIPTION']}
				</div>
				<span>{STRINGS['DEPOSIT_STATUS.TRANSACTION_ID']}</span>
				{renderFields(formFields)}
				{message === successMsg ? (
					<div className="d-flex">
						<img
							src={STATIC_ICONS.VERIFICATION_ICON}
							alt="verification_tick"
							className="verification_icon"
						/>
						<p className="success-msg">{message}</p>
					</div>
				) : (
					<p className="error-msg">{message}</p>
				)}
			</div>
			<div className="w-100 buttons-wrapper d-flex mt-3">
				<Button label="BACK" onClick={onCloseDialog} />
			</div>
		</form>
	);
};

const CheckDepositForm = reduxForm({
	form: FORM_NAME,
})(CheckDeposit);

const mapStateToProps = (state) => ({
	formValues: getFormValues(FORM_NAME)(state),
});

export default connect(mapStateToProps)(withConfig(CheckDepositForm));
