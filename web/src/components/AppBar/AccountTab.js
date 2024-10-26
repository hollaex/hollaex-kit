import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { Tooltip } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

import ICONS from 'config/icons/dark';
import STRINGS from 'config/localizedStrings';
import Dialog from 'components/Dialog';
import HelpfulResourcesForm from 'containers/HelpfulResourcesForm';
import withConfig from 'components/ConfigProvider/withConfig';
import { Image, EditWrapper } from 'components';
import { isLoggedIn, removeToken } from 'utils/token';
import { setSecurityTab, setSettingsTab } from 'actions/appActions';

const AccountTab = ({
	config_level,
	verification_level,
	user,
	icons: Icons,
	securityPending,
	verificationPending,
	setSecurityTab,
	setSettingsTab,
}) => {
	const [isIconActive, setIsIconActive] = useState(false);
	const [isToolTipVisible, setIsToolTipVisible] = useState(false);

	const totalPending = securityPending + verificationPending;

	const onHandleRedirect = (path = '/') => {
		setIsToolTipVisible(false);
		setIsIconActive(false);
		browserHistory.push(path);
	};

	return (
		<Tooltip
			visible={isToolTipVisible}
			title={
				<AccountList
					config_level={config_level}
					verification_level={verification_level}
					user={user}
					Icons={Icons}
					securityPending={securityPending}
					verificationPending={verificationPending}
					setIsToolTipVisible={setIsToolTipVisible}
					setIsIconActive={setIsIconActive}
					setSecurityTab={setSecurityTab}
					setSettingsTab={setSettingsTab}
					onHandleRedirect={onHandleRedirect}
				/>
			}
			placement="bottomRight"
			overlayClassName="navigation-bar-wrapper account-tab-dropdown"
			onVisibleChange={() => {
				setIsIconActive(!isIconActive);
				setIsToolTipVisible(!isToolTipVisible);
			}}
		>
			<div
				className={
					isToolTipVisible
						? 'd-flex app-bar-account-content active-text'
						: 'd-flex app-bar-account-content'
				}
				onClick={() => onHandleRedirect('/summary')}
			>
				<div className="mr-4">
					<Image
						iconId="SIDEBAR_ACCOUNT_INACTIVE"
						icon={ICONS['SIDEBAR_ACCOUNT_INACTIVE']}
						wrapperClassName="app-bar-account-icon"
					/>
					{!!totalPending && (
						<div className="app-bar-account-notification">{totalPending}</div>
					)}
				</div>
				<EditWrapper stringId="ACCOUNT_TEXT">
					{STRINGS['ACCOUNT_TEXT']}
				</EditWrapper>
				<span className="ml-1 app-bar-dropdown-icon">
					{!isIconActive ? <DownOutlined /> : <UpOutlined />}
				</span>
			</div>
		</Tooltip>
	);
};

const AccountList = ({
	config_level,
	verification_level,
	user,
	Icons,
	securityPending,
	verificationPending,
	setIsIconActive,
	setIsToolTipVisible,
	setSecurityTab,
	setSettingsTab,
	onHandleRedirect,
}) => {
	const [isHelpResources, setIsHelpResources] = useState(false);
	const [currPath, setCurrpath] = useState('/summary');

	useEffect(() => {
		const getCurrPage = window.location.pathname;
		setCurrpath(getCurrPage);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [window.location.pathname]);

	const accountOptions = [
		{
			icon: 'OPTION_2FA_ICON',
			title: 'ACCOUNTS.TAB_SECURITY',
			description: 'DESKTOP_NAVIGATION.SECURITY_DESC',
			path: '/security',
			isDisplay: true,
		},
		{
			icon: 'IDENTITY_OPTION_ICON',
			title: 'ACCOUNTS.TAB_VERIFICATION',
			description: 'DESKTOP_NAVIGATION.VERIFICATION_DESC',
			path: '/verification',
			isDisplay: true,
		},
		{
			icon: 'PASSWORD_OPTION_ICON',
			title: 'ACCOUNTS.TAB_SETTINGS',
			description: 'DESKTOP_NAVIGATION.SETTINGS_DESC',
			path: '/settings',
			isDisplay: true,
		},
	];

	const optionsRoute = [
		{
			icon: 'REVOKE_SESSION',
			title: 'ACCOUNTS.TAB_SIGNOUT',
			toolTipText: 'DESKTOP_NAVIGATION.SIGNOUT_DESC',
			path: '/login',
		},
		{
			icon: 'API_OPTION_ICON',
			title: 'MORE_OPTIONS_LABEL.ICONS.API',
			toolTipText: 'DESKTOP_NAVIGATION.API_DESC',
			path: '/security?apiKeys',
		},
		{
			icon: 'LANGUAGE_OPTION_ICON',
			title: 'USER_SETTINGS.TITLE_LANGUAGE',
			toolTipText: 'DESKTOP_NAVIGATION.LANGUAGE_DESC',
			path: '/settings?language',
		},
		{
			icon: 'HELP_OPTION_ICON',
			title: 'LOGIN.HELP',
			toolTipText: 'DESKTOP_NAVIGATION.HELP_DESC',
			path: browserHistory?.getCurrentLocation(),
		},
		{
			icon: 'HISTORY_OPTION_ICON',
			title: 'ACCOUNTS.TAB_HISTORY',
			toolTipText: 'DESKTOP_NAVIGATION.TRANSACTION_DESC',
			path: '/transactions',
		},
	];

	const renderHelpResource = () => {
		return (
			<Dialog
				isOpen={isHelpResources}
				onCloseDialog={() => setIsHelpResources(false)}
			>
				<HelpfulResourcesForm
					onSubmitSuccess={() => setIsHelpResources(false)}
					onClose={() => setIsHelpResources(false)}
				/>
			</Dialog>
		);
	};

	const onHandleRoutes = (value = '/', title = '') => {
		const selectedTab = {
			'LOGIN.HELP': () => setIsHelpResources(true),
			'ACCOUNTS.TAB_SIGNOUT': () => removeToken(),
			'ACCOUNTS.TAB_SECURITY': () => setSecurityTab(0),
			'MORE_OPTIONS_LABEL.ICONS.API': () => setSecurityTab(2),
			'USER_SETTINGS.TITLE_LANGUAGE': () => setSettingsTab(2),
			'ACCOUNTS.TAB_SETTINGS': () => setSettingsTab(0),
		};

		if (selectedTab[title]) {
			selectedTab[title]();
		}

		setIsToolTipVisible(false);
		setIsIconActive(false);

		return browserHistory?.push(value);
	};

	const userData =
		config_level[
			isLoggedIn() ? verification_level : Object.keys(config_level)[0]
		] || {};
	const userAccountTitle =
		userData.name ||
		STRINGS.formatString(
			STRINGS['SUMMARY.LEVEL_OF_ACCOUNT'],
			verification_level
		);
	const icon = Icons[`LEVEL_ACCOUNT_ICON_${verification_level}`]
		? Icons[`LEVEL_ACCOUNT_ICON_${verification_level}`]
		: Icons['LEVEL_ACCOUNT_ICON_4'];

	return (
		<div className="navigation-dropdown-container">
			{isHelpResources && renderHelpResource()}
			<div className="tier-wrapper">
				<Image
					iconId={
						Icons[`LEVEL_ACCOUNT_ICON_${verification_level}`]
							? `LEVEL_ACCOUNT_ICON_${verification_level}`
							: 'LEVEL_ACCOUNT_ICON_4'
					}
					icon={icon}
					wrapperClassName={'trader-wrapper-icon trader-acc-detail-icon'}
				/>
				<span
					className="blue-link text-decoration-underline"
					onClick={() => onHandleRedirect('/fees-and-limits')}
				>
					{userAccountTitle}
				</span>
				<span className="secondary-text">({user?.email})</span>
			</div>
			{accountOptions?.map((options) => {
				return (
					options?.isDisplay && (
						<div
							className={
								currPath === options?.path
									? 'options-container account-active main-active'
									: 'options-container account-active'
							}
							onClick={() => onHandleRoutes(options?.path, options?.title)}
						>
							<Image
								icon={ICONS[options?.icon ? options?.icon : 'NO_ICON']}
								wrapperClassName="options-icon"
							/>
							<div className="option-details">
								<div className="d-flex">
									<EditWrapper stringId={options?.title}>
										<span>{STRINGS[options?.title]}</span>
									</EditWrapper>
									{!!securityPending &&
										options?.title === 'ACCOUNTS.TAB_SECURITY' && (
											<div className="app-bar-account-notification ml-2">
												{securityPending}
											</div>
										)}
									{!!verificationPending &&
										options?.title === 'ACCOUNTS.TAB_VERIFICATION' && (
											<div className="app-bar-account-notification ml-2">
												{verificationPending}
											</div>
										)}
								</div>
								<EditWrapper stringId={options?.description}>
									<span className="secondary-text">
										{STRINGS[options?.description]}
									</span>
								</EditWrapper>
							</div>
						</div>
					)
				);
			})}
			<div className="options-route-wrapper">
				{optionsRoute?.map((option) => {
					return (
						<Tooltip
							title={STRINGS[option?.toolTipText]}
							placement="topLeft"
							overlayClassName="account-tab-options-tooltip"
						>
							<div
								className="icon-option-container"
								onClick={() => onHandleRoutes(option?.path, option?.title)}
							>
								<Image icon={ICONS[option?.icon ? option?.icon : 'NO_ICON']} />
								<span>
									<EditWrapper>{STRINGS[option?.title]}</EditWrapper>
								</span>
							</div>
						</Tooltip>
					);
				})}
			</div>
			<div
				className="summary-page-link"
				onClick={() => onHandleRedirect('/summary')}
			>
				<EditWrapper stringId="DESKTOP_NAVIGATION.SUMMARY_PAGE">
					<span className="blue-link text-decoration-underline">
						{STRINGS['DESKTOP_NAVIGATION.SUMMARY_PAGE']}
					</span>
				</EditWrapper>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	config_level: state.app.config_level,
	verification_level: state.user.verification_level,
});

const mapDispatchToProps = (dispatch) => ({
	setSecurityTab: bindActionCreators(setSecurityTab, dispatch),
	setSettingsTab: bindActionCreators(setSettingsTab, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(AccountTab));
