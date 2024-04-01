import React from 'react';
import { Button, Spin } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { Link } from 'react-router';

const FiatConfirmation = ({ exchange, onCancel, handleViewPlan }) => {
	return (
		<div className="fiat-application-wrapper">
			<div className="submitted-info">
				<CheckCircleFilled />
				<div>Submitted</div>
			</div>
			<div className="title">Application Fiat Ramp</div>
			{exchange.business_info &&
			Object.keys(exchange.business_info).length === 0 ? (
				<Spin />
			) : exchange.business_info.budget === 'low' ? (
				<div>
					<div>
						Your Fiat Ramp plan application has been submitted. Based on the
						data provided it is highly recommend that a <b>Basic</b> or{' '}
						<b>Crypto Pro</b> plan would most likely suffice for your crypto
						exchange needs.
					</div>
					<div className="main-info">
						Alternatively, you can try setting up everything yourself by
						switching to a <b>DIY exchange</b> by going to the{' '}
						<Link to="/hosting">hosting</Link> section of your dashboard and
						switching from cloud to a DIY exchange and follow the steps within
						the{' '}
						<a
							href="http://docs.hollaex.com/"
							target="_blank"
							rel="noopener noreferrer"
						>
							HollaEx exchange setup docs
						</a>
						.
					</div>
				</div>
			) : (
				<div>
					<div>
						Thank you for submitting your <b>Fiat Ramp exchange application.</b>{' '}
						A sales representative will be in touch within 24-48 hours.
					</div>
					<div className="main-info">
						In the mean time feel free to join the HollaEx crypto exchange
						community on{' '}
						<a
							href="https://discord.gg/2FqvS6TbRm"
							target="_blank"
							rel="noopener noreferrer"
							className="text-underline"
						>
							Discord
						</a>{' '}
						or read more about the exchange setup in the{' '}
						<a
							href="http://docs.hollaex.com/"
							target="_blank"
							rel="noopener noreferrer"
							className="text-underline"
						>
							HollaEx documentations
						</a>
					</div>
				</div>
			)}
			<div className="btn-wrapper">
				<Button type="primary" onClick={onCancel} className="w-30">
					Close
				</Button>
				<div className="separator"></div>
				<Button type="primary" onClick={handleViewPlan} className="w-70">
					View cloud plans
				</Button>
			</div>
		</div>
	);
};

export default FiatConfirmation;
