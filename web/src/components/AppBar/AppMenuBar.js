import React, { Component } from 'react';
import { connect } from 'react-redux';

import withConfig from 'components/ConfigProvider/withConfig';
import { MENU_ITEMS } from 'config/menu';
import AppMenuBarItem from './AppMenuBarItem';

class AppMenuBar extends Component {
	render() {
		const { menuItems, activePath, onMenuChange } = this.props;

		return (
			<div className="app-menu-bar-wrapper d-flex justify-content-start">
				<div className="app-menu-bar d-flex align-items-start justify-content-start title-font apply_rtl">
					{menuItems.map(
						({ path, string_id, activePaths, hide_from_appbar }, index) => {
							return (
								!hide_from_appbar && (
									<AppMenuBarItem
										key={`appbar_item_${index}`}
										path={path}
										stringId={string_id}
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

const mapStateToProps = ({
	user,
	app: { pair, pairs, constants = {}, language: activeLanguage },
}) => {
	const { features = {} } = constants;
	const featureItems = MENU_ITEMS.features.map(({ id, ...rest }) => {
		const item = {
			...rest,
			hide_from_appbar: !features[id],
		};
		return item;
	});

	const menuItems = [...MENU_ITEMS.top, ...featureItems, ...MENU_ITEMS.middle];

	return {
		menuItems,
		user,
		pair,
		pairs,
		constants,
		activeLanguage,
	};
};

export default connect(mapStateToProps)(withConfig(AppMenuBar));
