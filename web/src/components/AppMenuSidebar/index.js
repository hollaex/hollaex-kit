import React, { Component } from 'react';

import withConfig from 'components/ConfigProvider/withConfig';
import SidebarItem from './SidebarItem';

class AppMenuSidebar extends Component {
	render() {
		const { icons: ICONS, menuItems, activePath, onMenuChange } = this.props;

		return (
			<div className="d-flex justify-content-between app-side-bar">
				<div className="app-menu-bar-side">
					{[
						...menuItems,
						{
							path: '/p2p',
							icon_id: 'P2P',
							string_id: 'ACCOUNTS.P2P',
							hide_from_appbar: true,
							hide_from_sidebar: false,
							hide_from_menulist: false,
							hide_from_bottom_nav: true,
						},
					].map(
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
										onClick={() => onMenuChange(path)}
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

export default withConfig(AppMenuSidebar);
