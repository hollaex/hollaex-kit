/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Button, Checkbox, message, Rate  } from 'antd';
import { fetchFeedback, fetchP2PProfile } from './actions/p2pActions';
import { isMobile } from 'react-device-detect';
import classnames from 'classnames';
import moment from 'moment';
import './_P2P.scss';

const P2PProfile = ({
	data,
	onClose,
	coins,
	pairs,
	constants = {},
	icons: ICONS,
	transaction_limits,
	tiers = {},
	user,
	refresh,
	setSelectedDealEdit,
	setTab,
	selectedProfile,
	setSelectedProfile
}) => {
	const [myDeals, setMyDeals] = useState([]);
	const [checks, setCheks] = useState([]);
	const [myProfile, setMyProfile] = useState();
	const [selectedUser, setSelectedUser] = useState(user);

	useEffect(() => {
		fetchFeedback({ merchant_id: (selectedProfile || selectedUser).id })
			.then((res) => {
				setMyDeals(res.data);
			})
			.catch((err) => err);

		fetchP2PProfile({ user_id: (selectedProfile || selectedUser).id })
			.then((res) => {
				setMyProfile(res);
			})
			.catch((err) => err);
	}, [refresh, selectedProfile]);

	return (
		<div
			className={classnames(...['P2pOrder', isMobile ? 'mobile-view-p2p' : ''])}
			style={{
				height: 600,
				overflowY: 'auto',
				width: '100%',
				padding: 20,
			}}
		>
			<div
				className="stake_theme"
				style={{ display: 'flex', marginTop: 20, flexDirection: 'column'}}
			>
				<div style={{ fontWeight: 'bold', fontSize: 17, marginTop: -25 }}>
				<EditWrapper stringId="P2P.DISPLAY_NAME">
									{STRINGS['P2P.DISPLAY_NAME']}
								</EditWrapper>
				</div>
				<div style={{ marginBottom: 20 }}>{(selectedProfile || selectedUser).full_name ||	<EditWrapper stringId="P2P.ANONYMOUS">
												{STRINGS['P2P.ANONYMOUS']}
											</EditWrapper> }</div>
				{/* <div style={{ marginBottom: 20, display: 'flex', gap: 5 }}>
					<div><Checkbox style={{ color: 'white' }} checked={true}>EMAIL</Checkbox></div>
					<div><Checkbox style={{ color: 'white' }} checked={true}>SMS</Checkbox></div>
					<div><Checkbox style={{ color: 'white' }} checked={true}>ID</Checkbox></div>
				</div> */}
				<div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 10, width: '70%' }}>
					<div style={{ padding: 20, width: 200, textAlign: 'center',  fontWeight: 'bold', borderRadius: 5, border: '1px solid grey' }}>
						<div style={{ fontSize: 16 }}><EditWrapper stringId="P2P.TOTAL_ORDERS">
									{STRINGS['P2P.TOTAL_ORDERS']}
								</EditWrapper></div>
						<div style={{ fontSize: 17 }}>{myProfile?.totalTransactions} times</div>
					</div>
					<div style={{ padding: 20, width: 200, textAlign: 'center', fontWeight: 'bold', borderRadius: 5, border: '1px solid grey' }}>
						<div style={{ fontSize: 16 }}><EditWrapper stringId="P2P.COMPLETION_RATE">
									{STRINGS['P2P.COMPLETION_RATE']}
								</EditWrapper></div>
						<div style={{ fontSize: 17 }}>{(myProfile?.completionRate || 0).toFixed(2)}%</div>
					</div>
					<div style={{ padding: 20, width: 200, textAlign: 'center', fontWeight: 'bold', borderRadius: 5, border: '1px solid grey' }}>
						<div style={{ fontSize: 16 }}><EditWrapper stringId="P2P.POSITIVE_FEEDBACK">
									{STRINGS['P2P.POSITIVE_FEEDBACK']}
								</EditWrapper></div>
						<div style={{ fontSize: 17 }}>{(myProfile?.positiveFeedbackRate || 0).toFixed(2)}%</div>
						<div><EditWrapper stringId="P2P.POSITIVE">
									{STRINGS['P2P.POSITIVE']}
								</EditWrapper> {myProfile?.positiveFeedbackCount} / <EditWrapper stringId="P2P.NEGATIVE">
									{STRINGS['P2P.NEGATIVE']}
								</EditWrapper> {myProfile?.negativeFeedbackCount}</div>
					</div>
				</div>

				</div>
				
				<div style={{ marginTop: 10, marginBottom: 10, border: '1px solid grey', padding: 5, width: 150, borderRadius: 10, fontWeight: 'bold', cursor: 'default',  textAlign: 'center'}}>Feedback({myDeals.length || 0})</div>
				{myDeals.length == 0 ? 
				<div style={{ textAlign: 'center', fontSize: 15, border: '1px solid grey', padding: 10, borderRadius: 5 }}>
					<EditWrapper stringId="P2P.NO_FEEDBACK">
									{STRINGS['P2P.NO_FEEDBACK']}
								</EditWrapper>
				</div>
				: <table
					style={{ border: 'none', borderCollapse: 'collapse', width: '100%' }}
				>
					<thead>
						<tr
							className="table-bottom-border"
							style={{ borderBottom: 'grey 1px solid', padding: 10 }}
						>
							<th>
								<EditWrapper stringId="P2P.DATE">
									{STRINGS['P2P.DATE']}
								</EditWrapper>
							</th>
							<th>
								<EditWrapper stringId="P2P.USER">
									{STRINGS['P2P.USER']}
								</EditWrapper>
							</th>
							<th>
								<EditWrapper stringId="P2P.COMMENT">
									{STRINGS['P2P.COMMENT']}
								</EditWrapper>
							</th>
							<th>
								<EditWrapper stringId="P2P.RATING">
									{STRINGS['P2P.RATING']}
								</EditWrapper>
							</th>
						</tr>
					</thead>
					<tbody className="font-weight-bold">
						{myDeals.map((deal) => {
							return (
								<tr
									className="table-row"
									style={{
										borderBottom: 'grey 1px solid',
										padding: 10,
										position: 'relative',
									}}
								>
									<td style={{ width: '25%' }} className="td-fit">
										{moment(deal.created_at).format('DD/MMM/YYYY, hh:mmA')}
									</td>
									<td style={{ width: '25%' }} className="td-fit">
										{deal.user.full_name || (
											<EditWrapper stringId="P2P.ANONYMOUS">
												{STRINGS['P2P.ANONYMOUS']}
											</EditWrapper>
										)}
									</td>
									<td style={{ width: '25%' }} className="td-fit">
										{deal.comment}
									</td>
									<td style={{ width: '25%' }} className="td-fit">
										<Rate value={deal.rating} />
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
	coins: state.app.coins,
	constants: state.app.constants,
	transaction_limits: state.app.transaction_limits,
	user: state.user,
});

export default connect(mapStateToProps)(withConfig(P2PProfile));
