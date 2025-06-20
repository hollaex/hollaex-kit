import React, { Component } from 'react';
import Image from 'components/Image';
import classnames from 'classnames';

import withConfig from 'components/ConfigProvider/withConfig';
import MenuListItem from './MenuListItem';

class MenuList extends Component {
	state = {
		isOpen: false,
		startTransition: false,
	};

	element = null;

	componentDidMount() {
		document.addEventListener('click', this.onOutsideClick);
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
			this.setState({ isOpen: !this.state.isOpen }, () => {
				if (this.state.isOpen) {
					this.transition = setTimeout(() => {
						this.setState({
							startTransition: true,
						});
					}, 50);
				} else {
					this.setState({
						startTransition: false,
					});
				}
			});
		}
	};

	componentWillUnmount() {
		this.transition && clearTimeout(this.transition);
		document.removeEventListener('click', this.onOutsideClick);
	}

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
			case '/wallet':
			default:
				return !!notifications;
		}
	};

	render() {
		const {
			securityPending,
			verificationPending,
			icons: ICONS,
			user,
			menuItems,
			activePath,
			onMenuChange,
		} = this.props;
		const { isOpen, startTransition } = this.state;
		const totalPending = securityPending + verificationPending;
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
					<div
						id="tab-account-menu"
						className={`${
							startTransition ? 'opacity-1 ' : ' '
						} app-bar-account-menu apply_rtl`}
					>
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
											onClick={() =>
												onMenuChange(path, () =>
													this.setState({ isOpen: false })
												)
											}
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

export default withConfig(MenuList);
