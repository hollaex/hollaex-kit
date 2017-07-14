import { compose, applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware';
import {autoRehydrate} from 'redux-persist'

import reducer from './reducers/reducer'

const middleware = applyMiddleware(promise(), thunk, logger);

export default createStore(reducer, compose(middleware,autoRehydrate()))


