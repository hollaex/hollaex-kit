import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';

import { IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Tabs } from 'antd';
import P2PDash from './P2PDash';
import P2PMyDeals from './P2PMyDeals';
import P2POrders from './P2POrders';
import P2PPostDeal from './P2PPostDeal';
import P2PProfile from './P2PProfile';
import P2POrder from './P2POrder';
const TabPane = Tabs.TabPane;
const P2P = ({
	data,
	onClose,
	coins,
	pairs,
	constants = {},
	icons: ICONS,
	transaction_limits,
	tiers = {},
}) => {
	const [displayOrder, setDisplayOrder] = useState(false);
	const [tab, setTab] = useState(1);
	return (
		<div style={{ height: 600, width: '100%', padding: 20, marginBottom: 400 }}>
			<div style={{ textAlign: 'center', fontSize: 19 }}>P2P Deals</div>
			<div style={{ textAlign: 'center', marginBottom: 15 }}>
				P2P deals for buying and selling Bitcoin, USDT, and other
				cryptocurrencies.
			</div>
			{displayOrder && <P2POrder setDisplayOrder={setDisplayOrder} />}
			{!displayOrder && (
				<Tabs tab={0}>
					<TabPane tab="P2P" key="0">
						<P2PDash />
					</TabPane>
					<TabPane tab="ORDERS" key="1">
						<P2POrders setDisplayOrder={setDisplayOrder} />
					</TabPane>
					<TabPane tab="PROFILE" key="2">
						<P2PProfile />
					</TabPane>
					<TabPane tab="POST DEAL" key="3">
						<P2PPostDeal setTab={setTab} />
					</TabPane>
					<TabPane tab="MY DEALS" key="4">
						<P2PMyDeals />
					</TabPane>
				</Tabs>
			)}
		</div>
	);
};

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
	coins: state.app.coins,
	constants: state.app.constants,
	transaction_limits: state.app.transaction_limits,
});

export default connect(mapStateToProps)(withConfig(P2P));
