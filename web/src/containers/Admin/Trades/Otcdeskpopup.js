import React, { Fragment, useRef } from 'react';
import { Input, Button, Select, Modal, InputNumber, Radio } from 'antd';
import {
	ExclamationCircleFilled,
	InfoCircleOutlined,
	ExclamationCircleOutlined,
	CloseOutlined,
} from '@ant-design/icons';

import { STATIC_ICONS } from 'config/icons';
import Coins from '../Coins';

const { Option } = Select;

const radioStyle = {
	display: 'flex',
	alignItems: 'center',
	height: '30px',
	lineHeight: '1.2',
	padding: '1px 0',
	margin: 0,
	paddingLeft: '1px',
	whiteSpace: 'normal',
	letterSpacing: '-0.15px',
	color: '#ffffff',
};

const Otcdeskpopup = ({
	previewData,
	type,
	handlePreviewChange,
	getCoinSource,
	coinSecondary,
	isExistsPair,
	moveToStep,
	getFullName,
	handleBack,
	isManual,
	coins,
	user,
	handleDealBack,
	handlePriceNext,
	handleBrokerChange,
	handlePaused,
	deleteBrokerData,
	isOpen,
	setPricing,
	setType,
	status,
	emailOptions,
	handleSearch,
	pairBaseBalance,
	pair2Balance,
	handleEmailChange,
	handleClosePopup,
	selectedEmailData,
}) => {
	const searchRef = useRef(null);

	const handleEditInput = () => {
		if (searchRef && searchRef.current && searchRef.current.focus) {
			searchRef.current.focus();
		}
	};

	const renderErrorMsg = () => {
		return (
			<div className="d-flex align-items-center error-container">
				<span className="error">
					{' '}
					<ExclamationCircleFilled />
				</span>
				<span className="balance-error-text pl-2">
					{' '}
					There doesn't seem to be any available balance for this coins.
				</span>
			</div>
		);
	};

	const renderModalContent = () => {
		switch (type) {
			case 'step1':
				return (
					<div className="otc-Container otcdesk-add-pair-wrapper">
						<div className="d-flex justify-content-between">
							<div>
								<div className="title font-weight-bold">
									Start a new deal desk
								</div>
								<div className="main-subHeading">
									Select the assets you'd like to offer for your OTC deal desk.
								</div>
							</div>
							<img
								src={STATIC_ICONS.BROKER_DESK_ICON}
								className="broker-desk-icon"
								alt="active_icon"
							/>
						</div>
						<div className="coin-container">
							<div className="pair-wrapper">
								<div className="flex-container">
									<div className="sub-title">Base Asset</div>
									<div>What will be traded</div>
									<div className="flex-container full-width">
										<Select
											onChange={(value) => {
												handlePreviewChange(value, 'pair_base');
											}}
											value={previewData.pair_base}
										>
											{coins.map((data, index) => {
												let symbol =
													typeof data === 'string' ? data : data.symbol;
												let fullname =
													typeof data === 'string' ? data : data.fullname;
												return (
													<Option key={index} value={symbol}>
														<img
															src={getCoinSource(data, symbol)}
															alt="coins"
															className="coin-icon"
														/>
														{`${fullname} (${(symbol || '').toUpperCase()})`}
													</Option>
												);
											})}
										</Select>
									</div>
								</div>
								<div className="vs-content">vs</div>
								<div className="flex-container">
									<div className="sub-title">Priced</div>
									<div>What it will be priced in</div>
									<div className="flex-container full-width">
										<Select
											onChange={(value) => {
												handlePreviewChange(value, 'pair_2');
											}}
											value={previewData.pair_2}
										>
											{coinSecondary.map((data, index) => {
												let symbol =
													typeof data === 'string' ? data : data.symbol;
												let fullname =
													typeof data === 'string' ? data : data.fullname;
												return (
													<Option key={index} value={symbol}>
														<img
															src={getCoinSource(data, symbol)}
															alt="coins"
															className="coin-icon"
														/>
														{`${fullname} (${(symbol || '').toUpperCase()})`}
													</Option>
												);
											})}
										</Select>
									</div>
								</div>
							</div>
							<div className="main-subHeading mb-5">
								<div className="mt-4">Please take note before proceeding: </div>
								<div className="mb-4">
									You should have readily available balance for the above assets
									selected.
								</div>
								<div>OTC deals work through the Quick trade interface.</div>
								<div className="mt-4">
									{' '}
									Creating an OTC deal for a market pair that has an active
									Quick trade{' '}
								</div>
								<div>
									will cause that active Quick trade price source to switch to
									your new OTC deal.
								</div>
								<a
									target="_blank"
									href="https://docs.hollaex.com/how-tos/otc-broker"
									rel="noopener noreferrer"
								>
									Read More.
								</a>
							</div>
						</div>
						{isExistsPair ? (
							<div className="message mb-5">
								<div className="icon">
									<ExclamationCircleOutlined />
								</div>
								<div className="message-subHeading">
									This will override the currently active Quick trade which is
									sourcing prices from the{' '}
									{previewData &&
										previewData.symbol &&
										previewData.symbol.toUpperCase()}{' '}
									orderbook.
								</div>
							</div>
						) : null}
						<div className="btn-wrapper">
							<Button
								className="green-btn"
								type="primary"
								onClick={handleClosePopup}
							>
								Back
							</Button>
							<div className="separator"></div>
							<Button
								className="green-btn"
								type="primary"
								onClick={() => moveToStep('deal-params')}
							>
								Next
							</Button>
						</div>
					</div>
				);
			case 'deal-params':
				return (
					<div className="otc-Container">
						<div className="title">Deal parameters</div>
						<div className="main-subHeading mt-3 mb-3">
							Adjust how much and what incremental values are allowed for your
							OTC broker desk.
						</div>
						<div className="d-flex align-items-center coin-container mb-4 coin-image">
							<div className="d-flex align-items-center mr-4">
								<Coins type={previewData.pair_base} />
								<span className="coin-full-name">
									{getFullName(previewData.pair_base)}
								</span>
							</div>
							<CloseOutlined style={{ fontSize: '24px' }} />
							<div className="d-flex align-items-center ml-4">
								<Coins type={previewData.pair_2} />
								<span className="coin-full-name">
									{getFullName(previewData.pair_2)}
								</span>
							</div>
						</div>
						<div className="edit-wrapper">
							<div className="sub-title">Min and max tradable</div>
							<Button
								type="primary"
								className="green-btn"
								onClick={() => moveToStep('edit-tradable')}
							>
								Edit
							</Button>
						</div>
						<div className="field-wrap">
							<div className="sub-title">Minimum Tradable Amount</div>
							<div className="description">
								<div>Minimum - amount that can be traded for this market.</div>
							</div>
							<div className="full-width">{previewData.min_size}</div>
						</div>
						<div className="field-wrap">
							<div className="sub-title">Maximum Tradable Amount</div>
							<div className="description">
								<div>Maximum - amount that can be traded for this market.</div>
							</div>
							<div className="full-width">{previewData.max_size}</div>
						</div>
						<div className="edit-wrapper">
							<div className="sub-title">Tradable increment</div>
							<Button
								type="primary"
								className="green-btn"
								onClick={() => moveToStep('edit-increment')}
							>
								Edit
							</Button>
						</div>
						<div className="field-wrap">
							<div className="sub-title">Increment Amount</div>
							<div className="description">
								<div>
									The increment - amount allowed to be adjusted up and down in
									the order entry panel
								</div>
							</div>
							<div className="full-width">{previewData.increment_size}</div>
						</div>
						<div className="edit-wrapper"></div>
						<div className="btn-wrapper">
							<Button
								type="primary"
								className="green-btn"
								onClick={handleDealBack}
							>
								Back
							</Button>
							<div className="separator"></div>
							<Button
								type="primary"
								className="green-btn"
								onClick={() => moveToStep('coin-pricing')}
							>
								Next
							</Button>
						</div>
					</div>
				);
			case 'edit-tradable':
				return (
					<div className="otc-Container">
						<div className="title">Market parameters</div>
						<div className="field-wrap">
							<div className="sub-title">Minimum Tradable Amount</div>
							<div className="description">
								<div>Minimum - amount that can be traded for this market.</div>
							</div>
							<div className="full-width">
								<InputNumber
									name="max"
									onChange={(val) => handlePreviewChange(val, 'min_size')}
									value={previewData.min_size}
								/>
							</div>
						</div>
						<div className="field-wrap">
							<div className="sub-title">Maximum Tradable Amount</div>
							<div className="description">
								<div>Maximum - amount that can be traded for this market.</div>
							</div>
							<div className="full-width">
								<InputNumber
									name="max"
									onChange={(val) => handlePreviewChange(val, 'max_size')}
									value={previewData.max_size}
								/>
							</div>
						</div>
						<div className="btn-wrapper">
							<Button
								type="primary"
								className="green-btn"
								onClick={() => moveToStep('deal-params')}
							>
								Next
							</Button>
						</div>
					</div>
				);
			case 'edit-increment':
				return (
					<div className="otc-Container">
						<div className="title">Market parameters</div>
						<div className="field-wrap">
							<div className="sub-title">Increment Amount</div>
							<div className="description">
								<div>
									The increment - amount allowed to be adjusted up and down in
									the order entry panel
								</div>
							</div>
							<div className="full-width">
								<InputNumber
									name="max"
									onChange={(val) => handlePreviewChange(val, 'increment_size')}
									value={previewData.increment_size}
								/>
							</div>
						</div>
						<div className="btn-wrapper">
							<Button
								type="primary"
								className="green-btn"
								onClick={() => moveToStep('deal-params')}
							>
								Next
							</Button>
						</div>
					</div>
				);
			case 'coin-pricing':
				return (
					<div className="otc-Container coin-pricing-container">
						<div className="title pb-3">Set coin pricing</div>
						<div className="d-flex align-items-center coin-container mb-4 coin-image">
							<div className="d-flex align-items-center mr-4 ">
								<Coins type={previewData.pair_base} />
								<span className="coin-full-name">
									{getFullName(previewData.pair_base)}
								</span>
							</div>
							<CloseOutlined style={{ fontSize: '24px' }} />
							<div className="d-flex align-items-center ml-4">
								<Coins type={previewData.pair_2} />
								<span className="coin-full-name">
									{getFullName(previewData.pair_2)}
								</span>
							</div>
						</div>
						<div>
							<div className="mb-1 pt-4 coin-pricing-Heading">Type</div>
							<div className="select-box">
								<Select defaultValue="manual" onChange={setPricing}>
									<Option value="manual">Manually set (static)</Option>
									<Option value="dynamic">Dynamic (coming soon)</Option>
								</Select>
							</div>
						</div>
						{isManual ? (
							<div>
								<div className="pricing-container mt-4">
									<div>
										<div className="mb-1">Displayed selling price</div>
										<Input
											type="number"
											suffix={
												previewData &&
												previewData.pair_2 &&
												previewData.pair_2.toUpperCase()
											}
											value={previewData && previewData.sell_price}
											onChange={(e) =>
												handlePreviewChange(e.target.value, 'sell_price')
											}
										/>
									</div>
									<div>
										<div className="mb-1">Displayed buying price</div>
										<Input
											type={'number'}
											suffix={
												previewData &&
												previewData.pair_2 &&
												previewData.pair_2.toUpperCase()
											}
											value={previewData && previewData.buy_price}
											onChange={(e) =>
												handlePreviewChange(e.target.value, 'buy_price')
											}
										/>
									</div>
								</div>
								<div className="mt-4 warning-message grey-text-color">
									{' '}
									<InfoCircleOutlined /> Displayed price is the price your users
									will see and trade at.
								</div>
							</div>
						) : (
							<div className="mt-3 ml-3">
								<div>Select price source:</div>
								<div className="mt-2 error">
									<ExclamationCircleFilled /> Coming soon for upgraded HollaEx
									operators.
								</div>
							</div>
						)}
						<div className="btn-wrapper pt-3">
							<Button
								type="primary"
								className="green-btn"
								onClick={() => handleBack('deal-params')}
							>
								Back
							</Button>
							<div className="separator"></div>
							<Button
								type="primary"
								className="green-btn"
								onClick={handlePriceNext}
								disabled={
									!isManual ||
									(previewData && !previewData.buy_price) ||
									(previewData && !previewData.sell_price)
								}
							>
								Next
							</Button>
						</div>
					</div>
				);
			case 'preview':
				return (
					<div className="otc-Container">
						<Fragment>
							<div className="title">Review & confirm market</div>
							<div className="grey-warning">
								<div className="warning-text">!</div>
								<div>
									<div className="sub-title">
										Please check the details carefully.
									</div>
									<div className="description">
										To avoid delays it is important to take the time to review
										the accuracy of the details below
									</div>
								</div>
							</div>
						</Fragment>
						<div className="d-flex preview-container">
							<div className="d-flex flex-container left-container">
								<div>
									<Coins
										nohover
										large
										small
										type={previewData.pair_base}
										fullname={getFullName(previewData.pair_base)}
									/>
								</div>
								<div className="cross-text">X</div>
								<div>
									<Coins
										nohover
										large
										small
										type={previewData.pair_2}
										fullname={getFullName(previewData.pair_2)}
									/>
								</div>
							</div>
							<div className="right-container">
								<div className="right-content">
									<div className="title font-weight-bold">Desk assets</div>
									<div>Base market pair: {previewData.pair_base}</div>
									<div>Price market pair: {previewData.pair_2}</div>
								</div>
								<div className="right-content">
									<div className="title font-weight-bold">Parameters</div>
									<div>Increment size: {previewData.increment_size}</div>
									<div>Max size: {previewData.max_size}</div>
									<div>Min size: {previewData.min_size}</div>
								</div>
								<div className="right-content">
									<div className="title font-weight-bold">Price</div>
									<div>Type: {isManual ? 'Static' : 'Dynamic'}</div>
									<div>Sell at: {previewData.sell_price}</div>
									<div>buy at: {previewData.buy_price}</div>
								</div>
								<div className="right-content">
									<div className="title font-weight-bold">Fund Source</div>
									<div>
										Account:{' '}
										{(selectedEmailData && selectedEmailData.label) ||
											(user && user.email)}
									</div>
									<div>
										{previewData.pair_base}: {pairBaseBalance}
									</div>
									<div>
										{previewData.pair_2}: {pair2Balance}
									</div>
								</div>
							</div>
						</div>
						<div className="btn-wrapper">
							<Button
								className="green-btn"
								type="primary"
								onClick={handlePriceNext}
							>
								Back
							</Button>
							<div className="separator"></div>
							<Button
								className="green-btn"
								type="primary"
								onClick={() => moveToStep('state-status')}
							>
								Next
							</Button>
						</div>
					</div>
				);
			case 'state-status':
				return (
					<div className="otc-Container">
						<div className="title">State</div>
						<div className="main-subHeading">
							Set the state of this OTC deal.
						</div>
						<div className="d-flex align-items-center coin-container mb-4 mt-4 coin-image">
							<div className="d-flex align-items-center mr-4 ">
								<Coins type={previewData.pair_base} />
								<span className="coin-full-name">
									{getFullName(previewData.pair_base)}
								</span>
							</div>
							<CloseOutlined style={{ fontSize: '24px' }} />
							<div className="d-flex align-items-center ml-4">
								<Coins type={previewData.pair_2} />
								<span className="coin-full-name">
									{getFullName(previewData.pair_2)}
								</span>
							</div>
						</div>
						<div>
							<div className="mt-2">Status</div>
							<Radio.Group
								name="status"
								onChange={(e) =>
									handlePreviewChange(
										e.target.value === 'paused' ? true : false,
										'paused',
										e.target.value
									)
								}
								value={previewData.paused ? 'paused' : 'live'}
							>
								<Radio value={'paused'} style={radioStyle}>
									Paused
								</Radio>
								{status === 'paused' || previewData.paused ? (
									<div className="message mt-3 mb-2">
										<div className="icon">
											<ExclamationCircleOutlined />
										</div>
										<div className="message-subHeading">
											Paused state will stop users from being able to
											transaction with this OTC broker desk.
										</div>
									</div>
								) : null}
								<Radio value={'live'} style={radioStyle}>
									Live
								</Radio>
								{status === 'live' ? (
									<div className="message mt-3 mb-2">
										<div className="icon">
											<ExclamationCircleOutlined />
										</div>
										<div className="message-subHeading">
											The live state will allow users to transact with this OTC
											broker desk.
										</div>
									</div>
								) : null}
							</Radio.Group>
						</div>
						<div className="d-flex  mt-4">
							<div className="pr-2">
								<ExclamationCircleOutlined />
							</div>
							<div className="main-subHeading">
								If there is an existing Quick-Trade for this market pair then it
								will be replaced by this OTC Broker deal.
							</div>
						</div>
						<div className="btn-wrapper">
							<Button
								className="green-btn"
								type="primary"
								onClick={() => handleBack('preview')}
							>
								Back
							</Button>
							<div className="separator"></div>
							<Button
								className="green-btn"
								type="primary"
								onClick={handleBrokerChange}
							>
								Next
							</Button>
						</div>
					</div>
				);
			case 'with-balance':
				return (
					<div className="otc-Container">
						{pair2Balance !== 0 && pairBaseBalance !== 0 ? (
							<div>
								<div className="title mb-3">Funding account source</div>
								<div>Set the source of the inventory funds</div>
								<div className="sub-content mb-3">
									<div>
										Inventory are funds used for satisfying all users orders.
									</div>
									<div>
										It is the responsibility of the operator to allocate an
										adequate amount of both assets.{' '}
									</div>
									<div>
										Simply define an account with sufficient balance that will
										be used to source inventory from.
									</div>
								</div>
							</div>
						) : (
							<div>
								<div className="title mb-3">Add OTC Broker Desk</div>
								<div>Set inventory</div>
								<div className="sub-content mb-3">
									<div>
										Inventory are funds used for satisfying all users orders.
									</div>
									<div>
										It is the responsibility of the operator to allocate an
										adequate amount of both assets.{' '}
									</div>
									<div>
										Simply define an account with sufficient balance that will
										be used to source inventory from.
									</div>
								</div>
							</div>
						)}
						<div className="mb-5">
							<div className="mb-2">Account to source inventory from</div>
							<div className="d-flex align-items-center">
								<Select
									ref={(inp) => {
										searchRef.current = inp;
									}}
									showSearch
									placeholder="admin@exchange.com"
									className="user-search-field"
									onSearch={(text) => handleSearch(text)}
									filterOption={() => true}
									value={
										(selectedEmailData && selectedEmailData.label) ||
										(user && user.email)
									}
									onChange={(text) => handleEmailChange(text)}
									showAction={['focus', 'click']}
								>
									{emailOptions &&
										emailOptions.map((email) => (
											<Option key={email.value}>{email.label}</Option>
										))}
								</Select>
								<div className="edit-link" onClick={handleEditInput}>
									Edit
								</div>
							</div>
						</div>
						<div className="mb-4">
							Available balance on{' '}
							{(selectedEmailData && selectedEmailData.label) ||
								(user && user.email)}
							:
						</div>
						<div className="mb-4">
							<div className="d-flex align-items-center coin-image">
								<div className=" mr-3">
									<Coins type={previewData.pair_base} />
								</div>
								<div>
									{getFullName(previewData.pair_base)}: {pairBaseBalance}
								</div>
							</div>
							{pairBaseBalance === 0 ? renderErrorMsg() : null}
						</div>
						<div className="mb-4">
							<div className="d-flex align-items-center coin-image">
								<div className=" mr-3">
									<Coins type={previewData.pair_2} />
								</div>
								<div>
									{getFullName(previewData.pair_2)}: {pair2Balance}
								</div>
							</div>
							{pair2Balance === 0 ? renderErrorMsg() : null}
						</div>
						{pair2Balance !== 0 && pairBaseBalance !== 0 ? (
							<div className="message">
								<div className="icon">
									<ExclamationCircleOutlined />
								</div>
								<div className="message-subHeading">
									Please check if the amounts are sufficiently sustainable
									before proceeding.
								</div>
							</div>
						) : null}
						<div className="btn-wrapper">
							<Button
								className="green-btn"
								type="primary"
								onClick={() => handleBack('coin-pricing')}
							>
								Back
							</Button>
							<div className="separator"></div>
							<Button
								className="green-btn"
								type="primary"
								onClick={() => moveToStep('preview')}
							>
								Next
							</Button>
						</div>
					</div>
				);
			case 'pause-otcdesk':
				return (
					<div className="otc-Container">
						<div className="title">Pause OTC desk</div>
						<div className="main-subHeading mt-3 mb-3">
							Pause your OTC desk for reconfigurations and when you want to halt
							new transactions.
						</div>
						<div className="message mb-5">
							<div className="icon">
								<ExclamationCircleOutlined />
							</div>
							<div className="message-subHeading">
								Paused state will stop users from being able to transaction with
								this OTC broker desk.
							</div>
						</div>
						<div className="btn-wrapper">
							<Button
								className="green-btn"
								type="primary"
								onClick={handleClosePopup}
							>
								Back
							</Button>
							<div className="separator"></div>
							<Button
								className="green-btn"
								type="primary"
								onClick={() => handlePaused('paused', 'desk')}
							>
								Pause
							</Button>
						</div>
						<div className="removedesk-text">
							Do you want to remove this desk? Remove{' '}
							<span
								className="remove-link"
								onClick={() => moveToStep('remove-otcdesk')}
							>
								here
							</span>
							.
						</div>
					</div>
				);
			case 'unpause-otcdesk':
				return (
					<div className="otc-Container">
						<div className="title">Unpause OTC desk</div>
						<div className="message mt-4 mb-5">
							<div className="icon">
								<ExclamationCircleOutlined />
							</div>
							<div className="message-subHeading">
								Unpausing will allow users to transact with this OTC broker
								desk.
							</div>
						</div>
						<div className="btn-wrapper">
							<Button
								className="green-btn"
								type="primary"
								onClick={handleClosePopup}
							>
								Back
							</Button>
							<div className="separator"></div>
							<Button
								className="green-btn"
								type="primary"
								onClick={() => handlePaused('unpaused', 'desk')}
							>
								Unpause
							</Button>
						</div>
						<div className="removedesk-text">
							Do you want to remove this desk? Remove{' '}
							<span
								className="remove-link"
								onClick={() => moveToStep('remove-otcdesk')}
							>
								here
							</span>
							.
						</div>
					</div>
				);
			case 'remove-otcdesk':
				return (
					<div className="otc-Container">
						<div className="title">Remove OTC desk</div>
						<div className="message mt-3 mb-5">
							<div className="icon">
								<ExclamationCircleOutlined />
							</div>
							<div className="message-subHeading">
								Removing the desk is permanent. Are you sure you want to do
								this?
							</div>
						</div>
						<div className="btn-wrapper">
							<Button
								className="green-btn"
								type="primary"
								onClick={() => setType('unpause-otcdesk')}
							>
								Back
							</Button>
							<div className="separator"></div>
							<Button
								type="primary"
								className="remove-btn"
								onClick={deleteBrokerData}
							>
								Remove
							</Button>
						</div>
					</div>
				);
			default:
				return;
		}
	};

	return (
		<div className="otcDeskContainer">
			<Modal
				visible={isOpen}
				width={type === 'remove-otcdesk' ? '480px' : '520px'}
				onCancel={handleClosePopup}
				footer={null}
			>
				{renderModalContent()}
			</Modal>
		</div>
	);
};

export default Otcdeskpopup;
