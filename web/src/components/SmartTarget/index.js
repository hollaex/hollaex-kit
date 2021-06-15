import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { RemoteComponent } from 'RemoteComponent';
import { injectPlugin } from 'utils/plugin';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

class SmartTarget extends Component {
	componentDidMount() {
		const { webViews, targets, id } = this.props;
		if (targets.includes(id)) {
			const components = [];
			webViews[id].forEach(
				({ src, props: propertiesData, all_props = false }) => {
					let props = {};
					if (all_props) {
						props = { ...this.props };
					} else {
						propertiesData.forEach(({ key, store_key }) => {
							props[key] = this.props[store_key];
						});
					}

					const CustomComponent = (props) => (
						<RemoteComponent url={src} {...props} />
					);

					components.push(<CustomComponent strings={STRINGS} {...props} />);
				}
			);

			injectPlugin(components, id);
		}
	}

	componentDidUpdate(prevProps) {
		const { webViews, targets, id } = this.props;

		if (!prevProps.targets.includes(id) && targets.includes(id)) {
			const components = [];
			webViews[id].forEach(
				({ src, props: propertiesData, all_props = false }) => {
					let props = {};
					if (all_props) {
						props = { ...this.props };
					} else {
						propertiesData.forEach(({ key, store_key }) => {
							props[key] = this.props[store_key];
						});
					}

					const CustomComponent = (props) => (
						<RemoteComponent url={src} {...props} />
					);

					components.push(<CustomComponent strings={STRINGS} {...props} />);
				}
			);

			injectPlugin(components, id);
		}
	}

	render() {
		const { targets, id, children } = this.props;

		return targets.includes(id) ? (
			<div id={id} />
		) : (
			<Fragment>{children}</Fragment>
		);
	}
}

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

export default connect(mapStateToProps)(withConfig(SmartTarget));
