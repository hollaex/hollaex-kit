import { SubmissionError } from 'redux-form';

export const errorHandler = (err) => {
  const _error = err.response.data ? err.response.data.message : err.message;
  throw new SubmissionError({ otp_code: _error });
}
