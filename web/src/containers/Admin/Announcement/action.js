import { requestAuthenticated } from 'utils';

export const getAdminAnnouncement = () => {
	return requestAuthenticated('/admin/announcements');
};

export const setAdminAnnouncementDetails = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/announcements', options);
};

export const editAdminAnnouncementDetails = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/announcements', options);
};

export const deleteAdminAnnouncementDetail = (values) => {
	const options = {
		method: 'DELETE',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/announcements', options);
};
