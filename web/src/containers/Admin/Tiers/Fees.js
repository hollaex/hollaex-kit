import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import _get from 'lodash/get';
// import { PercentageOutlined } from '@ant-design/icons';

import { STATIC_ICONS } from 'config/icons';
import { CurrencyBall } from '../../../components';
import Image from '../../../components/Image';
import withConfig from '../../../components/ConfigProvider/withConfig';

const getHeaders = (userTiers, ICONS, onEditFees) => {
	const headers = [
		{
			title: 'Pairs',
			dataIndex: 'pair_base',
			key: 'pair_base',
			width: 150,
			fixed: 'left',
			render: (pair_base, { name }) => (
				<div className="d-flex align-items-center">
					<CurrencyBall symbol={pair_base} name={pair_base} size="m" />
					<div className="ml-1">{name}</div>
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
	headers.push({
		title: 'Adjust fee values',
		dataIndex: 'name',
		key: 'action',
		align: 'right',
		width: 150,
		fixed: 'right',
		render: (name) => (
			<span className="admin-link-highlight" onClick={() => onEditFees(name)}>
				Adjust fees
			</span>
		),
	});
	return headers;
};

const Fees = ({
	pairs,
	userTiers,
	allIcons: { dark: ICONS = {} },
	onEditFees,
}) => {
	const coinsData = Object.keys(pairs).map((key) => pairs[key]);
	return (
		<div className="admin-tiers-wrapper">
			<div className="d-flex">
				<div>
					<Image
						icon={STATIC_ICONS['FEES_SECTION_ICON']}
						wrapperClassName="tier-section-icon mx-3"
					/>
				</div>
				<div>
					<div className="sub-title">
						User asset deposit & withdrawal limits
					</div>
					<div className="description mx-2">
						Set the amount allowed to be withdrawn and deposited for each coin
						on your exchange
					</div>
					<div className="description mt-4">
						All amounts are valued in your set native currency USD. You can
						change the native currency for your exchange in the general setup
						page.
					</div>
				</div>
			</div>
			<div className="my-4">
				<Table
					columns={getHeaders(userTiers, ICONS, onEditFees)}
					dataSource={coinsData}
					rowKey={(data) => data.id}
					bordered
					scroll={{ x: 'auto' }}
				/>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
});

export default connect(mapStateToProps)(withConfig(Fees));
