import { compose, applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import { autoRehydrate } from 'redux-persist';

import reducer from './reducers/reducer';

const middleware = applyMiddleware(promise(), thunk, logger);

export default createStore(
	reducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
	compose(middleware, autoRehydrate())
);
