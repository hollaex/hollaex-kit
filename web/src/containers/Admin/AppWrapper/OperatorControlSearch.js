import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Collapse, Input, Tooltip } from 'antd';
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import debounce from 'lodash.debounce';

import withConfig from 'components/ConfigProvider/withConfig';
import { STATIC_ICONS } from 'config/icons';
import {
	setIsActiveAddNewUsers,
	setIsActiveCollectiveLimit,
	setIsActiveDeleteUser,
	setIsActiveFilterUser,
	setIsActiveFlagUser,
	setIsActiveFreezeUser,
	setIsActiveIndependentLimit,
	setIsActiveUserFeeDiscount,
	setIsActiveWithdrawalBlock,
	setIsDisabledUser2fa,
	setIsDisplayAddMarket,
	setIsDisplayAddPlugin,
	setIsDisplayConsoleBody,
	setIsDisplayConsoleHead,
	setIsDisplayCreateAsset,
	setIsDisplayCreateMarket,
	setIsDisplayCreateOrder,
	setIsDisplayCreateReferral,
	setIsDisplayCreateTrade,
	setIsEmailVerifiedUser,
	setIsGraphicsEditMode,
	setIsStringsEditMode,
	setIsThemesEditMode,
	setRecentSearches,
	setSelectedOrdersTab,
	setSelectedP2pTab,
} from 'actions/appActions';

const OperatorControlSearch = ({
	onHandleClose,
	router,
	constants: { features },
	user,
	search,
	setSearch,
	recentSearches = [],
	isDisplaySearchPopup = false,
	setRecentSearches = () => {},
	setIsActiveAddNewUsers = () => {},
	setIsActiveDeleteUser = () => {},
	setIsActiveFreezeUser = () => {},
	setIsActiveUserFeeDiscount = () => {},
	setIsEmailVerifiedUser = () => {},
	setIsDisabledUser2fa = () => {},
	setIsActiveFlagUser = () => {},
	setIsActiveWithdrawalBlock = () => {},
	setIsDisplayConsoleHead = () => {},
	setIsDisplayConsoleBody = () => {},
	setIsGraphicsEditMode = () => {},
	setIsThemesEditMode = () => {},
	setIsStringsEditMode = () => {},
	setIsDisplayCreateAsset = () => {},
	setIsDisplayCreateOrder = () => {},
	setIsDisplayCreateTrade = () => {},
	setIsActiveIndependentLimit = () => {},
	setIsActiveCollectiveLimit = () => {},
	setIsDisplayAddMarket = () => {},
	setIsDisplayCreateMarket = () => {},
	setSelectedOrdersTab = () => {},
	setSelectedP2pTab = () => {},
	setIsDisplayCreateReferral = () => {},
	setIsDisplayAddPlugin = () => {},
	setIsActiveFilterUser = () => {},
}) => {
	const MAX_RECENT = 6;
	let flashCount = 0;
	let flashMax = 0;
	let flashElement = null;

	const [selectedCategory, setSelectedCategory] = useState('all');
	const [openPanels, setOpenPanels] = useState({});
	const [openInnerPanels, setOpenInnerPanels] = useState({});

	const categories = [
		'All',
		'Common',
		'Trading',
		'Advanced',
		'High level',
		'Business',
		'Operations',
	];

	const generalContent = [
		{
			title: 'Branding',
			path: '/admin/general?branding',
			description:
				'Manage your exchange branding, including name, logo, favicon, and brand color.',
			searchContent: [
				'branding',
				'brand settings',
				'logo',
				'exchange name',
				'name',
				'favicon',
				'brand color',
				'appearance',
				'upload logo',
				'change name',
				'update branding',
				'color theme',
				'identity',
				'logo upload',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/customize-exchange/browser-tools/operator-controls-visuals#branding',
			subContent: [
				{
					subTitle: 'Exchange Name',
					path: '/admin/general?branding',
					description:
						'The official name of your exchange, displayed across the platform.',
					sectionId: 'exchange-name',
					docLink:
						'https://docs.hollaex.com/how-tos/customize-exchange/browser-tools/operator-controls-visuals#branding',
				},
				{
					subTitle: 'Exchange Logo',
					path: '/admin/general?branding',
					description:
						'Upload your main logo to appear in the navigation bar and emails',
					sectionId: 'exchange-logo',
					docLink:
						'https://docs.hollaex.com/how-tos/customize-exchange/browser-tools/operator-controls-visuals#branding',
				},
				{
					subTitle: 'Loader (Spinner)',
					path: '/admin/general?branding',
					description:
						'The animated graphic shown while pages or dashboards load.',
					sectionId: 'loader',
					docLink:
						'https://docs.hollaex.com/how-tos/customize-exchange/browser-tools/operator-controls-visuals#branding',
				},
				{
					subTitle: 'Favicon (Browser icon)',
					path: '/admin/general?branding',
					description: 'The small icon shown in browser tabs and bookmarks',
					sectionId: 'exchange-favicon',
					docLink:
						'https://docs.hollaex.com/how-tos/customize-exchange/browser-tools/operator-controls-visuals#branding',
				},
				{
					subTitle: 'Landing/Home Page',
					path: '/admin/general?branding',
					description: 'Configure the content of the first page users see.',
					sectionId: 'landing-page',
					docLink:
						'https://docs.hollaex.com/how-tos/customize-exchange/browser-tools/operator-controls-visuals#branding',
				},
				{
					subTitle: 'Onboarding Background (Login/Sign up)',
					path: '/admin/general?branding',
					description:
						'The background image displayed on login and registration screens',
					sectionId: 'onboarding-background-image',
					docLink:
						'https://docs.hollaex.com/how-tos/customize-exchange/browser-tools/operator-controls-visuals#branding',
				},
			],
		},
		{
			title: 'Footer',
			path: '/admin/general?footer',
			description:
				'Edit the exchange footer, including company information, copyright, contact details, and social links.',
			searchContent: [
				'footer',
				'edit footer',
				'exchange footer',
				'company info',
				'copyright',
				'contact info',
				'social links',
				'footer links',
				'legal',
				'about',
				'support',
				'footer settings',
				'company details',
				'edit company info',
				'footer text',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/customize-exchange/browser-tools/operator-controls-visuals#footer',
			subContent: [
				{
					subTitle: 'Exchange Description',
					path: '/admin/general?footer',
					description:
						"Add a summary about your exchange business for platform's footer",
					sectionId: 'exchange-description',
				},
				{
					subTitle: 'Footer Small Text',
					path: '/admin/general?footer',
					description:
						"Add fine print information about your business for platform's footer such as terms and other policies",
					sectionId: 'footer-small-text',
				},
				{
					subTitle: 'Referral Badge',
					path: '/admin/general?footer',
					description:
						'Add and remove the white-label referral page on the footer',
					sectionId: 'referral-badge',
				},
				{
					subTitle: 'Footer Links',
					path: '/admin/general?footer',
					description: 'Add footer labels and links',
					sectionId: 'footer-links',
				},
			],
		},
		{
			title: 'Security',
			path: '/admin/general?security',
			description:
				'Configure security options including geofencing, country blacklists, and access restrictions for your exchange.',
			searchContent: [
				'security',
				'geofencing',
				'block country',
				'blacklist',
				'security settings',
				'country restrictions',
				'restrict access',
				'compliance',
				'country ban',
				'blacklist management',
				'exchange security',
				'admin security',
				'access control',
				'security config',
				'geo block',
				'region block',
				'secure',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/general#security',
			subContent: [
				{
					subTitle: 'Geofencing',
					path: '/admin/general?security',
					description:
						'Restrict or allow access to the exchange based on user location; blacklist or whitelist countries for compliance and security.',
					sectionId: 'geofencing',
				},
				{
					subTitle: 'Suspicious Login',
					path: '/admin/general?security',
					description:
						'Monitors unusual login activity such as failed attempts, unknown devices, or new locations, with options to flag or lock accounts.',
					sectionId: 'suspicious-login',
				},
				{
					subTitle: 'Tech Access Key',
					path: '/admin/general?security',
					description:
						'System-generated key for backend access, used by developers or admins for integrations, troubleshooting, or configurations.',
					sectionId: 'tech-access-key',
				},
				{
					subTitle: 'API Keys',
					path: '/admin/general?security',
					description:
						'Generate and manage secure API keys for programmatic access, with permission controls and IP whitelisting for added security.',
					sectionId: 'api-keys',
					searchContent: ['developers'],
				},
			],
		},
		{
			title: 'Active Features',
			path: '/admin/general?features',
			description:
				'Enable or disable core exchange features such as Pro Trade, Quick Trade, Staking, P2P, Fiat Controls, and more.',
			searchContent: [
				'features',
				'enable features',
				'activate features',
				'feature toggles',
				'staking',
				'peer to peer',
				'referral',
				'referral system',
				'fiat controls',
				'fiat onramp',
				'fiat offramp',
				'chat system',
				'home landing page',
				'landing page',
				'homepage',
				'exchange apps',
				'additional apps',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/general#features',
			subContent: [
				{
					subTitle: 'Announcement',
					isActive: features?.announcement,
					description: 'Notify users with announcement posts or alert popups.',
					searchContent: ['alert', 'popup', 'notifications', 'messages'],
					docLink: 'https://docs.hollaex.com/plugins/use-plugins/announcements',
					path: '/admin/general?features',
					sectionId: 'announcement',
				},
				{
					subTitle: 'Pro Trade',
					isActive: features?.pro_trade,
					description:
						'Advanced trading interface with chart, orderbook, and limit orders.',
					path: '/admin/general?features',
					searchContent: [
						'market',
						'trading',
						'advanced',
						'chart',
						'orderbook',
						'limit order',
					],
					docLink:
						'https://docs.hollaex.com/how-tos/operator-control-panel/general#features:~:text=on%20your%20exchange.-,Pro%20Trade,-%3A%20Common%20trading%20feature',
					sectionId: 'pro-trade',
				},
				{
					subTitle: 'Quick Trade',
					isActive: features?.quick_trade,
					description: 'Simple buy/sell and asset conversion for all users.',
					path: '/admin/general?features',
					searchContent: ['convert', 'swap', 'simple buy', 'simple sell'],
					docLink:
						'https://docs.hollaex.com/how-tos/operator-control-panel/general#features:~:text=using%20the%20orderbook.-,Quick%20Trade,-%3A%20Provides%20a%20simpler',
					sectionId: 'quick-trade',
				},
				{
					subTitle: 'Auto Trade',
					isActive: features?.auto_trade_config,
					path: '/admin/general?features',
					description:
						'Automate trading based on user-defined settings and strategies.',
					searchContent: ['automated trading', 'bot', 'trading bot'],
					sectionId: 'auto-trade',
				},
				{
					subTitle: 'Stake (Defi)',
					isActive: features?.stake_page,
					description:
						'Lock coins and distribute crypto rewards for DeFi participation.',
					path: '/admin/general?features',
					searchContent: [
						'defi',
						'staking',
						'decentralized',
						'rewards',
						'defi staking',
					],
					docLink:
						'https://docs.hollaex.com/how-tos/operator-control-panel/general#features:~:text=via%20this%20page.-,Staking,-%3A%20You%20can%20add',
					sectionId: 'defi-stake',
				},
				{
					subTitle: 'Stake (Cefi)',
					isActive: features?.cefi_stake,
					description:
						'Lock coins and distribute crypto rewards for CeFi participation.',
					path: '/admin/general?features',
					searchContent: [
						'cefi',
						'staking',
						'centralized',
						'rewards',
						'cefi staking',
					],
					docLink:
						'https://docs.hollaex.com/how-tos/operator-control-panel/general#features:~:text=via%20this%20page.-,Staking,-%3A%20You%20can%20add',
					sectionId: 'cefi-stake',
				},
				{
					subTitle: 'P&L Wallet Info',
					isActive: features?.balance_history_config,
					description:
						'View user balance history and analyze profit/loss statistics.',
					path: '/admin/general?features',
					searchContent: [
						'profit loss',
						'analytics',
						'p/l',
						'balance history',
						'stats',
					],
					sectionId: 'balance-history-info',
				},
				{
					subTitle: 'P2P',
					isActive: features?.p2p,
					description: 'Peer-to-peer trading for merchants and exchange users.',
					path: '/admin/general?features',
					searchContent: [
						'p2p',
						'peer to peer',
						'merchant',
						'p2p trading',
						'peer trade',
					],
					docLink: 'https://docs.hollaex.com/how-tos/p2p',
					sectionId: 'p2p',
				},
				{
					subTitle: 'Referral System',
					isActive: features?.referral_history_config,
					description: 'User referral rewards and analytics.',
					path: '/admin/general?features',
					searchContent: [
						'referral',
						'referral system',
						'refer',
						'rewards',
						'analytics',
					],
					sectionId: 'referral-system',
				},
				{
					subTitle: 'Chain Trading',
					isActive: features?.chain_trade_config,
					description:
						'Allow users to convert any asset to another asset seamlessly.',
					path: '/admin/general?features',
					searchContent: ['convert asset', 'asset swap', 'any to any'],
					docLink: 'https://docs.hollaex.com/how-tos/smart-chain-trading',
					sectionId: 'chain-trade',
				},
				{
					subTitle: 'Fiat Controls',
					isActive: features?.ultimate_fiat,
					description:
						'Manage on-ramping, off-ramping, and tracking for fiat assets.',
					path: '/admin/general?features',
					searchContent: ['onramp', 'offramp', 'bank transfer'],
					docLink:
						'https://docs.hollaex.com/how-tos/fiat-controls/initial-setup#enabling-fiat-controls',
					sectionId: 'fiat-controls',
				},
				{
					subTitle: 'Chat System',
					isActive: features?.chat,
					description: 'Enable user messaging, including text and emojis.',
					path: '/admin/general?features',
					searchContent: ['messaging', 'text', 'emoji'],
					docLink:
						'https://docs.hollaex.com/how-tos/operator-control-panel/general#:~:text=DIY%20Boost%20plans).-,Chat%20system,-%3A%20By%20enabling%20this',
					sectionId: 'chat-system',
				},
				{
					subTitle: 'Home Landing Page',
					isActive: features?.home_page,
					description:
						'Set the first page users see when visiting your exchange.',
					path: '/admin/general?features',
					searchContent: ['home landing', 'homepage', 'first page'],
					docLink:
						'https://docs.hollaex.com/how-tos/operator-control-panel/general#:~:text=socialize%20through%20chat.-,Homepage,-%3A%20You%20can%20add',
					sectionId: 'home-landing-page',
				},
				{
					subTitle: 'Apps',
					isActive: features?.apps,
					description:
						'Add extra applications to your exchange for more functionality.',
					path: '/admin/general?features',
					searchContent: ['applications', 'exchange apps', 'add apps'],
					docLink:
						'https://docs.hollaex.com/how-tos/operator-control-panel/general#:~:text=to%20your%20users.-,Apps,-%3A%20Enable%20additional%20functionality',
					sectionId: 'apps',
				},
			],
		},
		{
			title: 'Onboarding',
			path: '/admin/general?onboarding',
			description:
				'Configure the exchange onboarding process, including welcome screens, custom messages, and the user sign-up flow.',
			searchContent: [
				'user onboarding',
				'registration',
				'sign up',
				'welcome screen',
				'welcome message',
				'first login',
				'account creation',
				'onboarding flow',
				'new user',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/general#onboarding',
			subContent: [
				{
					subTitle: 'Allow new sign ups',
					path: '/admin/general?onboarding',
					description:
						'Enable or disable new user registrations to control when sign-ups are open.',
					sectionId: 'allow-new-signups',
				},
				{
					subTitle: 'Email verification',
					path: '/admin/general?onboarding',
					description:
						'Require users to verify their email address before gaining full account access, improving security and compliance.',
					sectionId: 'email-verification',
				},
				{
					subTitle: 'Onboarding background image',
					path: '/admin/general?onboarding',
					description:
						'Set a custom background image for the login and sign-up screens to match your brand identity and create a welcoming experience.',
					sectionId: 'onboarding-background',
				},
			],
		},
		{
			title: 'Email',
			path: '/admin/general?email',
			description:
				'Manage system emails, sender addresses, SMTP, verification emails, and templates.',
			searchContent: [
				'email settings',
				'smtp',
				'sender',
				'verification email',
				'email templates',
				'mail server',
				'outgoing email',
				'email notifications',
				'email setup',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/general#email',
			subContent: [
				{
					subTitle: 'Email Configuration',
					path: '/admin/general?email',
					description:
						'Set up the sender address and SMTP server to ensure platform emails are delivered reliably.',
					sectionId: 'email-configuration',
				},
				{
					subTitle: 'Customize emails',
					path: '/admin/general?email',
					description: `Edit and brand email templates for notifications, confirmations, and alerts to match your exchange’s style.`,
					sectionId: 'customize-email',
				},
				{
					subTitle: 'Email Audit',
					path: '/admin/general?email',
					description:
						'Review a history of sent emails, including delivery status and content, for compliance and troubleshooting.',
					sectionId: 'email-audit',
				},
			],
		},
		{
			title: 'Localization',
			path: '/admin/general?localization',
			description:
				'Set up language, locale, and default currency for your exchange platform.',
			searchContent: [
				'language',
				'locale',
				'currency',
				'multi-language',
				'translations',
				'international',
				'region',
				'default language',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/general#localization',
			subContent: [
				{
					subTitle: 'Country',
					path: '/admin/general?localization',
					description:
						'Set the default country to tailor compliance, legal, and localization settings.',
					sectionId: 'country',
				},
				{
					subTitle: 'Timezone',
					path: '/admin/general?localization',
					description: `Choose the platform’s default timezone for accurate timestamps across all user activities.`,
					sectionId: 'timezone',
				},
				{
					subTitle: 'Language',
					path: '/admin/general?localization',
					description:
						'Select the default language for the user interface, with support for multiple translations.',
					sectionId: 'language',
				},
				{
					subTitle: 'Theme',
					path: '/admin/general?localization',
					description:
						'Apply a visual theme, including colors and styles, to match your brand identity.',
					sectionId: 'theme',
				},
				{
					subTitle: 'Native Currency',
					path: '/admin/general?localization',
					description:
						'Define the platform’s native currency for pricing, balances, and reports.',
					sectionId: 'native-currency',
				},
				{
					subTitle: 'Other Currency Display Options',
					path: '/admin/general?localization',
					description:
						'Adjust how other currencies are displayed, including conversion formats and decimal precision.',
					sectionId: 'other-currency-display-option',
				},
			],
		},
		{
			title: 'Help Info',
			path: '/admin/general?help_info',
			description:
				'Customize help links and informational resources shown to exchange users.',
			searchContent: [
				'support',
				'information',
				'documentation',
				'faq',
				'resources',
				'help page',
				'user help',
				'contact support',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/general#help-info',
			subContent: [
				{
					subTitle: 'Helpdesk link',
					path: '/admin/general?help_info',
					description:
						'Provide users with a direct link to your helpdesk or support center for assistance.',
					sectionId: 'helpdesk-link',
				},
				{
					subTitle: 'API documentation link',
					path: '/admin/general?help_info',
					description:
						'Offer a link to API documentation so developers can integrate and interact with the exchange securely.',
					sectionId: 'api-documentation-link',
				},
			],
		},
		{
			title: 'Apps',
			path: '/admin/general?apps',
			description:
				'Configure app versions (current vs min version) and URLs to Google Play, Apple App store, as well as download links to desktop Window and MacOS',
			searchContent: [
				'mobile',
				'mobile app',
				'app settings',
				'branding',
				'mobile access',
				'app logo',
				'app download',
				'mobile features',
				'app configuration',
			],
		},
	];

	const usersContent = [
		{
			title: 'Search user',
			path: '/admin/user',
			description: 'Search for users by name, email, or other filters.',
			searchContent: [
				'search users',
				'user search',
				'find user',
				'locate user',
				'search by email',
				'search by name',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/users#search-users',
		},
		{
			title: 'Add new user',
			path: '/admin/user',
			onHandleOpenPopup: () => setIsActiveAddNewUsers(true),
			description: 'Add a new user account manually.',
			searchContent: [
				'add user',
				'new user',
				'create user',
				'register user',
				'manual user',
			],
		},
		{
			title: 'Filter users',
			path: '/admin/user',
			description:
				'Filter users by verification, KYC, balance, or activity status.',
			searchContent: [
				'filter users',
				'user filter',
				'filter by KYC',
				'filter by status',
				'filter by verification',
			],
			onHandleOpenPopup: () => setIsActiveFilterUser(true),
		},
		{
			title: 'New users',
			path: '/admin/user',
			description: 'View a list of newly registered users.',
			searchContent: [
				'new users',
				'recently registered',
				'new accounts',
				'user onboarding',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/users#searching-and-filtering',
		},
		{
			title: `user profile (user ID: ${user?.id})`,
			path: `/admin/user?id=${user?.id}&tab=about`,
			subContent: [
				{
					subTitle: 'About user (summary)',
					path: `/admin/user?id=${user?.id}&tab=about`,
					description:
						"View and edit the user's main account information and summary.",
					searchContent: [
						'about tab',
						'user about',
						'user info',
						'profile summary',
						'main info',
						'user details',
						'user identification files',
						'user info',
						'user tier',
						'login',
						'audit',
						'download user csv',
						'audit user',
					],
					docLink:
						'https://docs.hollaex.com/how-tos/operator-control-panel/user-profile#about',
					innerContent: [
						{
							innerTitle: 'Delete user',
							onHandleOpenPopup: () => setIsActiveDeleteUser(true),
							description: 'Permanently delete the user and all related data.',
							searchContent: [
								'delete user',
								'remove user',
								'erase user',
								'delete account',
								'account removal',
								'user deletion',
							],
							path: `/admin/user?id=${user?.id}&tab=about`,
						},
						{
							innerTitle: 'User Trade Fee Discount',
							onHandleOpenPopup: () => setIsActiveUserFeeDiscount(true),
							description: 'Set or update trading fee discounts for the user.',
							searchContent: [
								'trade fee',
								'user discount',
								'fee discount',
								'adjust trade fee',
								'trading fee discount',
							],
							docLink:
								'https://docs.hollaex.com/how-tos/operator-control-panel/user-profile#about:~:text=Email%20verification%2C%202FA',
							path: `/admin/user?id=${user?.id}&tab=about`,
						},
						{
							innerTitle: 'User Email Verification Status',
							onHandleOpenPopup: () => setIsEmailVerifiedUser(true),
							description:
								'View or change the user’s email verification status.',
							searchContent: [
								'email verification',
								'verify email',
								'user email status',
								'email verified',
							],
							docLink:
								'https://docs.hollaex.com/how-tos/operator-control-panel/user-profile#email-verification',
							path: `/admin/user?id=${user?.id}&tab=about`,
							sectionId: 'user-email-verified',
						},
						{
							innerTitle: `Disable user's 2FA`,
							onHandleOpenPopup: () => setIsDisabledUser2fa(true),
							description:
								'Disable or reset two-factor authentication for the user.',
							searchContent: [
								'disable 2fa',
								'reset 2fa',
								'two-factor',
								'2fa off',
								'turn off 2fa',
								'authentication',
							],
							docLink:
								'https://docs.hollaex.com/how-tos/operator-control-panel/user-profile#two-factor-authentication-2fa',
							path: `/admin/user?id=${user?.id}&tab=about`,
							sectionId: 'user-2fa-disabled',
						},
						{
							innerTitle: 'Freeze user account',
							onHandleOpenPopup: () => setIsActiveFreezeUser(true),
							description:
								'Temporarily freeze or restrict user account access.',
							searchContent: [
								'freeze user',
								'freeze account',
								'restrict account',
								'suspend user',
								'block user',
							],
							docLink:
								'https://docs.hollaex.com/how-tos/operator-control-panel/user-profile#about:~:text=%E2%80%A2-,Freeze%20account,-%3A%20This%20prevents',
							path: `/admin/user?id=${user?.id}&tab=about`,
						},
						{
							innerTitle: 'Flag user',
							onHandleOpenPopup: () => setIsActiveFlagUser(true),
							description: 'Flag a user for compliance or risk monitoring.',
							searchContent: [
								'flag user',
								'mark user',
								'compliance flag',
								'risk user',
								'monitor user',
								'flagged',
							],
							docLink:
								'https://docs.hollaex.com/how-tos/operator-control-panel/user-profile#about:~:text=%E2%80%A2-,Flag%20user,-%3A%20Flagging%20user',
							path: `/admin/user?id=${user?.id}&tab=about`,
						},
						{
							innerTitle: 'Block Withdrawal',
							onHandleOpenPopup: () => setIsActiveWithdrawalBlock(true),
							description: "Block a user's ability to withdraw funds",
							searchContent: [
								'block',
								'withdraw',
								'limit',
								'secure',
								'risk',
								'restrict',
								'withdrawal',
							],
							path: `/admin/user?id=${user?.id}&tab=about`,
						},
					],
				},
				{
					subTitle: 'Bank',
					path: `/admin/user?id=${user?.id}&tab=bank`,
					description: 'View or manage linked bank accounts for the user.',
					searchContent: [
						'bank',
						'user bank',
						'bank accounts',
						'manage bank',
						'add bank',
					],
					docLink:
						'https://docs.hollaex.com/how-tos/operator-control-panel/user-profile#bank',
				},
				{
					subTitle: 'Payment method',
					path: `/admin/user?id=${user?.id}&tab=payment_methods`,
					description: 'View or manage the user’s saved payment methods.',
					searchContent: [
						'payment methods',
						'payment',
						'saved payment',
						'add payment method',
						'user payment',
					],
				},
				{
					subTitle: 'Balance',
					path: `/admin/user?id=${user?.id}&tab=balance`,
					description:
						'View detailed wallet and balance information for the user.',
					searchContent: [
						'balance',
						'wallet',
						'user balance',
						'account balance',
						'funds',
						'user funds',
						'filter balance',
						'search balance',
						'search funds',
						'search wallet',
					],
					docLink:
						'https://docs.hollaex.com/how-tos/operator-control-panel/user-profile#user-balance',
				},
				{
					subTitle: 'Orders',
					path: `/admin/user?id=${user?.id}&tab=orders`,
					description: 'Review all orders placed by the user.',
					searchContent: [
						'orders',
						'order history',
						'user orders',
						'trade orders',
					],
					docLink:
						'https://docs.hollaex.com/how-tos/operator-control-panel/user-profile#orders',
					innerContent: [
						{
							innerTitle: 'Bids',
							path: `/admin/user?id=${user?.id}&tab=orders`,
							description:
								'view all individual user orderbook bids and cancel them',
							onHandleOpenPopup: () => setSelectedOrdersTab('buy'),
						},
						{
							innerTitle: 'Asks',
							path: `/admin/user?id=${user?.id}&tab=orders`,
							description:
								'view all individual user orderbook asks and cancel them',
							onHandleOpenPopup: () => setSelectedOrdersTab('sell'),
						},
						{
							innerTitle: 'Create order',
							path: `/admin/user?id=${user?.id}&tab=orders`,
							description:
								'Create an order on a user account by selecting trading pair symbol, type, side, size and price of the order',
							onHandleOpenPopup: () => setIsDisplayCreateOrder(true),
						},
					],
				},
				{
					subTitle: 'Trade history',
					path: `/admin/user?id=${user?.id}&tab=trade`,
					description:
						'Review the user’s completed trades and trading activity.',
					searchContent: [
						'trade history',
						'user trades',
						'trading activity',
						'completed trades',
					],
					docLink:
						'https://docs.hollaex.com/how-tos/operator-control-panel/user-profile#trade-history',
				},
				{
					subTitle: 'Deposit',
					path: `/admin/user?id=${user?.id}&tab=deposits`,
					description: 'View or manage the user’s deposit history and status.',
					searchContent: [
						'deposits',
						'deposit history',
						'deposit status',
						'user deposits',
					],
					docLink:
						'https://docs.hollaex.com/how-tos/operator-control-panel/user-profile#deposits',
				},
				{
					subTitle: 'Withdrawal',
					path: `/admin/user?id=${user?.id}&tab=withdrawals`,
					description:
						'View or manage the user’s withdrawal history and status.',
					searchContent: [
						'withdrawals',
						'withdrawal history',
						'withdrawal status',
						'user withdrawals',
					],
					docLink:
						'https://docs.hollaex.com/how-tos/operator-control-panel/user-profile#withdrawal',
				},
				{
					subTitle: 'Referral',
					path: `/admin/user?id=${user?.id}&tab=referrals`,
					description: 'Access referral details and analytics for the user.',
					searchContent: [
						'referrals',
						'user referrals',
						'referral analytics',
						'referral data',
					],
					docLink:
						'https://docs.hollaex.com/how-tos/operator-control-panel/user-profile#referral',
					innerContent: [
						{
							innerTitle: 'Create a Referral Code',
							path: `/admin/user?id=${user?.id}&tab=referrals`,
							description:
								'Create a custom referral link code for a user with a unique code, earnings percentage rate for that user collects and discount they give to their friends',
							onHandleOpenPopup: () => setIsDisplayCreateReferral(true),
						},
					],
				},
				{
					subTitle: 'Meta',
					path: `/admin/user?id=${user?.id}&tab=meta`,
					description:
						'View or edit custom fields and meta information for the user.',
					searchContent: [
						'meta',
						'user meta',
						'profile meta',
						'custom fields',
						'metadata',
						'configure meta',
					],
					docLink:
						'https://docs.hollaex.com/how-tos/operator-control-panel/user-profile#meta',
				},
			],
		},
	];

	const assetsContent = [
		{
			title: 'Active Assets',
			path: '/admin/financials?assets',
			description:
				'View and manage all digital assets available on the exchange.',
			searchContent: [
				'listed assets',
				'coins',
				'tokens',
				'manage assets',
				'asset list',
				'bitcoin',
				'btc',
				'usdt',
				'ethereum',
				'eth',
				'tether',
				'xrp',
				'sol',
				'solana',
				'usdc',
				'tron',
				'trx',
				'erc20',
				'blockchain',
				'chain',
			],
			docLink: 'https://docs.hollaex.com/how-tos/operator-control-panel/assets',
			subContent: [
				{
					subTitle: 'Create or add a new coin',
					path: '/admin/financials?assets',
					description:
						'Create or add a new coin such a blockchain based asset and fiat currency assets',
					onHandleOpenPopup: () => setIsDisplayCreateAsset(true),
				},
			],
		},
		{
			title: 'Financial Summary',
			path: '/admin/financials?summary',
			description:
				'Overview of total balances, asset distribution, and exchange health metrics.',
			searchContent: [
				'exchange summary',
				'total balance',
				'health',
				'asset distribution',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/assets#summary',
		},
		{
			title: 'Exchange Wallet User Addresses',
			path: '/admin/financials?wallet',
			description:
				'Search or view all user addresses associated with the exchange wallet.',
			searchContent: [
				'wallet addresses',
				'user address',
				'exchange wallet',
				'address search',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/assets#wallet',
		},
		{
			title: 'Exchange balances',
			path: '/admin/financials?balances',
			description:
				'Search for a user balance by applying combination of filter such as an email, user ID and currency asset',
			searchContent: [
				'exchange wallet',
				'exchange balances',
				'all user balance',
				'search balances',
				'user wallet balance',
				'user wallet',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/assets#balances',
		},
		{
			title: 'Orders',
			path: '/admin/financials?orders',
			description:
				'View, search, and manage all orders placed on the exchange.',
			searchContent: [
				'manage orders',
				'trading orders',
				'user orders',
				'order history',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/assets#orders',
			subContent: [
				{
					subTitle: 'Bids',
					path: '/admin/financials?orders',
					description: 'Display all bid (buy) orders placed by the user.',
					onHandleOpenPopup: () => setSelectedOrdersTab('buy'),
				},
				{
					subTitle: 'Asks',
					path: '/admin/financials?orders',
					description: 'Display all ask (sell) orders placed by the user.',
					onHandleOpenPopup: () => setSelectedOrdersTab('sell'),
				},
				{
					subTitle: 'Create order',
					path: '/admin/financials?orders',
					description:
						'Create an order on a user account by selecting trading pair symbol, type, side, size and price of the order',
					onHandleOpenPopup: () => setIsDisplayCreateOrder(true),
				},
			],
		},
		{
			title: 'Trades',
			path: '/admin/financials?trades',
			description:
				'View and manage all digital assets available on the exchange.',
			searchContent: [
				'listed assets',
				'coins',
				'tokens',
				'manage assets',
				'asset list',
			],
			subContent: [
				{
					subTitle: 'Create a Trade',
					path: '/admin/financials?trades',
					description:
						'Create Trade between two users on your exchange by defining which party is the maker and taker, the asset to be traded, quote price and side, size and fees percentage %',
					onHandleOpenPopup: () => setIsDisplayCreateTrade(true),
				},
			],
		},
		{
			title: 'Deposits',
			path: '/admin/financials?deposits',
			description: 'Monitor and manage all user deposits across assets.',
			searchContent: ['user deposits', 'deposit status', 'deposit history'],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/assets#deposits',
		},
		{
			title: 'Withdrawals',
			path: '/admin/financials?withdrawals',
			description: 'Monitor and manage all user withdrawals across assets.',
			searchContent: [
				'user withdrawals',
				'withdrawal status',
				'withdrawal history',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/assets#withdrawals',
		},
		{
			title: 'Earnings (Fee settlement)',
			path: '/admin/financials?earnings',
			description:
				'Review exchange earnings from fees, spreads, and other sources.',
			searchContent: [
				'earnings',
				'revenue',
				'exchange earnings',
				'fees',
				'profit',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/assets#earnings',
		},
		{
			title: 'Transfers',
			path: '/admin/financials?transfers',
			description:
				'View and manage asset transfers between wallets or accounts.',
			searchContent: ['asset transfers', 'move funds', 'transfer funds'],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/assets#transfers',
		},
		{
			title: 'Duster',
			path: '/admin/financials?duster',
			description:
				'Manage and convert small balance “dust” into usable assets.',
			searchContent: [
				'dust',
				'small balances',
				'convert dust',
				'balance cleanup',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/assets#duster',
		},
		{
			title: 'Limits',
			path: '/admin/financials?limits',
			description:
				'Set and review limits on deposits, withdrawals, and trading for users and assets.',
			searchContent: ['deposit limit', 'withdrawal limit', 'trading limit'],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/assets#limits',
			subContent: [
				{
					subTitle: 'Create Independent Limit',
					path: '/admin/financials?limits',
					description:
						'Create a unique daily and monthly withdrawal limits for an individual asset and user tier level',
					onHandleOpenPopup: () => setIsActiveIndependentLimit(true),
				},
				{
					subTitle: 'Create Collective Limit',
					path: '/admin/financials?limits',
					description:
						'Create a limit for multiple currencies that share one withdrawal limit amount collectively',
					onHandleOpenPopup: () => setIsActiveCollectiveLimit(true),
				},
			],
		},
		{
			title: 'Fee Markups',
			path: '/admin/financials?fee-markups',
			description: 'Configure fee markups on specific assets or trading pairs.',
			searchContent: ['fee adjustment', 'trading fee', 'asset fee', 'markup'],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/assets#fee-markup',
		},
	];

	const marketsContent = [
		{
			title: 'Public Markets',
			path: '/admin/trade?public-markets',
			description: 'Manage and configure all public trading markets.',
			searchContent: [
				'trading pairs',
				'market management',
				'available markets',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/markets',
			subContent: [
				{
					subTitle: 'Add Market',
					path: '/admin/trade?public-markets',
					description:
						'HollaEx markets (Markets offered by HollaEx) and/or Other markets (Markets offered by other providers/exchanges within HollaEx network)',
					searchContent: ['price'],
					onHandleOpenPopup: () => setIsDisplayAddMarket(true),
				},
				{
					subTitle: 'Create a new market',
					path: '/admin/trade?public-markets',
					description:
						'Create a new market by selecting the Base Asset that will be traded and the quote asset that the base asset will be priced in',
					searchContent: ['price'],
					onHandleOpenPopup: () => setIsDisplayCreateMarket(true),
				},
			],
		},
		{
			title: 'Orders',
			path: '/admin/trade?orders',
			description: 'Review and manage all market orders across trading pairs.',
			searchContent: [
				'market orders',
				'manage orders',
				'order book',
				'trading orders',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/markets#orders',
			subContent: [
				{
					subTitle: 'Bids',
					path: '/admin/trade?orders',
					description: 'Display all active bid (buy) orders from users.',
					onHandleOpenPopup: () => setSelectedOrdersTab('buy'),
				},
				{
					subTitle: 'Asks',
					path: '/admin/trade?orders',
					description: 'Display all active ask (sell) orders from users.',
					onHandleOpenPopup: () => setSelectedOrdersTab('sell'),
				},
				{
					subTitle: 'Create order',
					path: '/admin/trade?orders',
					description:
						'Manually create a new order directly in the market such as a limit order on a orderbook for a user',
					onHandleOpenPopup: () => setIsDisplayCreateOrder(true),
				},
			],
		},
		{
			title: 'OTC Desk',
			path: '/admin/trade?otc-desk',
			description:
				'Configure and monitor the over-the-counter (OTC) desk and services.',
			searchContent: [
				'over the counter',
				'otc trading',
				'otc settings',
				'price',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/markets#otc-desk',
		},
		{
			title: 'P2P',
			path: '/admin/trade?p2p',
			description:
				'Set up and manage peer-to-peer (P2P) trading features, market settings and fee collection rates.',
			searchContent: [
				'P2P Trading',
				'peer to peer',
				'p2p settings',
				'p2p markets',
				'p2p configuration',
			],
			docLink: 'https://docs.hollaex.com/how-tos/p2p',
			subContent: [
				{
					subTitle: 'P2P public deals',
					path: '/admin/trade?p2p',
					description:
						'Display all publicly listed P2P deals available for users to browse and join.',
					onHandleOpenPopup: () => setSelectedP2pTab('0'),
				},
				{
					subTitle: 'P2P settings',
					path: '/admin/trade?p2p',
					description:
						'Setup P2P, check the status of the P2P system on your platform and the settings. Select what assets, payment method and the KYC account tier requirements for P2P participation allowed on your platform.',
					onHandleOpenPopup: () => setSelectedP2pTab('1'),
				},
				{
					subTitle: 'Active',
					path: '/admin/trade?p2p',
					description:
						'Show currently active P2P trades between users in progress.',
					onHandleOpenPopup: () => setSelectedP2pTab('2'),
				},
				{
					subTitle: 'Disputes',
					path: '/admin/trade?p2p',
					description:
						'Review and resolve disputes raised by users during P2P transaction',
					onHandleOpenPopup: () => setSelectedP2pTab('3'),
				},
				{
					subTitle: 'Payment Accounts',
					path: '/admin/trade?p2p',
					description:
						'Manage user payment accounts linked for P2P trading, such as bank transfers or e-wallets (third-party payment accounts).',
					onHandleOpenPopup: () => setSelectedP2pTab('4'),
				},
				{
					subTitle: 'Feedbacks',
					path: '/admin/trade?p2p',
					description:
						'View and moderate user feedback and ratings left after P2P trades by users between each other.',
					onHandleOpenPopup: () => setSelectedP2pTab('5'),
				},
			],
		},
		{
			title: 'Quick Trade',
			path: '/admin/trade?quick-trade',
			description:
				'Manage Quick Trade (Convert) settings and connect to liquidity sources.',
			searchContent: [
				'quick trade',
				'convert',
				'swap',
				'quick trade settings',
				'liquidity connection',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/markets#quick-trade',
		},
	];

	const fiatControlContent = [
		{
			title: 'Summary & Deposits',
			path: '/admin/fiat?summary',
			description:
				'Manage fiat currencies, banks, payment processors, and enable fiat on/off-ramps.',
			searchContent: [
				'fiat controls',
				'fiat summary',
				'manage fiat',
				'enable fiat',
				'bank',
				'payment',
				'on-ramp',
				'off-ramp',
			],
			docLink: 'https://docs.hollaex.com/how-tos/fiat-controls',
		},
		{
			title: 'Payment accounts',
			path: '/admin/fiat?payment-accounts',
			description:
				'Allow users to add or edit fiat payment methods for verification and off-ramp.',
			searchContent: [
				'payment account',
				'payment method',
				'bank account',
				'add payment',
				'user payment info',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/fiat-controls/initial-setup#adding-payment-account',
		},
		{
			title: 'On-ramp',
			path: '/admin/fiat?onramp',
			description:
				'Configure bank and payment processor details for user fiat deposits.',
			searchContent: [
				'on-ramp',
				'fiat onramp',
				'fiat deposit',
				'payment processor',
				'add bank',
				'deposit settings',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/fiat-controls/users-making-fiat-deposit',
		},
		{
			title: 'Off-ramp',
			path: '/admin/fiat?offramp',
			description:
				'Configure payment details for user fiat withdrawals (off-ramps).',
			searchContent: [
				'off-ramp',
				'fiat withdrawal',
				'off ramp',
				'payment account',
				'withdraw fiat',
				'withdrawal settings',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/fiat-controls/user-making-fiat-withdrawal',
		},
		{
			title: 'Fiat fees & customizations',
			path: '/admin/fiat?fiat-fees',
			description:
				'Edit or override fees, min/max amounts, and customization for fiat assets.',
			searchContent: [
				'fiat fees',
				'customize fees',
				'withdrawal fee',
				'deposit fee',
				'min amount',
				'max amount',
				'edit fee',
				'fiat customization',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/fiat-controls/editing-deposit-and-withdrawal-fees',
		},
	];

	const pluginsContent = [
		{
			title: 'Installed Plugins',
			path: '/admin/plugins',
			description:
				'Explore, install, and manage exchange plugins for additional features.',
			searchContent: [
				'plugins',
				'install plugins',
				'manage plugins',
				'plugin marketplace',
				'add-ons',
				'developers',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/plugins#installed-plugins',
			subContent: [
				{
					subTitle: 'Add Third Party Plugins',
					path: '/admin/plugins',
					description:
						'Add a plugin by uploading a json file or inputting URL path',
					onHandleOpenPopup: () => setIsDisplayAddPlugin(true),
					searchContent: ['developers'],
				},
			],
		},
		{
			title: 'Explore Plugin',
			path: '/admin/plugins/store',
			description:
				'Explore all the plugins apps to get additional features added to your exchange.',
			searchContent: [
				'plugins',
				'explore plugins',
				'add plugins',
				'plugin marketplace',
				'developers',
				'add-ons',
				'extensions',
				'integrations',
			],
		},
	];

	const consoleContent = [
		{
			title: '<HEAD>',
			path: '/account',
			description:
				'Inject custom code into the <HEAD> section of your exchange (for scripts, meta, etc.).',
			searchContent: [
				'console',
				'head injection',
				'custom code',
				'scripts',
				'meta',
				'advanced settings',
			],
			onHandleOpenPopup: () => setIsDisplayConsoleHead(true),
		},
		{
			title: '<BODY>',
			path: '/account',
			description:
				'Inject custom code into the <BODY> section of your exchange (for widgets, scripts, etc.).',
			searchContent: [
				'console',
				'body injection',
				'custom code',
				'widgets',
				'body scripts',
				'advanced settings',
			],
			onHandleOpenPopup: () => setIsDisplayConsoleBody(true),
		},
	];

	const editModeContent = [
		{
			title: 'All Graphics',
			path: '/account',
			description:
				'Upload and manage all visual assets, icons, and graphics for your exchange.',
			searchContent: [
				'graphics',
				'images',
				'icons',
				'logo',
				'upload graphics',
				'visual assets',
				'branding',
				'customize graphics',
				'exchange graphics',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/customize-exchange/browser-tools/enter-edit-mode#all-graphics',
			onHandleOpenPopup: () => setIsGraphicsEditMode(true),
		},
		{
			title: 'Themes',
			path: '/account',
			description:
				'Customize the look and feel of your exchange with color schemes and pre-set or custom themes.',
			searchContent: [
				'themes',
				'theme settings',
				'color',
				'color scheme',
				'style',
				'appearance',
				'customize theme',
				'ui theme',
				'dark mode',
				'light mode',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/customize-exchange/browser-tools/enter-edit-mode#themes',
			onHandleOpenPopup: () => setIsThemesEditMode(true),
		},
		{
			title: 'All Strings',
			path: '/account',
			description:
				'Edit and localize all text labels, strings, and system messages across the exchange platform.',
			searchContent: [
				'strings',
				'edit text',
				'labels',
				'localization',
				'language',
				'messages',
				'system text',
				'translations',
				'customize text',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/customize-exchange/browser-tools/enter-edit-mode',
			onHandleOpenPopup: () => setIsStringsEditMode(true),
		},
	];

	const rolesContent = [
		{
			title: 'Designate Role',
			path: '/admin/roles?designate',
			description:
				'Assign roles to users for admin, operator, or custom permissions.',
			searchContent: [
				'designate role',
				'assign role',
				'set user role',
				'user permissions',
				'invite',
			],
			docLink: 'https://docs.hollaex.com/how-tos/operator-control-panel/roles',
		},
		{
			title: 'Manage Role',
			path: '/admin/roles?manage',
			description:
				'Create, edit, or remove custom roles for platform access and permissions.',
			searchContent: [
				'manage roles',
				'edit roles',
				'roles management',
				'user roles',
				'invite',
			],
		},
	];

	const sessionsContent = [
		{
			title: 'Active User Sessions',
			path: '/admin/sessions?active',
			description: 'View and manage all active user sessions on the platform.',
			searchContent: [
				'active sessions',
				'user sessions',
				'manage sessions',
				'session log',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/sessions',
		},
		{
			title: 'Login Logs',
			path: '/admin/sessions?logins',
			description: 'Review the login history and IPs of all users.',
			searchContent: [
				'logins',
				'login log',
				'user logins',
				'user login history',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/sessions#logins-tab',
		},
	];

	const billingContent = [
		{
			title: 'Billing',
			path: '/admin/billing',
			description:
				'Manage subscription plans, invoices, payment methods, and billing history.',
			searchContent: [
				'billing',
				'subscription',
				'invoice',
				'payment',
				'billing history',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/billing',
		},
	];

	const tiersContent = [
		{
			title: 'Tier Trade Fees',
			path: '/admin/tiers?fees',
			description: 'Edit fee tiers for trading volume or user account status.',
			searchContent: [
				'trade fees',
				'tier fees',
				'edit fees',
				'account tier',
				'fee scheduley',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/trading-fees-and-account-tiers',
		},
		{
			title: 'Account Tiers',
			path: '/admin/tiers?tiers',
			description: 'Define and manage user account tiers and upgrade criteria.',
			searchContent: [
				'account tiers',
				'user tiers',
				'tier management',
				'upgrade criteria',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/trading-fees-and-account-tiers#account-tiers',
		},
	];

	const stakeContent = [
		{
			title: 'CeFi Pools',
			path: '/admin/stakes?cefi',
			description:
				'Manage centralized finance (CeFi) pools and available staking programs.',
			searchContent: [
				'cefi',
				'cefi pools',
				'pools',
				'staking',
				'manage cefi',
				'cefi staking',
				'stake',
			],
			docLink: 'https://docs.hollaex.com/how-tos/staking',
		},
		{
			title: `User’s Stakes`,
			path: '/admin/stakes?user-staking',
			description: 'View and manage user stakes in CeFi and DeFi programs.',
			searchContent: [
				'user stakes',
				'staking',
				'cefi',
				'defi',
				'manage user stakes',
			],
		},
	];

	const announcementContent = [
		{
			title: 'Announcements',
			path: '/admin/announcement?activeAnnouncement',
			description: 'Send or schedule announcements to exchange users.',
			searchContent: [
				'announcement',
				'send announcement',
				'user alerts',
				'post notice',
			],
			docLink: 'https://docs.hollaex.com/plugins/use-plugins/announcements',
			subContent: [
				{
					subTitle: 'Display Locations',
					description:
						'Control where announcements are shown to users: choose to highlight specific messages as a login popup or top screen bar, and set an expiry date for each announcement.',
					path: '/admin/announcement?displayLocation',
				},
			],
		},
	];

	const chatContent = [
		{
			title: 'Chat',
			path: '/admin/chat',
			description:
				'Monitor or participate in user chat channels on the platform.',
			searchContent: ['chat', 'user chat', 'messaging', 'chat channels'],
			docLink: 'https://docs.hollaex.com/how-tos/operator-control-panel/chat',
		},
	];

	const operatorLogContent = [
		{
			title: 'Operator Logs',
			path: '/admin/audits',
			description:
				'Review all operator actions, system changes, and admin logs.',
			searchContent: [
				'operator logs',
				'admin logs',
				'audit log',
				'system logs',
			],
			docLink:
				'https://docs.hollaex.com/how-tos/operator-control-panel/admin-logs',
		},
	];

	const appsContent = [
		{
			title: 'Apps',
			path: '/admin/apps',
			description:
				'Manage and configure extra apps, extensions or integrations on your exchange.',
			searchContent: [
				'apps',
				'manage apps',
				'integrations',
				'add app',
				'app marketplace',
			],
			docLink: 'https://docs.hollaex.com/?q=apps',
		},
	];

	const RAW_SECTIONS = [
		{
			label: 'General',
			content: generalContent,
			icon: STATIC_ICONS.GENERAL_SETUP,
			category: ['All', 'Common'],
		},
		{
			label: 'Users',
			content: usersContent,
			icon: STATIC_ICONS.USERS_SETUP,
			category: ['All', 'Common'],
		},
		{
			label: 'Assets',
			content: assetsContent,
			icon: STATIC_ICONS.DIGITAL_ASSETS_ICON,
			category: ['All', 'Trading'],
		},
		{
			label: 'Markets',
			content: marketsContent,
			icon: STATIC_ICONS.MARKET_ICON,
			category: ['All', 'Trading'],
		},
		{
			label: 'Fiat Controls',
			content: fiatControlContent,
			icon: STATIC_ICONS.FIAT_CONTROLS_ICON,
			category: ['All', 'Advanced'],
		},
		{
			label: 'Plugins',
			content: pluginsContent,
			icon: STATIC_ICONS.ADMIN_PLUGINS,
			category: ['All', 'Advanced'],
		},
		{
			label: 'Console',
			content: consoleContent,
			category: ['All', 'Advanced'],
		},
		{
			label: 'Roles',
			content: rolesContent,
			icon: STATIC_ICONS.ADMIN_ROLES,
			category: ['All', 'High level'],
		},
		{
			label: 'Sessions',
			content: sessionsContent,
			category: ['All', 'High level'],
		},
		{
			label: 'Edit Mode',
			content: editModeContent,
			icon: STATIC_ICONS.ADMIN_CUSTOMIZE,
			category: ['All', 'Common'],
		},
		{ content: billingContent, category: ['All', 'Business'] },
		{
			label: 'Tiers',
			content: tiersContent,
			icon: STATIC_ICONS.ADMIN_TIERS,
			category: ['All', 'Business'],
		},
		{
			label: 'Stakes',
			content: stakeContent,
			icon: STATIC_ICONS.STAKING_ICON,
			category: ['All', 'Business'],
		},
		{ content: announcementContent, category: ['All', 'Operations'] },
		{ content: chatContent, category: ['All', 'Operations'] },
		{ content: operatorLogContent, category: ['All', 'Operations'] },
		{ content: appsContent, category: ['All', 'Operations'] },
	];

	const CATEGORY_ORDER = [
		{ key: 'Common', label: 'COMMON' },
		{ key: 'Trading', label: 'TRADING' },
		{ key: 'Advanced', label: 'ADVANCED' },
		{ key: 'High level', label: 'HIGH LEVEL' },
		{ key: 'Business', label: 'BUSINESS' },
		{ key: 'Operations', label: 'OPERATIONS' },
	];

	const animationRemove = debounce((el) => {
		el.classList.remove('highlight-section');
	}, 2000);

	const debouncedFlash = debounce(() => {
		if (!flashElement) return;

		flashElement.classList.toggle('highlight-section');
		flashCount++;

		if (flashCount < flashMax) {
			debouncedFlash();
		} else {
			animationRemove(flashElement);
			flashElement = null;
			flashCount = 0;
			flashMax = 0;
		}
	}, 500);

	const flashHighlight = (el, flashes = 3, interval = 300) => {
		if (!el) return;

		flashElement = el;
		flashCount = 0;
		flashMax = flashes * 2;

		debouncedFlash.cancel();
		debouncedFlash.flush = debounce(debouncedFlash.flush, interval)?.flush;

		debouncedFlash();
	};

	const scrollToSection = debounce((sectionId) => {
		const el = document.getElementById(sectionId);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
			flashHighlight(el);
		}
	}, 1000);

	useEffect(() => {
		if (!isDisplaySearchPopup) {
			animationRemove.cancel();
			scrollToSection.cancel();
			debouncedFlash.cancel();
			setOpenPanels({});
			setOpenInnerPanels({});
		}
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isDisplaySearchPopup]);

	useEffect(() => {
		if (search?.length === 0) {
			setSelectedCategory('all');
		}
		const trimmed = search?.trim();
		if (!trimmed) return;

		const timer = debounce(() => {
			const updatedRecent = [
				trimmed,
				...recentSearches?.filter((data) => data !== trimmed),
			]?.slice(0, MAX_RECENT);
			setRecentSearches(updatedRecent);
		}, 1000);
		timer();

		return () => timer.cancel();
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search]);

	const onHandleRoute = (
		path = '/',
		handleOpenPopup = () => {},
		sectionId = ''
	) => {
		router.push(path);
		onHandleClose();
		handleOpenPopup();
		setSearch('');
		setOpenPanels({});
		setOpenInnerPanels({});
		scrollToSection(sectionId);
	};

	const highlightText = (
		text,
		searchArr = [],
		inactive = false,
		contentLength = '',
		item = null
	) => {
		if (inactive || !search) {
			return (
				<span
					onClick={() =>
						onHandleRoute(item?.path, item?.onHandleOpenPopup, item?.sectionId)
					}
				>
					{text} {contentLength && `(${contentLength})`}
				</span>
			);
		}
		const searchLower = search?.toLowerCase();
		const isMatch =
			text?.toLowerCase()?.includes(searchLower) ||
			searchArr?.some((s) => s?.toLowerCase()?.includes(searchLower));
		return (
			<span className={isMatch ? 'highlighted-text' : 'inactive-text'}>
				{text} {contentLength && `(${contentLength})`}
			</span>
		);
	};

	const highlightWithOpacity = (
		text,
		searchArr = [],
		inactive = false,
		contentLength = '',
		item
	) => highlightText(text, searchArr, inactive, contentLength, item);
	const getHighlight = (inactive) => (
		text,
		searchArr = [],
		inactive = false,
		contentLength = '',
		item
	) => highlightText(text, searchArr, inactive, contentLength, item);

	const cardHasMatch = useCallback(
		(item) => {
			if (!search) return true;
			const searchLower = search?.toLowerCase();
			if (item?.title && item?.title?.toLowerCase()?.includes(searchLower))
				return true;
			if (
				item?.searchContent &&
				item?.searchContent?.some((s) =>
					s?.toLowerCase()?.includes(searchLower)
				)
			)
				return true;
			if (
				item?.subContent &&
				item?.subContent?.some((sub) => cardHasMatch(sub))
			)
				return true;
			if (
				item?.innerContent &&
				item?.innerContent?.some((inner) => cardHasMatch(inner))
			)
				return true;
			if (
				item?.subTitle &&
				item?.subTitle?.toLowerCase()?.includes(searchLower)
			)
				return true;
			if (
				item?.innerTitle &&
				item?.innerTitle?.toLowerCase()?.includes(searchLower)
			)
				return true;
			return false;
		},
		[search]
	);

	const { categorySections, displayedCategories } = useMemo(() => {
		const filteredSections = RAW_SECTIONS?.map((data) => ({
			...data,
			content: data?.content || [],
		}))?.filter(
			(section) =>
				Array.isArray(section?.content) && section?.content?.length > 0
		);

		const grouped =
			CATEGORY_ORDER?.reduce((acc, { key }) => {
				if (key) acc[key] = [];
				return acc;
			}, {}) || {};

		(filteredSections || []).forEach((section) => {
			(section?.category || []).forEach((cat) => {
				const catKey = cat?.toLowerCase?.();
				if (
					(selectedCategory === 'all' || catKey === selectedCategory) &&
					grouped?.[cat]
				) {
					grouped[cat].push(section);
				}
			});
		});

		const displayed =
			CATEGORY_ORDER?.filter(({ key }) => grouped?.[key]?.length > 0) || [];

		return { categorySections: grouped, displayedCategories: displayed };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search, features, user, selectedCategory]);

	const onHandleCategory = (data) => {
		setSelectedCategory(data?.toLowerCase());
	};

	const onHandleNavigate = (e, link) => {
		e.stopPropagation();
		window.open(link, '_blank');
		onHandleClose();
		setOpenPanels({});
		setOpenInnerPanels({});
	};

	const ContentTitle = ({
		item = {},
		onHandleRoute = () => {},
		onHandleNavigate = () => {},
	}) => {
		const titleEl = (
			<span
				className="operator-control-search-content-title pointer"
				onClick={() =>
					onHandleRoute(item?.path, item?.onHandleOpenPopup, item?.sectionId)
				}
			>
				{highlightWithOpacity(
					item?.title,
					item?.searchContent,
					false,
					item?.subContent?.length,
					item
				)}
			</span>
		);

		return item?.description ? (
			<Tooltip
				title={
					<div className="custom-description-tooltip-content">
						<span>
							{item?.description}
							{item?.docLink && (
								<span
									className="underline-text pointer ml-2"
									onClick={(e) => onHandleNavigate(e, item?.docLink)}
								>
									Read more
								</span>
							)}
						</span>
						<span
							className="custom-description-tooltip-open-btn"
							onClick={() =>
								onHandleRoute(
									item?.path,
									item?.onHandleOpenPopup,
									item?.sectionId
								)
							}
						>
							OPEN
						</span>
					</div>
				}
				placement="right"
				overlayClassName="custom-description-tooltip"
			>
				{titleEl}
			</Tooltip>
		) : (
			titleEl
		);
	};

	const SubContentTitle = ({ subItem = {} }) => {
		return (
			<>
				<span
					className={`operator-control-search-sub-content-title pointer ${
						subItem?.hasOwnProperty('isActive') && !subItem?.isActive
							? 'inactive-text'
							: ''
					}`}
					onClick={() =>
						onHandleRoute(
							subItem?.path,
							subItem?.onHandleOpenPopup,
							subItem?.sectionId
						)
					}
				>
					{subItem?.description ? (
						<Tooltip
							title={
								<span className="custom-description-tooltip-content">
									<span>
										{subItem?.description}
										{subItem?.docLink && (
											<span
												className="underline-text pointer ml-2"
												onClick={(e) => onHandleNavigate(e, subItem?.docLink)}
											>
												Read more
											</span>
										)}
									</span>
									<span
										className="custom-description-tooltip-open-btn"
										onClick={() =>
											onHandleRoute(
												subItem?.path,
												subItem?.onHandleOpenPopup,
												subItem?.sectionId
											)
										}
									>
										OPEN
									</span>
								</span>
							}
							placement="right"
							overlayClassName="custom-description-tooltip"
						>
							<span className="operator-control-search-content-title pointer">
								{highlightWithOpacity(
									subItem?.subTitle,
									subItem?.searchContent,
									false,
									subItem?.innerContent?.length
								)}
							</span>
						</Tooltip>
					) : (
						<span className="operator-control-search-content-title pointer">
							{highlightWithOpacity(
								subItem?.subTitle,
								subItem?.searchContent,
								false,
								subItem?.innerContent?.length
							)}
						</span>
					)}
				</span>
				{subItem?.hasOwnProperty('isActive') && (
					<span
						className={`fs-12 bold ${
							subItem?.isActive ? 'green-text' : 'inactive-text'
						}`}
					>
						[active : {subItem?.isActive ? 'Yes' : 'No'}]
					</span>
				)}
			</>
		);
	};

	const handleInnerPanel = (sectionKey) => {
		const prevActive = openInnerPanels[sectionKey] || false;
		setOpenInnerPanels((prev) => ({
			...(prevActive && prev),
			[sectionKey]: !prev?.[sectionKey],
		}));
	};

	const SubContentList = ({
		subContent = [],
		onHandleRoute = () => {},
		onHandleNavigate = () => {},
		openInnerPanels,
		sectionKey,
		parentKey,
	}) => (
		<div className="operator-control-search-card-details mb-3">
			<div className="search-line search-line-feature" />
			<div className="operator-control-search-sub-content d-flex flex-column">
				{subContent?.map((subItem, subIndex) => {
					const innerKey = `${sectionKey}-${parentKey}-${subIndex}`;
					const shouldOpenInner = openInnerPanels?.[innerKey];

					return (
						<React.Fragment key={subIndex}>
							<div className="d-flex gap-1 align-items-center justify-content-between">
								{subItem?.innerContent ? (
									<Collapse
										expandIcon={({ isActive }) =>
											isActive ? (
												<MinusSquareOutlined className="toggle-icon" />
											) : (
												<PlusSquareOutlined className="toggle-icon" />
											)
										}
										activeKey={shouldOpenInner ? ['1'] : []}
										className="operator-control-search-toggle-wrapper"
										onChange={() => handleInnerPanel(innerKey)}
									>
										<Collapse.Panel
											header={<SubContentTitle subItem={subItem} />}
											key="1"
										>
											{subItem?.innerContent?.length > 0 && (
												<div className="operator-control-search-card-details mb-3">
													<div className="search-line search-line-feature" />
													<div className="operator-control-search-sub-content d-flex flex-column">
														{subItem?.innerContent?.map(
															(innerItem, innerIndex) => (
																<span
																	className="operator-control-search-sub-content-title pointer"
																	key={innerIndex}
																	onClick={() =>
																		onHandleRoute(
																			innerItem?.path,
																			innerItem?.onHandleOpenPopup,
																			innerItem?.sectionId
																		)
																	}
																>
																	{innerItem?.description ? (
																		<Tooltip
																			title={
																				<span className="custom-description-tooltip-content">
																					<span>
																						{innerItem?.description}
																						{innerItem?.docLink && (
																							<span
																								className="underline-text pointer ml-2"
																								onClick={(e) =>
																									onHandleNavigate(
																										e,
																										innerItem?.docLink
																									)
																								}
																							>
																								Read more
																							</span>
																						)}
																					</span>
																					<span
																						className="custom-description-tooltip-open-btn"
																						onClick={() =>
																							onHandleRoute(
																								innerItem?.path,
																								innerItem?.onHandleOpenPopup,
																								innerItem?.sectionId
																							)
																						}
																					>
																						OPEN
																					</span>
																				</span>
																			}
																			placement="right"
																			overlayClassName="custom-description-tooltip"
																		>
																			<span className="operator-control-search-content-title pointer">
																				{highlightWithOpacity(
																					innerItem?.innerTitle,
																					innerItem?.searchContent
																				)}
																			</span>
																		</Tooltip>
																	) : (
																		<span className="operator-control-search-content-title pointer">
																			{highlightWithOpacity(
																				innerItem?.innerTitle,
																				innerItem?.searchContent
																			)}
																		</span>
																	)}
																</span>
															)
														)}
													</div>
												</div>
											)}
										</Collapse.Panel>
									</Collapse>
								) : (
									<SubContentTitle subItem={subItem} />
								)}
							</div>
						</React.Fragment>
					);
				})}
			</div>
		</div>
	);

	const handleRecentClick = (item) => {
		setSearch(item);
	};

	const getMatchedPanelKeys = useCallback(
		(contentArr = [], search = '') => {
			if (!search) return [];

			return contentArr.reduce((keys, item, idx) => {
				const hasDirectMatch = cardHasMatch(item);
				const hasSubMatch = item?.subContent?.some(cardHasMatch);
				const hasInnerMatch = item?.innerContent?.some(cardHasMatch);

				if (hasDirectMatch || hasSubMatch || hasInnerMatch) {
					keys.push(item?.title || idx);
				}

				return keys;
			}, []);
		},
		[cardHasMatch]
	);

	useEffect(() => {
		const newOpenPanels = {};
		const newInnerPanels = {};

		if (!search) {
			setOpenPanels({});
			setOpenInnerPanels({});
			return;
		}

		(displayedCategories || []).forEach(({ key }) => {
			const sections = categorySections[key] || [];

			(sections || []).forEach((section, sectionIdx) => {
				const content = section?.content || [];
				const matchedKeys = getMatchedPanelKeys(content, search);

				if (matchedKeys?.length > 0) {
					const sectionKey = section?.label || `section-${sectionIdx}`;
					newOpenPanels[sectionKey] = matchedKeys;

					(content || []).forEach((item, idx) => {
						if (
							matchedKeys?.includes(item?.title || idx) &&
							item?.subContent?.length
						) {
							(item?.subContent || []).forEach((subItem, subIdx) => {
								const hasInnerMatch = subItem?.innerContent?.some(cardHasMatch);
								if (hasInnerMatch) {
									newInnerPanels[
										`${sectionKey}-${item?.title || idx}-${subIdx}`
									] = true;
								}
							});
						}
					});
				}
			});
		});

		setOpenPanels(newOpenPanels);
		setOpenInnerPanels(newInnerPanels);
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search]);

	const handlePanelChange = (sectionKey) => (activeKey = []) => {
		const prevActive = openPanels[sectionKey] || [];
		let newActiveKeys = [];
		const isInnerPanelClose = prevActive?.some((key) => {
			return Object.keys(openInnerPanels || {})?.some((data) => {
				return data?.includes(key);
			});
		});
		if (isInnerPanelClose) {
			setOpenInnerPanels({});
		}

		if (search) {
			const isTogglingSame = prevActive?.some(
				(key) => !activeKey?.includes(key)
			);
			newActiveKeys = isTogglingSame
				? activeKey
				: [activeKey[activeKey?.length - 1]];
		} else {
			newActiveKeys =
				activeKey?.length > 1 ? [activeKey[activeKey?.length - 1]] : activeKey;
		}

		setOpenPanels((prev) => ({
			...prev,
			[sectionKey]: newActiveKeys,
		}));
	};

	return (
		<div className="operator-control-search-wrapper">
			<div className="operator-control-search-header">
				<span className="operator-control-search-title caps font-bold">
					Search exchange features & settings
				</span>
				<div className="operator-control-search-filters mt-3 w-100">
					<div className="search-filter flex-1">
						<span className="font-semibold">Search</span>
						<Input
							placeholder="Function or page name (Edit fees, balances, etc.)"
							className="operator-control-search-input"
							value={search}
							onChange={(e) => setSearch(e.target?.value)}
							allowClear
						/>
					</div>
					{recentSearches?.length > 0 && <div className="search-divider"></div>}
					{recentSearches?.length > 0 && (
						<div className="recent-search-list">
							<span className="caps">Recent Searches:</span>
							{(recentSearches || [])?.map((item, index) => (
								<span
									key={index}
									className="recent-search-item pointer"
									onClick={() => handleRecentClick(item)}
								>
									{item}
								</span>
							))}
						</div>
					)}
				</div>
			</div>

			<div className="operator-control-search-details">
				{search && (
					<div className="d-flex flex-wrap gap-1 my-3 mb-5 align-items-center">
						<span className="caps">Category:</span>
						{categories?.map((data) => {
							const isSelected =
								selectedCategory?.toLowerCase() === data?.toLowerCase();
							return (
								<span
									key={data}
									className={`caps pointer px-3 py-1 transition ${
										isSelected ? 'active-category' : 'inactive-category'
									}`}
									onClick={() => onHandleCategory(data)}
								>
									{data}
								</span>
							);
						})}
					</div>
				)}

				<div
					className={
						selectedCategory !== 'all'
							? 'operator-control-search-content-wrapper justify-content-center'
							: 'operator-control-search-content-wrapper'
					}
				>
					{displayedCategories?.map(({ key, label }) => {
						const allCards = categorySections[key]?.flatMap(
							(section) => section?.content || []
						);
						const categoryHasAnyMatch = allCards?.some(cardHasMatch);
						const isActiveCategory =
							selectedCategory?.toLowerCase() === 'common' ||
							selectedCategory?.toLowerCase() === 'trading';

						return (
							<div
								key={key}
								className={`${
									search
										? !categoryHasAnyMatch
											? 'category-cards inactive-text'
											: 'category-cards'
										: ''
								}`}
							>
								{search && <span className="category-title bold">{label}</span>}
								<div
									className={
										isActiveCategory
											? 'operator-control-common-category-cards'
											: 'operator-control-search-category-column'
									}
								>
									{categorySections[key]?.map(
										({ label: sectionLabel, content = [], icon }, idx) => {
											if (!content?.length) return null;
											const sectionHasAnyMatch = content?.some(cardHasMatch);
											const cardLevelInactive =
												search && categoryHasAnyMatch && !sectionHasAnyMatch;
											const sectionKey = sectionLabel || `section-${idx}`;
											const activeKey = openPanels[sectionKey] || [];

											return (
												<div
													className={
														cardLevelInactive
															? 'operator-control-search-cards inactive-text'
															: 'operator-control-search-cards'
													}
													key={sectionLabel || idx}
													{...(icon && {
														style: { backgroundImage: `url(${icon})` },
													})}
												>
													{sectionLabel && (
														<span className="bold card-title text-lg mb-2 tracking-wide flex items-center gap-2">
															{sectionLabel}
														</span>
													)}
													<div className="operator-control-search-card-details">
														<div className="search-line" />
														<div className="flex flex-col gap-2">
															<Collapse
																activeKey={activeKey}
																onChange={handlePanelChange(sectionKey)}
																expandIcon={({ isActive, panelKey }) => {
																	const panelItem = content?.find(
																		(item, idx) =>
																			(item?.title || idx) === panelKey
																	);
																	if (panelItem?.subContent?.length > 0) {
																		return isActive ? (
																			<MinusSquareOutlined className="toggle-icon" />
																		) : (
																			<PlusSquareOutlined className="toggle-icon" />
																		);
																	}
																}}
																className="operator-control-search-toggle-wrapper"
															>
																{content?.map((item, index) => {
																	const hasMatch = cardHasMatch(item);
																	const cardInactive =
																		search &&
																		categoryHasAnyMatch &&
																		sectionHasAnyMatch &&
																		!hasMatch;
																	const panelKey = item?.title || index;
																	return (
																		<Collapse.Panel
																			key={panelKey}
																			header={
																				<ContentTitle
																					item={item}
																					onHandleRoute={onHandleRoute}
																					onHandleNavigate={onHandleNavigate}
																					highlightWithOpacity={getHighlight(
																						cardLevelInactive || cardInactive
																					)}
																				/>
																			}
																			className={
																				!item?.subContent?.length > 0
																					? 'operator-control-search-collapse-panel'
																					: ''
																			}
																		>
																			{item?.subContent?.length > 0 && (
																				<SubContentList
																					subContent={item?.subContent}
																					onHandleRoute={onHandleRoute}
																					onHandleNavigate={onHandleNavigate}
																					openInnerPanels={openInnerPanels}
																					sectionKey={sectionKey}
																					parentKey={item?.title || idx}
																				/>
																			)}
																		</Collapse.Panel>
																	);
																})}
															</Collapse>

															{!content?.length && (
																<span className="operator-control-search-no-result">
																	No results found.
																</span>
															)}
														</div>
													</div>
												</div>
											);
										}
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	constants: state.app.constants,
	user: state.user,
	recentSearches: state.app.recentSearches,
});

const mapDispatchToProps = (dispatch) => ({
	setIsActiveAddNewUsers: bindActionCreators(setIsActiveAddNewUsers, dispatch),
	setIsActiveDeleteUser: bindActionCreators(setIsActiveDeleteUser, dispatch),
	setIsActiveFreezeUser: bindActionCreators(setIsActiveFreezeUser, dispatch),
	setIsActiveUserFeeDiscount: bindActionCreators(
		setIsActiveUserFeeDiscount,
		dispatch
	),
	setIsEmailVerifiedUser: bindActionCreators(setIsEmailVerifiedUser, dispatch),
	setIsDisabledUser2fa: bindActionCreators(setIsDisabledUser2fa, dispatch),
	setIsActiveFlagUser: bindActionCreators(setIsActiveFlagUser, dispatch),
	setIsActiveWithdrawalBlock: bindActionCreators(
		setIsActiveWithdrawalBlock,
		dispatch
	),
	setIsDisplayConsoleHead: bindActionCreators(
		setIsDisplayConsoleHead,
		dispatch
	),
	setIsDisplayConsoleBody: bindActionCreators(
		setIsDisplayConsoleBody,
		dispatch
	),
	setIsGraphicsEditMode: bindActionCreators(setIsGraphicsEditMode, dispatch),
	setIsThemesEditMode: bindActionCreators(setIsThemesEditMode, dispatch),
	setIsStringsEditMode: bindActionCreators(setIsStringsEditMode, dispatch),
	setIsDisplayCreateAsset: bindActionCreators(
		setIsDisplayCreateAsset,
		dispatch
	),
	setIsDisplayCreateOrder: bindActionCreators(
		setIsDisplayCreateOrder,
		dispatch
	),
	setIsDisplayCreateTrade: bindActionCreators(
		setIsDisplayCreateTrade,
		dispatch
	),
	setIsActiveIndependentLimit: bindActionCreators(
		setIsActiveIndependentLimit,
		dispatch
	),
	setIsActiveCollectiveLimit: bindActionCreators(
		setIsActiveCollectiveLimit,
		dispatch
	),
	setIsDisplayAddMarket: bindActionCreators(setIsDisplayAddMarket, dispatch),
	setIsDisplayCreateMarket: bindActionCreators(
		setIsDisplayCreateMarket,
		dispatch
	),
	setSelectedOrdersTab: bindActionCreators(setSelectedOrdersTab, dispatch),
	setSelectedP2pTab: bindActionCreators(setSelectedP2pTab, dispatch),
	setIsDisplayCreateReferral: bindActionCreators(
		setIsDisplayCreateReferral,
		dispatch
	),
	setIsDisplayAddPlugin: bindActionCreators(setIsDisplayAddPlugin, dispatch),
	setIsActiveFilterUser: bindActionCreators(setIsActiveFilterUser, dispatch),
	setRecentSearches: bindActionCreators(setRecentSearches, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(withConfig(OperatorControlSearch)));
