import {
	SET_ACCOUNT,
	SET_BLOCKCHAIN_DATA,
	SET_CURRENT_BLOCK,
	SET_STAKABLES,
	SET_PERIODS,
	SET_USER_STAKES,
	SET_DISTRIBUTIONS,
	SET_CONTRACT_EVENTS,
	SET_PUBLIC_INFO,
	SET_PENDING_TRANSACTIONS,
	RESET_STAKE_STORE,
	SET_PENALTIES,
	SET_POTS,
} from 'actions/stakingActions';

const initialStakable = {
	symbol: 'xht',
	available: '',
	total: '',
	rate: '',
	earnings: '',
};

const initialState = {
	account: '',
	network: '',
	currentBlock: '',
	stakables: [initialStakable],
	periods: {},
	penalties: {},
	pots: {},
	userStakes: {},
	balance: 0,
	distributions: [],
	contractEvents: [],
	publicInfo: {
		totalReward: 0,
		totalStaked: 0,
		totalStakeWeight: 0,
	},
	pendingTransactions: [],
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case SET_ACCOUNT:
		case SET_BLOCKCHAIN_DATA:
		case SET_CURRENT_BLOCK:
		case SET_STAKABLES:
		case SET_PERIODS:
		case SET_USER_STAKES:
		case SET_DISTRIBUTIONS:
		case SET_CONTRACT_EVENTS:
		case SET_PUBLIC_INFO:
		case SET_PENDING_TRANSACTIONS:
		case SET_PENALTIES:
		case SET_POTS:
			return { ...state, ...payload };

		case RESET_STAKE_STORE: {
			return {
				...state,
				account: '',
				stakables: [initialStakable],
				userStakes: {},
				balance: 0,
				contractEvents: [],
				publicInfo: {
					totalReward: 0,
					totalStaked: 0,
					totalStakeWeight: 0,
				},
				pendingTransactions: [],
			};
		}

		default:
			return state;
	}
};
