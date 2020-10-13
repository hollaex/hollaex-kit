import React, { Component } from 'react';
import Image from 'components/Image';
import classnames from 'classnames';

import STRINGS from '../../config/localizedStrings';
import { IS_XHT } from '../../config/constants';
import withConfig from 'components/ConfigProvider/withConfig';
import { EditWrapper } from 'components';

class MenuList extends Component {
	state = {
		isOpen: false
	};

	element = null;

	componentDidMount() {
		document.addEventListener('click', this.onOutsideClick);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.isOpen !== this.state.isOpen) {
			return true;
		}
		if (
			nextProps.selectedMenu !== this.props.selectedMenu ||
			nextProps.securityPending !== this.props.securityPending ||
			nextProps.verificationPending !== this.props.verificationPending ||
			nextProps.walletPending !== this.props.walletPending ||
			nextProps.activePath !== this.props.activePath
		) {
			return true;
		}
		return false;
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

	handleMenu = (path) => {
		this.setState({ isOpen: false });
		this.props.handleMenu(path);
	};

	onHelp = () => {
		this.setState({ isOpen: false });
		this.props.onHelp();
	};

	logout = () => {
		this.setState({ isOpen: false });
		this.props.logout();
	};

	render() {
		const {
			selectedMenu,
			securityPending,
			verificationPending,
			walletPending,
			activePath,
			icons: ICONS,
		} = this.props;
		const { isOpen } = this.state;
		const totalPending = IS_XHT
			? securityPending + walletPending
			: securityPending + verificationPending;
		return (
			<div
				className={classnames('app-bar-account-content', {
					'account-inactive':
						activePath !== 'account' && activePath !== 'wallet'
				})}
				ref={(el) => (this.element = el)}
			>
				<Image
					iconId="SIDEBAR_ACCOUNT_INACTIVE"
					icon={ICONS["SIDEBAR_ACCOUNT_INACTIVE"]}
					wrapperClassName="app-bar-account-icon"
				/>
				{!!totalPending && (
					<div className="app-bar-account-notification">{totalPending}</div>
				)}
				{isOpen && (
					<div id="tab-account-menu" className="app-bar-account-menu apply_rtl">
						<div
							className={classnames('app-bar-account-menu-list d-flex', {
								'menu-active':
									activePath === 'account' && selectedMenu === 'summary'
							})}
							onClick={() => this.handleMenu('summary')}
						>
							<div className="notification-content" />
							<Image
								iconId="TAB_SUMMARY"
								icon={ICONS["TAB_SUMMARY"]}
								wrapperClassName="app-bar-account-list-icon"
							/>
							<EditWrapper stringId="ACCOUNTS.TAB_SUMMARY">
                {STRINGS["ACCOUNTS.TAB_SUMMARY"]}
							</EditWrapper>
						</div>
						<div
							className={classnames(
								'app-bar-account-menu-list d-flex',
								!!walletPending && IS_XHT
									? {
											'menu-notification-active':
												activePath === 'wallet' && selectedMenu === 'wallet',
											wallet_notification: selectedMenu !== 'wallet'
									  }
									: {
											'menu-active':
												activePath === 'wallet' && selectedMenu === 'wallet'
									  }
							)}
							onClick={() => this.handleMenu('wallet')}
						>
							<div className="notification-content">
								{!!walletPending && IS_XHT && (
									<div
										className={
											selectedMenu === 'wallet'
												? 'app-bar-account-list-notification wallet_selected'
												: 'app-bar-account-list-notification wallet_selected_inactive'
										}
									>
										{walletPending}
									</div>
								)}
							</div>
							<Image
								iconId="TAB_WALLET"
								icon={ICONS["TAB_WALLET"]}
								wrapperClassName="app-bar-account-list-icon"
							/>
							<EditWrapper stringId="ACCOUNTS.TAB_WALLET">
                {STRINGS["ACCOUNTS.TAB_WALLET"]}
							</EditWrapper>
						</div>
						<div
							className={classnames('app-bar-account-menu-list d-flex', {
								'menu-active':
									selectedMenu === 'history'
							})}
							onClick={() => this.handleMenu('history')}
						>
							<div className="notification-content" />
							<Image
								iconId="TAB_HISTORY"
								icon={ICONS["TAB_HISTORY"]}
								wrapperClassName="app-bar-account-list-icon"
							/>
							<EditWrapper stringId="ACCOUNTS.TAB_HISTORY">
                {STRINGS["ACCOUNTS.TAB_HISTORY"]}
							</EditWrapper>
						</div>
						<div
							className={classnames(
								'app-bar-account-menu-list d-flex',
								!!securityPending
									? {
											'menu-notification-active':
												activePath === 'account' && selectedMenu === 'security',
											security_notification: selectedMenu !== 'security'
									  }
									: {
											'menu-active':
												activePath === 'account' && selectedMenu === 'security'
									  }
							)}
							onClick={() => this.handleMenu('security')}
						>
							<div className="notification-content">
								{!!securityPending && (
									<div
										className={
											selectedMenu === 'security'
												? 'app-bar-account-list-notification security_selected'
												: 'app-bar-account-list-notification security_selected_inactive'
										}
									>
										{securityPending}
									</div>
								)}
							</div>
							<Image
								iconId="TAB_SECURITY"
								icon={ICONS["TAB_SECURITY"]}
								wrapperClassName="app-bar-account-list-icon"
							/>
							<EditWrapper stringId="ACCOUNTS.TAB_SECURITY">
                {STRINGS["ACCOUNTS.TAB_SECURITY"]}
							</EditWrapper>
						</div>
						<div
							className={classnames(
								'app-bar-account-menu-list d-flex',
								!!verificationPending && !IS_XHT
									? {
											'menu-notification-active':
												activePath === 'account' &&
												selectedMenu === 'verification',
											verification_notification: selectedMenu !== 'verification'
									  }
									: {
											'menu-active':
												activePath === 'account' &&
												selectedMenu === 'verification'
									  }
							)}
							onClick={() => this.handleMenu('verification')}
						>
							<div className="notification-content">
								{!!verificationPending && !IS_XHT && (
									<div
										className={
											selectedMenu === 'verification'
												? 'app-bar-account-list-notification verification_selected'
												: 'app-bar-account-list-notification verification_selected_inactive'
										}
									>
										{verificationPending}
									</div>
								)}
							</div>
							<Image
								iconId="TAB_VERIFY"
								icon={ICONS["TAB_VERIFY"]}
								wrapperClassName="app-bar-account-list-icon"
							/>
							<EditWrapper stringId="ACCOUNTS.TAB_VERIFICATION">
                {STRINGS["ACCOUNTS.TAB_VERIFICATION"]}
							</EditWrapper>
						</div>
						<div
							className={classnames('app-bar-account-menu-list d-flex', {
								'menu-active':
									activePath === 'account' && selectedMenu === 'settings'
							})}
							onClick={() => this.handleMenu('settings')}
						>
							<div className="notification-content" />
							<Image
								iconId="TAB_SETTING"
								icon={ICONS["TAB_SETTING"]}
								wrapperClassName="app-bar-account-list-icon"
							/>
							<EditWrapper stringId="ACCOUNTS.TAB_SETTINGS">
                {STRINGS["ACCOUNTS.TAB_SETTINGS"]}
							</EditWrapper>
						</div>
						<div
							className={classnames('app-bar-account-menu-list d-flex', {
								'menu-active':
									activePath === 'account' && selectedMenu === 'help'
							})}
							onClick={this.onHelp}
						>
							<div className="notification-content" />
							<Image
								iconId="SIDEBAR_HELP"
								icon={ICONS["SIDEBAR_HELP"]}
								wrapperClassName="app-bar-account-list-icon"
							/>
							<EditWrapper stringId="LOGIN.HELP">
                {STRINGS["LOGIN.HELP"]}
							</EditWrapper>
						</div>

						<div
							className="app-bar-account-menu-list d-flex"
							onClick={this.logout}
						>
							<div className="notification-content" />
							<Image
								icon={ICONS["TAB_SIGNOUT"]}
								wrapperClassName="app-bar-account-list-icon"
							/>
							{STRINGS["ACCOUNTS.TAB_SIGNOUT"]}
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default withConfig(MenuList);
