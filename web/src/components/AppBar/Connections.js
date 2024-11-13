import React, { useCallback, useEffect, useState } from 'react';
import { Tooltip } from 'antd';

import './_Connections.scss';
import STRINGS from 'config/localizedStrings';
import icons from 'config/icons/dark';
import EditWrapper from 'components/EditWrapper';
import Image from 'components/Image';
import { getLogins } from 'actions/userAction';
import { requestAuthenticated } from 'utils';
import { ConnectionPopup, ReconnectPopup } from './Utils';

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
	const [toolTipKey, setToolTipKey] = useState(0);
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
	}, []);

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

	const onHandleClose = (value) => {
		if (value === 'connection') {
			setIsDisplayPopup((prev) => ({
				...prev,
				isDisplayConnection: false,
			}));
		} else {
			setIsDisplayPopup((prev) => ({
				...prev,
				isDisplayReconnect: false,
			}));
		}
		setPingDetails((prev) => ({
			...prev,
			isDisplayPing: false,
			isDisplayPingText: true,
		}));
		setToolTipKey(0);
	};

	const onHandleConnection = () => {
		if (hasResponseData) {
			setToolTipKey(toolTipKey + 1);
			setIsDisplayPopup((prev) => ({
				...prev,
				isDisplayConnection: true,
			}));
			fetchHealthData();
		} else {
			setToolTipKey(toolTipKey + 1);
			setIsDisplayPopup((prev) => ({
				...prev,
				isDisplayReconnect: true,
			}));
		}
	};

	return (
		<div className="check-connection-tab">
			<Tooltip
				key={toolTipKey}
				title={
					<div
						className="text-align-center"
						onClick={() => onHandleConnection()}
					>
						{hasResponseData ? (
							<div className="connection-normal">
								<div className="conncetion-detail d-flex align-items-center">
									<div className="circle-icon"></div>
									<span className="ml-2">
										{STRINGS['CONNECTIONS.STATUS_NORMAL']}
									</span>
								</div>
								<div className="connection-title-wrapper">
									<Image
										iconId="PING_CONNECTION"
										icon={icons['PING_CONNECTION']}
										wrapperClassName="connection-logo"
									/>
									<EditWrapper stringId="CONNECTIONS.CHECK_CONNECTION">
										<span className="check-connection-text">
											{STRINGS['CONNECTIONS.CHECK_CONNECTION']}
										</span>
									</EditWrapper>
								</div>
							</div>
						) : (
							<span className="d-flex flex-direction-column align-items-center connection-error">
								<span className="d-flex align-items-center conncetion-detail">
									<div className="circle-icon"></div>
									<span className="ml-1">
										{STRINGS['CONNECTIONS.CONNECTION_ISSUE_DETECTED']}
									</span>
								</span>
								<div className="connection-title-wrapper">
									<Image
										iconId="PING_CONNECTION"
										icon={icons['PING_CONNECTION']}
										wrapperClassName="connection-logo"
									/>
									<EditWrapper stringId="CONNECTIONS.CHECK_CONNECTION">
										<span className="check-connection-text">
											{STRINGS['CONNECTIONS.CHECK_CONNECTION']}
										</span>
									</EditWrapper>
								</div>
							</span>
						)}
					</div>
				}
				overlayClassName={
					hasResponseData
						? 'connection-status-details'
						: 'connection-status-error-details connection-status-details'
				}
				placement="bottomRight"
			>
				<div
					className="connection-icon-wrapper"
					onClick={() => onHandleConnection()}
				>
					<div
						className={
							hasResponseData
								? 'network-connection-icon'
								: 'network-connection-icon-danger'
						}
					></div>
				</div>
			</Tooltip>
			{isDisplayPopup?.isDisplayConnection && (
				<ConnectionPopup
					isDisplayPopup={isDisplayPopup}
					setIsDisplayPopup={setIsDisplayPopup}
					pingDetails={pingDetails}
					setPingDetails={setPingDetails}
					onHandleClose={onHandleClose}
					isLoading={isLoading}
					hasResponseData={hasResponseData}
					loginDetail={loginDetail}
					fetchHealthData={fetchHealthData}
				/>
			)}

			{isDisplayPopup?.isDisplayReconnect && (
				<ReconnectPopup
					isDisplayPopup={isDisplayPopup}
					onHandleClose={onHandleClose}
				/>
			)}
		</div>
	);
};

export default Connections;
