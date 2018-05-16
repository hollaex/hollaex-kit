import React, { Component } from 'react';
import classnames from 'classnames';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

import { ButtonLink, Wallet } from '../';
import { Section } from './Section';

class SidebarHub extends Component {

	render() {
		const { activePath, pair } = this.props;
		return (
			<div
				className={classnames(
					'd-flex flex-column sidebar_hub-wrapper',
					`active-${activePath}`
				)}
			>
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
							disabled={!pair}
							link={`/trade/${pair}`}
						/>
						<div className="separator" />
						<ButtonLink
							label={STRINGS.QUICK_TRADE}
							className={classnames('sidebar_hub-button f-1', {
								active: activePath === 'quick-trade',
								'not-active': activePath !== 'quick-trade'
							})}
							disabled={!pair}
							link={`/quick-trade/${pair}`}
						/>
					</Section>
				</div>
			</div>
		);
	}
}

export default SidebarHub;
