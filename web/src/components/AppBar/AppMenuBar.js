import React, { Component } from 'react';
import { connect } from 'react-redux';

import withConfig from 'components/ConfigProvider/withConfig';
import { MENU_ITEMS } from 'config/menu';
import AppMenuBarItem from './AppMenuBarItem';

class AppMenuBar extends Component {
	state = {
		activePath: '',
	};

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
		const { menuItems } = this.props;
		const { activePath } = this.state;

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
