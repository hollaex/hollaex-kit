import React, { useRef, useState, Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import {
	Table,
	Input,
	Button,
	Select,
	Modal,
	InputNumber,
	Radio,
	message,
	Spin,
} from 'antd';
import {
	ExclamationCircleFilled,
	InfoCircleOutlined,
	ExclamationCircleOutlined,
	MinusCircleFilled,
	CloseOutlined,
} from '@ant-design/icons';

import { STATIC_ICONS } from 'config/icons';
import Coins from '../Coins';
import { getBroker, createBroker, deleteBroker, updateBroker } from './actions';
import { formatToCurrency, calculateOraclePrice } from 'utils/currency';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';
import { setPricesAndAsset } from 'actions/assetActions';

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

const defaultPreviewValues = {
	min_size: 0.0001,
	max_size: 0.001,
	increment_size: 0.0001,
};

const OtcDeskContainer = ({
	coins,
	pairs,
	allCoins,
	exchange,
	user,
	coinData,
	balanceData,
	oraclePrices,
	setPricesAndAsset,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [type, setType] = useState('step1');
	const [isManual, setIsManual] = useState(true);
	const [status, setStatus] = useState('');
	const [isExistsPair, setIsExistPair] = useState(false);
	const [brokerData, setBrokerData] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const [previewData, setPreviewData] = useState(defaultPreviewValues);
	const [isEdit, setIsEdit] = useState(false);
	const [editData, setEditData] = useState({});
	const [coinSecondary, setCoinSecondary] = useState(coins);
	const [deskStateData, setdeskStateData] = useState({});
	const [isOpenDesk, setOpenDesk] = useState(false);
	const [tableLoading, setTableLoading] = useState(false);

	const max_message = useRef(null);
	const min_message = useRef(null);
	const paused_message = useRef(null);
	const account_input = useRef(null);

	useEffect(() => {
		getBrokerData();
	}, []);

	useEffect(() => {
		setPricesAndAsset(balanceData, coinData);
	}, [balanceData, coinData, setPricesAndAsset]);

	useEffect(() => {
		const data = coins.filter((item) => item.symbol !== exchange.coins[0]);
		setCoinSecondary(data);
	}, [coins, exchange.coins, isOpen]);

	useEffect(() => {
		if (!coins.length && !pairs.length && !allCoins.length) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [coins, pairs, allCoins]);

	useEffect(() => {
		if (isOpen && !isEdit) {
			let pairPreviewData = {
				...defaultPreviewValues,
				pair_base: exchange && exchange.coins[0],
				pair_2: exchange && exchange.coins[1],
			};
			const existPairData = brokerData.filter(
				(data) =>
					data.symbol ===
					`${pairPreviewData.pair_base}-${pairPreviewData.pair_2}`
			);
			if (isOpen && existPairData.length) {
				setIsExistPair(true);
				setPreviewData({ ...pairPreviewData, ...existPairData[0] });
			} else {
				setIsExistPair(false);
				setPreviewData(pairPreviewData);
			}
		} else {
			let pairPreviewData = {
				...editData,
				pair_base: editData && editData.symbol && editData.symbol.split('-')[0],
				pair_2: editData && editData.symbol && editData.symbol.split('-')[1],
			};
			setPreviewData(pairPreviewData);
		}
	}, [exchange.coins, editData, isOpen, isEdit, exchange]);

	const getBrokerData = async () => {
		setTableLoading(true);
		try {
			const res = await getBroker();
			setBrokerData(res);
			setTableLoading(false);
		} catch (error) {
			setTableLoading(false);
			if (error) {
				message.error(error.message);
			}
		}
	};

	const createBrokerData = async () => {
		const body = {
			...previewData,
			user_id: user.id,
			symbol: `${previewData.pair_base}-${previewData.pair_2}`,
			sell_price: parseFloat(previewData.sell_price),
			buy_price: parseFloat(previewData.buy_price),
		};
		delete body.pair_base;
		delete body.pair_2;
		delete body.inventory_email;
		try {
			await createBroker(body);
			handleClose();
			await getBrokerData();
			message.success('Broker is created successfully');
		} catch (error) {
			handleClose();
			if (error && error.data) {
				message.error(error.data.message);
			}
		}
	};

	const deleteBrokerData = async () => {
		try {
			const res = await deleteBroker({ id: deskStateData && deskStateData.id });
			handleClose();
			await getBrokerData();
			if (res && res.message) {
				message.success(res.message);
			}
		} catch (error) {
			handleClose();
			if (error && error.data) {
				message.error(error.data.message);
			}
		}
	};

	const updateBrokerData = async (params) => {
		const body = {
			...params,
			user_id: user.id,
			sell_price: parseFloat(params.sell_price),
			buy_price: parseFloat(params.buy_price),
		};
		delete body.pair_base;
		delete body.pair_2;
		delete body.inventory_email;
		try {
			await updateBroker(body);
			await getBrokerData();
			handleClose();
			message.success('Broker is updated successfully');
		} catch (error) {
			handleClose();
			if (error && error.data) {
				message.error(error.data.message);
			}
		}
	};

	const getCoinSource = (coin, symbol) => {
		if (coin && coin.logo) {
			return coin.logo;
		} else if (STATIC_ICONS.COIN_ICONS[(symbol || '').toLowerCase()]) {
			return STATIC_ICONS.COIN_ICONS[(symbol || '').toLowerCase()];
		} else {
			return STATIC_ICONS.MISSING_ICON;
		}
	};

	const handleEdit = (type) => {
		if (type === 'max') {
			max_message.current.focus();
		} else if (type === 'min') {
			min_message.current.focus();
		} else {
			paused_message.current.focus();
		}
	};

	const handleBrokerChange = () => {
		if (isEdit || isExistsPair) {
			updateBrokerData(previewData);
		} else {
			createBrokerData();
		}
	};

	const handlePaused = async (status, model, isEdit = false, data) => {
		if (!isOpen) {
			setdeskStateData({});
		}
		if (status === 'paused') {
			if (model === 'desk') {
				setdeskStateData({ ...deskStateData, paused: true });
				await updateBrokerData({ ...deskStateData, paused: true });
			} else {
				setdeskStateData(data);
				moveToStep('pause-otcdesk');
				setIsOpen(true);
			}
		} else if (status === 'unpaused') {
			if (model === 'desk') {
				setdeskStateData({ ...deskStateData, paused: false });
				await updateBrokerData({ ...deskStateData, paused: false });
			} else {
				setdeskStateData(data);
				moveToStep('unpause-otcdesk');
				setIsOpen(true);
			}
		} else {
			moveToStep('deal-params');
			setIsOpen(true);
			setIsEdit(isEdit);
			setEditData(data);
			if (model === 'openDesk') {
				setOpenDesk(true);
			}
		}
	};

	const COLUMNS = (balanceData, sortedSearchResults) => [
		{
			title: 'Deal desk',
			key: 'symbol',
			dataIndex: 'symbol',
			render: (data) => <div>{data}</div>,
		},
		{
			title: 'State',
			key: 'state',
			render: (data) => {
				return (
					<div className="otc-Container">
						{!data.paused ? (
							<div className="d-flex align-items-center pointer">
								<div className="small-circle mr-2"></div>
								<div>
									<span className="green-text mr-2">Active</span>(
									<span
										className="text-underline"
										onClick={() => handlePaused('paused', '', false, data)}
									>
										edit
									</span>
									)
								</div>
							</div>
						) : (
							<div className="d-flex align-items-center pointer">
								<div className="minuscircle-icon mr-2">
									<MinusCircleFilled />
								</div>
								<div>
									<span className="orange-text mr-2">Paused</span>(
									<span
										className="text-underline"
										onClick={() => handlePaused('unpaused', '', false, data)}
									>
										edit
									</span>
									)
								</div>
							</div>
						)}
					</div>
				);
			},
		},
		{
			title: 'Price (displayed to user)',
			key: 'price',
			render: ({ sell_price, buy_price, symbol }) => {
				return (
					<div>
						<div>
							Sell @ {sell_price} {symbol.split('-')[1].toUpperCase()}
						</div>
						<div>
							buy @ {buy_price} {symbol.split('-')[1].toUpperCase()}
						</div>
					</div>
				);
			},
		},
		{
			title: 'Inventory remaining',
			key: 'inventoryRemaining',
			render: ({ symbol }) => {
				return (
					<div>
						<div>
							{symbol.split('-')[0].toUpperCase()}:{' '}
							{balanceData[`${symbol}_available`] || 0}
						</div>
						<div>
							{symbol.split('-')[1].toUpperCase()}:{' '}
							{balanceData[`${symbol}_available`] || 0}
						</div>
					</div>
				);
			},
		},
		{
			title: 'Min / Max',
			key: 'minMax',
			render: ({ max_size, min_size, ...rest }) => {
				return sortedSearchResults.map(([key, { min, oraclePrice }]) => {
					if (rest.symbol.split('-')[0] === key) {
						const baseCoin = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
						const minBalanceValue = min_size;
						const minBalanceText =
							key === BASE_CURRENCY
								? formatToCurrency(minBalanceValue, min)
								: formatToCurrency(
										calculateOraclePrice(minBalanceValue, oraclePrice),
										baseCoin.min
								  );
						const maxBalanceValue = max_size;
						const maxBalanceText =
							key === BASE_CURRENCY
								? formatToCurrency(maxBalanceValue, min)
								: formatToCurrency(
										calculateOraclePrice(maxBalanceValue, oraclePrice),
										baseCoin.min
								  );
						return (
							<div key={key}>
								<div className="d-flex">
									<div>
										Min: {min_size} {rest.symbol.split('-')[0].toUpperCase()}
									</div>
									{sortedSearchResults && baseCoin && (
										<div className="ml-2">
											{!isMobile &&
												key !== BASE_CURRENCY &&
												parseFloat(minBalanceText || 0) > 0 && (
													<div>
														{`(≈ ${baseCoin.symbol.toUpperCase()} ${minBalanceText})`}
													</div>
												)}
										</div>
									)}
								</div>
								<div className="d-flex">
									<div>
										Max: {max_size} {rest.symbol.split('-')[0].toUpperCase()}
									</div>
									{sortedSearchResults && baseCoin && (
										<div className="ml-2">
											{!isMobile &&
												key !== BASE_CURRENCY &&
												parseFloat(maxBalanceText || 0) > 0 && (
													<div>
														{`(≈ ${baseCoin.symbol.toUpperCase()} ${maxBalanceText})`}
													</div>
												)}
										</div>
									)}
								</div>
							</div>
						);
					} else {
						return null;
					}
				});
			},
		},
		{
			title: 'Adjust desk values',
			key: 'Adjust desk values',
			render: (data) => {
				return (
					<div className="otc-Container pointer">
						<div
							className="text-underline"
							onClick={() => handlePaused('deal-params', '', true, data)}
						>
							Configure
						</div>
					</div>
				);
			},
		},
	];

	const setPricing = (value) => {
		if (value === 'manual') {
			setIsManual(true);
		} else {
			setIsManual(false);
		}
	};

	const handleInput = (value) => {
		if (value) {
			account_input.current.focus();
		}
	};

	const handlePreviewChange = (value, name, pausedValue = '') => {
		let coinSecondaryData = coinSecondary;
		if (name === 'pair_base') {
			coinSecondaryData = coins.filter((data) => {
				if (typeof data === 'string') {
					return data !== value;
				}
				return data.symbol !== value;
			});
			previewData['pair_2'] = coinSecondaryData.length
				? coinSecondaryData[0].symbol
				: previewData.pair_2;
		}
		if (name === 'pair_base') {
			previewData.pair_base = value;
		} else if (name === 'pair_2') {
			previewData.pair_2 = value;
		}
		const existPairData = brokerData.filter(
			(data) => data.symbol === `${previewData.pair_base}-${previewData.pair_2}`
		);
		let temp = {};
		if (existPairData.length) {
			setIsExistPair(true);
			temp = { ...previewData, ...existPairData[0], [name]: value };
			setPreviewData(temp);
		} else {
			setIsExistPair(false);
			let keys = [
				'increment_size',
				'max_size',
				'min_size',
				'pair_2',
				'pair_base',
			];
			let obj = {};
			keys.map((name) => {
				obj[name] = previewData[name];
			});
			temp = {
				...previewData,
				...obj,
				[name]: value,
			};
			setPreviewData(temp);
			setCoinSecondary(coinSecondaryData);
		}
		if (name === 'paused') {
			setStatus(pausedValue);
		}
	};

	let locale = {
		emptyText: (
			<div className="otc-Container">
				<img
					src={STATIC_ICONS.BROKER_DESK_ICON}
					className="broker-desk-icon"
					alt="active_icon"
				/>
				<div className="main-subHeading mb-3 mt-3">
					Set up your own over-the-counter desk and offer customized coin
					prices.
				</div>
				<div
					className="text-underline mb-3 pointer"
					onClick={() => handlePaused('deal-params', 'openDesk')}
				>
					Open an OTC deal desk
				</div>
			</div>
		),
	};

	const handleBack = (value) => {
		if (type === 'step1') {
			setIsOpen(false);
		} else {
			setType(value);
			setIsOpen(true);
		}
	};

	const handleDealBack = () => {
		if (isEdit || isOpenDesk) {
			handleClose();
		} else {
			handleBack('step1');
		}
	};

	const getFullName = (symbol) => {
		let fullName = '';
		coins.forEach((elem) => {
			if (elem.symbol === symbol) {
				fullName = elem.fullname;
			}
		});
		return fullName;
	};

	const handlePriceNext = () => {
		if (balanceData[`${previewData.pair_base}_available`] !== 0) {
			moveToStep('with-balance');
		} else {
			moveToStep('zero-balance');
		}
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
								onClick={handleClose}
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
			case 'zero-balance':
				return (
					<div className="otc-Container">
						<div className="title mb-3">Add OTC Broker Desk</div>
						<div>Set inventory</div>
						<div className="sub-content mb-3">
							<div>
								Inventory are funds used for satisfying all users orders.
							</div>
							<div>
								It is the responsibility of the operator to allocate an adequate
								amount of both assets.{' '}
							</div>
							<div>
								Simply define an account with sufficient balance that will be
								used to source inventory from.
							</div>
						</div>
						<div className="mb-5">
							<div className="mb-2">Account to source inventory from</div>
							<Input
								ref={account_input}
								placeholder="zero-balance@exchange.com"
								addonAfter={
									<div onClick={() => handleInput('zero-balance')}>Edit</div>
								}
								onChange={(e) =>
									handlePreviewChange(e.target.value, 'inventory_email')
								}
							/>
						</div>
						<div className="mb-4">Available balance on {user.email}:</div>
						<div className="mb-4 coin-image">
							<div className="d-flex align-items-center ">
								<div className=" mr-3">
									<Coins type={previewData.pair_base} />
								</div>
								<div>
									{getFullName(previewData.pair_base)}:{' '}
									{balanceData[`${previewData.pair_base}_available`] || 0}
								</div>
							</div>
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
						</div>
						<div className="mb-4 coin-image">
							<div className="d-flex align-items-center ">
								<div className=" mr-3">
									<Coins type={previewData.pair_2} />
								</div>
								<div>
									{getFullName(previewData.pair_2)}:{' '}
									{balanceData[`${previewData.pair_2}_available`] || 0}
								</div>
							</div>
							<div className="d-flex align-items-center error-container">
								<span className="error">
									{' '}
									<ExclamationCircleFilled />
								</span>
								<span className="balance-error-text pl-2">
									{' '}
									There doesn't seem to be any available balance for this coins
								</span>
							</div>
						</div>
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
								disabled={previewData && !previewData.inventory_email}
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
								disabled={!isManual}
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
									<div>Account: {previewData.inventory_email}</div>
									<div>
										{previewData.pair_base}:{' '}
										{balanceData[`${previewData.pair_base}_available`]}
									</div>
									<div>
										{previewData.pair_2}:{' '}
										{balanceData[`${previewData.pair_2}_available`]}
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
						<div className="title mb-3">Funding account source</div>
						<div>Set the source of the inventory funds</div>
						<div className="sub-content mb-3">
							<div>
								Inventory are funds used for satisfying all users orders.
							</div>
							<div>
								It is the responsibility of the operator to allocate an adequate
								amount of both assets.{' '}
							</div>
							<div>
								Simply define an account with sufficient balance that will be
								used to source inventory from.
							</div>
						</div>
						<div className="mb-5">
							<div className="mb-2">Account to source inventory from</div>
							<Input
								ref={account_input}
								placeholder="admin@exchange.com"
								addonAfter={
									<div onClick={() => handleInput('with-balance')}>Edit</div>
								}
								onChange={(e) => handlePreviewChange(e.target.value, 'email')}
							/>
						</div>
						<div className="mb-4">Available balance on {user.email}:</div>
						<div className="mb-4">
							<div className="d-flex align-items-center coin-image">
								<div className=" mr-3">
									<Coins type={previewData.pair_base} />
								</div>
								<div>
									{getFullName(previewData.pair_base)}:{' '}
									{balanceData[`${previewData.pair_base}_available`] || 0}
								</div>
							</div>
						</div>
						<div className="mb-4">
							<div className="d-flex align-items-center coin-image">
								<div className=" mr-3">
									<Coins type={previewData.pair_2} />
								</div>
								<div>
									{getFullName(previewData.pair_2)}:{' '}
									{balanceData[`${previewData.pair_2}_available`] || 0}
								</div>
							</div>
						</div>
						<div className="message">
							<div className="icon">
								<ExclamationCircleOutlined />
							</div>
							<div className="message-subHeading">
								Please check if the amounts are sufficiently sustainable before
								proceeding.
							</div>
						</div>
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
								onClick={handleClose}
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
								onClick={handleClose}
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

	const moveToStep = (value) => {
		if (value) {
			setType(value);
		}
	};
	const handleCreateNewDeal = () => {
		setIsOpen(true);
		setType('step1');
	};

	const handleClose = () => {
		setIsOpen(false);
		setIsEdit(false);
		setdeskStateData({});
	};

	const getSearchResult = (coinData, balance, oraclePrices) => {
		const searchValue = '';
		const isZeroBalanceHidden = false;
		const result = {};
		const searchTerm = searchValue.toLowerCase().trim();
		Object.keys(coinData).map((key) => {
			const temp = coinData[key];
			const { fullname } = coinData[key] || DEFAULT_COIN_DATA;
			const coinName = fullname ? fullname.toLowerCase() : '';
			const hasCoinBalance = !!balance[`${key}_balance`];
			const isCoinHidden = isZeroBalanceHidden && !hasCoinBalance;
			if (
				!isCoinHidden &&
				(key.indexOf(searchTerm) !== -1 || coinName.indexOf(searchTerm) !== -1)
			) {
				result[key] = { ...temp, oraclePrice: oraclePrices[key] };
			}
			return key;
		});
		return { ...result };
	};

	const searchResult = getSearchResult(coinData, balanceData, oraclePrices);

	const sortedSearchResults = Object.entries(searchResult)
		.filter(([key]) => balanceData.hasOwnProperty(`${key}_balance`))
		.sort(([key_a], [key_b]) => {
			const price_a = calculateOraclePrice(
				balanceData[`${key_a}_balance`],
				searchResult[key_a].oraclePrice
			);
			const price_b = calculateOraclePrice(
				balanceData[`${key_b}_balance`],
				searchResult[key_b].oraclePrice
			);
			return price_a < price_b ? 1 : -1; // descending order
		});

	if (isLoading) {
		return <Spin size="large" />;
	}

	return (
		<div className="otcDeskContainer">
			<div className="header-container">
				<div className="d-flex justify-content-center">
					<img
						src={STATIC_ICONS.BROKER_DESK_ICON}
						className="broker-desk-icon"
						alt="active_icon"
					/>
					<div className="ml-4">
						<div className="main-Heading">OTC broker deal desks</div>
						<div className="main-subHeading">
							Add a fixed prices for specific asset and set max and minimum
							amounts per transaction.
						</div>
						<div className="main-subHeading">
							Open your own custom OTC broker desk with custom prices and asset
							by simply clicking 'Start new deal'.
						</div>
					</div>
				</div>
				<Button
					type="primary"
					className="green-btn"
					onClick={() => handleCreateNewDeal()}
				>
					Start new deal
				</Button>
			</div>
			<div className="table-wrapper">
				<Table
					locale={locale}
					columns={COLUMNS(balanceData, sortedSearchResults)}
					rowKey={(data, index) => index}
					dataSource={brokerData}
					loading={tableLoading}
				/>
			</div>
			<div className="inputarea-Heading">Status display messages</div>
			<div className="inputarea-subHeading">
				Set specific messages that you want to display for different states of
				your OTC desk
			</div>
			<div>
				<div className="inputField-label">Over maximum message:</div>
				<div className="edit-link">
					<Input
						ref={max_message}
						placeholder="For larger orders please contact OTC@trader-exchange.com"
						addonAfter={<div onClick={() => handleEdit('max')}>Edit</div>}
					/>
				</div>
			</div>
			<div>
				<div className="inputField-label">Under minimum message:</div>
				<div className="edit-link">
					<Input
						ref={min_message}
						placeholder="This amount is too small for this transaction"
						addonAfter={<div onClick={() => handleEdit('min')}>Edit</div>}
					/>
				</div>
			</div>
			<div>
				<div className="inputField-label">Market paused message:</div>
				<div className="edit-link">
					<Input
						ref={paused_message}
						placeholder="This market has been temporaily paused.Visit again in a few moments."
						addonAfter={<div onClick={() => handleEdit('pause')}>Edit</div>}
					/>
				</div>
			</div>
			<Modal
				visible={isOpen}
				width={type === 'remove-otcdesk' ? '480px' : '520px'}
				onCancel={handleClose}
				footer={null}
			>
				{renderModalContent()}
			</Modal>
		</div>
	);
};

const mapStateToProps = (store) => ({
	coinData: store.app.coins,
	prices: store.orderbook.prices,
	balanceData: store.user.balance,
	oraclePrices: store.asset.oraclePrices,
});

const mapDispatchToProps = (dispatch) => ({
	setPricesAndAsset: bindActionCreators(setPricesAndAsset, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(OtcDeskContainer);
