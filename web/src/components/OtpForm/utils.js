import { SubmissionError } from 'redux-form';

export const errorHandler = (err) => {
	const _error =
		err.response && err.response.data
			? err.response.data.message
				? err.response.data.message
				: err.response.data
			: err.message;
	const error = {};
	if (_error.toLowerCase().indexOf('otp') > -1) {
		// error.otp_code = _error;
		error._error = _error;
	} else {
		error._error = _error;
	}

	throw new SubmissionError(error);
};
