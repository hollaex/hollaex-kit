import React from 'react';
import _get from 'lodash/get';
import { CheckOutlined } from '@ant-design/icons';
import { planData } from './generalContent';

const PlanStructure = ({
	exchange,
	typeData = {},
	isMonthly,
	planType,
	showConfigIcon = false,
	handleConfigPlan,
	handleSelect,
	priceData,
	selectedType,
	setSelectedType,
	className,
	dataType,
}) => {
	const { type, background, name } = typeData;
	const planPriceData = priceData[dataType.type];
	let currentPlan = planData[typeData.type];

	return (
		<div className={`${className} plan-container`}>
			<div className="plan-container-wrapper">
				<div className={`popular-header-${type}`}>
					{type === 'crypto' ? 'MOST POPULAR' : ''}
				</div>
				<div>
					<div className={`header-container-${type}`}></div>
					<div
						className="header-container"
						style={{ backgroundImage: `url(${background})` }}
					>
						<h2 className="type-center">{name}</h2>
						<h6 className="text-center">{planData[type].description}</h6>
					</div>
				</div>
				<div className="inner-container">
					<div>
						{/* <ul>
							<h6>Cloud</h6>
							<li>Cloud exchange server hosting</li>
						</ul>

						<ul>
							<h6>Full Features</h6>
							<li>Theme customization</li>
							<li>Localization</li>
							<li>Custom domain</li>
							<li>Add HollaEx plugins</li>
							<li>Add custom plugins</li>
							<li>Add Github repo</li>
							<li>Team Management & Roles</li>
							<li>Download Exchange logs</li>
							<li>Full exchange Backup</li>
						</ul>

						<ul>
							<h6>Assets and pairs</h6>
							<li>One free custom crypto coin & pair</li>
						</ul> */}
						<div className="center-wrapper">
							<div className="inner-content">
								{_get(currentPlan, 'section') &&
									_get(currentPlan, 'section').map((subContent, index) => {
										return (
											<div key={index}>
												<div>
													<div className="plan-header ml-5">
														{subContent.title}
													</div>
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
											{Object.values(
												_get(currentPlan, 'asset_pairs.points')
											).map((item, index) => {
												return <li key={index}>{item}</li>;
											})}
										</ul>
									</div>
								) : null}
								{_get(currentPlan, 'integration') ? (
									<div>
										<div className="plan-header ml-5">
											{_get(currentPlan, 'integration.title')}
										</div>
										<ul className="sub-txt">
											{Object.values(
												_get(currentPlan, 'integration.points')
											).map((item, index) => {
												return <li key={index}>{item}</li>;
											})}
										</ul>
									</div>
								) : null}
							</div>
						</div>

						<div className={`${typeData.type}-amount-container`}>
							{type === 'fiat' ? (
								<div>
									<p className="dollor-size">Apply</p>
								</div>
							) : isMonthly ? (
								<div>
									<p className="dollor-size">
										${_get(planPriceData, 'month.price')}
									</p>
									<p>per month</p>
								</div>
							) : (
								<div>
									<p className="dollor-size">
										${_get(planPriceData, 'year.price')}
									</p>
									<p>per year</p>
								</div>
							)}
						</div>
						<div
							className="radio-container"
							onClick={() => setSelectedType(type)}
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
		</div>
	);
};

export default PlanStructure;
