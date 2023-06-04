import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
	Switch,
	Input,
	Button,
	Select,
	Modal,
	InputNumber,
	Radio,
	Spin,
	message
} from 'antd';
import {
	ExclamationCircleFilled,
	InfoCircleOutlined,
	ExclamationCircleOutlined,
	CloseOutlined,
	LoadingOutlined,
} from '@ant-design/icons';

import { STATIC_ICONS } from 'config/icons';
import Coins from '../Coins';
import { createTestBroker, getBrokerConnect, getTrackedExchangeMarkets, createTestUniswap, getBrokerUniswapTokens } from './actions';
import Pophedge from './HedgeMarketPopup';
import { handleUpgrade } from 'utils/utils';
import { formatToCurrency } from 'utils/currency';
import _toLower from 'lodash/toLower';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { TextArea } = Input;
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
	handleBrokerChange,
	handlePaused,
	deleteBrokerData,
	isOpen,
	setPricing,
	status,
	emailOptions,
	handleSearch,
	pairBaseBalance,
	pair2Balance,
	handleEmailChange,
	handleClosePopup,
	selectedEmailData,
	selectedCoinType,
	kit,
	pairs,
	markets,
	isEdit,
	editData,
	setEditData
}) => {
	let ManageArr = [];
	pairs &&
		pairs.forEach((element) => {
			let data = {};
			markets.forEach((item) => {
				if (element.name === item.key || element.code === item.key) {
					const { ticker, increment_price } = item;
					data = {
						...data,
						exchange: 'HollaEx Pro',
						pair: `${element.pair_base.toUpperCase()}/${element.pair_2.toUpperCase()}`,
						price: `${formatToCurrency(
							ticker.close,
							increment_price
						)} ${element.pair_2.toUpperCase()}`,
					};
				}
			});
			ManageArr = [...ManageArr, data];
		});

	const searchRef = useRef(null);
	const [hedgeSwitch, setHedgeSwitch] = useState(false);
	const [connectpop, setConnectpop] = useState(false);
	const [chainlink, setChainlink] = useState(false);
	const [customlink, setCustomlink] = useState(false);
	const [formula, setFormula] = useState('');
	const [hedgeApi, setHedgeApi] = useState('hollaex');
	const [selelctedPlatform, setSelectedPlatform] = useState('binance');
	const [selectedExchange, setSelectedExchange] = useState('binance');
	const [exchangeMarkets, setExchangeMarkets] = useState([]);
	const [hedgeMarkets, setHedgeMarkets] = useState([]);
	const [displayUniswap, setDisplayUniswap] = useState(false);
	const [uniswapCoins, setUniswapCoins] = useState()
	const [selectedUniswapPairs, setSelectedUniswapPairs]= useState({})
	const [selectedMarket, setSelectedMarket] = useState();
	const [priceResult, setPriceResult] = useState();
	const [displayAdvancedModal, setDisplayAdvancedModal] = useState(false);
	const [apiData, setApi] = useState({});
	const [hedgeBaseCoinBalance, setHedgeBaseCoinBalance] = useState();
	const [hedgeQuoteCoinBalance, setHedgeQuoteCoinBalance] = useState();
	const [hedgeSymbol, setHedgeSymbol] = useState();
	const [spreadMul, setSpreadMul] = useState({});
	const [MarketPop, SetMarketPop] = useState(false);
	const [connectLoading, setLoading] = useState(false);
	const [spin, setSpin] = useState(false);
	const [formulaVariable, setFormulaVariable] = useState();
	const [selHedgingMkt, setSelHedgingMkt] = useState(
		pairs && pairs[0] && pairs[0].name
	);
	const [marketLink, setMatketLink] = useState(
		`https://api.hollaex.com/v2/ticker?symbol=${
			pairs && pairs[0] && pairs[0].name
		}`
	);
	const [brokerPriceData, setBrokerPrice] = useState({});
	const [isDisconnect, setIsDisconnect] = useState(false);
	const [errMsg, setErrorMsg] = useState('');

	useEffect(() => {
		if (
			(isEdit && editData && editData.type === 'dynamic' && editData.formula) ||
			isExistsPair
		) {
			setSelectedPlatform('custom');
			setCustomlink(true);
		}
		if (isEdit && editData && editData.account) {
			setHedgeSwitch(true);
			setConnectpop(true);
			const hedgeExchange = Object.keys(editData.account)?.[0];
			setHedgeApi(hedgeExchange);
			getTrackedExchangeMarkets(hedgeExchange).then(markets => setHedgeMarkets(markets));
		}
	}, [isEdit, editData, isExistsPair]);

	useEffect(() => {
		if (previewData.spread || previewData.quote_expiry_time) {
			setSpreadMul({
				spread: previewData.spread,
				quote_expiry_time: previewData.quote_expiry_time
			})
		}

		if (previewData.tracked_symbol) { setSelectedMarket(previewData.tracked_symbol) }
		if (previewData.formula) { setFormula(previewData.formula); }
		if (previewData.exchange_name) { handleSelectedExchange(previewData.exchange_name); }
		else handleSelectedExchange(selectedExchange);
		if (previewData.rebalancing_symbol) { setHedgeSymbol(previewData.rebalancing_symbol); }
	}, [previewData, selectedCoinType])

	useEffect(() => {
		if (previewData) {
			const pair = `${previewData?.pair_base?.toUpperCase()}/${previewData?.pair_2?.toUpperCase()}`
			const foundPair = exchangeMarkets?.markets?.find(data => data.symbol === pair);
			if (foundPair) { 
				setSelectedMarket(foundPair.symbol); handlePreviewChange(foundPair.symbol, 'tracked_symbol');
				const symbol = foundPair.symbol.replace('/','-').toLowerCase();
				setFormulaVariable(`${selectedExchange}_${symbol}`);
				if(!formula) setFormula(`${selectedExchange}_${symbol}`);
			}
			else setSelectedMarket()
		}
	}, [exchangeMarkets, selectedCoinType])


	const handleCloseOtcChild = () => {
		setHedgeSwitch(false);
		setConnectpop(false);
		setChainlink(false);
		setFormula('');
		setFormulaVariable();
		setCustomlink(false);
		setHedgeApi('hollaex');
		setApi({});
		setSpreadMul({});
		setSelectedPlatform('binance');
		setSelectedExchange('binance');
		setPriceResult();
		setEditData({});
		SetMarketPop(false);
		setLoading(false);
		setSelectedUniswapPairs({});
		setDisplayUniswap(false);
		setSelHedgingMkt(pairs && pairs[0] && pairs[0].name);
		setMatketLink(
			`https://api.hollaex.com/v2/ticker?symbol=${
				pairs && pairs[0] && pairs[0].name
			}`
		);
		handleClosePopup();
	};

	const isUpgrade = handleUpgrade(kit.info);
	const noHedgeOption = kit?.info?.plan == null || _toLower(kit?.info?.plan) === 'basic' || _toLower(kit?.info?.plan) === 'crypto';

	const handleEditInput = () => {
		if (searchRef && searchRef.current && searchRef.current.focus) {
			searchRef.current.focus();
		}
	};

	const createTestBrokerData = async (body) => {
		try {
			const res = await createTestBroker(body);
			setBrokerPrice(res);
		} catch (error) {
			console.log('error', error);
		}
	};

	const handlePriceResult = async () => {
		// if(displayUniswap && selectedUniswapPairs.base_coin && selectedUniswapPairs.quote_coin && spreadMul.spread ){
		// 	setSpin(true);
		// 	const result = await createTestUniswap({ ...selectedUniswapPairs, spread: spreadMul.spread })
		// 	setPriceResult(result);
		// 	setSpin(false);
		// 	return;
		// } else { message.warning('Please select base and quite coin for uniswap and spread')}
		try {
			if(!displayUniswap && spreadMul.spread && selectedExchange && selectedMarket) {
				setSpin(true);
				const result = await createTestBroker({ formula, increment_size: previewData.increment_size, spread: spreadMul.spread })
				setPriceResult(result.data);
			
			} else { message.warning('Please input spread and tracked symbol') }
		} catch (error) {
			message.error(error.message)
		}

		setSpin(false);
	}
	const getConnect = async (e) => {
		setLoading(true);
		let selectedApiType = hedgeApi;
		try {
			const balance = await getBrokerConnect(selectedApiType, apiData.apikey, apiData.seckey);
			const baseCoinBalance = balance[previewData?.pair_base?.toUpperCase()];
			const quoteCoinBalance = balance[previewData?.pair_2?.toUpperCase()];
			setHedgeBaseCoinBalance(baseCoinBalance?.total);
			setHedgeQuoteCoinBalance(quoteCoinBalance?.total);
			const markets = await getTrackedExchangeMarkets(selectedApiType);
			setHedgeMarkets(markets)

			setTimeout(() => {
				setLoading(false);
				setConnectpop(e);
			}, 5000);
		} catch (error) {
			const errMsg = error.data ? error.data.message : error.message;
			setTimeout(() => {
				setLoading(false);
				setErrorMsg(errMsg);
			}, 5000);
		}
	};

	// const setPlatform = (value) => {
	// 	handlePreviewChange(selelctedPlatform, 'exchange_name');
	// 	setSelectedPlatform(value);
	// 	if (value === 'chainlink') {
	// 		setChainlink(true);
	// 		setCustomlink(false);
	// 	}
	// 	if (value === 'binance' || value === 'bitmex') {
	// 		setChainlink(false);
	// 		setCustomlink(false);
	// 	}
	// 	if (value === 'custom') {
	// 		setChainlink(false);
	// 		setCustomlink(true);
	// 	}
	// };

	const onhandleFormula = (value) => {
		handlePreviewChange(value, 'formula');
	};
	const handleHedgeSwitch = (e) => {
		setHedgeSwitch(e);
		setConnectpop(false);
		setIsDisconnect(false);

		if (e === false) {
			setApi({});
			handlePreviewChange(null, 'remove_account');
		}
	};

	const calculateConversion = (fn, price) => {
        return new Function(`const x = ${price}; return ${fn}`)();
    }
	const handleConnect = (e) => {
		getConnect(e);
	};
	const handleApi = (value, name) => {
		handlePreviewChange(value, name);
		const apiVal = {
			...apiData,
			[name]: value,
		};
		setApi(apiVal);
	};
	const handleSpreadMul = (value, name) => {
		handlePreviewChange(value, name);
		const spreadInput = {
			...spreadMul,
			[name]: value,
		};
		setSpreadMul(spreadInput);
	};
	const handleMarkethedge = () => {
		SetMarketPop(true);
	};
	const handleSelApi = (e) => {
		setHedgeApi(e);
		handlePreviewChange(e, 'accountVal');
	};
	const handleMarkSearch = (e) => {
		setMatketLink(e.target.value);
	};
	const chooseMarket = (d = {}, isConfirm = '', isHedge) => {
		if (isConfirm === 'confirm') {
			if(!isHedge) {
				handlePreviewChange(selectedMarket, 'tracked_symbol');
				const symbol = selectedMarket.replace('/','-').toLowerCase();
				setFormulaVariable(`${selectedExchange}_${symbol}`);
				if(!formula) setFormula(`${selectedExchange}_${symbol}`);
			} else {
				handlePreviewChange(hedgeSymbol, 'rebalancing_symbol');
			}
			SetMarketPop(false);
		} else if (isConfirm === 'back') {
			SetMarketPop(false);
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

	const handleCustomPrice = () => {
		moveToStep('coin-pricing');
		setSelectedPlatform('custom');
		setCustomlink(true);
		setChainlink(false);
		SetMarketPop(false);
		setSelHedgingMkt(pairs && pairs[0] && pairs[0].name);
		setMatketLink(
			`https://api.hollaex.com/v2/ticker?symbol=${
				pairs && pairs[0] && pairs[0].name
			}`
		);
	};

	const handleSetPriceNext = () => {
		const { pair_base, pair_2, spread = 0.2, multiplier = 2 } = previewData;
		createTestBrokerData({
			symbol: `${pair_base}-${pair_2}`,
			exchange_name: 'binance',
			spread,
			multiplier,
		});
		moveToStep('PricingValue');
		handlePreviewChange(selelctedPlatform, 'exchange_name');
		handlePreviewChange(selectedCoinType, 'type');
	};

	const handleHedgeNext = () => {
		moveToStep('with-balance');
	};

	const handleDisconnect = () => {
		setIsDisconnect(true);
		setHedgeSwitch(false);
		setConnectpop(false);
		setApi({});
		delete previewData.account;
	};

	const handleManualNext = () => {
		handlePreviewChange(selectedCoinType, 'type');
		moveToStep('hedge');
	};

	const handleSelectedExchange = async (value) => {
		setSelectedExchange(value);

		if (value === 'uniswap') {
			setDisplayUniswap(true);
		} else {
			if(value !== exchangeMarkets.exchange) {
				const markets = await getTrackedExchangeMarkets(value);
				setExchangeMarkets({ exchange:value, markets });
			}
		}
		
	}

	const renderExchangeOptions = () => (
		<>
			<Option value="hollaex">Hollaex Pro</Option>
			<Option value="binance">Binance</Option>
			{_toLower(kit?.info?.plan) !== 'crypto' && <Option value="coinbase">Coinbase</Option>}
			{_toLower(kit?.info?.plan) !== 'crypto' && <Option value="bitfinex2">Bitfinex</Option>}
			{_toLower(kit?.info?.plan) !== 'crypto' && <Option value="kraken">Kraken</Option>}
			{/* {_toLower(kit?.info?.plan) !== 'crypto' && <Option value="uniswap">Uniswap</Option>} */}
		</>
	)
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
											value={previewData && previewData.pair_base}
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
											value={previewData && previewData.pair_2}
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
										previewData &&
										previewData &&
										previewData.symbol &&
										previewData &&
										previewData.symbol.toUpperCase()}{' '}
									orderbook.
								</div>
							</div>
						) : null}
						<div className="btn-wrapper">
							<Button
								className="green-btn"
								type="primary"
								onClick={handleCloseOtcChild}
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
								<Coins type={previewData && previewData.pair_base} />
								<span className="coin-full-name">
									{getFullName(previewData && previewData.pair_base)}
								</span>
							</div>
							<CloseOutlined style={{ fontSize: '24px' }} />
							<div className="d-flex align-items-center ml-4">
								<Coins type={previewData && previewData.pair_2} />
								<span className="coin-full-name">
									{getFullName(previewData && previewData.pair_2)}
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
							<div className="full-width">
								{previewData && previewData.min_size}
							</div>
						</div>
						<div className="field-wrap">
							<div className="sub-title">Maximum Tradable Amount</div>
							<div className="description">
								<div>Maximum - amount that can be traded for this market.</div>
							</div>
							<div className="full-width">
								{previewData && previewData.max_size}
							</div>
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
							<div className="full-width">
								{previewData && previewData.increment_size}
							</div>
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
									min={0}
									onChange={(val) => handlePreviewChange(val, 'min_size')}
									value={previewData && previewData.min_size}
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
									min={0}
									onChange={(val) => handlePreviewChange(val, 'max_size')}
									value={previewData && previewData.max_size}
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
									min={0}
									onChange={(val) => handlePreviewChange(val, 'increment_size')}
									value={previewData && previewData.increment_size}
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
					<>
						{!MarketPop ? (
							<div className="otc-Container coin-pricing-container">
								{displayAdvancedModal && 
									<Modal
										maskClosable={false}
										closeIcon={<CloseOutlined style={{ color: 'white' }} />}
										bodyStyle={{
											backgroundColor: '#27339D',
											marginTop: 60,
										}}
										visible={displayAdvancedModal}
										footer={null}
										onCancel={() => {
											setDisplayAdvancedModal(false);
										}}
									>
										<h2 style={{ fontWeight: '600', color: 'white' }}>Advanced</h2>
										<div style={{ fontWeight: '400', color: 'white' }}>You can add different markets into formula in the format below</div>
									
										{/* <div>Price formula</div> */}
                						<div style={{ marginBottom: 10 }}>
                						    <label>Value:{formulaVariable} (price)</label>
                						    <div style={{ marginTop: 10, marginBottom: 10 }}>
                						        <div>add: '+'</div>
                						        <div>sub: '-'</div>
                						        <div>div: '/'</div>
                						        <div>mlt: '*'</div>
                						        <div>mod: '%'</div>
                						        <div>exp: '^'</div>
                						    </div>
                						    <div style={{ fontStyle: "italic" }}>example: 3^{`${selectedExchange}_${selectedMarket.replace('/','-').toLowerCase()}`}*12/5*9+9.4*2</div>
											
                						    <TextArea value={formula} style={{ color:'white', backgroundColor:"black", border:"1px solid white", width: 400, height: 120, marginBottom: 10,  marginTop: 10 }} onChange={(e) => {
												setFormula(e.target.value);
											 }} placeholder="Create formula" rows={3} />
                						</div>

										<div
											style={{
												display: 'flex',
												flexDirection: 'row',
												gap: 15,
												justifyContent: 'space-between',
											}}
										>
											<Button
												onClick={() => {
													setDisplayAdvancedModal(false);
													setFormula(previewData.formula);
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
													try {
														setSpin(true);
														const result = await createTestBroker({ formula, increment_size: previewData.increment_size, spread: spreadMul.spread || 0 })
														setPriceResult(result.data);
													} catch (err) {
														message.error(err.response.data.message);
														setSpin(false);
														return;
													}
													setSpin(false);
													setDisplayAdvancedModal(false);
													onhandleFormula(formula);
												}}
												style={{
													backgroundColor: '#288500',
													color: 'white',
													flex: 1,
													height: 35,
												}}
												type="default"
											>
												 {spin ? <Spin indicator={antIcon} /> : "Ok" }
											</Button>
										</div>
									</Modal>}
								<div className="title pb-3">Set coin pricing</div>
								<div className="d-flex align-items-center coin-container mb-4 coin-image">
									<div className="d-flex align-items-center mr-4 ">
										<Coins type={previewData && previewData.pair_base} />
										<span className="coin-full-name">
											{getFullName(previewData && previewData.pair_base)}
										</span>
									</div>
									<CloseOutlined style={{ fontSize: '24px' }} />
									<div className="d-flex align-items-center ml-4">
										<Coins type={previewData && previewData.pair_2} />
										<span className="coin-full-name">
											{getFullName(previewData && previewData.pair_2)}
										</span>
									</div>
								</div>
								<div>
									<div className="mb-1 pt-4 coin-pricing-Heading">Type</div>
									<div className="select-box">
										<Select
											defaultValue={selectedCoinType}
											onChange={setPricing}
											value={previewData && previewData.type}
										>
											<Option value="manual">Manually set (static)</Option>
											<Option value="dynamic">Dynamic</Option>
										</Select>
									</div>
								</div>
								{isManual && !isExistsPair ? (
									<div>
										<div className="pricing-container mt-4">
											<div>
												<div className="mb-1">Displayed selling price</div>
												<Input
													type="number"
													suffix={
														previewData &&
														previewData &&
														previewData &&
														previewData.pair_2 &&
														previewData &&
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
														previewData &&
														previewData &&
														previewData.pair_2 &&
														previewData &&
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
											<InfoCircleOutlined /> Displayed price is the price your
											users will see and trade at.
										</div>
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
												onClick={handleManualNext}
												disabled={
													(!previewData && !previewData.sell_price) ||
													!previewData.buy_price
												}
											>
												Next
											</Button>
										</div>
									</div>
								) : (
									<div className="mt-4 ">
										{isUpgrade  && (
											<div className="upgrade d-flex mt-4 pt-3 pb-3">
												<div>
													<div>Upgrade for smart pricing</div>
													<div>Source dynamic prices automatically</div>
												</div>
												<div>
													<Button className="green-btn" type="primary">
														Upgrade
													</Button>
												</div>
											</div>
										)}
										{/* <div className="mt-3 ml-3">
											<div>Select price source:</div>
											<div className="mt-2 error">
												<ExclamationCircleFilled /> Coming soon for upgraded
												HollaEx operators.
											</div>
										</div> */}
										{<div className={isUpgrade ? 'Datahide mt-3' : ''}>
											<div>Platform price source</div>
											<div className="select-box">
												
												<Select
													defaultValue={selectedExchange}
													onChange={async (value) => {
														setSelectedUniswapPairs({});
														setDisplayUniswap(false);
														setSelectedExchange();
														handleSelectedExchange(value);
														handlePreviewChange(value, 'exchange_name');
														if(!formula) setFormulaVariable(`${value}_`);
													}}
												>
													{renderExchangeOptions()}
												</Select>
											</div>
										</div>}

										{!displayUniswap && <div className={isUpgrade ? 'Datahide mt-3' : ''}>
											<div className="mt-4">Track market price</div>
											<div className="select-box">
												
											<Input
												placeholder='Select track market symbol'
												onClick={handleMarkethedge}
												value={selectedMarket}
												/>

											</div>
										</div>}

										{displayUniswap && <div style={{ display: "flex", flexDirection: "row", gap: 10, marginTop: 15 }}>
                                        <Select
                                            showSearch
                                            value={selectedUniswapPairs?.base_coin || null}
                                            placeholder="Select Base Coin"
                                            style={{ color: "black", width: "100%" }}
                                            notFoundContent={'Not Found'}
                                            onChange={(value) => { setSelectedUniswapPairs({...selectedUniswapPairs, base_coin: value}); handlePreviewChange(value, 'uniswap_base_coin'); }}
                                        >
                                            {uniswapCoins.map(coin => <Option value={coin}>{coin}</Option>)}

                                        </Select>

										<Select
                                            showSearch
                                            value={selectedUniswapPairs?.quote_coin || null}
                                            placeholder="Select Quote Coin"
                                            style={{ color: "black", width: "100%" }}
                                            notFoundContent={'Not Found'}
											onChange={(value) => { setSelectedUniswapPairs({...selectedUniswapPairs, quote_coin: value}); handlePreviewChange(value, 'uniswap_quote_coin'); }}
                                        >
                                            {uniswapCoins.map(coin => <Option value={coin}>{coin}</Option>)}

                                        </Select>

                                    </div>}


										<div>
											<div className="mt-3 ">Percentage price spread <ExclamationCircleOutlined /></div>
											<Input
											
												type="number"
												placeholder="Input % spread"
												id="spreadkey"
												className={`Formulabox ${isUpgrade && 'Datahide'}`}
												suffix={'%'}
												onChange={(e) =>
													handleSpreadMul(
														parseFloat(e.target.value),
														'spread'
													)
												}
												value={previewData && previewData.spread}
											/>
											
											{!isUpgrade && <div className="mt-5 mb-5">Price refresh interval: 
											{_toLower(kit?.info?.plan) === 'crypto' ? '1 minute ' : '5 seconds '}
											 (<span style={{ 
												textDecoration:'underline',
												cursor:'pointer'
											}}>Upgrade</span> to increase refresh rate) </div>}

											<div className="mt-3 ">Price quote expiry time (seconds)</div>
											<Input
												type="number"
												placeholder="Input quote expiry time"
												className={`Formulabox ${isUpgrade && 'Datahide'}`}
												suffix={'*'}
												onChange={(e) =>
													handleSpreadMul(
														parseFloat(e.target.value),
														'quote_expiry_time'
													)
												}
												value={previewData && previewData.quote_expiry_time}
											/>

										<div className="mt-5">Result (price displayed to user)</div>
										<div onClick={() => { handlePriceResult(); }} className={`${isUpgrade && 'Datahide'}`} style={{ cursor:'pointer', textDecoration:'underline' }}> Show price result</div>
										{spin ? <Spin indicator={antIcon} /> : <div className="mb-5" style={{  opacity: priceResult ? 1 : 0 }}>
											Buy @ {priceResult?.buy_price} and Sell @ {priceResult?.sell_price} <span onClick={() => { handlePriceResult(); }} style={{ cursor:'pointer', textDecoration:'underline' }}>(Refresh)</span>
										</div>}
										
										
										{!isUpgrade && <div
										onClick={() => { setDisplayAdvancedModal(true); 
											if(selectedMarket && selectedExchange) {
												const symbol = selectedMarket.replace('/','-').toLowerCase();
												setFormulaVariable(`${selectedExchange}_${symbol}`);
												if(!formula) setFormula(`${selectedExchange}_${symbol}`);
											}
										}}
										className="mt-5" style={{ cursor:'pointer', textDecoration:'underline' }}>Advanced</div>}
											
										</div>

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
												onClick={() => {
													// handleSetPriceNext 
													moveToStep('hedge');
												}}
												disabled={
													chainlink ||
													(!isExistsPair &&
														!isEdit &&
														customlink &&
														formula === '') ||
													isUpgrade ||
													((!isExistsPair || !isEdit) && !spreadMul.spread) ||
													((!isExistsPair || !isEdit) && !spreadMul.quote_expiry_time)
												}
											>
												Next
											</Button>
										</div>
									</div>
								)}
							</div>
						) : (
							<Pophedge
								MarketPop={MarketPop}
								handleMarkSearch={handleMarkSearch}
								ManageArr={ManageArr}
								hedgeMarkets={exchangeMarkets?.markets}
								hedgeApi={exchangeMarkets?.exchange}
								setHedgeSymbol={setSelectedMarket}
								chooseMarket={chooseMarket}
								marketLink={marketLink}
								handleCustomPrice={handleCustomPrice}
								hedgeSymbol={selectedMarket}
								hedge={false}
							/>
						)}
					</>
				);
			case 'PricingValue':
				return (
					<div className="otc-Container coin-pricing-container">
						<div className="title pb-3">Price result</div>
						<div className="d-flex align-items-center coin-container mb-4 coin-image">
							<div className="d-flex align-items-center mr-4 ">
								<Coins type={previewData && previewData.pair_base} />
								<span className="coin-full-name">
									{getFullName(previewData && previewData.pair_base)}
								</span>
							</div>
							<CloseOutlined style={{ fontSize: '24px' }} />
							<div className="d-flex align-items-center ml-4">
								<Coins type={previewData && previewData.pair_2} />
								<span className="coin-full-name">
									{getFullName(previewData && previewData.pair_2)}
								</span>
							</div>
						</div>
						<div className="dynamic"></div>
						<div className="mt-3 mb-3">Type: Dynamic</div>
						<div className="mb-3">
							Platform price source: {selelctedPlatform}
						</div>
						<div className="mb-3">
							Market pair: {previewData && previewData.pair_base.toUpperCase()}/
							{previewData && previewData.pair_2.toUpperCase()} - Sell @{' '}
							{brokerPriceData.sell_price} / Buy @ {brokerPriceData.buy_price}
						</div>
						<div className="mb-3">
							Spread percentage: {isNaN(spreadMul) && spreadMul.spread}
						</div>
						<div className="mb-3">
							Multiplier: {isNaN(spreadMul) && spreadMul.multiplier}
						</div>
						<div className="mb-3">
							Quote expiry time:{' '}
							{(isNaN(spreadMul) && spreadMul.quote_expiry_time) || 30}
						</div>
						<div className="dynamic"></div>
						<div className=" mt-3 mb-3">Result / display price to user:</div>
						<h1 className="dysell">Sell @ {brokerPriceData.sell_price}</h1>
						<h1 className="mb-4 dysell">Buy @ {brokerPriceData.buy_price}</h1>
						<div className="dynamic"></div>
						<div className="mt-4 warning-message grey-text-color d-flex">
							{' '}
							<InfoCircleOutlined className="mt-1 mr-2" />
							<div>
								The result is the displayed price that your users will see and
								trade at. Please check and confirm that both sell & buy are
								correct.
							</div>
						</div>
						<div className="ml-4 mt-4 warning-message grey-text-color">
							{' '}
							Is the price incorrect? Adjust it in the{' '}
							<span
								className="preStep"
								onClick={() => handleBack('coin-pricing')}
							>
								previous step.
							</span>
						</div>
						<div className="btn-wrapper pt-3">
							<Button
								type="primary"
								className="green-btn"
								onClick={() => handleBack('coin-pricing')}
							>
								Back
							</Button>
							<div className="separator"></div>
							<Button
								type="primary"
								className="green-btn"
								onClick={() => moveToStep('with-balance')}
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
										type={previewData && previewData.pair_base}
										fullname={getFullName(previewData && previewData.pair_base)}
									/>
								</div>
								<div className="cross-text">X</div>
								<div>
									<Coins
										nohover
										large
										small
										type={previewData && previewData.pair_2}
										fullname={getFullName(previewData && previewData.pair_2)}
									/>
								</div>
							</div>
							<div className="right-container">
								<div className="right-content">
									<div className="title font-weight-bold">Desk assets</div>
									<div>
										Base market pair: {previewData && previewData.pair_base}
									</div>
									<div>
										Price market pair: {previewData && previewData.pair_2}
									</div>
								</div>
								<div className="right-content">
									<div className="title font-weight-bold">Parameters</div>
									<div>
										Increment size: {previewData && previewData.increment_size}
									</div>
									<div>Max size: {previewData && previewData.max_size}</div>
									<div>Min size: {previewData && previewData.min_size}</div>
								</div>
								<div className="right-content">
									<div className="title font-weight-bold">Price</div>
									<div>Type: {isManual ? 'Static' : 'Dynamic'}</div>
									<div>
										Sell at:{' '}
										{isManual
											? previewData && previewData.sell_price
											: brokerPriceData.sell_price}
									</div>
									<div>
										buy at:{' '}
										{isManual
											? previewData && previewData.buy_price
											: brokerPriceData.buy_price}
									</div>
									{!isManual && (
										<div>
											<div>
												Exchange Name:{' '}
												{previewData && previewData.exchange_name}
											</div>
											<div>Spread: {previewData && previewData.spread}</div>
											{/* <div>
												Multiplier: {previewData && previewData.refresh_interval}
											</div> */}
										</div>
									)}
								</div>
								<div className="right-content">
									<div className="title font-weight-bold">Hedge</div>
									{!hedgeSwitch && 'Off'}
									{hedgeSwitch && (
										<div>
											Hedging symbol:{' '}
											{previewData && previewData.rebalancing_symbol}
										</div>
									)}
								</div>
								<div className="right-content">
									<div className="title font-weight-bold">Fund Source</div>
									<div>
										Account:{' '}
										{(selectedEmailData && selectedEmailData.label) ||
											(user && user.email)}
									</div>
									<div>
										{previewData && previewData.pair_base}: {pairBaseBalance}
									</div>
									<div>
										{previewData && previewData.pair_2}: {pair2Balance}
									</div>
								</div>
							</div>
						</div>
						<div className="btn-wrapper">
							<Button
								className="green-btn"
								type="primary"
								onClick={() => moveToStep('with-balance')}
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
								<Coins type={previewData && previewData.pair_base} />
								<span className="coin-full-name">
									{getFullName(previewData && previewData.pair_base)}
								</span>
							</div>
							<CloseOutlined style={{ fontSize: '24px' }} />
							<div className="d-flex align-items-center ml-4">
								<Coins type={previewData && previewData.pair_2} />
								<span className="coin-full-name">
									{getFullName(previewData && previewData.pair_2)}
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
								value={previewData && previewData.paused ? 'paused' : 'live'}
							>
								<Radio value={'paused'} style={radioStyle}>
									Paused
								</Radio>
								{status === 'paused' || (previewData && previewData.paused) ? (
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
									<Coins type={previewData && previewData.pair_base} />
								</div>
								<div>
									{getFullName(previewData && previewData.pair_base)}:{' '}
									{pairBaseBalance}
								</div>
							</div>
							{pairBaseBalance === 0 ? renderErrorMsg() : null}
						</div>
						<div className="mb-4">
							<div className="d-flex align-items-center coin-image">
								<div className=" mr-3">
									<Coins type={previewData && previewData.pair_2} />
								</div>
								<div>
									{getFullName(previewData && previewData.pair_2)}:{' '}
									{pair2Balance}
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
								onClick={() => moveToStep('hedge')}
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
			case 'hedge':
				return (
					<div className="otc-Container">
						{!MarketPop ? (
							<>
								<div className="title">Hedge</div>
								<div className="sub-title mt-5">Apply a hedging strategy</div>
								<div className="admin-chat-feature-wrapper hedge_switch">
									<div className="switch-wrapper mb-5">
										<div className="d-flex">
											<span
												className={
													!hedgeSwitch
														? 'switch-label'
														: 'switch-label label-inactive'
												}
											>
												Off
											</span>
											<Switch
												disabled={noHedgeOption}
												checked={hedgeSwitch}
												onClick={handleHedgeSwitch}
											/>
											<span
												className={
													hedgeSwitch
														? 'switch-label'
														: 'switch-label label-inactive'
												}
											>
												On
											</span>
										</div>
									</div>

									{noHedgeOption && (
											<div className="upgrade d-flex pt-3 pb-3">
												<div>
													<div>Hedge your deals</div>
													<div>Automatic 24/7 buy and sell rebalancing</div>
												</div>
												<div>
													<Button className="green-btn" type="primary">
														Upgrade
													</Button>
												</div>
											</div>
									)}

								</div>
								{hedgeSwitch && !connectpop && (
									<>
										{!connectLoading ? (
											<div>
												<div className="select-box">
													<Select
														value={hedgeApi}
														onChange={handleSelApi}
													>
														{renderExchangeOptions()}
													</Select>
												</div>
													<div className="mt-3 mb-3">
														Enter {hedgeApi.charAt(0).toUpperCase() + hedgeApi.slice(1)} account API keys
													</div>
											</div>
										) : (
											<div>
												Connecting{' '}
												{hedgeApi.charAt(0).toUpperCase() + hedgeApi.slice(1)}{' '}
												account...
											</div>
										)}
										<div className={connectLoading ? 'disabled_area' : ''}>
											<div className="sub-title">API key</div>
											<Input
												placeholder="Enter your API key"
												id="apikey"
												onChange={(e) => handleApi(e.target.value, 'apikey')}
											/>
											<div className="sub-title mt-3">Secret key</div>
											<Input
												placeholder="Enter your secret key"
												id="seckey"
												onChange={(e) => handleApi(e.target.value, 'seckey')}
											/>
											<div className="connect-btn-wrapper">
												{connectLoading ? <Spin indicator={antIcon} /> : null}
												<Button
													type="primary"
													className="green-btn connect-btn"
													onClick={handleConnect}
													disabled={!apiData?.apikey || !apiData?.seckey}
												>
													Connect
												</Button>
											</div>
										</div>
									</>
								)}
								{errMsg && <div className="errMsg mt-2">{errMsg}</div>}
								<div className="d-flex  mt-4">
									{hedgeSwitch && !connectpop && (
										<>
											<div className="pr-2 grey-text-color">
												<ExclamationCircleOutlined />
											</div>
											<div className="main-subHeading grey-text-color">
												Visit your account page to generate your API key.
												Requires permissions for ordering to be open. Learn more
												about
												<span className="ml-1 anchor">hedging here.</span>
											</div>
										</>
									)}
									{!hedgeSwitch && !connectpop && (
										<>
											<div className="pr-2 grey-text-color">
												<ExclamationCircleOutlined />
											</div>
											<div className="main-subHeading grey-text-color mb-5 ">
												You can leave this off if you don't have funds in an
												account else where. Learn more about
												<span className="ml-1 anchor">hedging here.</span>
											</div>
										</>
									)}
								</div>
								{connectpop && (
									<>
										<div className="mt-3 mb-3">
											{hedgeApi.charAt(0).toUpperCase() + hedgeApi.slice(1) + ' '}
											account: {hedgeApi}
										</div>
										<div className="binancewrapper">
											<div className="binwrapper binborder">
												<div className="small-circle mr-2 d-flex">
													<span className="greentxt ">Connected</span>
												</div>
												<div>
													<span className="anchor" onClick={handleDisconnect}>
														(Disconnnect)
													</span>
												</div>
											</div>
											<div className="binwrapper justify-content-unset">
												{((!isDisconnect && Object.keys(apiData).length) ||
													isEdit) && (
													<div className="w-50">
														<div>
															Public keys:{' '}
															{isEdit
																? editData &&
																  editData.account &&
																  editData.account[hedgeApi] &&
																  editData.account[hedgeApi].apiKey
																: apiData?.apikey}
														</div>
														<div>
															Private keys:{' '}
															{isEdit
																? editData &&
																  editData.account &&
																  editData.account[hedgeApi] &&
																  editData.account[hedgeApi].apiSecret
																: apiData?.seckey}
														</div>
													</div>
												)}
												<div className="binRborder"></div>
												{((!isDisconnect && Object.keys(apiData).length) ||
													isEdit) && (
													<div>
														<div>
															{getFullName(
																previewData && previewData.pair_base
															)}
															: {hedgeBaseCoinBalance}
														</div>
														<div>
															{getFullName(previewData && previewData.pair_2)}:{' '}
															{hedgeQuoteCoinBalance}
														</div>
													</div>
												)}
											</div>
										</div>
										<div className="mt-4 mb-1">Hedging market source</div>
										<div className="select-box">
											{/* <Select
												defaultValue={marketLink}
												onClick={handleMarkethedge}
											>
												{pairs.map((item, index) => {
													return (
														<Option value={item.name} key={index}>
															{item.name}
														</Option>
													);
												})}
											</Select> */}

											<Input
												placeholder='Select hedge symbol'
												onClick={handleMarkethedge}
												value={hedgeSymbol}
												/>
											<div className="d-flex  mt-1">
												<div className="pr-2 grey-text-color">
													<ExclamationCircleOutlined />
												</div>
												<div className="main-subHeading grey-text-color">
													It is recommended to use a matching market for hedging
												</div>
											</div>
										</div>
										<div className="mt-4">Strategy</div>
										<div className="str-wrapper p-3">
											<div className="mt-1 mb-1">
												<b>Invert</b>
											</div>
											<div>
												Apply the opposite trade on the selected hedging market
												source. For example, if you sell BTC to a user the same
												amount you've sold can be bought back on a market else
												where.
											</div>
										</div>
									</>
								)}
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
										onClick={handleHedgeNext}
										disabled={
											hedgeSwitch &&
											((!apiData.apikey || !apiData.seckey || !connectpop) && !previewData.account)
										}
									>
										Next
									</Button>
								</div>
							</>
						) : (
							<Pophedge
								MarketPop={MarketPop}
								handleMarkSearch={handleMarkSearch}
								ManageArr={ManageArr}
								chooseMarket={chooseMarket}
								marketLink={marketLink}
								handleCustomPrice={handleCustomPrice}
								hedgeMarkets={hedgeMarkets}
								hedgeApi={hedgeApi}
								setHedgeSymbol={setHedgeSymbol}
								hedgeSymbol={hedgeSymbol}
								hedge={true}
							/>
						)}
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
								onClick={handleCloseOtcChild}
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
								onClick={handleCloseOtcChild}
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
								onClick={() => handleBack('unpause-otcdesk')}
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
				onCancel={handleCloseOtcChild}
				footer={null}
			>
				{renderModalContent()}
			</Modal>
		</div>
	);
};

export default Otcdeskpopup;
