import {
  SET_NOTIFICATION,
  CLOSE_NOTIFICATION,
} from '../actions/appActions';

const EMPTY_NOTIFICATION = {
  type: '',
  message: '',
  timestamp: undefined,
}
const INITIAL_STATE = {
  notifications: [],
  notificationsQueue: [],
  activeNotification: EMPTY_NOTIFICATION,
}

const reducer = (state = INITIAL_STATE, { type, payload = {}}) => {
  switch (type) {
    case SET_NOTIFICATION: {
      const newNotification = payload.type.indexOf('NOTIFICATIONS') > -1 ? [payload] : [];
      const notifications = newNotification.concat(state.notifications);
      const notificationsQueue = [].concat(state.notificationsQueue);
      let activeNotification = { ...state.activeNotification };

      if (state.activeNotification.type !== '') {
        notificationsQueue.push(payload);
      } else {
        activeNotification = { ...payload };
      }
      return {
        ...state,
        notifications,
        activeNotification,
        notificationsQueue,
      };
    }

    case CLOSE_NOTIFICATION:{
      const notificationsQueue = [].concat(state.notificationsQueue);
      const activeNotification = notificationsQueue.length > 0 ?
        notificationsQueue.splice(0, 1)[0] :
        { ...EMPTY_NOTIFICATION };

      return {
        ...state,
        notificationsQueue,
        activeNotification,
      };
    }
    default:
      return state;
  }
}

export default reducer;
