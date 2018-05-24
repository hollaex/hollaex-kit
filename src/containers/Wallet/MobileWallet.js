import React from 'react';
import classnames from 'classnames';
import { Accordion } from '../../components';
import TradeBlock from '../Trade/components/TradeBlock';
import STRINGS from '../../config/localizedStrings';

const MobileWallet = ({ sections }) => (
	<div
		className={classnames(
			'flex-column',
			'd-flex',
			'justify-content-between',
			'f-1',
			'apply_rtl'
		)}
	>
		<TradeBlock title={STRINGS.ORDERS} className="f-1" />
		<div className="f-1 wallet-container">
			<Accordion sections={sections} showActionText={true} />
		</div>
	</div>
);

export default MobileWallet;
