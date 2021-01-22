import axios from 'axios';

export const postTransfer = (formProps) =>
	axios.post('/admin/transfer', formProps);
