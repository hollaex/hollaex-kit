import React from 'react';
import { Router, Route, browserHistory, Redirect } from 'react-router';
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
	Chat,
	WithdrawConfirmation,
	AddTradeTabs,
	// ADMIN
	User,
	TradeHistory,
	UserBalance,
	Logins,
	Audits,
	AppWrapper as AdminContainer,
	AdminLogin,
	Main,
	Balance,
	AdminVerification,
	UploadIds,
	Otp,
	Activate,
	FullListUsers,
	Deposits,
	Limits,
	DepositsPage,
	BlockchainTransaction,
	Fees,
	AdminChat,
	Wallets,
	Transactions,
	UserFees,
	Trades,
	PATHS
} from './containers';

import store from './store';
import { verifyToken } from './actions/authAction';
import { setLanguage } from './actions/appActions';

import { isLoggedIn, getToken, removeToken, getTokenTimestamp, isAdmin } from './utils/token';
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

const createLocalizedRoutes = ({ router, routeParams }) => {
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


const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={(props) => {
			console.log(props)
			if (isAdmin()) {
				return (
					<AdminContainer {...props}>
						<Component {...props} {...rest} />
					</AdminContainer>
				)
			} else {
				return (
					<Redirect
						to={{
							pathname: '/login',
							state: { from: props.location }
						}}
					/>
				)
			}
		}
		}
	/>
);


export default (
	<Router history={browserHistory}>
		{!IS_PRO_VERSION ? <Route path="/" name="Home" component={Home} /> : null}
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
			<Route path="account" name="Account" component={Account} onEnter={requireAuth} />
			<Route path="account/settings/username" name="username" component={Account} />
			<Route path="security" name="Security" component={Account} />
			<Route path="developers" name="Developers" component={Account} />
			<Route path="settings" name="Settings" component={Account} />
			<Route path="summary" name="Summary" component={Account} />
			<Route path="verification" name="Verification" component={Account} onEnter={requireAuth} />
			<Route path="wallet" name="Wallet" component={MainWallet} onEnter={requireAuth} />
			<Route path="wallet/:currency" name="Wallet" component={CurrencyWallet} onEnter={requireAuth} />
			<Route path="wallet/:currency/deposit" name="Deposit" component={Deposit} onEnter={requireAuth} />
			<Route path="wallet/:currency/withdraw" name="Withdraw" component={Withdraw} onEnter={requireAuth} />
			<Route
				path="transactions"
				name="Transactions"
				component={TransactionsHistory}
				onEnter={requireAuth}
			/>
			<Route path="trade/:pair" name="Trade" component={Trade} />
			<Route path="trade/add/tabs" name="Trade Tabs" component={AddTradeTabs} />
			<Route path="quick-trade/:pair" name="Quick Trade" component={QuickTrade} />
			<Route path="chat" name="Chat" component={Chat} onEnter={requireAuth} />
			<Route
				path="confirm-withdraw/:token"
				name="ConfirmWithdraw"
				component={WithdrawConfirmation}
			/>
		</Route>
		<Route component={AdminContainer}>
			<Route path="/admin" name="Admin Main" component={Main} />
			<Route path="/admin/user" name="Admin User" component={User} />
			<Route path="/admin/wallets" name="Admin Wallets" component={Wallets} />
			<Route path="/admin/withdrawals" name="Admin Withdrawals" component={Deposits} />
			<Route path="/admin/deposits" name="Admin Deposits" component={Deposits} />
			<Route path="/admin/blockchain" name="Admin BlockchainTransaction" component={BlockchainTransaction} />
			<Route path="/admin/fees" name="Admin Fees" component={UserFees} />
			<Route path="/admin/limits" name="Admin Limits" component={Limits} />
			<Route path="/admin/chat" name="Admin Chats" component={AdminChat} />
		</Route>
		<Route path="privacy-policy" component={Legal} content="legal" onEnter={requireAuth} />
		<Route path="general-terms" component={Legal} content="terms" onEnter={requireAuth} />
		<Route path="*" component={NotFound} />

	</Router>
);
