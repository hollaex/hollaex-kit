import React, {
	useEffect,
	useState,
	useMemo,
	useCallback,
	useRef,
} from 'react';
import { withRouter } from 'react-router';
import { Input, Select, Tooltip, Button, message } from 'antd';
import {
	ArrowDownOutlined,
	ArrowUpOutlined,
	ExclamationCircleOutlined,
	EyeInvisibleOutlined,
	EyeOutlined,
} from '@ant-design/icons';

import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import ColorPicker from 'containers/Admin/ColorPicker';
import { Coin, Dialog, EditWrapper, IconTitle, Image, Table } from 'components';
import {
	createSubAccount,
	getSubAccounts,
	transferSubAccountFunds,
	switchSubAccount,
	deactivateSubAccount,
} from './actions';
import { requestUserData } from 'containers/Admin/User/actions';
import { setToken } from 'utils/token';
import { handlePopupContainer } from 'utils/utils';

const { Option } = Select;

const ACCOUNT_TYPES = [
	{ value: 'real', label: STRINGS?.['SUB_ACCOUNT_SYSTEM.REAL_EMAIL_TEXT'] },
	{ value: 'virtual', label: STRINGS?.['SUB_ACCOUNT_SYSTEM.VIRTUAL_TEXT'] },
];

const generateRandomColor = () => {
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
};

const getInitialFormData = () => ({
	accountType: 'real',
	name: '',
	colorCode: generateRandomColor(),
	email: '',
	password: '',
	confirmPassword: '',
});

const INITIAL_FORM_DATA = getInitialFormData();

const INITIAL_TRANSFER_DATA = {
	direction: 'in',
	selectedAccount: null,
	selectedAsset: '',
	amount: '',
	sourceAccount: null,
};

const INITIAL_CREATED_ACCOUNT = {
	accountType: 'real',
	email: '',
	label: '',
	color: '',
};

const SubAccountSystem = ({ icons: ICONS, coins, user, router }) => {
	const switchTimeoutRef = useRef(null);
	const [formData, setFormData] = useState(INITIAL_FORM_DATA);
	const [subAccounts, setSubAccounts] = useState([]);
	const [isCreateSubAccount, setIsCreateSubAccount] = useState(false);
	const [subAccountUser, setSubAccountUser] = useState({});
	const [isTransferDialog, setIsTransferDialog] = useState(false);
	const [isSwitchAccountDialog, setIsSwitchAccountDialog] = useState(false);
	const [isConfirmSwitchDialog, setIsConfirmSwitchDialog] = useState(false);
	const [selectedSwitchAccount, setSelectedSwitchAccount] = useState(null);
	const [isSubAccountConfirmation, setIsSubAccountConfirmation] = useState(
		false
	);
	const [createdAccountData, setCreatedAccountData] = useState(
		INITIAL_CREATED_ACCOUNT
	);
	const [transferData, setTransferData] = useState(INITIAL_TRANSFER_DATA);
	const [isDeactivateDialog, setIsDeactivateDialog] = useState(false);
	const [isDeactivatedSuccessDialog, setIsDeactivatedSuccessDialog] = useState(
		false
	);
	const [selectedDeactivateAccount, setSelectedDeactivateAccount] = useState(
		null
	);
	const [isRemainingFundsDialog, setIsRemainingFundsDialog] = useState(false);
	const [isTransferSuccessDialog, setIsTransferSuccessDialog] = useState(false);
	const [transferSuccessData, setTransferSuccessData] = useState({
		amount: '',
		asset: '',
		direction: '',
		fromAccount: '',
		toAccount: '',
	});

	const handleInputChange = useCallback((field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	}, []);

	const handleCloseDialog = useCallback(() => {
		setIsCreateSubAccount(false);
		setFormData(getInitialFormData());
	}, []);

	const handleOpenCreateSubAccount = useCallback(() => {
		setFormData(getInitialFormData());
		setIsCreateSubAccount(true);
	}, []);

	const handleColorChange = useCallback(
		(color) => handleInputChange('colorCode', color),
		[handleInputChange]
	);

	const isFormValid = useMemo(() => {
		const hasNameAndColor =
			formData?.name?.trim() && formData?.colorCode?.trim();
		const isRealAccount = formData?.accountType === 'real';

		if (isRealAccount) {
			return (
				formData?.email?.trim() &&
				formData?.password?.trim() &&
				formData?.confirmPassword?.trim() &&
				formData?.password === formData?.confirmPassword &&
				hasNameAndColor
			);
		}
		return hasNameAndColor;
	}, [formData]);

	const generatePayload = useCallback(() => {
		const isRealAccount = formData?.accountType === 'real';
		return {
			email: isRealAccount
				? formData?.email
				: formData?.email
				? `${formData?.email}_virtual`
				: '',
			password: isRealAccount ? formData?.password : undefined,
			label: formData?.name,
			virtual: !isRealAccount,
			color: formData?.colorCode,
		};
	}, [formData]);

	const fetchSubAccounts = useCallback(async () => {
		try {
			const response = await getSubAccounts();
			setSubAccounts(response ?? []);
		} catch (error) {
			message.error(error?.data?.message ?? error?.message);
		}
	}, []);

	const onHandleNext = useCallback(async () => {
		if (!isFormValid) return;

		const payload = generatePayload();
		try {
			await createSubAccount(payload);
			setIsCreateSubAccount(false);

			setCreatedAccountData({
				email: payload?.email,
				label: payload?.label,
				color: payload?.color,
				accountType: formData?.accountType === 'virtual' ? 'virtual' : 'real',
			});
			setIsSubAccountConfirmation(true);

			fetchSubAccounts();
		} catch (error) {
			message.error(error?.data?.message ?? error?.message);
		}

		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFormValid, generatePayload, formData?.accountType, fetchSubAccounts]);

	const getUser = useCallback(async () => {
		try {
			const response = await requestUserData({
				id: transferData?.selectedAccount?.id,
			});
			setSubAccountUser(response?.data ?? {});
		} catch (error) {
			console.error(error);
		}
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [transferData?.selectedAccount?.id]);

	useEffect(() => {
		fetchSubAccounts();
	}, [fetchSubAccounts]);

	useEffect(() => {
		const selectedAccount = transferData?.selectedAccount;
		const direction = transferData?.direction;
		if (isTransferDialog && selectedAccount && direction === 'out') {
			getUser();
		}
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isTransferDialog, transferData, getUser]);

	useEffect(() => {
		return () => {
			if (switchTimeoutRef.current) {
				clearTimeout(switchTimeoutRef.current);
			}
		};
	}, []);

	const handleOpenTransferDialog = useCallback(
		(direction, account) => {
			setTransferData({
				direction,
				selectedAccount: account,
				selectedAsset: '',
				amount: '',
				sourceAccount: direction === 'in' ? user : account,
			});
			setIsTransferDialog(true);
		},
		[user]
	);

	const handleCloseTransferDialog = useCallback(() => {
		setIsTransferDialog(false);
		setTransferData(INITIAL_TRANSFER_DATA);
		setSubAccountUser({});
	}, []);

	const handleTransferInputChange = useCallback((field, value) => {
		setTransferData((prev) => ({ ...prev, [field]: value }));
	}, []);

	const getAvailableBalance = useMemo(() => {
		const selectedAsset = transferData?.selectedAsset;
		const direction = transferData?.direction;
		const userBalance = user?.balance;

		if (!selectedAsset) return 0;
		const subAccountBalance = Array.isArray(subAccountUser)
			? subAccountUser?.[0]?.balance
			: subAccountUser?.balance;
		const balance = direction === 'out' ? subAccountBalance : userBalance;
		const assetBalance = balance?.[`${selectedAsset}_available`];
		return assetBalance || 0;
	}, [transferData, subAccountUser, user]);

	const isTransferFormValid = useMemo(() => {
		return (
			transferData?.selectedAccount &&
			transferData?.selectedAsset?.trim() &&
			transferData?.amount?.trim() &&
			parseFloat(transferData?.amount) > 0 &&
			getAvailableBalance > 0
		);
	}, [transferData, getAvailableBalance]);

	const handleTransferSubmit = useCallback(async () => {
		if (!isTransferFormValid) return;

		const payload = {
			subaccount_id: transferData?.selectedAccount?.id,
			currency: transferData?.selectedAsset,
			amount: parseFloat(transferData?.amount),
			direction: transferData?.direction === 'in' ? 'to_sub' : 'to_master',
		};

		try {
			await transferSubAccountFunds(payload);

			setTransferSuccessData({
				amount: transferData?.amount,
				asset: transferData?.selectedAsset,
				direction: transferData?.direction,
				fromAccount:
					transferData?.direction === 'in'
						? `${user?.email} (${STRINGS?.['SUB_ACCOUNT_SYSTEM.MAIN_ACCOUNT']})`
						: transferData?.selectedAccount?.email ||
						  transferData?.selectedAccount?.label,
				toAccount:
					transferData?.direction === 'in'
						? transferData?.selectedAccount?.email ||
						  transferData?.selectedAccount?.label
						: `${user?.email} (${STRINGS?.['SUB_ACCOUNT_SYSTEM.MAIN_ACCOUNT']})`,
			});

			handleCloseTransferDialog();
			setIsTransferSuccessDialog(true);
			fetchSubAccounts();
		} catch (error) {
			message.error(
				error?.data?.message ??
					error?.message ??
					STRINGS?.['SUB_ACCOUNT_SYSTEM.TRANSFER_FAILED']
			);
			setSubAccountUser({});
		}
	}, [
		isTransferFormValid,
		transferData,
		handleCloseTransferDialog,
		fetchSubAccounts,
		user,
	]);

	const handleOpenSwitchAccountDialog = useCallback(() => {
		setSelectedSwitchAccount(null);
		setIsSwitchAccountDialog(true);
	}, []);

	const handleCloseSwitchAccountDialog = useCallback(() => {
		setIsSwitchAccountDialog(false);
		setSelectedSwitchAccount(null);
	}, []);

	const handleNextSwitch = useCallback(() => {
		if (!selectedSwitchAccount) return;
		setIsSwitchAccountDialog(false);
		setIsConfirmSwitchDialog(true);
	}, [selectedSwitchAccount]);

	const handleCloseConfirmSwitchDialog = useCallback(() => {
		setIsConfirmSwitchDialog(false);
		setSelectedSwitchAccount(null);
	}, []);

	const handleBackToSwitchAccount = useCallback(() => {
		setIsConfirmSwitchDialog(false);
		setIsSwitchAccountDialog(true);
	}, []);

	const handleConfirmSwitch = useCallback(async () => {
		if (!selectedSwitchAccount) return;

		try {
			const response = await switchSubAccount(selectedSwitchAccount?.id);

			setIsConfirmSwitchDialog(false);
			setIsSwitchAccountDialog(false);
			setSelectedSwitchAccount(null);

			message.success(STRINGS?.['SUB_ACCOUNT_SYSTEM.SWITCH_SUCCESS']);

			switchTimeoutRef.current = setTimeout(() => {
				setToken(response?.token);
				router.push('/summary');
				window.location.reload();
			}, 500);
		} catch (error) {
			message.error(
				error?.data?.message ??
					error?.message ??
					STRINGS?.['SUB_ACCOUNT_SYSTEM.SWITCH_FAILED']
			);
			setIsConfirmSwitchDialog(false);
			setSelectedSwitchAccount(null);
		}
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSwitchAccount, router]);

	const handleCloseSubAccountCreatedDialog = useCallback(() => {
		setIsSubAccountConfirmation(false);
		setCreatedAccountData(INITIAL_CREATED_ACCOUNT);
		setFormData(getInitialFormData());
	}, []);

	const handleOpenDeactivateDialog = useCallback((account) => {
		setSelectedDeactivateAccount(account);
		setIsDeactivateDialog(true);
	}, []);

	const handleCloseDeactivateDialog = useCallback(() => {
		setIsDeactivateDialog(false);
		setSelectedDeactivateAccount(null);
	}, []);

	const handleConfirmDeactivate = useCallback(async () => {
		if (!selectedDeactivateAccount) return;

		try {
			await deactivateSubAccount(selectedDeactivateAccount?.id);

			setIsDeactivateDialog(false);
			setIsDeactivatedSuccessDialog(true);
			fetchSubAccounts();
		} catch (error) {
			const errorMessage = error?.data?.message ?? error?.message ?? '';

			if (
				errorMessage.includes('non-zero balance') ||
				errorMessage.includes('cannot be removed')
			) {
				setIsDeactivateDialog(false);
				setIsRemainingFundsDialog(true);
			} else {
				message.error(
					errorMessage || STRINGS?.['SUB_ACCOUNT_SYSTEM.DEACTIVATE_FAILED']
				);
			}
		}
	}, [selectedDeactivateAccount, fetchSubAccounts]);

	const handleCloseDeactivatedSuccessDialog = useCallback(() => {
		setIsDeactivatedSuccessDialog(false);
		setSelectedDeactivateAccount(null);
	}, []);

	const handleCloseRemainingFundsDialog = useCallback(() => {
		setIsRemainingFundsDialog(false);
		setSelectedDeactivateAccount(null);
	}, []);

	const handleTransferOutFromRemainingFunds = useCallback(() => {
		if (selectedDeactivateAccount) {
			setIsRemainingFundsDialog(false);
			handleOpenTransferDialog('out', selectedDeactivateAccount);
		}
	}, [selectedDeactivateAccount, handleOpenTransferDialog]);

	const handleCloseTransferSuccessDialog = useCallback(() => {
		setIsTransferSuccessDialog(false);
		setTransferSuccessData({
			amount: '',
			asset: '',
			direction: '',
			fromAccount: '',
			toAccount: '',
		});
	}, []);

	const handleViewHistory = useCallback(
		(direction) => {
			setIsTransferSuccessDialog(false);
			if (direction === 'in') {
				router.push('/transactions?tab=withdrawals');
			} else {
				router.push('/transactions?tab=deposits');
			}
		},
		[router]
	);

	const getAvailableAccounts = useMemo(() => {
		const accounts = [
			{
				id: user?.id,
				email: user?.email,
				label: STRINGS?.['SUB_ACCOUNT_SYSTEM.MAIN_ACCOUNT'],
				is_subaccount: false,
				accountType: 'main',
			},
		];

		if (subAccounts?.count > 0 && subAccounts?.data) {
			const subAccountsList = subAccounts?.data?.map((account) => ({
				...account,
				label: account?.label || account?.email,
			}));
			accounts.push(...subAccountsList);
		}

		return accounts;
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.id, user?.email, subAccounts]);

	const availableCoins = useMemo(() => {
		return Object.keys(coins || {}).map((key) => ({
			value: key,
			label: `${coins?.[key]?.fullname || key} (${key?.toUpperCase()})`,
			icon_id: coins?.[key]?.icon_id,
		}));
	}, [coins]);

	const handleSwitchAccountSelect = useCallback(
		(value) => {
			const account = getAvailableAccounts?.find((acc) => acc?.id === value);
			setSelectedSwitchAccount(account);
		},
		[getAvailableAccounts]
	);

	const handleSwitchAccountClick = useCallback((account) => {
		setSelectedSwitchAccount(account);
		setIsSwitchAccountDialog(true);
	}, []);

	const HEADERS = useMemo(
		() => [
			{
				stringId: 'SUB_ACCOUNT_SYSTEM.LIVE_TEXT',
				label: STRINGS?.['SUB_ACCOUNT_SYSTEM.LIVE_TEXT'],
				key: 'user_status',
				renderCell: (data, key) => {
					const isAccountActive = data?.active !== false;
					return (
						<td key={key}>
							<div className="d-flex flex-column">
								{isAccountActive ? (
									<span className="active-indicator">
										<span className="green-dot"></span>
										<span className="ml-2">
											{STRINGS?.['DEVELOPER_SECTION.ACTIVE']}
										</span>
									</span>
								) : (
									<span className="inactive-indicator">
										<span className="red-dot"></span>
										<span className="ml-2 d-flex flex-column">
											<span>{STRINGS?.['DEVELOPER_SECTION.INACTIVE']}</span>
											<span>
												(
												<span
													className="switch-account-btn blue-link underline-text pointerfs-12"
													onClick={() => handleSwitchAccountClick(data)}
												>
													{STRINGS?.['SWAP']?.toUpperCase()}
												</span>
												)
											</span>
										</span>
									</span>
								)}
							</div>
						</td>
					);
				},
			},
			{
				stringId: 'MARKETS_TABLE.TYPE',
				label: STRINGS?.['MARKETS_TABLE.TYPE'],
				key: 'type',
				renderCell: (data, key) => {
					const isVirtual = data?.email?.endsWith('_virtual');
					const accountType = !data?.is_subaccount
						? STRINGS?.['SUB_ACCOUNT_SYSTEM.MAIN_ACCOUNT']
						: isVirtual
						? STRINGS?.['SUB_ACCOUNT_SYSTEM.VIRTUAL_TEXT']
						: STRINGS?.['SUB_ACCOUNT_SYSTEM.REAL_EMAIL_TEXT'];

					return (
						<td key={key}>
							<div className="d-flex justify-content-start">{accountType}</div>
						</td>
					);
				},
			},
			{
				stringId: 'USER_VERIFICATION.TITLE_EMAIL',
				label: STRINGS?.['USER_VERIFICATION.TITLE_EMAIL'],
				key: 'email',
				renderCell: (data, key) => (
					<td key={key}>
						<div className="d-flex justify-content-start">
							{data?.email ?? STRINGS?.['NA']}
						</div>
					</td>
				),
			},
			{
				stringId: 'SUB_ACCOUNT_SYSTEM.NAME_LABEL_TEXT',
				label: STRINGS?.['SUB_ACCOUNT_SYSTEM.NAME_LABEL_TEXT'],
				key: 'label',
				renderCell: (data, key) => (
					<td key={key}>
						<div className="d-flex justify-content-start">
							{data?.is_subaccount && (data?.label ?? STRINGS?.['NA'])}
						</div>
					</td>
				),
			},
			{
				stringId: 'SUB_ACCOUNT_SYSTEM.COLOR_CODE_TEXT',
				label: STRINGS?.['SUB_ACCOUNT_SYSTEM.COLOR_CODE_TEXT'],
				key: 'color',
				renderCell: (data, key) => (
					<td key={key}>
						<div className="d-flex justify-content-start align-items-center gap-2">
							{data?.is_subaccount && data?.color && (
								<>
									<div
										className="color-code-badge"
										style={{ backgroundColor: data?.color }}
									/>
									<span className="ml-2">{data?.color}</span>
								</>
							)}
						</div>
					</td>
				),
			},
			{
				stringId: 'SUB_ACCOUNT_SYSTEM.MANAGE_TEXT',
				label: STRINGS?.['SUB_ACCOUNT_SYSTEM.MANAGE_TEXT'],
				key: 'actions',
				renderCell: (data, key) => (
					<td key={key}>
						<div className="d-flex justify-content-start gap-1">
							{data?.is_subaccount && (
								<>
									<Button
										className="transfer-btn"
										type="link"
										onClick={() => handleOpenTransferDialog('in', data)}
									>
										<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.TRANSFER_TEXT">
											<span className="caps">
												{STRINGS?.formatString(
													STRINGS?.['SUB_ACCOUNT_SYSTEM.TRANSFER_TEXT'],
													STRINGS?.['SUB_ACCOUNT_SYSTEM.IN_LABEL']
												)}
											</span>
										</EditWrapper>
									</Button>
									<Button
										className="transfer-btn"
										type="link"
										onClick={() => handleOpenTransferDialog('out', data)}
									>
										<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.TRANSFER_TEXT">
											<span className="caps">
												{STRINGS?.formatString(
													STRINGS?.['SUB_ACCOUNT_SYSTEM.TRANSFER_TEXT'],
													STRINGS?.['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.OUT']
												)}
											</span>
										</EditWrapper>
									</Button>
									<Button
										className="transfer-btn"
										type="link"
										onClick={() => handleOpenDeactivateDialog(data)}
									>
										<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.DEACTIVATE_TEXT">
											<span className="caps">
												{STRINGS?.['SUB_ACCOUNT_SYSTEM.DEACTIVATE_TEXT']}
											</span>
										</EditWrapper>
									</Button>
								</>
							)}
						</div>
					</td>
				),
			},
		],
		[
			handleOpenTransferDialog,
			handleSwitchAccountClick,
			handleOpenDeactivateDialog,
		]
	);

	const data = useMemo(() => {
		const mainAccount = {
			id: user?.id,
			email: user?.email,
			label: STRINGS?.['SUB_ACCOUNT_SYSTEM.MAIN_ACCOUNT'],
			type: STRINGS?.['SUB_ACCOUNT_SYSTEM.MAIN_ACCOUNT'],
			is_subaccount: false,
			virtual: false,
			color: null,
		};

		const subAccountsList =
			subAccounts?.count > 0 ? subAccounts?.data ?? [] : [];

		return [mainAccount, ...subAccountsList];
	}, [user, subAccounts]);

	const isVirtualAccount = createdAccountData?.accountType === 'virtual';
	const subAccountConfirmationIconId = isVirtualAccount
		? 'SUB_ACCOUNT_CONFIRMATION_ICON'
		: 'VERIFICATION_EMAIL_NEW';
	const confirmationTitleKey = isVirtualAccount
		? 'SUB_ACCOUNT_SYSTEM.ACCOUNT_CREATED_TITLE'
		: 'SUB_ACCOUNT_SYSTEM.ACCOUNT_CONFIRMATION_TITLE';

	return (
		<div className="sub-account-system-container">
			<Dialog
				isOpen={isTransferDialog}
				onCloseDialog={handleCloseTransferDialog}
				className="transfer-funds-popup"
				label="transfer-funds-dialog"
			>
				<div className="transfer-funds-wrapper">
					<div>
						<Image
							iconId="SETTING_CHAT_ICON"
							icon={ICONS?.['SETTING_CHAT_ICON']}
							wrapperClassName="transfer-funds-icon"
						/>
						<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.TRANSFER_FUNDS_TITLE">
							<span className="transfer-funds-title">
								{STRINGS?.['SUB_ACCOUNT_SYSTEM.TRANSFER_FUNDS_TITLE']}{' '}
								{transferData?.direction === 'in' ? (
									<>{STRINGS?.['SUB_ACCOUNT_SYSTEM.IN_LABEL']}</>
								) : (
									<>{STRINGS?.['SUB_ACCOUNT_SYSTEM.OUT_LABEL']}</>
								)}
							</span>
						</EditWrapper>
						<div className="mt-2">
							<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.TRANSFER_FUNDS_DESC">
								<span className="transfer-funds-desc">
									{STRINGS?.['SUB_ACCOUNT_SYSTEM.TRANSFER_FUNDS_DESC']}
								</span>
							</EditWrapper>
						</div>
					</div>

					<div className="mt-3">
						<div className="d-flex align-items-center">
							<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.TRANSFER_TEXT">
								{STRINGS?.formatString(
									STRINGS?.['SUB_ACCOUNT_SYSTEM.TRANSFER_TEXT'],
									transferData?.direction === 'out'
										? STRINGS?.['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.OUT']
										: STRINGS?.['SUB_ACCOUNT_SYSTEM.IN_LABEL']
								)}
							</EditWrapper>
						</div>
						<Input
							className="w-100 mt-2 transfer-account-input"
							value={
								transferData?.selectedAccount
									? transferData?.selectedAccount?.email ||
									  transferData?.selectedAccount?.label
									: ''
							}
							readOnly
							prefix={
								transferData?.selectedAccount?.color ? (
									<div
										className="color-code-badge"
										style={{
											backgroundColor: transferData?.selectedAccount?.color,
										}}
									/>
								) : null
							}
						/>
					</div>

					<div className="transfer-arrow-container">
						{transferData?.direction === 'out' ? (
							<ArrowDownOutlined className="transfer-arrow-icon" />
						) : (
							<ArrowUpOutlined className="transfer-arrow-icon" />
						)}
					</div>

					<div className="mt-3">
						<div className="d-flex align-items-center">
							<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.TRANSFER_TEXT">
								<span>
									{STRINGS?.formatString(
										STRINGS?.['SUB_ACCOUNT_SYSTEM.TRANSFER_TEXT'],
										transferData?.direction === 'out'
											? STRINGS?.['SUB_ACCOUNT_SYSTEM.IN_LABEL']
											: STRINGS?.['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.OUT']
									)}
								</span>
							</EditWrapper>
						</div>
						<Input
							className="w-100 mt-2 transfer-account-input"
							value={STRINGS?.['SUB_ACCOUNT_SYSTEM.MAIN_ACCOUNT']}
							readOnly
						/>
					</div>

					<div className="mt-3">
						<div className="d-flex align-items-center">
							<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.ASSET_LABEL">
								<span>
									{STRINGS?.formatString(
										STRINGS?.['SUB_ACCOUNT_SYSTEM.ASSET_LABEL'],
										transferData?.direction === 'out'
											? transferData?.selectedAccount?.label ||
													STRINGS?.['SUB_ACCOUNT_SYSTEM.SUB_ACCOUNT']
											: STRINGS?.['SUB_ACCOUNT_SYSTEM.MAIN_ACCOUNT']
									)}
								</span>
							</EditWrapper>
							<Tooltip
								title={
									<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.SELECT_ASSET_TOOLTIP">
										{STRINGS?.['SUB_ACCOUNT_SYSTEM.SELECT_ASSET_TOOLTIP']}
									</EditWrapper>
								}
								className="ml-1"
								overlayClassName="dynamic-search-description"
							>
								<ExclamationCircleOutlined />
							</Tooltip>
						</div>
						<Select
							className="w-100 mt-2 transfer-asset-field"
							getPopupContainer={(trigger) => trigger?.parentNode}
							value={transferData?.selectedAsset || undefined}
							onChange={(value) =>
								handleTransferInputChange('selectedAsset', value)
							}
							placeholder={
								STRINGS?.['SUB_ACCOUNT_SYSTEM.SELECT_ASSET_PLACEHOLDER']
							}
							showSearch
							dropdownClassName="custom-select-style select-option-wrapper transfer-select-dropdown"
						>
							{availableCoins?.map((coin) => {
								const direction = transferData?.direction;
								const balance =
									direction === 'out'
										? Array.isArray(subAccountUser)
											? subAccountUser?.[0]?.balance
											: subAccountUser?.balance
										: user?.balance;
								const assetBalance = balance?.[`${coin?.value}_available`] || 0;

								return (
									<Option
										key={coin?.value}
										value={coin?.value}
										className="transfer-asset-option"
									>
										<div className="d-flex align-items-center justify-content-between w-100">
											<div className="d-flex align-items-center gap-1">
												<div className="coin-icon">
													<Coin iconId={coin?.icon_id} type="CS4" />
												</div>
												<span>{coin?.label}</span>
											</div>
											<span className="transfer-asset-balance secondary-text">
												{assetBalance}
											</span>
										</div>
									</Option>
								);
							})}
						</Select>
					</div>

					{transferData?.selectedAsset && (
						<div className="mt-2">
							<EditWrapper stringId="AUTO_TRADER.AVAL_BALANCE">
								<span className="secondary-text">
									{STRINGS?.formatString(
										STRINGS?.['AUTO_TRADER.AVAL_BALANCE'],
										getAvailableBalance,
										transferData?.selectedAsset?.toUpperCase()
									)}
								</span>
							</EditWrapper>
						</div>
					)}

					<div className="mt-3">
						<div className="d-flex align-items-center">
							<EditWrapper stringId="AMOUNT">
								<span>{STRINGS?.['AMOUNT']}</span>
							</EditWrapper>
							<Tooltip
								title={
									<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.AMOUNT_TOOLTIP">
										{STRINGS?.['SUB_ACCOUNT_SYSTEM.AMOUNT_TOOLTIP']}
									</EditWrapper>
								}
								className="ml-1"
								overlayClassName="dynamic-search-description"
							>
								<ExclamationCircleOutlined />
							</Tooltip>
						</div>
						<Input
							className="mt-2"
							type="number"
							value={transferData?.amount || ''}
							onChange={(e) =>
								handleTransferInputChange('amount', e?.target?.value)
							}
							placeholder={STRINGS?.['SUB_ACCOUNT_SYSTEM.AMOUNT_PLACEHOLDER']}
						/>
					</div>

					<div className="transfer-funds-button-wrapper">
						<Button
							onClick={handleCloseTransferDialog}
							className="transfer-funds-cancel-btn"
						>
							<EditWrapper stringId="BACK_TEXT">
								{STRINGS?.['BACK_TEXT']}
							</EditWrapper>
						</Button>
						<Button
							type="primary"
							disabled={!isTransferFormValid}
							onClick={handleTransferSubmit}
							className="transfer-funds-submit-btn"
						>
							<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.TRANSFER_BUTTON">
								{STRINGS?.['SUB_ACCOUNT_SYSTEM.TRANSFER_BUTTON']}
							</EditWrapper>
						</Button>
					</div>
				</div>
			</Dialog>

			<Dialog
				isOpen={isCreateSubAccount}
				onCloseDialog={handleCloseDialog}
				className="create-sub-account-popup"
				label="create-sub-account-dialog"
			>
				<div className="create-sub-account-wrapper">
					<div>
						<div className="d-flex align-items-center gap-1">
							<Image
								iconId="SUB_ACCOUNT_HEADER_ICON"
								icon={ICONS?.['SUB_ACCOUNT_HEADER_ICON']}
								wrapperClassName="create-sub-account-icon"
							/>
							<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.CREATE_SUB_ACCOUNT">
								<span className="create-sub-account-title">
									{STRINGS?.['SUB_ACCOUNT_SYSTEM.CREATE_SUB_ACCOUNT']}
								</span>
							</EditWrapper>
						</div>
						<div className="mt-3">
							<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.CREATE_SUB_ACCOUNT_DESC">
								<span className="create-sub-account-desc">
									{STRINGS?.['SUB_ACCOUNT_SYSTEM.CREATE_SUB_ACCOUNT_DESC']}
								</span>
							</EditWrapper>
						</div>
					</div>

					<div className="mt-3">
						<div className="d-flex align-items-center">
							<EditWrapper stringId="MARKETS_TABLE.TYPE">
								<span>{STRINGS?.['MARKETS_TABLE.TYPE']}</span>
							</EditWrapper>
							<Tooltip
								title={STRINGS?.['SUB_ACCOUNT_SYSTEM.TYPE_DESCRIPTION']}
								className="ml-1"
								overlayClassName="dynamic-search-description"
							>
								<ExclamationCircleOutlined />
							</Tooltip>
						</div>
						<Select
							className="w-100 mt-2 create-account-type-field"
							getPopupContainer={(trigger) => trigger?.parentNode}
							value={formData?.accountType ?? undefined}
							onChange={(value) => handleInputChange('accountType', value)}
							placeholder={STRINGS?.['MARKETS_TABLE.TYPE']}
							dropdownClassName="custom-select-style select-option-wrapper"
						>
							{ACCOUNT_TYPES?.map((type) => (
								<Option key={type?.value} value={type?.value}>
									{type?.label}
								</Option>
							))}
						</Select>
					</div>

					<div className="mt-3">
						<div className="d-flex align-items-center">
							<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.NAME_LABEL_TEXT">
								<span>{STRINGS?.['SUB_ACCOUNT_SYSTEM.NAME_LABEL_TEXT']}</span>
							</EditWrapper>
							<Tooltip
								title={
									<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.NAME_TOOLTIP">
										{STRINGS?.['SUB_ACCOUNT_SYSTEM.NAME_TOOLTIP']}
									</EditWrapper>
								}
								className="ml-1"
								overlayClassName="dynamic-search-description"
							>
								<ExclamationCircleOutlined />
							</Tooltip>
						</div>
						<Input
							className="mt-2"
							value={formData?.name ?? ''}
							onChange={(e) => handleInputChange('name', e?.target?.value)}
							placeholder={STRINGS?.['SUB_ACCOUNT_SYSTEM.NAME_PLACEHOLDER']}
						/>
					</div>

					<div className="mt-3">
						<div className="d-flex align-items-center">
							<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.COLOR_CODE_TEXT">
								<span>{STRINGS?.['SUB_ACCOUNT_SYSTEM.COLOR_CODE_TEXT']}</span>
							</EditWrapper>
						</div>
						<div className="color-picker-wrapper mt-2">
							<ColorPicker
								value={formData?.colorCode ?? ''}
								onChange={handleColorChange}
							/>
						</div>
					</div>

					{formData?.accountType === 'real' && (
						<>
							<div className="mt-3">
								<div className="d-flex align-items-center">
									<EditWrapper stringId="USER_VERIFICATION.TITLE_EMAIL">
										<span>{STRINGS?.['USER_VERIFICATION.TITLE_EMAIL']}</span>
									</EditWrapper>
									<Tooltip
										title={
											<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.EMAIL_DESCRIPTION">
												{STRINGS?.['SUB_ACCOUNT_SYSTEM.EMAIL_DESCRIPTION']}
											</EditWrapper>
										}
										className="ml-1"
										overlayClassName="dynamic-search-description"
									>
										<ExclamationCircleOutlined />
									</Tooltip>
								</div>
								<Input
									className="mt-2"
									type="email"
									value={formData?.email ?? ''}
									onChange={(e) => handleInputChange('email', e?.target?.value)}
									placeholder={
										STRINGS?.['SUB_ACCOUNT_SYSTEM.EMAIL_PLACEHOLDER']
									}
								/>
							</div>
							<div className="mt-3">
								<div className="d-flex align-items-center">
									<EditWrapper stringId="FORM_FIELDS.PASSWORD_LABEL">
										<span>{STRINGS?.['FORM_FIELDS.PASSWORD_LABEL']}</span>
									</EditWrapper>
								</div>
								<Input.Password
									className="mt-2"
									value={formData?.password ?? ''}
									onChange={(e) =>
										handleInputChange('password', e?.target?.value)
									}
									placeholder={
										STRINGS?.['SUB_ACCOUNT_SYSTEM.PASSWORD_PLACEHOLDER']
									}
									iconRender={(visible) =>
										visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
									}
								/>
							</div>
							<div className="mt-3">
								<div className="d-flex gap-1 align-items-center">
									<EditWrapper stringId="FORM_FIELDS.PASSWORD_REPEAT_LABEL">
										<span>
											{STRINGS?.['FORM_FIELDS.PASSWORD_REPEAT_LABEL']}
										</span>
									</EditWrapper>
								</div>
								<Input.Password
									className="mt-2"
									value={formData?.confirmPassword ?? ''}
									onChange={(e) =>
										handleInputChange('confirmPassword', e?.target?.value)
									}
									placeholder={
										STRINGS?.['SUB_ACCOUNT_SYSTEM.CONFIRM_PASSWORD_PLACEHOLDER']
									}
									iconRender={(visible) =>
										visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
									}
								/>
							</div>
						</>
					)}

					<div className="create-sub-account-button-wrapper">
						<Button
							onClick={handleCloseDialog}
							className="create-sub-account-cancel-btn"
						>
							<EditWrapper stringId="BACK_TEXT">
								{STRINGS?.['BACK_TEXT']}
							</EditWrapper>
						</Button>
						<Button
							type="primary"
							disabled={!isFormValid}
							onClick={onHandleNext}
							className="create-sub-account-next-btn"
						>
							<EditWrapper stringId="CEFI_STAKE.NEXT_BUTTON">
								{STRINGS?.['CEFI_STAKE.NEXT_BUTTON']}
							</EditWrapper>
						</Button>
					</div>
				</div>
			</Dialog>

			<Dialog
				isOpen={isSwitchAccountDialog}
				onCloseDialog={handleCloseSwitchAccountDialog}
				className="switch-account-popup"
				label="switch-account-dialog"
			>
				<div className="switch-account-wrapper">
					<div className="d-flex align-items-center gap-1 mb-3">
						<Image
							iconId="SUB_ACCOUNT_HEADER_ICON"
							icon={ICONS?.['SUB_ACCOUNT_HEADER_ICON']}
							wrapperClassName="switch-account-icon"
						/>
						<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.SWITCH_ACCOUNT">
							<span className="switch-account-title">
								{STRINGS?.['SUB_ACCOUNT_SYSTEM.SWITCH_ACCOUNT']}
							</span>
						</EditWrapper>
					</div>

					<div className="mb-3">
						<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.CURRENTLY_ACTIVE_ACCOUNT">
							<div className="switch-account-desc mb-2">
								{STRINGS?.['SUB_ACCOUNT_SYSTEM.CURRENTLY_ACTIVE_ACCOUNT']}
							</div>
						</EditWrapper>
						<div className="current-account-info">
							<span>{user?.email}</span>
							{user?.is_subaccount ? (
								<span className="sub-account-badge">
									<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.SUB_ACCOUNT">
										({STRINGS?.['SUB_ACCOUNT_SYSTEM.SUB_ACCOUNT']})
									</EditWrapper>
								</span>
							) : (
								<span className="sub-account-badge">
									<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.SUB_ACCOUNT">
										({STRINGS?.['SUB_ACCOUNT_SYSTEM.MAIN_ACCOUNT']})
									</EditWrapper>
								</span>
							)}
						</div>
					</div>

					<div className="mb-4">
						<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.SWITCH_ACCOUNT_DESC">
							<div className="switch-account-desc mb-2">
								{STRINGS?.['SUB_ACCOUNT_SYSTEM.SWITCH_ACCOUNT_DESC']}
							</div>
						</EditWrapper>
						<Select
							className="w-100 switch-account-field"
							value={selectedSwitchAccount?.id || undefined}
							onChange={handleSwitchAccountSelect}
							placeholder={STRINGS?.['SUB_ACCOUNT_SYSTEM.SWITCH_ACCOUNT_DESC']}
							dropdownClassName="custom-select-style select-option-wrapper switch-account-dropdown"
							getPopupContainer={handlePopupContainer}
							virtual={false}
							listHeight={120}
							optionLabelProp="label"
						>
							{getAvailableAccounts?.map((account) => (
								<Option
									key={account?.id}
									value={account?.id}
									disabled={account?.id === user?.id}
									label={
										<div className="d-flex align-items-center gap-2">
											{account?.color && (
												<div
													className="color-code-badge"
													style={{ backgroundColor: account?.color }}
												/>
											)}
											<span>{account?.email}</span>
										</div>
									}
								>
									<div className="d-flex align-items-center">
										{account?.color && (
											<div
												className="color-code-badge"
												style={{ backgroundColor: account?.color }}
											/>
										)}
										<span className="secondary-text">{account?.email}</span>
									</div>
								</Option>
							))}
						</Select>
					</div>

					<div className="switch-note">
						<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.SWITCH_NOTE">
							<span className="secondary-text">
								{STRINGS?.formatString(
									STRINGS?.['AUTO_TRADER.NOTE'],
									STRINGS?.['SUB_ACCOUNT_SYSTEM.SWITCH_NOTE']
								)}
							</span>
						</EditWrapper>
					</div>

					<div className="switch-account-button-wrapper">
						<Button
							onClick={handleCloseSwitchAccountDialog}
							className="switch-account-cancel-btn"
						>
							<EditWrapper stringId="BACK_TEXT">
								{STRINGS?.['BACK_TEXT']}
							</EditWrapper>
						</Button>
						<Button
							type="primary"
							disabled={!selectedSwitchAccount}
							onClick={handleNextSwitch}
							className="switch-account-next-btn"
						>
							<EditWrapper stringId="CEFI_STAKE.NEXT_BUTTON">
								{STRINGS?.['CEFI_STAKE.NEXT_BUTTON']}
							</EditWrapper>
						</Button>
					</div>
				</div>
			</Dialog>

			<Dialog
				isOpen={isConfirmSwitchDialog}
				onCloseDialog={handleCloseConfirmSwitchDialog}
				className="confirm-switch-account-popup"
				label="confirm-switch-account-dialog"
			>
				<div className="confirm-switch-wrapper">
					<div className="mb-4">
						<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.CONFIRM_SWITCH_TITLE">
							<span className="confirm-switch-title">
								{STRINGS?.['SUB_ACCOUNT_SYSTEM.CONFIRM_SWITCH_TITLE']}
							</span>
						</EditWrapper>
					</div>

					<div className="mb-3">
						<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.CONFIRM_SWITCH_DESC">
							<span className="confirm-switch-desc">
								{STRINGS?.['SUB_ACCOUNT_SYSTEM.CONFIRM_SWITCH_DESC']}
							</span>
						</EditWrapper>
					</div>

					<div className="mb-4">
						<div className="confirm-account-info p-3">
							<div className="d-flex align-items-center">
								{selectedSwitchAccount?.color && (
									<div
										className="color-code-badge mr-3"
										style={{ backgroundColor: selectedSwitchAccount?.color }}
									/>
								)}
								<div className="d-flex flex-column">
									<span className="account-email-text">
										{selectedSwitchAccount?.email}
									</span>
									{selectedSwitchAccount?.label &&
										selectedSwitchAccount?.is_subaccount && (
											<span className="account-label-text secondary-text mt-1">
												({selectedSwitchAccount?.label})
											</span>
										)}
								</div>
							</div>
						</div>
					</div>

					<div className="confirm-switch-button-wrapper">
						<Button
							onClick={handleBackToSwitchAccount}
							className="confirm-switch-cancel-btn"
						>
							<EditWrapper stringId="BACK_TEXT">
								{STRINGS?.['BACK_TEXT']}
							</EditWrapper>
						</Button>
						<Button
							onClick={handleConfirmSwitch}
							className="confirm-switch-submit-btn"
						>
							<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.SWITCH_ACCOUNT">
								{STRINGS?.['SUB_ACCOUNT_SYSTEM.SWITCH_ACCOUNT']}
							</EditWrapper>
						</Button>
					</div>
				</div>
			</Dialog>

			<Dialog
				isOpen={isSubAccountConfirmation}
				onCloseDialog={handleCloseSubAccountCreatedDialog}
				className="sub-account-confirmation-popup"
				label="sub-account-confirmation-dialog"
			>
				<div className="sub-account-confirmation-wrapper">
					<div className="d-flex flex-column align-items-center">
						<div className="sub-account-confirmation-icon-container">
							<Image
								iconId={subAccountConfirmationIconId}
								icon={ICONS?.[subAccountConfirmationIconId]}
								wrapperClassName="sub-account-confirmation-icon"
							/>
							{isVirtualAccount && (
								<Image
									iconId="GREEN_CHECK"
									icon={ICONS?.['GREEN_CHECK']}
									wrapperClassName="success-icon"
								/>
							)}
						</div>
						<EditWrapper stringId={confirmationTitleKey}>
							<span className="sub-account-confirmation-title">
								{STRINGS?.[confirmationTitleKey]}
							</span>
						</EditWrapper>
						{!isVirtualAccount && (
							<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.ACCOUNT_CREATED_DESC_VIRTUAL">
								<div className="sub-account-confirmation-desc mt-2">
									{STRINGS?.formatString(
										STRINGS?.['SUB_ACCOUNT_SYSTEM.ACCOUNT_CONFIRMATION_DESC'],
										<span className="important-text">
											{createdAccountData?.email || ''}
										</span>
									)}
								</div>
							</EditWrapper>
						)}
					</div>

					{isVirtualAccount && createdAccountData && (
						<div className="created-account-info-box">
							<div className="account-type-label mb-2">
								{`${STRINGS?.['SUB_ACCOUNT_SYSTEM.VIRTUAL_TEXT']} ${STRINGS?.['ACCOUNT_TEXT']}`?.toUpperCase()}
							</div>
							<div className="d-flex align-items-start justify-content-center">
								{createdAccountData?.color && (
									<div
										className="color-indicator-dot mt-2"
										style={{ backgroundColor: createdAccountData?.color }}
									/>
								)}
								<div className="account-details">
									<div className="account-email-text">
										{createdAccountData?.email}
									</div>
									{createdAccountData?.label && (
										<div className="account-label-text">
											({createdAccountData?.label})
										</div>
									)}
								</div>
							</div>
						</div>
					)}

					{isVirtualAccount && (
						<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.ACCOUNT_CREATED_DESC_VIRTUAL">
							<div className="sub-account-confirmation-desc mt-3">
								{STRINGS?.['SUB_ACCOUNT_SYSTEM.ACCOUNT_CREATED_DESC_VIRTUAL']}
							</div>
						</EditWrapper>
					)}

					<div className="sub-account-confirmation-button-wrapper">
						<Button
							onClick={handleCloseSubAccountCreatedDialog}
							className="sub-account-confirmation-done-btn no-border"
						>
							<EditWrapper stringId="REFERRAL_LINK.OKAY">
								{STRINGS?.['REFERRAL_LINK.OKAY']}
							</EditWrapper>
						</Button>
					</div>
				</div>
			</Dialog>

			<Dialog
				isOpen={isDeactivateDialog}
				onCloseDialog={handleCloseDeactivateDialog}
				className="deactivate-account-popup"
				label="deactivate-account-dialog"
			>
				<div className="deactivate-account-wrapper">
					<div className="d-flex flex-column align-items-center mb-4">
						<Image
							iconId="SUB_ACCOUNT_DEACTIVATE_ICON"
							icon={ICONS?.['SUB_ACCOUNT_DEACTIVATE_ICON']}
							wrapperClassName="deactivate-account-icon"
						/>
						<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.DEACTIVATE_SUB_ACCOUNT_TITLE">
							<span className="deactivate-account-title">
								{STRINGS?.['SUB_ACCOUNT_SYSTEM.DEACTIVATE_SUB_ACCOUNT_TITLE']}
							</span>
						</EditWrapper>
						<div className="deactivate-account-desc mt-2">
							<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.DEACTIVATE_SUB_ACCOUNT_DESC">
								{STRINGS?.['SUB_ACCOUNT_SYSTEM.DEACTIVATE_SUB_ACCOUNT_DESC']}
							</EditWrapper>
						</div>
					</div>

					{selectedDeactivateAccount && (
						<div className="deactivate-account-info-box mb-3">
							<div className="account-type-label mb-2">
								{selectedDeactivateAccount?.email?.endsWith('_virtual')
									? `${STRINGS?.['SUB_ACCOUNT_SYSTEM.VIRTUAL_TEXT']} ${STRINGS?.['SUB_ACCOUNT_SYSTEM.SUB_ACCOUNT']}`?.toUpperCase()
									: `${STRINGS?.['SUB_ACCOUNT_SYSTEM.REAL_EMAIL_TEXT']} ${STRINGS?.['SUB_ACCOUNT_SYSTEM.SUB_ACCOUNT']}`?.toUpperCase()}
							</div>
							<div className="d-flex align-items-start">
								<span
									className="mt-1 color-icon"
									style={{ backgroundColor: selectedDeactivateAccount?.color }}
								></span>
								<div className="ml-2">
									<div className="account-email-text">
										{selectedDeactivateAccount?.email}
									</div>
									{selectedDeactivateAccount?.label && (
										<div className="account-label-text secondary-text">
											({selectedDeactivateAccount?.label})
										</div>
									)}
								</div>
							</div>
						</div>
					)}

					<div className="deactivate-account-warning text-center">
						<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.DEACTIVATE_ACCOUNT_WARNING">
							{STRINGS?.['SUB_ACCOUNT_SYSTEM.DEACTIVATE_ACCOUNT_WARNING']}
						</EditWrapper>
					</div>

					<div className="deactivate-account-button-wrapper mt-5">
						<Button
							onClick={handleCloseDeactivateDialog}
							className="deactivate-account-cancel-btn no-border"
						>
							<EditWrapper stringId="BACK_TEXT">
								{STRINGS?.['BACK_TEXT']}
							</EditWrapper>
						</Button>
						<Button
							onClick={handleConfirmDeactivate}
							className="deactivate-account-submit-btn no-border"
						>
							<EditWrapper stringId="CEFI_STAKE.CONFIRM_BUTTON">
								{STRINGS?.['CEFI_STAKE.CONFIRM_BUTTON']}
							</EditWrapper>
						</Button>
					</div>
				</div>
			</Dialog>

			<Dialog
				isOpen={isDeactivatedSuccessDialog}
				onCloseDialog={handleCloseDeactivatedSuccessDialog}
				className="deactivated-success-popup"
				label="deactivated-success-dialog"
			>
				<div className="deactivated-success-wrapper">
					<div className="d-flex flex-column align-items-center">
						<Image
							iconId="SUB_ACCOUNT_DEACTIVATE_ICON"
							icon={ICONS?.['SUB_ACCOUNT_DEACTIVATE_ICON']}
							wrapperClassName="deactivated-success-icon"
						/>
						<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.ACCOUNT_DEACTIVATED_TITLE">
							<span className="deactivated-success-title">
								{STRINGS?.['SUB_ACCOUNT_SYSTEM.ACCOUNT_DEACTIVATED_TITLE']}
							</span>
						</EditWrapper>
						<div className="deactivated-success-desc text-center mt-3 mb-4 secondary-text">
							<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.ACCOUNT_DEACTIVATED_DESC">
								{STRINGS?.formatString(
									STRINGS?.['SUB_ACCOUNT_SYSTEM.ACCOUNT_DEACTIVATED_DESC'],
									<span className="important-text">
										{selectedDeactivateAccount?.email}
									</span>
								)}
							</EditWrapper>
						</div>
					</div>

					<div className="deactivated-success-button-wrapper">
						<Button
							onClick={handleCloseDeactivatedSuccessDialog}
							className="deactivated-success-btn no-border"
						>
							<EditWrapper stringId="REFERRAL_LINK.OKAY">
								{STRINGS?.['REFERRAL_LINK.OKAY']}
							</EditWrapper>
						</Button>
					</div>
				</div>
			</Dialog>

			<Dialog
				isOpen={isRemainingFundsDialog}
				onCloseDialog={handleCloseRemainingFundsDialog}
				className="remaining-funds-popup"
				label="remaining-funds-dialog"
			>
				<div className="remaining-funds-wrapper">
					<div className="mb-4">
						<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.REMAINING_FUNDS_TITLE">
							<span className="remaining-funds-title">
								{STRINGS?.['SUB_ACCOUNT_SYSTEM.REMAINING_FUNDS_TITLE']}
							</span>
						</EditWrapper>
					</div>

					{selectedDeactivateAccount && (
						<div className="remaining-funds-account-info mb-3">
							<div className="d-flex align-items-center gap-2">
								{selectedDeactivateAccount?.color && (
									<div
										className="color-code-badge"
										style={{
											backgroundColor: selectedDeactivateAccount?.color,
										}}
									/>
								)}
								<span className="account-email-text">
									{selectedDeactivateAccount?.email}
								</span>
							</div>
						</div>
					)}

					<div className="remaining-funds-desc mb-4">
						<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.REMAINING_FUNDS_DESC">
							<span className="secondary-text">
								{STRINGS?.['SUB_ACCOUNT_SYSTEM.REMAINING_FUNDS_DESC']}
							</span>
						</EditWrapper>
					</div>

					<div className="remaining-funds-button-wrapper">
						<Button
							onClick={handleCloseRemainingFundsDialog}
							className="remaining-funds-back-btn no-border"
						>
							<EditWrapper stringId="BACK_TEXT">
								{STRINGS?.['BACK_TEXT']}
							</EditWrapper>
						</Button>
						<Button
							onClick={handleTransferOutFromRemainingFunds}
							className="remaining-funds-transfer-btn"
						>
							<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.TRANSFER_OUT_BUTTON">
								{STRINGS?.[
									'SUB_ACCOUNT_SYSTEM.TRANSFER_OUT_BUTTON'
								]?.toUpperCase()}
							</EditWrapper>
						</Button>
					</div>
				</div>
			</Dialog>

			<Dialog
				isOpen={isTransferSuccessDialog}
				onCloseDialog={handleCloseTransferSuccessDialog}
				className="transfer-success-popup"
				label="transfer-success-dialog"
			>
				<div className="transfer-success-wrapper">
					<div className="d-flex flex-column align-items-center">
						<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.TRANSFER_SUCCESS_TITLE">
							<span className="transfer-success-title">
								{STRINGS?.['SUB_ACCOUNT_SYSTEM.TRANSFER_SUCCESS_TITLE']}
							</span>
						</EditWrapper>
						<div className="transfer-success-desc text-center mt-2 mb-4">
							<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.TRANSFER_SUCCESS_DESC">
								{STRINGS?.formatString(
									STRINGS?.['SUB_ACCOUNT_SYSTEM.TRANSFER_SUCCESS_DESC'],
									transferSuccessData?.amount,
									<span className="d-inline-flex align-items-end">
										<span className="coin-icon mr-1">
											<Coin
												iconId={coins?.[transferSuccessData?.asset]?.icon_id}
												type="CS6"
											/>
										</span>
										{transferSuccessData?.asset?.toUpperCase()}
									</span>,
									transferSuccessData?.fromAccount,
									transferSuccessData?.toAccount
								)}
							</EditWrapper>
						</div>
					</div>

					<div className="transfer-success-button-wrapper">
						<Button
							onClick={handleCloseTransferSuccessDialog}
							className="transfer-success-okay-btn"
						>
							<EditWrapper stringId="REFERRAL_LINK.OKAY">
								{STRINGS?.['REFERRAL_LINK.OKAY']}
							</EditWrapper>
						</Button>
						<Button
							onClick={() => handleViewHistory(transferSuccessData?.direction)}
							className="transfer-success-history-btn"
						>
							<EditWrapper stringId="DUST.SUCCESSFUL.VIEW_HISTORY">
								{STRINGS?.['DUST.SUCCESSFUL.VIEW_HISTORY']?.toUpperCase()}
							</EditWrapper>
						</Button>
					</div>
				</div>
			</Dialog>

			<IconTitle
				stringId="SUB_ACCOUNT_SYSTEM.SUB_ACCOUNT_TITLE"
				text={STRINGS?.['SUB_ACCOUNT_SYSTEM.SUB_ACCOUNT_TITLE']}
				textType="title"
				iconPath={ICONS?.['SUB_ACCOUNT_HEADER_ICON']}
				iconId="SUB_ACCOUNT_HEADER_ICON"
			/>
			<div className="mt-2">
				<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.SUB_ACCOUNT_DESC">
					{STRINGS?.['SUB_ACCOUNT_SYSTEM.SUB_ACCOUNT_DESC']}
				</EditWrapper>
			</div>

			<div className="sub-account-button-wrapper mt-3 d-flex align-items-center">
				<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.CREATE_SUB_ACCOUNT">
					<span
						className="blue-link pointer"
						onClick={handleOpenCreateSubAccount}
					>
						{STRINGS?.['SUB_ACCOUNT_SYSTEM.CREATE_SUB_ACCOUNT']}
					</span>
				</EditWrapper>
				<span className="divider"></span>
				<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.SWITCH_ACCOUNT">
					<span
						className="blue-link pointer"
						onClick={handleOpenSwitchAccountDialog}
					>
						{STRINGS?.['SUB_ACCOUNT_SYSTEM.SWITCH_ACCOUNT']}
					</span>
				</EditWrapper>
			</div>

			<div className="sub-account-table-wrapper mt-4">
				{data?.length === 0 ? (
					<div className="d-flex justify-content-center align-items-center p-5">
						<EditWrapper stringId="SUB_ACCOUNT_SYSTEM.NO_SUB_ACCOUNTS">
							<span className="secondary-text">
								{STRINGS?.['SUB_ACCOUNT_SYSTEM.NO_SUB_ACCOUNTS']}
							</span>
						</EditWrapper>
					</div>
				) : (
					<Table
						showHeaderNoData
						headers={HEADERS}
						rowKey={(item) => item?.id}
						data={data ?? []}
						count={data?.length}
						pageSize={10}
					/>
				)}
			</div>
		</div>
	);
};

export default withRouter(withConfig(SubAccountSystem));
