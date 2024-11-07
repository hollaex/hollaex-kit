import React, { Fragment } from 'react';
import { Router, Route, browserHistory } from 'react-router';
import ReactGA from 'react-ga';
import { isMobile } from 'react-device-detect';

import { PATHS } from './containers';
import { verifyToken } from './actions/authAction';
import { setLanguage } from './actions/appActions';
import { SmartTarget, NotLoggedIn } from 'components';
import {
	isLoggedIn,
	getToken,
	removeToken,
	isAdmin,
	checkRole,
} from './utils/token';
import {
	getLanguage,
	getInterfaceLanguage,
	getLanguageFromLocal,
} from './utils/string';
import { getExchangeInitialized, getSetupCompleted } from './utils/initialize';
import { STAKING_INDEX_COIN, isStakingAvailable } from 'config/contracts';

import chat from './containers/Admin/Chat';
import store from './store';
import PluginConfig from 'containers/Admin/PluginConfig';
import Loadable from 'react-loadable';
import { Loader } from 'components';

const LoadingComponent = ({ isLoading, error }) => {
	return <Loader background={false} />;
};

const Container = Loadable({
	loader: () => import('./containers/App'),
	loading: LoadingComponent,
});

const Account = Loadable({
	loader: () => import('./containers/Account'),
	loading: LoadingComponent,
});

const P2P = Loadable({
	loader: () => import('./containers/P2P'),
	loading: LoadingComponent,
});

const MainWallet = Loadable({
	loader: () => import('./containers/Wallet/MainWallet'),
	loading: LoadingComponent,
});

const Volume = Loadable({
	loader: () => import('./containers/Volume'),
	loading: LoadingComponent,
});

const CurrencyWallet = Loadable({
	loader: () => import('./containers/Wallet/CurrencyWallet'),
	loading: LoadingComponent,
});

const Login = Loadable({
	loader: () => import('./containers/Login'),
	loading: LoadingComponent,
});

const Signup = Loadable({
	loader: () => import('./containers/Signup'),
	loading: LoadingComponent,
});
const VerificationEmailRequest = Loadable({
	loader: () => import('./containers/VerificationEmailRequest'),
	loading: LoadingComponent,
});
const VerificationEmailCode = Loadable({
	loader: () => import('./containers/VerificationEmailCode'),
	loading: LoadingComponent,
});
const Home = Loadable({
	loader: () => import('./containers/Home'),
	loading: LoadingComponent,
});
const Deposit = Loadable({
	loader: () => import('./containers/Deposit'),
	loading: LoadingComponent,
});
const Withdraw = Loadable({
	loader: () => import('./containers/Withdraw'),
	loading: LoadingComponent,
});
const TransactionsHistory = Loadable({
	loader: () => import('./containers/TransactionsHistory'),
	loading: LoadingComponent,
});
const Trade = Loadable({
	loader: () => import('./containers/Trade'),
	loading: LoadingComponent,
});
const ChartEmbed = Loadable({
	loader: () => import('./containers/ChartEmbed'),
	loading: LoadingComponent,
});
const Legal = Loadable({
	loader: () => import('./containers/Legal'),
	loading: LoadingComponent,
});
const AuthContainer = Loadable({
	loader: () => import('./containers/AuthContainer'),
	loading: LoadingComponent,
});
const RequestResetPassword = Loadable({
	loader: () => import('./containers/RequestResetPassword'),
	loading: LoadingComponent,
});
const ResetPassword = Loadable({
	loader: () => import('./containers/ResetPassword'),
	loading: LoadingComponent,
});
const QuickTrade = Loadable({
	loader: () => import('./containers/QuickTrade'),
	loading: LoadingComponent,
});
const Chat = Loadable({
	loader: () => import('./containers/Chat'),
	loading: LoadingComponent,
});
const WithdrawConfirmation = Loadable({
	loader: () => import('./containers/WithdrawConfirmation'),
	loading: LoadingComponent,
});
const AddTradeTabs = Loadable({
	loader: () => import('./containers/TradeTabs'),
	loading: LoadingComponent,
});
const Stake = Loadable({
	loader: () => import('./containers/Stake'),
	loading: LoadingComponent,
});
const StakeDetails = Loadable({
	loader: () => import('./containers/StakeDetails'),
	loading: LoadingComponent,
});
const Apps = Loadable({
	loader: () => import('./containers/Apps'),
	loading: LoadingComponent,
});
const AppDetails = Loadable({
	loader: () => import('./containers/AppDetails'),
	loading: LoadingComponent,
});

// ADMIN
const User = Loadable({
	loader: () => import('./containers/Admin/User'),
	loading: LoadingComponent,
});

const AdminStake = Loadable({
	loader: () => import('./containers/Admin/Stakes'),
	loading: LoadingComponent,
});

const Audits = Loadable({
	loader: () => import('./containers/Admin/Audits'),
	loading: LoadingComponent,
});
const Session = Loadable({
	loader: () => import('./containers/Admin/Sessions'),
	loading: LoadingComponent,
});
const AdminContainer = Loadable({
	loader: () => import('./containers/Admin/AppWrapper'),
	loading: LoadingComponent,
});
const Limits = Loadable({
	loader: () => import('./containers/Admin/Limits'),
	loading: LoadingComponent,
});
const UserFees = Loadable({
	loader: () => import('./containers/Admin/UserFees'),
	loading: LoadingComponent,
});
const AdminOrders = Loadable({
	loader: () => import('./containers/Admin/ActiveOrders'),
	loading: LoadingComponent,
});
const MobileHome = Loadable({
	loader: () => import('./containers/MobileHome'),
	loading: LoadingComponent,
});
const Broker = Loadable({
	loader: () => import('./containers/Admin/Broker'),
	loading: LoadingComponent,
});
const Plugins = Loadable({
	loader: () => import('./containers/Admin/Plugins'),
	loading: LoadingComponent,
});
const PluginStore = Loadable({
	loader: () => import('./containers/Admin/Plugins/PluginStore'),
	loading: LoadingComponent,
});
const Settings = Loadable({
	loader: () => import('./containers/Admin/Settings'),
	loading: LoadingComponent,
});
const AdminFees = Loadable({
	loader: () => import('./containers/Admin/AdminFees'),
	loading: LoadingComponent,
});
const Init = Loadable({
	loader: () => import('./containers/Init'),
	loading: LoadingComponent,
});
const AdminLogin = Loadable({
	loader: () => import('./containers/Init/Login'),
	loading: LoadingComponent,
});
const AdminDashboard = Loadable({
	loader: () => import('./containers/Admin/Dashboard'),
	loading: LoadingComponent,
});
const AdminFinancials = Loadable({
	loader: () => import('./containers/Admin/AdminFinancials'),
	loading: LoadingComponent,
});
const MoveToDash = Loadable({
	loader: () => import('./containers/Admin/MoveToDash'),
	loading: LoadingComponent,
});

const General = Loadable({
	loader: () => import('./containers/Admin/General'),
	loading: LoadingComponent,
});

const Tiers = Loadable({
	loader: () => import('./containers/Admin/Tiers'),
	loading: LoadingComponent,
});
const Roles = Loadable({
	loader: () => import('./containers/Admin/Roles'),
	loading: LoadingComponent,
});
const Resources = Loadable({
	loader: () => import('./containers/Admin/Resources'),
	loading: LoadingComponent,
});
const Pairs = Loadable({
	loader: () => import('./containers/Admin/Trades'),
	loading: LoadingComponent,
});
const Fiatmarkets = Loadable({
	loader: () => import('./containers/Admin/Fiat'),
	loading: LoadingComponent,
});
const AdminApps = Loadable({
	loader: () => import('./containers/Admin/Apps'),
	loading: LoadingComponent,
});

const Billing = Loadable({
	loader: () => import('./containers/Admin/Billing'),
	loading: LoadingComponent,
});

const DigitalAssets = Loadable({
	loader: () => import('./containers/DigitalAssets'),
	loading: LoadingComponent,
});
const CoinPage = Loadable({
	loader: () => import('./containers/CoinPage'),
	loading: LoadingComponent,
});
const WhiteLabel = Loadable({
	loader: () => import('./containers/WhiteLabel'),
	loading: LoadingComponent,
});
const FeesAndLimits = Loadable({
	loader: () => import('./containers/FeesAndLimits'),
	loading: LoadingComponent,
});
const ReferralList = Loadable({
	loader: () => import('./containers/Summary/components/ReferralList'),
	loading: LoadingComponent,
});

const AddressBook = Loadable({
	loader: () => import('./containers/Wallet/AddressBook'),
	loading: LoadingComponent,
});

const MobileBarMoreOptions = Loadable({
	loader: () => import('./containers/App/MobileBarMoreOptions'),
	loading: LoadingComponent,
});

const ConfirmChangePassword = Loadable({
	loader: () => import('./containers/ConfirmChangePassword'),
	loading: LoadingComponent,
});

ReactGA.initialize('UA-154626247-1'); // Google analytics. Set your own Google Analytics values
browserHistory.listen((location) => {
	if (window) {
		window.scroll({
			top: 0,
			left: 0,
			behavior: 'smooth',
		});
	}
	ReactGA.set({ page: window.location.pathname });
	ReactGA.pageview(window.location.pathname);
});

let lang = getLanguage();
if (!lang) {
	lang = getInterfaceLanguage();
}

if (getLanguageFromLocal()) {
	store.dispatch(setLanguage(lang));
}

let token = getToken();

if (token) {
	store.dispatch(verifyToken(token));
}

function requireAuth(nextState, replace) {
	const initialized = getExchangeInitialized();
	const setup_completed = getSetupCompleted();
	if (
		initialized === 'false' ||
		(typeof initialized === 'boolean' && !initialized)
	) {
		replace({
			pathname: '/init',
		});
	} else if (
		!isLoggedIn() &&
		(setup_completed === 'false' ||
			(typeof setup_completed === 'boolean' && !setup_completed))
	) {
		replace({
			pathname: '/admin-login',
		});
	} else if (
		isLoggedIn() &&
		isAdmin() &&
		(setup_completed === 'false' ||
			(typeof setup_completed === 'boolean' && !setup_completed))
	) {
		replace({
			pathname: '/admin',
		});
	} else if (!isLoggedIn()) {
		replace({
			pathname: '/login',
		});
	}
}

function loggedIn(nextState, replace) {
	const initialized = getExchangeInitialized();
	const setup_completed = getSetupCompleted();
	if (
		initialized === 'false' ||
		(typeof initialized === 'boolean' && !initialized)
	) {
		replace({
			pathname: '/init',
		});
	} else if (
		!isLoggedIn() &&
		(setup_completed === 'false' ||
			(typeof setup_completed === 'boolean' && !setup_completed))
	) {
		replace({
			pathname: '/admin-login',
		});
	} else if (
		isLoggedIn() &&
		isAdmin() &&
		(setup_completed === 'false' ||
			(typeof setup_completed === 'boolean' && !setup_completed))
	) {
		replace({
			pathname: '/admin',
		});
	} else if (isLoggedIn()) {
		replace({
			pathname: '/account',
		});
	}
}

const checkStaking = (nextState, replace) => {
	const {
		app: { contracts, features },
	} = store.getState();
	if (
		!features.cefi_stake &&
		!isStakingAvailable(STAKING_INDEX_COIN, contracts)
	) {
		replace({
			pathname: '/account',
		});
	}
};

const checkLanding = (nextState, replace) => {
	if (!store.getState().app.home_page) {
		replace({
			pathname: '/login',
		});
	}
};

const logOutUser = () => {
	if (getToken()) {
		removeToken();
	}
};

const setLogout = (nextState, replace) => {
	removeToken();
	replace({
		pathname: '/login',
	});
};

const createLocalizedRoutes = ({ router, routeParams }) => {
	store.dispatch(setLanguage(routeParams.locale));
	router.replace('/');
	return <div />;
};

const NotFound = ({ router }) => {
	router.replace('/account');
	return <div />;
};

const noAuthRoutesCommonProps = {
	onEnter: loggedIn,
};

const noLoggedUserCommonProps = {
	onEnter: logOutUser,
};

function withAdminProps(Component, key) {
	let adminProps = {};
	let restrictedPaths = [
		'general',
		'financials',
		'trade',
		'plugins',
		'tiers',
		'roles',
		'billing',
	];

	PATHS.map((data) => {
		const { pathProps = {}, routeKey, ...rest } = data;
		if (routeKey === key) {
			adminProps = { ...rest, ...pathProps };
		}
		return 0;
	});
	return function (matchProps) {
		if (
			checkRole() !== 'admin' &&
			restrictedPaths.includes(key) &&
			!(checkRole() === 'supervisor' && key === 'financials')
		) {
			return <NotFound {...matchProps} />;
		} else {
			return <Component {...adminProps} {...matchProps} />;
		}
	};
}

function generateRemoteRoutes(remoteRoutes) {
	const privateRouteProps = { onEnter: requireAuth };

	return (
		<Fragment>
			{remoteRoutes.map(
				({ path, name, target, is_public, token_required }, index) => (
					<Route
						key={`${name}_remote-route_${index}`}
						path={path}
						name={name}
						component={() => {
							const Wrapper = token_required ? NotLoggedIn : Fragment;
							const props = token_required
								? {
										wrapperClassName:
											'pt-4 presentation_container apply_rtl settings_container',
								  }
								: {};
							return (
								<div>
									<Wrapper {...props}>
										<SmartTarget id={target} />
									</Wrapper>
								</div>
							);
						}}
						{...(!is_public && privateRouteProps)}
					/>
				)
			)}
		</Fragment>
	);
}

export const generateRoutes = (routes = []) => {
	const remoteRoutes = generateRemoteRoutes(routes);
	return (
		<Router history={browserHistory}>
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
				<Route
					path="verify"
					name="Verify"
					component={VerificationEmailRequest}
				/>
				<Route
					path="verify/:code"
					name="verifyCode"
					component={VerificationEmailCode}
				/>
			</Route>
			<Route component={Container}>
				<Route path="/" name="Home" component={Home} onEnter={checkLanding} />
				<Route
					path="/chart-embed/:pair"
					name="ChartEmbed"
					component={ChartEmbed}
				/>
				{isMobile ? (
					<Route
						path="/home"
						name="Home"
						component={MobileHome}
						onEnter={requireAuth}
					/>
				) : null}
				<Route
					path="change-password-confirm/:code"
					name="Reset Password Request"
					component={ConfirmChangePassword}
				/>
				<Route path="account" name="Account" component={Account} />
				<Route
					path="account/settings/username"
					name="username"
					component={Account}
				/>
				<Route path="security" name="Security" component={Account} />
				<Route
					path="developers"
					name="Developers"
					component={Account}
					onEnter={requireAuth}
				/>
				<Route path="settings" name="Settings" component={Account} />
				<Route path="apps" name="Apps" component={Apps} />
				<Route
					path="apps/details/:app"
					name="AppDetails"
					component={AppDetails}
					onEnter={requireAuth}
				/>
				<Route path="summary" name="Summary" component={Account} />
				<Route
					path="fees-and-limits"
					name="Fees and limits"
					component={FeesAndLimits}
				/>
				<Route
					path="referral"
					name="referral"
					component={ReferralList}
					onEnter={requireAuth}
				/>
				<Route path="prices" name="Digital Asset" component={DigitalAssets} />
				<Route path="white-label" name="WhiteLabel" component={WhiteLabel} />
				<Route path="verification" name="Verification" component={Account} />
				<Route path="wallet" name="Wallet" component={MainWallet} />
				{isMobile && (
					<Route path="more" name="More" component={MobileBarMoreOptions} />
				)}
				<Route
					path="wallet/address-book"
					name="wallet/address-book"
					component={AddressBook}
				/>
				<Route
					path="wallet/deposit"
					name="Withdraw Deposit"
					component={Deposit}
					onEnter={requireAuth}
				/>
				<Route
					path="wallet/withdraw"
					name="Wallet"
					component={Withdraw}
					onEnter={requireAuth}
				/>
				<Route
					path="wallet/history"
					name="Wallet History"
					component={MainWallet}
					onEnter={requireAuth}
				/>
				<Route
					path="wallet/volume"
					name="Volume"
					component={Volume}
					onEnter={requireAuth}
				/>
				<Route path="p2p" name="P2P" component={P2P} />

				<Route
					path="p2p/order/:order_id"
					name="P2P Order"
					component={P2P}
					onEnter={requireAuth}
				/>

				<Route
					path="p2p/orders"
					name="P2P Orders"
					component={P2P}
					onEnter={requireAuth}
				/>
				<Route
					path="p2p/deals"
					name="P2P Deals"
					component={P2P}
					onEnter={requireAuth}
				/>
				<Route
					path="p2p/mydeals"
					name="P2P Deals"
					component={P2P}
					onEnter={requireAuth}
				/>
				<Route
					path="p2p/profile"
					name="P2P Deals"
					component={P2P}
					onEnter={requireAuth}
				/>
				<Route
					path="p2p/post-deal"
					name="P2P Deals"
					component={P2P}
					onEnter={requireAuth}
				/>

				<Route
					path="wallet/:currency"
					name="Wallet"
					component={CurrencyWallet}
					onEnter={requireAuth}
				/>
				<Route
					path="wallet/:currency/deposit"
					name="Deposit"
					component={Deposit}
					onEnter={requireAuth}
				/>
				<Route
					path="wallet/:currency/withdraw"
					name="Withdraw"
					component={Withdraw}
					onEnter={requireAuth}
				/>
				<Route
					path="transactions"
					name="Transactions"
					component={TransactionsHistory}
				/>
				<Route path="trade/:pair" name="Trade" component={Trade} />
				<Route path="trade" name="Trade Tabs" component={AddTradeTabs} />
				<Route path="markets" name="Trade Tabs" component={AddTradeTabs} />
				<Route path="quick-trade" name="Quick Trade" component={QuickTrade} />
				<Route
					path="quick-trade/:pair"
					name="Quick Trade"
					component={QuickTrade}
				/>
				<Route
					path="prices/coin/:token"
					name="Coin Page"
					component={CoinPage}
				/>
				<Route path="chat" name="Chat" component={Chat} onEnter={requireAuth} />
				<Route
					path="confirm-withdraw/:token"
					name="ConfirmWithdraw"
					component={WithdrawConfirmation}
				/>
				<Route
					path="stake"
					name="Stake"
					component={Stake}
					onEnter={checkStaking}
				/>
				<Route
					path="stake/details/:token"
					name="StakeToken"
					component={StakeDetails}
					onEnter={checkStaking}
				/>
				<Route path="logout" name="LogOut" onEnter={setLogout} />
				{remoteRoutes}
			</Route>
			<Route component={AdminContainer}>
				<Route path="/admin" name="Admin Main" component={AdminDashboard} />
				<Route
					path="/admin/general"
					name="Admin General"
					component={withAdminProps(General, 'general')}
				/>
				<Route
					path="/admin/fiat"
					name="Admin Fiat"
					component={withAdminProps(Fiatmarkets, 'fiat')}
				/>
				<Route
					path="/admin/tiers"
					name="Admin Tiers"
					component={withAdminProps(Tiers, 'tiers')}
				/>
				<Route
					path="/admin/roles"
					name="Admin Roles"
					component={withAdminProps(Roles, 'roles')}
				/>
				<Route
					path="/admin/user"
					name="Admin User"
					component={withAdminProps(User, 'user')}
				/>
				<Route
					path="/admin/audits"
					name="Admin Audits"
					component={withAdminProps(Audits, 'audit')}
				/>
				<Route
					path="/admin/stakes"
					name="Admin Stakes"
					component={withAdminProps(AdminStake, 'stake')}
				/>
				<Route
					path="/admin/sessions"
					name="Admin Session"
					component={withAdminProps(Session, 'session')}
				/>
				<Route
					path="/admin/financials"
					name="Admin Financials"
					component={withAdminProps(AdminFinancials, 'financials')}
				/>
				<Route
					path="/admin/trade"
					name="Admin Trade"
					component={withAdminProps(Pairs, 'trade')}
				/>
				<Route
					path="/admin/hosting"
					name="Admin Hosting"
					component={withAdminProps(MoveToDash, 'hosting')}
				/>
				<Route
					path="/admin/apikeys"
					name="Admin APIkeys"
					component={withAdminProps(MoveToDash, 'apikeys')}
				/>
				<Route
					path="/admin/billing"
					name="Admin Billing"
					component={withAdminProps(Billing, 'billing')}
				/>
				<Route
					path="/admin/chat"
					name="Admin Chat"
					component={withAdminProps(chat, 'chat')}
				/>
				<Route
					path="/admin/collateral"
					name="Admin Collateral"
					component={withAdminProps(MoveToDash, 'collateral')}
				/>
				<Route
					path="/admin/plugin/adminView/:name"
					name="Admin Announcement"
					component={withAdminProps(PluginConfig, 'adminView')}
				/>
				{/* <Route
				path="/admin/wallets"
				name="Admin Wallets"
				component={withAdminProps(Wallets, 'wallets')}
			/> */}
				{/* <Route
				path="/admin/transfer"
				name="Admin Transfer"
				component={withAdminProps(Transfer, 'transfer')}
			/> */}
				<Route
					path="/admin/fees"
					name="Admin Fees"
					component={withAdminProps(AdminFees, 'fees')}
				/>
				{/* <Route
				path="/admin/withdrawals"
				name="Admin Withdrawals"
				component={withAdminProps(DepositsPage, 'withdrawal')}
			/>
			<Route
				path="/admin/deposits"
				name="Admin Deposits"
				component={withAdminProps(DepositsPage, 'deposit')}
			/> */}
				<Route
					path="/admin/pair"
					name="Admin Pairs"
					component={withAdminProps(UserFees, 'pair')}
				/>
				<Route
					path="/admin/coin"
					name="Admin Coins"
					component={withAdminProps(Limits, 'coin')}
				/>
				<Route
					path="/admin/activeorders"
					name="Admin Orders"
					component={withAdminProps(AdminOrders, 'orders')}
				/>
				<Route
					path="/admin/broker"
					name="Admin broker"
					component={withAdminProps(Broker, 'broker')}
				/>
				<Route
					path="/admin/plugins"
					name="Admin plugins"
					component={withAdminProps(Plugins, 'plugins')}
				/>
				<Route
					path="/admin/plugins/store"
					name="Admin plugins store"
					component={withAdminProps(PluginStore, 'plugins')}
				/>
				<Route
					path="/admin/apps"
					name="Admin apps"
					component={withAdminProps(AdminApps, 'apps')}
				/>
				{/* <Route
				path="/admin/plugins/:services"
				name="Admin plugins"
				component={withAdminProps(PluginServices, 'plugins')}
			/> */}
				<Route
					path="/admin/settings"
					name="Admin settings"
					component={withAdminProps(Settings, 'settings')}
				/>
				<Route
					path="/admin/resources"
					name="Admin resources"
					component={withAdminProps(Resources, 'resources')}
				/>
			</Route>
			<Route
				path="privacy-policy"
				component={Legal}
				content="legal"
				onEnter={requireAuth}
			/>
			<Route
				path="general-terms"
				component={Legal}
				content="terms"
				onEnter={requireAuth}
			/>
			<Route path="admin-login" name="admin-login" component={AdminLogin} />
			<Route path="init" name="initWizard" component={Init} />
			<Route path="*" component={NotFound} />
		</Router>
	);
};
