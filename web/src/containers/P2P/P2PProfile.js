/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Button, Checkbox, message, Rate } from 'antd';
import { fetchFeedback } from './actions/p2pActions';
import { isMobile } from 'react-device-detect';
import classnames from 'classnames';
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
}) => {
	const [myDeals, setMyDeals] = useState([]);
	const [checks, setCheks] = useState([]);

	useEffect(() => {
		fetchFeedback()
			.then((res) => {
				setMyDeals(res.data);
			})
			.catch((err) => err);
	}, [refresh]);

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
				className="wallet-assets_block"
				style={{ display: 'flex', marginTop: 20 }}
			>
				<table
					style={{ border: 'none', borderCollapse: 'collapse', width: '100%' }}
				>
					<thead>
						<tr
							className="table-bottom-border"
							style={{ borderBottom: 'grey 1px solid', padding: 10 }}
						>
							<th>
								<EditWrapper stringId="P2P.TRANSACTION_ID">
									{STRINGS['P2P.TRANSACTION_ID']}
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
										{deal.transaction.transaction_id}
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
				</table>
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
