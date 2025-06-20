import React, { useState } from 'react';
import { Checkbox } from 'antd';

import STRINGS from 'config/localizedStrings';
import classNames from 'classnames';
import { Button, Coin } from 'components';

export const RiskyTrade = ({ setShowRisky, coinData, onCloseDialog }) => {
	const [enableProceedBtn, setEnableProceedBtn] = useState(false);
	const { icon_id, fullname, display_name, code } = coinData;

	const toggleRisk = (e) => {
		setEnableProceedBtn(e.target.checked);
	};

	const handleProceedClick = () => {
		localstoreRiskyCoin();
		setShowRisky(false);
	};

	const localstoreRiskyCoin = () => {
		const localRiskyItems = localStorage.getItem('riskyItems');
		const riskyItems = localRiskyItems ? JSON.parse(localRiskyItems) : {};
		riskyItems[code] = true;
		localStorage.setItem('riskyItems', JSON.stringify(riskyItems));
	};

	return (
		<div className="risky-trade-disclaimer">
			<div className="mb-4">
				<div className="coin-icon-container">
					<Coin iconId={icon_id} type="CS12" />
				</div>
				<div className="disclaimer-title">
					{STRINGS['USER_SETTINGS.RISKY_TRADE_DETECTED']}
				</div>
				<p className="disclaimer-msg">
					{STRINGS.formatString(
						STRINGS['RISKY_TRADE_DISCLAIMER.MSG_1'],
						fullname,
						display_name
					)}
					&nbsp;
					<span className="extreme-volatility-msg">
						{STRINGS['RISKY_TRADE_DISCLAIMER.MSG_2']}
					</span>
				</p>
				<p className="disclaimer-msg">
					{STRINGS['RISKY_TRADE_DISCLAIMER.MSG_3']}
				</p>
				<div
					className={classNames(
						{
							'disclaimer-checkbox-selected': enableProceedBtn,
						},
						'disclaimer-checkbox mt-4'
					)}
				>
					<Checkbox checked={enableProceedBtn} onChange={toggleRisk}>
						{STRINGS['RISKY_TRADE_DISCLAIMER.UNDERSTAND_RISK_MSG']}
					</Checkbox>
				</div>
			</div>
			<footer className="d-flex pt-4">
				<Button
					label={STRINGS['CLOSE_TEXT']}
					onClick={onCloseDialog}
					className="mr-2"
				/>
				<Button
					label={STRINGS['CONFIRM_TEXT']}
					onClick={handleProceedClick}
					className="ml-2"
					disabled={!enableProceedBtn}
				/>
			</footer>
		</div>
	);
};
