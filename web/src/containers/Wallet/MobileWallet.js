import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { Accordion } from '../../components';
import CurrencySlider from './components/CurrencySlider';
import ProfitLossSection from './ProfitLossSection';

const MobileWallet = ({
	sections,
	balance,
	prices,
	navigate,
	coins,
	searchResult,
	router,
}) => {
	const [activeBalanceHistory, setActiveBalanceHistory] = useState(false);

	useEffect(() => {
		if (window.location.pathname === '/wallet/history') {
			setActiveBalanceHistory(true);
		}
	}, []);

	const handleBalanceHistory = (value) => {
		setActiveBalanceHistory(value);
		if (value) {
			router.push('/wallet/history');
		} else {
			router.push('/wallet');
		}
	};

	return (
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
					searchResult={searchResult}
					handleBalanceHistory={handleBalanceHistory}
				/>
			</div>
			<div className="f-1 wallet-container">
				{!activeBalanceHistory ? (
					<Accordion sections={sections} showActionText={true} />
				) : (
					<div style={{ marginTop: 30 }}>
						<ProfitLossSection handleBalanceHistory={handleBalanceHistory} />
					</div>
				)}
			</div>
		</div>
	);
};

export default MobileWallet;
