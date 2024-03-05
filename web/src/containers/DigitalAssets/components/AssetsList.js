import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

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
}) => {
	const [isOndDaySort, setIsOneDaySort] = useState(false);
	const handleClickChange = () => {
		setIsOneDaySort(false);
		if (mode === SORT.CHANGESEVENDAY) {
			toggleSort();
		} else {
			toggleSortSevenDay();
		}
	};

	const handleOneDaySort = () => {
		setIsOneDaySort(true);
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

	const movePinnedItems = (array) => {
		const pinnedItems = pinned_assets;
		const sortedArray = array.sort((a, b) => {
			// Find the first ID that differs between the two objects
			const id = pinnedItems.find((i) => a.symbol !== b.symbol);

			if (id) {
				// If a has the ID, move it to the top
				return a.symbol === id ? -1 : 1;
			}

			return 0;
		});
		return sortedArray;
	};

	const getSortedList = () => {
		return movePinnedItems(
			coinsListData.sort((a, b) => {
				const aVal = parseFloat(
					isOndDaySort
						? a.oneDayPriceDifferencePercenVal
						: a.priceDifferencePercentVal
				);
				const bVal = parseFloat(
					isOndDaySort
						? b.oneDayPriceDifferencePercenVal
						: b.priceDifferencePercentVal
				);
				return is_descending ? bVal - aVal : aVal - bVal;
			})
		);
	};

	const totalPages = Math.ceil(count / pageSize);
	const hideViewMore = page + 1 >= totalPages;

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
								<div>
									<EditWrapper stringId="MARKETS_TABLE.ASSET">
										{STRINGS['MARKETS_TABLE.ASSET']}
									</EditWrapper>
								</div>
							</th>
							<th>
								<div className="d-flex">
									<EditWrapper stringId="MARKETS_TABLE.TRADING_SYMBOL">
										{STRINGS['MARKETS_TABLE.TRADING_SYMBOL']}
									</EditWrapper>
								</div>
							</th>
							<th>
								<div>
									<EditWrapper stringId="MARKETS_TABLE.LAST_PRICE">
										{STRINGS['MARKETS_TABLE.LAST_PRICE']}
									</EditWrapper>
								</div>
							</th>
							<th>
								<div onClick={handleOneDaySort} className="d-flex pointer">
									<EditWrapper stringId="MARKETS_TABLE.CHANGE_1D">
										{STRINGS['MARKETS_TABLE.CHANGE_1D']}
									</EditWrapper>
									{renderCaret(SORT.CHANGE, true)}
								</div>
							</th>
							<th>
								<div onClick={handleClickChange} className="d-flex pointer">
									<EditWrapper stringId="MARKETS_TABLE.CHANGE_7D">
										{STRINGS['MARKETS_TABLE.CHANGE_7D']}
									</EditWrapper>
									{renderCaret(SORT.CHANGESEVENDAY)}
								</div>
							</th>
							<th>
								<div>
									<EditWrapper stringId="MARKETS_TABLE.CHART_7D">
										{STRINGS['MARKETS_TABLE.CHART_7D']}
									</EditWrapper>
								</div>
							</th>
							<th>
								<EditWrapper stringId="TRADE_TAB_TRADE">
									{STRINGS['TRADE_TAB_TRADE']}
								</EditWrapper>
							</th>
						</tr>
					</thead>
					<tbody id="market-list_tableBody">
						{getSortedList().map((coinData, index) => (
							<AssetsRow
								index={index}
								key={coinData.code}
								coinData={coinData}
								loading={loading}
								quicktrade={quicktrade}
								pairs={pairs}
								icons={icons}
							/>
						))}
					</tbody>
				</table>
				{!hideViewMore && (
					<div className="d-flex content-center view-more-btn">
						<div
							className="blue-link underline-text pointer"
							onClick={goToNextPage}
						>
							{STRINGS['STAKE_DETAILS.VIEW_MORE']}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = ({
	app: {
		digital_assets_sort: { mode, is_descending },
		coins: coinsData,
		quicktrade,
		pairs,
		pinned_assets,
	},
}) => ({
	mode,
	is_descending,
	coinsData,
	quicktrade,
	pairs,
	pinned_assets,
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
