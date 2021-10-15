import React, { Component, Fragment } from 'react';
import mathjs from 'mathjs';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Tabs } from 'antd';
import STRINGS from 'config/localizedStrings';
import { IconTitle, EditWrapper } from 'components';
import { CONTRACT_ADDRESSES } from 'config/contracts';
import withConfig from 'components/ConfigProvider/withConfig';
import Account from 'containers/Stake/components/Account';
import { getPublicInfo } from 'actions/stakingActions';

import { userActiveStakesSelector } from 'containers/Stake/selector';
import PublicInfo from './components/PublicInfo';
import Distributions from './components/Distributions';
import MyStaking from './components/MyStaking';

import { formatToCurrency } from 'utils/currency';
import {
	BASE_CURRENCY,
	CURRENCY_PRICE_FORMAT,
	DEFAULT_COIN_DATA,
} from 'config/constants';

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

	constructor(props) {
		super(props);
		const { account, router } = this.props;
		if (!account) {
			router.push('/stake');
		}
	}

	componentWillMount() {
		const {
			account,
			router: {
				params: { token },
			},
		} = this.props;

		if (account) {
			getPublicInfo(token)(account).then((res) => {
				console.log('response', res);
			});
		}
	}

	getValue = (balances, prices) => {
		let value = 0;
		Object.entries(balances).forEach(([symbol, balance]) => {
			value = mathjs.sum(
				mathjs.multiply(
					balance,
					!prices[symbol] || prices[symbol] === -1 ? 0 : prices[symbol]
				),
				value
			);
		});

		return value;
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
			prices,
		} = this.props;

		const { fullname } = coins[token];

		const totlStakes = this.getValue(totalUserStakes, prices);
		const totalEarnings = this.getValue(totalUserEarnings, prices);

		const { min, symbol = '' } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;

		const totalStakesString = STRINGS.formatString(
			CURRENCY_PRICE_FORMAT,
			symbol.toUpperCase(),
			formatToCurrency(totlStakes, min)
		);

		const totalEarningsString = STRINGS.formatString(
			CURRENCY_PRICE_FORMAT,
			symbol.toUpperCase(),
			formatToCurrency(totalEarnings, min)
		);

		switch (key) {
			case TABS.PUBLIC_INFO.key:
				return (
					<PublicInfo
						token={token}
						fullname={fullname}
						setActiveTab={this.setActiveTab}
					/>
				);
			case TABS.DISTRIBUTIONS.key:
				return <Distributions token={token} />;
			case TABS.MY_STAKING.key:
				return (
					<MyStaking
						token={token}
						totalEarningsString={totalEarningsString}
						totalStakesString={totalStakesString}
						totalUserEarnings={totalUserEarnings}
						totalUserStakes={totalUserStakes}
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

	openContract = (address) => {
		const { network } = this.props;
		const url = `https://${
			network !== 'main' ? `${network}.` : ''
		}etherscan.io/address/${address}`;
		if (window) {
			window.open(url, '_blank');
		}
	};

	render() {
		const {
			icons: ICONS,
			coins,
			router: {
				params: { token },
			},
			account,
			balance,
			network,
		} = this.props;

		if (!account) {
			return <div />;
		}

		const { activeKey } = this.state;

		const { fullname } = coins[token];
		const iconId = `${token.toUpperCase()}_ICON`;

		return (
			<div className="stake-details presentation_container apply_rtl wallet-wrapper">
				<div className="d-flex align-end justify-content-between">
					<div>
						<IconTitle
							text={fullname}
							iconPath={ICONS[iconId]}
							iconId={iconId}
							textType="title"
							wrapperClassName="currency-ball pt-2"
						/>
						<div>
							{STRINGS.formatString(
								STRINGS['STAKE_DETAILS.CONTRACT_SUBTITLE'],
								<span
									className="pointer blue-link"
									onClick={() =>
										this.openContract(CONTRACT_ADDRESSES[token].main)
									}
								>
									{CONTRACT_ADDRESSES[token].main}
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
						<Account account={account} balance={balance} network={network} />
					</div>
				</div>

				<Fragment>
					<Tabs
						activeKey={activeKey}
						onTabClick={(key) => this.setActiveTab(key)}
					>
						{Object.entries(TABS).map(([_, { key, title }]) => {
							return (
								<TabPane tab={title} key={key}>
									<div className="wallet-container no-border">
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
		);
	}
}

const mapStateToProps = (store) => ({
	coins: store.app.coins,
	account: store.stake.account,
	network: store.stake.network,
	balance: store.stake.balance,
	currentBlock: store.stake.currentBlock,
	prices: store.asset.oraclePrices,
	...userActiveStakesSelector(store),
});

export default connect(mapStateToProps)(withConfig(StakeDetails));
