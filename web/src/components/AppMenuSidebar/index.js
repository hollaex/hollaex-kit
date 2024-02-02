import React, { Component } from 'react';

import withConfig from 'components/ConfigProvider/withConfig';
import SidebarItem from './SidebarItem';
import { EditWrapper, Connector } from 'components';
import { Editor, Frame, Element } from 'craftjs';
import { useNode } from 'craftjs';
import { uniqueId } from 'lodash';
import { ConnectorSideMenu } from 'containers/App/App';
class AppMenuSidebar extends Component {
	render() {
		const { icons: ICONS, menuItems, activePath, onMenuChange } = this.props;
		return (
			<div className="app-menu-bar-side">
				{menuItems.map(
					(
						{ path, icon_id, string_id, hide_from_sidebar, activePaths },
						index
					) => {
						return (
							!hide_from_sidebar && (
								<Element id={uniqueId()} is={Connector} canvas>
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
								</Element>
							)
						);
					}
				)}
			</div>
		);
	}
}

export default withConfig(AppMenuSidebar);
