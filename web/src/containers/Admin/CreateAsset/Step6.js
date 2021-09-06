import React, { Fragment } from 'react';
import { Button } from 'antd';

import { STATIC_ICONS } from 'config/icons';

const Step6 = ({ handleNext, handleScreenChange }) => {
	return (
		<Fragment>
			<div className="title">Add fiat currency</div>
			<div className="preview-coin-container">
				<div className="preview-content">
					<img
						className="icon-preview"
						src={STATIC_ICONS.CURRENCY_SYMBOL}
						alt="new_coin"
					/>
				</div>
			</div>
			<p className="fiat-confirm-content">
				Fiat currencies such as USD and the YEN are the responsibility of the
				exchange operators to manage.
			</p>
			<p className="fiat-confirm-content">
				After adding your fiat currency to your exchange you can connect a
				banking or payment system to activate deposit and withdrawals.
			</p>
			<div className="btn-wrapper">
				<Button
					type="primary"
					className="green-btn"
					onClick={() => handleScreenChange('step3')}
				>
					Back
				</Button>
				<div className="separator"></div>
				<Button type="primary" className="green-btn" onClick={handleNext}>
					I understand, proceed
				</Button>
			</div>
		</Fragment>
	);
};

export default Step6;
