import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Button, message, Modal, Select } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

import Coins from '../Coins';
import RemoveConfirmation from '../Confirmation';
import { renderStatus } from '../Trades/Pairs';
import { updateExchange } from '../AdminFinancials/action';
import { updateAssetPairs } from '../Trades/actions';

const STATUS_OPTIONS = [
	'full',
	'cancel-only',
	'delisted',
	'pre-launch',
	'paused',
	'maintenance',
	'post-only',
	'migration',
	'inactive',
	'auction',
];

const Preview = ({
	isExchangeWizard,
	isPreview = false,
	isConfigure = false,
	formData = {},
	moveToStep,
	handleNext,
	onEdit,
	onDelete,
	isEdit,
	allCoins,
	user_id,
	isExistPair,
	onClose,
	exchange,
	pairs,
	getMyExchange,
	buttonSubmitting = false,
	onConfigure,
	onSave,
	saveLoading,
	handleChange,
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isEditingStatus, setIsEditingStatus] = useState(false);
	const [editedStatus, setEditedStatus] = useState(null);
	const [isSavingStatus, setIsSavingStatus] = useState(false);

	const currentStatus =
		formData.status || (formData.active ? 'active' : 'inactive');

	useEffect(() => {
		if (isConfigure) {
			setEditedStatus(currentStatus);
			setIsEditingStatus(true);
		} else {
			setIsEditingStatus(false);
			setEditedStatus(null);
		}
	}, [isConfigure]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleStatusConfigure = () => {
		setEditedStatus(currentStatus);
		setIsEditingStatus(true);
	};

	const handleStatusCancel = () => {
		setEditedStatus(null);
		setIsEditingStatus(false);
	};

	const handleStatusSave = async () => {
		try {
			setIsSavingStatus(true);
			await updateAssetPairs({
				code: formData.name,
				status: editedStatus,
			});
			formData.status = editedStatus;
			setIsEditingStatus(false);
			setEditedStatus(null);
			message.success('Status updated successfully');
		} catch (error) {
			const errMsg =
				error.data && error.data.message ? error.data.message : error.message;
			message.error(errMsg);
		} finally {
			setIsSavingStatus(false);
		}
	};

	const pair_base_data =
		allCoins.filter((data) => data.symbol === formData.pair_base)[0] || {};
	const pair2_data =
		allCoins.filter((data) => data.symbol === formData.pair_2)[0] || {};

	const handlePreviewNext = async (previewFormData) => {
		if (isExistPair) {
			try {
				let formProps = {
					id: exchange.id,
					pairs: [...pairs, `${formData.pair_base}-${formData.pair_2}`],
				};
				setIsLoading(true);
				await updateExchange(formProps);
				await getMyExchange();
				onClose();
				setIsLoading(false);
				message.success('Pairs added successfully');
			} catch (error) {
				let errMsg =
					error.data && error.data.message ? error.data.message : error.message;
				message.error(errMsg);
			}
		} else {
			handleNext(previewFormData);
		}
	};

	return (
		<div>
			{!isPreview && !isConfigure ? (
				<Fragment>
					<div className="title">Review & confirm market</div>
					<div className="grey-warning">
						<div className="warning-text">!</div>
						<div>
							<div className="sub-title">
								Please check the details carefully.
							</div>
							<div className="description">
								To avoid delays it is important to take the time to review the
								accuracy of the details below
							</div>
						</div>
					</div>
				</Fragment>
			) : null}
			{isPreview || isConfigure ? (
				<div className="d-flex">
					<div className="title">
						Manage {formData.pair_base}/{formData.pair_2}
					</div>
					<div>{renderStatus(pair_base_data, user_id)}</div>
				</div>
			) : null}
			<div
				className={
					!isPreview && !isConfigure
						? 'd-flex preview-container'
						: 'preview-container'
				}
			>
				<div
					className={
						!isPreview && !isConfigure
							? 'd-flex flex-container left-container'
							: 'd-flex flex-container left-container-preview'
					}
				>
					<div>
						<Coins
							nohover
							color={pair_base_data.meta ? pair_base_data.meta.color : ''}
							large
							small
							fullname={pair_base_data.fullname}
							type={(formData.pair_base || '').toLowerCase()}
						/>
						<div className="status-wrapper">
							{isPreview && !pair_base_data.verified ? (
								<div className="exclamation-icon">
									<ExclamationCircleFilled />
								</div>
							) : null}
							{isConfigure ? renderStatus(pair_base_data, user_id) : null}
						</div>
						{isPreview || isConfigure ? (
							<div>
								(
								<Link
									to={`/admin/financials?tab=0&preview=true&symbol=${formData.pair_base}`}
								>
									View details
								</Link>
								)
							</div>
						) : null}
					</div>
					<div className="cross-text">X</div>
					<div>
						<Coins
							nohover
							color={pair2_data.meta ? pair2_data.meta.color : ''}
							large
							small
							fullname={pair2_data.fullname}
							type={(formData.pair_2 || '').toLowerCase()}
						/>
						<div className="status-wrapper">
							{isPreview && !pair2_data.verified ? (
								<div className="exclamation-icon">
									<ExclamationCircleFilled />
								</div>
							) : null}
							{isConfigure ? renderStatus(pair2_data, user_id) : null}
						</div>
						{isConfigure || isPreview ? (
							<div>
								(
								<Link
									to={`/admin/financials?tab=0&preview=true&symbol=${formData.pair_2}`}
								>
									View details
								</Link>
								)
							</div>
						) : null}
					</div>
				</div>
				<div className={!isPreview && !isConfigure ? 'right-container' : ''}>
					<div className="right-content">
						{/* {isConfigure ? <div className="title">Pair info</div> : null} */}
						<div className="title">Market info</div>
						<div>Base market pair: {formData.pair_base}</div>
						<div>Price market pair: {formData.pair_2}</div>
					</div>
					<div className="right-content">
						<div className="title">Parameters</div>
						{isConfigure ? <div>Name: {formData.name}</div> : null}
						<div>
							Status:{' '}
							{isEditingStatus ? (
								<Select
									value={editedStatus}
									onChange={(val) => setEditedStatus(val)}
									style={{ width: 160 }}
								>
									{STATUS_OPTIONS.map((s) => (
										<Select.Option key={s} value={s}>
											{s}
										</Select.Option>
									))}
								</Select>
							) : !isPreview && !isConfigure && handleChange ? (
								<Select
									value={formData.status || 'full'}
									onChange={(val) => handleChange(val, 'status')}
									style={{ width: 160 }}
								>
									{STATUS_OPTIONS.map((s) => (
										<Select.Option key={s} value={s}>
											{s}
										</Select.Option>
									))}
								</Select>
							) : (
								currentStatus
							)}
						</div>
						<div>Estimated price: {formData.estimated_price}</div>
						<div>Increment price: {formData.increment_price}</div>
						<div>Increment size: {formData.increment_size}</div>
						<div>Max price: {formData.max_price}</div>
						<div>Max size: {formData.max_size}</div>
						<div>Min price: {formData.min_price}</div>
						<div>Min size: {formData.min_size}</div>
						{isConfigure ? (
							<div>
								<Button type="primary" className="green-btn" onClick={onEdit}>
									Edit
								</Button>
							</div>
						) : null}
					</div>
					{isPreview || isConfigure ? (
						<div className="right-content">
							<div className="title">Manage</div>
							<div className="d-flex">
								<div className="btn-wrapper">
									{isConfigure && onSave ? (
										<Button
											type="primary"
											className="green-btn"
											style={{ minWidth: 120 }}
											onClick={() => {
												if (editedStatus) {
													formData.status = editedStatus;
												}
												onSave();
											}}
											loading={saveLoading}
										>
											Save
										</Button>
									) : isPreview && onConfigure ? (
										<Button
											type="primary"
											className="green-btn"
											style={{ minWidth: 120 }}
											onClick={onConfigure}
										>
											Configure
										</Button>
									) : isEditingStatus ? (
										<div className="d-flex">
											<Button
												type="primary"
												className="green-btn"
												style={{ minWidth: 120 }}
												onClick={handleStatusSave}
												loading={isSavingStatus}
											>
												Save
											</Button>
											<div className="separator"></div>
											<Button
												onClick={handleStatusCancel}
												disabled={isSavingStatus}
											>
												Cancel
											</Button>
										</div>
									) : (
										<Button
											type="primary"
											className="green-btn"
											style={{ minWidth: 120 }}
											onClick={handleStatusConfigure}
										>
											Configure
										</Button>
									)}
									<div className="separator"></div>
									<div className="description-small">
										Configure the trading status for this market pair.
									</div>
								</div>
							</div>
							<div className="d-flex" style={{ marginTop: 16 }}>
								<div className="btn-wrapper">
									<Button
										type="danger"
										onClick={() => setIsVisible(true)}
										disabled={buttonSubmitting}
									>
										Remove
									</Button>
									<div className="separator"></div>
									<div className="description-small remove">
										Removing this market will permanently delete this market
										from your exchange. Use with caution!
									</div>
								</div>
							</div>
						</div>
					) : null}
				</div>
			</div>
			{!isPreview && !isConfigure ? (
				<div className="btn-wrapper">
					<Button
						className="green-btn"
						type="primary"
						onClick={() => {
							if (formData.id && !isExchangeWizard) {
								moveToStep('step1');
							} else if (isExistPair) {
								moveToStep('pair-init-selection');
							} else {
								moveToStep('step2');
							}
						}}
					>
						Back
					</Button>
					<div className="separator"></div>
					<Button
						className="green-btn"
						type="primary"
						onClick={() => handlePreviewNext(formData)}
					>
						Next
					</Button>
				</div>
			) : null}
			{isVisible ? (
				<Modal
					visible={isVisible}
					footer={null}
					onCancel={() => setIsVisible(false)}
				>
					<RemoveConfirmation
						onCancel={setIsVisible}
						onHandleRemoveMarket={onDelete}
						removePair={formData}
						removeContent={'Markets'}
						isLoading={isLoading}
					/>
				</Modal>
			) : null}
		</div>
	);
};

export default Preview;
