import React from 'react';
import { connect } from 'react-redux';
import { Button, Table } from 'antd';
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

	return (
		<div className="admin-tiers-wrapper">
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
			<div className="my-4">
				<Table
					columns={getHeaders(userTiers, ICONS, onEditFees, coins)}
					dataSource={tierPairsData}
					rowKey={(data) => data.id}
					bordered
					scroll={{ x: 'auto' }}
					pagination={false}
				/>
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
