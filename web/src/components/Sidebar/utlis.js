import React from 'react';
import { STATIC_ICONS } from 'config/icons';
import EditWrapper from 'components/EditWrapper';
import STRINGS from 'config/localizedStrings';

export const QuickTradeFooter = ({ onHandleTradeTabs, pairs }) => {
	return (
		<div
			className="quick-trade-field"
			onClick={() => {
				onHandleTradeTabs(`quick-trade/${pairs}`);
			}}
		>
			<img
				alt={'quick-trade'}
				className="quick-trade-footer-icon"
				src={STATIC_ICONS['FOOTERBAR_QUICK_TRADE']}
			/>
			<div className="quick-trade-text-field">
				<EditWrapper>{STRINGS['ACCOUNTS.QUICK_TRADE']}</EditWrapper>
			</div>
		</div>
	);
};

export const ProTradeFooter = ({ onHandleTradeTabs, pairs }) => {
	let pair = '';
	if (Object.keys(pairs).length) {
		pair = Object.keys(pairs)[0];
	}

	return (
		<div
			className="pro-trade-field"
			onClick={() => onHandleTradeTabs(`trade/${pair}`)}
		>
			<img
				alt={'pro-trade'}
				className="pro-trade-footer-icon"
				src={STATIC_ICONS['FOOTERBAR_PRO_TRADE']}
			/>
			<div>
				<EditWrapper>{STRINGS['ACCOUNTS.PRO_TRADE']}</EditWrapper>
			</div>
		</div>
	);
};
