import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { isMobile } from 'react-device-detect';
import { Tabs, message } from 'antd';

import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import P2PDash from './P2PDash';
import P2PMyDeals from './P2PMyDeals';
import P2POrders from './P2POrders';
import P2PPostDeal from './P2PPostDeal';
import P2PProfile from './P2PProfile';
import P2POrder from './P2POrder/P2POrder';
import { EditWrapper, MobileBarTabs } from 'components';
import { fetchTransactions } from './actions/p2pActions';
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
	router,
	p2p_config,
}) => {
	const [displayOrder, setDisplayOrder] = useState(false);
	const [tab, setTab] = useState('0');
	const [selectedTransaction, setSelectedTransaction] = useState();
	const [refresh, setRefresh] = useState(false);
	const [selectedDealEdit, setSelectedDealEdit] = useState();
	const [selectedProfile, setSelectedProfile] = useState();
	const [displayUserFeedback, setDisplayUserFeedback] = useState(false);
	const [userFeedback, setUserFeedback] = useState([]);
	const [userProfile, setUserProfile] = useState();

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
						router.push('/p2p');
						message.error(STRINGS['P2P.TRANSACTION_NOT_FOUND']);
					}
				})
				.catch((err) => {
					router.push('/p2p');
					return err;
				});
		} else setDisplayOrder(false);

		if (arr?.[2] === 'orders') {
			setTab('1');
		}
		if (arr?.[2] === 'profile') {
			setTab('2');
		}
		if (arr?.[2] === 'post-deal') {
			setTab('3');
		}
		if (arr?.[2] === 'mydeals') {
			setTab('4');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [window.location.pathname]);

	const changeProfileTab = (merchant) => {
		setSelectedProfile(merchant);
		setTab('2');
	};

	const tabContent = [
		{
			title: STRINGS['P2P.TAB_P2P'],
			content: (
				<P2PDash
					setDisplayOrder={setDisplayOrder}
					refresh={refresh}
					setSelectedTransaction={setSelectedTransaction}
					changeProfileTab={changeProfileTab}
					setTab={setTab}
					tab={tab}
				/>
			),
		},
		{
			title: STRINGS['P2P.TAB_ORDERS'],
			content: (
				<P2POrders
					setDisplayOrder={setDisplayOrder}
					setSelectedTransaction={setSelectedTransaction}
					refresh={refresh}
					displayUserFeedback={displayUserFeedback}
					setDisplayUserFeedback={setDisplayUserFeedback}
					userFeedback={userFeedback}
					setUserFeedback={setUserFeedback}
					selectedProfile={selectedProfile}
					setSelectedProfile={setSelectedProfile}
					userProfile={userProfile}
					setUserProfile={setUserProfile}
					tab={tab}
				/>
			),
		},
		{
			title: STRINGS['P2P.TAB_PROFILE'],
			content: (
				<P2PProfile
					setSelectedProfile={setSelectedProfile}
					selectedProfile={selectedProfile}
					setRefresh={setRefresh}
				/>
			),
		},
		{
			title: STRINGS['P2P.TAB_POST_DEAL'],
			content: (
				<P2PPostDeal
					tab={tab}
					setTab={setTab}
					setRefresh={setRefresh}
					refresh={refresh}
					selectedDealEdit={selectedDealEdit}
					setSelectedDealEdit={setSelectedDealEdit}
				/>
			),
		},
		{
			title: STRINGS['P2P.TAB_MY_DEALS'],
			content: (
				<P2PMyDeals
					setTab={setTab}
					setRefresh={setRefresh}
					refresh={refresh}
					setSelectedDealEdit={setSelectedDealEdit}
				/>
			),
		},
	];
	return (
		<div className="p2p-summary-container">
			{!displayOrder && !isMobile && (
				<>
					<div className="p2p-title">
						<EditWrapper stringId="P2P.TITLE">
							{STRINGS['P2P.TITLE']}
						</EditWrapper>
					</div>
					<div className="secondary-text text-center mb-3">
						<EditWrapper stringId="P2P.DESCRIPTION">
							{STRINGS['P2P.DESCRIPTION']}
						</EditWrapper>
					</div>
				</>
			)}
			{isMobile && !displayOrder && (
				<MobileBarTabs
					tabs={tabContent}
					activeTab={Number(tab)}
					setActiveTab={setTab}
				/>
			)}
			{displayOrder && (
				<P2POrder
					setDisplayOrder={setDisplayOrder}
					setSelectedTransaction={setSelectedTransaction}
					selectedTransaction={selectedTransaction}
					changeProfileTab={changeProfileTab}
					displayUserFeedback={displayUserFeedback}
					setDisplayUserFeedback={setDisplayUserFeedback}
					userProfile={userProfile}
					setUserProfile={setUserProfile}
					userFeedback={userFeedback}
					setUserFeedback={setUserFeedback}
					selectedProfile={selectedProfile}
					setSelectedProfile={setSelectedProfile}
				/>
			)}
			{!displayOrder && !isMobile && (
				<Tabs
					defaultActiveKey="0"
					activeKey={tab}
					onChange={(e) => {
						if (e !== '3') {
							setSelectedDealEdit();
						}

						if (e !== '2') {
							setSelectedProfile();
						}

						if (e === '0') {
							router.push('/p2p');
						} else if (e === '1') {
							router.push('/p2p/orders');
						} else if (e === '2') {
							router.push('/p2p/profile');
						} else if (e === '3') {
							router.push('/p2p/post-deal');
						} else if (e === '4') {
							router.push('/p2p/mydeals');
						}

						setTab(e);
					}}
				>
					<TabPane tab={STRINGS['P2P.TAB_P2P']} key="0">
						<P2PDash
							setDisplayOrder={setDisplayOrder}
							refresh={refresh}
							setSelectedTransaction={setSelectedTransaction}
							changeProfileTab={changeProfileTab}
							setTab={setTab}
							tab={tab}
						/>
					</TabPane>

					{user?.id &&
						user.verification_level >= p2p_config?.starting_user_tier && (
							<>
								<TabPane tab={STRINGS['P2P.TAB_ORDERS']} key="1">
									<P2POrders
										setDisplayOrder={setDisplayOrder}
										setSelectedTransaction={setSelectedTransaction}
										refresh={refresh}
										// changeProfileTab={changeProfileTab}
										displayUserFeedback={displayUserFeedback}
										setDisplayUserFeedback={setDisplayUserFeedback}
										userFeedback={userFeedback}
										setUserFeedback={setUserFeedback}
										selectedProfile={selectedProfile}
										setSelectedProfile={setSelectedProfile}
										userProfile={userProfile}
										setUserProfile={setUserProfile}
										tab={tab}
									/>
								</TabPane>
							</>
						)}

					{user?.id && (
						<TabPane tab={STRINGS['P2P.TAB_PROFILE']} key="2">
							<P2PProfile
								setSelectedProfile={setSelectedProfile}
								selectedProfile={selectedProfile}
								setRefresh={setRefresh}
							/>
						</TabPane>
					)}

					{user?.id &&
						user.verification_level >= p2p_config?.starting_merchant_tier && (
							<>
								<TabPane tab={STRINGS['P2P.TAB_POST_DEAL']} key="3">
									<P2PPostDeal
										tab={tab}
										setTab={setTab}
										setRefresh={setRefresh}
										refresh={refresh}
										selectedDealEdit={selectedDealEdit}
										setSelectedDealEdit={setSelectedDealEdit}
									/>
								</TabPane>
								<TabPane tab={STRINGS['P2P.TAB_MY_DEALS']} key="4">
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
			{isMobile && !displayOrder && (
				<div className="content-with-bar">{tabContent[tab].content}</div>
			)}
		</div>
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

export default connect(mapStateToProps)(withRouter(withConfig(P2P)));
