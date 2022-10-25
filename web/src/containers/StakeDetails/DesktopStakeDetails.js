import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import {
	getDistributions,
	getStakeEvents,
	loadBlockchainData,
	getCurrentBlock,
	generateTableData,
	getAllUserStakes,
	getPendingTransactions,
	getAllPeriods,
	getAllPenalties,
	getAllPots,
} from 'actions/stakingActions';
import { Link, withRouter } from 'react-router';
import { Tabs } from 'antd';
import STRINGS from 'config/localizedStrings';
import { IconTitle, EditWrapper } from 'components';
import { CONTRACT_ADDRESSES, STAKING_INDEX_COIN } from 'config/contracts';
import withConfig from 'components/ConfigProvider/withConfig';
import Account from 'containers/Stake/components/Account';
import { getPublicInfo } from 'actions/stakingActions';
import { open } from 'helpers/link';

import {
	userActiveStakesSelector,
	networksMismatchSelector,
} from 'containers/Stake/selector';
import PublicInfo from './components/PublicInfo';
import Distributions from './components/Distributions';
import MyStaking from './components/MyStaking';

const { TabPane } = Tabs;
export const TABS = {
	PUBLIC_INFO: {
		key: 'PUBLIC_INFO',
		title: STRINGS['STAKE_DETAILS.TABS.PUBLIC_INFO'],
	},
	DISTRIBUTIONS: {
		key: 'DISTRIBUTIONS',
		title: STRINGS['STAKE_DETAILS.TABS.DISTRIBUTIONS'],
	},
	MY_STAKING: {
		key: 'MY_STAKING',
		title: STRINGS['STAKE_DETAILS.TABS.MY_STAKING'],
	},
};

class StakeDetails extends Component {
	state = {
		activeKey: TABS.PUBLIC_INFO.key,
	};

	componentWillMount() {
		const {
			account,
			router: {
				params: { token },
			},
			getDistributions,
			getStakeEvents,
			loadBlockchainData,
			getCurrentBlock,
			generateTableData,
			getAllUserStakes,
			getPublicInfo,
			getPendingTransactions,
			getAllPenalties,
			getAllPeriods,
			getAllPots,
		} = this.props;

		loadBlockchainData();
		getCurrentBlock();
		getAllPenalties();
		getAllPeriods();
		getAllPots();
		getDistributions(token);
		getPublicInfo(token);

		if (account) {
			getStakeEvents(token, account);
			generateTableData(account);
			getAllUserStakes(account);
			getPendingTransactions(account);
		}
	}

	componentDidUpdate(prevProps) {
		const {
			account,
			network,
			generateTableData,
			getAllUserStakes,
			getStakeEvents,
			getPendingTransactions,
			router: {
				params: { token },
			},
		} = this.props;

		if (
			(!!account && account !== prevProps.account) ||
			(!!network && network !== prevProps.network)
		) {
			getStakeEvents(token, account);
			generateTableData(account);
			getAllUserStakes(account);
			getPendingTransactions(account);
		}
	}

	componentDidMount() {
		this.setBlockNumberInterval();
	}

	componentWillUnmount() {
		this.clearBlockNumberInterval();
	}

	setBlockNumberInterval = () => {
		const { getCurrentBlock } = this.props;
		this.BlockNumberIntervalHandler = setInterval(getCurrentBlock, 5000);
	};

	clearBlockNumberInterval = () => {
		clearInterval(this.BlockNumberIntervalHandler);
	};

	goToPOT = () => {
		const {
			contracts: {
				[STAKING_INDEX_COIN]: { network, token },
			},
			pots,
		} = this.props;
		const address = pots[STAKING_INDEX_COIN]
			? pots[STAKING_INDEX_COIN].address
			: '';

		const url = `https://${
			network !== 'main' ? `${network}.` : ''
		}etherscan.io/token/${token}?a=${address}`;
		open(url);
	};

	goToBlocks = () => {
		const {
			contracts: {
				[STAKING_INDEX_COIN]: { network },
			},
		} = this.props;
		const url = `https://${
			network !== 'main' ? `${network}.` : ''
		}etherscan.io/blocks`;
		open(url);
	};

	renderTabContent = (key) => {
		const {
			icons: ICONS,
			router: {
				params: { token },
			},
			coins,
			totalUserStakes,
			totalUserEarnings,
		} = this.props;

		const { fullname } = coins[token];

		switch (key) {
			case TABS.PUBLIC_INFO.key:
				return (
					<PublicInfo
						token={token}
						fullname={fullname}
						setActiveTab={this.setActiveTab}
						goToPOT={this.goToPOT}
					/>
				);
			case TABS.DISTRIBUTIONS.key:
				return <Distributions token={token} goToPOT={this.goToPOT} />;
			case TABS.MY_STAKING.key:
				return (
					<MyStaking
						token={token}
						totalUserEarnings={totalUserEarnings}
						totalUserStakes={totalUserStakes}
						goToBlocks={this.goToBlocks}
					/>
				);
			default:
				return (
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
				);
		}
	};

	setActiveTab = (activeKey) => {
		this.setState({ activeKey });
	};

	openContract = (token) => {
		const {
			contracts: {
				[STAKING_INDEX_COIN]: { network },
			},
		} = this.props;
		const url = `https://${
			network !== 'main' ? `${network}.` : ''
		}etherscan.io/token/${token}`;
		open(url);
	};

	render() {
		const {
			icons: ICONS,
			coins,
			router: {
				params: { token },
			},
			networksMismatch,
		} = this.props;

		const { activeKey } = this.state;

		const { fullname, icon_id } = coins[token];

		const __html = `.stake-panel-bg:before { background-image: url(${ICONS['STAKING_PANEL_BACKGROUND']}) }`;

		return (
			<Fragment>
				<style dangerouslySetInnerHTML={{ __html }} />
				<div className="stake-details presentation_container apply_rtl wallet-wrapper">
					<div className="d-flex align-end justify-content-between">
						<div>
							<IconTitle
								text={STRINGS.formatString(
									STRINGS['STAKE_DETAILS.TOKEN'],
									fullname
								)}
								iconPath={ICONS[icon_id]}
								iconId={icon_id}
								textType="title"
								imageWrapperClassName="currency-ball pt-2"
							/>
							<div>
								{STRINGS.formatString(
									STRINGS['STAKE_DETAILS.CONTRACT_SUBTITLE'],
									<span
										className="pointer blue-link"
										onClick={() =>
											this.openContract(CONTRACT_ADDRESSES()[token].token)
										}
									>
										{CONTRACT_ADDRESSES()[token].token}
									</span>
								)}
								<EditWrapper stringId="STAKE_DETAILS.CONTRACT_SUBTITLE" />
							</div>
							<div>
								{STRINGS.formatString(
									STRINGS['STAKE_DETAILS.BACK_SUBTITLE'],
									<Link to="/stake">
										<span className="pointer blue-link">
											{STRINGS['STAKE_DETAILS.GO_BACK']}
										</span>
									</Link>
								)}
								<EditWrapper stringId="STAKE_DETAILS.BACK_SUBTITLE,STAKE_DETAILS.GO_BACK" />
							</div>
						</div>
						<div>
							<Account />
						</div>
					</div>

					<Fragment>
						<Tabs
							activeKey={activeKey}
							onTabClick={(key) => this.setActiveTab(key)}
							className={classnames({ 'area-disabled': networksMismatch })}
						>
							{Object.entries(TABS).map(([_, { key, title }]) => {
								return (
									<TabPane tab={title} key={key}>
										<div className="wallet-container no-border stake-panel-bg">
											<div className="wallet-assets_block">
												{this.renderTabContent(key)}
											</div>
										</div>
									</TabPane>
								);
							})}
						</Tabs>
					</Fragment>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = (store) => ({
	coins: store.app.coins,
	account: store.stake.account,
	network: store.stake.network,
	currentBlock: store.stake.currentBlock,
	pots: store.stake.pots,
	...userActiveStakesSelector(store),
	networksMismatch: networksMismatchSelector(store),
	contracts: store.app.contracts,
});

const mapDispatchToProps = (dispatch) => ({
	getDistributions: bindActionCreators(getDistributions, dispatch),
	getStakeEvents: bindActionCreators(getStakeEvents, dispatch),
	loadBlockchainData: bindActionCreators(loadBlockchainData, dispatch),
	getCurrentBlock: bindActionCreators(getCurrentBlock, dispatch),
	generateTableData: bindActionCreators(generateTableData, dispatch),
	getAllUserStakes: bindActionCreators(getAllUserStakes, dispatch),
	getPendingTransactions: bindActionCreators(getPendingTransactions, dispatch),
	getPublicInfo: bindActionCreators(getPublicInfo, dispatch),
	getAllPeriods: bindActionCreators(getAllPeriods, dispatch),
	getAllPenalties: bindActionCreators(getAllPenalties, dispatch),
	getAllPots: bindActionCreators(getAllPots, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(withConfig(StakeDetails)));
