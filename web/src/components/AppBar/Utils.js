import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { browserHistory } from 'react-router';
import { Select, Tooltip } from 'antd';
import { Option } from 'antd/lib/mentions';
import {
	CaretDownOutlined,
	CaretUpOutlined,
	ExclamationCircleOutlined,
	ReloadOutlined,
} from '@ant-design/icons';

import Dialog from 'components/Dialog';
import icons from 'config/icons/dark';
import STRINGS from 'config/localizedStrings';
import { Button, Coin, EditWrapper, Image } from 'components';
import { getCountry } from 'containers/Verification/utils';
import { getFormatTimestamp, handlePopupContainer } from 'utils/utils';
import { Loading } from 'containers/DigitalAssets/components/utils';
import { updateUserSettings } from 'actions/userAction';
import { isLoggedIn } from 'utils/token';
import { generateLanguageFormValues } from 'containers/UserSettings/LanguageForm';

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
				<div className="signout-confirmation-content">
					<Image icon={icons['TAB_SIGNOUT']} wrapperClassName="sign-out-icon" />
					<span className="signout-title">
						<EditWrapper stringId="CONFIRM_TEXT">
							{STRINGS['CONFIRM_TEXT']} {STRINGS['SIGN_OUT_TEXT']}
						</EditWrapper>
					</span>
					<span className="signout-description-content">
						<EditWrapper stringId="LOGOUT_CONFIRM_TEXT">
							{STRINGS['LOGOUT_CONFIRM_TEXT']}
						</EditWrapper>
					</span>
				</div>
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

export const LanguageDisplayPopup = ({
	selected,
	valid_languages,
	changeLanguage,
	isVisible,
	onHandleClose,
	selectable_native_currencies,
	setUserData,
	user,
	isCurrency = false,
	setBaseCurrency = () => {},
	coins,
}) => {
	const currency =
		selectable_native_currencies?.length > 0
			? user?.settings?.interface?.display_currency
			: selectable_native_currencies[0];

	const [isOpen, setIsOpen] = useState(false);
	const [isDisplayCurrencyOpen, setIsDisplayCurrencyOpen] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState(selected);
	const [selectedCurrency, setSelectedCurrency] = useState(currency);
	const languageFormValue = generateLanguageFormValues(valid_languages)
		?.language?.options;

	const onHandleCurrency = async () => {
		const interfaceData = {
			...user?.settings?.interface,
			...(selectedCurrency && { display_currency: selectedCurrency }),
		};

		try {
			if (isLoggedIn()) {
				const { data } = await updateUserSettings({
					language: selectedLanguage,
					interface: interfaceData,
				});

				if (data?.settings) {
					if (!isCurrency && data?.settings?.language) {
						changeLanguage(data?.settings?.language);
					}
					if (selectedCurrency && data?.settings?.interface?.display_currency) {
						setUserData(data);
						localStorage.setItem('base_currnecy', selectedCurrency);
					}
				}
			} else {
				changeLanguage(selectedLanguage);
				setUserData(user);
				if (selectedCurrency) {
					localStorage.setItem('base_currnecy', selectedCurrency);
				}
			}
		} catch (err) {
			const _error = err.response?.data?.message || err.message;
			console.error('error', _error);
		}
	};

	const onHandleNavigate = () => {
		onHandleClose();
		return browserHistory?.push('/settings');
	};

	const onHandleConfirm = () => {
		if (isCurrency) {
			if (selectedCurrency) {
				onHandleCurrency();
				setBaseCurrency(selectedCurrency);
			}
		} else {
			onHandleCurrency();
			if (selectedCurrency) {
				setBaseCurrency(selectedCurrency);
			}
		}
		onHandleClose();
	};

	return (
		<Dialog
			isOpen={isVisible}
			onCloseDialog={() => onHandleClose()}
			className="language-popup-wrapper"
		>
			<div className="language-popup-container">
				<div className="title-container">
					<Image
						iconId={'LANGUAGE_OPTION_ICON'}
						icon={icons['LANGUAGE_OPTION_ICON']}
						wrapperClassName="icon-logo"
					/>
					<EditWrapper stringId="LANGUAGE_SWITCHER.LANGUAGE_TITLE">
						<span>
							{isCurrency
								? STRINGS['LANGUAGE_SWITCHER.DISPLAY_CURRENCY']
								: STRINGS['LANGUAGE_SWITCHER.LANGUAGE_TITLE']}
						</span>
					</EditWrapper>
				</div>
				{!isCurrency && (
					<div className="language-field w-100">
						<EditWrapper stringId="USER_SETTINGS.TITLE_LANGUAGE">
							<span className="font-weight-bold">
								{STRINGS['USER_SETTINGS.TITLE_LANGUAGE']}
							</span>
						</EditWrapper>
						<EditWrapper stringId="SETTINGS_LANGUAGE_LABEL">
							<span className="secondary-text">
								{STRINGS['SETTINGS_LANGUAGE_LABEL']}
							</span>
						</EditWrapper>
						<Select
							value={selectedLanguage}
							size="small"
							onChange={(value) => setSelectedLanguage(value)}
							bordered={false}
							suffixIcon={isOpen ? <CaretUpOutlined /> : <CaretDownOutlined />}
							className="custom-select-input-style appbar select-language-wrapper"
							dropdownClassName="custom-select-style select-option-wrapper language-select-dropdown-wrapper"
							getPopupContainer={handlePopupContainer}
							virtual={false}
							open={isOpen}
							onDropdownVisibleChange={(open) => setIsOpen(open)}
							listHeight={165}
						>
							{languageFormValue?.map(({ value, icon, label }) => (
								<Option value={value} key={value} className="capitalize">
									<div className="language_option">
										<Image
											icon={icon}
											alt={label}
											wrapperClassName="flag-icon"
										/>
										<span className="caps important-text">{label}</span>
									</div>
								</Option>
							))}
						</Select>
					</div>
				)}
				<div className="language-field w-100">
					<EditWrapper stringId="LANGUAGE_SWITCHER.DISPLAY_CURRENCY">
						<span className="font-weight-bold">
							{isCurrency
								? STRINGS['CURRENCY']
								: STRINGS['LANGUAGE_SWITCHER.DISPLAY_CURRENCY']}
						</span>
					</EditWrapper>
					<EditWrapper stringId="LANGUAGE_SWITCHER.DISPLAY_CURRENCY_DESC">
						<span className="secondary-text">
							{STRINGS['LANGUAGE_SWITCHER.DISPLAY_CURRENCY_DESC']}
						</span>
					</EditWrapper>
					<Select
						value={selectedCurrency}
						className="custom-select-input-style appbar select-language-wrapper"
						dropdownClassName="custom-select-style select-currency-wrapper"
						onChange={(value) => setSelectedCurrency(value)}
						placeholder={STRINGS['CURRENCY']}
						suffixIcon={
							isDisplayCurrencyOpen ? (
								<CaretUpOutlined />
							) : (
								<CaretDownOutlined />
							)
						}
						getPopupContainer={handlePopupContainer}
						virtual={false}
						open={isDisplayCurrencyOpen}
						onDropdownVisibleChange={(open) => setIsDisplayCurrencyOpen(open)}
						listHeight={90}
					>
						{selectable_native_currencies?.map((data) => {
							return (
								<Option key={data} value={data}>
									<Coin type="CS4" iconId={coins[data]?.icon_id} />
									<span>{coins[data]?.fullname}</span>({data?.toUpperCase()})
								</Option>
							);
						})}
					</Select>
				</div>
				<div className="mt-4">
					<EditWrapper stringId="PROFIT_LOSS.VIEW_MORE">
						{STRINGS.formatString(
							STRINGS['PROFIT_LOSS.VIEW_MORE'],
							<span
								className="blue-link text-decoration-underline"
								onClick={() => onHandleNavigate()}
							>
								{STRINGS['LANGUAGE_SWITCHER.SETTINGS']}
							</span>
						)}
					</EditWrapper>
				</div>
				<div className="button-container">
					<Button
						className="back-btn"
						label={STRINGS['BACK_TEXT']}
						onClick={() => onHandleClose()}
					></Button>
					<Button
						className="confirm-btn"
						label={STRINGS['SETTING_BUTTON']}
						onClick={() => onHandleConfirm()}
					></Button>
				</div>
			</div>
		</Dialog>
	);
};

export const renderAnnouncementMessage = (message, maxLength = 100) => {
	const announcementMessage = message?.replace(/(<([^>]+)>)/gi, ' ');
	const maxAnnouncementMessage =
		announcementMessage?.length > maxLength
			? announcementMessage?.substring(0, maxLength)?.trim() + '...'
			: announcementMessage;

	return (
		<div
			className="announcement-message-wrapper"
			dangerouslySetInnerHTML={{
				__html: maxAnnouncementMessage,
			}}
		></div>
	);
};

export const renderRemoveEmptyTag = (html) => {
	const selectedTag = document.createElement('div');
	selectedTag.innerHTML = html;

	const removeTag = selectedTag?.querySelectorAll('*:not(img)');
	removeTag &&
		removeTag.forEach((data) => {
			if (data?.innerHTML.trim() === '<br>' || data?.innerHTML === '') {
				data.remove();
			}
		});

	return selectedTag?.innerHTML;
};
