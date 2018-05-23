import React, { Component } from 'react';
import classnames from 'classnames';
import TradeBlock from './components/TradeBlock';
import TradeHistory from './components/TradeHistory';
import ActiveOrders from './components/ActiveOrders';
import MobileDropdownWrapper from './components/MobileDropdownWrapper';
import { ActionNotification } from '../../components';
import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';

class MobileOrders extends Component {
	render() {
		const {
			props: {
				tradeHistory,
				activeOrders,
				cancelOrder,
				cancelAllOrders,
				activeLanguage
			}
		} = this.props;

		return (
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
					<TradeHistory renderExtra={true} data={tradeHistory} language={activeLanguage} />
				</TradeBlock>
			</div>
		);
	}
}

export default MobileOrders;
