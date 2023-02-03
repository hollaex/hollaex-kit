import React from 'react';
import _get from 'lodash/get';
import { CheckOutlined } from '@ant-design/icons';

const PlanStructure = ({
	exchange,
	planData,
	type,
	isMonthly,
	planType,
	showConfigIcon = false,
	handleConfigPlan,
	handleSelect,
	priceData,
	selectedType,
	setSelectedType,
	className,
	onHandleSelectedType,
	cloudPlanDetails,
}) => {
	let currentPlan = planData[type];

	return (
		<div
			className={
				cloudPlanDetails
					? `${className} plan-container`
					: 'cloud-plan-container cloud-container'
			}
		>
			<div className="plan-container-wrapper">
				<div className={`popular-header-${type}`}>
					{type === 'crypto' ? 'MOST POPULAR' : ''}
				</div>
				<div className="header-wrapper">
					<div className={`header-container-${type}`}></div>
					<div
						className="header-container"
						style={{ backgroundImage: `url(${currentPlan?.background})` }}
					>
						<h2 className="type-center">{currentPlan?.title}</h2>
						<h6 className="text-center">{currentPlan.description}</h6>
					</div>
				</div>
				<div className="feature-wrapper">
					{_get(currentPlan, 'section') &&
						_get(currentPlan, 'section').map((subContent, index) => {
							return (
								<div key={index}>
									<div>
										<div className="plan-header ml-5">{subContent.title}</div>
										<ul className="sub-txt">
											{subContent.points.map((val, index) => {
												return <li key={index}>{val}</li>;
											})}
										</ul>
									</div>
								</div>
							);
						})}
					{!isMonthly && !_get(currentPlan, 'services.hideOnMonthly') ? (
						<div>
							<div className="plan-header ml-5">
								{_get(currentPlan, 'services.title')}
							</div>
							<ul className="sub-txt">
								{_get(currentPlan, 'services.points') &&
									Object.values(_get(currentPlan, 'services.points')).map(
										(item, index) => {
											return <li key={index}>{item}</li>;
										}
									)}
							</ul>
						</div>
					) : isMonthly && !_get(currentPlan, 'services.hideActive') ? (
						<div>
							<div className="plan-header ml-5">
								{_get(currentPlan, 'services.title')}
							</div>
							<ul className="sub-txt">
								{_get(currentPlan, 'services.points') &&
									Object.values(_get(currentPlan, 'services.points')).map(
										(item, index) => {
											return <li key={index}>{item}</li>;
										}
									)}
							</ul>
						</div>
					) : null}
					{_get(currentPlan, 'asset_pairs') ? (
						<div>
							<div className="plan-header ml-5">
								{_get(currentPlan, 'asset_pairs.title')}
							</div>
							<ul className="sub-txt">
								{Object.values(_get(currentPlan, 'asset_pairs.points')).map(
									(item, index) => {
										return <li key={index}>{item}</li>;
									}
								)}
							</ul>
						</div>
					) : null}
					{_get(currentPlan, 'integration') ? (
						<div>
							<div className="plan-header ml-5">
								{_get(currentPlan, 'integration.title')}
							</div>
							<ul className="sub-txt">
								{Object.values(_get(currentPlan, 'integration.points')).map(
									(item, index) => {
										return <li key={index}>{item}</li>;
									}
								)}
							</ul>
						</div>
					) : null}
				</div>
				<div className="amount-wrapper">
					<div className={`amount-container`}>
						{type === 'fiat' ? (
							<div>
								<p className="dollor-size">Apply</p>
							</div>
						) : isMonthly ? (
							<div>
								<p className="dollor-size">
									${_get(priceData[type], 'month.price')}
								</p>
								<p>per month</p>
							</div>
						) : (
							<div>
								<p className="dollor-size">
									${_get(priceData[type], 'year.price')}
								</p>
								<p>per year</p>
							</div>
						)}
					</div>
					{cloudPlanDetails && (
						<div
							className="radio-container"
							onClick={() => onHandleSelectedType(type)}
						>
							{selectedType === type ? (
								<div>
									<CheckOutlined className={'selected-plan'} />
									<div className="selected-status">SELECTED</div>
								</div>
							) : (
								<div>
									<div className="de-select-status"></div>
									<div className="de-select-status-txt">Select</div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PlanStructure;
