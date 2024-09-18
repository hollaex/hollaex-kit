import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import { Button as AntBtn } from 'antd';

import './CeFiStake.scss';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import Account from './components/Account';
import ConnectWrapper from './components/ConnectWrapper';
import StakesAndEarnings from './components/StakesAndEarnings';
import CeFiUserStake from './components/CeFiUserStake';
import { openConnectViaDesktop, setStake } from 'actions/appActions';
import { HeaderSection, EditWrapper, Button, Coin, Image } from 'components';
import { STAKING_INDEX_COIN } from 'config/contracts';

class Stake extends Component {
	constructor(prop) {
		super(prop);
		this.state = {
			activeTab: '1',
			selectedStaking: this.props.getStake
				? this.props.getStake
				: this.props?.constants?.features?.cefi_stake &&
				  this.props?.constants?.features?.stake_page
				? 'defi'
				: this.props?.constants?.features?.cefi_stake
				? 'cefi'
				: 'defi',
		};
	}

	componentWillUnmount() {
		setStake('defi');
	}

	render() {
		const {
			icons: ICONS,
			coins,
			openConnectViaDesktop,
			stakables,
		} = this.props;

		const { display_name } = coins[STAKING_INDEX_COIN];

		return (
			<div className="presentation_container apply_rtl wallet-wrapper stake-wrapper">
				<div className="stake-icon-container">
					<div className="stake-icon-wrapper">
						<div className="stake-icon">
							<Image icon={ICONS['TAB_STAKE']} iconId="TAB_STAKE" />
						</div>
						<div>
							<EditWrapper stringId="STAKE.TITLE">
								<span className="stake-title">{STRINGS['STAKE.TITLE']}</span>
							</EditWrapper>
						</div>
					</div>
				</div>
				<div className="stake-button-wrapper">
					{this.props?.constants?.features?.cefi_stake &&
						this.props?.constants?.features?.stake_page && (
							<div className="stake-button-container">
								<span
									className={`stakingOption defi-button ${
										this.state.selectedStaking === 'defi'
											? 'stake-text-bold'
											: 'stake-text-normal'
									}`}
									onClick={() => {
										this.setState({
											selectedStaking: 'defi',
										});
									}}
								>
									{STRINGS['STAKE.DEFI_STAKING']}
								</span>
								<span
									className={`stakingOption cefi-button ${
										this.state.selectedStaking === 'cefi'
											? 'stake-text-bold'
											: 'stake-text-normal'
									}`}
									onClick={() => {
										this.setState({
											selectedStaking: 'cefi',
										});
									}}
								>
									{STRINGS['STAKE.CEFI_STAKING']}
								</span>
							</div>
						)}
				</div>

				{this.state.selectedStaking === 'cefi' && (
					<CeFiUserStake
						balance={this.props.balance}
						coins={this.props.coins}
						theme={this.props.theme}
					/>
				)}

				{this.state.selectedStaking === 'defi' && (
					<>
						<div className="d-flex align-end justify-content-end">
							<Account />
						</div>
						<div className={classnames('wallet-container', 'no-border')}>
							<div className="wallet-assets_block">
								<div>
									<HeaderSection
										stringId="STAKE.DEFI_TITLE"
										title={STRINGS['STAKE.DEFI_TITLE']}
									>
										<div className="header-content">
											<div>
												<EditWrapper stringId="STAKE.DEFI_TEXT">
													{STRINGS['STAKE.DEFI_TEXT']}
												</EditWrapper>
											</div>
										</div>
									</HeaderSection>
									<div className="secondary-text">
										{STRINGS.formatString(
											STRINGS['STAKE.CURRENT_ETH_BLOCK'],
											<span className="blue-link pointer underline-text" />
										)}
									</div>
									<div className="secondary-text">
										{STRINGS.formatString(
											STRINGS['STAKE.ON_EXCHANGE_XHT'],
											display_name,
											<ConnectWrapper onClick={openConnectViaDesktop} />,
											''
										)}
									</div>
								</div>
								<StakesAndEarnings />
								<div className="stake-table">
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
											{stakables.map((tokenData, index) => {
												const { symbol } = tokenData;
												const { fullname, icon_id, display_name } = coins[
													symbol
												];
												const commonCellProps = {};
												return (
													<tr
														className="hoverable pointer table-row table-bottom-border"
														key={index}
													>
														<td />
														<td className="td-name td-fit">
															<div className="d-flex align-items-center justify-content-center">
																<Coin iconId={icon_id} />
																<div className="px-2">
																	{fullname}
																	<span className="pl-2 secondary-text">
																		{display_name}
																	</span>
																</div>
															</div>
														</td>
														<td {...commonCellProps}>
															<ConnectWrapper onClick={openConnectViaDesktop} />
														</td>
														<td {...commonCellProps}>
															<ConnectWrapper onClick={openConnectViaDesktop} />
														</td>
														<td {...commonCellProps}>
															<ConnectWrapper onClick={openConnectViaDesktop} />
														</td>
														<td {...commonCellProps}>
															<ConnectWrapper onClick={openConnectViaDesktop} />
														</td>
														<td>
															<div className="d-flex align-items-center justify-content-center">
																<AntBtn
																	className="stake-btn caps"
																	type="primary"
																	ghost
																	onClick={() => {}}
																	disabled={true}
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
							</div>
						</div>
						<div className="btn-wrapper">
							<Button
								label={STRINGS['STAKE.CONNECT_WALLET']}
								onClick={openConnectViaDesktop}
								className="my-4"
							/>
						</div>
					</>
				)}
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	coins: store.app.coins,
	stakables: store.stake.stakables,
	constants: store.app.constants,
	balance: store.user.balance,
	theme: store.app.theme,
	getStake: store.app.selectedStake,
});

const mapDispatchToProps = (dispatch) => ({
	setSelectedStake: bindActionCreators(setStake, dispatch),
	openConnectViaDesktop: bindActionCreators(openConnectViaDesktop, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Stake));
