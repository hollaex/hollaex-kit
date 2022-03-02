import React from 'react';
import { connect } from 'react-redux';

import TradeBlock from './TradeBlock';
import UserTrades from './UserTrades';
import LogoutInfoTrade from './LogoutInfoTrade';
import { isLoggedIn } from 'utils/token';
import { ActionNotification } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { userTradesSelector } from '../utils';

const OrdersWrapper = ({
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
						onClick={goToTransactionsHistory}
						status="information"
						className="trade-wrapper-action"
					/>
				) : (
					''
				)
			}
			stringId="TOOLS.RECENT_TRADES"
			tool={tool}
		>
			{isLoggedIn() ? (
				<UserTrades
					pageSize={10}
					trades={userTrades}
					pair={pair}
					pairData={pairData}
					pairs={pairs}
					coins={coins}
					discount={discount}
					prices={prices}
					icons={ICONS}
				/>
			) : (
				<LogoutInfoTrade />
			)}
		</TradeBlock>
	);
};

OrdersWrapper.defaultProps = {
	userTrades: [],
};

const mapStateToProps = (state) => ({
	prices: state.asset.oraclePrices,
	userTrades: userTradesSelector(state),
});

export default connect(mapStateToProps)(withConfig(OrdersWrapper));
