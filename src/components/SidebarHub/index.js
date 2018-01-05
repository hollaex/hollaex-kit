import React, { Component } from 'react';
import classnames from 'classnames';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

import { Button, Wallet } from '../';
import { Section } from './Section';
import { CurrencySelector } from './CurrencySelector';

class SidebarHub extends Component {
	setActiveCurrency = (currency) => () => {
		if (this.props.changeCurrency) {
			this.props.changeCurrency(currency);
		}
	};

	render() {
		const {
			goToWalletPage,
			goToAccountPage,
			goToQuickTradePage,
			goToTradePage,
			activePath,
			currency
		} = this.props;
		return (
			<div
				className={classnames(
					'd-flex flex-column sidebar_hub-wrapper',
					`active_currency-${currency}`,
					`active-${activePath}`
				)}
			>
				<CurrencySelector
					activeCurrency={currency}
					changeCurrency={this.setActiveCurrency}
				/>
				<div className="d-flex sidebar_hub-content d-flex flex-column">
					<Section
						title={STRINGS.ACCOUNT_TEXT}
						icon={ICONS.SIDEBAR_ACCOUNT_ACTIVE}
						onClickHeader={goToAccountPage}
						active={activePath === 'account'}
					/>
					<Section
						title={STRINGS.WALLET_TITLE}
						icon={ICONS.SIDEBAR_WALLET_ACTIVE}
						onClickHeader={goToWalletPage}
						active={activePath === 'wallet'}
					>
						<Wallet />
					</Section>
					<Section
						title={STRINGS.TRADING_TITLE}
						icon={ICONS.SIDEBAR_TRADING_ACTIVE}
						childrenClassName="d-flex sidebar_hub-trade"
						active={activePath === 'trade' || activePath === 'quick-trade'}
					>
						<Button
							label={STRINGS.PRO_TRADE}
							className={classnames('sidebar_hub-button f-1', {
								active: activePath === 'trade',
								'not-active': activePath !== 'trade'
							})}
							onClick={goToTradePage}
						/>
						<div className="separator" />
						<Button
							label={STRINGS.QUICK_TRADE}
							className={classnames('sidebar_hub-button f-1', {
								active: activePath === 'quick-trade',
								'not-active': activePath !== 'quick-trade'
							})}
							onClick={goToQuickTradePage}
						/>
					</Section>
				</div>
			</div>
		);
	}
}

export default SidebarHub;
