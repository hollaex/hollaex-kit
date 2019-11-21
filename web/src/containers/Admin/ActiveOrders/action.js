import { requestAuthenticated } from '../../../utils';
 
export const requestActiveOrders = () => {
	return requestAuthenticated(`/admin/orders`);
};