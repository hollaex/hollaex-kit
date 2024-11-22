import React from 'react';
import { isMobile } from 'react-device-detect';
import { Tooltip } from 'antd';
import { ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';

import Dialog from 'components/Dialog';
import icons from 'config/icons/dark';
import STRINGS from 'config/localizedStrings';
import { Button, EditWrapper, Image } from 'components';
import { getCountry } from 'containers/Verification/utils';
import { getFormatTimestamp } from 'utils/utils';
import { Loading } from 'containers/DigitalAssets/components/utils';

export const ConnectionPopup = ({
	isDisplayPopup,
	setIsDisplayPopup,
	pingDetails,
	setPingDetails,
	onHandleClose,
	isLoading,
	hasResponseData,
	loginDetail,
	fetchHealthData,
}) => {
	const { name } = getCountry(loginDetail?.data[0]?.country);
	const time = getFormatTimestamp(loginDetail?.data[0]?.created_at);

	const connectionDetails = [
		{
			stringId: 'STATUS',
			value: hasResponseData
				? STRINGS['CONNECTIONS.NORMAL_TEXT']
				: STRINGS['CONNECTIONS.CONNECTION_ISSUE'],
			icon: true,
		},
		{
			stringId: 'CONNECTIONS.IP',
			value: loginDetail?.data[0]?.ip,
			country: name,
		},
		{
			stringId: 'CONNECTIONS.SESSION',
			value: STRINGS['CONNECTIONS.LOGGED_IN_AT'],
			time: time,
		},
	];
	return (
		<Dialog
			isOpen={isDisplayPopup?.isDisplayConnection}
			onCloseDialog={() => onHandleClose('connection')}
			className="check-connection-popup-wrapper"
		>
			<div className="check-connection-popup-container">
				<div className="connection-title-wrapper">
					<Image
						iconId="PING_CONNECTION"
						icon={icons['PING_CONNECTION']}
						wrapperClassName="icon-logo"
					/>
					<EditWrapper stringId="CONNECTIONS.CHECK_CONNECTION">
						<span className="check-connection-text">
							{STRINGS['CONNECTIONS.CHECK_CONNECTION']}
						</span>
					</EditWrapper>
				</div>
				{connectionDetails?.map((detail, index) => (
					<div className="connection-details-container" key={index}>
						<div className="status-title">
							<EditWrapper stringId={detail?.stringId}>
								<span>{STRINGS[detail?.stringId]}:</span>
							</EditWrapper>
						</div>
						<div
							className={
								isMobile
									? 'd-flex flex-direction-column align-items-start w-75 connection-status-details'
									: 'connection-status w-100'
							}
						>
							{detail?.stringId === 'STATUS' && isLoading && (
								<span>
									<Loading index={index} />
								</span>
							)}
							<span className="connection-status">
								{detail?.stringId === 'STATUS' && !isLoading && (
									<EditWrapper stringId={detail?.value}>
										<span className="secondary-text">{detail?.value}</span>
									</EditWrapper>
								)}
								{(detail?.stringId === 'CONNECTIONS.SESSION' ||
									detail?.stringId === 'CONNECTIONS.IP') && (
									<EditWrapper stringId={detail?.value}>
										<span className="secondary-text">{detail?.value}</span>
									</EditWrapper>
								)}
								{(detail?.country || detail?.time) && (
									<span className="secondary-text">
										{detail?.country ? (
											<span>({detail?.country})</span>
										) : (
											detail?.time
										)}
									</span>
								)}
								{detail?.icon && !isLoading && (
									<span
										className={
											hasResponseData
												? 'success-icon'
												: 'success-icon danger-icon'
										}
									></span>
								)}
							</span>
							{!hasResponseData &&
								detail?.icon &&
								detail?.value === 'Connection issue' &&
								!isLoading && (
									<EditWrapper stringId="CONNECTIONS.RECONNECT">
										<div
											className="d-flex align-items-center"
											onClick={() => {
												setIsDisplayPopup((prev) => ({
													...prev,
													isDisplayConnection: false,
													isDisplayReconnect: true,
												}));
											}}
										>
											(
											<span className="blue-link text-decoration-underline fs-12">
												{STRINGS['CONNECTIONS.RECONNECT'].toUpperCase()}
											</span>
											<span className="ml-1 blue-link fs-12">
												{' '}
												<ReloadOutlined />
											</span>
											)
										</div>
									</EditWrapper>
								)}
						</div>
					</div>
				))}
				<div className="custom-line"></div>
				<div className="connection-details-container">
					<div className="status-title">
						<EditWrapper stringId="CONNECTIONS.PING">
							<span>{STRINGS['CONNECTIONS.PING']}:</span>
						</EditWrapper>
						<span className="connection-icon ml-2">
							<Tooltip
								title={STRINGS.formatString(
									STRINGS['CONNECTIONS.TOOLTIP_DESC_1'],
									<div>({STRINGS['CONNECTIONS.TOOLTIP_DESC_2']})</div>
								)}
								placement="right"
								overlayClassName="connection-tool-tip"
							>
								<ExclamationCircleOutlined />
							</Tooltip>
						</span>
					</div>
					<div
						className={
							isMobile ? 'connection-status' : 'connection-status w-100'
						}
						onClick={() => {
							setPingDetails((prev) => ({
								...prev,
								isDisplayPing: true,
							}));
							fetchHealthData();
						}}
					>
						{isLoading && pingDetails?.isDisplayPing ? (
							<EditWrapper stringId="CONNECTIONS.PING_CHECK_TEXT">
								<span className="secondary-text">
									{STRINGS['CONNECTIONS.PING_CHECK_TEXT']}
								</span>
							</EditWrapper>
						) : !pingDetails?.isDisplayPingText ? (
							<span className={isMobile && 'd-flex flex-direction-column'}>
								<div
									className={
										isMobile
											? 'd-flex flex-direction-column align-items-start'
											: 'ping-details'
									}
								>
									<span className="ping-details">
										<div className="ping-status-bar">
											<div
												className={
													pingDetails?.pingValue <= 100
														? 'fast-ping'
														: pingDetails?.pingValue > 100 &&
														  pingDetails?.pingValue <= 200
														? 'slow-ping'
														: pingDetails?.pingValue > 200 && 'very-slow-ping'
												}
											></div>
											{pingDetails?.pingValue > 100 && (
												<div
													className={
														pingDetails?.pingValue > 100 &&
														pingDetails?.pingValue <= 200
															? 'slow-ping'
															: pingDetails?.pingValue > 200 && 'very-slow-ping'
													}
												></div>
											)}
											{pingDetails?.pingValue > 200 && (
												<div
													className={
														pingDetails?.pingValue > 200 && 'very-slow-ping'
													}
												></div>
											)}
										</div>
										<EditWrapper stringId="CONNECTIOINS.MS">
											<span className="important-text">
												{STRINGS.formatString(
													STRINGS['CONNECTIONS.MS'],
													pingDetails?.pingValue
												)}
											</span>
										</EditWrapper>
										<span className="secondary-text">
											<EditWrapper
												stringId={
													pingDetails?.pingValue <= 100
														? STRINGS['CONNECTIONS.FAST']
														: pingDetails?.pingValue > 100 &&
														  pingDetails?.pingValue <= 200
														? STRINGS['CONNECTIONS.SLOW']
														: pingDetails?.pingValue > 200 &&
														  STRINGS['CONNECTIONS.VERY_SLOW']
												}
											>
												(
												<span>
													{pingDetails?.pingValue <= 100
														? STRINGS['CONNECTIONS.FAST']
														: pingDetails?.pingValue > 100 &&
														  pingDetails?.pingValue <= 200
														? STRINGS['CONNECTIONS.SLOW']
														: pingDetails?.pingValue > 200 &&
														  STRINGS['CONNECTIONS.VERY_SLOW']}
												</span>
												)
											</EditWrapper>
										</span>
									</span>
									<EditWrapper stringId="CONNECTIONS.RECHECK_PING">
										(
										<span className="blue-link text-decoration-underline">
											{STRINGS['CONNECTIONS.RECHECK_PING']}
										</span>
										)
									</EditWrapper>
								</div>
							</span>
						) : (
							<EditWrapper stringId="CONNECTIONS.CHECK_PING">
								(
								<span
									className="blue-link text-decoration-underline"
									onClick={() =>
										setPingDetails((prev) => ({
											...prev,
											isDisplayPingText: false,
										}))
									}
								>
									{STRINGS['CONNECTIONS.CHECK_PING']}
								</span>
								)
							</EditWrapper>
						)}
					</div>
				</div>
				<div className="connection-button-container">
					<Button
						className="back-btn"
						label={STRINGS['BACK']}
						onClick={() => onHandleClose('connection')}
					></Button>
					<Button
						label={STRINGS['CONNECTIONS.RECONNECT']?.toUpperCase()}
						className="reconnect-btn"
						onClick={() => {
							setIsDisplayPopup((prev) => ({
								...prev,
								isDisplayConnection: false,
								isDisplayReconnect: true,
							}));
							setPingDetails((prev) => ({
								...prev,
								isDisplayPing: false,
							}));
						}}
					></Button>
				</div>
			</div>
		</Dialog>
	);
};

export const ReconnectPopup = ({ isDisplayPopup, onHandleClose }) => {
	return (
		<Dialog
			isOpen={isDisplayPopup?.isDisplayReconnect}
			onCloseDialog={() => onHandleClose('reconnect')}
			className="reconnect-popup-wrapper"
		>
			<div className="reconnect-popup-container">
				<div className="reconnect-title-wrapper">
					<span className="reload-icon">
						<ReloadOutlined />
					</span>
					<EditWrapper stringId="CONNECTIONS.RECONNECT">
						<span className="reconnect-title">
							{STRINGS['CONNECTIONS.RECONNECT']}
						</span>
					</EditWrapper>
				</div>
				<div className="reconnect-details-container">
					<span className="reconnect-description">
						<EditWrapper stringId="CONNECTIONS.RECONNECT_DESC">
							<span>{STRINGS['CONNECTIONS.RECONNECT_DESC']}</span>
						</EditWrapper>
					</span>
					<div className="reconnect-confirmation-message">
						<EditWrapper stringId="CONNECTIONS.CONFIRM_RECONNECT_MESSAGE">
							<span>{STRINGS['CONNECTIONS.CONFIRM_RECONNECT_MESSAGE']}</span>
						</EditWrapper>
					</div>
				</div>
				<div className="connection-button-container">
					<Button
						label={STRINGS['CONNECTIONS.RECONNECT']?.toUpperCase()}
						className="reconnect-btn"
						onClick={() => {
							window.location.reload();
						}}
					></Button>
				</div>
			</div>
		</Dialog>
	);
};

export const renderConfirmSignout = (
	isVisible,
	onHandleclose,
	onHandlelogout
) => {
	return (
		<Dialog
			isOpen={isVisible}
			className="signout-confirmation-popup-wrapper"
			onCloseDialog={() => onHandleclose()}
		>
			<div className="signout-confirmation-popup-description">
				<span className="signout-title">
					<EditWrapper stringId="LOGOUT_CONFIRM_TEXT">
						{STRINGS['LOGOUT_CONFIRM_TEXT']}
					</EditWrapper>
				</span>
				<div className="signout-confirmation-button-wrapper">
					<Button
						className="cancel-btn"
						label={STRINGS['CANCEL']}
						onClick={() => onHandleclose()}
					></Button>
					<Button
						className="confirm-btn"
						label={STRINGS['CONFIRM_TEXT']}
						onClick={() => onHandlelogout()}
					></Button>
				</div>
			</div>
		</Dialog>
	);
};
