export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';
export const NOTIFICATIONS = {
  ORDERS: 'NOTIFICATIONS_ORDERS',
  TRADES: 'NOTIFICATIONS_TRADES',
  DEPOSIT: 'NOTIFICATIONS_DEPOSIT',
  WITHDRAWAL: 'NOTIFICATIONS_WITHDRAWAL',
};
export const CONTACT_FORM = 'CONTACT_FORM';

export const setNotification = (type = '', message = '', data = {}) => ({
  type: SET_NOTIFICATION,
  payload: {
    type,
    message,
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
