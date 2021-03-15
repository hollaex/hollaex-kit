import { PLUGIN_URL } from 'config/constants';
// import { requestAuthenticated } from '../../../utils';
import axios from 'axios';

export const uploadFiles = (id, values) => {
	const formData = new FormData();
	Object.entries(values).forEach(([key, value]) => {
		formData.append(key, value);
	});

	return axios({
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		data: formData,
		url: `${PLUGIN_URL}/plugins/kyc/admin/upload?user_id=${id}`,
		method: 'POST',
	});
};
