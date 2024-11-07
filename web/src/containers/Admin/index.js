import React from 'react';
import Loadable from 'react-loadable';
import { Loader } from 'components';

export { PATHS } from './paths';

const LoadingComponent = ({ isLoading, error }) => {
	return <Loader relative={true} background={false} />;
};

export const User = Loadable({
	loader: () => import('./User'),
	loading: LoadingComponent,
});

export const TradeHistory = Loadable({
	loader: () => import('./TradeHistory'),
	loading: LoadingComponent,
});

export const UserBalance = Loadable({
	loader: () => import('./UserBalance'),
	loading: LoadingComponent,
});

export const Logins = Loadable({
	loader: () => import('./Logins'),
	loading: LoadingComponent,
});

export const Audits = Loadable({
	loader: () => import('./Audits'),
	loading: LoadingComponent,
});

export const AppWrapper = Loadable({
	loader: () => import('./AppWrapper'),
	loading: LoadingComponent,
});

export const Main = Loadable({
	loader: () => import('./Main'),
	loading: LoadingComponent,
});

export const Balance = Loadable({
	loader: () => import('./Balance'),
	loading: LoadingComponent,
});

export const Verification = Loadable({
	loader: () => import('./Verification'),
	loading: LoadingComponent,
});

export const UploadIds = Loadable({
	loader: () => import('./UploadIds'),
	loading: LoadingComponent,
});

export const Otp = Loadable({
	loader: () => import('./Otp'),
	loading: LoadingComponent,
});

export const Activate = Loadable({
	loader: () => import('./Activate'),
	loading: LoadingComponent,
});

export const ListUsers = Loadable({
	loader: () => import('./ListUsers/ListUser'),
	loading: LoadingComponent,
});

export const FullListUsers = Loadable({
	loader: () => import('./ListUsers/FullList'),
	loading: LoadingComponent,
});

export const Stakes = Loadable({
	loader: () => import('./Stakes'),
	loading: LoadingComponent,
});

export const Sessions = Loadable({
	loader: () => import('./Sessions'),
	loading: LoadingComponent,
});

export const Deposits = Loadable({
	loader: () => import('./Deposits'),
	loading: LoadingComponent,
});

export const Limits = Loadable({
	loader: () => import('./Limits'),
	loading: LoadingComponent,
});

export const DepositsPage = Loadable({
	loader: () => import('./DepositsPage'),
	loading: LoadingComponent,
});

export const BlockchainTransaction = Loadable({
	loader: () => import('./BlockchainTransaction'),
	loading: LoadingComponent,
});

export const Fees = Loadable({
	loader: () => import('./Fees'),
	loading: LoadingComponent,
});

export const Chat = Loadable({
	loader: () => import('./Chat'),
	loading: LoadingComponent,
});

export const Wallets = Loadable({
	loader: () => import('./Wallets'),
	loading: LoadingComponent,
});

export const Transactions = Loadable({
	loader: () => import('./Transactions'),
	loading: LoadingComponent,
});

export const UserFees = Loadable({
	loader: () => import('./UserFees'),
	loading: LoadingComponent,
});

export const Trades = Loadable({
	loader: () => import('./Trades'),
	loading: LoadingComponent,
});

export const ActiveOrders = Loadable({
	loader: () => import('./ActiveOrders'),
	loading: LoadingComponent,
});

export const Broker = Loadable({
	loader: () => import('./Broker'),
	loading: LoadingComponent,
});

export const Plugins = Loadable({
	loader: () => import('./Plugins'),
	loading: LoadingComponent,
});

export const PluginServices = Loadable({
	loader: () => import('./Plugins/PluginServices'),
	loading: LoadingComponent,
});

export const Settings = Loadable({
	loader: () => import('./Settings'),
	loading: LoadingComponent,
});

export const Transfer = Loadable({
	loader: () => import('./Transfers'),
	loading: LoadingComponent,
});

export const Billing = Loadable({
	loader: () => import('./Billing'),
	loading: LoadingComponent,
});
