import React, { Component } from 'react';
import { connect } from 'react-redux';
import Image from 'components/Image';
import classnames from 'classnames';

import { IS_XHT } from 'config/constants';
import withConfig from 'components/ConfigProvider/withConfig';
import { MENU_ITEMS } from 'config/menu';
import MenuListItem from './MenuListItem';

class MenuList extends Component {
	state = {
		isOpen: false,
		activePath: '',
	};

	element = null;

	componentDidMount() {
		document.addEventListener('click', this.onOutsideClick);
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

	onOutsideClick = (event) => {
		if (
			this.element &&
			event.target !== this.element &&
			!this.element.contains(event.target)
		) {
			this.setState({ isOpen: false });
		}
		if (
			this.element &&
			event.target !== this.element &&
			this.element.contains(event.target)
		) {
			this.setState({ isOpen: !this.state.isOpen });
		}
	};

	componentWillUnmount() {
		document.removeEventListener('click', this.onOutsideClick);
	}

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

	getNotifications = (path = '') => {
		const { verificationPending, securityPending, walletPending } = this.props;
		switch (path) {
			case '/verification':
				return verificationPending;
			case '/security':
				return securityPending;
			case '/wallet':
				return walletPending;
			default:
				return 0;
		}
	};

	getShowNotification = (path = '', notifications) => {
		switch (path) {
			case '/verification':
				return !!notifications && !IS_XHT;
			case '/wallet':
				return !!notifications && IS_XHT;
			default:
				return !!notifications;
		}
	};

	render() {
		const {
			securityPending,
			verificationPending,
			walletPending,
			icons: ICONS,
			user,
			menuItems,
		} = this.props;
		const { isOpen, activePath } = this.state;
		const totalPending = IS_XHT
			? securityPending + walletPending
			: securityPending + verificationPending;
		return (
			<div
				className={classnames('d-flex app-bar-account-content', {
					'account-inactive':
						activePath !== '/account' && activePath !== '/wallet',
				})}
				ref={(el) => (this.element = el)}
			>
				<div className="mr-3">
					<Image
						iconId="SIDEBAR_ACCOUNT_INACTIVE"
						icon={ICONS['SIDEBAR_ACCOUNT_INACTIVE']}
						wrapperClassName="app-bar-account-icon"
					/>
					{!!totalPending && (
						<div className="app-bar-account-notification">{totalPending}</div>
					)}
				</div>
				<div>{user.email}</div>
				{isOpen && (
					<div id="tab-account-menu" className="app-bar-account-menu apply_rtl">
						{menuItems.map(
							(
								{ path, icon_id, string_id, hide_from_menulist, activePaths },
								index
							) => {
								const notifications = this.getNotifications(path);
								const showNotification = this.getShowNotification(
									path,
									notifications
								);
								return (
									!hide_from_menulist && (
										<MenuListItem
											key={`menulist_item_${index}`}
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
											notifications={notifications}
											showNotification={showNotification}
										/>
									)
								);
							}
						)}
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = ({
	app: { constants = {}, remoteRoutes = [], pairs = {}, pair },
}) => {
	const { features = {} } = constants;
	const featureItems = MENU_ITEMS.features.map(({ id, ...rest }) => {
		const item = {
			...rest,
			hide_from_menulist: !features[id],
		};
		return item;
	});
	const menuItems = [
		...MENU_ITEMS.top,
		...featureItems,
		...MENU_ITEMS.middle,
		...remoteRoutes,
		...MENU_ITEMS.bottom,
	];

	return {
		constants,
		menuItems,
		pairs,
		pair,
	};
};

export default connect(mapStateToProps)(withConfig(MenuList));
