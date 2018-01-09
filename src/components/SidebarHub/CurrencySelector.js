import React from 'react';
import classnames from 'classnames';
import { CURRENCIES } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

export const CurrencySelector = ({ activeCurrency, changeCurrency }) => {
	return (
		<div className="d-flex currency-selector">
			{Object.entries(CURRENCIES).map(([currency, values], index) => {
				const active = activeCurrency === currency;
				return (
					<div
						key={index}
						onClick={changeCurrency(currency)}
						className={classnames(
							'f-1 d-flex flex-column justify-content-center align-items-center',
							'tab-action title-font pointer',
							`tab-${currency}`,
							{ 'tab-active': active, 'not-active': !active }
						)}
					>
						<div className="tab-colors w-100" />
						<div className="f-1 d-flex justify-content-center align-items-center w-100">
							{STRINGS[`${currency.toUpperCase()}_NAME`]}
						</div>
					</div>
				);
			})}
		</div>
	);
};
