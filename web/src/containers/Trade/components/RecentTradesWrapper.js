import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Filters from './Filters';
import TradeBlock from './TradeBlock';
import UserTrades from './UserTrades';
import LogoutInfoOrder from './LogoutInfoOrder';
import { isLoggedIn } from 'utils/token';
import { ActionNotification } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { userTradesSelector } from '../utils';
import { setRecentTradesMarket } from 'actions/appActions';

const RecentTradesWrapper = ({
	pair,
	pairData,
	userTrades,
	pairs,
	coins,
	discount,
	prices,
	icons: ICONS,
	goToTransactionsHistory,
	tool,
	recentTradesMarket,
	setRecentTradesMarket,
	fetched,
}) => {
	return (
		<TradeBlock
			title={STRINGS['TOOLS.RECENT_TRADES']}
			action={
				isLoggedIn() ? (
					<ActionNotification
						stringId="TRANSACTION_HISTORY.TITLE"
						text={STRINGS['TRANSACTION_HISTORY.TITLE']}
						iconId="ARROW_TRANSFER_HISTORY_ACTIVE"
						iconPath={ICONS['ARROW_TRANSFER_HISTORY_ACTIVE']}
						onClick={() => goToTransactionsHistory('trades')}
						status="information"
						className="trade-wrapper-action"
					/>
				) : (
					''
				)
			}
			stringId="TOOLS.RECENT_TRADES"
			tool={tool}
			titleClassName="mb-4"
		>
			{isLoggedIn() ? (
				<Fragment>
					<Filters pair={recentTradesMarket} onChange={setRecentTradesMarket} />
					<UserTrades
						pageSize={userTrades.length}
						trades={userTrades}
						pair={pair}
						pairData={pairData}
						pairs={pairs}
						coins={coins}
						discount={discount}
						prices={prices}
						icons={ICONS}
						isLoading={!fetched}
					/>
				</Fragment>
			) : (
				<LogoutInfoOrder />
			)}
		</TradeBlock>
	);
};

RecentTradesWrapper.defaultProps = {
	userTrades: [],
};

const mapStateToProps = (state) => ({
	prices: state.asset.oraclePrices,
	userTrades: userTradesSelector(state),
	recentTradesMarket: state.app.recentTradesMarket,
	fetched: state.wallet.trades.fetched,
});

const mapDispatchToProps = (dispatch) => ({
	setRecentTradesMarket: bindActionCreators(setRecentTradesMarket, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(RecentTradesWrapper));
