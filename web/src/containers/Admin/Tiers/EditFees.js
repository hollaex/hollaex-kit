import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { Button, message, Table, Select, Input } from 'antd';
import {
	CaretDownOutlined,
	LeftOutlined,
	RightOutlined,
} from '@ant-design/icons';
// import { STATIC_ICONS } from 'config/icons';
import withConfig from 'components/ConfigProvider/withConfig';
import Image from '../../../components/Image';
import { updateFees } from './action';
import { Coin } from 'components';
import {
	flipPair,
	quicktradePairSelector,
} from 'containers/QuickTrade/components/utils';

const { Option } = Select;

const getColumns = (
	userTierListDetails,
	feeData,
	ICONS,
	filterTier,
	filterType,
	filterFee,
	coins,
	nextColumnCount,
	prevColumnCount,
	handleSelectFeesEdit = () => {},
	userTiers,
	isActiveNextcolumn = false,
	isActivePreviousColumn = false,
	isReviewFees = false,
	tableData = []
) => {
	const children = [];
	const levels = filterTier
		? [filterTier]
		: Object.keys(userTierListDetails || {});
	const isEditMode = isReviewFees ? '' : 'pointer';

	const onHandleShadowEffect = (tier, shadowClass, feeType) => {
		if (!tier) return;
		tier.className = [tier?.className, shadowClass]?.filter(Boolean)?.join(' ');
		if (Array.isArray(tier?.children)) {
			let idx = -1;
			if (filterType) {
				idx = tier?.children?.findIndex((col) =>
					col?.key?.endsWith(filterType)
				);
			} else if (feeType === 'maker') {
				idx = tier?.children
					?.map((col) => col?.key?.endsWith('maker'))
					?.lastIndexOf(true);
			} else {
				idx = tier?.children?.findIndex((col) => col?.key?.endsWith('taker'));
			}
			if (idx !== -1 && tier?.children[idx]) {
				tier.children[idx] = {
					...tier?.children[idx],
					className: [tier?.children[idx]?.className, shadowClass]
						?.filter(Boolean)
						?.join(' '),
				};
			}
		}
	};

	const columns = [
		{
			title: <div className="font-weight-bold">MARKETS</div>,
			dataIndex: 'market',
			key: 'market',
			fixed: 'left',
			className: 'sticky-col',
			render: (market, row) => {
				if (row?.isSectionTitle) {
					const groupMap = {
						ORDERBOOK: 'pro',
						'OTC - QUICK TRADE (CONVERT)': 'broker',
						'HOLLAEX NETWORK SWAP (CONVERT)': 'network',
					};
					const groupKey = groupMap[row?._sectionTitle] || '';
					return (
						<div
							className={`font-weight-bold ${isEditMode}`}
							onClick={() =>
								!isReviewFees &&
								tableData?.length &&
								handleSelectFeesEdit({
									editType: 'marketType',
									marketType: groupKey,
								})
							}
						>
							{row?._sectionTitle}
						</div>
					);
				}
				const pair_base = market?.split('-')[0] || '';
				return (
					<div
						className={`d-flex align-items-center admin-tier-filters-wrapper text-nowrap ${isEditMode}`}
						onClick={() =>
							!isReviewFees &&
							tableData?.length &&
							handleSelectFeesEdit({ market, editType: 'market' })
						}
					>
						{coins[pair_base] && (
							<Coin type="CS4" iconId={coins[pair_base]?.icon_id} />
						)}
						<span className="no-wrap caps">{market}</span>
					</div>
				);
			},
		},
		{
			title: <div className="font-weight-bold">USER TIER ACCOUNT LEVELS</div>,
			children,
			className: isActivePreviousColumn
				? 'shadow-right'
				: isActiveNextcolumn
				? 'shadow-left'
				: '',
		},
	];

	const makeFeeColumn = (level, type) => {
		const details = { level, type, editType: type };
		return {
			title: (
				<div
					className={`d-flex align-items-center justify-content-center tier-header text-nowrap ${isEditMode}`}
					onClick={() =>
						!isReviewFees && tableData?.length && handleSelectFeesEdit(details)
					}
				>
					<span>{type?.charAt(0)?.toUpperCase() + type?.slice(1)}</span>
				</div>
			),
			dataIndex: `tier_${level}_${type}`,
			key: `tier_${level}_${type}`,
			align: 'center',
			onCell: (row) => {
				if (row?.isSectionTitle) return {};
				const fee = feeData[level]?.[row?.market]?.[type];
				const originalFee = userTiers[level]?.fees?.[type]?.[row?.market];

				return fee !== undefined &&
					originalFee !== undefined &&
					fee !== originalFee
					? { className: `edited-fees-td ${isEditMode}` }
					: Number(fee) === Number(filterFee)
					? { className: `highlighted-fee ${isEditMode}` }
					: { className: isEditMode };
			},
			render: (tier, row) => {
				const tierFee = feeData[level]?.[row?.market]?.[type];
				const cellDetails = {
					level,
					market: row?.market,
					type,
					value: tierFee,
					editType: 'selectedFees',
				};
				return (
					<div
						onClick={() =>
							!isReviewFees &&
							tableData.length &&
							handleSelectFeesEdit(cellDetails)
						}
						className="text-nowrap"
					>
						{tierFee} {!row?.isSectionTitle && '%'}
					</div>
				);
			},
		};
	};

	const headerTiers = levels?.map((level) => {
		const tierChildren = [];
		if (!filterType || filterType === 'taker') {
			tierChildren.push(makeFeeColumn(level, 'taker'));
		}
		if (!filterType || filterType === 'maker') {
			tierChildren.push(makeFeeColumn(level, 'maker'));
		}
		const tierDetail = { level, editType: 'tier' };
		return {
			title: (
				<div
					className="d-flex align-items-center justify-content-center tier-header text-nowrap"
					onClick={() =>
						!isReviewFees &&
						tableData?.length &&
						handleSelectFeesEdit(tierDetail)
					}
				>
					<Image
						icon={ICONS[`LEVEL_ACCOUNT_ICON_${level}`]}
						wrapperClassName="table-tier-icon mr-2"
					/>
					<span className="no-wrap">{`Tier ${level}`}</span>
				</div>
			),
			children: tierChildren,
			className: isEditMode,
		};
	});

	headerTiers.forEach((tier, index) => {
		if (filterTier) {
			children.push(tier);
		} else if (index >= prevColumnCount && index < nextColumnCount) {
			children.push(tier);
		}
	});

	if (isActiveNextcolumn && children?.length > 0) {
		onHandleShadowEffect(
			children[children?.length - 1],
			'shadow-left',
			'maker'
		);
	}
	if (isActivePreviousColumn && children?.length > 0) {
		onHandleShadowEffect(children[0], 'shadow-right', 'taker');
	}
	return columns;
};
class EditFees extends Component {
	constructor(props) {
		super(props);
		this.state = {
			feeData: {},
			buttonSubmitting: false,
			markets: [],
			nextColumnCount: 0,
			prevColumnCount: 0,
			isReviewFees: false,
			visibleTierCount: 0,
		};
		this.tableContainerRef = createRef();
	}

	tableData = [];

	componentDidMount() {
		this.constructData();
		window.addEventListener('resize', this.handleResizeColumns);
		this.handleResizeColumns();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResizeColumns);
	}

	handleResizeColumns = () => {
		const container = this.tableContainerRef?.current;
		if (container) {
			const containerWidth = container?.offsetWidth;
			const minColWidth = 180;
			const visibleCols = Math.max(1, Math.floor(containerWidth / minColWidth));
			this.setState({
				visibleTierCount: visibleCols,
				nextColumnCount: visibleCols,
				prevColumnCount: 0,
			});
		}
	};

	componentDidUpdate(prevProps) {
		const { userTierListDetails = {} } = this.props;
		if (prevProps?.userTierListDetails !== userTierListDetails) {
			this.constructData();
		}
	}
	constructData = () => {
		const { userTierListDetails = {} } = this.props;
		const feeData = {};
		const marketsSet = new Set();

		Object.keys(userTierListDetails || {}).forEach((level) => {
			let data = userTierListDetails[level];
			let makerData = data?.fees ? data?.fees?.maker : {};
			let takerData = data?.fees ? data?.fees?.taker : {};
			Object.keys({ ...makerData, ...takerData }).forEach((market) => {
				marketsSet.add(market);
			});
		});

		Object.keys(userTierListDetails || {}).forEach((level) => {
			let data = userTierListDetails[level];
			let makerData = data?.fees ? data?.fees?.maker : {};
			let takerData = data?.fees ? data?.fees?.taker : {};
			feeData[level] = {};
			marketsSet.forEach((market) => {
				feeData[level][market] = {
					maker: makerData[market] || 0,
					taker: takerData[market] || 0,
				};
			});
		});

		this.setState({ feeData, markets: Array.from(marketsSet) });
	};

	buildFeesPayload = (selectedMarkets, feeData, selectedTiers) => {
		const fees = {};
		const tiers =
			selectedTiers && selectedTiers?.length > 0
				? selectedTiers
				: Object.keys(feeData || {});

		(selectedMarkets || []).forEach((pair) => {
			fees[pair] = {};
			tiers.forEach((level) => {
				if (level !== undefined && feeData[level] && feeData[level][pair]) {
					const maker = feeData[level][pair]?.maker ?? 0;
					const taker = feeData[level][pair]?.taker ?? 0;
					fees[pair][level] = { maker, taker };
				}
			});
		});
		return { fees };
	};

	handleSave = () => {
		const { feeData = {} } = this.state;
		const { tierFilters = {}, quicktradePairs = {} } = this.props;
		const { filterMarket, filterTier, filterType } = tierFilters || {};
		let formData = null;

		const allPairs = Object.keys(feeData[Object.keys(feeData)[0]] || {});
		const allTiers = Object.keys(feeData || {});

		const { userTiers = {} } = this.props;
		let updatedPairs = [];

		(allPairs || []).forEach((pair) => {
			if (!quicktradePairs[pair]) return;
			let changed = false;
			for (const level of allTiers) {
				const originalFee = userTiers[level]?.fees;
				const originalMakerFee = originalFee?.maker?.[pair];
				const originalTakerFee = originalFee?.taker?.[pair];
				const newMaker = feeData?.[level]?.[pair]?.maker;
				const newTaker = feeData?.[level]?.[pair]?.taker;
				if (
					originalMakerFee !== undefined &&
					newMaker !== undefined &&
					Number(originalMakerFee) !== Number(newMaker)
				) {
					changed = true;
					break;
				}
				if (
					originalTakerFee !== undefined &&
					newTaker !== undefined &&
					Number(originalTakerFee) !== Number(newTaker)
				) {
					changed = true;
					break;
				}
			}
			if (changed) updatedPairs.push(pair);
		});

		if (filterMarket) {
			updatedPairs = updatedPairs?.filter((pair) => pair === filterMarket);
		}

		let tiers = allTiers;
		if (filterTier) {
			tiers = [filterTier];
		}

		if (filterType) {
			tiers = tiers?.filter((level) =>
				updatedPairs?.some(
					(pair) => feeData?.[level]?.[pair]?.[filterType] !== undefined
				)
			);
		}

		tiers = tiers?.filter(
			(level) => level !== undefined && level !== null && level !== ''
		);

		formData = this.buildFeesPayload(updatedPairs, feeData, tiers);
		if (!formData || !Object.keys(formData?.fees)?.length) {
			message.error('No fee data to update');
			return;
		}

		this.setState({ buttonSubmitting: true });
		updateFees(formData)
			.then((res) => {
				this.props.getTiers();
				this.props.handleClose();
				this.setState({ buttonSubmitting: false });
				message.success('Fees updated successfully');
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
				this.setState({ buttonSubmitting: false });
			});
	};

	handleFilterChange = (value, type) => {
		const { setTierFilters, quicktradePairs } = this.props;
		if (type === 'filterMarketType') {
			setTierFilters((prev) => {
				const isResetMarket =
					value &&
					prev?.filterMarket &&
					quicktradePairs[prev?.filterMarket]?.type !== value;
				return {
					...prev,
					filterMarket: isResetMarket ? null : prev?.filterMarket,
					filterMarketType: value,
				};
			});
		} else {
			setTierFilters((prev) => ({
				...prev,
				[type]: value,
			}));
		}
	};

	handleSearchChange = (e) => {
		const { setTierFilters } = this.props;
		if (isNaN(e.target?.value) || e.target?.value === '') {
			setTierFilters((prev) => ({
				...prev,
				searchText: e.target?.value,
			}));
		}
	};

	getFilteredTableData = () => {
		const {
			userTierListDetails = {},
			tierFilters,
			quicktradePairs,
		} = this.props;
		const { markets, feeData } = this.state;
		const {
			filterTier,
			filterType,
			filterMarket,
			searchText,
			filterMarketType,
			filterFee,
		} = tierFilters || {};
		const feeValue =
			filterFee &&
			filterFee !== undefined &&
			filterFee !== '' &&
			!isNaN(Number(filterFee))
				? Number(filterFee)
				: null;
		const search = searchText?.toLowerCase?.() || '';

		const groupOrder = [
			{ key: 'pro', label: 'ORDERBOOK' },
			{ key: 'broker', label: 'OTC - QUICK TRADE (CONVERT)' },
			{ key: 'network', label: 'HOLLAEX NETWORK SWAP (CONVERT)' },
		];
		const groupedMarkets = {};
		(markets || []).forEach((market) => {
			const pairInfo =
				quicktradePairs[market] || quicktradePairs[flipPair(market)];
			const type = pairInfo?.type;
			if (!groupedMarkets[type]) groupedMarkets[type] = [];
			groupedMarkets[type].push(market);
		});

		let filteredMarkets = [];
		groupOrder.forEach((group) => {
			const groupMarkets = groupedMarkets[group?.key] || [];
			if (filterMarketType && group?.key !== filterMarketType) return;
			const filteredGroupMarkets = groupMarkets?.filter((market) => {
				if (filterMarket && market !== filterMarket) return false;

				if (search) {
					let found = market?.toLowerCase?.()?.includes(search);
					if (!found) return false;
				}

				if (filterTier && !feeData?.[filterTier]?.[market]) return false;

				if (filterType) {
					if (filterTier) {
						const fees = feeData?.[filterTier]?.[market];
						if (!fees || fees?.[filterType] === undefined) return false;
					} else {
						let found = false;
						for (const level of Object.keys(userTierListDetails || {})) {
							const fees = feeData?.[level]?.[market];
							if (fees && fees?.[filterType] !== undefined) {
								found = true;
								break;
							}
						}
						if (!found) return false;
					}
				}

				if (feeValue !== null) {
					let found = false;
					if (filterTier && filterType) {
						const fees = feeData?.[filterTier]?.[market];
						if (fees && Number(fees?.[filterType]) === feeValue) found = true;
					} else if (filterTier) {
						const fees = feeData?.[filterTier]?.[market];
						if (
							fees &&
							(Number(fees?.maker) === feeValue ||
								Number(fees?.taker) === feeValue)
						)
							found = true;
					} else if (filterType) {
						for (const level of Object.keys(userTierListDetails || {})) {
							const fees = feeData?.[level]?.[market];
							if (fees && Number(fees?.[filterType]) === feeValue) {
								found = true;
								break;
							}
						}
					} else if (feeValue) {
						for (const level of Object.keys(userTierListDetails || {})) {
							const fees = feeData?.[level]?.[market];
							if (
								fees &&
								(Number(fees?.maker) === feeValue ||
									Number(fees?.taker) === feeValue)
							) {
								found = true;
								break;
							}
						}
					} else {
						found = true;
					}
					if (!found) return false;
				}
				return true;
			});

			if (filteredGroupMarkets?.length) {
				filteredMarkets.push({
					key: `section-title-${group?.key}`,
					_sectionTitle: group?.label,
					isSectionTitle: true,
				});
				filteredGroupMarkets.forEach((market) => {
					const row = { key: market, market };
					for (const level of Object.keys(userTierListDetails || {})) {
						row[`tier_${level}`] = true;
					}
					filteredMarkets.push(row);
				});
			}
		});
		if (
			(this.props?.filteredTableData?.length === 0 ||
				this.props?.filteredTableData !== this.tableData) &&
			this.tableData?.length !== 0
		) {
			this.props.setFilteredTableData(filteredMarkets);
		}
		return filteredMarkets;
	};

	onNextColumn = () => {
		const { userTierListDetails = {} } = this.props;
		const tierLength = Object.values(userTierListDetails || {})?.length;
		const { nextColumnCount, prevColumnCount, visibleTierCount } = this.state;
		if (nextColumnCount < tierLength) {
			this.setState({
				nextColumnCount: Math.min(
					nextColumnCount + visibleTierCount,
					tierLength
				),
				prevColumnCount: Math.min(
					prevColumnCount + visibleTierCount,
					tierLength - visibleTierCount
				),
			});
		}
	};

	onPrevColumn = () => {
		const { nextColumnCount, prevColumnCount, visibleTierCount } = this.state;
		const newPrev = Math.max(prevColumnCount - visibleTierCount, 0);
		const newNext = Math.max(
			nextColumnCount - visibleTierCount,
			visibleTierCount
		);
		this.setState({
			prevColumnCount: newPrev,
			nextColumnCount: newNext,
		});
	};

	onHandleReview = () => {
		this.setState({ isReviewFees: true });
	};

	handleBack = () => {
		this.setState({ isReviewFees: false });
	};

	onClearSearch = () => {
		const { setTierFilters } = this.props;
		setTierFilters({
			filterTier: null,
			filterType: null,
			filterMarket: null,
			searchText: null,
			filterMarketType: null,
			filterFee: null,
		});
	};

	render() {
		const {
			icons: ICONS = {},
			userTierListDetails = {},
			handleClose,
			coins = {},
			handleSelectFeesEdit = () => {},
			tierFilters,
			setIsResetFeesPopup,
			quicktradePairs,
			userTiers,
			selectedDetails: { selectedMarkets = [], selectedTiers = [] },
			isActiveEditFees,
		} = this.props;
		const { feeData, markets, isReviewFees } = this.state;
		const {
			filterTier,
			filterType,
			searchText,
			filterMarket,
			filterMarketType,
			filterFee,
		} = tierFilters || {};

		this.tableData = this.getFilteredTableData();
		const marketOptions = markets
			?.filter((market) => {
				const pairInfo =
					quicktradePairs[market] || quicktradePairs[flipPair(market)];
				return (
					pairInfo && (!filterMarketType || pairInfo?.type === filterMarketType)
				);
			})
			?.map((market) => {
				const pairBase = market?.split('-')[0];
				return (
					<Option key={market} value={market} className="caps">
						{coins[pairBase] && (
							<Coin type="CS4" iconId={coins[pairBase]?.icon_id} />
						)}
						<span className="mt-1">{market}</span>
					</Option>
				);
			});
		const marketTypeOptions = [
			{ value: 'pro', label: 'Orderbook' },
			{ value: 'broker', label: 'OTC - Quick Trade (Convert)' },
			{ value: 'network', label: 'HollaEx Network Swap (Convert)' },
		];

		const { nextColumnCount, prevColumnCount } = this.state;
		const totalTiers = Object.keys(userTierListDetails || {})?.length;
		const isActiveNextcolumn = nextColumnCount < totalTiers && !filterTier;
		const isActivePreviousColumn = prevColumnCount > 0 && !filterTier;

		return (
			<div className="admin-tiers-wrapper">
				<div
					className="d-flex fs-24 underline-text pointer px-5 py-2"
					onClick={handleClose}
				>
					{'< '}Back
				</div>
				{!isReviewFees ? (
					<div className="admin-edit-title-wrapper w-100">
						<span className="admin-edit-title caps">Edit Fees</span>
					</div>
				) : (
					<div className="d-flex flex-column admin-fee-review-wrapper justify-content-center align-items-center">
						<div className="fs-24 my-2 bold">REVIEW & APPLY NEW FEES</div>
						<div>You are about to apply a new fee model to your platform</div>
						<div>
							It will make immediate effect and all users will be charged the
							new trading fee rate after confirming.
						</div>
						<div className="mt-3 bold d-flex">
							New fee colored green: <span className="green-box"></span>
						</div>
					</div>
				)}
				<div className="admin-tiers-table-wrapper">
					{!isReviewFees && (
						<div className="d-flex align-items-center flex-wrap justify-content-center mb-3 admin-tier-filters-wrapper">
							<div className="d-flex align-items-center admin-tier-filters">
								<div className="w-100 no-wrap fees-title text-align-center">
									FEES BY USER TIER
								</div>
								<span className="filters-label">FILTERS:</span>
								<Select
									placeholder="Account Tier Level"
									value={filterTier}
									onChange={(v) => this.handleFilterChange(v, 'filterTier')}
									allowClear
									className="blue-admin-select-wrapper"
									dropdownClassName="blue-admin-select-dropdown"
									getPopupContainer={(trigger) => trigger?.parentNode}
									suffixIcon={!filterTier ? <CaretDownOutlined /> : null}
									showSearch
								>
									{Object.keys(userTierListDetails || {})?.map((level) => (
										<Option key={level} value={level}>{`Tier ${level}`}</Option>
									))}
								</Select>
								<Select
									placeholder="Type (maker/taker)"
									value={filterType}
									onChange={(v) => this.handleFilterChange(v, 'filterType')}
									allowClear
									className="blue-admin-select-wrapper"
									dropdownClassName="blue-admin-select-dropdown"
									getPopupContainer={(trigger) => trigger?.parentNode}
									suffixIcon={!filterType ? <CaretDownOutlined /> : null}
									showSearch
								>
									<Option value="maker">Maker</Option>
									<Option value="taker">Taker</Option>
								</Select>
								<Select
									placeholder="All market types"
									value={filterMarket}
									onChange={(v) => this.handleFilterChange(v, 'filterMarket')}
									allowClear
									className="blue-admin-select-wrapper market-select-filter"
									dropdownClassName="blue-admin-select-dropdown market-select-filter-dropdown"
									getPopupContainer={(trigger) => trigger?.parentNode}
									suffixIcon={!filterMarket ? <CaretDownOutlined /> : null}
									showSearch
								>
									{marketOptions}
								</Select>
								<Select
									placeholder="Market Type"
									value={filterMarketType}
									onChange={(v) =>
										this.handleFilterChange(v, 'filterMarketType')
									}
									allowClear
									className="blue-admin-select-wrapper"
									dropdownClassName="blue-admin-select-dropdown"
									getPopupContainer={(trigger) => trigger?.parentNode}
									suffixIcon={!filterMarketType ? <CaretDownOutlined /> : null}
									showSearch
								>
									{marketTypeOptions?.map((opt) => (
										<Option key={opt?.value} value={opt?.value}>
											{opt?.label}
										</Option>
									))}
								</Select>
							</div>
							<div className="d-flex align-items-center admin-tier-filters">
								<span className="filters-label">SEARCH:</span>
								<Input
									placeholder="Asset symbol, trading market pair, fee amount"
									value={searchText}
									onChange={this.handleSearchChange}
									allowClear
									className="blue-admin-input-wrapper"
								/>
							</div>
							<div className="d-flex align-items-center admin-tier-filters">
								<span className="filters-label">FEES:</span>
								<Input
									placeholder="Fee percentage amount%"
									value={filterFee}
									onChange={(e) =>
										this.handleFilterChange(e.target?.value, 'filterFee')
									}
									allowClear
									type="number"
									className="blue-admin-input-wrapper"
								/>
							</div>
						</div>
					)}
					<div
						ref={this.tableContainerRef}
						className={
							filterTier
								? 'w-100 d-flex justify-content-center admin-tiers-table filtered-tier-table'
								: 'w-100 d-flex justify-content-center admin-tiers-table'
						}
					>
						<div>
							<div className="d-flex">
								{isActivePreviousColumn && (
									<div
										className="mt-4 pointer tier-arrow-icon d-flex flex-column align-items-center justify-content-between mb-4"
										onClick={this.onPrevColumn}
									>
										<LeftOutlined className="mt-3" />
										<LeftOutlined />
										<LeftOutlined className="mb-3" />
									</div>
								)}
								<Table
									rowClassName={(record) =>
										record?.isSectionTitle ? 'no-border-row' : ''
									}
									dataSource={this.tableData}
									columns={getColumns(
										userTierListDetails,
										feeData,
										ICONS,
										filterTier,
										filterType,
										filterFee,
										coins,
										nextColumnCount,
										prevColumnCount,
										handleSelectFeesEdit,
										userTiers,
										isActiveNextcolumn,
										isActivePreviousColumn,
										isReviewFees,
										this.tableData
									)}
									pagination={false}
									bordered
									className="mb-4 mt-4"
								/>
								{isActiveNextcolumn && (
									<div
										className="mt-4 pointer tier-arrow-icon d-flex flex-column align-items-center justify-content-between mb-4"
										onClick={this.onNextColumn}
									>
										<RightOutlined className="mt-3" />
										<RightOutlined />
										<RightOutlined className="mb-3" />
									</div>
								)}
							</div>
						</div>
					</div>
					<div className="button-container">
						{isReviewFees && (
							<div className="d-flex justify-content-center gap-1 mb-2">
								<div className="bold">
									Market effected: {selectedMarkets?.length}
								</div>
								<div className="divider mx-3"></div>
								<div className="bold">
									Account tier effected: {selectedTiers?.length}
								</div>
							</div>
						)}
						<div
							className={
								isReviewFees
									? 'd-flex justify-content-start flex-row-reverse gap-1'
									: `d-flex mt-4 ${
											!isActiveEditFees
												? 'justify-content-end'
												: 'justify-content-between'
									  }`
							}
						>
							{(isReviewFees || isActiveEditFees) && (
								<Button
									className={
										isReviewFees
											? 'footer-back-btn px-5 mr-5 no-border'
											: 'green-btn no-border px-5 py-2 reset-btn ml-5'
									}
									onClick={
										isReviewFees
											? this.handleBack
											: () => setIsResetFeesPopup(true)
									}
								>
									{isReviewFees ? 'BACK' : 'RESET'}
								</Button>
							)}
							<div className="d-flex justify-content-end gap-1">
								{(filterTier ||
									filterType ||
									filterMarket ||
									searchText ||
									filterMarketType ||
									filterFee) &&
									!isReviewFees && (
										<div
											className="d-flex align-items-center underline-text pointer"
											onClick={this.onClearSearch}
										>
											CLEAR SEARCH
										</div>
									)}
								{!isActiveEditFees ? (
									<Button
										className="green-btn no-border adjust-fee-btn mr-5"
										onClick={() => {
											this.tableData?.length &&
												handleSelectFeesEdit({ editType: 'allTier' });
										}}
									>
										ADJUST ALL FEES
									</Button>
								) : (
									<>
										<Button
											className={`green-btn no-border ${
												isReviewFees ? 'confirm-btn' : ''
											}`}
											onClick={
												isReviewFees ? this.handleSave : this.onHandleReview
											}
											disabled={!isActiveEditFees}
										>
											{isReviewFees ? 'CONFIRM & APPLY' : 'REVIEW & APPLY'}
										</Button>
										{!isReviewFees && (
											<Button
												className="green-btn no-border adjust-fee-btn mr-5"
												onClick={() => {
													this.tableData?.length &&
														handleSelectFeesEdit({ editType: 'allTier' });
												}}
											>
												ADJUST ALL FEES
											</Button>
										)}
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	quicktradePairs: quicktradePairSelector(state),
});

export default connect(mapStateToProps)(withConfig(EditFees));
