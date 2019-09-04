import Cookies from 'universal-cookie';
import math from 'mathjs';
import numbro from 'numbro';
import moment from 'moment-timezone';
import jwtDecode from 'jwt-decode';

import { TOKEN_KEY, TOKEN_MAX_AGE, TOKEN_EMAIL, TIME_ZONE } from '../config/constants';

console.log(TOKEN_KEY)
const cookies = new Cookies();

export const getToken = () => cookies.get("token::key");
export const getEmail = () => cookies.get("token::email");

// export const checkRole = (role = '-') => () => {
// 	const email = getEmail();
// 	if (email) {
// 		return email.indexOf(role) >= 0;
// 	}
// 	return true;
// };

export const checkRole = () => {
   const token = getToken();
   const roles = jwtDecode(token).scopes;
   let role = '';
   if (roles.includes('admin')) {
      role = 'admin';
   } else if (roles.includes('supervisor')) {
      role = 'supervisor';
   } else if (roles.includes('support')) {
      role = 'support';
   } else if (roles.includes('kyc')) {
      role = 'kyc';
   }
   return role;
};

// const initializeRoles = () => {
// 	role = checkRole();
// }

export const isUser = () => {
   return checkRole() === '';
};
export const isKYC = () => {
   return checkRole() === 'kyc';
};
export const isSupport = () => {
   return checkRole() === 'support';
};
export const isSupervisor = () => {
   return checkRole() === 'supervisor';
};
export const isAdmin = () => {
   return checkRole() === 'admin';
};

export const setToken = (token, email) => {
   cookies.set(TOKEN_KEY, token, { maxAge: TOKEN_MAX_AGE });
   if (email) {
      cookies.set(TOKEN_EMAIL, email, { maxAge: TOKEN_MAX_AGE });
   }
};

export const removeToken = () => {
   cookies.remove(TOKEN_KEY);
   cookies.remove(TOKEN_EMAIL);
};

export const checkUserLoggedIn = () => (getToken() ? true : false);

export { default as request, requestAuthenticated } from './request';

export const formatDate = (date) => {
   return moment(date)
      .tz(TIME_ZONE)
      .format('YYYY/MM/DD HH:mm');
};


export const getFormat = (min = 0, fullFormat) => {
   if (fullFormat) {
      return { digit: 8, format: '0,0.[00000000]' };
   } else if (min % 1) {
      let point = min.toString().split('.')[1];
      let res = point.split('').map(val => 0).join('');
      return { digit: point.length, format: `0,0.[${res}]` };
   } else {
      return { digit: 4, format: `0,0.[0000]` };
   }
};

export const formatCurrency = (amount = 0, min = 0, fullFormat = false) => {
   let formatObj = getFormat(min, fullFormat);
   return numbro(roundNumber(amount, formatObj.digit)).format(formatObj.format);
};


export const roundNumber = (number = 0, decimals = 4) => {
   if (number === 0) {
      return 0;
   } else if (decimals > 0) {
      const multipliedNumber = math.multiply(
         math.fraction(number),
         math.pow(10, decimals)
      );
      const dividedNumber = math.divide(
         math.floor(multipliedNumber),
         math.pow(10, decimals)
      );
      return math.number(dividedNumber);
   } else {
      return math.floor(number);
   }
};
