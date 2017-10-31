import { ACTION_KEYS } from '../actions/walletActions';

const INITIAL_API_OBJECT = {
	data: [],
	count: 0,
  loading: false,
  fetched: false,
  error: '',
};


const sortByDate = (a, b) => {
	return new Date(a) <= new Date(b);
}

const joinData = (stateData = [], payloadData = []) => stateData.concat(payloadData);

const INITIAL_STATE = {
  trades: INITIAL_API_OBJECT,
  deposits: INITIAL_API_OBJECT,
	withdrawals: INITIAL_API_OBJECT,
};

export default function reducer(state = INITIAL_STATE, { type, payload }) {
	switch(type) {
		// USER_TRADES
		case ACTION_KEYS.USER_TRADES_PENDING: {
      const { page = 1 } = payload;
      const data = page > 1 ? state.trades.data : INITIAL_API_OBJECT.data;
			return {
        ...state,
        trades: {
          ...INITIAL_API_OBJECT,
          loading: true,
          data,
        },
      }
    }
		case ACTION_KEYS.USER_TRADES_REJECTED:
      return {
        ...state,
        trades: {
          ...INITIAL_API_OBJECT,
          loading: false,
          fetched: true,
          error: payload,
        },
      }
		case ACTION_KEYS.USER_TRADES_FULFILLED:
      return {
        ...state,
        trades: {
          ...INITIAL_API_OBJECT,
          loading: false,
          fetched: true,
          count: payload.count,
          data: joinData(state.trades.data, payload.data)
        },
      }

		case ACTION_KEYS.ADD_USER_TRADES: {
			// check if we have trades from DB
			if (state.trades.count > 0) {
				return {
					...state,
					trades: {
						count: state.trades.count + payload.length,
						data: joinData(state.trades.data, payload.data)
					}
				}
			}
		}


		// USER_TRADES
		case ACTION_KEYS.USER_DEPOSITS_PENDING: {
	    const { page = 1 } = payload;
	    const data = page > 1 ? state.deposits.data : INITIAL_API_OBJECT.data;
			return {
	      ...state,
	      deposits: {
	        ...INITIAL_API_OBJECT,
	        loading: true,
	        data,
	      },
	    }
	  }
		case ACTION_KEYS.USER_DEPOSITS_REJECTED:
	    return {
	      ...state,
	      deposits: {
	        ...INITIAL_API_OBJECT,
	        loading: false,
	        fetched: true,
	        error: payload,
	      },
	    }
		case ACTION_KEYS.USER_DEPOSITS_FULFILLED:
	    return {
	      ...state,
	      deposits: {
	        ...INITIAL_API_OBJECT,
	        loading: false,
	        fetched: true,
	        count: payload.count,
	        data: joinData(state.deposits.data, payload.data)
	      },
	    }

		// USER_TRADES
		case ACTION_KEYS.USER_WITHDRAWALS_PENDING: {
	    const { page = 1 } = payload;
	    const data = page > 1 ? state.withdrawals.data : INITIAL_API_OBJECT.data;
			return {
	      ...state,
	      withdrawals: {
	        ...INITIAL_API_OBJECT,
	        loading: true,
	        data,
	      },
	    }
	  }
		case ACTION_KEYS.USER_WITHDRAWALS_REJECTED:
	    return {
	      ...state,
	      withdrawals: {
	        ...INITIAL_API_OBJECT,
	        loading: false,
	        fetched: true,
	        error: payload,
	      },
	    }
		case ACTION_KEYS.USER_WITHDRAWALS_FULFILLED:
	    return {
	      ...state,
	      withdrawals: {
	        ...INITIAL_API_OBJECT,
	        loading: false,
	        fetched: true,
	        count: payload.count,
	        data: joinData(state.withdrawals.data, payload.data)
	      },
	    }

		case 'LOGOUT':
			return INITIAL_STATE;
	}
	return state;
}
