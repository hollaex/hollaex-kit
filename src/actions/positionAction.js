import axios from 'axios'

const baseURL = 'http://localhost:10010/api/v0';

export function setLeverage(symbol, leverage) {
	return {
		type: 'SET_LEVERAGE',
		payload: axios.post(`${baseURL}/position/leverage`, {symbol, leverage:Number(leverage)})
	}
}

export function getPosition(positions) {
	return {
		type: 'GET_POSITION',
		payload: positions
	}
}

export function updatePosition(positions, newPositions) {
	return {
		type: 'UPDATE_POSITION',
		positions,
		newPositions
	}
}