import axios from 'axios'
import _ from 'lodash'

export default function reducer(state={
    positions: [],
    fetching: false,
    fetched: false,
    error: null
}, action){
    switch(action.type){
        // setLeverage
		case 'SET_LEVERAGE_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
			break;
		}
        case 'SET_LEVERAGE_REJECTED': {
            alert('Error: ' + action.payload.response.data.error)
            return {...state, fetching: false, error:action.payload.response.data.error}
            break;
        }
        case 'SET_LEVERAGE_FULFILLED': {
            alert('Leverage successfully set')
            return {...state, fetching: false, fetched: true}
            break;
        }

        // getPosition
        case 'GET_POSITION': {
            let positions = action.payload
            positions = _.filter(positions, p => {
                return p.symbol == 'XBTUSD'
            })
            return {...state, positions}
        }
        // getPosition
        case 'UPDATE_POSITION': {
            let newPositions = action.newPositions
            let positions = action.positions

            newPositions = _.each(newPositions, p => {
                if(p.symbol == 'XBTUSD') {
                    positions[0].currentQty = p.currentQty
                    positions[0].lastPrice = p.lastPrice
                    positions[0].markPrice = p.markPrice
                    positions[0].liquidationPrice = p.liquidationPrice
                }
            })
            console.log(positions)

            return {...state, positions}
        }
    }
    return state;
}