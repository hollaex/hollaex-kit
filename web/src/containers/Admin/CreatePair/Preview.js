import React, { Fragment } from 'react';
import { Link } from 'react-router';
import { Button, message } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

import Coins from '../Coins';
import { renderStatus } from '../Trades/Pairs';
import { updateExchange } from '../AdminFinancials/action';

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
	buttonSubmitting = false
}) => {
	const pair_base_data =
		allCoins.filter((data) => data.symbol === formData.pair_base)[0] || {};
	const pair2_data =
		allCoins.filter((data) => data.symbol === formData.pair_2)[0] || {};
	
	const handlePreviewNext = async (previewFormData) => {
		if (isExistPair) {
			try {
				let formProps = {
					id: exchange.id,
					pairs: [...pairs, `${formData.pair_base}-${formData.pair_2}`]
				}
				await updateExchange(formProps);
				await getMyExchange();
				onClose();
				message.success('Pairs added successfully');
			} catch (error) {
				let errMsg = error.data && error.data.message
					? error.data.message
					: error.message;
				message.error(errMsg);
			}
		} else {
			handleNext(previewFormData);
		}
	}

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
			{isPreview || isConfigure
				?
				<div className="d-flex">
					<div className="title">Manage {formData.pair_base}/{formData.pair_2}</div>
					<div>{renderStatus(pair_base_data, user_id)}</div>
				</div>
				: null
			}
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
						<div>Status: {formData.active ? 'active' : 'Inactive'}</div>
						<div>Estimated price: {formData.estimated_price}</div>
						<div>Increment price: {formData.increment_price}</div>
						<div>Increment size: {formData.increment_size}</div>
						<div>Max price: {formData.max_price}</div>
						<div>Max size: {formData.max_size}</div>
						<div>Min price: {formData.min_price}</div>
						<div>Min size: {formData.min_size}</div>
						{isConfigure ? (
							<div>
								<Button
									type="primary"
									className="green-btn"
									onClick={onEdit}
								>
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
									<Button
										type="danger"
										onClick={() => onDelete(formData)}
										disabled={buttonSubmitting}
									>
										Remove
									</Button>
									<div className="separator"></div>
									<div className="description-small remove">
										Removing this market will permanently delete this market from
										your exchange. Use with caution!
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
		</div>
	);
};

export default Preview;
