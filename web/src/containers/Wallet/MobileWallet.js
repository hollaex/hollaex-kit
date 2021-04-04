import React from 'react';
import classnames from 'classnames';
import { Accordion } from '../../components';
import CurrencySlider from './components/CurrencySlider';

const MobileWallet = ({ sections, balance, prices, navigate, coins }) => (
	<div
		className={classnames(
			'flex-column',
			'd-flex',
			'justify-content-between',
			'f-1',
			'apply_rtl',
			'h-100',
			'w-100'
		)}
	>
		<div className="d-flex f-05">
			<CurrencySlider
				balance={balance}
				prices={prices}
				navigate={navigate}
				coins={coins}
			/>
		</div>
		<div className="f-1 wallet-container">
			<Accordion sections={sections} showActionText={true} />
		</div>
	</div>
);

export default MobileWallet;
