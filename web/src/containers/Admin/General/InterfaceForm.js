import React, { useState } from 'react';
import { ReactSVG } from 'react-svg';
import { Button, Checkbox, Form, Input, Modal, Select, message } from 'antd';
import classnames from 'classnames';
import _isEqual from 'lodash/isEqual';

import { STATIC_ICONS } from 'config/icons';
import FormButton from 'components/FormButton/Button';
import { CloseOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
const { Item } = Form;

const InterfaceForm = ({
	initialValues = {},
	constants,
	handleSaveInterface,
	isUpgrade,
	buttonSubmitting,
	isFiatUpgrade,
	coins,
	enabledPlugins,
}) => {
	const [isSubmit, setIsSubmit] = useState(!buttonSubmitting);
	const [form] = Form.useForm();
	const [balanceHistoryCurrency, setBalanceHistoryCurrency] = useState({
		currency: constants?.kit?.balance_history_config?.currency || null,
		date_enabled:
			constants?.kit?.balance_history_config?.date_enabled || new Date(),
	});

	const [displayBalanceHistoryModal, setDisplayBalanceHistoryModal] = useState(
		false
	);

	const [referralHistoryData, setReferralHistoryData] = useState({
		currency: constants?.kit?.referral_history_config?.currency || 'usdt',
		earning_rate: constants?.kit?.referral_history_config?.earning_rate || 0,
		minimum_amount:
			constants?.kit?.referral_history_config?.minimum_amount || 1,
		earning_period:
			constants?.kit?.referral_history_config?.earning_period || 0,
		distributor_id:
			constants?.kit?.referral_history_config?.distributor_id || null,
		date_enabled:
			constants?.kit?.referral_history_config?.date_enabled || new Date(),
		active: constants?.kit?.referral_history_config?.active,
	});

	const [chainTradeData, setChainTradeData] = useState({
		currency: constants?.kit?.chain_trade_config?.currency,
		source_account: constants?.kit?.chain_trade_config?.source_account,
		date_enabled:
			constants?.kit?.chain_trade_config?.date_enabled || new Date(),
		active: constants?.kit?.chain_trade_config?.active,
	});

	const [
		displayReferralHistoryModal,
		setDisplayReferralHistoryModal,
	] = useState(false);

	const [displayChainTradeModal, setDisplayChainTradeModal] = useState(false);

	const handleSubmit = (values) => {
		let formValues = {};
		if (values) {
			formValues = {
				chat: isUpgrade ? false : !!values.chat,
				quick_trade: !!values.quick_trade,
				pro_trade: !!values.pro_trade,
				stake_page: !!values.stake_page,
				cefi_stake: !!values.cefi_stake,
				balance_history_config: !!values.balance_history_config,
				referral_history_config: !!values.referral_history_config,
				chain_trade_config: !!values.chain_trade_config,
				home_page: isUpgrade ? false : !!values.home_page,
				ultimate_fiat: !!values.ultimate_fiat,
				apps: !!values.apps,
			};
			const balance_history_config = {
				currency: balanceHistoryCurrency.currency || 'usdt',
				active: !!values.balance_history_config || false,
				date_enabled: balanceHistoryCurrency.date_enabled,
			};
			const referral_history_config = {
				active: !!values.referral_history_config,
				currency: referralHistoryData.currency,
				earning_rate: Number(referralHistoryData.earning_rate),
				minimum_amount: Number(referralHistoryData.minimum_amount),
				earning_period: Number(referralHistoryData.earning_period),
				distributor_id: Number(referralHistoryData.distributor_id),
				date_enabled: referralHistoryData.date_enabled,
			};
			const chain_trade_config = {
				active: !!values.chain_trade_config,
				currency: chainTradeData.currency,
				source_account: Number(chainTradeData.source_account),
			};
			handleSaveInterface(
				formValues,
				values.balance_history_config ? balance_history_config : null,
				values.referral_history_config ? referral_history_config : null,
				values.chain_trade_config ? chain_trade_config : null,
			);
		}
	};

	const handleValuesChange = () => {
		if (!_isEqual(initialValues, form.getFieldsValue())) {
			setIsSubmit(false);
		} else {
			setIsSubmit(true);
		}
	};

	const handleSubmitData = (formProps) => {
		if (formProps.referral_history_config && !referralHistoryData.active) {
			if (
				enabledPlugins.includes('referral') &&
				!enabledPlugins.includes('referral-migrate')
			) {
				message.error(
					'In order to use the Referral System feature, you have to install Referral Migrate plugin to migrate the necessary data from the existing referral plugin to the new system.',
					10
				);
			} else {
				setDisplayReferralHistoryModal(true);
			}
		} else if (formProps.chain_trade_config && !chainTradeData.active) {
			setDisplayChainTradeModal(true);
		} else if (
			formProps.balance_history_config &&
			!balanceHistoryCurrency.currency
		) {
			setDisplayBalanceHistoryModal(true);
		} else {
			setIsSubmit(true);
			handleSubmit(formProps);
		}
	};

	let initialValue = initialValues;
	if (isUpgrade) {
		initialValue.home_page = false;
		initialValue.chat = false;
		initialValue.apps = false;
	}
	return (
		<div className="general-wrapper">
			{displayBalanceHistoryModal && (
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#27339D',
						marginTop: 60,
					}}
					visible={displayBalanceHistoryModal}
					width={400}
					footer={null}
					onCancel={() => {
						setDisplayBalanceHistoryModal(false);
					}}
				>
					<h2 style={{ fontWeight: '600', color: 'white' }}>
						Balance History Config
					</h2>

					<div className="mb-5">
						<div style={{ fontSize: 16 }} className="mb-2">
							Profit&Loss Currency
						</div>
						<div style={{ marginBottom: 10, color: '#ccc' }}>
							This currency is used as the base currency to calculate and
							display all the profits and loss. It is normally set to a fiat
							currency or a stable coin. Note that this currency can not be
							modified in future after it starts getting the information.
						</div>
						<Select
							showSearch
							className="select-box"
							placeholder="Select asset for p/l analysis"
							value={balanceHistoryCurrency.currency}
							style={{ width: 250 }}
							onChange={(e) => {
								setBalanceHistoryCurrency({
									...balanceHistoryCurrency,
									currency: e,
								});
							}}
						>
							{Object.keys(coins).map((key) => (
								<Select.Option value={key}>{coins[key].fullname}</Select.Option>
							))}
						</Select>
					</div>

					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 15,
							justifyContent: 'space-between',
							marginTop: 30,
						}}
					>
						<Button
							onClick={() => {
								setDisplayBalanceHistoryModal(false);
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							Back
						</Button>
						<Button
							onClick={async () => {
								if (!balanceHistoryCurrency.currency) {
									message.error('Please Select currency');
									return;
								}
								setIsSubmit(true);
								handleSubmit(form.getFieldsValue());
								setDisplayBalanceHistoryModal(false);
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							Proceed
						</Button>
					</div>
				</Modal>
			)}

			{displayReferralHistoryModal && (
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#27339D',
						marginTop: 60,
					}}
					visible={displayReferralHistoryModal}
					width={500}
					footer={null}
					onCancel={() => {
						setDisplayReferralHistoryModal(false);
					}}
				>
					<h2 style={{ fontWeight: '600', color: 'white' }}>
						Referral History Config
					</h2>

					<div className="mb-4">
						<div style={{ fontSize: 16 }} className="mb-2">
							Currency
							<div style={{ fontSize: 13 }}>
								Currency to track earnings for analysis purposes
							</div>
						</div>

						<Select
							showSearch
							className="select-box"
							placeholder="Select asset for p/l analysis"
							value={referralHistoryData.currency}
							style={{ width: 250 }}
							onChange={(e) => {
								setReferralHistoryData({
									...referralHistoryData,
									currency: e,
								});
							}}
						>
							{Object.keys(coins).map((key) => (
								<Select.Option value={key}>{coins[key].fullname}</Select.Option>
							))}
						</Select>
					</div>

					<div className="mb-4">
						<div style={{ fontSize: 16 }} className="mb-2">
							Earning Rate
							<div style={{ fontSize: 13 }}>
								Earning rate referee users receive from affiliated users fees
							</div>
						</div>

						<Select
							showSearch
							className="select-box"
							placeholder="Select earning rate"
							value={referralHistoryData.earning_rate}
							style={{ width: 250 }}
							onChange={(e) => {
								setReferralHistoryData({
									...referralHistoryData,
									earning_rate: e,
								});
							}}
						>
							{[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((rate) => (
								<Select.Option value={rate}>{rate}</Select.Option>
							))}
						</Select>
					</div>

					<div className="mb-4">
						<div style={{ fontSize: 16 }} className="mb-2">
							Earning Period
							<div style={{ fontSize: 13 }}>
								Number of months referee users earn affiliated users fees. Set
								to 0 for no earning expiry
							</div>
						</div>

						<Input
							value={referralHistoryData.earning_period}
							onChange={(e) => {
								setReferralHistoryData({
									...referralHistoryData,
									earning_period: Number(e.target.value),
								});
							}}
						/>
					</div>
					<div className="mb-4">
						<div style={{ fontSize: 16 }} className="mb-2">
							Minimum amount
							<div style={{ fontSize: 13 }}>
								Minimum amount reqired to settle fees
							</div>
						</div>

						<Input
							value={referralHistoryData.minimum_amount}
							onChange={(e) => {
								setReferralHistoryData({
									...referralHistoryData,
									minimum_amount: Number(e.target.value),
								});
							}}
						/>
					</div>

					<div className="mb-4">
						<div style={{ fontSize: 16 }} className="mb-2">
							Distributor ID
							<div style={{ fontSize: 13 }}>
								Account ID to send settled fees from
							</div>
						</div>

						<Input
							value={referralHistoryData.distributor_id}
							onChange={(e) => {
								setReferralHistoryData({
									...referralHistoryData,
									distributor_id: Number(e.target.value),
								});
							}}
						/>
					</div>

					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 15,
							justifyContent: 'space-between',
							marginTop: 30,
						}}
					>
						<Button
							onClick={() => {
								setDisplayReferralHistoryModal(false);
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							Back
						</Button>
						<Button
							onClick={async () => {
								if (
									referralHistoryData.currency == null ||
									referralHistoryData.earning_rate == null ||
									referralHistoryData.minimum_amount == null ||
									referralHistoryData.earning_period == null ||
									referralHistoryData.distributor_id == null
								) {
									message.error('Please input all the fields');
									return;
								}
								setIsSubmit(true);
								handleSubmit(form.getFieldsValue());
								setDisplayReferralHistoryModal(false);
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							Proceed
						</Button>
					</div>
				</Modal>
			)}
			{displayChainTradeModal && (
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#27339D',
						marginTop: 60,
					}}
					visible={displayChainTradeModal}
					width={500}
					footer={null}
					onCancel={() => {
						setDisplayChainTradeModal(false);
					}}
				>
					<h2 style={{ fontWeight: '600', color: 'white' }}>
						Chain Trade Config
					</h2>

					<div className="mb-4">
						<div style={{ fontSize: 16 }} className="mb-2">
							Currency
							<div style={{ fontSize: 13 }}>
								Currency to set as main source coin
							</div>
						</div>

						<Select
							showSearch
							className="select-box"
							placeholder="Select main asset for source account"
							value={chainTradeData.currency}
							style={{ width: 250 }}
							onChange={(e) => {
								setChainTradeData({
									...chainTradeData,
									currency: e,
								});
							}}
						>
							{Object.keys(coins).map((key) => (
								<Select.Option value={key}>{coins[key].fullname}</Select.Option>
							))}
						</Select>
					</div>

					<div className="mb-4">
						<div style={{ fontSize: 16 }} className="mb-2">
							Source Account ID
							<div style={{ fontSize: 13 }}>
								Account ID to send to manage chain trades from
							</div>
						</div>

						<Input
							value={chainTradeData.source_account}
							onChange={(e) => {
								setChainTradeData({
									...chainTradeData,
									source_account: Number(e.target.value),
								});
							}}
						/>
					</div>

					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 15,
							justifyContent: 'space-between',
							marginTop: 30,
						}}
					>
						<Button
							onClick={() => {
								setDisplayChainTradeModal(false);
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							Back
						</Button>
						<Button
							onClick={async () => {
								if (
									chainTradeData.currency == null ||
									chainTradeData.source_account == null
								) {
									message.error('Please input all the fields');
									return;
								}
								setIsSubmit(true);
								handleSubmit(form.getFieldsValue());
								setDisplayChainTradeModal(false);
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							Proceed
						</Button>
					</div>
				</Modal>
			)}

			<div className="sub-title">Features</div>
			<div className="description">
				Select the features that will be available on your exchange.
			</div>
			<Form
				form={form}
				name="interface-form"
				initialValues={initialValue}
				onFinish={handleSubmitData}
				onValuesChange={handleValuesChange}
				className="disable-button"
			>
				<div className="interface-box">
					<Item name="pro_trade" valuePropName="checked">
						<Checkbox className="mt-3">
							<div className="d-flex align-items-center">
								<ReactSVG
									src={STATIC_ICONS.CANDLES_LOGO}
									className="feature-icon mr-1"
								/>
								<div className="ml-2 checkbox-txt">
									Pro trade (Market)
									<div className="small-text">
										(Chart, orderbook, limit orders with wallet)
									</div>
								</div>
							</div>
						</Checkbox>
					</Item>
					<Item name="quick_trade" valuePropName="checked">
						<Checkbox className="mt-3">
							<div className="d-flex align-items-center">
								<div className="feature-trade-box mr-1">
									<div className="interface_container">
										<div className="sell">
											<span className="label">SELL</span>
										</div>
										<div className="buy">
											<span className="label">BUY</span>
										</div>
									</div>
								</div>
								<div className="ml-2 checkbox-txt">
									Quick trade (Convert)
									<div className="d-flex justify-content-between">
										<div className="small-text">
											(Simple buy/sell interface with wallet)
										</div>
									</div>
								</div>
							</div>
						</Checkbox>
					</Item>
					<Item name="stake_page" valuePropName="checked">
						<Checkbox className="mt-3">
							<div className="d-flex align-items-center">
								<div className="feature-trade-box mr-1">
									<ReactSVG
										src={STATIC_ICONS.STAKE_FEATURE}
										className="d-flex feature-icon justify-content-center mr-1 mt-1 ml-3 pl-1"
										beforeInjection={(svg) => {
											svg.setAttribute('style', 'width: 60px');
										}}
									/>
								</div>
								<div className="ml-2 checkbox-txt">
									Defi Staking
									<div className="small-text">
										(Lock coins and distribute crypto rewards for Defi)
									</div>
								</div>
							</div>
						</Checkbox>
					</Item>

					<Item name="cefi_stake" valuePropName="checked">
						<Checkbox className="mt-3">
							<div className="d-flex align-items-center">
								<div className="feature-trade-box mr-1">
									<ReactSVG
										src={STATIC_ICONS.STAKE_FEATURE}
										className="d-flex feature-icon justify-content-center mr-1 mt-1 ml-3 pl-1"
										beforeInjection={(svg) => {
											svg.setAttribute('style', 'width: 60px');
										}}
									/>
								</div>
								<div className="ml-2 checkbox-txt">
									Cefi Staking
									<div className="small-text">
										(Lock coins and distribute crypto rewards for Cefi)
									</div>
								</div>
							</div>
						</Checkbox>
					</Item>

					{!isFiatUpgrade && (
						<Item name="balance_history_config" valuePropName="checked">
							<Checkbox className="mt-3">
								<div className="d-flex align-items-center">
									<ReactSVG
										src={STATIC_ICONS.CANDLES_LOGO}
										className="feature-icon mr-1"
									/>
									<div className="ml-2 checkbox-txt">
										Profit&Loss Analytics
										<div className="small-text">
											(User Balance History, P/L analysis)
										</div>
									</div>
								</div>
							</Checkbox>
						</Item>
					)}

					{!isFiatUpgrade && (
						<Item name="p2p_config" valuePropName="checked">
							<Link to={'/admin/trade?tab=3'}>
								<Checkbox
									checked={constants?.kit?.p2p_config?.enable}
									className="mt-3"
								>
									<div className="d-flex align-items-center">
										<div
											style={{
												backgroundColor: '#050596',
												height: 50,
												textAlign: 'center',
											}}
										>
											<ReactSVG
												src={STATIC_ICONS.P2P_FEATURE}
												className="feature-icon mr-1"
											/>
										</div>

										<div className="ml-2 checkbox-txt">
											P2P
											<div className="small-text">
												(P2P Trading for merchants and exchange users)
											</div>
										</div>
									</div>
								</Checkbox>
							</Link>
						</Item>
					)}

					{!isFiatUpgrade && (
						<Item name="referral_history_config" valuePropName="checked">
							<Checkbox className="mt-3">
								<div className="d-flex align-items-center">
									<span
										style={{
											backgroundColor: '#050596',
											textAlign: 'center',
											height: 50,
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<ReactSVG
											src={STATIC_ICONS.REFERRAL_ICON}
											className="feature-icon mr-1"
										/>
									</span>
									<div className="ml-2 checkbox-txt">
										Referral System{' '}
										{referralHistoryData.active && (
											<span
												style={{
													padding: 5,
													position: 'relative',
													left: 5,
													bottom: 5,
													color: 'white',
													backgroundColor: '#288500',
													cursor: 'pointer',
												}}
												onClick={(e) => {
													e.stopPropagation();
													e.preventDefault();
													setDisplayReferralHistoryModal(true);
												}}
											>
												Configure
											</span>
										)}
										<div className="small-text">
											(User referral system with analytics)
										</div>
									</div>
								</div>
							</Checkbox>
						</Item>
					)}

					{!isFiatUpgrade && (
						<Item name="chain_trade_config" valuePropName="checked">
							<Checkbox className="mt-3">
								<div className="d-flex align-items-center">
									<span
										style={{
											backgroundColor: '#050596',
											textAlign: 'center',
											height: 50,
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<ReactSVG
											src={STATIC_ICONS.MPESA_ICON}
											className="d-flex feature-icon justify-content-center mr-2 mt-3 ml-1 pl-1"
											beforeInjection={(svg) => {
												svg.setAttribute('style', 'width: 60px');
											}}
										/>
									</span>
									<div className="ml-2 checkbox-txt">
										Chain Trading{' '}
										{chainTradeData.active && (
											<span
												style={{
													padding: 5,
													position: 'relative',
													left: 5,
													bottom: 5,
													color: 'white',
													backgroundColor: '#288500',
													cursor: 'pointer',
												}}
												onClick={(e) => {
													e.stopPropagation();
													e.preventDefault();
													setDisplayChainTradeModal(true);
												}}
											>
												Configure
											</span>
										)}
										<div className="small-text">
											(Enable Chain Trading for Users)
										</div>
									</div>
								</div>
							</Checkbox>
						</Item>
					)}

					<div className="d-flex">
						<div
							className={classnames('interface-item', {
								'disabled-area': isFiatUpgrade,
							})}
						>
							<Item name="ultimate_fiat" valuePropName="checked">
								<Checkbox className="mt-3">
									<div className="d-flex align-items-center">
										<div className="feature-trade-box mr-1">
											<ReactSVG
												src={STATIC_ICONS.MPESA_ICON}
												className="d-flex feature-icon justify-content-center mr-2 mt-3 ml-1 pl-1"
												beforeInjection={(svg) => {
													svg.setAttribute('style', 'width: 60px');
												}}
											/>
										</div>
										<div className="ml-2 checkbox-txt">
											Fiat Controls
											<div className="small-text">
												(On & off ramping and tracking for fiat assets)
											</div>
										</div>
									</div>
								</Checkbox>
							</Item>
						</div>
						{isFiatUpgrade && (
							<div className="d-flex">
								<div className="d-flex align-items-center justify-content-between upgrade-section mt-2 mb-5">
									<div>
										<div className="font-weight-bold">
											Powerful fiat ramping
										</div>
										<div>Cash in and out with fiat ramps</div>
									</div>
									<div className="ml-5 button-wrapper">
										<a
											href="https://dash.hollaex.com/billing"
											target="_blank"
											rel="noopener noreferrer"
										>
											<Button type="primary" className="w-100">
												Upgrade Now
											</Button>
										</a>
									</div>
								</div>
							</div>
						)}
					</div>

					<div className="d-flex">
						<div
							className={classnames('interface-item', {
								'disabled-area': isUpgrade,
							})}
						>
							<Item name="chat" valuePropName="checked">
								<Checkbox className="mt-3">
									<div className="d-flex align-items-center">
										<div className="feature-trade-box mr-1">
											<ReactSVG
												src={STATIC_ICONS.CHAT_FEATURE_ICON}
												className="feature-chat-icon"
											/>
										</div>
										<div className="ml-2 checkbox-txt">
											Chat system
											<div className="d-flex justify-content-between">
												<div className="small-text">
													(Usernames, text and emoji communication)
												</div>
											</div>
										</div>
									</div>
								</Checkbox>
							</Item>
						</div>
						{isUpgrade && (
							<div className="d-flex">
								<div className="d-flex align-items-center justify-content-between upgrade-section mt-2 mb-5">
									<div>
										<div className="font-weight-bold">
											Start your crypto culture
										</div>
										<div>Allow your users to socialize through chat</div>
									</div>
									<div className="ml-5 button-wrapper">
										<a
											href="https://dash.hollaex.com/billing"
											target="_blank"
											rel="noopener noreferrer"
										>
											<Button type="primary" className="w-100">
												Upgrade Now
											</Button>
										</a>
									</div>
								</div>
							</div>
						)}
					</div>

					<div className="d-flex">
						<div
							className={classnames('interface-item', {
								'disabled-area': isUpgrade,
							})}
						>
							<Item name="home_page" valuePropName="checked">
								<Checkbox className="mt-3">
									<div className="d-flex align-items-center">
										<div className="feature-trade-box mr-1">
											<ReactSVG
												src={STATIC_ICONS.HOME_PAGE_FEATURE_ICON}
												className="feature-chat-icon"
											/>
										</div>
										<div className="ml-2 checkbox-txt">
											Homepage
											<div className="d-flex justify-content-between">
												<div className="small-text">
													(This will be the first page seen on your domain)
												</div>
											</div>
										</div>
									</div>
								</Checkbox>
							</Item>
						</div>
						{isUpgrade && (
							<div className="d-flex">
								<div className="d-flex align-items-center justify-content-between upgrade-section mt-2 mb-5">
									<div>
										<div className="font-weight-bold">
											Make a good first impression
										</div>
										<div>Add a customizable landing page</div>
									</div>
									<div className="ml-5 button-wrapper">
										<a
											href="https://dash.hollaex.com/billing"
											target="_blank"
											rel="noopener noreferrer"
										>
											<Button type="primary" className="w-100">
												Upgrade Now
											</Button>
										</a>
									</div>
								</div>
							</div>
						)}
					</div>

					<div className="d-flex">
						<div
							className={classnames('interface-item', {
								'disabled-area': isUpgrade,
							})}
						>
							<Item name="apps" valuePropName="checked">
								<Checkbox className="mt-3">
									<div className="d-flex align-items-center">
										<div className="feature-trade-box mr-1">
											<ReactSVG
												src={STATIC_ICONS.APPS_FEATURE_ICON}
												className="feature-apps-icon"
											/>
										</div>
										<div className="ml-2 checkbox-txt">
											Apps
											<div className="d-flex justify-content-between">
												<div className="small-text">
													(Give your users extra exchange applications)
												</div>
											</div>
										</div>
									</div>
								</Checkbox>
							</Item>
						</div>
						{isUpgrade && (
							<div className="d-flex">
								<div className="d-flex align-items-center justify-content-between upgrade-section mt-2 mb-5">
									<div>
										<div className="font-weight-bold">
											First exchange app store
										</div>
										<div>Add more exchange functionality</div>
									</div>
									<div className="ml-5 button-wrapper">
										<a
											href="https://dash.hollaex.com/billing"
											target="_blank"
											rel="noopener noreferrer"
										>
											<Button type="primary" className="w-100">
												Upgrade Now
											</Button>
										</a>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
				<div>
					<FormButton
						type="primary"
						htmlType="submit"
						disabled={isSubmit}
						buttonText="save"
					/>
				</div>
			</Form>
		</div>
	);
};

export default InterfaceForm;
