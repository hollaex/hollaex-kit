import React from 'react';
import { reduxForm, reset } from 'redux-form';
import { AuthForm } from '../../components';

const FORM_NAME = 'BaseDepositForm';
const Form = (props) => <AuthForm {...props} />;

export default reduxForm({
	form: FORM_NAME,
	onSubmitSuccess: (result, dispatch) => dispatch(reset(FORM_NAME)),
})(Form);
