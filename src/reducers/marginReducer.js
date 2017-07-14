import axios from 'axios'
import _ from 'lodash'

export default function reducer(state={
	fetched: false,
	fetching: false,
	error: null,
	margins: []
}, action) {
	switch(action.type) {
		// getMargin
		case 'GET_MARGIN': {
			return {...state, margins: action.payload}
			break;
		}
	}
	return state;
}