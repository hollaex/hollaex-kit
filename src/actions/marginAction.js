import axios from 'axios'
import _ from 'lodash'

const baseURL = 'http://localhost:10010/api/v0';


export function getMargin(margins) {
	return {
		type: 'GET_MARGIN',
		payload: margins
	}
}