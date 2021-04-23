import React, { Component } from 'react';
import { connect } from 'react-redux';

import withConfig from 'components/ConfigProvider/withConfig';
import SidebarItem from './SidebarItem';
import { MENU_ITEMS } from 'config/menu';

class AppMenuSidebar extends Component {
	constructor() {
		super();
		this.state = {
			activePath: '',
		};
	}

	componentDidMount() {
		this.setActivePath();
	}

	componentDidUpdate(prevProps) {
		if (
			JSON.stringify(prevProps.location) !== JSON.stringify(this.props.location)
		) {
			this.setActivePath();
		}
	}

	setActivePath = () => {
		const { location: { pathname = '' } = {} } = this.props;

		let activePath;
		if (pathname.includes('quick-trade')) {
			activePath = 'quick-trade';
		} else {
			activePath = pathname;
		}
		this.setState({ activePath });
	};

	handleMenuChange = (path = '') => {
		const { router, pairs } = this.props;

		let pair = '';
		if (Object.keys(pairs).length) {
			pair = Object.keys(pairs)[0];
		} else {
			pair = this.props.pair;
		}

		switch (path) {
			case 'logout':
				this.props.logout();
				break;
			case 'help':
				this.props.onHelp();
				break;
			case 'quick-trade':
				router.push(`/quick-trade/${pair}`);
				break;
			default:
				router.push(path);
		}

		this.setState({ isOpen: false, activePath: path });
	};

	render() {
		const { activePath } = this.state;
		const { icons: ICONS, menuItems } = this.props;
		return (
			<div className="d-flex justify-content-between app-side-bar">
				<div className="app-menu-bar-side">
					{menuItems.map(
						(
							{ path, icon_id, string_id, hide_from_sidebar, activePaths },
							index
						) => {
							return (
								!hide_from_sidebar && (
									<SidebarItem
										key={`sidebar_item_${index}`}
										path={path}
										stringId={string_id}
										iconId={icon_id}
										icon={ICONS[icon_id]}
										isActive={
											activePaths
												? activePaths.includes(activePath)
												: path === activePath
										}
										onClick={() => this.handleMenuChange(path)}
									/>
								)
							);
						}
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ app: { remoteRoutes = [], pairs = {}, pair } }) => {
	const menuItems = [
		...MENU_ITEMS.top,
		...MENU_ITEMS.middle,
		...remoteRoutes,
		...MENU_ITEMS.bottom,
	];
	return {
		menuItems,
		pairs,
		pair,
	};
};

export default connect(mapStateToProps)(withConfig(AppMenuSidebar));
