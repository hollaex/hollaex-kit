import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import { Table, Button, message, Spin } from 'antd';
import { MinusCircleFilled } from '@ant-design/icons';
import _debounce from 'lodash/debounce';

import { STATIC_ICONS } from 'config/icons';
import { getBroker, createBroker, deleteBroker, updateBroker } from './actions';
import { formatToCurrency, calculateOraclePrice } from 'utils/currency';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';
import { setPricesAndAsset } from 'actions/assetActions';
import Otcdeskpopup from './Otcdeskpopup';
import { requestUsers } from '../ListUsers/actions';
import { setBroker } from 'actions/appActions';

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
	setBroker,
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
	const [emailOptions, setEmailOptions] = useState([]);
	const [userData, setUserData] = useState([]);
	const [pairBaseBalance, setPairBaseBalance] = useState(0);
	const [pair2Balance, setPair2Balance] = useState(0);
	const [selectedEmailData, setSelectedEmailData] = useState({});

	// const max_message = useRef(null);
	// const min_message = useRef(null);
	// const paused_message = useRef(null);

	const getBrokerData = useCallback(async () => {
		setTableLoading(true);
		try {
			const res = await getBroker();
			setBrokerData(res);
			setTableLoading(false);
			setBroker(res);
		} catch (error) {
			setTableLoading(false);
			if (error) {
				message.error(error.message);
			}
		}
	}, [setBroker]);

	useEffect(() => {
		getBrokerData();
	}, [getBrokerData]);

	useEffect(() => {
		if (isOpen) {
			getAllUserData();
		}
	}, [isOpen]);

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
	}, [exchange.coins, editData, isOpen, isEdit, exchange, brokerData]);

	useEffect(() => {
		let pairBase = balanceData[`${previewData.pair_base}_available`] || 0;
		let pair2 = balanceData[`${previewData.pair_2}_available`] || 0;
		let emailData = {};
		userData.forEach((data) => {
			if (selectedEmailData.label === data.email) {
				emailData = data;
			}
		});
		if (emailData && emailData.balance) {
			pairBase = emailData.balance[`${previewData.pair_base}_available`] || 0;
			pair2 = emailData.balance[`${previewData.pair_2}_available`] || 0;
		}
		if (pairBase !== 0 && pair2 !== 0) {
			setPairBaseBalance(pairBase);
			setPair2Balance(pair2);
		} else if (pairBase === 0 && pair2 !== 0) {
			setPairBaseBalance(0);
			setPair2Balance(pair2);
		} else if (pairBase !== 0 && pair2 === 0) {
			setPairBaseBalance(pairBase);
			setPair2Balance(0);
		} else {
			setPairBaseBalance(0);
			setPair2Balance(0);
		}
	}, [userData, previewData, balanceData, selectedEmailData]);

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
		handlePreviewChange(emailId, 'user_id');
		handleSearch(emailData.label);
	};

	const handleClosePopup = () => {
		setSelectedEmailData({});
		handleClose();
	};

	const getAllUserData = async (params = {}) => {
		try {
			const res = await requestUsers(params);
			if (res && res.data) {
				const userData = res.data.map((user) => ({
					label: user.email,
					value: user.id,
				}));
				setEmailOptions(userData);
				setUserData(res.data);
			}
		} catch (error) {
			console.log('error', error);
		}
	};

	const searchUser = (searchText, type) => {
		getAllUserData({ search: searchText }, type);
	};

	const handleSearch = _debounce(searchUser, 1000);

	const createBrokerData = async () => {
		const body = {
			...previewData,
			user_id:
				previewData && previewData.user_id ? previewData.user_id : user.id,
			symbol: `${previewData.pair_base}-${previewData.pair_2}`,
			sell_price: parseFloat(previewData.sell_price),
			buy_price: parseFloat(previewData.buy_price),
			paused: previewData.paused ? previewData.paused : false,
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
			user_id: params && params.user_id ? params.user_id : user.id,
			sell_price: parseFloat(params.sell_price),
			buy_price: parseFloat(params.buy_price),
			paused: params ? params.paused : previewData.paused,
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

	// const handleEdit = (type) => {
	// 	if (type === 'max') {
	// 		max_message.current.focus();
	// 	} else if (type === 'min') {
	// 		min_message.current.focus();
	// 	} else {
	// 		paused_message.current.focus();
	// 	}
	// };

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
							{balanceData[`${symbol && symbol.split('-')[0]}_available`] || 0}
						</div>
						<div>
							{symbol.split('-')[1].toUpperCase()}:{' '}
							{balanceData[`${symbol && symbol.split('-')[1]}_available`] || 0}
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

	const handlePreviewChange = (value, name, pausedValue = '') => {
		let tempPreviewData = { ...previewData };
		let coinSecondaryData = coinSecondary;
		if (name === 'pair_base') {
			coinSecondaryData = coins.filter((data) => {
				if (typeof data === 'string') {
					return data !== value;
				}
				return data.symbol !== value;
			});
			if (coinSecondaryData.length) {
				tempPreviewData['pair_2'] = coinSecondaryData[0].symbol;
			}
		}
		if (name === 'pair_base') {
			tempPreviewData.pair_base = value;
		} else if (name === 'pair_2') {
			tempPreviewData.pair_2 = value;
		}
		if (name === 'pair_base' || name === 'pair_2') {
			const existPairData = brokerData.filter(
				(data) =>
					data.symbol ===
					`${tempPreviewData.pair_base}-${tempPreviewData.pair_2}`
			);
			if (existPairData.length) {
				setIsExistPair(true);
				tempPreviewData = { ...tempPreviewData, ...existPairData[0] };
			} else {
				setIsExistPair(false);
				tempPreviewData = {
					...defaultPreviewValues,
					pair_base: tempPreviewData.pair_base,
					pair_2: tempPreviewData.pair_2,
				};
			}
		}
		tempPreviewData = { ...tempPreviewData, [name]: value };
		setPreviewData(tempPreviewData);
		setCoinSecondary(coinSecondaryData);
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
		moveToStep('with-balance');
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
		setEmailOptions([]);
		setUserData([]);
		moveToStep('step1');
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
							Add a fixed price for specific asset and set max and minimum
							amounts per transaction.{' '}
							<a
								target="_blank"
								href="https://docs.hollaex.com/how-tos/otc-broker"
								rel="noopener noreferrer"
							>
								Learn more.
							</a>
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
			{/* <div className="inputarea-Heading">Status display messages</div>
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
			</div> */}
			<Otcdeskpopup
				previewData={previewData}
				type={type}
				handlePreviewChange={handlePreviewChange}
				getCoinSource={getCoinSource}
				coinSecondary={coinSecondary}
				isExistsPair={isExistsPair}
				handleClose={handleClose}
				moveToStep={moveToStep}
				getFullName={getFullName}
				handleBack={handleBack}
				isManual={isManual}
				coins={coins}
				user={user}
				balanceData={balanceData}
				handleDealBack={handleDealBack}
				handlePriceNext={handlePriceNext}
				handleBrokerChange={handleBrokerChange}
				handlePaused={handlePaused}
				deleteBrokerData={deleteBrokerData}
				isOpen={isOpen}
				setPricing={setPricing}
				setType={setType}
				status={status}
				emailOptions={emailOptions}
				handleSearch={handleSearch}
				pairBaseBalance={pairBaseBalance}
				pair2Balance={pair2Balance}
				getAllUserData={getAllUserData}
				handleEmailChange={handleEmailChange}
				handleClosePopup={handleClosePopup}
				selectedEmailData={selectedEmailData}
			/>
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
	setBroker: bindActionCreators(setBroker, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(OtcDeskContainer);
