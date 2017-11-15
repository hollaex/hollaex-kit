import STRINGS from '../config/localizedStrings';
import { setLanguage as storeLanguageInBrowser, getLanguageFromString } from '../utils/string';

export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';
export const NOTIFICATIONS = {
  ORDERS: 'NOTIFICATIONS_ORDERS',
  TRADES: 'NOTIFICATIONS_TRADES',
  DEPOSIT: 'NOTIFICATIONS_DEPOSIT',
  WITHDRAWAL: 'NOTIFICATIONS_WITHDRAWAL',
  ERROR: 'NOTIFICATIONS_ERROR'
};
export const CONTACT_FORM = 'CONTACT_FORM';
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';

export const setNotification = (type = '', data = {}) => ({
  type: SET_NOTIFICATION,
  payload: {
    type,
    data,
    timestamp: Date.now(),
  }
});

export const closeNotification = () => ({
  type: CLOSE_NOTIFICATION,
  payload: {

  }
});

export const openContactForm = (data = {}) => setNotification(CONTACT_FORM, 'Contact Form', data);

export const setLanguage = (value = 'en') => {
  const language = storeLanguageInBrowser(value);
  return {
    type: CHANGE_LANGUAGE,
    payload: {
      language,
    }
  }
}
