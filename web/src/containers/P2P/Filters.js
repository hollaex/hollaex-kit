import React, { useState } from 'react';
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
}) => {
	const [isRangePicker, setIsRangePicker] = useState(false);
	const [date, setDate] = useState('All');
	const [tradeDetail, setTradeDetail] = useState({
		asset: null,
		side: null,
		status: null,
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

	const handleDateRange = (dates) => {
		if (dates && dates.length === 2) {
			const [startDate, endDate] = dates;

			const startDates = new Date(startDate?.toISOString());
			const endDates = new Date(endDate?.toISOString());

			const customTransaction = transactionDetails
				.filter((x) =>
					transactionFilter
						? ['active', 'appealed'].includes(x.transaction_status)
						: true
				)
				.filter((data) => {
					const createdAt = new Date(data.created_at);
					return createdAt >= startDates && createdAt <= endDates;
				});
			applyFilters(customTransaction);
		}
	};

	const handleDateFilter = (date) => {
		setDate(date);

		let transactionList = transactionDetails.filter((x) =>
			transactionFilter
				? ['active', 'appealed'].includes(x.transaction_status)
				: true
		);

		const filterByDate = (daysAgo) => {
			const targetDate = new Date();
			targetDate.setDate(targetDate.getDate() - daysAgo);
			return transactionList.filter(
				(data) => new Date(data.created_at) >= targetDate
			);
		};

		const filterByMonth = (monthsAgo) => {
			const targetDate = new Date();
			targetDate.setMonth(targetDate.getMonth() - monthsAgo);
			return transactionList.filter(
				(data) => new Date(data.created_at) >= targetDate
			);
		};

		switch (date) {
			case '1 day':
				transactionList = filterByDate(1);
				break;
			case '1 week':
				transactionList = filterByDate(7);
				break;
			case 'All':
				break;
			case 'custom':
				setIsRangePicker(!isRangePicker);
				return;
			default:
				if (Array.isArray(date)) {
					const dateString = date.join('');
					if (dateString === '1 month') {
						transactionList = filterByMonth(1);
					} else if (dateString === '3 month') {
						transactionList = filterByMonth(3);
					}
				}
				break;
		}
		if (date !== 'custom') {
			setIsRangePicker(false);
		}
		applyFilters(transactionList);
	};

	const handleTransaction = (type, status) => {
		setTradeDetail((prev) => {
			const updatedTradeDetail = {
				...prev,
				[type === 'status' ? 'status' : 'side']: status,
			};
			applyFilters(transactionDetails, updatedTradeDetail);
			return updatedTradeDetail;
		});
	};

	const applyFilters = (
		transactions = transactionDetails,
		filters = tradeDetail
	) => {
		const filteredTransactions = transactions.filter((data) => {
			const statusMatch =
				filters.status === null ||
				filters.status === 'ALL' ||
				(filters.status === 'Completed'
					? data.transaction_status === 'complete'
					: data.transaction_status?.toLowerCase() ===
					  filters.status?.toLowerCase());

			const sideMatch =
				filters.side === null ||
				filters.side === 'ALL' ||
				(filters.side === 'BUY'
					? data.user_id === user.id
					: data.user_id !== user.id);

			return statusMatch && sideMatch;
		});
		setTransactions(filteredTransactions);
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
							dropdownClassName="p2p-custom-style-dropdown"
							defaultValue={STRINGS['ALL']}
							onChange={(e) => handleTransaction('asset', e)}
						>
							<Select.Option value={null}>{STRINGS['ALL']}</Select.Option>
							{Object.entries(coins).map(
								([_, { symbol, fullname, icon_id }]) => (
									<Select.Option key={symbol} value={symbol}>
										<div className="d-flex gap-1">
											<Coin iconId={icon_id} type="CS1" />
											<div>{fullname}</div>
										</div>
									</Select.Option>
								)
							)}
						</Select>
					</div>
					<div className="side-filter">
						<div className="font-weight-bold">
							<EditWrapper>{STRINGS['P2P.SIDE']}:</EditWrapper>
						</div>
						<Select
							className="crypto-field"
							dropdownClassName="p2p-custom-style-dropdown"
							defaultValue={STRINGS['ALL']}
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
							defaultValue={STRINGS['ALL']}
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
							onChange={handleDateRange}
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
