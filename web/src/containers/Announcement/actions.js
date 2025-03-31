import { requestAuthenticated } from 'utils';

export const getAnnouncementDetails = () => {
	return requestAuthenticated('/announcements');
};
