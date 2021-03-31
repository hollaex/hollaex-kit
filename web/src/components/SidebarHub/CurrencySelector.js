import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import STRINGS from '../../config/localizedStrings';

const CurrencySelector = ({ activeCurrency, changeCurrency, coins }) => {
	return (
		<div className="d-flex currency-selector">
			{Object.entries(coins).map(([currency, values], index) => {
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
							{values.fullname}
						</div>
					</div>
				);
			})}
		</div>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
});

export default connect(mapStateToProps)(CurrencySelector);
