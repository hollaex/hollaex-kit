import React, { useEffect, useState } from 'react';
import { Tabs, Modal, message } from 'antd';
import { connect } from 'react-redux';

import TiersContainer from './Tiers';
import Limits from './Limits';
import Fees from './Fees';
import NewTierForm, {
	NewTierConfirmation,
	PreviewContainer,
} from './ModalForm';
import EditFees from './EditFees';
import EditLimit from './EditLimit';
import ChangeLimit from './ChangeLimit';
import CheckAndConfirm from './CheckAndConfirm';
import { requestTiers, addNewTier, updateTier, updateLimits } from './action';
import './index.css';

const TabPane = Tabs.TabPane;

const renderContent = (
	isNew,
	type,
	editData,
	userTiers,
	selectedPair,
	onTypeChange,
	handleNext,
	handleSave,
	handleClose,
	getTiers,
	buttonSubmitting,
	tierName,
	coinSymbol,
	handleScreenUpdate,
	isNativeCoin,
	setIsNativeCoin,
	constants = {},
	allCoins = [],
	handleConfirm = () => {},
	formData = {},
	setFormData = () => {},
	handleSaveData = () => {},
	isButtonSubmit = false,
	isUseNativeCoin = false
) => {
	switch (type) {
		case 'new-tier-confirm':
			return <NewTierConfirmation onTypeChange={onTypeChange} />;
		case 'new-tier-form':
			return (
				<NewTierForm
					isNew={isNew}
					editData={editData}
					onTypeChange={onTypeChange}
					handleNext={handleNext}
				/>
			);
		case 'edit-tier-form':
			return (
				<NewTierForm
					isNew={isNew}
					editData={editData}
					onTypeChange={onTypeChange}
					handleNext={handleNext}
				/>
			);
		case 'preview':
			return (
				<PreviewContainer
					isNew={isNew}
					tierData={editData}
					onTypeChange={onTypeChange}
					handleSave={handleSave}
					buttonSubmitting={buttonSubmitting}
				/>
			);
		case 'edit-fees':
			return (
				<EditFees
					selectedPair={selectedPair}
					userTiers={userTiers}
					getTiers={getTiers}
					handleClose={handleClose}
				/>
			);
		case 'edit-limits':
			return (
				<EditLimit
					tierName={tierName}
					coinSymbol={coinSymbol}
					userTiers={userTiers}
					getTiers={getTiers}
					handleClose={handleClose}
					handleScreenUpdate={handleScreenUpdate}
					formData={formData}
					setFormData={setFormData}
					handleSave={handleSaveData}
					buttonSubmitting={isButtonSubmit}
					isNativeCoin={isNativeCoin}
					constants={constants}
					isUseNativeCoin={isUseNativeCoin}
				/>
			);
		case 'change-limits':
			return (
				<ChangeLimit
					tierName={tierName}
					coinSymbol={coinSymbol}
					handleScreenUpdate={handleScreenUpdate}
					isNativeCoin={isNativeCoin}
					setIsNativeCoin={setIsNativeCoin}
					constants={constants}
					allCoins={allCoins}
					formData={formData}
					setFormData={setFormData}
					isUseNativeCoin={isUseNativeCoin}
				/>
			);
		case 'check-confirm':
			return (
				<CheckAndConfirm
					tierName={tierName}
					coinSymbol={coinSymbol}
					handleScreenUpdate={handleScreenUpdate}
					constants={constants}
					handleConfirm={handleConfirm}
					isNativeCoin={isNativeCoin}
					isUseNativeCoin={isUseNativeCoin}
				/>
			);
		default:
			return <div></div>;
	}
};

const Tiers = ({ constants = {}, allCoins = [] }) => {
	const [userTiers, setTiers] = useState({});
	const [isNew, setNew] = useState(false);
	const [isOpen, setOpen] = useState(false);
	const [modalType, setType] = useState('');
	const [editData, setData] = useState({});
	const [selectedPair, setPair] = useState('');
	const [buttonSubmitting, setButttonSubmitting] = useState(false);
	const [tierName, setTierName] = useState('');
	const [coinSymbol, setSymbol] = useState('');
	const [isNativeCoin, setIsNativeCoin] = useState(false);
	const [isButtonSubmit, setIsButtonSubmit] = useState(false);
	const [formData, setFormData] = useState({});
	const [isUseNativeCoin, setUseNativeCoin] = useState(false);

	useEffect(() => {
		if (userTiers && Object.keys(userTiers).length) {
			if (userTiers[1]?.native_currency_limit) {
				setIsNativeCoin(true);
				setUseNativeCoin(true);
			}
		}
	}, [userTiers]);

	useEffect(() => {
		getTiers();
	}, []);
	const getTiers = () => {
		requestTiers()
			.then((res) => {
				setTiers(res);
			})
			.catch((err) => {
				console.error(err);
			});
	};
	const handleEdit = (data) => {
		setOpen(true);
		setType('edit-tier-form');
		setData(data);
	};
	const handleAdd = () => {
		setOpen(true);
		setNew(true);
		setType('new-tier-confirm');
		setData({
			id: Object.keys(userTiers).length + 1,
			level: Object.keys(userTiers).length + 1,
			icon: '',
			deposit_limit: 0,
			withdrawal_limit: 0,
			fees: {
				taker: {
					default: 0,
				},
				maker: {
					default: 0,
				},
			},
		});
	};
	const handleClose = () => {
		setOpen(false);
		setNew(false);
		setType('');
		setData({});
		setPair('');
	};
	const onTypeChange = (type) => {
		setType(type);
	};
	const handleNext = (data) => {
		setData(data);
	};
	const handleSaveTiers = () => {
		let formProps = { ...editData };
		delete formProps.id;
		setButttonSubmitting(true);
		addNewTier(formProps)
			.then((res) => {
				getTiers();
				handleClose();
				setButttonSubmitting(false);
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
				setButttonSubmitting(false);
			});
	};
	const handleUpdateTiers = () => {
		let formProps = { ...editData };
		delete formProps.fees;
		setButttonSubmitting(true);
		updateTier(editData)
			.then((res) => {
				getTiers();
				handleClose();
				setButttonSubmitting(false);
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
				setButttonSubmitting(false);
			});
	};
	const handleSubmit = () => {
		if (isNew) {
			handleSaveTiers();
		} else {
			handleUpdateTiers();
		}
	};
	const getWidth = () => {
		if (modalType === 'preview' || modalType === 'edit-fees') {
			return 520;
		} else if (modalType === 'edit-limits') {
			return 490;
		} else if (modalType === 'new-tier-confirm') {
			return 350;
		} else {
			return 420;
		}
	};

	const handleScreenUpdate = (val) => {
		setOpen(true);
		onTypeChange(val);
	};

	const handleSave = (type = '') => {
		let formValues = {
			limits: formData,
		};
		setIsButtonSubmit(true);
		updateLimits(formValues)
			.then((res) => {
				getTiers();
				if (type && type !== 'coinChange') {
					handleClose();
				}
				setIsButtonSubmit(false);
				message.success('Limits updated successfully');
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				setIsButtonSubmit(false);
				message.error(error);
			});
	};

	const handleConfirm = (type) => {
		onTypeChange(type);
		handleSave('coinChange');
	};

	return (
		<div className="admin-tiers-wrapper w-100">
			<Tabs>
				<TabPane tab="Fees" key="fees">
					<Fees
						userTiers={userTiers}
						onEditFees={(pair) => {
							setOpen(true);
							onTypeChange('edit-fees');
							setPair(pair);
						}}
					/>
				</TabPane>
				<TabPane tab="Limits" key="limits">
					<Limits
						userTiers={userTiers}
						onEditLimit={(symbol, fullName) => {
							setOpen(true);
							onTypeChange('edit-limits');
							setSymbol(symbol);
							setTierName(fullName);
						}}
					/>
				</TabPane>
				<TabPane tab="Account tiers" key="tiers">
					<TiersContainer
						userTiers={userTiers}
						handleEdit={handleEdit}
						handleAdd={handleAdd}
					/>
				</TabPane>
			</Tabs>
			<Modal
				visible={isOpen}
				footer={null}
				onCancel={handleClose}
				width={getWidth()}
			>
				{renderContent(
					isNew,
					modalType,
					editData,
					userTiers,
					selectedPair,
					onTypeChange,
					handleNext,
					handleSubmit,
					handleClose,
					getTiers,
					buttonSubmitting,
					tierName,
					coinSymbol,
					handleScreenUpdate,
					isNativeCoin,
					setIsNativeCoin,
					constants,
					allCoins,
					handleConfirm,
					formData,
					setFormData,
					handleSave,
					isButtonSubmit,
					isUseNativeCoin
				)}
			</Modal>
		</div>
	);
};

const mapStateToProps = (state) => ({
	constants: state.app.constants,
	allCoins: state.asset.allCoins,
});

export default connect(mapStateToProps)(Tiers);
