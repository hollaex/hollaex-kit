import { requestAuthenticated } from '../../../utils';

export const requestTotalBalance = () => requestAuthenticated('/admin/stats');

export const requestEthSweep = (value) =>
	requestAuthenticated(`/admin/eth/sweep?wallets=${value}`);
