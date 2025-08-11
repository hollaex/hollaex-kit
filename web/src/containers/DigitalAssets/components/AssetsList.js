import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import classnames from 'classnames';
import {
	CaretUpOutlined,
	CaretDownOutlined,
	ArrowUpOutlined,
} from '@ant-design/icons';

import {
	DIGITAL_ASSETS_SORT as SORT,
	toggleDigitalAssetsSort as toggleSort,
	setDigitalAssetsSortModeChange as setSortModeChange,
	toggleSortSevenDay,
} from 'actions/appActions';
import { EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import AssetsRow from './AssetsRow';
import { Spin } from 'antd';

const AssetsList = ({
	coinsListData,
	page,
	pageSize,
	count,
	goToNextPage,
	goToPreviousPage,
	showPaginator = false,
	loading,
	mode,
	is_descending,
	toggleSort,
	toggleSortSevenDay,
	setSortModeChange,
	quicktrade,
	pairs,
	pinned_assets,
	icons,
	coinsData,
	isSelectedSort,
	handleSelectedSort,
	selectedButton,
}) => {
	const [isOndDaySort, setIsOneDaySort] = useState(false);
	// let listData = [];
	const handleClickChange = () => {
		setIsOneDaySort(false);
		handleSelectedSort(true);
		if (mode === SORT.CHANGESEVENDAY) {
			toggleSort();
		} else {
			toggleSortSevenDay();
		}
	};

	const handleOneDaySort = () => {
		setIsOneDaySort(true);
		handleSelectedSort(true);
		if (mode === SORT.CHANGE) {
			toggleSort();
		} else {
			setSortModeChange();
		}
	};

	const renderCaret = (cell, isOneDay) => (
		<div
			id={isOneDay ? 'one-day-sort' : 'seven-day-sort'}
			className="market-list__caret d-flex flex-direction-column mx-1 secondary-text"
		>
			<CaretUpOutlined
				className={classnames({
					'important-text': mode === cell && is_descending,
				})}
			/>
			<CaretDownOutlined
				className={classnames({
					'important-text': mode === cell && !is_descending,
				})}
			/>
		</div>
	);

	// const movePinnedItems = (array) => {
	// 	const pinnedItems = pinned_assets;
	// 	const sortedArray = array.sort((a, b) => {
	// 		// Find the first ID that differs between the two objects
	// 		const id = pinnedItems.find((i) => a.symbol !== b.symbol);

	// 		if (id) {
	// 			// If a has the ID, move it to the top
	// 			return a.symbol === id ? -1 : 1;
	// 		}

	// 		return 0;
	// 	});
	// 	return sortedArray;
	// };

	const getSortedList = () => {
		if (isSelectedSort) {
			coinsListData.sort((a, b) => {
				const aVal = parseFloat(
					isOndDaySort
						? a.oneDayPriceDifferencePercenVal
							? a.oneDayPriceDifferencePercenVal
							: 0
						: a.priceDifferencePercentVal
						? a.priceDifferencePercentVal
						: 0
				);
				const bVal = parseFloat(
					isOndDaySort
						? b.oneDayPriceDifferencePercenVal
							? b.oneDayPriceDifferencePercenVal
							: 0
						: b.priceDifferencePercentVal
						? b.priceDifferencePercentVal
						: 0
				);
				return is_descending ? bVal - aVal : aVal - bVal;
			});
		}
		return coinsListData;
	};

	const totalPages = Math.ceil(count / pageSize);
	const hideViewMore = page + 1 >= totalPages;

	const onHandleScrollToTop = () => {
		const scrollOptions = { top: 0, behavior: 'smooth' };
		if (isMobile) {
			return document
				.querySelector('.app_container-content')
				?.scrollTo(scrollOptions);
		} else {
			return window.scrollTo(scrollOptions);
		}
	};

	return (
		<div className="market-list__container">
			<div className="market-list__block">
				<div className="d-flex justify-content-end">
					<EditWrapper
						configId="DIGITAL_ASSETS_LIST_CONFIGS"
						position={[0, 0]}
					/>
				</div>
				<table className="market-list__block-table">
					<thead>
						<tr className="table-bottom-border">
							<th className="sticky-col">
								<div className={isMobile ? 'ml-2' : ''}>
									<EditWrapper stringId="MARKETS_TABLE.ASSET">
										{STRINGS['MARKETS_TABLE.ASSET']}
									</EditWrapper>
								</div>
							</th>
							{!isMobile && (
								<th className="asset-price-header">
									<div className="d-flex justify-content-end">
										<EditWrapper stringId="PRICE">
											{STRINGS['PRICE']}
										</EditWrapper>
									</div>
								</th>
							)}
							{!isMobile && (
								<th className="asset-percentage">
									<div
										onClick={handleOneDaySort}
										className="d-flex justify-content-end pointer"
									>
										<EditWrapper stringId="MARKETS_TABLE.24H">
											{STRINGS.formatString(
												STRINGS['MARKETS_TABLE.PERCENTAGE'],
												STRINGS['MARKETS_TABLE.24H']
											)}
										</EditWrapper>
										{renderCaret(SORT.CHANGE, true)}
									</div>
								</th>
							)}
							{!isMobile && (
								<th className="asset-percentage">
									<div
										onClick={handleClickChange}
										className="d-flex justify-content-end pointer"
									>
										<EditWrapper stringId="QUICK_TRADE_COMPONENT.7D">
											{STRINGS.formatString(
												STRINGS['MARKETS_TABLE.PERCENTAGE'],
												STRINGS['QUICK_TRADE_COMPONENT.7D']
											)}
										</EditWrapper>
										{renderCaret(SORT.CHANGESEVENDAY)}
									</div>
								</th>
							)}
							{isMobile && (
								<th className="market-chart-header">
									<div
										onClick={handleOneDaySort}
										className="d-flex justify-content-center"
									>
										<EditWrapper stringId="DIGITAL_ASSETS.PRICE_24H">
											{STRINGS['DIGITAL_ASSETS.PRICE_24H']}
										</EditWrapper>
										{renderCaret(SORT.CHANGE, true)}
									</div>
								</th>
							)}
							{!isMobile && (
								<th className="market-chart-header">
									<div className="d-flex justify-content-center">
										<EditWrapper stringId="MARKETS_TABLE.TREND_7D">
											{STRINGS['MARKETS_TABLE.TREND_7D']}
										</EditWrapper>
									</div>
								</th>
							)}
							{isMobile &&
								selectedButton !==
									STRINGS['DIGITAL_ASSETS.CARDS.MARKET_CAP'] && (
									<th className="market-chart-header">
										<div
											className="d-flex justify-content-center"
											onClick={handleClickChange}
										>
											<EditWrapper stringId="MARKETS_TABLE.TREND_7D">
												{STRINGS['MARKETS_TABLE.TREND_7D']}
											</EditWrapper>
											{renderCaret(SORT.CHANGESEVENDAY)}
										</div>
									</th>
								)}
							{!isMobile && (
								<th className="market-captial-header mr-3">
									<div className="d-flex justify-content-end">
										<EditWrapper stringId="DIGITAL_ASSETS.CARDS.MARKET_CAP">
											{STRINGS['DIGITAL_ASSETS.CARDS.MARKET_CAP']}
										</EditWrapper>
									</div>
								</th>
							)}
							{isMobile &&
								selectedButton ===
									STRINGS['DIGITAL_ASSETS.CARDS.MARKET_CAP'] && (
									<th className="market-captial-header mr-3">
										<div className="d-flex justify-content-end">
											<EditWrapper stringId="DIGITAL_ASSETS.CARDS.MARKET_CAP">
												{STRINGS['DIGITAL_ASSETS.CARDS.MARKET_CAP']}
											</EditWrapper>
										</div>
									</th>
								)}
							<th className="trade-header">
								<EditWrapper stringId="TRADE_TAB_TRADE">
									{STRINGS['TRADE_TAB_TRADE']}
								</EditWrapper>
							</th>
						</tr>
					</thead>
					<tbody id="market-list_tableBody">
						{getSortedList()?.length >= 1 ? (
							getSortedList()?.map((coinData, index) => (
								<AssetsRow
									index={index}
									key={coinData.code}
									coinData={coinData}
									loading={loading}
									quicktrade={quicktrade}
									pairs={pairs}
									icons={icons}
									selectedButton={selectedButton}
								/>
							))
						) : (
							<tr>
								<td colSpan="7" className="text-center py-4">
									<Spin size="large" />
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			{!hideViewMore && coinsListData?.length >= pageSize && (
				<div className="d-flex content-center view-more-btn mb-2">
					<div
						className="blue-link underline-text pointer"
						onClick={goToNextPage}
					>
						{STRINGS['STAKE_DETAILS.VIEW_MORE']}
					</div>
				</div>
			)}
			<div className="d-flex content-center view-more-btn mb-4">
				<div className="blue-link pointer caps" onClick={onHandleScrollToTop}>
					<EditWrapper stringId="DIGITAL_ASSETS.BACK_TO_TOP">
						<span className="underline-text">
							{STRINGS['DIGITAL_ASSETS.BACK_TO_TOP']}
							<ArrowUpOutlined />
						</span>
					</EditWrapper>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = ({
	app: {
		digital_assets_sort: { mode, is_descending },
		// coins: coinsData,
		quicktrade,
		pairs,
		pinned_assets,
		coinsData,
	},
}) => ({
	mode,
	is_descending,
	// coinsData,
	quicktrade,
	pairs,
	pinned_assets,
	coinsData,
});

const mapDispatchToProps = (dispatch) => ({
	toggleSort: bindActionCreators(toggleSort, dispatch),
	toggleSortSevenDay: bindActionCreators(toggleSortSevenDay, dispatch),
	setSortModeChange: bindActionCreators(setSortModeChange, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(AssetsList));
