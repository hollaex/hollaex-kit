import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import STRINGS from 'config/localizedStrings';
import { EditWrapper } from 'components';
import { setNotification, NOTIFICATIONS } from 'actions/appActions';
import { Button as AntBtn } from 'antd';

const MyStaking = ({
	coins,
	token,
	account,
	currentBlock,
	totalEarningsString,
	totalStakesString,
	totalUserEarnings,
	totalUserStakes,
	stakables,
	setNotification,
}) => {
	const startStakingProcess = (tokenData) => {
		const { symbol } = tokenData;
		const { fullname } = coins[symbol];
		setNotification(NOTIFICATIONS.STAKE, {
			tokenData: { ...tokenData, fullname },
		});
	};

	return (
		<div>
			<div className="d-flex justify-content-between align-start">
				<div>
					<div>
						<div className="bold">
							{STRINGS['STAKE_DETAILS.MY_STAKING.TITLE']}
						</div>
						<div className="secondary-text">
							{STRINGS.formatString(
								STRINGS['STAKE_DETAILS.MY_STAKING.SUBTITLE'],
								token.toUpperCase()
							)}
						</div>
					</div>

					<div className="pt-4 secondary-text">
						{STRINGS.formatString(
							STRINGS['STAKE.CURRENT_ETH_BLOCK'],
							<span className="blue-link">{currentBlock}</span>
						)}
					</div>
				</div>
				<div
					className="secondary-text"
					style={{
						minWidth: 'max-content',
						paddingTop: '0.5rem',
						textAlign: 'right',
						marginLeft: '3rem',
					}}
				>
					<div>
						<div>{STRINGS['STAKE.ESTIMATED_STAKED']}</div>
						<div>{totalStakesString}</div>
						<div className="kit-divider" />
					</div>
					<div>
						<div>{STRINGS['STAKE.ESTIMATED_EARNINGS']}</div>
						<div>{totalEarningsString}</div>
					</div>
				</div>
			</div>
			<table className="wallet-assets_block-table">
				<thead>
					<tr className="table-bottom-border">
						<th />
						<th>
							<EditWrapper stringId="STAKE_TABLE.CURRENCY">
								{STRINGS['STAKE_TABLE.CURRENCY']}
							</EditWrapper>
						</th>
						<th>
							<EditWrapper stringId="STAKE_TABLE.AVAILABLE">
								{STRINGS['STAKE_TABLE.AVAILABLE']}
							</EditWrapper>
						</th>
						<th>
							<EditWrapper stringId="STAKE_TABLE.TOTAL">
								{STRINGS['STAKE_TABLE.TOTAL']}
							</EditWrapper>
						</th>
						<th>
							<EditWrapper stringId="STAKE_TABLE.REWARD_RATE">
								{STRINGS['STAKE_TABLE.REWARD_RATE']}
							</EditWrapper>
						</th>
						<th>
							<EditWrapper stringId="STAKE_TABLE.EARNING">
								{STRINGS['STAKE_TABLE.EARNINGS']}
							</EditWrapper>
						</th>
						<th>
							<EditWrapper stringId="STAKE_TABLE.STAKE">
								{STRINGS['STAKE_TABLE.STAKE']}
							</EditWrapper>
						</th>
					</tr>
				</thead>
				<tbody>
					{stakables
						.filter(({ symbol }) => symbol === token)
						.map((tokenData, index) => {
							const { available } = tokenData;

							return (
								<tr className="table-row table-bottom-border" key={index}>
									<td />
									<td>{available}</td>
									<td>{totalUserStakes[token]}</td>
									<td>{STRINGS['STAKE_TABLE.VARIABLE']}</td>
									<td>{totalUserEarnings[token]}</td>
									<td>
										<div className="d-flex content-center">
											<AntBtn
												className="stake-btn"
												type="primary"
												ghost
												onClick={() => startStakingProcess(tokenData)}
												disabled={!account}
											>
												{STRINGS['STAKE_TABLE.STAKE']}
											</AntBtn>
										</div>
									</td>
								</tr>
							);
						})}
				</tbody>
			</table>
		</div>
	);
};

const mapStateToProps = (store) => ({
	coins: store.app.coins,
	account: store.stake.account,
	currentBlock: store.stake.currentBlock,
	stakables: store.stake.stakables,
});

const mapDispatchToProps = (dispatch) => ({
	setNotification: bindActionCreators(setNotification, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyStaking);
