import React from 'react';
import { STATIC_ICONS } from 'config/icons';
import { ReactSVG } from 'react-svg';
import _get from 'lodash/get';
// import Image from 'components/Image'

const Subscription = ({ isMonthly, planPriceData }) => {
	return (
		<div className="subscription-container">
			<div className="plan-card">
				<div className="card-icon">
					<ReactSVG
						src={STATIC_ICONS['CLOUD_BASIC']}
						className="cloud-background"
					/>
					<ReactSVG src={STATIC_ICONS['CLOUD_CRYPTO']} className="cloud-icon" />
				</div>
				<div>
					<h6>PLAN SUBSCRIBTION</h6>
					<p className="f-16">Crypto Pro</p>
					<h6>HollaEx Monthly Cloud Hosting</h6>
				</div>
			</div>

			<div className="exchange-text">
				<span>
					{/* <div className="exchange-name"></div> */}
					<ReactSVG
						src={STATIC_ICONS['EXCHANGE_LOGO_LIGHT_THEME']}
						className="cloud-icon"
					/>
				</span>
				<h6>exchange-name</h6>
			</div>
			<div className="payment-container">
				<p className="f-20">
					{isMonthly ? 'Monthly payment:' : 'Yearly payment:'}
				</p>
				<p className="f-20">
					{isMonthly
						? `USD${_get(planPriceData, 'month.price')}`
						: `USD ${_get(planPriceData, 'year.price')}`}
				</p>
			</div>
		</div>
	);
};

export default Subscription;
