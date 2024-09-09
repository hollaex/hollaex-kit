import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { DatePicker, Form, Radio, Select } from 'antd';

import STRINGS from 'config/localizedStrings';
import { Coin, EditWrapper } from 'components';
import { dateFilters } from 'containers/TransactionsHistory/filterUtils';

const Filter = ({
	transactionFilter,
	setTransactions,
	transactionDetails,
	coins,
	user,
	selectedCurrencies,
	tab,
}) => {
	const [isRangePicker, setIsRangePicker] = useState(false);
	const [date, setDate] = useState('All');
	const [tradeDetail, setTradeDetail] = useState({
		asset: null,
		side: null,
		status: null,
	});
	const [customDateRange, setCustomDateRange] = useState({
		startDates: null,
		endDates: null,
	});

	const trades = ['P2P.ALL', 'P2P.BUY_UPPER', 'P2P.SELL_UPPER'];
	const orderStatus = [
		'P2P.ALL',
		'P2P.COMPLETE',
		'P2P.APPEALED',
		'P2P.CANCELLED',
		'P2P.EXPIRED',
		'DEVELOPER_SECTION.ACTIVE',
	];

	const { RangePicker } = DatePicker;

	useEffect(() => {
		setDate('All');
		setTradeDetail({
			asset: null,
			side: null,
			status: null,
		});
		setCustomDateRange({ startDates: null, endDates: null });
		setIsRangePicker(false);

		applyFilters(transactionDetails, tradeDetail, 'All');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tab]);

	const handleDateRange = (dates) => {
		if (dates && dates.length === 2) {
			const [startDate, endDate] = dates;

			const startDates = new Date(startDate?.toISOString());
			const endDates = new Date(endDate?.toISOString());

			setCustomDateRange({ startDates, endDates });

			const customTransaction = transactionDetails
				?.filter((x) =>
					transactionFilter
						? ['active', 'appealed'].includes(x.transaction_status)
						: true
				)
				?.filter((data) => {
					const createdAt = new Date(data.created_at);
					return createdAt >= startDates && createdAt <= endDates;
				});
			applyFilters(
				customTransaction,
				tradeDetail,
				'custom',
				startDates,
				endDates
			);
		}
	};

	const handleDateFilter = (selectedDate) => {
		setDate(selectedDate);
		if (selectedDate === 'custom') {
			setIsRangePicker(true);
			return;
		} else {
			setIsRangePicker(false);
		}

		let transactionList = transactionDetails?.filter((x) =>
			transactionFilter
				? ['active', 'appealed']?.includes(x?.transaction_status)
				: true
		);

		const filterByDate = (daysAgo) => {
			const targetDate = new Date();
			targetDate.setDate(targetDate.getDate() - daysAgo);
			return transactionList.filter(
				(data) => new Date(data?.created_at) >= targetDate
			);
		};

		const filterByMonth = (monthsAgo) => {
			const targetDate = new Date();
			targetDate.setMonth(targetDate.getMonth() - monthsAgo);
			return transactionList.filter(
				(data) => new Date(data?.created_at) >= targetDate
			);
		};

		let filteredTransactions;
		switch (selectedDate) {
			case '1 day':
				filteredTransactions = filterByDate(1);
				break;
			case '1 week':
				filteredTransactions = filterByDate(7);
				break;
			case 'All':
				filteredTransactions = transactionList;
				break;
			default:
				if (Array.isArray(selectedDate)) {
					const dateString = selectedDate.join('');
					if (dateString === '1 month') {
						filteredTransactions = filterByMonth(1);
					} else if (dateString === '3 month') {
						filteredTransactions = filterByMonth(3);
					}
				}
				break;
		}

		if (selectedDate !== 'custom') {
			applyFilters(filteredTransactions, tradeDetail, selectedDate);
		}
	};

	const handleTransaction = (type, status) => {
		setTradeDetail((prev) => {
			const updatedTradeDetail = {
				...prev,
				[type === 'status'
					? 'status'
					: type === 'asset'
					? 'asset'
					: 'side']: status,
			};
			applyFilters(transactionDetails, updatedTradeDetail);
			return updatedTradeDetail;
		});
	};

	const applyFilters = (
		transactions = transactionDetails,
		filters = tradeDetail,
		dateFilter = date,
		startDates = customDateRange.startDates,
		endDates = customDateRange.endDates
	) => {
		const filteredTransactions = transactions.filter((data) => {
			const statusMatch =
				filters?.status === null ||
				filters?.status === 'ALL' ||
				(filters?.status === 'Completed'
					? data.transaction_status === 'complete'
					: data.transaction_status?.toLowerCase() ===
					  filters?.status?.toLowerCase());

			const sideMatch =
				filters?.side === null ||
				filters?.side === 'ALL' ||
				(filters?.side === 'BUY'
					? data?.user_id === user?.id
					: data?.user_id !== user?.id);

			const assetMatch =
				filters?.asset === null ||
				filters?.asset === 'ALL' ||
				data?.deal?.buying_asset === filters?.asset;

			const dateString =
				Array.isArray(dateFilter) && dateFilter.length > 1
					? dateFilter.join('')
					: dateFilter;

			const dateMatch =
				dateFilter === 'All' ||
				dateFilter === null ||
				(dateFilter === '1 day' &&
					new Date(data?.created_at) >=
						new Date(new Date().setDate(new Date().getDate() - 1))) ||
				(dateFilter === '1 week' &&
					new Date(data?.created_at) >=
						new Date(new Date().setDate(new Date().getDate() - 7))) ||
				(dateString === '1 month' &&
					new Date(data?.created_at) >=
						new Date(new Date().setMonth(new Date().getMonth() - 1))) ||
				(dateString === '3 month' &&
					new Date(data?.created_at) >=
						new Date(new Date().setMonth(new Date().getMonth() - 3))) ||
				(startDates &&
					endDates &&
					new Date(data?.created_at) >= startDates &&
					new Date(data?.created_at) <= endDates);

			return statusMatch && sideMatch && assetMatch && dateMatch;
		});
		setTransactions(filteredTransactions);
	};

	const handleClearDate = () => {
		setTransactions(transactionDetails);
		applyFilters(transactionDetails, tradeDetail, 'All');
	};

	return (
		<div className="trade-filter-container">
			<div className="p2p-trade-select-field">
				<div className="filters">
					<div className="asset-filter">
						<div className="font-weight-bold">
							<EditWrapper>{STRINGS['P2P.ASSET']}</EditWrapper>
						</div>
						<Select
							className="crypto-field"
							dropdownClassName="p2p-custom-style-dropdown filter-asset-dropdown"
							value={tradeDetail.asset || STRINGS['P2P.ALL']}
							onChange={(e) => handleTransaction('asset', e)}
						>
							<Select.Option value={null}>{STRINGS['P2P.ALL']}</Select.Option>
							{Object?.entries(coins)
								?.filter(([_, { symbol }]) =>
									selectedCurrencies?.includes(symbol)
								)
								?.map(([_, { symbol, fullname, icon_id }]) => (
									<Select.Option key={`${symbol}-${icon_id}`} value={symbol}>
										<div className="d-flex gap-1">
											<Coin iconId={icon_id} type="CS1" />
											<div>{fullname}</div>
										</div>
									</Select.Option>
								))}
						</Select>
					</div>
					<div className="side-filter">
						<div className="font-weight-bold">
							<EditWrapper>{STRINGS['P2P.SIDE']}:</EditWrapper>
						</div>
						<Select
							className="crypto-field"
							dropdownClassName="p2p-custom-style-dropdown"
							value={tradeDetail?.side || STRINGS['P2P.ALL']}
							onChange={(e) => handleTransaction('trade type', e)}
						>
							{trades.map((trade) => (
								<Select.Option key={STRINGS[trade]} value={STRINGS[trade]}>
									{STRINGS[trade]}
								</Select.Option>
							))}
						</Select>
					</div>
					<div className="status-filter">
						<div className="font-weight-bold">
							<EditWrapper>{STRINGS['P2P.STATUS']}:</EditWrapper>
						</div>
						<Select
							className="crypto-field"
							dropdownClassName="p2p-custom-style-dropdown"
							value={tradeDetail?.status || STRINGS['P2P.ALL']}
							onChange={(e) => handleTransaction('status', e)}
						>
							{orderStatus.map((status) => (
								<Select.Option key={STRINGS[status]} value={STRINGS[status]}>
									{STRINGS[status]}
								</Select.Option>
							))}
						</Select>
					</div>
				</div>
				<div className="date-filters">
					<Radio.Group size="small">
						{Object.entries(dateFilters()).map(([key, { name }]) => {
							const isActive = JSON.stringify(date) === JSON.stringify(name);
							return (
								<Radio.Button
									key={key}
									value={key}
									className={
										isActive ? 'active-date-text date-text' : 'date-text'
									}
									onClick={() => handleDateFilter(name)}
								>
									{name}
								</Radio.Button>
							);
						})}
					</Radio.Group>
				</div>
				<div
					name="custom"
					size="small"
					onClick={() => handleDateFilter('custom')}
					className={
						date === 'custom'
							? 'custom-text-active secondary-text custom-text '
							: 'custom-text secondary-text'
					}
				>
					<EditWrapper stringId="P2P.CUSTOM">
						{STRINGS['P2P.CUSTOM']}
					</EditWrapper>
				</div>
			</div>
			<div className="custom-date-picker-container">
				{isRangePicker && (
					<Form.Item name="range" className="range-picker">
						<RangePicker
							allowEmpty={[true, true]}
							size="small"
							suffixIcon={false}
							placeholder={[STRINGS['START_DATE'], STRINGS['END_DATE']]}
							onChange={(dates, dateStrings) => {
								if (!dates || (dates[0] === null && dates[1] === null)) {
									handleClearDate();
								} else {
									handleDateRange(dates, dateStrings);
								}
							}}
						/>
					</Form.Item>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
	user: state.user,
});

export default connect(mapStateToProps)(Filter);
