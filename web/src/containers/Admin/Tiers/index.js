import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Tabs, Modal, message, Input, Button, Space } from 'antd';

import TiersContainer from './Tiers';
// import Limits from './Limits';
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
import '../Trades/index.css';
import '../../Admin/General/index.css';
import {
	flipPair,
	quicktradePairSelector,
} from 'containers/QuickTrade/components/utils';
import { Coin, Image } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';

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
	isUseNativeCoin = false,
	coins = {},
	handleSelectFeesEdit = () => {},
	userTierListDetails,
	tierFilters,
	setTierFilters,
	selectedFeesEdit,
	setIsResetFeesPopup,
	isResetFeesPopup,
	selectedDetails = {},
	filteredTableData = [],
	setFilteredTableData = () => {},
	isActiveEditFees = false,
	setIsActiveEditFees = () => {}
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
					userTierListDetails={userTierListDetails}
					getTiers={getTiers}
					handleClose={handleClose}
					coins={coins}
					handleSelectFeesEdit={handleSelectFeesEdit}
					tierFilters={tierFilters}
					setTierFilters={setTierFilters}
					selectedFeesEdit={selectedFeesEdit}
					setIsResetFeesPopup={setIsResetFeesPopup}
					isResetFeesPopup={isResetFeesPopup}
					selectedDetails={selectedDetails}
					filteredTableData={filteredTableData}
					setFilteredTableData={setFilteredTableData}
					isActiveEditFees={isActiveEditFees}
					setIsActiveEditFees={setIsActiveEditFees}
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

const Tiers = ({
	constants = {},
	allIcons: { dark: ICONS = {} },
	allCoins = [],
	coins,
	quicktradePair,
}) => {
	const [userTiers, setTiers] = useState({});
	const [isNew, setNew] = useState(false);
	const [isOpen, setOpen] = useState(false);
	const [modalType, setType] = useState('');
	const [editData, setData] = useState({});
	const [selectedPair, setPair] = useState('');
	const [buttonSubmitting, setButttonSubmitting] = useState(false);
	const [tierName] = useState('');
	const [coinSymbol] = useState('');
	const [isNativeCoin, setIsNativeCoin] = useState(false);
	const [isButtonSubmit, setIsButtonSubmit] = useState(false);
	const [formData, setFormData] = useState({});
	const [isUseNativeCoin, setUseNativeCoin] = useState(false);
	const [isFeesEdit, setIsFeesEdit] = useState(false);
	const [selectedFeesEdit, setSelectedFeesEdit] = useState(null);
	const [editFeeInput, setEditFeeInput] = useState('');
	const [userTierListDetails, setUserTierListDetails] = useState({});
	const [tierFilters, setTierFilters] = useState({
		filterTier: null,
		filterType: null,
		filterMarket: null,
		searchText: null,
		filterMarketType: null,
		filterFee: null,
	});
	const [isResetFeesPopup, setIsResetFeesPopup] = useState(false);
	const [selectedDetails, setSelectedDetails] = useState({
		selectedMarkets: [],
		selectedTiers: [],
		selectedFee: {},
	});
	const [filteredTableData, setFilteredTableData] = useState([]);
	const [isActiveEditFees, setIsActiveEditFees] = useState(false);

	const isConfirmEdit =
		!editFeeInput ||
		(editFeeInput &&
			Number(selectedFeesEdit?.value) === Number(editFeeInput)) ||
		(tierFilters?.filterFee &&
			Number(tierFilters?.filterFee) === Number(editFeeInput));
	const markets = new Set([
		'section-title-broker',
		'section-title-pro',
		'section-title-network',
	]);

	useEffect(() => {
		if (userTiers && Object.keys(userTiers).length) {
			if (userTiers[1]?.native_currency_limit) {
				setIsNativeCoin(true);
				setUseNativeCoin(true);
			}
			setIsActiveEditFees(false);
			setUserTierListDetails(JSON.parse(JSON.stringify(userTiers)));
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
		setIsActiveEditFees(false);
		setUserTierListDetails(JSON.parse(JSON.stringify(userTiers)));
		setTierFilters({
			filterTier: null,
			filterType: null,
			filterMarket: null,
			searchText: null,
			filterMarketType: null,
			filterFee: null,
		});
		setSelectedDetails((prev) => ({
			...prev,
			selectedMarkets: [],
			selectedTiers: [],
			selectedFee: {},
		}));
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
		if (modalType === 'preview') {
			return 520;
		} else if (modalType === 'edit-fees') {
			return '95%';
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

	const handleSelectFeesEdit = (details) => {
		feeCount(details);
		setIsFeesEdit(true);
		setSelectedFeesEdit(details);
		setEditFeeInput(details?.value);
	};

	const getMarketCount = (type) => {
		const { marketType, editType, level = 1 } = selectedFeesEdit || {};
		const { filterFee, filterType } = tierFilters || {};
		const {
			fees: { maker, taker },
		} = userTierListDetails[level];

		let marketCount = 0;

		const onHandleCount = (symbol) => {
			if (type === 'confirmMarketCount') {
				if (!selectedDetails?.selectedMarkets?.includes(symbol)) {
					setSelectedDetails((prev) => ({
						...prev,
						selectedMarkets: [...prev?.selectedMarkets, symbol],
					}));
				}
			} else if (type === 'popupMarketCount') {
				marketCount++;
			}
		};

		filteredTableData.forEach(({ key }) => {
			if (editType === 'marketType') {
				Object.values(quicktradePair || {}).forEach((value) => {
					if (value?.type === marketType && key === value?.symbol) {
						onHandleCount(key);
					}
				});
			} else if (
				filterFee &&
				filterFee !== '' &&
				['tier', 'maker', 'taker'].includes(editType)
			) {
				const feeValue = Number(filterFee);
				const isMaker = editType === 'maker' || filterType === 'maker';
				const isTaker = editType === 'taker' || filterType === 'taker';

				if (
					!isTaker &&
					isMaker &&
					!markets?.has(key) &&
					(maker[key] === feeValue ||
						editType === 'maker' ||
						editType === 'tier')
				) {
					onHandleCount(key);
				} else if (
					!isMaker &&
					isTaker &&
					!markets?.has(key) &&
					(taker[key] === feeValue ||
						editType === 'taker' ||
						editType === 'tier')
				) {
					onHandleCount(key);
				} else if (
					!isMaker &&
					!isTaker &&
					(maker[key] === feeValue ||
						taker[key] === feeValue ||
						(editType === 'tier' && !markets?.has(key)))
				) {
					onHandleCount(key);
				}
			} else if (!markets?.has(key)) {
				onHandleCount(key);
			}
		});
		return marketCount;
	};

	const addTier = (tierLevel) => {
		if (!selectedDetails?.selectedTiers?.includes(tierLevel)) {
			setSelectedDetails((prev) => {
				if (!prev?.selectedTiers?.includes(tierLevel)) {
					return {
						...prev,
						selectedTiers: [...prev?.selectedTiers, tierLevel],
					};
				}
				return prev;
			});
		}
	};

	const allowedPairs = Object.keys(quicktradePair || {});

	const filterFeesByQuicktradePairs = (feesObj) =>
		Object.entries(feesObj)
			?.filter(([pair]) => allowedPairs?.includes(pair))
			?.map(([_, value]) => value);

	const tierEffected = () => {
		if (!selectedFeesEdit) return '';
		const { editType, level } = selectedFeesEdit;
		const {
			filterTier,
			filterType,
			filterFee,
			searchText,
			filterMarketType,
			filterMarket,
		} = tierFilters;
		switch (editType) {
			case 'tier':
			case 'maker':
			case 'taker':
			case 'selectedFees':
				addTier(level);
				break;
			case 'market':
			case 'marketType':
			case 'allTier':
				if (filterFee && editType === 'allTier') {
					const { selectedTiers } = selectedDetails;
					const details = selectedTiers?.length ? selectedTiers : [];
					Object.entries(userTierListDetails || {}).forEach(
						([
							tierLevel,
							{
								fees: { taker, maker },
							},
						]) => {
							const filteredType =
								filterType === 'taker' && taker
									? [taker]
									: filterType === 'maker' && maker
									? [maker]
									: [maker, taker];
							if (filterMarketType) {
								Object.values(quicktradePair || {}).forEach((data) => {
									if (data?.type === filterMarketType) {
										(filteredType || []).forEach((fees) => {
											if (!allowedPairs?.includes(data?.symbol)) return;
											if (filterTier) {
												if (searchText || filterMarket) {
													if (
														fees[data?.symbol] === Number(filterFee) &&
														!details?.includes(tierLevel) &&
														filterTier === tierLevel
													) {
														if (filterMarket) {
															data?.symbol === filterMarket &&
																details.push(tierLevel);
														} else if (
															data?.symbol?.includes(searchText) &&
															searchText !== ''
														) {
															details.push(tierLevel);
														}
													}
												} else if (
													filterTier === tierLevel &&
													!searchText &&
													!filterMarket &&
													fees[data?.symbol] === Number(filterFee) &&
													!details?.includes(tierLevel)
												) {
													details.push(tierLevel);
												}
											} else if (searchText || filterMarket) {
												if (
													!details?.includes(tierLevel) &&
													fees[data?.symbol] === Number(filterFee)
												) {
													if (filterMarket) {
														data?.symbol === filterMarket &&
															details.push(tierLevel);
													} else if (data?.symbol?.includes(searchText)) {
														details.push(tierLevel);
													}
												}
											} else if (
												!details?.includes(tierLevel) &&
												fees[data?.symbol] === Number(filterFee)
											) {
												details.push(tierLevel);
											}
										});
									}
								});
							} else if (filterType && filterTier) {
								if (
									(filterType === 'maker' &&
										filterFeesByQuicktradePairs(maker)?.includes(
											Number(filterFee)
										) &&
										filterTier === tierLevel) ||
									(filterType === 'taker' &&
										filterFeesByQuicktradePairs(taker)?.includes(
											Number(filterFee)
										) &&
										filterTier === tierLevel)
								) {
									!details?.includes(tierLevel) && details.push(tierLevel);
								}
							} else if (filterType) {
								if (
									(filterType === 'maker' &&
										filterFeesByQuicktradePairs(maker).includes(
											Number(filterFee)
										)) ||
									(filterType === 'taker' &&
										filterFeesByQuicktradePairs(taker).includes(
											Number(filterFee)
										))
								) {
									if (filterMarket || searchText) {
										Object.entries(...filteredType).forEach(([key, value]) => {
											if (
												allowedPairs.includes(key) &&
												!details?.includes(tierLevel) &&
												value === Number(filterFee)
											) {
												if (filterMarket)
													key === filterMarket && details.push(tierLevel);
												else if (
													searchText &&
													searchText !== '' &&
													key?.includes(searchText)
												)
													details.push(tierLevel);
											}
										});
									} else {
										!details?.includes(tierLevel) && details.push(tierLevel);
									}
								}
							} else if (filterTier) {
								if (filterTier === tierLevel) {
									!details?.includes(tierLevel) && details.push(tierLevel);
								}
							} else if (searchText || filterMarket) {
								filteredType.forEach((fees) => {
									Object.entries(fees).forEach(([key, value]) => {
										if (
											allowedPairs.includes(key) &&
											!details?.includes(tierLevel) &&
											value === Number(filterFee)
										) {
											if (filterMarket)
												key === filterMarket && details.push(tierLevel);
											else if (key?.includes(searchText))
												details.push(tierLevel);
										}
									});
								});
							} else {
								const quicktradeTierFees = [
									...filterFeesByQuicktradePairs(taker),
									...filterFeesByQuicktradePairs(maker),
								];
								if (
									quicktradeTierFees?.includes(Number(filterFee)) &&
									!details?.includes(tierLevel)
								) {
									details.push(tierLevel);
								}
							}
						}
					);
					if (details?.length) {
						setSelectedDetails((prev) => ({
							...prev,
							selectedTiers: [...details],
						}));
					}
				} else if (filterTier) {
					addTier(filterTier);
				} else {
					Object.keys(userTierListDetails).forEach(addTier);
				}
				break;
			default:
				return 1;
		}
	};

	const setFeeCount = (level, type, market, value) => {
		setSelectedDetails((prev) => ({
			...prev,
			selectedFee: {
				...prev.selectedFee,
				[level]: {
					...prev.selectedFee?.[level],
					[type]: {
						...prev.selectedFee?.[level]?.[type],
						[market]: value,
					},
				},
			},
		}));
	};

	const feeCount = (details, countType = '') => {
		let feeCount = 0;
		if (!details) {
			countType === 'reviewCount' &&
				setSelectedDetails((prev) => ({ ...prev, selectedFee: {} }));
			return null;
		}
		const { editType, market, marketType, level, type, value } = details;
		const { filterTier, filterType, filterFee } = tierFilters;
		if (editType === 'selectedFees') {
			feeCount++;
			if (countType === 'reviewCount') {
				setFeeCount(level, type, market, value);
			}
			return feeCount;
		}

		const types =
			filterType === 'taker' || editType === 'taker'
				? ['taker']
				: editType === 'maker' || filterType === 'maker'
				? ['maker']
				: ['taker', 'maker'];
		filteredTableData.forEach((marketDetails) => {
			if (!markets.has(marketDetails?.key)) {
				types.forEach((type) => {
					if (editType === 'marketType') {
						Object.values(quicktradePair).forEach((pair) => {
							if (
								marketType &&
								pair?.type === marketType &&
								pair?.symbol === marketDetails?.key
							) {
								Object.entries(userTierListDetails).forEach(
									([idx, details]) => {
										Object.entries(details?.fees[type]).forEach(
											([asset, value]) => {
												if (
													(filterTier &&
														idx === filterTier &&
														asset === marketDetails?.key) ||
													(!filterTier && asset === marketDetails?.key)
												) {
													if (countType === 'reviewCount') {
														setFeeCount(idx, type, asset, value);
													}
													feeCount++;
												}
											}
										);
									}
								);
							}
						});
					} else if (editType === 'market' && market) {
						if (marketDetails?.key === market) {
							Object.entries(userTierListDetails).forEach(([idx, details]) => {
								Object.entries(details?.fees[type]).forEach(
									([asset, value]) => {
										if (
											(filterTier && idx === filterTier && asset === market) ||
											(!filterTier && asset === market)
										) {
											if (countType === 'reviewCount') {
												setFeeCount(idx, type, asset, value);
											}
											feeCount++;
										}
									}
								);
							});
						}
					} else if (
						editType === 'taker' ||
						editType === 'maker' ||
						editType === 'tier'
					) {
						if (level) {
							Object.entries(userTierListDetails[level]?.fees[type]).forEach(
								([asset, fee]) => {
									if (asset === marketDetails?.key) {
										countType === 'reviewCount' &&
											setFeeCount(level, type, asset, fee);
										feeCount += 1;
									}
								}
							);
						}
					} else {
						if (
							(filterTier && filterTier !== undefined && filterFee) ||
							(!filterFee && filterTier)
						) {
							Object.entries(
								userTierListDetails[filterTier]?.fees[type]
							).forEach(([asset, fee]) => {
								if (filterFee && filterTier) {
									if (
										Number(fee) === Number(filterFee) &&
										marketDetails?.key === asset
									) {
										if (countType === 'reviewCount') {
											setFeeCount(filterTier, type, asset, fee);
										}
										feeCount++;
									}
								} else if (!filterFee && filterTier) {
									if (asset === marketDetails?.key) {
										countType === 'reviewCount' &&
											setFeeCount(filterTier, type, asset, fee);
										feeCount += 1;
									}
								}
							});
						} else {
							Object.entries(userTierListDetails).forEach(
								([level, details]) => {
									Object.entries(details?.fees[type]).forEach(
										([asset, fee]) => {
											if (filterFee) {
												if (
													Number(fee) === Number(filterFee) &&
													marketDetails?.key === asset
												) {
													if (countType === 'reviewCount') {
														setFeeCount(level, type, asset, fee);
													}
													feeCount++;
												}
											} else if (!filterFee) {
												if (asset === marketDetails?.key) {
													countType === 'reviewCount' &&
														setFeeCount(level, type, asset, fee);
													feeCount++;
												}
											}
										}
									);
								}
							);
						}
					}
				});
			}
		});
		return feeCount;
	};

	const isFeeMatch = (feeValue, filterFee) =>
		Number(feeValue) === Number(filterFee);

	const shouldApplyFee = (pair, feeType, feeValue, filters, tierIndex) => {
		const {
			filterTier,
			filterMarket,
			filterMarketType,
			searchText,
			filterFee,
			filterType,
		} = filters;
		const { marketType, editType } = selectedFeesEdit || {};
		const pairType = (quicktradePair[pair] || quicktradePair[flipPair(pair)])
			?.type;

		if (filterTier && Number(tierIndex) !== Number(filterTier)) return false;
		if (filterMarket && pair !== filterMarket) return false;
		if (filterMarketType && pairType !== filterMarketType) return false;
		if (marketType && pairType !== marketType) return false;
		if (searchText && !pair?.toLowerCase()?.includes(searchText?.toLowerCase()))
			return false;
		if (
			filterFee !== undefined &&
			filterFee !== null &&
			filterFee !== '' &&
			!isFeeMatch(feeValue, filterFee) &&
			editType === 'allTier'
		)
			return false;
		if (filterType && filterType !== 'all' && filterType !== feeType)
			return false;
		return true;
	};

	const handleConfirmEditFee = () => {
		const { level, market, type, editType } = selectedFeesEdit;
		feeCount(selectedFeesEdit, 'reviewCount');
		tierEffected();
		setTierFilters({
			filterTier: null,
			filterType: null,
			filterMarket: null,
			searchText: null,
			filterMarketType: null,
			filterFee: null,
		});
		setIsActiveEditFees(true);
		setUserTierListDetails((prevTiers) => {
			const updatedTiers = { ...prevTiers };

			const setFee = (tierIdx, feeType, pair) => {
				const tier = updatedTiers[tierIdx];
				if (tier?.fees?.[feeType]?.[pair] !== undefined) {
					tier.fees[feeType][pair] = Number(editFeeInput);
				}
			};

			const applyToAllPairs = (tierIdx, feeType, filters = {}) => {
				const pairs = updatedTiers[tierIdx]?.fees?.[feeType] || {};
				Object.keys(pairs).forEach((pair) => {
					const feeValue = Number(pairs[pair]);
					filteredTableData.forEach(({ key }) => {
						if (!markets.has(key) && key === pair) {
							if (shouldApplyFee(pair, feeType, feeValue, filters, tierIdx)) {
								setFee(tierIdx, feeType, pair);
							}
						}
					});
				});
			};

			const applyToAllTiers = (filters) => {
				Object.entries(updatedTiers).forEach(([tierIdx, { fees }]) => {
					['maker', 'taker'].forEach((feeType) => {
						const pairs = fees?.[feeType] || {};
						Object.keys(pairs).forEach((pair) => {
							filteredTableData.forEach(({ key }) => {
								if (!markets.has(key) && key === pair) {
									const feeValue = Number(pairs[pair]);
									if (
										shouldApplyFee(pair, feeType, feeValue, filters, tierIdx)
									) {
										setFee(tierIdx, feeType, pair);
									}
								}
							});
						});
					});
				});
			};

			switch (editType) {
				case 'maker':
				case 'taker':
					getMarketCount('confirmMarketCount');
					applyToAllPairs(level, type, tierFilters);
					break;
				case 'selectedFees':
					setFee(level, type, market);
					if (!selectedDetails?.selectedMarkets?.includes(market)) {
						setSelectedDetails((prev) => ({
							...prev,
							selectedMarkets: [...prev?.selectedMarkets, market],
						}));
					}
					break;
				case 'tier':
					getMarketCount('confirmMarketCount');
					['maker', 'taker'].forEach((feeType) =>
						applyToAllPairs(level, feeType, tierFilters)
					);
					break;
				case 'market':
					Object.keys(updatedTiers).forEach((tierIdx) => {
						['maker', 'taker'].forEach((feeType) => {
							const feeValue = Number(
								updatedTiers[tierIdx]?.fees?.[feeType]?.[market]
							);
							if (
								shouldApplyFee(market, feeType, feeValue, tierFilters, tierIdx)
							) {
								setFee(tierIdx, feeType, market);
							}
						});
					});
					if (!selectedDetails?.selectedMarkets?.includes(market)) {
						setSelectedDetails((prev) => ({
							...prev,
							selectedMarkets: [...prev.selectedMarkets, market],
						}));
					}
					break;
				case 'allTier':
				case 'marketType':
					getMarketCount('confirmMarketCount');
					applyToAllTiers(tierFilters);
					break;
				default:
					break;
			}

			message.success('NOTICATION: FEE TABLE UPDATED');
			return updatedTiers;
		});

		setIsFeesEdit(false);
	};

	const onHandleConfirmReset = () => {
		setIsResetFeesPopup(false);
		setIsActiveEditFees(false);
		setUserTierListDetails(JSON.parse(JSON.stringify(userTiers)));
		setSelectedDetails((prev) => ({
			...prev,
			selectedMarkets: [],
			selectedTiers: [],
			selectedFee: {},
		}));
	};

	const getMarketTypeLabel = (type) => {
		if (!type) return '';
		switch (type) {
			case 'pro':
				return "'ORDERBOOK'.";
			case 'broker':
				return "'OTC'.";
			case 'network':
				return "'NETWORK'.";
			default:
				return '';
		}
	};

	const renderLabelContent = (labelTag, text) => (
		<span className="d-flex">
			{labelTag}
			{text}
		</span>
	);

	const renderMarketContent = (labelTag, marketContent, text) => (
		<div className="d-flex align-items-center">
			{labelTag}
			{marketContent}
			{text && <span>: {text}</span>}
		</div>
	);

	const selectedFees = (() => {
		if (!selectedFeesEdit) return '';
		const {
			editType,
			level,
			value,
			market,
			type,
			marketType,
		} = selectedFeesEdit;
		const {
			filterFee,
			filterMarket,
			filterType,
			filterMarketType,
			searchText,
			filterTier,
		} = tierFilters;
		const isFilterActive = Object.values(tierFilters || {}).every((data) => {
			return !data;
		});
		const pairBase = market?.split('-')[0];
		const isIcon = Object.entries(tierFilters || {}).every(([key, value]) => {
			return (
				(key === 'filterTier' && value) || (key !== 'filterTier' && !value)
			);
		});
		const isFilterTier = (level) => {
			if (ICONS[`LEVEL_ACCOUNT_ICON_${level}`]) {
				return true;
			}
			return false;
		};
		switch (editType) {
			case 'tier':
				return (
					<div
						className={`d-flex align-items-center justify-content-center text-nowrap
                 ${isFilterTier(level) ? 'filter-tier-icon' : ''}`}
					>
						<Image
							icon={ICONS[`LEVEL_ACCOUNT_ICON_${level}`]}
							wrapperClassName="table-tier-icon mr-2"
						/>
						<span className="no-wrap">{`Tier ${level}`}</span>
					</div>
				);

			case 'selectedFees':
				return `${value}% fees`;
			case 'market':
				return (
					<div className="selected-market">
						{coins[pairBase] && (
							<Coin type="CS4" iconId={coins[pairBase]?.icon_id} />
						)}
						<span className="caps">{market}</span>
					</div>
				);
			case 'marketType':
				return getMarketTypeLabel(marketType) || '';
			case 'allTier': {
				const tierLabel =
					filterTier && isIcon ? (
						<div
							className={`d-flex align-items-center justify-content-center text-nowrap
                    ${isFilterTier(filterTier) ? 'filter-tier-icon' : ''}`}
						>
							<Image
								icon={ICONS[`LEVEL_ACCOUNT_ICON_${filterTier}`]}
								wrapperClassName="table-tier-icon mr-1"
							/>
							<span className="no-wrap">{`Tier ${filterTier}`}</span>
						</div>
					) : filterTier && !isIcon ? (
						`Tier ${filterTier}`
					) : (
						''
					);
				const coinIcon = filterMarket
					? coins[filterMarket?.split('-')[0]]?.icon_id
					: null;

				const labelSpan = tierLabel && (
					<span className="mr-2">{tierLabel}</span>
				);
				const marketDiv = filterMarket && (
					<div className="selected-market">
						{coinIcon && <Coin type="CS4" iconId={coinIcon} />}
						<span className="caps">{filterMarket?.toUpperCase()}</span>
					</div>
				);
				const marketTypeLabel =
					filterMarketType && getMarketTypeLabel(filterMarketType);

				let desc = '';
				if (filterFee) desc += `${filterFee}%`;
				if (filterType) desc += `${desc ? ' ' : ''}${filterType} fees`;
				else if (filterFee) desc += ` fees`;
				if (searchText)
					desc += `${desc ? ' ' : ''}${searchText?.toUpperCase()}`;
				if (!filterFee && !filterType && !searchText && marketTypeLabel)
					desc += marketTypeLabel;
				if (desc && marketTypeLabel && !desc.includes(marketTypeLabel))
					desc += ` : ${marketTypeLabel}`;
				if (!desc && !marketTypeLabel && isFilterActive) desc = 'ALL';

				if (filterMarket) {
					return renderMarketContent(labelSpan, marketDiv, desc);
				}
				return renderLabelContent(labelSpan, desc);
			}
			default:
				return `Tier ${level}: ${type}`;
		}
	})();

	const marketsEffected = () => {
		if (!selectedFeesEdit) return '';
		const { editType } = selectedFeesEdit;

		if (['market', 'selectedFees']?.includes(editType)) {
			return 1;
		}
		return getMarketCount('popupMarketCount');
	};

	return (
		<div className="admin-tiers-wrapper admin-earnings-container w-100">
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
				{/* <TabPane tab="Limits" key="limits">
					<Limits
						userTiers={userTiers}
						onEditLimit={(symbol, fullName) => {
							setOpen(true);
							onTypeChange('edit-limits');
							setSymbol(symbol);
							setTierName(fullName);
						}}
					/>
				</TabPane> */}
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
				className={modalType === 'edit-fees' ? 'edit-fees-popup-wrapper' : ''}
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
					isUseNativeCoin,
					coins,
					handleSelectFeesEdit,
					userTierListDetails,
					tierFilters,
					setTierFilters,
					selectedFeesEdit,
					setIsResetFeesPopup,
					isResetFeesPopup,
					selectedDetails,
					filteredTableData,
					setFilteredTableData,
					isActiveEditFees,
					setIsActiveEditFees
				)}
			</Modal>
			<Modal
				visible={isFeesEdit}
				className="selected-fees-edit-popup-wrapper"
				onCancel={() => setIsFeesEdit(false)}
				footer={null}
			>
				<div className="selected-fees-edit-details">
					<span className="adjust-fees-title">Adjust Fees</span>
					<div className="selected-fees-edit-description">
						<span className="selected-fees-edit-text">
							You will adjust all fees for{' '}
							<span className="selected-fees">{selectedFees}</span>
						</span>
						<span className="bold">Market affected: {marketsEffected()}</span>
						<span className="bold">
							Fee Count: {feeCount(selectedFeesEdit, 'popupFee')}
						</span>
					</div>
					<div className="selected-fees-edit-inputs">
						<span>Fee</span>
						<Space className="input-wrappers">
							<Input
								className="selected-fees-edit-input"
								placeholder="Input New Fees"
								type="number"
								value={editFeeInput}
								onChange={(e) => setEditFeeInput(e.target.value)}
							/>
							<span>%</span>
						</Space>
					</div>
					<div className="edit-fees-button-container">
						<Button
							className="green-btn no-border w-50"
							onClick={() => setIsFeesEdit(false)}
						>
							Cancel
						</Button>
						<Button
							className={
								isConfirmEdit
									? 'green-btn no-border w-50 confirm-btn'
									: 'green-btn no-border w-50'
							}
							disabled={isConfirmEdit}
							onClick={handleConfirmEditFee}
						>
							Confirm
						</Button>
					</div>
				</div>
			</Modal>
			<Modal
				visible={isResetFeesPopup}
				onCancel={() => setIsResetFeesPopup(false)}
				footer={null}
				className="reset-fees-popup-wrapper"
			>
				<div className="d-flex flex-column">
					<span className="reset-fees-title">Reset All Fee Adjustments</span>
					<span className="reset-fees-description">
						You are about to reset all the fee adjustments made.
					</span>
					<div className="reset-fees-button-conatiner">
						<Button
							className="green-btn no-border w-50"
							onClick={() => setIsResetFeesPopup(false)}
						>
							CANCEL
						</Button>
						<Button
							className="green-btn no-border w-50"
							onClick={onHandleConfirmReset}
						>
							RESET
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

const mapStateToProps = (state) => ({
	constants: state.app.constants,
	allCoins: state.asset.allCoins,
	coins: state.app.coins,
	quicktradePair: quicktradePairSelector(state),
});

export default connect(mapStateToProps)(withConfig(Tiers));
