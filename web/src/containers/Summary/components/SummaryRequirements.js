import React from 'react';
import { ReactSVG } from 'react-svg';
import classnames from 'classnames';
import { Link } from 'react-router';

import { Button } from '../../../components';
import { IS_XHT } from 'config/constants';
import STRINGS from '../../../config/localizedStrings';
// import { getBonusRequirements } from './utils';
import withConfig from 'components/ConfigProvider/withConfig';

const createMarkup = (msg) => {
	return { __html: msg };
};

// const SucessStatus = ({ isAccountDetails, icons: ICONS = {} }) => (
// 	<div className="d-flex">
// 		{isAccountDetails && (
// 			<div className="requirement-verified mr-2">
// 				{STRINGS["USER_VERIFICATION.COMPLETE"].toUpperCase()}
// 			</div>
// 		)}
// 		<ReactSVG
// 			src={ICONS["GREEN_CHECK"]}
// 			className="requirement-stauts"
// 		/>
// 	</div>
// );

// const IncompleteStatus = ({ isAccountDetails, icons: ICONS = {} }) => (
// 	<div className="d-flex">
// 		{isAccountDetails ? (
// 			<div className="requirement-incomplete mr-2">
// 				{STRINGS["USER_VERIFICATION.INCOMPLETED"].toUpperCase()}
// 			</div>
// 		) : (
// 				<ReactSVG
// 					src={ICONS["VERIFICATION_INCOMPLETE"]}
// 					className="requirement-stauts"
// 				/>
// 			)}
// 	</div>
// );

// const PendingStatus = ({ isAccountDetails, icons: ICONS = {} }) => (
// 	<div className="d-flex">
// 		<ReactSVG
// 			src={ICONS["VERIFICATION_PENDING"]}
// 			className="requirement-stauts"
// 		/>
// 	</div>
// );

// const RejectedStatus = ({ isAccountDetails, icons: ICONS = {} }) => (
// 	<div className="d-flex">
// 		<ReactSVG
// 			src={ICONS["VERIFICATION_REJECTED"]}
// 			className="requirement-stauts"
// 		/>
// 	</div>
// );

// const checkMonth = (currentDate, month) => {
// 	const diffMonth = moment().diff(moment(currentDate), 'months');
// 	return diffMonth >= month;
// };

export const getRequirements = (user, level, balance = {}, coins) => {
	const { address, phone_number, id_data = {} } = user.userData;
	// const bank_verified = checkBankVerification(bank_account, id_data);
	// const { symbol = '' } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
	const xht_balance = balance.xht_balance || 0;
	const identity = address.country
		? id_data.status && id_data.status === 3
			? 3
			: 1
		: 1;
	const verificationObj = {
		level_1: {
			1: {
				title: STRINGS['SUMMARY.EMAIL_VERIFICATION'],
				completed: user.email ? true : false,
				status: user.email ? 3 : 0,
			},
		},
		level_2: {
			1: {
				title: STRINGS.formatString(
					STRINGS['SUMMARY.TRADE_OVER_XHT'],
					'$ 3,000'
				),
				completed: false,
			},
			2: {
				title: STRINGS.formatString(STRINGS['SUMMARY.XHT_IN_WALLET'], '5,000'),
				completed: xht_balance >= 5000,
			},
		},
		level_3: {
			1: {
				title: STRINGS['USER_VERIFICATION.TITLE_USER_DOCUMENTATION'],
				completed: identity === 3 ? true : false,
				status: identity,
			},
			2: {
				title: STRINGS['SUMMARY.DOCUMENTS'],
				completed: id_data.status === 3,
				status: id_data.status,
			},
			3: {
				title: STRINGS['USER_VERIFICATION.TITLE_MOBILE'],
				completed: !!phone_number,
				status: phone_number ? 3 : 0,
			},
		},
		level_4: {
			1: {
				title: STRINGS.formatString(
					STRINGS['SUMMARY.TRADE_OVER_XHT'],
					'$10,000'
				),
				completed: false,
			},
			2: {
				title: STRINGS.formatString(STRINGS['SUMMARY.XHT_IN_WALLET'], '10,000'),
				completed: xht_balance >= 10000,
			},
		},
		level_5: {
			1: {
				title: STRINGS.formatString(
					STRINGS['SUMMARY.HAP_TEXT'],
					<a
						className="blue-link pointer"
						href="https://forms.gle/JsCjUqMEEkZmoDzj6"
						target="blank"
					>
						{`(${STRINGS['APPLY_HERE']})`}
					</a>
				),
				completed: user.is_hap,
			},
			2: {
				title: STRINGS.formatString(
					STRINGS['SUMMARY.LOCK_AN_EXCHANGE'],
					<a
						className="blue-link pointer"
						href="https://info.hollaex.com/hc/en-us/articles/360040097453-How-can-I-stake-collateralize-HollaEx-Token-XHT"
						target="blank"
					>
						{`(${STRINGS['TRADE_POSTS.LEARN_MORE']})`}
					</a>
				),
				completed: false,
			},
			3: {
				title: STRINGS.formatString(
					STRINGS['SUMMARY.WALLET_SUBSCRIPTION_USERS'],
					<a
						className="blue-link pointer"
						href="https://info.hollaex.com/hc/en-us/articles/360041341013-Vault-subscription"
						target="blank"
					>
						{`(${STRINGS['TRADE_POSTS.LEARN_MORE']})`}
					</a>
				),
				completed: false,
			},
		},
		level_6: {
			1: {
				title: STRINGS.formatString(
					STRINGS['SUMMARY.TRADE_OVER_XHT'],
					'$300,000'
				),
				completed: false,
			},
			2: {
				title: STRINGS.formatString(
					STRINGS['SUMMARY.XHT_IN_WALLET'],
					'100,000'
				),
				completed: xht_balance >= 100000,
			},
		},
		level_7: {
			1: {
				title: STRINGS.formatString(
					STRINGS['SUMMARY.TRADE_OVER_XHT'],
					'$500,000'
				),
				completed: false,
			},
			2: {
				title: STRINGS.formatString(
					STRINGS['SUMMARY.XHT_IN_WALLET'],
					'300,000'
				),
				completed: xht_balance >= 300000,
			},
		},
		level_8: {
			1: {
				title: STRINGS.formatString(
					STRINGS['SUMMARY.TRADE_OVER_XHT'],
					'$600,000'
				),
				completed: false,
			},
			2: {
				title: STRINGS.formatString(
					STRINGS['SUMMARY.XHT_IN_WALLET'],
					'400,000'
				),
				completed: xht_balance >= 400000,
			},
		},
		level_9: {
			1: {
				title: STRINGS.formatString(
					STRINGS['SUMMARY.TRADE_OVER_XHT'],
					'$2,000,000'
				),
				completed: false,
			},
			2: {
				title: STRINGS.formatString(
					STRINGS['SUMMARY.XHT_IN_WALLET'],
					'1,000,000'
				),
				completed: xht_balance >= 1000000,
			},
		},
		level_10: {
			1: {
				title: STRINGS['CONTACT_US_TEXT'],
				completed: false,
			},
		},
	};
	return verificationObj[`level_${level}`] || {};
};

// const getStatusClass = (status_code, completed) => {
// 	switch (status_code) {
// 		case 0:
// 			return 'requirement-not-verified';
// 		case 1:
// 			return 'requirement-pending';
// 		case 2:
// 			return 'requirement-rejected';
// 		case 3:
// 			return 'requirement-verified';
// 		default:
// 			if (status_code === undefined && completed === false) {
// 				return 'requirement-not-verified';
// 			}
// 			return '';
// 	}
// };

// const getAllCompleted = (requirement) => {
// 	return (
// 		Object.keys(requirement).length ===
// 		Object.keys(requirement).filter((key) => requirement[key].completed)
// 			.length
// 	);
// };

// const getStatusIcon = (reqObj, isAccountDetails, icons) => {
// 	if (isAccountDetails) {
// 		return reqObj.completed ? (
// 			<SucessStatus isAccountDetails={isAccountDetails} icons={icons} />
// 		) : (
// 				<IncompleteStatus isAccountDetails={isAccountDetails} icons={icons} />
// 			);
// 	} else {
// 		switch (reqObj.status) {
// 			case 0:
// 				return <IncompleteStatus isAccountDetails={isAccountDetails} icons={icons} />;
// 			case 1:
// 				return <PendingStatus isAccountDetails={isAccountDetails} icons={icons} />;
// 			case 2:
// 				return <RejectedStatus isAccountDetails={isAccountDetails} icons={icons} />;
// 			case 3:
// 				return <SucessStatus isAccountDetails={isAccountDetails} icons={icons} />;
// 			default:
// 				if (reqObj.status === undefined && reqObj.completed === false) {
// 					return <IncompleteStatus isAccountDetails={isAccountDetails} icons={icons} />;
// 				}
// 				return '';
// 		}
// 	}
// };

const SummaryRequirements = ({
	coins,
	user,
	config = {},
	isAccountDetails = false,
	isBonusSection = false,
	contentClassName = '',
	verificationLevel,
	lastMonthVolume,
	onUpgradeAccount,
	balance,
	affiliation,
	icons: ICONS,
}) => {
	const {
		phone_number,
		address,
		id_data = {},
		bank_account = [],
	} = user.userData;
	const selectedLevel = isAccountDetails
		? verificationLevel || user.verification_level
		: 2;
	const accountData = config[selectedLevel] || {};
	// const requirement = isBonusSection
	// 	? getBonusRequirements(user, coins, affiliation)
	// 	: getRequirements(user, selectedLevel, balance, coins);
	// let requirementResolved = getAllCompleted(requirement);
	return (
		<div className="d-flex">
			{!isAccountDetails && !isBonusSection ? (
				<div>
					<ReactSVG
						src={ICONS['VERIFICATION_DOC_STATUS']}
						className="requirement-doc-icon"
					/>
				</div>
			) : null}
			<div
				className={classnames(
					contentClassName,
					'requirements-content-text',
					'summary-content-txt'
				)}
			>
				<div className="my-2">
					<div dangerouslySetInnerHTML={createMarkup(accountData.note)} />
				</div>
				{/* <div className="my-2">
					{Object.keys(requirement).map((step, index) => {
						let reqObj = requirement[step];
						return (
							<div
								key={index}
								className={classnames(
									'd-flex',
									'justify-content-between',
									{
										[getStatusClass(
											reqObj.status,
											reqObj.completed
										)]: !isAccountDetails
									}
								)}
							>
							<div className="requirement-step">{step}. {reqObj.title}</div>
								<div>{getStatusIcon(reqObj, isAccountDetails || isBonusSection, ICONS)}</div>
							</div>
						);
					})}
				</div>*/}
				{!isAccountDetails && !isBonusSection && !user.otp_enabled && (
					<div className="trade-account-link mb-2">
						<Link to="/security">
							{STRINGS['SUMMARY.ACTIVE_2FA_SECURITY'].toUpperCase()}
						</Link>
					</div>
				)}
				{!isAccountDetails &&
				!isBonusSection &&
				!IS_XHT &&
				(!address.country ||
					id_data.status !== 3 ||
					!phone_number ||
					!bank_account.filter((acc) => acc.status === 3).length) ? (
					<div className="trade-account-link mb-2">
						<Link to="/verification">
							{STRINGS['USER_VERIFICATION.GOTO_VERIFICATION'].toUpperCase()}
						</Link>
					</div>
				) : null}
				{IS_XHT && !isBonusSection && !isAccountDetails ? (
					<div className="trade-account-link mb-2">
						<Link to="/wallet">
							{STRINGS['USER_VERIFICATION.GOTO_WALLET'].toUpperCase()}
						</Link>
					</div>
				) : null}
				{selectedLevel !== 1 && !isBonusSection && isAccountDetails ? (
					<div className="mt-2">
						<Button
							label={STRINGS['SUMMARY.REQUEST_ACCOUNT_UPGRADE']}
							// disabled={!requirementResolved}
							onClick={onUpgradeAccount}
						/>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default withConfig(SummaryRequirements);
