import React from 'react';
import { ReactSVG } from 'react-svg';
import classnames from 'classnames';
import { Link } from 'react-router';

import { Button } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const createMarkup = (msg) => {
	return { __html: msg };
};

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
				completed: !!user.email,
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
				completed: identity === 3,
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

const SummaryRequirements = ({
	user,
	config = {},
	isAccountDetails = false,
	contentClassName = '',
	verificationLevel,
	onUpgradeAccount,
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

	return (
		<div className="d-flex">
			{!isAccountDetails ? (
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
				{!isAccountDetails && !user.otp_enabled && (
					<div className="trade-account-link mb-2">
						<Link to="/security">
							{STRINGS['SUMMARY.ACTIVE_2FA_SECURITY'].toUpperCase()}
						</Link>
					</div>
				)}
				{!isAccountDetails &&
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
				{selectedLevel !== 1 && isAccountDetails ? (
					<div className="mt-2">
						<Button
							label={STRINGS['SUMMARY.REQUEST_ACCOUNT_UPGRADE']}
							onClick={onUpgradeAccount}
						/>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default withConfig(SummaryRequirements);
