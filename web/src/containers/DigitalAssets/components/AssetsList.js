import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

import {
	DIGITAL_ASSETS_SORT as SORT,
	toggleDigitalAssetsSort as toggleSort,
	setDigitalAssetsSortModeChange as setSortModeChange,
} from 'actions/appActions';
import { Paginator, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import AssetsRow from './AssetsRow';

const AssetsList = ({
	coinsListData,
	handleClick,
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
	setSortModeChange,
}) => {
	const handleClickChange = () => {
		if (mode === SORT.CHANGE) {
			toggleSort();
		} else {
			setSortModeChange();
		}
	};

	const renderCaret = (cell) => (
		<div className="market-list__caret d-flex flex-direction-column mx-1 secondary-text">
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

	const getSortedList = () => {
		return coinsListData.sort((a, b) =>
			is_descending
				? parseFloat(b.priceDifferencePercentVal) -
				  parseFloat(a.priceDifferencePercentVal)
				: parseFloat(a.priceDifferencePercentVal) -
				  parseFloat(b.priceDifferencePercentVal)
		);
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
								<div>
									<EditWrapper stringId="MARKETS_TABLE.MARKETS">
										{STRINGS['MARKETS_TABLE.MARKETS']}
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
								<div>
									<EditWrapper stringId="MARKETS_TABLE.SOURCE">
										{STRINGS['MARKETS_TABLE.SOURCE']}
									</EditWrapper>
								</div>
							</th>
							<th>
								<div onClick={handleClickChange} className="d-flex pointer">
									<EditWrapper stringId="MARKETS_TABLE.CHANGE_7D">
										{STRINGS['MARKETS_TABLE.CHANGE_7D']}
									</EditWrapper>
									{renderCaret(SORT.CHANGE)}
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
								<div className="d-flex">
									<EditWrapper stringId="MARKETS_TABLE.TYPE">
										{STRINGS['MARKETS_TABLE.TYPE']}
									</EditWrapper>
								</div>
							</th>
							<th>
								<div>
									<EditWrapper stringId="MARKETS_TABLE.CHART_7D">
										{STRINGS['MARKETS_TABLE.CHART_7D']}
									</EditWrapper>
								</div>
							</th>
						</tr>
					</thead>
					<tbody id="market-list_tableBody">
						{getSortedList().map((coinData, index) => (
							<AssetsRow
								index={index}
								key={coinData.code}
								handleClick={handleClick}
								coinData={coinData}
								loading={loading}
							/>
						))}
					</tbody>
				</table>
			</div>
			{showPaginator && (
				<Paginator
					currentPage={page + 1}
					pageSize={pageSize}
					count={count}
					goToPreviousPage={goToPreviousPage}
					goToNextPage={goToNextPage}
				/>
			)}
		</div>
	);
};

const mapStateToProps = ({
	app: {
		digital_assets_sort: { mode, is_descending },
		coins: coinsData,
	},
}) => ({
	mode,
	is_descending,
	coinsData,
});

const mapDispatchToProps = (dispatch) => ({
	toggleSort: bindActionCreators(toggleSort, dispatch),
	setSortModeChange: bindActionCreators(setSortModeChange, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(AssetsList));
