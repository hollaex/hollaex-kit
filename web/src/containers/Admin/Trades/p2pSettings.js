/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	Tabs,
	message,
	Modal,
	Button,
	Select,
	Checkbox,
	Input,
	Switch,
	Radio,
	Space,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { setExchange } from 'actions/assetActions';
import { requestTiers } from '../Tiers/action';
import { updateConstants, requestUsers } from './actions';
import { requestAdminData } from 'actions/appActions';
import { Coin } from 'components';
import _debounce from 'lodash/debounce';
import Coins from '../Coins';
import _toLower from 'lodash/toLower';
import DEFAULT_PAYMENT_METHODS from 'utils/defaultPaymentMethods';
import './index.css';

const TabPane = Tabs.TabPane;

const P2PSettings = ({ coins, pairs, p2p_config, features, constants }) => {
	const [displayP2pModel, setDisplayP2pModel] = useState(false);
	const [displayFiatAdd, setDisplayFiatAdd] = useState(false);
	const [displayPaymentAdd, setDisplayPaymentAdd] = useState(false);
	const [displayNewPayment, setDisplayNewPayment] = useState(false);
	const [paymentFieldAdd, setPaymentFieldAdd] = useState(false);
	const [step, setStep] = useState(0);

	const [side, setSide] = useState();
	const [digitalCurrencies, setDigitalCurrencies] = useState([]);
	const [fiatCurrencies, setFiatCurrencies] = useState([]);
	const [tiers, setTiers] = useState();
	const [merchantTier, setMerchantTier] = useState();
	const [userTier, setUserTier] = useState();
	const [paymentMethod, setPaymentMethod] = useState({
		system_name: null,
		fields: {},
	});
	const [customFields, setCustomFields] = useState([
		{
			id: 1,
			name: null,
			required: true,
		},
	]);
	const [customField, setCustomField] = useState({
		id: null,
		name: null,
		required: null,
	});

	const [paymentMethods, setPaymentMethods] = useState(DEFAULT_PAYMENT_METHODS);

	const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([]);

	const [merchantFee, setMerchantFee] = useState();
	const [userFee, setUserFee] = useState();
	const [sourceAccount, setSourceAccount] = useState();
	const [editMode, setEditMode] = useState(false);
	const [enable, setEnable] = useState(false);
	const [emailOptions, setEmailOptions] = useState([]);
	const [selectedEmailData, setSelectedEmailData] = useState({});
	const [p2pConfig, setP2pConfig] = useState({});
	const searchRef = useRef(null);
	const [filterMethod, setFilterMethod] = useState();
	const [filterFiat, setFilterFiat] = useState();
	const [methodEditMode, setMethodEditMode] = useState(false);
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

	useEffect(() => {
		setEnable(p2p_config?.enable);
		setSide(p2p_config?.side);
		setDigitalCurrencies(p2p_config?.digital_currencies || []);
		setFiatCurrencies(p2p_config?.fiat_currencies || []);
		setMerchantTier(p2p_config?.starting_merchant_tier);
		setUserTier(p2p_config?.starting_user_tier);
		setSelectedPaymentMethods(p2p_config?.bank_payment_methods || []);
		setMerchantFee(p2p_config?.merchant_fee);
		setUserFee(p2p_config?.user_fee);
		setSourceAccount(p2p_config?.source_account);
		if (p2p_config?.source_account) {
			getAllUserData({ id: p2p_config?.source_account }).then((res) => {
				let emailData = {};
				res &&
					res?.forEach((item) => {
						if (item.value === p2p_config?.source_account) {
							emailData = item;
						}
					});
				setSelectedEmailData(emailData);
				setSourceAccount(Number(p2p_config?.source_account));
			});
		}
		setP2pConfig(p2p_config);

		let methods = [];
		paymentMethods.forEach((method) => {
			if (
				!p2p_config?.bank_payment_methods?.find(
					(x) => x.system_name == method.system_name
				)
			) {
				methods.push(method);
			}
		});

		if (p2p_config?.bank_payment_methods?.length > 0) {
			setPaymentMethods([...p2p_config?.bank_payment_methods, ...methods]);
		}
	}, []);

	const handleEmailChange = (value) => {
		let emailId = parseInt(value);
		let emailData = {};
		emailOptions &&
			emailOptions.forEach((item) => {
				if (item.value === emailId) {
					emailData = item;
				}
			});

		setSelectedEmailData(emailData);
		setSourceAccount(Number(emailId));

		handleSearch(emailData.label);
	};

	const searchUser = (searchText, type) => {
		getAllUserData({ search: searchText }, type);
	};

	const handleSearch = _debounce(searchUser, 1000);

	const getAllUserData = async (params = {}) => {
		try {
			const res = await requestUsers(params);
			if (res && res.data) {
				const userData = res.data.map((user) => ({
					label: user.email,
					value: user.id,
				}));
				setEmailOptions(userData);

				return userData;
			}
		} catch (error) {
			return error;
		}
	};

	const handleEditInput = () => {
		if (searchRef && searchRef.current && searchRef.current.focus) {
			searchRef.current.focus();
		}
	};
	const handleUpgrade = (info = {}) => {
		if (
			_toLower(info.plan) !== 'fiat' &&
			_toLower(info.plan) !== 'boost' &&
			_toLower(info.type) !== 'enterprise'
		) {
			return true;
		} else {
			return false;
		}
	};

	const isUpgrade = handleUpgrade(constants.info);
	return isUpgrade ? (
		<div className="d-flex">
			<div className="d-flex align-items-center justify-content-between upgrade-section mt-2 mb-5">
				<div>
					<div className="font-weight-bold">Enable P2P Trading</div>
					<div>
						Enable peer-to-peer trading between merchants and exchange users
					</div>
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
	) : (
		<div className="admin-earnings-container w-100">
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div>
					Below is the status of the P2P system on your platform and the
					settings. Select what assets, KYC requirements and more are allowed on
					your platform.
				</div>
				<div>
					<Button
						onClick={() => {
							setEditMode(true);
							setDisplayP2pModel(true);
						}}
						style={{
							backgroundColor: '#288500',
							color: 'white',
							flex: 1,
							height: 35,
						}}
						type="default"
					>
						Edit Settings
					</Button>
					{p2pConfig?.enable !== null && (
						<div style={{ marginTop: 15 }}>
							Enable{' '}
							<Switch
								checked={enable}
								onChange={async (e) => {
									try {
										await updateConstants({
											kit: {
												features: {
													...features,
													p2p: e,
												},
												p2p_config: {
													enable: e,
													bank_payment_methods: selectedPaymentMethods,
													starting_merchant_tier: merchantTier,
													starting_user_tier: userTier,
													digital_currencies: digitalCurrencies,
													fiat_currencies: fiatCurrencies,
													side: side,
													merchant_fee: merchantFee,
													user_fee: userFee,
													source_account: sourceAccount,
												},
											},
										});
										requestAdminData().then((res) => {
											const result = res?.data?.kit?.p2p_config;
											setEnable(result?.enable);
											setSide(result?.side);
											setDigitalCurrencies(result?.digital_currencies);
											setFiatCurrencies(result?.fiat_currencies);
											setMerchantTier(result?.starting_merchant_tier);
											setUserTier(result?.starting_user_tier);
											setSelectedPaymentMethods(result?.bank_payment_methods);
											setMerchantFee(result?.merchant_fee);
											setUserFee(result?.user_fee);
											setSourceAccount(result?.source_account);
											setP2pConfig(result);
										});
									} catch (error) {
										message.error(error.data.message);
									}
								}}
							/>
						</div>
					)}
				</div>
			</div>
			{p2pConfig?.side == null && (
				<div
					style={{
						padding: 20,
						backgroundColor: 'rgba(255, 255, 255, 0.1)',
						width: 600,
					}}
				>
					<div>
						Currently the P2P markets have not been setup on your exchange.
					</div>
					<div
						style={{ cursor: 'pointer' }}
						onClick={() => {
							setDisplayP2pModel(true);
						}}
					>
						→ Click here to set up P2P trading
					</div>
				</div>
			)}
			<div style={{ opacity: enable ? 1 : 0.5 }}>
				<div style={{ marginBottom: 10, marginTop: 10 }}>
					<div style={{ fontSize: 20, marginBottom: 10, marginTop: 10 }}>
						Sides
					</div>
					<div style={{ marginBottom: 10 }}>
						Trade sides allowed: {p2pConfig?.side}{' '}
					</div>
					<div style={{ borderBottom: '1px solid grey', width: 600 }}></div>
				</div>

				<div style={{ marginBottom: 10, marginTop: 10 }}>
					<div style={{ fontSize: 20, marginBottom: 10, marginTop: 10 }}>
						Crypto:
					</div>
					<div style={{ marginBottom: 10 }}>
						Cryptocurrencies allowed for trading:{' '}
						{p2pConfig?.digital_currencies
							?.filter((x) => x === 'usdt')
							?.join(', ')}
					</div>
					<div style={{ borderBottom: '1px solid grey', width: 600 }}></div>
				</div>

				<div style={{ marginBottom: 10, marginTop: 10 }}>
					<div style={{ fontSize: 20, marginBottom: 10, marginTop: 10 }}>
						Fiat:
					</div>
					<div style={{ marginBottom: 10 }}>
						Fiat currencies allowed for trading:{' '}
						{p2pConfig?.fiat_currencies?.join(', ')}
					</div>
					<div style={{ borderBottom: '1px solid grey', width: 600 }}></div>
				</div>

				<div style={{ marginBottom: 10, marginTop: 10 }}>
					<div style={{ fontSize: 20, marginBottom: 10, marginTop: 10 }}>
						Payment methods:
					</div>
					<div style={{ marginBottom: 10 }}>
						Outside payment methods allowed:{' '}
						{p2pConfig?.bank_payment_methods
							?.map((x) => x.system_name)
							?.join(', ')}
					</div>
					<div style={{ borderBottom: '1px solid grey', width: 600 }}></div>
				</div>

				<div style={{ marginBottom: 10, marginTop: 10 }}>
					<div style={{ fontSize: 20, marginBottom: 10, marginTop: 10 }}>
						Manage:
					</div>
					<div style={{ marginBottom: 10 }}>
						Merchant fee: {p2pConfig?.merchant_fee}%
					</div>
					<div style={{ marginBottom: 10 }}>
						Buyer fee: {p2pConfig?.user_fee}%
					</div>
					<div style={{ borderBottom: '1px solid grey', width: 600 }}></div>
				</div>

				<div style={{ marginBottom: 10, marginTop: 10 }}>
					<div style={{ fontSize: 20, marginBottom: 10, marginTop: 10 }}>
						Fee Source Account:
					</div>
					<div style={{ marginBottom: 10 }}>
						{selectedEmailData?.label || '-'}
					</div>
					<div style={{ borderBottom: '1px solid grey', width: 600 }}></div>
				</div>
			</div>

			{displayP2pModel && (
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#27339D',
						marginTop: 60,
					}}
					visible={displayP2pModel}
					width={600}
					footer={null}
					onCancel={() => {
						setEditMode(false);
						setDisplayP2pModel(false);
					}}
				>
					<h1 style={{ fontWeight: '600', color: 'white' }}>P2P setup</h1>

					{step === 0 && (
						<div>
							<div style={{ color: 'white' }}>Trade direction (side)</div>
							<div style={{ color: 'white' }}>
								Select what kind of deals that the vendors (market makers) can
								advertise.
							</div>

							<Select
								showSearch
								className="select-box mt-3"
								placeholder="Vendor sells crypto only"
								value={side}
								onChange={(e) => {
									setSide(e);
								}}
							>
								<Select.Option value={'sell'}>Sell</Select.Option>
								<Select.Option value={'buy'}>Buy</Select.Option>
								<Select.Option value={'all'}>All</Select.Option>
							</Select>

							<div
								style={{
									fontSize: 13,
									marginTop: 10,
									marginBottom: 10,
									color: 'white',
								}}
							>
								Vendors (makers) can only offer to sell crypto to users (takers)
							</div>
							<div
								style={{ borderBottom: '1px solid grey', marginBottom: 30 }}
							></div>
							<div style={{ color: 'white' }}>Crypto assets</div>
							<div style={{ color: 'white' }}>
								Select the crypto assets that vendors can transact with
							</div>
							<Select
								showSearch={true}
								className="w-100 select-box mt-3"
								dropdownClassName="p2p-admin-select-asset"
								placeholder="Select the assets"
								mode="multiple"
								tagRender={() => null}
							>
								{Object.values(coins || {}).map((coin) => {
									return (
										<Select.Option
											key={coin.fullname}
											value={coin.fullname}
											disabled={true}
										>
											<div>
												<Checkbox
													style={{ color: '#000' }}
													checked={digitalCurrencies.includes(coin.symbol)}
													onChange={(e) => {
														if (e.target.checked) {
															if (!digitalCurrencies.includes(coin.symbol)) {
																const updatedCurrencies = [
																	...digitalCurrencies,
																	coin.symbol,
																];
																setDigitalCurrencies(updatedCurrencies);
																localStorage.setItem(
																	'digitalCurrencies',
																	JSON.stringify(updatedCurrencies)
																);
															}
														} else {
															if (digitalCurrencies.includes(coin.symbol)) {
																const updatedCurrencies = [
																	...digitalCurrencies,
																].filter((symbol) => symbol !== coin.symbol);
																setDigitalCurrencies(updatedCurrencies);
																localStorage.setItem(
																	'digitalCurrencies',
																	JSON.stringify(updatedCurrencies)
																);
															}
														}
													}}
												>
													<span className="mr-2">
														<Coin
															type="CS5"
															iconId={coins[coin?.symbol].icon_id}
														></Coin>
													</span>
													<span>
														{coin.fullname}({coin?.symbol?.toUpperCase()})
													</span>
												</Checkbox>
											</div>
										</Select.Option>
									);
								})}
							</Select>
						</div>
					)}

					{step === 1 && (
						<div>
							<div>Fiat currencies</div>
							<div>
								Select the fiat currencies to be used for P2P trading on your
								platform.
							</div>

							<div
								style={{
									marginTop: 10,
									marginBottom: 10,
									textDecoration: 'underline',
									cursor: 'pointer',
								}}
								onClick={() => {
									setDisplayFiatAdd(true);
								}}
							>
								Add a fiat currency
							</div>

							<div
								style={{
									display: 'flex',
									// justifyContent: 'center',
									// alignItems: 'center',
									backgroundColor: '#192491',
									padding: 14,
									// textAlign: 'center',
								}}
							>
								{fiatCurrencies.length === 0 ? (
									<>
										<div>No fiat asset added yet.</div>
										<div
											onClick={() => {
												setDisplayFiatAdd(true);
											}}
										>
											Add here
										</div>
									</>
								) : (
									<div>
										{fiatCurrencies.map((symbol) => {
											return (
												<div>
													<span style={{ display: 'flex' }}>
														<Coins type={symbol} />{' '}
														<span
															style={{ position: 'relative', top: 8, left: 5 }}
														>
															{' '}
															{symbol?.toUpperCase()}
														</span>
														<span
															style={{
																marginTop: 7,
																marginLeft: 10,
																textDecoration: 'underline',
																fontWeight: 'bold',
																cursor: 'pointer',
															}}
															onClick={() => {
																setFiatCurrencies(
																	[...fiatCurrencies].filter(
																		(x) => x !== symbol
																	)
																);
															}}
														>
															X
														</span>
													</span>
												</div>
											);
										})}
									</div>
								)}
							</div>
						</div>
					)}

					{step === 2 && (
						<div>
							<h2>Requirements</h2>
							<p>
								Set the minimum account tier required for users and vendor to
								use and create P2P trades.
							</p>
							<p>
								Users are the end users accessing the P2P trade and Vendors are
								the users who create P2P deals. Vendors (market makers) can
								setup public P2P deals with their own prices however should be
								held to a higher standard as stipulated from your account tier
								levels.
							</p>

							<div style={{ marginBottom: 40 }}>
								<div style={{ fontSize: 18 }}>User account minimum tier</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>
										{' '}
										Minimum tier for the user's account to participate in P2P
										trading
									</span>{' '}
									(it is recommended to select a tier level that requires KYC
									verification)
								</div>
								<Select
									showSearch
									className="select-box"
									placeholder="Select a tier level:"
									value={userTier}
									style={{ width: 120 }}
									onChange={(e) => {
										setUserTier(e);
									}}
								>
									{Object.values(tiers || {}).map((tier) => {
										return (
											<Select.Option value={tier.id}>{tier.name}</Select.Option>
										);
									})}
								</Select>
							</div>

							<div style={{ fontSize: 18 }}>Vendor account minimum tier</div>
							<div>
								<span style={{ fontWeight: 'bold' }}>
									{' '}
									Minimum tier account level to be a Vender
								</span>{' '}
								(higher or equal than user account)
							</div>
							<Select
								showSearch
								className="select-box"
								placeholder="Select a tier level:"
								style={{ marginBottom: 40, width: 120 }}
								value={merchantTier}
								onChange={(e) => {
									setMerchantTier(e);
								}}
							>
								{Object.values(tiers || {}).map((tier) => {
									return (
										<Select.Option value={tier.id}>{tier.name}</Select.Option>
									);
								})}
							</Select>
						</div>
					)}

					{step === 3 && (
						<div>
							<div>Payment methods</div>
							<div>
								Select the fiat payment methods that will be used to settle
								transactions between P2P buyers and sellers. These methods will
								be used outside of your platform and should ideally include the
								fiat currencies that you have enabled for P2P trading on your
								platform.
							</div>

							<div
								style={{
									marginTop: 10,
									marginBottom: 10,
									cursor: 'pointer',
									textDecoration: 'underline',
								}}
								onClick={() => setDisplayPaymentAdd(true)}
							>
								Add/create a method
							</div>

							<div
								style={{
									display: 'flex',
									// justifyContent: 'center',
									// alignItems: 'center',
									backgroundColor: '#192491',
									padding: 14,
									// textAlign: 'center',
								}}
							>
								{selectedPaymentMethods.length === 0 ? (
									<>
										<div>No payment accounts added yet.</div>
										<div
											onClick={() => {
												setDisplayPaymentAdd(true);
											}}
										>
											Add here
										</div>
									</>
								) : (
									<div>
										{selectedPaymentMethods.map((x, index) => {
											return (
												<div>
													<span>{x.system_name}</span>
													<span
														style={{
															marginLeft: 10,
															textDecoration: 'underline',
															fontWeight: 'bold',
															cursor: 'pointer',
														}}
														onClick={() => {
															setDisplayNewPayment(true);
															setMethodEditMode(true);
															setCustomFields(x.fields);
															setPaymentMethod({
																...paymentMethod,
																system_name: x.system_name,
																selected_index: index,
															});
														}}
													>
														EDIT
													</span>
													<span
														style={{
															marginLeft: 10,
															textDecoration: 'underline',
															fontWeight: 'bold',
															cursor: 'pointer',
														}}
														onClick={() => {
															setSelectedPaymentMethods(
																[...selectedPaymentMethods].filter(
																	(a) => a.system_name !== x.system_name
																)
															);
														}}
													>
														X
													</span>
												</div>
											);
										})}
									</div>
								)}
							</div>
							{/* <div style={{display: 'flex', display:'column',  justifyContent:'center', alignItems: 'center', backgroundColor: '#192491', padding: 10, width: '90%'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <div>ICON</div>
                                    <div>🆕 PayPal (Custom)</div>
                                    <div>EDIT</div>
                                    <div>REMOVE</div>
                                </div>
                            </div> */}
						</div>
					)}

					{step === 4 && (
						<div>
							<div>Platform management fees</div>
							<div>
								Apply a trading fee upon every P2P transaction that uses your
								platform. The fee percentage will be split between both vendor
								(maker) and user (taker) evenly.
							</div>

							<div style={{ marginBottom: 20 }}>
								<div style={{ fontWeight: 'bold' }}>
									P2P Vendor percent trade fee
								</div>
								<Input
									placeholder="Input percentage fee"
									value={merchantFee}
									onChange={(e) => {
										setMerchantFee(e.target.value);
									}}
								/>
							</div>

							<div style={{ marginBottom: 20 }}>
								<div style={{ fontWeight: 'bold' }}>
									P2P Buyer percent trade fee
								</div>
								<Input
									placeholder="Input percentage fee"
									value={userFee}
									onChange={(e) => {
										setUserFee(e.target.value);
									}}
								/>
							</div>

							<div className="mb-5">
								<div className="mb-2">Account to send the fees to</div>
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
										value={selectedEmailData && selectedEmailData.label}
										onChange={(text) => handleEmailChange(text)}
										showAction={['focus', 'click']}
										style={{ width: 200 }}
									>
										{emailOptions &&
											emailOptions.map((email) => (
												<Option key={email.value}>{email.label}</Option>
											))}
									</Select>
									<div
										className="edit-link"
										style={{ marginLeft: 10 }}
										onClick={handleEditInput}
									>
										Edit
									</div>
								</div>
							</div>

							<div style={{ marginBottom: 20 }}>
								<div>Vendor fee: {merchantFee || 0}%</div>
								<div>User fee:{userFee || 0}%</div>
							</div>

							<div>
								The minimum fee allowed to apply is dependent on exchange
								system's plan:
							</div>
							<div>https://www.hollaex.com/pricing</div>
						</div>
					)}

					{step === 5 && (
						<div>
							<div>Review and confirm</div>
							<div>Below are your P2P settings</div>

							<div>
								Please check the details below are correct and confirm.{' '}
							</div>
							<div style={{ marginBottom: 10 }}>
								After confirming the P2P market page will be in view and
								available for user merchants and traders
							</div>

							<div
								style={{
									width: '90%',
									border: '1px solid white',
									marginBottom: 20,
									padding: 20,
								}}
							>
								<div
									style={{ display: 'flex', justifyContent: 'space-between' }}
								>
									<div>
										<div>Type of P2P deals:</div>
										<div>{side?.toUpperCase()}</div>
									</div>
									<div
										onClick={() => {
											setStep(0);
										}}
										style={{ cursor: 'pointer' }}
									>
										EDIT
									</div>
								</div>
							</div>

							<div
								style={{
									width: '90%',
									border: '1px solid white',
									marginBottom: 20,
									padding: 20,
								}}
							>
								<div
									style={{ display: 'flex', justifyContent: 'space-between' }}
								>
									<div>
										<div>Cryptocurrencies allowed for trading: </div>
										<div>{digitalCurrencies.join(', ')}</div>
									</div>
									<div
										onClick={() => {
											setStep(0);
										}}
										style={{ cursor: 'pointer' }}
									>
										EDIT
									</div>
								</div>
							</div>

							<div
								style={{
									width: '90%',
									border: '1px solid white',
									marginBottom: 20,
									padding: 20,
								}}
							>
								<div
									style={{ display: 'flex', justifyContent: 'space-between' }}
								>
									<div>
										<div>Fiat currencies allowed for trading: </div>
										<div>{fiatCurrencies.join(', ')}</div>
									</div>
									<div
										onClick={() => {
											setStep(1);
										}}
										style={{ cursor: 'pointer' }}
									>
										EDIT
									</div>
								</div>
							</div>

							<div
								style={{
									width: '90%',
									border: '1px solid white',
									marginBottom: 20,
									padding: 20,
								}}
							>
								<div
									style={{ display: 'flex', justifyContent: 'space-between' }}
								>
									<div>
										<div>Outside payment methods allowed: </div>
										<div>
											{selectedPaymentMethods
												.map((x) => x.system_name)
												?.join(', ')}
										</div>
									</div>
									<div
										onClick={() => {
											setStep(3);
										}}
										style={{ cursor: 'pointer' }}
									>
										EDIT
									</div>
								</div>
							</div>

							<div
								style={{
									width: '90%',
									border: '1px solid white',
									marginBottom: 20,
									padding: 20,
								}}
							>
								<div
									style={{ display: 'flex', justifyContent: 'space-between' }}
								>
									<div>
										<div>Merchant fee: </div>
										<div>{merchantFee}</div>
									</div>
									<div
										onClick={() => {
											setStep(4);
										}}
										style={{ cursor: 'pointer' }}
									>
										EDIT
									</div>
								</div>
							</div>

							<div
								style={{
									width: '90%',
									border: '1px solid white',
									marginBottom: 20,
									padding: 20,
								}}
							>
								<div
									style={{ display: 'flex', justifyContent: 'space-between' }}
								>
									<div>
										<div>Buyer fee: </div>
										<div>{userFee}</div>
									</div>
									<div
										onClick={() => {
											setStep(4);
										}}
										style={{ cursor: 'pointer' }}
									>
										EDIT
									</div>
								</div>
							</div>

							<div
								style={{
									width: '90%',
									border: '1px solid white',
									marginBottom: 20,
									padding: 20,
								}}
							>
								<div
									style={{ display: 'flex', justifyContent: 'space-between' }}
								>
									<div>
										<div>Fee Source Account: </div>
										<div>{selectedEmailData.label}</div>
									</div>
									<div
										onClick={() => {
											setStep(4);
										}}
										style={{ cursor: 'pointer' }}
									>
										EDIT
									</div>
								</div>
							</div>

							{/* <div
								style={{
									width: '90%',
									border: '1px solid white',
									marginBottom: 20,
									padding: 20,
								}}
							>
								<div
									style={{ display: 'flex', justifyContent: 'space-between' }}
								>
									<div>
										<div>Type of P2P deals:</div>
										<div>{side?.toUpperCase()}</div>
									</div>
									<div>EDIT</div>
								</div>
							</div> */}
						</div>
					)}

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
								if (step <= 0) {
									setDisplayP2pModel(false);
									setEditMode(false);
								} else {
									setStep(step - 1);
								}
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
								if (step === 0 && digitalCurrencies.length === 0) {
									message.error('Please select crypto assets');
									return;
								}
								if (step === 0 && !side) {
									message.error('Please select side');
									return;
								}

								if (step === 1 && fiatCurrencies.length === 0) {
									message.error('Please select fiats');
									return;
								}

								if (step === 2 && userTier == null) {
									message.error('Please select user tier');
									return;
								}

								if (step === 2 && merchantTier == null) {
									message.error('Please select merchant tier');
									return;
								}

								if (step === 3 && selectedPaymentMethods.length === 0) {
									message.error('Please add payment methods');
									return;
								}

								if (step === 4 && merchantFee == null) {
									message.error('Please add merchant fee');
									return;
								}

								if (step === 4 && userFee == null) {
									message.error('Please add user fee');
									return;
								}

								if (step === 4 && sourceAccount == null) {
									message.error('Please add source account');
									return;
								}

								if (step === 5) {
									try {
										await updateConstants({
											kit: {
												features: {
													...features,
													p2p: true,
												},
												p2p_config: {
													enable: true,
													bank_payment_methods: selectedPaymentMethods,
													starting_merchant_tier: merchantTier,
													starting_user_tier: userTier,
													digital_currencies: digitalCurrencies,
													fiat_currencies: fiatCurrencies,
													side: side,
													merchant_fee: merchantFee,
													user_fee: userFee,
													source_account: sourceAccount,
												},
											},
										});
										requestAdminData().then((res) => {
											const result = res?.data?.kit?.p2p_config;
											setEnable(result?.enable);
											setSide(result?.side);
											setDigitalCurrencies(result?.digital_currencies);
											setFiatCurrencies(result?.fiat_currencies);
											setMerchantTier(result?.starting_merchant_tier);
											setUserTier(result?.starting_user_tier);
											setSelectedPaymentMethods(result?.bank_payment_methods);
											setMerchantFee(result?.merchant_fee);
											setUserFee(result?.user_fee);
											setSourceAccount(result?.source_account);
											setP2pConfig(result);
										});
										setEditMode(false);
										setStep(0);
										setDisplayP2pModel(false);
										message.success('Changes saved.');
									} catch (error) {
										message.error(error.data.message);
									}
								} else {
									setStep(step + 1);
								}
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
							disabled={false}
						>
							NEXT
						</Button>
					</div>
				</Modal>
			)}

			{displayFiatAdd && (
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#27339D',
						marginTop: 60,
					}}
					visible={displayP2pModel}
					width={450}
					footer={null}
					onCancel={() => {
						setDisplayFiatAdd(false);
					}}
				>
					<h1 style={{ fontWeight: '600', color: 'white' }}>
						Select fiat to add
					</h1>

					<div>
						<div>Search fiat</div>

						<Input
							style={{ width: 200 }}
							value={filterFiat}
							onChange={(e) => {
								setFilterFiat(e.target.value);
							}}
						/>

						<div style={{ fontSize: 13, marginTop: 10, marginBottom: 10 }}>
							Fiat:
						</div>
						<div
							style={{
								width: '90%',
								height: 200,
								padding: 10,
								border: '1px solid white',
								overflowY: 'auto',
							}}
						>
							{Object.values(coins || {})
								.filter((coin) => coin.type === 'fiat')
								.filter((x) =>
									filterFiat?.length > 0
										? x.symbol.toLowerCase().includes(filterFiat?.toLowerCase())
										: true
								)
								.map((coin) => {
									return (
										<div
											style={{
												cursor: 'pointer',
												fontWeight: fiatCurrencies.includes(coin.symbol)
													? 'bold'
													: '200',
											}}
											onClick={() => {
												if (!fiatCurrencies.includes(coin.symbol)) {
													setFiatCurrencies([...fiatCurrencies, coin.symbol]);
												} else {
													setFiatCurrencies(
														[...fiatCurrencies].filter(
															(symbol) => symbol !== coin.symbol
														)
													);
												}
											}}
										>
											{/* <span>ICON</span>{' '} */}
											<span>
												{coin.fullname}({coin.symbol})
											</span>
										</div>
									);
								})}
						</div>
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
								setDisplayFiatAdd(false);
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
					</div>
				</Modal>
			)}

			{displayPaymentAdd && (
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#27339D',
						marginTop: 60,
					}}
					visible={displayP2pModel}
					width={450}
					footer={null}
					onCancel={() => {
						setDisplayPaymentAdd(false);
					}}
				>
					<h1 style={{ fontWeight: '600', color: 'white' }}>
						Select payment methods to add
					</h1>

					<div>
						<div>Search payment methods</div>
						{/* <Select
							showSearch
							className="select-box"
							placeholder="Input payment system"
							onChange={(e) => {
								setSelectedPaymentMethods([
									...selectedPaymentMethods,
									defaultPaymentMethods[e],
								]);
							}}
						>
							<Select.Option value={0}>IBAN</Select.Option>
						</Select> */}

						<Input
							style={{ width: 200 }}
							value={filterMethod}
							onChange={(e) => {
								setFilterMethod(e.target.value);
							}}
						/>

						<div style={{ fontSize: 13, marginTop: 10, marginBottom: 10 }}>
							Payment Methods:
						</div>
						<div
							style={{
								width: '90%',
								height: 200,
								padding: 10,
								border: '1px solid white',
								overflowY: 'auto',
							}}
						>
							{paymentMethods.length === 0 ? (
								<div>No payment methods selected</div>
							) : (
								<div>
									{/* <span>ICON</span> */}
									{paymentMethods
										.filter((x) =>
											filterMethod?.length > 0
												? x.system_name
														.toLowerCase()
														.includes(filterMethod?.toLowerCase())
												: true
										)
										.map((method) => {
											return (
												<div
													style={{
														cursor: 'pointer',
														fontWeight: selectedPaymentMethods.find(
															(x) => x.system_name === method.system_name
														)
															? 'bold'
															: '200',
													}}
													onClick={() => {
														if (
															!selectedPaymentMethods.find(
																(x) => x.system_name === method.system_name
															)
														) {
															setSelectedPaymentMethods([
																...selectedPaymentMethods,
																method,
															]);
														} else {
															setSelectedPaymentMethods(
																[...selectedPaymentMethods].filter(
																	(x) => x.system_name !== method.system_name
																)
															);
														}
													}}
												>
													{method?.system_name}
												</div>
											);
										})}
								</div>
							)}
						</div>
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
								setDisplayPaymentAdd(false);
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
					</div>
					<div style={{ marginTop: 10 }}>
						Can't find your local payment method?
					</div>
					<div
						style={{ textDecoration: 'underline', cursor: 'pointer' }}
						onClick={() => {
							setDisplayNewPayment(true);
						}}
					>
						Create and add a new payment method
					</div>
				</Modal>
			)}

			{displayNewPayment && (
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#27339D',
						marginTop: 60,
					}}
					visible={displayP2pModel}
					width={600}
					footer={null}
					onCancel={() => {
						setDisplayNewPayment(false);
					}}
				>
					<h1 style={{ fontWeight: '600', color: 'white' }}>
						{methodEditMode
							? 'Edit payment methods'
							: 'Create and add new payment methods'}
					</h1>
					<div>
						To add a payment method to your P2P platform, you can do so manually
						by entering the name of the payment method and the required payment
						details. For example, PayPal uses email addresses to send and
						receive funds.{' '}
					</div>

					<div style={{ marginTop: 20, marginBottom: 30 }}>
						Once the payment method is added, your P2P merchants and users will
						be able to select it and enter the necessary information when making
						or receiving payments. The details they provide will be shared with
						the other party in the P2P transaction.
					</div>

					<div style={{ fontSize: 20 }}>
						Name of method and main payment detail
					</div>

					<div style={{ marginBottom: 20 }}>
						<div style={{ fontWeight: 'bold' }}>Create new payment methods</div>
						<Input
							placeholder="Enter your system name"
							value={paymentMethod.system_name}
							onChange={(e) => {
								setPaymentMethod({
									...paymentMethod,
									system_name: e.target.value,
								});
							}}
						/>
					</div>

					{customFields.map((field) => {
						return (
							<div style={{ marginBottom: 30 }}>
								<div style={{ fontWeight: 'bold', fontSize: 17 }}>
									FIELD {field.id}#
								</div>
								<div style={{ fontWeight: 'bold' }}>Payment detail name</div>
								<Input
									placeholder="Input the payment detail name"
									value={field.name}
									onChange={(e) => {
										const newCustomFields = [...customFields];
										const found = newCustomFields.find(
											(x) => x.id === field.id
										);
										if (found) {
											found.name = e?.target?.value;
										}

										setCustomFields(newCustomFields);
									}}
								/>
							</div>
						);
					})}

					<div
						style={{
							fontWeight: 'bold',
							textDecoration: 'underline',
							cursor: 'pointer',
						}}
						onClick={() => {
							setPaymentFieldAdd(true);
						}}
					>
						Add new payment detail field
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
								setDisplayNewPayment(false);
								setMethodEditMode(false);
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
							onClick={() => {
								if (methodEditMode) {
									const foundMethodIndex = paymentMethods.findIndex(
										(x, index) => index === paymentMethod.selected_index
									);

									if (foundMethodIndex > -1) {
										const newMethods = [...paymentMethods];
										newMethods[foundMethodIndex] = {
											system_name: paymentMethod.system_name,
											fields: customFields,
										};
										setPaymentMethods([...newMethods]);
										setDisplayNewPayment(false);
									}
								} else {
									paymentMethods.push({
										system_name: paymentMethod.system_name,
										fields: customFields,
									});

									setPaymentMethods(paymentMethods);
									setDisplayNewPayment(false);
								}
								setPaymentMethod({
									system_name: null,
									fields: {},
								});
								setCustomFields([
									{
										id: 1,
										name: null,
										required: true,
									},
								]);
								setMethodEditMode(false);
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							{methodEditMode ? 'Finish edit' : 'Add'}
						</Button>
					</div>
				</Modal>
			)}

			{paymentFieldAdd && (
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#27339D',
						marginTop: 60,
					}}
					visible={displayP2pModel}
					width={450}
					footer={null}
					onCancel={() => {
						setPaymentFieldAdd(false);
					}}
				>
					<h1 style={{ fontWeight: '600', color: 'white' }}>
						Add an additional payment details
					</h1>
					<div style={{ marginBottom: 20 }}>
						This new payment field is additional and should assist P2P
						participants in their fiat currency transfers. This should be
						account details related to payment method. This may including phone
						numbers, usernames, unique account numbers, and other necessary
						information for transactions depending on the payment methods
						system.{' '}
					</div>

					<div style={{ marginBottom: 20 }}>
						<div style={{ fontWeight: 'bold' }}>Payment detail name</div>
						<Input
							placeholder="Input the payment detail name"
							value={customField?.name}
							onChange={(e) => {
								setCustomField({
									...customField,
									name: e.target.value,
								});
							}}
						/>
					</div>

					<div>
						<div style={{ fontWeight: '600' }}>Required or optional</div>
						<div style={{ marginLeft: 20, marginTop: 5 }}>
							<Radio.Group>
								<Space direction="vertical" style={{ color: 'white' }}>
									<Radio value={1} style={{ color: 'white' }}>
										Required
									</Radio>
									<div style={{ marginLeft: 20 }}>
										(Important payment detail)
									</div>
									<Radio value={2} style={{ color: 'white' }}>
										Optional
									</Radio>
									<div style={{ marginLeft: 20 }}>
										(Optional payment detail)
									</div>
								</Space>
							</Radio.Group>
						</div>
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
								setPaymentFieldAdd(false);
								setCustomField({});
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
							onClick={() => {
								customField.id = customFields[customFields.length - 1].id + 1;

								setCustomFields([...customFields, customField]);
								setPaymentFieldAdd(false);
								setCustomField({});
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							Add
						</Button>
					</div>
				</Modal>
			)}
		</div>
	);
};

const mapStateToProps = (state) => ({
	exchange: state.asset && state.asset.exchange,
	pairs: state.app.pairs,
	coins: state.app.coins,
	user: state.user,
	quicktrade: state.app.allContracts.quicktrade,
	networkQuickTrades: state.app.allContracts.networkQuickTrades,
	coinObjects: state.app.allContracts.coins,
	broker: state.app.broker,
	features: state.app.constants.features,
	p2p_config: state.app.constants.p2p_config,
	constants: state.app.constants,
});

const mapDispatchToProps = (dispatch) => ({
	setExchange: bindActionCreators(setExchange, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(P2PSettings);
