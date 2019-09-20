import { requestAuthenticated } from '../../../utils';

export const requestDeposits = () =>
	requestAuthenticated('/admin/deposits?type=deposit');
