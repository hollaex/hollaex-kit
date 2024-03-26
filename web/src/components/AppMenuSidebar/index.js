import React, { Component } from 'react';

import withConfig from 'components/ConfigProvider/withConfig';
import SidebarItem from './SidebarItem';

class AppMenuSidebar extends Component {
	render() {
		const { icons: ICONS, menuItems, activePath, onMenuChange } = this.props;
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
