import { createSelector } from 'reselect';

const VERIFIED_BANK_STATUS = 3;
const normalizeKey = (val = '') =>
	typeof val === 'string' ? val.trim().toLowerCase() : '';

const getSelectedCurrency = (state, ownProps) =>
	state.app?.withdrawFields?.withdrawCurrency || ownProps.currency;

const getOfframp = (state, ownProps) => {
	const currency = getSelectedCurrency(state, ownProps);
	const offramp = state.app?.offramp || {};
	return (
		offramp?.[currency] ||
		offramp?.[`${currency}`.toLowerCase()] ||
		offramp?.[`${currency}`.toUpperCase()]
	);
};

const getUserPayments = (state) => state.app?.user_payments || {};

const getBankAccounts = (state) =>
	// `bank_account` is stored both at the top-level and under `userData`,
	// but some flows only refresh `userData` (e.g. verification updates).
	state.user?.userData?.bank_account || state.user?.bank_account || [];

export const withdrawalOptionsSelector = createSelector(
	[getOfframp, getBankAccounts, getUserPayments],
	(offramp = [], bank_account = [], user_payments = {}) => {
		const offrampList = Array.isArray(offramp) ? offramp : [];
		const offrampNorm = offrampList.map(normalizeKey);

		const resolveOfframpKey = (type) => {
			if (!type || typeof type !== 'string') {
				return '';
			}
			// Prefer exact match first, then case-insensitive match against offramp list.
			if (offrampList.includes(type)) {
				return type;
			}
			const t = normalizeKey(type);
			const idx = offrampNorm.indexOf(t);
			return idx >= 0 ? offrampList[idx] : '';
		};

		const inferPaymentTypeKeyFromAccount = (account = {}) => {
			const hidden = ['id', 'status', 'type'];
			const accountKeys = Object.keys(account).filter(
				(k) => !hidden.includes(k)
			);
			if (!accountKeys.length) {
				return '';
			}

			let bestKey = '';
			let bestScore = 0;
			Object.entries(user_payments || {}).forEach(
				([paymentKey, paymentDef]) => {
					const schemaFields = Array.isArray(paymentDef?.data)
						? paymentDef.data
						: [];
					const schemaKeys = schemaFields.map(({ key }) => key).filter(Boolean);
					// Must be an enabled offramp for this currency.
					const resolved = resolveOfframpKey(paymentKey);
					if (!resolved || !schemaKeys.length) {
						return;
					}
					const overlap = schemaKeys.filter((k) => accountKeys.includes(k))
						.length;
					if (overlap > bestScore) {
						bestScore = overlap;
						bestKey = resolved;
					}
				}
			);
			return bestScore > 0 ? bestKey : '';
		};

		const verifiedMethods = bank_account.filter(
			({ status }) => status === VERIFIED_BANK_STATUS
		);

		const applicableMethods = verifiedMethods
			.map((account) => {
				const resolvedType =
					resolveOfframpKey(account?.type) ||
					inferPaymentTypeKeyFromAccount(account);
				return resolvedType ? { ...account, type: resolvedType } : null;
			})
			.filter(Boolean);

		return applicableMethods;
	}
);
