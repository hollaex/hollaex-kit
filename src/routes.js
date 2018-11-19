import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import ReactGA from 'react-ga';

import {
	NETWORK,
	IS_PRO_VERSION,
	PRO_VERSION_REDIRECT,
	DEFAULT_VERSION_REDIRECT
} from './config/constants';

import {
	App as Container,
	Account,
	MainWallet,
	CurrencyWallet,
	Login,
	Signup,
	VerificationEmailRequest,
	VerificationEmailCode,
	Home,
	Deposit,
	Withdraw,
	TransactionsHistory,
	Trade,
	Legal,
	AuthContainer,
	RequestResetPassword,
	ResetPassword,
	QuickTrade,
	Verification,
	Chat,
	UserSettings,
	WithdrawConfirmation
} from './containers';

import store from './store';
import { verifyToken } from './actions/authAction';
import { setLanguage } from './actions/appActions';

import { isLoggedIn, getToken, removeToken, getTokenTimestamp } from './utils/token';
import { getLanguage, getInterfaceLanguage } from './utils/string';
import { checkUserSessionExpired } from './utils/utils';

// Initialize Google analytics
if (NETWORK === 'mainnet') {
	ReactGA.initialize('UA-112052696-1');
	browserHistory.listen((location) => {
		ReactGA.set({ page: window.location.pathname });
		ReactGA.pageview(window.location.pathname);
	});
}

let lang = getLanguage();
if (!lang) {
	lang = getInterfaceLanguage();
}
store.dispatch(setLanguage(lang));

let token = getToken();

if (token) {
	// check if the token has expired, in that case, remove token
	if (checkUserSessionExpired(getTokenTimestamp())) {
		removeToken();
	} else {
		store.dispatch(verifyToken(token));
	}
}

function requireAuth(nextState, replace) {
	if (!isLoggedIn()) {
		replace({
			pathname: '/login'
		});
	}
}

function loggedIn(nextState, replace) {
	if (isLoggedIn()) {
		replace({
			pathname: '/account'
		});
	}
}

const logOutUser = () => {
	if (getToken()) {
		removeToken();
	}
};

const createLocalizedRoutes = ({ router, routeParams}) => {
	store.dispatch(setLanguage(routeParams.locale));
	router.replace('/');
	return <div />;
}

const NotFound = ({ router }) => {
	router.replace(
		IS_PRO_VERSION ? PRO_VERSION_REDIRECT : DEFAULT_VERSION_REDIRECT
	);
	return <div />;
};

const noAuthRoutesCommonProps = {
	onEnter: loggedIn
};

const noLoggedUserCommonProps = {
	onEnter: logOutUser
};

export default (
	<Router history={browserHistory}>
		{!IS_PRO_VERSION && <Route path="/" name="Home" component={Home} />}
		<Route path="lang/:locale" component={createLocalizedRoutes} />
		<Route component={AuthContainer} {...noAuthRoutesCommonProps}>
			<Route path="login" name="Login" component={Login} />
			<Route path="signup" name="signup" component={Signup} />
		</Route>
		<Route component={AuthContainer} {...noLoggedUserCommonProps}>
			<Route
				path="reset-password"
				name="Reset Password Request"
				component={RequestResetPassword}
			/>
			<Route
				path="reset-password/:code"
				name="Reset Password"
				component={ResetPassword}
			/>
			<Route path="verify" name="Verify" component={VerificationEmailRequest} />
			<Route
				path="verify/:code"
				name="verifyCode"
				component={VerificationEmailCode}
			/>
		</Route>
		<Route component={Container}>
			<Route path="account" name="Account" component={Account} onEnter={requireAuth}/>
			<Route path="account/settings/username" name="username" component={Account} />
			<Route path="security" name="Security" component={Account} />
			<Route path="developers" name="Developers" component={Account} />
			<Route path="settings" name="Settings" component={Account} />
			<Route path="wallet" name="Wallet" component={MainWallet} onEnter={requireAuth}/>
			<Route path="wallet/:currency" name="Wallet" component={CurrencyWallet} onEnter={requireAuth}/>
			<Route path="wallet/:currency/deposit" name="Deposit" component={Deposit} onEnter={requireAuth}/>
			<Route path="wallet/:currency/withdraw" name="Withdraw" component={Withdraw} onEnter={requireAuth}/>
			<Route
				path="transactions"
				name="Transactions"
				component={TransactionsHistory}
				onEnter={requireAuth}
			/>
			<Route path="trade/:pair" name="Trade" component={Trade} />
			<Route path="quick-trade/:pair" name="Quick Trade" component={QuickTrade} />
			<Route path="chat" name="Chat" component={Chat} onEnter={requireAuth}/>
			<Route
				path="confirm-withdraw/:token"
				name="ConfirmWithdraw"
				component={WithdrawConfirmation}
			/>
		</Route>
		<Route
			path="verification"
			name="Verification"
			component={Verification}
			onEnter={requireAuth}
		/>
		<Route path="privacy-policy" component={Legal} content="legal" onEnter={requireAuth}/>
		<Route path="general-terms" component={Legal} content="terms" onEnter={requireAuth}/>
		<Route path="*" component={NotFound} />
	</Router>
);
