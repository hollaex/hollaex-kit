/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';

import { IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Tabs, message } from 'antd';
import P2PDash from './P2PDash';
import P2PMyDeals from './P2PMyDeals';
import P2POrders from './P2POrders';
import P2PPostDeal from './P2PPostDeal';
import P2PProfile from './P2PProfile';
import P2POrder from './P2POrder';
import { fetchTransactions } from './actions/p2pActions';
import { NotLoggedIn } from 'components';
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
	user,
	p2p_config,
}) => {
	const [displayOrder, setDisplayOrder] = useState(false);
	const [tab, setTab] = useState('0');
	const [selectedTransaction, setSelectedTransaction] = useState();
	const [refresh, setRefresh] = useState(false);
	const [selectedDealEdit, setSelectedDealEdit] = useState();

	useEffect(() => {
		const arr = window.location.pathname.split('/');

		if (arr.length === 4) {
			const transId = arr[arr.length - 1];

			fetchTransactions({
				id: transId,
			})
				.then((res) => {
					if (res.data.length > 0) {
						setSelectedTransaction(res.data[0]);
						setDisplayOrder(true);
					} else {
						message.error('Transaction not found');
					}
				})
				.catch((err) => err);
		}
	}, []);

	return (
		<NotLoggedIn>
			<div
				style={{ height: 600, width: '100%', padding: 20, marginBottom: 400 }}
				className="summary-container"
			>
				<div style={{ textAlign: 'center', fontSize: 19 }}>P2P Deals</div>
				<div style={{ textAlign: 'center', marginBottom: 15 }}>
					P2P deals for buying and selling Bitcoin, USDT, and other
					cryptocurrencies.
				</div>
				{displayOrder && (
					<P2POrder
						setDisplayOrder={setDisplayOrder}
						setSelectedTransaction={setSelectedTransaction}
						selectedTransaction={selectedTransaction}
					/>
				)}
				{!displayOrder && (
					<Tabs
						defaultActiveKey="0"
						activeKey={tab}
						onChange={(e) => {
							if (e !== '3') {
								setSelectedDealEdit();
							}
							setTab(e);
						}}
					>
						{user.verification_level >= p2p_config?.starting_user_tier && (
							<>
								<TabPane tab="P2P" key="0">
									<P2PDash
										setDisplayOrder={setDisplayOrder}
										refresh={refresh}
										setSelectedTransaction={setSelectedTransaction}
									/>
								</TabPane>
								<TabPane tab="ORDERS" key="1">
									<P2POrders
										setDisplayOrder={setDisplayOrder}
										setSelectedTransaction={setSelectedTransaction}
										refresh={refresh}
									/>
								</TabPane>
							</>
						)}

						{user.verification_level >= p2p_config?.starting_merchant_tier && (
							<>
								{/* <TabPane tab="PROFILE" key="2">
							<P2PProfile />
						</TabPane> */}

								<TabPane tab="POST DEAL" key="3">
									<P2PPostDeal
										setTab={setTab}
										setRefresh={setRefresh}
										refresh={refresh}
										selectedDealEdit={selectedDealEdit}
										setSelectedDealEdit={setSelectedDealEdit}
									/>
								</TabPane>
								<TabPane tab="MY DEALS" key="4">
									<P2PMyDeals
										setTab={setTab}
										setRefresh={setRefresh}
										refresh={refresh}
										setSelectedDealEdit={setSelectedDealEdit}
									/>
								</TabPane>
							</>
						)}
					</Tabs>
				)}
			</div>
		</NotLoggedIn>
	);
};

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
	coins: state.app.coins,
	constants: state.app.constants,
	transaction_limits: state.app.transaction_limits,
	user: state.user,
	p2p_config: state.app.constants.p2p_config,
});

export default connect(mapStateToProps)(withConfig(P2P));
