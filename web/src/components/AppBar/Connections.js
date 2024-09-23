import React, { useCallback, useEffect, useState } from 'react';
import { ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

import './_Connections.scss';
import Dialog from 'components/Dialog';
import STRINGS from 'config/localizedStrings';
import icons from 'config/icons/dark';
import { EditWrapper, Image, Button } from 'components';
import { getLogins } from 'actions/userAction';
import { getCountry } from 'containers/Verification/utils';
import { getFormatTimestamp } from 'utils/utils';
import { requestAuthenticated } from 'utils';

const INITIAL_LOGINS_STATE = {
	count: 0,
	data: [],
};

const Connections = () => {
	const [isDisplayPopup, setIsDisplayPopup] = useState({
		isDisplayConnection: false,
		isDisplayReconnect: false,
	});
	const [loginDetail, setLoginDetail] = useState(INITIAL_LOGINS_STATE);
	const [hasResponseData, setHasResponseData] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [pingDetails, setPingDetails] = useState({
		isDisplayPingText: true,
		pingValue: null,
		isDisplayPing: false,
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				await requestLogins();
				await fetchHealthData();
			} catch (error) {
				setHasResponseData(false);
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
		//eslint-disable-next-line
	}, [fetchHealthData]);

	const requestLogins = useCallback((page = 1) => {
		getLogins({ page })
			.then(({ data: { count, data } }) => {
				setLoginDetail((prevLogins) => ({
					count,
					data: prevLogins.data.concat(data),
				}));
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const fetchHealthData = async () => {
		setIsLoading(true);
		const startTime = Date.now();
		try {
			await requestAuthenticated('/health');
			setHasResponseData(true);
			const duration = Date.now() - startTime;
			setPingDetails((prev) => ({
				...prev,
				pingValue: duration,
			}));
		} catch (error) {
			setHasResponseData(false);
			console.error('Error fetching health data:', error);
		} finally {
			setIsLoading(false);
		}
	};

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

	const onHandleClose = () => {
		setIsDisplayPopup((prev) => ({
			...prev,
			isDisplayConnection: false,
		}));
		setPingDetails((prev) => ({
			...prev,
			isDisplayPing: false,
			isDisplayPingText: true,
		}));
	};

	return (
		<div className="check-connection-tab">
			<Tooltip
				title={
					<div
						className="text-align-center"
						onClick={() =>
							setIsDisplayPopup((prev) => ({
								...prev,
								isDisplayConnection: true,
							}))
						}
					>
						<div>
							<span className="tick-icon">✔</span>
							<span className="ml-1">
								{STRINGS['CONNECTIONS.STATUS_NORMAL']}
							</span>
						</div>
						<span className="text-decoration-underline">
							{STRINGS['STAKE_DETAILS.VIEW_MORE']}
						</span>
					</div>
				}
				overlayClassName="connection-status-details"
				placement="bottomRight"
			>
				<div
					className={
						hasResponseData
							? 'network-connection-icon'
							: 'network-connection-icon-danger'
					}
					onClick={() =>
						setIsDisplayPopup((prev) => ({
							...prev,
							isDisplayConnection: true,
						}))
					}
				></div>
			</Tooltip>
			<Dialog
				isOpen={isDisplayPopup?.isDisplayConnection}
				onCloseDialog={() => onHandleClose()}
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
							<div className="connection-status">
								<EditWrapper stringId={detail?.value}>
									<span className="secondary-text">{detail?.value}</span>
								</EditWrapper>
								{(detail?.country || detail?.time) && (
									<span className="secondary-text">
										{detail?.country ? (
											<span>({detail?.country})</span>
										) : (
											detail?.time
										)}
									</span>
								)}
								{detail?.icon && (
									<span
										className={
											hasResponseData
												? 'success-icon'
												: 'success-icon danger-icon'
										}
									></span>
								)}
								{!hasResponseData &&
									detail?.icon &&
									detail?.value === 'Connection issue' && (
										<EditWrapper>
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
							className="connection-status"
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
								<div className="ping-details">
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
									<span className="important-text">
										<EditWrapper stringId="CONNECTIOINS.MS">
											<span className="secondary-text">
												{STRINGS.formatString(
													STRINGS['CONNECTIONS.MS'],
													pingDetails?.pingValue
												)}
											</span>
										</EditWrapper>
									</span>
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
									<EditWrapper>
										(
										<span className="blue-link text-decoration-underline">
											{STRINGS['CONNECTIONS.RECHECK_PING']}
										</span>
										)
									</EditWrapper>
								</div>
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
							onClick={() => onHandleClose()}
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
			<Dialog
				isOpen={isDisplayPopup?.isDisplayReconnect}
				onCloseDialog={() =>
					setIsDisplayPopup((prev) => ({
						...prev,
						isDisplayReconnect: false,
					}))
				}
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
								setIsDisplayPopup((prev) => ({
									...prev,
									isDisplayConnection: true,
									isDisplayReconnect: false,
								}));
								setPingDetails((prev) => ({
									...prev,
									setIsDisplayPing: false,
								}));
								fetchHealthData();
							}}
						></Button>
					</div>
				</div>
			</Dialog>
		</div>
	);
};

export default Connections;
