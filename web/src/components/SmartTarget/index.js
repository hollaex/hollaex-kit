import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { RemoteComponent } from 'RemoteComponent';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { getToken } from 'utils/token';
import { PLUGIN_URL } from 'config/constants';
import { withRouter } from 'react-router';
import { generateGlobalId } from 'utils/id';
import withEdit from 'components/EditProvider/withEdit';
import renderFields from 'components/Form/factoryFields';
import { getErrorLocalized } from 'utils/errors';
import { IconTitle, ErrorBoundary } from 'components';

const DefaultChildren = ({ strings: STRINGS, icons: ICONS }) => {
	return (
		<div
			style={{
				height: '28rem',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<IconTitle
				stringId="PAGE_UNDER_CONSTRUCTION"
				text={STRINGS['PAGE_UNDER_CONSTRUCTION']}
				iconId="FIAT_UNDER_CONSTRUCTION"
				iconPath={ICONS['FIAT_UNDER_CONSTRUCTION']}
				className="flex-direction-column"
			/>
		</div>
	);
};

const SmartTarget = (props) => {
	const {
		targets,
		id,
		children,
		webViews,
		showLoader = true,
		loaderClassName = 'default-remote-component-loader',
		errorClassName = 'default-remote-component-error',
		icons: ICONS,
	} = props;

	return targets.includes(id) ? (
		<ErrorBoundary>
			{webViews[id].map(({ src, name }, index) => (
				<RemoteComponent
					key={`${name}_${index}`}
					url={src}
					showLoader={showLoader}
					loaderClassName={loaderClassName}
					errorClassName={errorClassName}
					generateId={generateGlobalId(name)}
					strings={STRINGS}
					plugin_url={PLUGIN_URL}
					token={getToken()}
					renderFields={renderFields}
					getErrorLocalized={getErrorLocalized}
					{...props}
				/>
			))}
		</ErrorBoundary>
	) : children ? (
		<Fragment>{children}</Fragment>
	) : (
		<DefaultChildren strings={STRINGS} icons={ICONS} />
	);
};

const mapStateToProps = (store) => ({
	targets: store.app.targets,
	webViews: store.app.webViews,
	isReady: store.app.isReady,
	coins: store.app.coins,
	symbol: store.orderbook.symbol,
	prices: store.orderbook.prices,
	balance: store.user.balance,
	totalAsset: store.asset.totalAsset,
	oraclePrices: store.asset.oraclePrices,
	chartData: store.asset.chartData,
	activeNotification: store.app.activeNotification,
	activeLanguage: store.app.language,
	activeTheme: store.app.theme,
	user: store.user,
	pair: store.app.pair,
	unreadMessages: store.app.chatUnreadMessages,
	constants: store.app.constants,
	info: store.app.info,
	enabledPlugins: store.app.enabledPlugins,
	plugins: store.app.plugins,
	features: store.app.features,
	config_level: store.app.config_level,
	pairsTradesFetched: store.orderbook.pairsTradesFetched,
});

export default connect(mapStateToProps)(
	withEdit(withConfig(withRouter(SmartTarget)))
);
