import { createSelector } from 'reselect';

const VERIFIED_BANK_STATUS = 3;
const getOfframp = (state, ownProps) => state.app.offramp[ownProps.currency];
const getBankAccounts = (state) => state.user.bank_account;

export const withdrawalOptionsSelector = createSelector(
	[getOfframp, getBankAccounts],
	(offramp = [], bank_account = []) => {
		const verifiedMethods = bank_account.filter(
			({ status }) => status === VERIFIED_BANK_STATUS
		);
		const applicableMethods = verifiedMethods.filter(({ type = 'bank' }) =>
			offramp.includes(type)
		);
		return applicableMethods;
	}
);
