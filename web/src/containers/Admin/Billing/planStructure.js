import React from 'react';
import { Radio } from 'antd';
// import _get from 'lodash/get';
// import { Divider } from 'antd';

export const planData = {
	basic: {
		title: 'Basic',
		description: 'Get started fast with a basic test exchange',
		icon: 'BASIC_PLAN_BACKGROUND',
		isPopular: false,
		section: [
			{
				title: 'Cloud',
				points: ['Cloud exchange server hosting'],
			},
		],
		services: {
			title: 'Limited features',
			points: [
				'Theme customization',
				'Localization',
				'Custom domain',
				'Add HollaEx plugins',
				'Add custom plugins',
				'Download exchange logs',
				'Full exchange backup',
			],
			hideOnMonthly: false,
			hideActive: false,
		},
		amount: {
			yearly: 75,
			discount: '25%',
			monthly: 100,
			share: '50%',
		},
	},
	crypto: {
		title: 'Crypto Pro',
		description:
			'For those looking to start a crypto-to-crypto exchange business',
		icon: 'CRYPTO_PRO_PLAN_BACKGROUND',
		isPopular: true,
		section: [
			{
				title: 'Cloud',
				points: ['Cloud exchange server hosting'],
			},
		],
		services: {
			title: 'Full features',
			points: [
				'Theme customization',
				'Localization',
				'Custom domain',
				'Add HollaEx plugins',
				'Add custom plugins',
				'Add custom GitHub repo',
				'Team management & roles',
				'Download exchange logs',
				'Full exchange backup',
				'Landing page (homepage)',
				'Remove HollaEx badge',
				'Referral affiliate link',
				'Crypto chat box',
			],
			hideOnMonthly: false,
			hideActive: false,
		},
		asset_pairs: {
			title: 'Asset and pairs',
			points: ['One free custom crypto coin & pair'],
		},
		amount: {
			yearly: 210,
			discount: '30%',
			monthly: 300,
			share: '25%',
		},
	},
	fiat: {
		title: 'Fiat Ramp',
		description:
			'For those that want to start a fiat to crypto exchange that have a bank or fiat payment processor',
		icon: 'FIAT_MASTER_PLAN_BACKGROUND',
		isPopular: false,
		section: [
			{
				title: 'Cloud',
				points: ['Cloud exchange server hosting'],
			},
		],
		services: {
			title: 'Full features',
			points: [
				'Theme customization',
				'Localization',
				'Custom domain',
				'Add HollaEx plugins',
				'Add custom plugins',
				'Add custom GitHub repo',
				'Full management & system',
				'Download exchange logs',
				'Full exchange backup',
				'Landing page (homepage)',
				'Remove HollaEx badge',
				'Referral affiliate link',
				'Crypto chat box',
			],
			hideOnMonthly: false,
			hideActive: false,
		},
		asset_pairs: {
			title: 'Asset and pairs',
			points: [
				'One free custom crypto coin & pair',
				'One free fiat coin & pair',
			],
		},
		integration: {
			title: 'Fiat integration & KYC system',
			points: [
				'Add fiat bank or payment ramp',
				'Know your customer (KYC) system',
			],
		},
		amount: {
			yearly: 850,
			discount: '35%',
			monthly: 1000,
			share: '15%',
		},
	},
};

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
}) => {
	const { type, background } = typeData;
	// let currentPlan = planData[type];
	// let planPriceData = priceData[type];
	return (
		<>
			<div className="plan-container">
				<div className={`popular-header-${type}`}>
					{type === 'crypto' ? 'MOST POPULAR' : ''}
				</div>
				<div className="inner-container">
					<div
						className="header-container"
						style={{ backgroundImage: `url(${background})` }}
					>
						<h2 className="text-center">{type}</h2>
						<h6 className="text-center">
							Get started fast with a basic test exchange
						</h6>
					</div>
					<div>
						<div>
							<h6>Cloud</h6>
							<p>cloud exchange server hosting</p>
						</div>
						<div>
							<h6>Full features</h6>
							<p>Theme customization</p>
							<p>Localization</p>
							<p>Custom domain</p>
							<p>Add HollaEx plugins</p>
							<p>Add custom plugins</p>
							<p>Add Github repo</p>
							<p>Team Management & Roles</p>
							<p>Download Exchange logs</p>
							<p>Full exchange Backup</p>
						</div>
						<div>
							<p>Assets and pairs</p>
							<p>One free custom crypto coin & pair</p>
						</div>

						<div className="amount-container">
							<p className="dollor-size">$700</p>
							<p>per month</p>
						</div>

						<div className="radio-container">
							<Radio value={1}></Radio>
						</div>
					</div>
				</div>
			</div>
		</>
		// <div
		//     className={
		//         (selectedType === type || planType !== 'ConfigurePlan')
		//             ? "selected-popular-container popular-container"
		//             : "popular-container"
		//     }
		// >
		//     <div className="popular-label">
		//         {!showConfigIcon
		//             ? <div className={`popular-header-${type}`}>{type === "crypto" ? "MOST POPULAR" : ""}</div>
		//             : null
		//         }
		//     </div>
		//     <div
		//         className={
		//             selectedType === type || planType !== 'ConfigurePlan'
		//                 ? "selected-content-wrapper"
		//                 : "content-wrapper"
		//         }
		//     >
		//         <div className="content">
		//             {showConfigIcon
		//                 ? <img
		//                     src={'BLUE_COG_SETTINGS_ICON'}
		//                     className="cloud-plan-img"
		//                     alt="plan"
		//                     onClick={() => handleConfigPlan('ConfigurePlan')}
		//                 />
		//                 : null
		//             }
		//             <div className="flex-space-wrapper">
		//                 <div>
		//                     <div className="plan-img" style={{ backgroundImage: `url(${_get(currentPlan, 'icon')})` }}>
		//                         <div className="title">
		//                             {_get(currentPlan, 'title')}
		//                         </div>
		//                         <div className="small-text">
		//                             {_get(currentPlan, 'description')}
		//                         </div>
		//                         {/* <img
		//                     src={currentPlan.icon}
		//                     alt="Basic coin drop"
		//                 /> */}
		//                     </div>
		//                     <div className="center-wrapper">
		//                         <Divider />
		//                         <div className="inner-content">
		//                             {_get(currentPlan, 'section') && _get(currentPlan, 'section').map((subContent, index) => {
		//                                 return (
		//                                     <div key={index}>
		//                                         <div>
		//                                             <div className="sub-header">
		//                                                 {subContent.title}
		//                                             </div>
		//                                             <ul className="sub-txt">
		//                                                 {subContent.points.map((val, index) => {
		//                                                     return <li key={index}>{val}</li>
		//                                                 })}
		//                                             </ul>
		//                                         </div>
		//                                     </div>
		//                                 )
		//                             })
		//                             }
		//                             {!isMonthly && !_get(currentPlan, 'services.hideOnMonthly')
		//                                 ? <div>
		//                                     <div className="sub-header">
		//                                         {_get(currentPlan, 'services.title')}
		//                                     </div>
		//                                     <ul className="sub-txt">
		//                                         {_get(currentPlan, 'services.points') && Object.values(_get(currentPlan, 'services.points')).map((item, index) => {
		//                                             return <li key={index}>{item}</li>
		//                                         })}
		//                                     </ul>
		//                                 </div>
		//                                 : isMonthly && !_get(currentPlan, 'services.hideActive')
		//                                     ?
		//                                     <div>
		//                                         <div className="sub-header">
		//                                             {_get(currentPlan, 'services.title')}
		//                                         </div>
		//                                         <ul className="sub-txt">
		//                                             {_get(currentPlan, 'services.points') && Object.values(_get(currentPlan, 'services.points')).map((item, index) => {
		//                                                 return <li key={index}>{item}</li>
		//                                             })}
		//                                         </ul>
		//                                     </div>
		//                                     : null
		//                             }
		//                             {_get(currentPlan, 'asset_pairs')
		//                                 ?
		//                                 <div>
		//                                     <div className="sub-header">
		//                                         {_get(currentPlan, 'asset_pairs.title')}
		//                                     </div>
		//                                     <ul className="sub-txt">
		//                                         {Object.values(_get(currentPlan, 'asset_pairs.points')).map((item, index) => {
		//                                             return <li key={index}>{item}</li>
		//                                         })}
		//                                     </ul>
		//                                 </div>
		//                                 : null
		//                             }
		//                             {_get(currentPlan, 'integration')
		//                                 ?
		//                                 <div>
		//                                     <div className="sub-header">
		//                                         {_get(currentPlan, 'integration.title')}
		//                                     </div>
		//                                     <ul className="sub-txt">
		//                                         {Object.values(_get(currentPlan, 'integration.points')).map((item, index) => {
		//                                             return <li key={index}>{item}</li>
		//                                         })}
		//                                     </ul>
		//                                 </div>
		//                                 : null
		//                             }
		//                         </div>
		//                     </div>
		//                 </div>
		//                 <div className="center-wrapper">
		//                     <Divider />
		//                     <div>
		//                         {isMonthly && _get(currentPlan, 'title') !== 'Fiat Ramp'
		//                             ?
		//                             <div className="amount-wrapper">
		//                                 <div className="amount-label">${`_get(planPriceData, 'month.price')`}</div>
		//                                 <div className="small-text">per month</div>
		//                             </div>
		//                             :
		//                             <div className="amount-wrapper">
		//                                 {_get(currentPlan, 'title') !== 'Fiat Ramp' ?
		//                                     <div>
		//                                         <div className="amount-label">${`_get(planPriceData, 'year.price')`}</div>
		//                                         <div className="small-text">per year</div>
		//                                     </div>
		//                                     : <div className="amount-label">Apply</div>
		//                                 }
		//                                 {/* <div className="green-label save-annual">Save {currentPlan.amount.discount} annually</div> */}
		//                             </div>
		//                         }
		//                     </div>
		//                     <Divider />

		//                     <div className="select-btn">
		//                         {(planType === 'ConfigurePlan'
		//                             && !exchange.is_paid)
		//                             ? <div className="d-flex flex-direction-column">
		//                                 {selectedType === type
		//                                     ? <Fragment>
		//                                         <img src={'VERIFICATION_TICK_ICON'} className="requirement-icon" alt="status" />
		//                                         {/* <Button
		//                                         type='primary'
		//                                         disabled={exchange.is_running}
		//                                         onClick={() => handleSelect(type)}
		//                                     > */}
		//                                         <div className="selected-status">SELECTED</div>
		//                                     </Fragment>
		//                                     : <Fragment>
		//                                         <div className="de-select-status" onClick={() => handleSelect(type)}></div>
		//                                         {/* {(!isMonthly || planPriceData.month.price)
		//                                         ? <div className="de-select-status" onClick={() => handleSelect(type)}></div>
		//                                         : <div className="de-select-status no-cursor" ></div>
		//                                     } */}
		//                                         <div className="de-select-status-txt">Select</div>
		//                                     </Fragment>
		//                                 }
		//                             </div>
		//                             : null
		//                         }
		//                     </div>
		//                 </div>
		//             </div>
		//         </div>
		//     </div>
		// </div>
	);
};

export default PlanStructure;
