import React from 'react';
import classnames from 'classnames';
import TradeBlock from './components/TradeBlock';
import ActiveOrders from './components/ActiveOrders';
import UserTrades from './components/UserTrades';
import { ActionNotification } from '../../components';
import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';

const MobileOrders = ({
	activeOrders,
	cancelOrder,
	cancelAllOrders,
	pair,
	pairData,
	userTrades
}) => (
	<div
		className={classnames(
			'flex-column',
			'd-flex',
			'justify-content-between',
			'f-1',
			'apply_rtl'
		)}
	>
		<TradeBlock
			title={STRINGS.ORDERS}
			action={
				<ActionNotification
					text={STRINGS.CANCEL_ALL}
					iconPath={ICONS.CANCEL_CROSS_ACTIVE}
					onClick={cancelAllOrders}
					status=""
					useSvg={true}
				/>
			}
			className="f-1"
		>
			<ActiveOrders orders={activeOrders} onCancel={cancelOrder} />
		</TradeBlock>
		<TradeBlock title={STRINGS.TRADE_HISTORY} className="f-1">
			<UserTrades
				trades={userTrades}
				pair={pair}
				pairData={pairData}
				lessHeaders={true}
			/>
		</TradeBlock>
	</div>
)

export default MobileOrders
