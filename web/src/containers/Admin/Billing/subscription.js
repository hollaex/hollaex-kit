import React from 'react';
import { ReactSVG } from 'react-svg';
import { STATIC_ICONS } from 'config/icons';
import _get from 'lodash/get';

const Subscription = ({
	selectedCrypto,
	selectedType,
	isMonthly,
	dashExchange,
	exchangeCardKey,
	paymentAddressDetails,
	exchangePlanType,
	selectedPlanData,
	planPriceData,
}) => {
	const isCloud = () => {
		const exchangePlans = ['basic', 'crypto', 'fiat'];
		if (exchangePlans.includes(dashExchange.plan)) {
			return true;
		} else {
			return false;
		}
	};

	return (
		<div className="horizantal-line">
			<div className="plan-header">
				{exchangeCardKey === 'diy'
					? 'Selected DIY plan'
					: 'Selected cloud plan'}
			</div>
			<div className="subscription-container">
				<div className="plan-card">
					{exchangeCardKey === 'cloudExchange' ? (
						<div className="card-icon">
							<ReactSVG
								src={STATIC_ICONS['CLOUD_BASIC']}
								className="cloud-background"
							/>
							<ReactSVG
								src={STATIC_ICONS['CLOUD_CRYPTO']}
								className="cloud-icon"
							/>
						</div>
					) : (
						<ReactSVG
							src={STATIC_ICONS['DIY_FIRE_MAN_ICON']}
							className="diy-icon"
						/>
					)}

					<div>
						<p className="f-16">{selectedPlanData[selectedType]?.title}</p>
						<h6>
							{isCloud()
								? isMonthly
									? 'HollaEx Monthly Cloud Hosting:'
									: 'HollaEx Yearly Cloud Hosting:'
								: 'HollaEx Yearly DIY Hosting:'}
						</h6>
					</div>
				</div>
				<div className="exchange-text">
					<span>
						<ReactSVG
							src={STATIC_ICONS['EXCHANGE_LOGO_LIGHT_THEME']}
							className="cloud-icon"
						/>
					</span>
					<h6>{dashExchange?.name}</h6>
				</div>
				<div className="payment-container">
					<p className="f-20">
						{exchangeCardKey === 'diy'
							? 'Yearly payment:'
							: isMonthly
							? 'Monthly payment:'
							: 'Yearly payment:'}
					</p>
					<p className="f-20">
						{exchangeCardKey === 'diy'
							? `USD ${_get(planPriceData, 'year.price')}`
							: exchangePlanType === 'payment'
							? `${selectedCrypto.symbol.toUpperCase()} ${
									paymentAddressDetails?.amount
							  }`
							: paymentAddressDetails?.amount
							? `${paymentAddressDetails.currency.toUpperCase()} ${
									paymentAddressDetails?.amount
							  }`
							: isMonthly
							? `USD${_get(planPriceData, 'month.price')}`
							: `USD ${_get(planPriceData, 'year.price')}`}
					</p>
				</div>
			</div>
		</div>
	);
};

export default Subscription;
