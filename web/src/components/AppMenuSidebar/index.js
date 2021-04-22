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
		const { location } = this.props;
		const activePath = location && location.pathname ? location.pathname : '';
		this.setState({ activePath });
	}

	componentDidUpdate(prevProps) {
		if (
			JSON.stringify(prevProps.location) !== JSON.stringify(this.props.location)
		) {
			const { location } = this.props;
			const activePath = location && location.pathname ? location.pathname : '';
			this.setState({ activePath });
		}
	}

	handleMenuChange = (path = '') => {
		if (path === 'logout') {
			this.props.logout();
		} else if (path === 'help') {
			this.props.onHelp();
		} else {
			this.props.router.push(path);
		}
		this.setState({ activePath: path });
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

const mapStateToProps = ({ app: { remoteRoutes = [] } }) => {
	const menuItems = [
		...MENU_ITEMS.top,
		...MENU_ITEMS.middle,
		...remoteRoutes,
		...MENU_ITEMS.bottom,
	];
	return {
		menuItems,
	};
};

export default connect(mapStateToProps)(withConfig(AppMenuSidebar));
