import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Table } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import _get from 'lodash/get';
// import { PercentageOutlined } from '@ant-design/icons';

import { STATIC_ICONS } from 'config/icons';
import { Coin } from '../../../components';
import Image from '../../../components/Image';
import withConfig from '../../../components/ConfigProvider/withConfig';
import {
	flipPair,
	quicktradePairSelector,
} from 'containers/QuickTrade/components/utils';

const getHeaders = (userTiers, ICONS, onEditFees, coins) => {
	const headers = [
		{
			title: 'Pairs',
			dataIndex: 'pair_base',
			key: 'pair_base',
			width: 150,
			fixed: 'left',
			render: (pair_base, { name }) => (
				<div className="d-flex align-items-center">
					<Coin
						type="CS4"
						iconId={coins[pair_base] && coins[pair_base]?.icon_id}
					/>
					<div className="ml-1 caps">{name}</div>
				</div>
			),
		},
		{
			title: 'Fee type',
			dataIndex: 'type',
			key: 'type',
			width: 140,
			fixed: 'left',
			className: 'type-column',
			render: () => (
				<div>
					<div className="custom-column-td column-divider">
						<Image
							icon={STATIC_ICONS['TAKER_TIERS_SECTION']}
							wrapperClassName="fee-indicator-icon mr-2"
						/>
					</div>
					<div className="custom-column-td">
						<Image
							icon={STATIC_ICONS['MAKER_TIERS_SECTION']}
							wrapperClassName="fee-indicator-icon mr-2"
						/>
					</div>
				</div>
			),
		},
	];
	let children = [];
	Object.keys(userTiers).forEach((level) => {
		let tiersData = userTiers[level];
		children.push({
			title: (
				<div className="d-flex align-items-center">
					<Image
						icon={ICONS[`LEVEL_ACCOUNT_ICON_${level}`]}
						wrapperClassName="table-tier-icon mr-2"
					/>
					{`Tiers ${level}`}
				</div>
			),
			dataIndex: 'name',
			key: level,
			className: 'type-column',
			width: 120,
			render: (name) => (
				<div>
					<div className="custom-column-td column-divider">
						{_get(tiersData, `fees.taker.${name}`)} %
					</div>
					<div className="custom-column-td">
						{_get(tiersData, `fees.maker.${name}`)} %
					</div>
				</div>
			),
		});
	});
	headers.push({
		title: 'Trading fee percentages',
		children,
	});
	return headers;
};

const Fees = ({
	userTiers,
	allIcons: { dark: ICONS = {} },
	onEditFees,
	constants: { native_currency },
	coins,
	quicktradePairs,
}) => {
	const [visibleTierStart, setVisibleTierStart] = useState(0);
	const [visibleTierCount, setVisibleTierCount] = useState(2);
	const containerRef = useRef(null);

	const updateVisibleTierCount = () => {
		if (!containerRef.current) return;
		const containerWidth = containerRef.current.offsetWidth || 0;
		const staticColumnsWidth = 150 + 140;
		const arrowWidth = 48 * 2;
		const tierColWidth = 120;
		const availableWidth = containerWidth - staticColumnsWidth - arrowWidth;
		const count = Math.max(1, Math.floor(availableWidth / tierColWidth));
		setVisibleTierCount(count);
	};

	useEffect(() => {
		updateVisibleTierCount();
		window.addEventListener('resize', updateVisibleTierCount);
		return () => window.removeEventListener('resize', updateVisibleTierCount);
	}, []);

	const tierLevels = Object.keys(userTiers || {});
	const maxTierIndex = tierLevels?.length - 1;

	const handlePrev = () => {
		setVisibleTierStart((prev) => Math.max(0, prev - visibleTierCount));
	};
	const handleNext = () => {
		setVisibleTierStart((prev) =>
			Math.min(maxTierIndex - visibleTierCount + 1, prev + visibleTierCount)
		);
	};

	const visibleTierLevels = tierLevels?.slice(
		visibleTierStart,
		visibleTierStart + visibleTierCount
	);

	const visibleUserTiers = {};
	visibleTierLevels.forEach((level) => {
		visibleUserTiers[level] = userTiers[level];
	});

	const constructTierData = () => {
		let feesData = Object.keys(userTiers).map((level) => {
			const data = userTiers[level].fees;
			let condition = Object.keys(data.maker).map((item) => {
				const splitPair = item.split('-');
				const resData = {
					name: item,
					pair_base: splitPair[0],
					pair_2: splitPair[1],
				};
				return resData;
			});
			condition = condition?.filter((data) => {
				return (
					quicktradePairs[data?.name] || quicktradePairs[flipPair(data?.name)]
				);
			});
			condition = Object.assign({}, condition);
			return condition;
		});

		let temp = [];
		feesData &&
			feesData[0] &&
			Object.keys(feesData[0]).forEach((ele) => {
				temp = [...temp, feesData[0][ele]];
			});
		return temp;
	};
	const tierPairsData = userTiers ? constructTierData() : [];
	const isActivePrev = visibleTierStart > 0;
	const isActiveNext = visibleTierStart + visibleTierCount <= maxTierIndex;

	return (
		<div className="admin-tiers-wrapper" ref={containerRef}>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<div className="d-flex flex-column">
					<span className="font-weight-bold admin-tier-title">
						Trading Fees
					</span>
					<span className="admin-tier-description description">
						Below are the trading fees applied to user account tiers and market
						pair.
					</span>
				</div>
				<Button onClick={() => onEditFees()} className="green-btn no-border">
					Edit Fees
				</Button>
			</div>
			<div className="my-4 tier-fees-table-wrapper d-flex">
				{isActivePrev && (
					<div
						className={`pointer tier-arrow-icon d-flex flex-column align-items-center justify-content-between${
							visibleTierStart === 0 ? ' disabled' : ''
						}`}
						onClick={handlePrev}
					>
						<LeftOutlined className="mt-3" />
						<LeftOutlined />
						<LeftOutlined className="mb-3" />
					</div>
				)}
				<Table
					columns={getHeaders(visibleUserTiers, ICONS, onEditFees, coins)}
					dataSource={tierPairsData}
					rowKey={(data) => data.id}
					bordered
					scroll={{ x: 'auto' }}
					pagination={false}
				/>
				{isActiveNext && (
					<div
						className="pointer tier-arrow-icon d-flex flex-column align-items-center justify-content-between"
						onClick={handleNext}
					>
						<RightOutlined className="mt-3" />
						<RightOutlined />
						<RightOutlined className="mb-3" />
					</div>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	constants: state.app.constants,
	coins: state.app.coins,
	quicktradePairs: quicktradePairSelector(state),
});

export default connect(mapStateToProps)(withConfig(Fees));
