import React, { Component } from 'react';
import classnames from 'classnames';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

import { ButtonLink, Wallet } from '../';
import { Section } from './Section';
import { CurrencySelector } from './CurrencySelector';

class SidebarHub extends Component {
	setActiveCurrency = (currency) => () => {
		if (this.props.changeCurrency) {
			this.props.changeCurrency(currency);
		}
	};

	render() {
		const { activePath, currency } = this.props;
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
						active={activePath === 'account'}
						path="/account"
					/>
					<Section
						title={STRINGS.WALLET_TITLE}
						icon={ICONS.SIDEBAR_WALLET_ACTIVE}
						active={activePath === 'wallet'}
						path="/wallet"
					>
						<Wallet />
					</Section>
					<Section
						title={STRINGS.TRADING_TITLE}
						icon={ICONS.SIDEBAR_TRADING_ACTIVE}
						childrenClassName="d-flex sidebar_hub-trade"
						active={activePath === 'trade' || activePath === 'quick-trade'}
						path="/trade"
					>
						<ButtonLink
							label={STRINGS.PRO_TRADE}
							className={classnames('sidebar_hub-button f-1', {
								active: activePath === 'trade',
								'not-active': activePath !== 'trade'
							})}
							link="/trade"
						/>
						<div className="separator" />
						<ButtonLink
							label={STRINGS.QUICK_TRADE}
							className={classnames('sidebar_hub-button f-1', {
								active: activePath === 'quick-trade',
								'not-active': activePath !== 'quick-trade'
							})}
							link="/quick-trade"
						/>
					</Section>
				</div>
			</div>
		);
	}
}

export default SidebarHub;
