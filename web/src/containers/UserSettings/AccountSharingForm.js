import React, { useState, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router';
import { isMobile } from 'react-device-detect';
import { Checkbox, Input, message, Button as AntButton } from 'antd';
import { ExclamationCircleOutlined, PauseOutlined } from '@ant-design/icons';
import moment from 'moment';
import debounce from 'lodash.debounce';

import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';
import {
	Button,
	CustomMobileTabs,
	Dialog,
	EditWrapper,
	IconTitle,
	Image,
	MobileTabBar,
	TabController,
	Table,
	Tooltip,
} from 'components';
import {
	addShareAccount,
	getSharedAccounts,
	getSharedWithAccounts,
	requestShareAccount,
	updateSharedAccount,
} from './actions';
import { isEmail } from 'validator';
import { setToken, getToken, decodeToken } from 'utils/token';

const AccountSharingForm = ({ icons: ICONS, router }) => {
	const [activeTab, setActiveTab] = useState(0);
	const [sharedData, setSharedData] = useState([]);
	const [accessedData, setAccessedData] = useState([]);

	const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);
	const [isWarningChecked, setIsWarningChecked] = useState(false);
	const [removeDialogId, setRemoveDialogId] = useState(null);
	const [sharingInfo, setSharingInfo] = useState({
		isOpen: false,
		email: '',
		label: '',
		success: false,
	});
	const [sharingDialog, setSharingDialog] = useState({ share: null, id: null });
	const [loginDialog, setLoginDialog] = useState({
		isOpen: false,
		accountData: null,
		isLoading: false,
	});

	const sharedByYouHeader = [
		{
			stringId: 'USER_VERIFICATION.TITLE_EMAIL',
			label: STRINGS?.['USER_VERIFICATION.TITLE_EMAIL'],
			renderCell: (data, key) => (
				<td
					key={key}
					className={`${
						data?.active
							? 'account-share-content share-active'
							: 'account-share-content share-inactive'
					} p-3`}
				>
					<div className="d-flex justify-content-start table_text">
						{data?.email || ''}
					</div>
				</td>
			),
			key: 'email',
		},
		{
			stringId: 'SUB_ACCOUNT_SYSTEM.NAME_LABEL_TEXT',
			label: STRINGS?.['SUB_ACCOUNT_SYSTEM.NAME_LABEL_TEXT'],
			key: 'label',
			renderCell: (data, key) => (
				<td
					key={key}
					className={`${
						data?.active
							? 'account-share-content share-active'
							: 'account-share-content share-inactive'
					} p-3`}
				>
					{data?.label}
				</td>
			),
		},
		{
			stringId: 'ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.HEADER.DATE_SHARED',
			label:
				STRINGS?.['ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.HEADER.DATE_SHARED'],
			key: 'created_at',
			renderCell: (data, key) => (
				<td
					key={key}
					className={`${
						data?.active
							? 'account-share-content share-active'
							: 'account-share-content share-inactive'
					} p-3`}
				>
					{moment(data?.created_at)?.format('DD/MM/YY')}
				</td>
			),
		},
		{
			stringId: 'P2P.STATUS',
			label: STRINGS?.['P2P.STATUS'],
			key: 'active',
			renderCell: (data, key) => (
				<td
					key={key}
					className={`${
						data?.active
							? 'account-share-content share-active'
							: 'account-share-content share-inactive'
					} p-3`}
				>
					{data?.active ? (
						<div className="d-flex flex-row active">
							<span className="sharing-status-active mt-1 mr-2"></span>
							<EditWrapper stringId="ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.DATA.STATUS.SHARING_IS_LIVE">
								{
									STRINGS?.[
										'ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.DATA.STATUS.SHARING_IS_LIVE'
									]
								}
							</EditWrapper>
						</div>
					) : (
						<div className="d-flex flex-row inactive">
							<div className="sharing-status-inactive mr-1">
								<PauseOutlined />
							</div>
							<EditWrapper stringId="ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.DATA.STATUS.SHARING_PAUSED">
								{
									STRINGS?.[
										'ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.DATA.STATUS.SHARING_PAUSED'
									]
								}
							</EditWrapper>
						</div>
					)}
				</td>
			),
		},
		{
			stringId: 'ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.HEADER.MANAGE',
			label: STRINGS?.['ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.HEADER.MANAGE'],
			key: 'manage',
			renderCell: (data, key) => (
				<td key={key} className="account-share-content share-active p-3">
					<div className="d-flex justify-content-start gap-1">
						<AntButton
							className="account-sharing-btn"
							type="link"
							onClick={() => handleShareDelete(data?.id)}
						>
							<EditWrapper stringId="ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.DATA.BUTTON.REMOVE_PERMANENTLY">
								<span className="caps">
									{
										STRINGS?.[
											'ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.DATA.BUTTON.REMOVE_PERMANENTLY'
										]
									}
								</span>
							</EditWrapper>
						</AntButton>
						{!data?.active ? (
							<AntButton
								className="account-sharing-btn"
								type="link"
								onClick={() => setSharingDialog({ share: true, id: data?.id })}
							>
								<EditWrapper stringId="ACCOUNT_SHARING.SHARE">
									<span className="caps">
										{STRINGS?.['ACCOUNT_SHARING.SHARE']}
									</span>
								</EditWrapper>
							</AntButton>
						) : (
							<AntButton
								className="account-sharing-btn"
								type="link"
								onClick={() => setSharingDialog({ share: false, id: data?.id })}
							>
								<EditWrapper stringId="ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.DATA.BUTTON.PAUSE_SHARING">
									<span className="caps">
										{
											STRINGS?.[
												'ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.DATA.BUTTON.PAUSE_SHARING'
											]
										}
									</span>
								</EditWrapper>
							</AntButton>
						)}
					</div>
				</td>
			),
		},
	];

	const sharedWithYouHeader = [
		{
			stringId: 'USER_VERIFICATION.TITLE_EMAIL',
			label: STRINGS?.['USER_VERIFICATION.TITLE_EMAIL'],
			key: 'email',
		},
		{
			stringId: 'SUB_ACCOUNT_SYSTEM.NAME_LABEL_TEXT',
			label: STRINGS?.['SUB_ACCOUNT_SYSTEM.NAME_LABEL_TEXT'],
			key: 'label',
			renderCell: (data, key) => (
				<td key={key} className="p-3">
					{data?.label}
				</td>
			),
		},
		{
			stringId: 'P2P.STATUS',
			label: STRINGS?.['P2P.STATUS'],
			key: 'active',
			renderCell: (data, key) => (
				<td
					key={key}
					className={`${
						data?.active
							? 'account-share-content share-active'
							: 'account-share-content share-inactive'
					} p-3`}
				>
					{data?.active ? (
						<div className="d-flex flex-row active">
							<span className="sharing-status-active mt-1 mr-2"></span>
							<EditWrapper stringId="ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.DATA.STATUS.SHARING_IS_LIVE">
								{
									STRINGS?.[
										'ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.DATA.STATUS.SHARING_IS_LIVE'
									]
								}
							</EditWrapper>
						</div>
					) : (
						<div className="d-flex flex-row inactive">
							<div className="sharing-status-inactive mr-1">
								<PauseOutlined />
							</div>
							<EditWrapper stringId="ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.DATA.STATUS.SHARING_PAUSED">
								{
									STRINGS?.[
										'ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.DATA.STATUS.SHARING_PAUSED'
									]
								}
							</EditWrapper>
						</div>
					)}
				</td>
			),
		},
		{
			stringId: 'DEVELOPERS_TOKEN.ACCESS',
			label: STRINGS?.['DEVELOPERS_TOKEN.ACCESS'],
			key: 'access',
			renderCell: (data, key) => (
				<td key={key} className="p-3">
					<div className="d-flex justify-content-start gap-1">
						<AntButton
							className="account-sharing-btn"
							type="link"
							disabled={!data.active}
							onClick={() =>
								setLoginDialog({ isOpen: true, accountData: data })
							}
						>
							<EditWrapper stringId="ACCOUNT_SHARING.SHARED_WITH_YOU.TABLE.LOGIN_TO_ACCOUNT">
								<span className="caps">
									{
										STRINGS?.[
											'ACCOUNT_SHARING.SHARED_WITH_YOU.TABLE.LOGIN_TO_ACCOUNT'
										]
									}
								</span>
							</EditWrapper>
						</AntButton>
					</div>
				</td>
			),
		},
	];

	const tabs = [
		{
			title: isMobile ? (
				<CustomMobileTabs
					title={STRINGS?.['ACCOUNT_SHARING.SHARED_BY_YOU.TAB_LABEL']}
				/>
			) : (
				<div className="px-3">
					<EditWrapper stringId="ACCOUNT_SHARING.SHARED_BY_YOU.TAB_LABEL">
						{STRINGS?.['ACCOUNT_SHARING.SHARED_BY_YOU.TAB_LABEL']}
					</EditWrapper>
				</div>
			),
			content: (
				<div className="settings-form-wrapper">
					<div className="settings-form d-flex flex-column p-4 px-5">
						<div className="d-flex bold">
							<EditWrapper stringId="ACCOUNT_SHARING.SHARED_BY_YOU.HEADING">
								{STRINGS?.['ACCOUNT_SHARING.SHARED_BY_YOU.HEADING']}
							</EditWrapper>
						</div>
						<div className="d-flex mt-3 flex-column justify-content-start">
							<div>
								<EditWrapper stringId="ACCOUNT_SHARING.SHARED_BY_YOU.DESCRIPTION_1">
									{STRINGS?.['ACCOUNT_SHARING.SHARED_BY_YOU.DESCRIPTION_1']}
								</EditWrapper>
							</div>
							<div className="d-flex flex-row">
								<div className="bold">
									<EditWrapper stringId="ACCOUNT_SHARING.SHARED_BY_YOU.NOTE">
										{STRINGS?.['ACCOUNT_SHARING.SHARED_BY_YOU.NOTE']}
									</EditWrapper>
								</div>
								<div className="ml-1">
									<EditWrapper stringId="ACCOUNT_SHARING.SHARED_BY_YOU.DESCRIPTION_2">
										{STRINGS?.['ACCOUNT_SHARING.SHARED_BY_YOU.DESCRIPTION_2']}
									</EditWrapper>
								</div>
							</div>
							<div className="blue-link pointer mt-2 w-fit-content">
								<EditWrapper stringId="ACCOUNT_SHARING.SHARED_BY_YOU.SHARE_ACCOUNT">
									<div
										className="text-decoration-underline"
										onClick={() => setIsWarningDialogOpen(true)}
									>
										{STRINGS?.['ACCOUNT_SHARING.SHARED_BY_YOU.SHARE_ACCOUNT']}
									</div>
								</EditWrapper>
							</div>
							<div className="account-share-table">
								<Table
									showHeaderNoData={true}
									rowClassName="p-5"
									headers={sharedByYouHeader}
									data={sharedData?.data || []}
									showAll={false}
									pageSize={10}
									count={sharedData?.count || 0}
									displayPaginator={true}
									noData={
										<div className="d-flex flex-column justify-content-center align-items-center account-no-data-wrapper">
											<IconTitle
												iconPath={
													ICONS?.['ACCOUNT_SHARING_SHARED_ACCOUNT_BY_YOU']
												}
												iconId="ACCOUNT_SHARING_SHARED_ACCOUNT_BY_YOU"
											/>
											<EditWrapper stringId="ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.NO_DATA">
												{
													STRINGS?.[
														'ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.NO_DATA'
													]
												}
											</EditWrapper>
											<div className="blue-link pointer mt-2 w-fit-content align-self-center">
												<EditWrapper stringId="ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.SHARE_YOUR_ACCOUNT">
													<div
														className="text-decoration-underline"
														onClick={() => setIsWarningDialogOpen(true)}
													>
														{
															STRINGS?.[
																'ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.SHARE_YOUR_ACCOUNT'
															]
														}
													</div>
												</EditWrapper>
											</div>
										</div>
									}
								/>
							</div>
						</div>
					</div>
				</div>
			),
		},
		{
			title: isMobile ? (
				<CustomMobileTabs
					title={STRINGS?.['ACCOUNT_SHARING.SHARED_WITH_YOU.TAB_LABEL']}
				/>
			) : (
				<div className="px-3">
					<EditWrapper stringId="ACCOUNT_SHARING.SHARED_WITH_YOU.TAB_LABEL">
						{STRINGS?.['ACCOUNT_SHARING.SHARED_WITH_YOU.TAB_LABEL']}
					</EditWrapper>
				</div>
			),
			content: (
				<div className="settings-form-wrapper pb-4">
					<div className="settings-form d-flex flex-column p-4 px-5">
						<div className="d-flex bold">
							<EditWrapper stringId="ACCOUNT_SHARING.SHARED_WITH_YOU.HEADING">
								{STRINGS?.['ACCOUNT_SHARING.SHARED_WITH_YOU.HEADING']}
							</EditWrapper>
						</div>
						<div className="d-flex mt-3 flex-column justify-content-start">
							<div className="d-flex flex-row">
								<EditWrapper stringId="ACCOUNT_SHARING.SHARED_WITH_YOU.DESCRIPTION">
									{STRINGS?.formatString(
										STRINGS?.['ACCOUNT_SHARING.SHARED_WITH_YOU.DESCRIPTION'],
										<EditWrapper stringId="ACCOUNT_SECURITY.OTP.TITLE">
											<div
												className="text-decoration-underline blue-link pointer"
												onClick={() => router.push('/security?2fa')}
											>
												{STRINGS?.['ACCOUNT_SECURITY.OTP.TITLE']}
											</div>
										</EditWrapper>
									)}
								</EditWrapper>
							</div>
							<div className="account-share-table">
								<Table
									showHeaderNoData={true}
									rowClassName="pt-2 pb-2 "
									headers={sharedWithYouHeader}
									showAll={false}
									pageSize={10}
									count={accessedData?.count}
									displayPaginator={true}
									data={accessedData?.data}
									noData={
										<div className="d-flex flex-column justify-content-center align-items-center account-no-data-wrapper">
											<IconTitle
												iconPath={
													ICONS?.['ACCOUNT_SHARING_SHARED_ACCOUNT_WITH_YOU']
												}
												iconId="ACCOUNT_SHARING_SHARED_ACCOUNT_WITH_YOU"
											/>
											<EditWrapper stringId="ACCOUNT_SHARING.SHARED_WITH_YOU.TABLE.NO_DATA">
												{
													STRINGS?.[
														'ACCOUNT_SHARING.SHARED_WITH_YOU.TABLE.NO_DATA'
													]
												}
											</EditWrapper>
										</div>
									}
								/>
							</div>
						</div>
					</div>
				</div>
			),
		},
	];

	const handleAccountInfo = useCallback(
		debounce((value, key) => {
			setSharingInfo({ ...sharingInfo, [key]: value });
		}, 100),
		[sharingInfo]
	);

	const renderContent = (tabs, activeTab = 0) => {
		return tabs[activeTab] && tabs[activeTab]?.content ? (
			tabs[activeTab]?.content
		) : (
			<div />
		);
	};

	const isSharedAccount = () => {
		try {
			const token = getToken();
			if (!token) {
				return false;
			}

			const decodedToken = decodeToken(token);
			const isShared = decodedToken?.is_sharedaccount === true;
			return isShared;
		} catch (error) {
			console.error('Error decoding token:', error);
			return false;
		}
	};

	const getAccessData = async () => {
		if (isSharedAccount()) {
			return;
		}

		try {
			const res = await getSharedWithAccounts();
			setAccessedData(res);
		} catch (err) {
			console.error(err);
		}
	};

	const getSharedData = async () => {
		try {
			const res = await getSharedAccounts();
			setSharedData(res);
		} catch (err) {
			console.error(err);
		}
	};

	const updateAccount = async (shareId, type = '') => {
		if (!type.trim().length) return;
		try {
			await updateSharedAccount({ shareId, type });
			getSharedData();
		} catch (err) {
			console.error(err);
			const errorMessage = err?.data?.message || err?.message;
			message.error(errorMessage);
		}
	};

	useEffect(() => {
		activeTab === 0
			? !isNaN(sharedData?.count) || getSharedData()
			: (!isNaN(accessedData?.count) || !isSharedAccount()) && getAccessData();

		return () => {
			handleAccountInfo.cancel();
		};
		//eslint-disable-next-line
	}, [activeTab]);

	const handleShareDelete = (index = null) => {
		if (index !== null) {
			setRemoveDialogId(index);
		}
	};

	const handleWarningProceed = () => {
		setIsWarningDialogOpen(false);
		setIsWarningChecked(false);
		setSharingInfo({ isOpen: true, email: '', label: '', success: false });
	};

	const handleWarningClose = () => {
		setIsWarningDialogOpen(false);
		setIsWarningChecked(false);
	};

	const handleSharing = (data) => {
		if (data?.active) {
			updateAccount(data?.id, 'pause');
		} else {
			updateAccount(data?.id, 'resume');
		}
		handleSharingDialogClose();
	};

	const handleSharingDialogClose = () => {
		setSharingDialog({ share: null, id: null });
	};

	const handleRemoveDialogClose = (status, data) => {
		setRemoveDialogId(null);
		if (status) {
			updateAccount(data?.id, 'delete');
		}
	};

	const handleSharingInfoBack = () => {
		setIsWarningDialogOpen(true);
		setSharingInfo({ isOpen: false, email: '', label: '', success: false });
	};

	const handleSharingInfoClose = () => {
		setSharingInfo({ isOpen: false, email: '', label: '', success: false });
	};

	const handleSharingInfoNext = async () => {
		const validateInputs =
			isEmail(sharingInfo?.email) && !!sharingInfo?.label?.length;
		if (validateInputs) {
			const detail = { email: sharingInfo?.email, label: sharingInfo?.label };
			try {
				await addShareAccount(detail);
				getSharedData();
				setSharingInfo({ ...sharingInfo, isOpen: false, success: true });
			} catch (err) {
				console.error(err);
				const errorMessage = err?.data?.message || err?.message;
				message.error(errorMessage);
			}
		}
	};

	const handleSuccessClose = () => {
		setSharingInfo({ isOpen: false, email: '', label: '', success: false });
		getSharedData();
	};

	const handleLoginClose = () => {
		setLoginDialog({ isOpen: false, accountData: null, isLoading: false });
	};

	const handleLogin = async () => {
		try {
			const accountData = loginDialog?.accountData;
			const sharedAccountId = accountData?.sharedaccount_id || accountData?.id;

			if (!sharedAccountId) {
				return;
			}

			setLoginDialog({ ...loginDialog, isLoading: true });

			const response = await requestShareAccount({
				sharedaccount_id: sharedAccountId,
			});

			if (response) {
				setToken(response?.token);
				router.push('/summary');
				window.location.reload();
			}
		} catch (err) {
			console.error(err);
			setLoginDialog({ ...loginDialog, isLoading: false });
		}
	};

	const validateInputs =
		isEmail(sharingInfo?.email) && !!sharingInfo?.label?.length;
	const enableNextBtn = sharingInfo?.email?.length && validateInputs;
	const selectedShareData = sharedData?.data?.find(
		({ id }) => id === sharingDialog?.id
	);
	const selectedRemoveData = sharedData?.data?.find(
		({ id }) => id === removeDialogId
	);
	const isShareDialogOpen =
		sharingDialog?.id !== null && sharingDialog?.share !== null;

	return (
		<div className="presentation_container apply_rtl settings_container">
			<Dialog
				isOpen={isWarningDialogOpen}
				className="account-share-warning-dialog"
				onCloseDialog={handleWarningClose}
				label="account-share-warning-dialog"
			>
				<div className="d-flex flex-column justify-content-center">
					<IconTitle
						iconPath={ICONS?.['RED_WARNING']}
						iconId="RED_WARNING"
						stringId="ACCOUNT_SHARING.IMPORTANT"
						text={
							<EditWrapper stringId="ACCOUNT_SHARING.IMPORTANT">
								<div className="h1 bold">
									{STRINGS?.['ACCOUNT_SHARING.IMPORTANT']}
								</div>
							</EditWrapper>
						}
					/>
					<EditWrapper stringId="ACCOUNT_SHARING.SHARING_YOUR_ACCOUNT">
						<div className="h1">
							{STRINGS?.['ACCOUNT_SHARING.SHARING_YOUR_ACCOUNT']}
						</div>
					</EditWrapper>
					<div className="account-share-warning-box mt-5">
						<div className="text-center">
							<EditWrapper stringId="ACCOUNT_SHARING.DESCRIPTION">
								{STRINGS?.['ACCOUNT_SHARING.DESCRIPTION']}
							</EditWrapper>
						</div>
						<div className="text-center mt-4">
							<EditWrapper stringId="ACCOUNT_SHARING.DESCRIPTION_1">
								{STRINGS?.['ACCOUNT_SHARING.DESCRIPTION_1']}
							</EditWrapper>
						</div>
						<div className="text-center mt-4">
							<EditWrapper stringId="ACCOUNT_SHARING.WARINNG_DESC">
								<span className="warning-text bold">
									{STRINGS?.['ACCOUNT_SHARING.WARINNG_DESC']}
								</span>
							</EditWrapper>
						</div>
					</div>
					<div className="text-center mt-4 flex-row">
						<Checkbox
							checked={isWarningChecked}
							onChange={(e) => setIsWarningChecked(e.target?.checked)}
						/>
						<EditWrapper stringId="ACCOUNT_SHARING.CONFORMATION_MESSAGE">
							<span
								className="ml-2 pointer"
								onClick={() => setIsWarningChecked(!isWarningChecked)}
							>
								{STRINGS?.['ACCOUNT_SHARING.CONFORMATION_MESSAGE']}
							</span>
						</EditWrapper>
					</div>
					<div className="mt-5 d-flex flex-row justify-content-between gap-2">
						<Button
							onClick={handleWarningClose}
							label={STRINGS?.['BACK_TEXT']}
							className="w-100 mx-1"
						/>
						<Button
							label={STRINGS?.['PROCEED']}
							className="w-100 mx-1"
							disabled={!isWarningChecked}
							onClick={handleWarningProceed}
						/>
					</div>
				</div>
			</Dialog>

			{!isNaN(sharingDialog?.id) && (
				<Dialog
					isOpen={isShareDialogOpen}
					onCloseDialog={handleSharingDialogClose}
					label="account-remove-dialog"
				>
					<div className="d-flex flex-column justify-content-center account-remove-dialog">
						{sharingDialog?.share ? (
							<IconTitle
								iconPath={ICONS?.['ACCOUNT_SHARING_SHARED_ACCOUNT_BY_YOU']}
								iconId="ACCOUNT_SHARING_SHARED_ACCOUNT_BY_YOU"
								stringId="ACCOUNT_SHARING.REMOVE_USER"
								text={
									<EditWrapper stringId="ACCOUNT_SHARING.SHARE_ACCOUNT_AGAIN">
										<div className="h1 bold">
											{STRINGS?.['ACCOUNT_SHARING.SHARE_ACCOUNT_AGAIN']}
										</div>
									</EditWrapper>
								}
							/>
						) : (
							<IconTitle
								iconPath={ICONS?.['ACCOUNT_SHARING_PAUSE_SHARING_ICON']}
								iconId="ACCOUNT_SHARING_PAUSE_SHARING_ICON"
								stringId="ACCOUNT_SHARING.REMOVE_USER"
								text={
									<EditWrapper stringId="ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.DATA.BUTTON.PAUSE_SHARING">
										<div className="h1 bold">
											{
												STRINGS?.[
													'ACCOUNT_SHARING.SHARED_BY_YOU.TABLE.DATA.BUTTON.PAUSE_SHARING'
												]
											}
										</div>
									</EditWrapper>
								}
							/>
						)}
						{sharingDialog?.share ? (
							<EditWrapper stringId="ACCOUNT_SHARING.SHARE_ACCOUNT_AGAIN_DESCRIPTION">
								<div className="">
									{STRINGS?.formatString(
										STRINGS?.[
											'ACCOUNT_SHARING.SHARE_ACCOUNT_AGAIN_DESCRIPTION'
										],
										<span className="bold ml-1">
											{selectedShareData?.email}
										</span>
									)}
								</div>
							</EditWrapper>
						) : (
							<EditWrapper stringId="ACCOUNT_SHARING.PAUSE_SHARING_DESCRIPTION">
								<div className="">
									{STRINGS?.formatString(
										STRINGS?.['ACCOUNT_SHARING.PAUSE_SHARING_DESCRIPTION'],
										<span className="bold ml-1">
											{selectedShareData?.email}
										</span>
									)}
								</div>
							</EditWrapper>
						)}
						<div className="mt-5 d-flex flex-row justify-content-between gap-3">
							<Button
								onClick={handleSharingDialogClose}
								label={STRINGS?.['BACK_TEXT']}
								className="w-100 mx-2"
							/>
							<Button
								onClick={() => handleSharing(selectedShareData)}
								label={
									<EditWrapper
										stringId={
											sharingDialog?.share
												? 'ACCOUNT_SHARING.SHARE'
												: 'AUTO_TRADER.PAUSE'
										}
									>
										{
											STRINGS[
												sharingDialog?.share
													? 'ACCOUNT_SHARING.SHARE'
													: 'AUTO_TRADER.PAUSE'
											]
										}
									</EditWrapper>
								}
								className="w-100 mx-2"
							/>
						</div>
					</div>
				</Dialog>
			)}

			<Dialog
				isOpen={removeDialogId !== null}
				onCloseDialog={handleRemoveDialogClose}
				label="share-account-remove-dialog"
			>
				<div className="d-flex flex-column justify-content-center account-remove-dialog">
					<IconTitle
						iconPath={ICONS?.['ACCOUNT_SHARING_REMOVE_SHARING_ICON']}
						iconId="ACCOUNT_SHARING_REMOVE_SHARING_ICON"
						stringId="ACCOUNT_SHARING.REMOVE_USER"
						text={
							<EditWrapper stringId="ACCOUNT_SHARING.REMOVE_USER">
								<div className="h1 bold">
									{STRINGS?.['ACCOUNT_SHARING.REMOVE_USER']}
								</div>
							</EditWrapper>
						}
					/>
					<EditWrapper stringId="ACCOUNT_SHARING.REMOVE_USER_DESCRIPTION">
						<div className="">
							{STRINGS?.['ACCOUNT_SHARING.REMOVE_USER_DESCRIPTION']}
						</div>
					</EditWrapper>
					<span className="text-center bold">{selectedRemoveData?.email}.</span>
					<EditWrapper stringId="ACCOUNT_SHARING.REMOVE_USER_DESCRIPTION_1">
						<div className="mt-4 text-center">
							{STRINGS?.['ACCOUNT_SHARING.REMOVE_USER_DESCRIPTION_1']}
						</div>
					</EditWrapper>
					<div className="mt-5 d-flex flex-row justify-content-between gap-3">
						<Button
							onClick={() => handleRemoveDialogClose(false)}
							label={STRINGS?.['BACK_TEXT']}
							className="w-100 mx-2"
						/>
						<Button
							onClick={() => handleRemoveDialogClose(true, selectedRemoveData)}
							label={STRINGS?.['ADDRESS_BOOK.REMOVE']}
							className="w-100 mx-2"
						/>
					</div>
				</div>
			</Dialog>

			<Dialog
				isOpen={sharingInfo?.isOpen}
				onCloseDialog={handleSharingInfoClose}
				className="account-share-info-dialog"
				label="account-share-info-dialog"
			>
				<div className="d-flex flex-column justify-content-start account-share-info">
					<div className="flex-row box-header">
						<IconTitle
							iconPath={ICONS?.['ACCOUNT_SHARING_SHARED_ACCOUNT_BY_YOU']}
							iconId="ACCOUNT_SHARING_SHARED_ACCOUNT_BY_YOU"
							stringId="ACCOUNT_SHARING.IMPORTANT"
							textType="title"
							text={
								<EditWrapper stringId="ACCOUNT_SHARING.SHARED_BY_YOU.SHARE_ACCOUNT">
									<div className="header-text">
										{STRINGS?.['ACCOUNT_SHARING.SHARED_BY_YOU.SHARE_ACCOUNT']}
									</div>
								</EditWrapper>
							}
						/>
					</div>
					<EditWrapper stringId="ACCOUNT_SHARING.SHARE_ACCOUNT_INFO_DESCRIPTION">
						{STRINGS?.['ACCOUNT_SHARING.SHARE_ACCOUNT_INFO_DESCRIPTION']}
					</EditWrapper>
					<div className="mt-5">
						<EditWrapper stringId="FORM_FIELDS.EMAIL_LABEL">
							<span className="h5">{STRINGS?.['FORM_FIELDS.EMAIL_LABEL']}</span>
						</EditWrapper>
						<Input
							type="email"
							name="email"
							className="mt-2"
							placeholder={
								STRINGS?.[
									'ACCOUNT_SHARING.SHARE_ACCOUNT_INFO_EMAIL_PLACEHOLDER'
								]
							}
							onChange={(e) => handleAccountInfo(e?.target?.value, 'email')}
						/>
					</div>
					<div className="mt-4">
						<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.NAME_LABEL_TEXT">
							<span className="h5 flex-row">
								{STRINGS?.['SUB_ACCOUNT_SYSTEM.NAME_LABEL_TEXT']}
								<span className="ml-2 pb-2">
									<Tooltip
										className="account-tab-options-tooltip"
										overlayClassName="account-tab-options-tooltip ml-2"
										text={
											STRINGS?.['ACCOUNT_SHARING.SHARE_ACCOUNT_INFO_TOOLTIP']
										}
										placement="right"
									>
										<ExclamationCircleOutlined className="account-info-name-tooltip" />
									</Tooltip>
								</span>
							</span>
						</EditWrapper>
						<Input
							className="mt-2 mb-3"
							name="label"
							type="text"
							placeholder={
								STRINGS?.['ACCOUNT_SHARING.SHARE_ACCOUNT_INFO_NAME_PLACEHOLDER']
							}
							onChange={(e) => handleAccountInfo(e?.target?.value, 'label')}
						/>
					</div>
					<div className="mt-5 d-flex flex-row justify-content-between gap-3">
						<Button
							onClick={handleSharingInfoBack}
							label={STRINGS?.['BACK_TEXT']}
							className="w-100 mx-2"
						/>
						<Button
							disabled={!enableNextBtn}
							onClick={handleSharingInfoNext}
							label={STRINGS?.['ACCOUNT_SECURITY.OTP.NEXT']}
							className="w-100 mx-2"
						/>
					</div>
				</div>
			</Dialog>

			<Dialog
				isOpen={sharingInfo?.success}
				onCloseDialog={handleSuccessClose}
				className="account-share-success-dialog"
				label="account-share-success-dialog"
			>
				<div className="d-flex flex-column justify-content-center align-items-center account-share-success-wrapper">
					<div className="sharing-complete-title-wrapper">
						<Image
							iconId="ACCOUNT_SHARING_SHARING_COMPLETE_ICON"
							icon={ICONS?.['ACCOUNT_SHARING_SHARING_COMPLETE_ICON']}
							wrapperClassName="account-share-success-icon"
						/>
						<EditWrapper stringId="ACCOUNT_SHARING.SHARE_SUCCESS_TITLE">
							<span className="bold text-center account-share-title">
								{STRINGS?.['ACCOUNT_SHARING.SHARE_SUCCESS_TITLE']}
							</span>
						</EditWrapper>
					</div>

					<div className="mt-4 text-center">
						<EditWrapper stringId="ACCOUNT_SHARING.SHARE_SUCCESS_DESCRIPTION_1">
							{STRINGS?.formatString(
								STRINGS?.['ACCOUNT_SHARING.SHARE_SUCCESS_DESCRIPTION_1'],
								<span className="bold ml-1">{sharingInfo?.email}</span>
							)}
						</EditWrapper>
					</div>
					<div className="mt-4 text-center">
						<EditWrapper stringId="ACCOUNT_SHARING.SHARE_SUCCESS_DESCRIPTION_2">
							{STRINGS?.['ACCOUNT_SHARING.SHARE_SUCCESS_DESCRIPTION_2']}
						</EditWrapper>
					</div>
					<div className="mt-5 w-100">
						<Button
							onClick={handleSuccessClose}
							label={STRINGS?.['REFERRAL_SUCCESS.BUTTON_TEXT']}
							className="w-100"
						/>
					</div>
				</div>
			</Dialog>

			<Dialog
				isOpen={loginDialog?.isOpen}
				onCloseDialog={handleLoginClose}
				className="account-share-login-dialog"
				label="account-share-login-dialog"
			>
				<div className="d-flex flex-column justify-content-center align-items-center account-share-login-wrapper">
					<IconTitle
						iconPath={ICONS?.['ACCOUNT_SHARING_SHARED_ACCOUNT_BY_YOU']}
						iconId="ACCOUNT_SHARING_SHARED_ACCOUNT_BY_YOU"
						stringId="ACCOUNT_SHARING.LOGIN_TO_SHARED_ACCOUNT"
						text={
							<EditWrapper stringId="ACCOUNT_SHARING.LOGIN_TO_SHARED_ACCOUNT">
								<span className="text-center account-share-title">
									{STRINGS?.['ACCOUNT_SHARING.LOGIN_TO_SHARED_ACCOUNT']}
								</span>
							</EditWrapper>
						}
					/>
					<div className="mt-4 text-center">
						<EditWrapper stringId="ACCOUNT_SHARING.LOGIN_DESCRIPTION">
							{STRINGS?.formatString(
								STRINGS?.['ACCOUNT_SHARING.LOGIN_DESCRIPTION'],
								<span className="bold ml-1">
									{loginDialog?.accountData?.email}
								</span>
							)}
						</EditWrapper>
					</div>
					<div className="mt-4 text-center">
						<EditWrapper stringId="ACCOUNT_SHARING.LOGIN_WARNING">
							<span className="warning-text">
								{STRINGS?.['ACCOUNT_SHARING.LOGIN_WARNING']}
							</span>
						</EditWrapper>
					</div>
					<div className="mt-5 d-flex flex-row justify-content-between gap-3 w-100">
						<Button
							onClick={handleLoginClose}
							label={STRINGS?.['BACK_TEXT']}
							className="w-100 mx-2"
							disabled={loginDialog?.isLoading}
						/>
						<Button
							onClick={handleLogin}
							label={
								loginDialog?.isLoading
									? STRINGS?.['LOADING']
									: STRINGS?.['LOGIN_TEXT']
							}
							className="w-100 mx-2"
							disabled={loginDialog?.isLoading}
						/>
					</div>
				</div>
			</Dialog>

			<IconTitle
				stringId="ACCOUNT_SHARING.TITLE"
				text={STRINGS?.['ACCOUNT_SHARING.TITLE']}
				textType="title"
				iconPath={ICONS?.['ACCOUNT_SHARING_HEADER_ICON']}
				iconId="ACCOUNT_SHARING_HEADER_ICON"
			/>
			<div className="d-flex">
				<div
					onClick={() => router.push('/settings?account')}
					className="blue-link pointer mr-2"
				>
					{`<`}
					<EditWrapper stringId="VOLUME.BACK">
						<span className="text-decoration-underline ml-1">
							{STRINGS?.['VOLUME.BACK']}
						</span>
					</EditWrapper>
				</div>
				<EditWrapper stringId="ACCOUNT_SHARING.BACK_TO_ACCOUNTS">
					{STRINGS?.['ACCOUNT_SHARING.BACK_TO_ACCOUNTS']}
				</EditWrapper>
			</div>
			<div className="mt-5">
				{!isMobile ? (
					<TabController
						activeTab={activeTab}
						setActiveTab={setActiveTab}
						tabs={tabs}
					/>
				) : (
					<MobileTabBar
						activeTab={activeTab}
						renderContent={renderContent}
						setActiveTab={setActiveTab}
						tabs={tabs}
					/>
				)}
				{!isMobile && renderContent(tabs, activeTab)}
			</div>
		</div>
	);
};

export default withRouter(withConfig(AccountSharingForm));
