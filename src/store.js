import { compose, applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import { autoRehydrate } from 'redux-persist';
import { ENV } from './config/constants';
import reducer from './reducers/reducer';

const middlewares = [promise, thunk];

if (ENV === 'development') {
	middlewares.push(logger);
}

const middleware = applyMiddleware(...middlewares);

export default createStore(
	reducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
	compose(middleware, autoRehydrate())
);
