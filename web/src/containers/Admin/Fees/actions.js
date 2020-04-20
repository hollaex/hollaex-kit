import { requestAuthenticated } from '../../../utils';

export const getFees = () => requestAuthenticated('/admin/broker/balance');
