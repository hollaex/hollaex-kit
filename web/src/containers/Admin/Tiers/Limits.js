import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';

import { CurrencyBall } from '../../../components';
import Image from '../../../components/Image';
import { STATIC_ICONS } from 'config/icons';
import withConfig from 'components/ConfigProvider/withConfig';

const limitStatus = (value, nativeCurrency) => {
	if (value === -1) {
		return 'DISABLED';
	} else if (value === 0) {
		return 'UNLIMITED';
	} else if (!value) {
		return 'N/A';
	} else {
		return `${value} ${nativeCurrency}`;
	}
};

const getHeaders = (userTiers, ICONS, constants = {}, onEditLimit) => {
	const headers = [
		{
			title: 'Asset',
			dataIndex: 'symbol',
			key: 'symbol',
			width: 150,
			fixed: 'left',
			render: (symbol, { fullname }) => (
				<div className="d-flex align-items-center">
					<CurrencyBall symbol={symbol} name={symbol} size="m" />
					<div className="ml-1">{fullname}</div>
				</div>
			),
		},
		{
			title: 'Limit type',
			dataIndex: 'type',
			key: 'type',
			width: 140,
			fixed: 'left',
			className: 'type-column',
			render: () => (
				<div>
					<div className="custom-column-td column-divider">
						<div className="d-flex align-items-center">
							<Image
								icon={STATIC_ICONS['DEPOSIT_TIERS_SECTION']}
								wrapperClassName="limit-status-icon mr-2"
							/>
							Deposit
						</div>
					</div>
					<div className="custom-column-td">
						<div className="d-flex align-items-center">
							<Image
								icon={STATIC_ICONS['WITHDRAW_TIERS_SECTION']}
								wrapperClassName="limit-status-icon mr-2"
							/>
							Withdraw
						</div>
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
			key: 'name',
			className: 'type-column',
			width: 120,
			render: (name) => (
				<div>
					<div className="custom-column-td column-divider">
						{limitStatus(tiersData.deposit_limit, constants.native_currency)}
					</div>
					<div className="custom-column-td">
						{limitStatus(tiersData.withdrawal_limit, constants.native_currency)}
					</div>
				</div>
			),
		});
	});
	headers.push({
		title: `Limit amount valued in ${constants.native_currency}`,
		children,
	});
	headers.push({
		title: 'Adjust limit values',
		dataIndex: 'type',
		key: 'type',
		fixed: 'right',
		width: 150,
		align: 'right',
		render: () => (
			<span className="admin-link-highlight" onClick={onEditLimit}>
				Adjust limits
			</span>
		),
	});
	return headers;
};

const Limits = ({
	coins,
	userTiers,
	allIcons: { dark: ICONS = {} },
	constants = {},
	onEditLimit,
}) => {
	const coinsData = Object.keys(coins).map((key) => coins[key]);
	return (
		<div className="admin-tiers-wrapper">
			<div className="d-flex">
				<div>
					<Image
						icon={STATIC_ICONS['LIMITS_SECTION_ICON']}
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
					columns={getHeaders(userTiers, ICONS, constants, onEditLimit)}
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
	coins: state.app.coins,
	constants: state.app.constants,
});

export default connect(mapStateToProps)(withConfig(Limits));
