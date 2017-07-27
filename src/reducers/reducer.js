import { combineReducers } from 'redux';
import auth from './authReducer'
import user from './userReducer'
import order from './orderReducer'
import orderbook from './orderbookReducer'
import margin from './marginReducer'
import position from './positionReducer'
import { reducer as formReducer } from 'redux-form';

const appReducer = combineReducers({
	auth,
	order,
	user,
	margin,
	position,
	orderbook,
	form:formReducer
})

const rootReducer = (state, action) => {
	return appReducer(state, action)
}

export default rootReducer