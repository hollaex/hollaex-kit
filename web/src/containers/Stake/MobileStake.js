import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import { Button as AntBtn } from 'antd';
import { openConnectViaDesktop } from 'actions/appActions';

import STRINGS from 'config/localizedStrings';
import { IconTitle, HeaderSection, EditWrapper, Button } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import Image from 'components/Image';

import Account from './components/Account';
import ConnectWrapper from './components/ConnectWrapper';
import StakesAndEarnings from './components/StakesAndEarnings';
import { STAKING_INDEX_COIN } from 'config/contracts';

class Stake extends Component {
	render() {
		const {
			icons: ICONS,
			coins,
			openConnectViaDesktop,
			stakables,
		} = this.props;

		const { display_name } = coins[STAKING_INDEX_COIN];

		return (
			<div className="presentation_container apply_rtl wallet-wrapper">
				<div className="d-flex align-end justify-content-between">
					<IconTitle
						stringId="STAKE.TITLE"
						text={STRINGS['STAKE.TITLE']}
						iconPath={ICONS['TAB_STAKE']}
						iconId="TAB_STAKE"
						textType="title"
					/>
					<Account />
				</div>
				<div className={classnames('wallet-container', 'no-border')}>
					<div className="wallet-assets_block">
						<div className="d-flex justify-content-between align-start">
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
								{stakables.map((tokenData, index) => {
									const { symbol } = tokenData;
									const { fullname, icon_id, display_name } = coins[symbol];
									const commonCellProps = {};
									return (
										<tr
											className="hoverable pointer table-row table-bottom-border"
											key={index}
										>
											<td />
											<td className="td-name td-fit">
												<div className="d-flex align-items-center">
													<Image
														iconId={icon_id}
														icon={ICONS[icon_id]}
														wrapperClassName="currency-ball pt-2"
														imageWrapperClassName="currency-ball-image-wrapper"
													/>
													{fullname}
													<span className="pl-2 secondary-text">
														{display_name}
													</span>
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
												<div className="d-flex">
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
				<div className="btn-wrapper">
					<Button
						label={STRINGS['STAKE.CONNECT_WALLET']}
						onClick={openConnectViaDesktop}
						className="my-4"
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	coins: store.app.coins,
	stakables: store.stake.stakables,
});

const mapDispatchToProps = (dispatch) => ({
	openConnectViaDesktop: bindActionCreators(openConnectViaDesktop, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Stake));
