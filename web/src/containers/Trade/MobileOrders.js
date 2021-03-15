import React from 'react';
import classnames from 'classnames';
import TradeBlock from './components/TradeBlock';
import ActiveOrders from './components/ActiveOrders';
import UserTrades from './components/UserTrades';
import { ActionNotification } from '../../components';
import STRINGS from '../../config/localizedStrings';
import LogoutInfoOrder from './components/LogoutInfoOrder';
import LogoutInfoTrade from './components/LogoutInfoTrade';
import withConfig from 'components/ConfigProvider/withConfig';

const MobileOrders = ({
	activeOrders,
	cancelOrder,
	cancelAllOrders,
	goToTransactionsHistory,
	pair,
	pairData,
	userTrades,
	activeTheme,
	isLoggedIn,
	pairs,
	coins,
	cancelDelayData,
	icons: ICONS,
}) => (
	<div
		className={classnames(
			'flex-column',
			'd-flex',
			'justify-content-between',
			'f-1',
			'apply_rtl',
			'w-100'
		)}
	>
		<TradeBlock
			title={STRINGS['ORDERS']}
			action={
				isLoggedIn ? (
					<ActionNotification
						text={STRINGS['CANCEL_ALL']}
						iconPath={ICONS['CANCEL_CROSS_ACTIVE']}
						onClick={cancelAllOrders}
						status=""
						showActionText={true}
					/>
				) : (
					''
				)
			}
			className="f-1"
		>
			{isLoggedIn ? (
				<ActiveOrders
					pairData={pairData}
					cancelDelayData={cancelDelayData}
					orders={activeOrders}
					onCancel={cancelOrder}
					onCancelAll={cancelAllOrders}
				/>
			) : (
				<LogoutInfoOrder activeTheme={activeTheme} />
			)}
		</TradeBlock>
		<TradeBlock
			title={STRINGS['RECENT_TRADES']}
			active={true}
			action={
				isLoggedIn ? (
					<ActionNotification
						text={STRINGS['TRANSACTION_HISTORY.TITLE']}
						iconPath={ICONS['ARROW_TRANSFER_HISTORY_ACTIVE']}
						onClick={goToTransactionsHistory}
						status=""
						showActionText={true}
					/>
				) : (
					''
				)
			}
			className="f-1"
		>
			{isLoggedIn ? (
				<UserTrades
					pageSize={10}
					trades={userTrades}
					pair={pair}
					pairData={pairData}
					lessHeaders={true}
					pairs={pairs}
					coins={coins}
				/>
			) : (
				<LogoutInfoTrade />
			)}
		</TradeBlock>
	</div>
);

export default withConfig(MobileOrders);
