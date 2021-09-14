import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Tabs } from 'antd';
import STRINGS from 'config/localizedStrings';
import { IconTitle, HeaderSection, EditWrapper, Button } from 'components';
import { web3, CONTRACT_ADDRESSES, CONTRACTS } from 'config/contracts';
import withConfig from 'components/ConfigProvider/withConfig';
import Image from 'components/Image';

const { TabPane } = Tabs;
const TAB_KEYS = ['Public info', 'Distributions', 'My staking'];

class StakeDetails extends Component {
	render() {
		const {
			icons: ICONS,
			coins,
			router: {
				params: { token },
			},
		} = this.props;

		const { fullname } = coins[token];
		const iconId = `${token.toUpperCase()}_ICON`;

		return (
			<div className="stake-details presentation_container apply_rtl wallet-wrapper">
				<Fragment>
					<IconTitle
						text={fullname}
						iconPath={ICONS[iconId]}
						iconId={iconId}
						textType="title"
						wrapperClassName="currency-ball pt-2"
					/>
					<div className="d-flex">
						<div>Token Contract:</div>
						<div> </div>
						<div className="pointer blue-link">
							{CONTRACT_ADDRESSES[token].main}
						</div>
					</div>
					<div className="d-flex">
						<Link to="/stake">
							<div className="pointer blue-link">Go back</div>
						</Link>
						<div> </div>
						<div>to staking page</div>
					</div>
				</Fragment>

				<Fragment>
					<Tabs>
						{TAB_KEYS.map((key) => {
							return (
								<TabPane tab={key} key={key}>
									<div className="wallet-container no-border">
										<div className="wallet-assets_block">
											<div
												style={{
													height: '28rem',
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												<IconTitle
													stringId="PAGE_UNDER_CONSTRUCTION"
													text={STRINGS['PAGE_UNDER_CONSTRUCTION']}
													iconId="FIAT_UNDER_CONSTRUCTION"
													iconPath={ICONS['FIAT_UNDER_CONSTRUCTION']}
													className="flex-direction-column"
												/>
											</div>
										</div>
									</div>
								</TabPane>
							);
						})}
					</Tabs>
				</Fragment>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	coins: store.app.coins,
});

export default connect(mapStateToProps)(withConfig(StakeDetails));
