import React, { useEffect, useState } from 'react';
import { Tabs, Modal, message } from 'antd';

import TiersContainer from './Tiers';
import Limits from './Limits';
import Fees from './Fees';
import NewTierForm, {
	NewTierConfirmation,
	PreviewContainer,
} from './ModalForm';
import EditFees from './EditFees';
import EditLimit from './EditLimit';
import { requestTiers, addNewTier, updateTier } from './action';
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
	getTiers
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
					userTiers={userTiers}
					getTiers={getTiers}
					handleClose={handleClose}
				/>
			);
		default:
			return <div></div>;
	}
};

const Tiers = () => {
	const [userTiers, setTiers] = useState({});
	const [isNew, setNew] = useState(false);
	const [isOpen, setOpen] = useState(false);
	const [modalType, setType] = useState('');
	const [editData, setData] = useState({});
	const [selectedPair, setPair] = useState('');

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
		addNewTier(formProps)
			.then((res) => {
				getTiers();
				handleClose();
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
			});
	};
	const handleUpdateTiers = () => {
		let formProps = { ...editData };
		delete formProps.fees;
		updateTier(editData)
			.then((res) => {
				getTiers();
				handleClose();
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
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
						onEditLimit={() => {
							setOpen(true);
							onTypeChange('edit-limits');
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
					getTiers
				)}
			</Modal>
		</div>
	);
};

export default Tiers;
