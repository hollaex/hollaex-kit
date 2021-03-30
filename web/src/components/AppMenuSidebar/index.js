import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import STRINGS from '../../config/localizedStrings';
import Image from 'components/Image';
import EditWrapper from 'components/EditWrapper';
import withConfig from 'components/ConfigProvider/withConfig';

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
		const { icons: ICONS } = this.props;
		return (
			<div className="d-flex justify-content-between app-side-bar">
				<div className="app-menu-bar-side">
					<div
						className={classnames(
							'd-flex align-items-center app-menu-bar-side_list',
							{
								list_active:
									activePath === '/summary' || activePath === '/account',
							}
						)}
						onClick={() => this.handleMenuChange('/summary')}
					>
						<Image
							icon={ICONS['TAB_SUMMARY']}
							wrapperClassName="app-menu-bar-icon"
						/>
						<div className="side-bar-txt">
							<EditWrapper stringId="ACCOUNTS.TAB_SUMMARY" iconId="TAB_SUMMARY">
								{STRINGS['ACCOUNTS.TAB_SUMMARY']}
							</EditWrapper>
						</div>
					</div>
					<div
						className={classnames(
							'd-flex align-items-center app-menu-bar-side_list',
							{ list_active: activePath === '/wallet' }
						)}
						onClick={() => this.handleMenuChange('/wallet')}
					>
						<Image
							icon={ICONS['TAB_WALLET']}
							wrapperClassName="app-menu-bar-icon"
						/>
						<div className="side-bar-txt">
							<EditWrapper stringId="ACCOUNTS.TAB_WALLET" iconId="TAB_WALLET">
								{STRINGS['ACCOUNTS.TAB_WALLET']}
							</EditWrapper>
						</div>
					</div>
					<div
						className={classnames(
							'd-flex align-items-center app-menu-bar-side_list',
							{ list_active: activePath === '/transactions' }
						)}
						onClick={() => this.handleMenuChange('/transactions')}
					>
						<Image
							icon={ICONS['TAB_HISTORY']}
							wrapperClassName="app-menu-bar-icon"
						/>
						<div className="side-bar-txt">
							<EditWrapper stringId="ACCOUNTS.TAB_HISTORY" iconId="TAB_HISTORY">
								{STRINGS['ACCOUNTS.TAB_HISTORY']}
							</EditWrapper>
						</div>
					</div>
					<div
						className={classnames(
							'd-flex align-items-center app-menu-bar-side_list',
							{ list_active: activePath === '/security' }
						)}
						onClick={() => this.handleMenuChange('/security')}
					>
						<Image
							icon={ICONS['TAB_SECURITY']}
							wrapperClassName="app-menu-bar-icon"
						/>
						<div className="side-bar-txt">
							<EditWrapper
								stringId="ACCOUNTS.TAB_SECURITY"
								iconId="TAB_SECURITY"
							>
								{STRINGS['ACCOUNTS.TAB_SECURITY']}
							</EditWrapper>
						</div>
					</div>
					<div
						className={classnames(
							'd-flex align-items-center app-menu-bar-side_list',
							{ list_active: activePath === '/verification' }
						)}
						onClick={() => this.handleMenuChange('/verification')}
					>
						<Image
							icon={ICONS['TAB_VERIFY']}
							wrapperClassName="app-menu-bar-icon"
							useSvg={true}
						/>
						<div className="side-bar-txt">
							<EditWrapper
								stringId="ACCOUNTS.TAB_VERIFICATION"
								iconId="TAB_VERIFY"
							>
								{STRINGS['ACCOUNTS.TAB_VERIFICATION']}
							</EditWrapper>
						</div>
					</div>
					<div
						className={classnames(
							'd-flex align-items-center app-menu-bar-side_list',
							{ list_active: activePath === '/settings' }
						)}
						onClick={() => this.handleMenuChange('/settings')}
					>
						<Image
							icon={ICONS['TAB_SETTING']}
							wrapperClassName="app-menu-bar-icon"
						/>
						<div className="side-bar-txt">
							<EditWrapper
								stringId="ACCOUNTS.TAB_SETTINGS"
								iconId="TAB_SETTING"
							>
								{STRINGS['ACCOUNTS.TAB_SETTINGS']}
							</EditWrapper>
						</div>
					</div>
					<div
						className={classnames(
							'd-flex align-items-center app-menu-bar-side_list',
							{ list_active: activePath === 'help' }
						)}
						onClick={() => this.handleMenuChange('help')}
					>
						<Image
							icon={ICONS['SIDEBAR_HELP']}
							wrapperClassName="app-menu-bar-icon"
						/>
						<div className="side-bar-txt">
							<EditWrapper stringId="LOGIN.HELP" iconId="SIDEBAR_HELP">
								{STRINGS['LOGIN.HELP']}
							</EditWrapper>
						</div>
					</div>
					<div
						className={classnames(
							'd-flex align-items-center app-menu-bar-side_list',
							{ list_active: activePath === 'logout' }
						)}
						onClick={() => this.handleMenuChange('logout')}
					>
						<Image
							icon={ICONS['TAB_SIGNOUT']}
							wrapperClassName="app-menu-bar-icon"
						/>
						<div className="side-bar-txt">
							<EditWrapper stringId="ACCOUNTS.TAB_SIGNOUT" iconId="TAB_SIGNOUT">
								{STRINGS['ACCOUNTS.TAB_SIGNOUT']}
							</EditWrapper>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

// export default AppMenuSidebar;
export default connect(null)(withConfig(AppMenuSidebar));
