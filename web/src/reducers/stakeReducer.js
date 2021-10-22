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
	userStakes: {},
	balance: 0,
	distributions: [],
	contractEvents: [],
	publicInfo: {
		totalReward: 0,
		totalStaked: 0,
		totalStakeWeight: 0,
	},
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
			return { ...state, ...payload };

		default:
			return state;
	}
};
