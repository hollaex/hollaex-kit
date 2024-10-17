import Loadable from 'react-loadable';
export { PATHS } from './Admin/paths';

const LoadingComponent = ({ isLoading, error }) => {
	return null;
};

export const App = Loadable({
	loader: () => import('./App'),
	loading: LoadingComponent,
});

export const AuthContainer = Loadable({
	loader: () => import('./AuthContainer'),
	loading: LoadingComponent,
});

export const UserProfile = Loadable({
	loader: () => import('./UserProfile'),
	loading: LoadingComponent,
});

export const UserSecurity = Loadable({
	loader: () => import('./UserSecurity'),
	loading: LoadingComponent,
});

export const UserSettings = Loadable({
	loader: () => import('./UserSettings'),
	loading: LoadingComponent,
});

export const ContactForm = Loadable({
	loader: () => import('./ContactForm'),
	loading: LoadingComponent,
});

export const HelpfulResourcesForm = Loadable({
	loader: () => import('./HelpfulResourcesForm'),
	loading: LoadingComponent,
});

export const Account = Loadable({
	loader: () => import('./Account'),
	loading: LoadingComponent,
});

export * from './Wallet';

export const Deposit = Loadable({
	loader: () => import('./Deposit'),
	loading: LoadingComponent,
});

export const Withdraw = Loadable({
	loader: () => import('./Withdraw'),
	loading: LoadingComponent,
});

export const WithdrawConfirmation = Loadable({
	loader: () => import('./WithdrawConfirmation'),
	loading: LoadingComponent,
});

export const TransactionsHistory = Loadable({
	loader: () => import('./TransactionsHistory'),
	loading: LoadingComponent,
});

export const Login = Loadable({
	loader: () => import('./Login'),
	loading: LoadingComponent,
});

export const Signup = Loadable({
	loader: () => import('./Signup'),
	loading: LoadingComponent,
});

export const VerificationEmailRequest = Loadable({
	loader: () => import('./VerificationEmailRequest'),
	loading: LoadingComponent,
});

export const VerificationEmailCode = Loadable({
	loader: () => import('./VerificationEmailCode'),
	loading: LoadingComponent,
});

export const Home = Loadable({
	loader: () => import('./Home'),
	loading: LoadingComponent,
});

export const Trade = Loadable({
	loader: () => import('./Trade'),
	loading: LoadingComponent,
});

export const ChartEmbed = Loadable({
	loader: () => import('./ChartEmbed'),
	loading: LoadingComponent,
});

export const Legal = Loadable({
	loader: () => import('./Legal'),
	loading: LoadingComponent,
});

export const RequestResetPassword = Loadable({
	loader: () => import('./RequestResetPassword'),
	loading: LoadingComponent,
});

export const ResetPassword = Loadable({
	loader: () => import('./ResetPassword'),
	loading: LoadingComponent,
});

export const QuickTrade = Loadable({
	loader: () => import('./QuickTrade'),
	loading: LoadingComponent,
});

export const Verification = Loadable({
	loader: () => import('./Verification'),
	loading: LoadingComponent,
});

export const Chat = Loadable({
	loader: () => import('./Chat'),
	loading: LoadingComponent,
});

export const Summary = Loadable({
	loader: () => import('./Summary'),
	loading: LoadingComponent,
});

export const AddTradeTabs = Loadable({
	loader: () => import('./TradeTabs'),
	loading: LoadingComponent,
});

export const ExpiredExchange = Loadable({
	loader: () => import('./ExpiredExchange'),
	loading: LoadingComponent,
});

export const TermsOfService = Loadable({
	loader: () => import('./TermsOfService'),
	loading: LoadingComponent,
});

export const DepositFunds = Loadable({
	loader: () => import('./TermsOfService/DepositFunds'),
	loading: LoadingComponent,
});

export const Stake = Loadable({
	loader: () => import('./Stake'),
	loading: LoadingComponent,
});

export const StakeDetails = Loadable({
	loader: () => import('./StakeDetails'),
	loading: LoadingComponent,
});

export const Apps = Loadable({
	loader: () => import('./Apps'),
	loading: LoadingComponent,
});

export const AppDetails = Loadable({
	loader: () => import('./AppDetails'),
	loading: LoadingComponent,
});

export const DigitalAssets = Loadable({
	loader: () => import('./DigitalAssets'),
	loading: LoadingComponent,
});

export const CoinPage = Loadable({
	loader: () => import('./CoinPage'),
	loading: LoadingComponent,
});

export const WhiteLabel = Loadable({
	loader: () => import('./WhiteLabel'),
	loading: LoadingComponent,
});

export const FeesAndLimits = Loadable({
	loader: () => import('./FeesAndLimits'),
	loading: LoadingComponent,
});

export const ReferralList = Loadable({
	loader: () => import('./Summary/components/ReferralList'),
	loading: LoadingComponent,
});

export const P2P = Loadable({
	loader: () => import('./P2P'),
	loading: LoadingComponent,
});

export const Volume = Loadable({
	loader: () => import('./Volume'),
	loading: LoadingComponent,
});

export const AddressBook = Loadable({
	loader: () => import('./Wallet/AddressBook'),
	loading: LoadingComponent,
});

export const AdminDashboard = Loadable({
	loader: () => import('./Admin/Dashboard'),
	loading: LoadingComponent,
});

export const User = Loadable({
	loader: () => import('./Admin/User'),
	loading: LoadingComponent,
});

export const AdminStake = Loadable({
	loader: () => import('./Admin/Stakes'),
	loading: LoadingComponent,
});

export const Session = Loadable({
	loader: () => import('./Admin/Sessions'),
	loading: LoadingComponent,
});

export const Audits = Loadable({
	loader: () => import('./Admin/Audits'),
	loading: LoadingComponent,
});

export const AppWrapper = Loadable({
	loader: () => import('./Admin/AppWrapper'),
	loading: LoadingComponent,
});

export const Main = Loadable({
	loader: () => import('./Admin/Main'),
	loading: LoadingComponent,
});

export const DepositsPage = Loadable({
	loader: () => import('./Admin/DepositsPage'),
	loading: LoadingComponent,
});

export const Limits = Loadable({
	loader: () => import('./Admin/Limits'),
	loading: LoadingComponent,
});

export const BlockchainTransaction = Loadable({
	loader: () => import('./Admin/BlockchainTransaction'),
	loading: LoadingComponent,
});

export const Fees = Loadable({
	loader: () => import('./Admin/Fees'),
	loading: LoadingComponent,
});

export const AdminChat = Loadable({
	loader: () => import('./Admin/Chat'),
	loading: LoadingComponent,
});

export const Wallets = Loadable({
	loader: () => import('./Admin/Wallets'),
	loading: LoadingComponent,
});

export const UserFees = Loadable({
	loader: () => import('./Admin/UserFees'),
	loading: LoadingComponent,
});

export const AdminOrders = Loadable({
	loader: () => import('./Admin/ActiveOrders'),
	loading: LoadingComponent,
});

export const Broker = Loadable({
	loader: () => import('./Admin/Broker'),
	loading: LoadingComponent,
});

export const Plugins = Loadable({
	loader: () => import('./Admin/Plugins'),
	loading: LoadingComponent,
});

export const PluginStore = Loadable({
	loader: () => import('./Admin/Plugins/PluginStore'),
	loading: LoadingComponent,
});

export const Settings = Loadable({
	loader: () => import('./Admin/Settings'),
	loading: LoadingComponent,
});

export const MobileHome = Loadable({
	loader: () => import('./MobileHome'),
	loading: LoadingComponent,
});

export const Transfer = Loadable({
	loader: () => import('./Admin/Transfers'),
	loading: LoadingComponent,
});

export const AdminFees = Loadable({
	loader: () => import('./Admin/AdminFees'),
	loading: LoadingComponent,
});

export const ThemeProvider = Loadable({
	loader: () => import('./ThemeProvider'),
	loading: LoadingComponent,
});

export const Init = Loadable({
	loader: () => import('./Init'),
	loading: LoadingComponent,
});

export const AdminLogin = Loadable({
	loader: () => import('./Init/Login'),
	loading: LoadingComponent,
});

export const AdminFinancials = Loadable({
	loader: () => import('./Admin/AdminFinancials'),
	loading: LoadingComponent,
});

export const MoveToDash = Loadable({
	loader: () => import('./Admin/MoveToDash'),
	loading: LoadingComponent,
});

export const General = Loadable({
	loader: () => import('./Admin/General'),
	loading: LoadingComponent,
});

export const Tiers = Loadable({
	loader: () => import('./Admin/Tiers'),
	loading: LoadingComponent,
});

export const Roles = Loadable({
	loader: () => import('./Admin/Roles'),
	loading: LoadingComponent,
});

export const Resources = Loadable({
	loader: () => import('./Admin/Resources'),
	loading: LoadingComponent,
});

export const Pairs = Loadable({
	loader: () => import('./Admin/Trades'),
	loading: LoadingComponent,
});

export const Fiatmarkets = Loadable({
	loader: () => import('./Admin/Fiat'),
	loading: LoadingComponent,
});

export const AdminApps = Loadable({
	loader: () => import('./Admin/Apps'),
	loading: LoadingComponent,
});
