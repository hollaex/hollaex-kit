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
  activeNotification: EMPTY_NOTIFICATION,
}

const reducer = (state = INITIAL_STATE, { type, payload = {}}) => {
  switch (type) {
    case SET_NOTIFICATION: {
      const notifications = [].concat(state.notifications);
      let activeNotification = { ...state.activeNotification };

      if (state.activeNotification.type !== '') {
        notifications.push(payload);
      } else {
        activeNotification = { ...payload };
      }
      return {
        ...state,
        notifications,
        activeNotification,
      };
    }

    case CLOSE_NOTIFICATION:{
      const notifications = [].concat(state.notifications);
      const activeNotification = notifications.length > 0 ?
        notifications.splice(0, 1)[0] :
        { ...EMPTY_NOTIFICATION };
      console.log(notifications, activeNotification)
      return {
        ...state,
        notifications,
        activeNotification,
      };
    }
    default:
      return state;
  }
}

export default reducer;
