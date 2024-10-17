import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { Tooltip } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

import classnames from 'classnames';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { EditWrapper, Image } from 'components';
import { setStake } from 'actions/appActions';
import { MarketsSelector } from 'containers/Trade/utils';
import { setActiveBalanceHistory } from 'actions/walletActions';

const AppMenuBarItem = ({
	path,
	isActive,
	onClick,
	stringId,
	setSelectedStake,
	features,
	getMarkets,
	getFavourites,
	pair,
	getRemoteRoutes,
	icons,
	setActiveBalanceHistory,
}) => {
	const summaryOptions = [
		{
			icon: 'INTERFACE_OPTION_ICON',
			title: 'ACCOUNT_TEXT',
			title_2: 'SUMMARY.TITLE',
			description: 'DESKTOP_NAVIGATION.SUMMARY_DESCRIPTION',
			path: '/summary',
			isDisplay: true,
		},
		{
			icon: 'FEES_OPTION_ICON',
			title: 'FEES_AND_LIMITS.TITLE',
			description: 'DESKTOP_NAVIGATION.FEES_LIMITS_DESC',
			path: '/fees-and-limits',
			isDisplay: true,
		},
		{
			icon: 'VOLUME_OPTION_ICON',
			title: 'CHART_TEXTS.v',
			description: 'DESKTOP_NAVIGATION.VOLUME_DESC',
			path: '/wallet/volume',
			isDisplay: true,
		},
	];

	const walletOptions = [
		{
			icon: 'DEPOSIT_OPTION_ICON',
			title: 'SUMMARY.DEPOSIT',
			description: 'DESKTOP_NAVIGATION.DEPOSIT_DESC',
			path: '/wallet/deposit',
			isDisplay: true,
		},
		{
			icon: 'WALLET_OPTION_ICON',
			title: 'BALANCE_TEXT',
			description: 'DESKTOP_NAVIGATION.BALANCE_DESC',
			path: '/wallet',
			isDisplay: true,
		},
		{
			icon: 'PROFIT_LOSS_OPTION_ICON',
			title: 'MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.PERFORMANCE',
			description: 'DESKTOP_NAVIGATION.PERFORMANCE_DESC',
			path: '/wallet/history',
			isDisplay: true,
		},
		{
			icon: 'HISTORY_OPTION_ICON',
			title: 'ACCOUNTS.TAB_HISTORY',
			description: 'DESKTOP_NAVIGATION.HISTORY_DESC',
			path: '/transactions',
			isDisplay: true,
		},
		{
			icon: 'ADDRESS_OPTION_ICON',
			title: 'MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.ADDRESS_BOOK',
			description: 'DESKTOP_NAVIGATION.ADDRESS_BOOK_DESC',
			path: '/wallet/address-book',
			isDisplay: true,
		},
		{
			icon: 'WITHDRAW_OPTION_ICON',
			title: 'WITHDRAW_PAGE.WITHDRAW',
			description: 'DESKTOP_NAVIGATION.WITHDRAW_DESC',
			path: '/wallet/withdraw',
			isDisplay: true,
		},
	];

	const tradeOptions = [
		{
			icon: 'ASSET_OPTION_ICON',
			title: 'PRICE',
			description: 'DESKTOP_NAVIGATION.ASSETS_DESC',
			path: '/prices',
			isDisplay: true,
		},
		{
			icon: 'CONVERT_OPTION_ICON',
			title: 'CONVERT',
			description: 'DESKTOP_NAVIGATION.CONVERT_DESC',
			path: `/quick-trade/${pair}`,
			isDisplay: features?.quick_trade,
		},
		{
			icon: 'TRADE_OPTION_ICON',
			title: 'SUMMARY.MARKETS',
			description: 'DESKTOP_NAVIGATION.MARKET_DESC',
			path:
				getFavourites && getFavourites.length
					? `/trade/${getFavourites[0]}`
					: `/trade/${getMarkets[0]?.key}`,
			isDisplay: features?.pro_trade,
		},
		{
			icon: 'P2P_OPTION_ICON',
			title: 'P2P.TAB_P2P',
			path: '/p2p',
			description: 'MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.PEER_TO_PEER',
			description_2: 'DESKTOP_NAVIGATION.P2P_DESC',
			isDisplay: features?.p2p,
		},
	];

	const earnOptions = [
		{
			icon: 'REFERRAL_OPTION_ICON',
			title: 'SUMMARY.EARN_COMMISSION',
			description: 'DESKTOP_NAVIGATION.REFERRAL_DESC',
			path: '/referral',
			isDisplay: features?.referral_history_config,
		},
		{
			icon: 'CEFI_STAKE_OPTION_ICON',
			title: 'STAKE.CEFI_STAKING',
			description: 'DESKTOP_NAVIGATION.CEFI_STAKE_DESC',
			path: '/stake',
			isDisplay: features?.cefi_stake,
		},
		{
			icon: 'DEFI_STAKE_OPTION_ICON',
			title: 'STAKE.DEFI_STAKING',
			description: 'DESKTOP_NAVIGATION.DEFI_STAKE_DESC',
			path: '/stake',
			isDisplay: features?.stake_page,
		},
	];

	const othersOptions = getRemoteRoutes?.map((route, index) => ({
		...route,
		isDisplay: true,
	}));

	const [isIconActive, setIsIconActive] = useState(false);
	const [isToolTipVisible, setIsToolTipVisible] = useState(false);
	const [isTabActive, setIsTabActive] = useState(false);

	useEffect(() => {
		const tabOptions = getTabOptions();
		setIsTabActive(checkActiveTab(tabOptions));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [window.location.pathname]);

	const checkActiveTab = (tabOptions) => {
		const currentPath = window.location.pathname;
		return tabOptions?.some((option) => option?.path === currentPath);
	};

	const getTabOptions = () => {
		if (path === '/summary') {
			return summaryOptions;
		} else if (path === '/wallet') {
			return walletOptions;
		} else if (path === '/prices') {
			return tradeOptions;
		} else if (path === '/referral') {
			return earnOptions;
		} else {
			return othersOptions;
		}
	};

	return (
		<Tooltip
			visible={isToolTipVisible}
			title={
				<DesktopDropdown
					setSelectedStake={setSelectedStake}
					icons={icons}
					setIsIconActive={setIsIconActive}
					setIsToolTipVisible={setIsToolTipVisible}
					setActiveBalanceHistory={setActiveBalanceHistory}
					getTabOptions={getTabOptions}
				/>
			}
			overlayClassName="navigation-bar-wrapper"
			placement="bottomLeft"
			onVisibleChange={() => {
				setIsIconActive(!isIconActive);
				setIsToolTipVisible(!isToolTipVisible);
			}}
		>
			<div
				className={classnames('app-menu-bar-content d-flex text_overflow', {
					'active-menu': isActive || isTabActive,
					'active-text': isToolTipVisible,
				})}
				onClick={() => onClick(path)}
			>
				<div className="app-menu-bar-content-item d-flex text_overflow align-items-center">
					<EditWrapper stringId={stringId}>
						{STRINGS[stringId] === 'Others' && getRemoteRoutes?.length > 0 ? (
							<span>{STRINGS[stringId]}</span>
						) : STRINGS[stringId] !== 'Others' ? (
							<span>{STRINGS[stringId]}</span>
						) : null}
					</EditWrapper>
					{STRINGS[stringId] === 'Others' && getRemoteRoutes?.length > 0 ? (
						<span className="ml-1 app-bar-dropdown-icon">
							{!isIconActive ? <DownOutlined /> : <UpOutlined />}
						</span>
					) : (
						STRINGS[stringId] !== 'Others' && (
							<span className="ml-1 app-bar-dropdown-icon">
								{!isIconActive ? <DownOutlined /> : <UpOutlined />}
							</span>
						)
					)}
				</div>
			</div>
		</Tooltip>
	);
};

const DesktopDropdown = ({
	setSelectedStake,
	icons,
	setIsIconActive,
	setIsToolTipVisible,
	setActiveBalanceHistory,
	getTabOptions,
}) => {
	const [currPath, setCurrpath] = useState('/summary');
	const [isSelectedStake, setIsSelectedStake] = useState();

	useEffect(() => {
		const getCurrPage = window.location.pathname;
		setCurrpath(getCurrPage);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [window.location.pathname]);

	const onHandleRoutes = (text, value) => {
		setActiveBalanceHistory(false);
		if (text === 'STAKE.CEFI_STAKING') {
			setSelectedStake('cefi');
			setIsSelectedStake(text);
		}
		if (text === 'STAKE.DEFI_STAKING') {
			setSelectedStake('defi');
			setIsSelectedStake(text);
		}
		if (text === 'MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.PERFORMANCE') {
			setActiveBalanceHistory(true);
		}

		setIsToolTipVisible(false);
		setIsIconActive(false);
		return browserHistory?.push(value);
	};

	return (
		<div className="navigation-dropdown-container">
			{getTabOptions()?.map((options, index) => {
				const isActivePath =
					options?.title === 'STAKE.CEFI_STAKING' ||
					options?.title === 'STAKE.DEFI_STAKING'
						? isSelectedStake === options?.title && currPath === options?.path
						: currPath === options?.path;
				return (
					options?.isDisplay && (
						<div
							key={index}
							className={`${
								isActivePath
									? 'options-container main-active'
									: 'options-container'
							}`}
							onClick={() => onHandleRoutes(options?.title, options?.path)}
						>
							<Image
								icon={
									icons[
										options?.icon
											? options?.icon
											: options?.icon_id
											? STRINGS[options?.string_id] === 'Onramper'
												? 'ONRAMPER_ICON'
												: options?.icon_id
											: 'NO_ICON'
									]
								}
								wrapperClassName="filtered-option-icon"
							/>
							<div className="option-details">
								<EditWrapper stringId={options?.title}>
									<span>
										{
											STRINGS[
												options?.title ? options?.title : options?.string_id
											]
										}
									</span>
									{options?.title_2 && (
										<span className="ml-1">{STRINGS[options?.title_2]}</span>
									)}
								</EditWrapper>
								<EditWrapper stringId={options?.description}>
									<span className="secondary-text">
										{STRINGS[options?.description]}
									</span>
									{options?.description_2 && (
										<span className="secondary-text ml-1">
											{STRINGS[options?.description_2]}
										</span>
									)}
									{STRINGS[options?.string_id] === 'Buy crypto' ? (
										<span className="secondary-text">
											{STRINGS['DESKTOP_NAVIGATION.BUY_CRYPTO_DESC']}
										</span>
									) : (
										STRINGS[options?.string_id] === 'Onramper' && (
											<span className="secondary-text">
												{STRINGS['DESKTOP_NAVIGATION.ONRAMPER_DESC']}
											</span>
										)
									)}
								</EditWrapper>
							</div>
						</div>
					)
				);
			})}
		</div>
	);
};

const mapStateToProps = (state) => ({
	features: state.app.features,
	getFavourites: state.app.favourites,
	getMarkets: MarketsSelector(state),
	pair: state.app.pair,
	getRemoteRoutes: state.app.remoteRoutes,
});

const mapDispatchToProps = (dispatch) => ({
	setSelectedStake: bindActionCreators(setStake, dispatch),
	setActiveBalanceHistory: bindActionCreators(
		setActiveBalanceHistory,
		dispatch
	),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(AppMenuBarItem));
