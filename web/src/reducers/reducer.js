import { combineReducers } from 'redux';
import auth from './authReducer';
import user from './userReducer';
import order from './orderReducer';
import orderbook from './orderbookReducer';
import app from './appReducer';
import wallet from './walletReducer';
import asset from './assetReducer';
import stake from './stakeReducer';
import tools from './toolsReducer';
import adminBillingReducer from './adminBillingReducer';
import { reducer as formReducer } from 'redux-form';

const appReducer = combineReducers({
	app,
	auth,
	order,
	user,
	orderbook,
	wallet,
	asset,
	stake,
	tools,
	admin: adminBillingReducer,
	form: formReducer,
});

const rootReducer = (state, action) => {
	return appReducer(state, action);
};

export default rootReducer;
