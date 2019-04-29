import React from 'react';
import classnames from 'classnames';
import TradeBlock from './components/TradeBlock';
import ActiveOrders from './components/ActiveOrders';
import UserTrades from './components/UserTrades';
import MobileDropdownWrapper from './components/MobileDropdownWrapper';
import { ActionNotification, IconTitle } from '../../components';
import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';
import { Link } from 'react-router';



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
	goToPair,
	cancelDelayData
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
		<MobileDropdownWrapper className='' goToPair={goToPair}  />
		<TradeBlock
			title={STRINGS.ORDERS}
			action={
				isLoggedIn ?
				<ActionNotification
					text={STRINGS.CANCEL_ALL}
					iconPath={ICONS.CANCEL_CROSS_ACTIVE}
					onClick={cancelAllOrders}
					status=""
					useSvg={true}
					showActionText={true}
				/> : ''
			}
			className="f-1"
		>
		{	isLoggedIn ?
			<ActiveOrders cancelDelayData={cancelDelayData} orders={activeOrders} onCancel={cancelOrder} />
			:
			<div className='text-center'>
					<IconTitle
						iconPath={activeTheme==='white' ? ICONS.ACTIVE_TRADE_LIGHT : ICONS.ACTIVE_TRADE_DARK}
						textType="title"
						className="w-100"
						useSvg={true}
					/>
					<div>
						{STRINGS.formatString(
							STRINGS.ACTIVE_TRADES,
							<Link to="/login" className={classnames('blue-link', 'dialog-link', 'pointer')} >
								{STRINGS.SIGN_IN}
							</Link>
						)}
					</div>
				</div>
			}
		</TradeBlock>
		<TradeBlock
			title={STRINGS.RECENT_TRADES}
			active={true}
			action={ isLoggedIn ? 
				<ActionNotification
					text={STRINGS.TRANSACTION_HISTORY.TITLE}
					iconPath={ICONS.ARROW_TRANSFER_HISTORY_ACTIVE}
					onClick={goToTransactionsHistory}
					status=""
					useSvg={true}
					showActionText={true}
				/> 
				: ''
			}
			className="f-1"
		>
			{isLoggedIn ? <UserTrades
				pageSize={10}
				trades={userTrades}
				pair={pair}
				pairData={pairData}
				lessHeaders={true}
				pairs={pairs}
			/>:
			<div className='text-center'>
				<IconTitle
					iconPath={activeTheme ==='dark' ? ICONS.TRADE_HISTORY_DARK: ICONS.TRADE_HISTORY_LIGHT }
					textType="title"
					className="w-100"
					useSvg={true}
				/>
				<div>
					{STRINGS.formatString(
						STRINGS.ACTIVE_TRADES,
						<Link to="/login" className={classnames('blue-link', 'dialog-link', 'pointer')} >
							{STRINGS.SIGN_IN}
						</Link>
					)}
				</div>
			</div>
			}
		</TradeBlock>
	</div>
);

export default MobileOrders;
