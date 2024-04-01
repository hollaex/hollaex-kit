import React from 'react';
import { ReactSVG } from 'react-svg';
import _get from 'lodash/get';
import { CheckOutlined } from '@ant-design/icons';
import { STATIC_ICONS } from 'config/icons';

const DIYPlanStructure = ({
	dashExchange,
	planData,
	type,
	isMonthly,
	priceData,
	selectedType,
	className,
	onHandleSelectedType,
	// planType,
	// showConfigIcon = false,
	// handleConfigPlan,
	// handleSelect,
	// setSelectedType,
}) => {
	let currentPlan = planData[type];

	return (
		<div className={`${className} diy-plan-container`}>
			<div className="plan-container-wrapper">
				<div className={`popular-header-${type}`}>
					{type === 'boost' ? 'MOST POPULAR' : ''}
				</div>
				<div className="header-wrapper">
					<ReactSVG
						src={`${
							type === 'diy'
								? STATIC_ICONS['DIY_ICON']
								: STATIC_ICONS['DIY_FIRE_MAN_ICON']
						}`}
						className="diy-image"
					/>
					<div>
						<h2>{currentPlan?.title}</h2>
						<h6>{currentPlan.description}</h6>
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
					<div className="amount-container">
						{type === 'boost' ? (
							<div>
								<p className="dollor-size">
									${_get(priceData[type], 'year.price')}
								</p>
								<p>per year</p>
							</div>
						) : (
							<div>
								<p className="dollor-size">Free</p>
							</div>
						)}
					</div>
					<div
						className={`radio-container ${
							dashExchange?.plan === 'boost' ? 'pointer-none' : ''
						}`}
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
				</div>
			</div>
		</div>
	);
};

export default DIYPlanStructure;
