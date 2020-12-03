import React from 'react';
import classnames from 'classnames';
// import moment from 'moment';

import SummaryBlock from './components/SummaryBlock';
import TraderAccounts from './components/TraderAccounts';
// import RewardsBonus from './components/RewardsBonus';
import AccountAssets from './components/AccountAssets';
// import TradingVolume from './components/TradingVolume';
import AccountDetails from './components/AccountDetails';
import Markets from './components/Markets';
// import AccountWaveAuction from './components/AccountWaveAuction';

import {
	BASE_CURRENCY,
	DEFAULT_COIN_DATA,
	SHOW_TOTAL_ASSETS,
} from '../../config/constants';
// import { formatAverage, formatBaseAmount } from '../../utils/currency';
import STRINGS from '../../config/localizedStrings';

const MobileSummary = ({
	user,
	pairs,
	coins,
	config,
	activeTheme,
	selectedAccount,
	balance,
	chartData,
	logout,
	totalAssets,
	lastMonthVolume,
	traderAccTitle,
	onFeesAndLimits,
	onUpgradeAccount,
	onAccountTypeChange,
	onInviteFriends,
	verification_level,
	onStakeToken,
	affiliation,
}) => {
	const { fullname } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
	// const Title = STRINGS.formatString(STRINGS["SUMMARY.LEVEL_OF_ACCOUNT"],verification_level);
	return (
		<div
			className={classnames(
				'flex-column',
				'd-flex',
				'justify-content-between',
				'f-1',
				'apply_rtl'
			)}
		>
			<div className="summary-section_1 trader-account-wrapper d-flex w-100">
				<SummaryBlock title={traderAccTitle} wrapperClassname="w-100">
					<TraderAccounts
						user={user}
						coins={coins}
						pairs={pairs}
						config={config}
						logout={logout}
						activeTheme={activeTheme}
						onInviteFriends={onInviteFriends}
						onFeesAndLimits={onFeesAndLimits}
						onUpgradeAccount={onUpgradeAccount}
						verification_level={verification_level}
					/>
				</SummaryBlock>
			</div>
			{/*<div className="summary-section_1 requirement-wrapper d-flex w-100">
				<SummaryBlock
					title={STRINGS["SUMMARY.URGENT_REQUIREMENTS"]}
					wrapperClassname="w-100"
				>
					<RewardsBonus
						coins={coins}
						user={user}
						balance={balance}
						lastMonthVolume={lastMonthVolume}
						affiliation={affiliation}
						onUpgradeAccount={onUpgradeAccount}
						contentClassName="requirements-content"
					/>
				</SummaryBlock>
			</div> */}
			<div className="assets-wrapper w-100">
				<SummaryBlock
					title={STRINGS['SUMMARY.ACCOUNT_ASSETS']}
					secondaryTitle={
						SHOW_TOTAL_ASSETS && BASE_CURRENCY ? (
							<span>
								<span className="title-font">{totalAssets}</span>
								{` ${fullname}`}
							</span>
						) : null
					}
				>
					<AccountAssets
						user={user}
						chartData={chartData}
						totalAssets={totalAssets}
						balance={balance}
						coins={coins}
						activeTheme={activeTheme}
					/>
				</SummaryBlock>
			</div>
			<div className="w-100">
				<SummaryBlock
					stringId="SUMMARY.MARKETS"
					title={STRINGS['SUMMARY.MARKETS']}
				>
					<Markets
						user={user}
						coins={coins}
						pairs={pairs}
						activeTheme={activeTheme}
					/>
				</SummaryBlock>
			</div>
			{/*<div className="trading-volume-wrapper w-100">
				<SummaryBlock
					title={
						IS_XHT
							? STRINGS["SUMMARY.XHT_WAVE_AUCTION"]
							: STRINGS["SUMMARY.TRADING_VOLUME"]
					}
					secondaryTitle={
						IS_XHT ? (
							''
						) : (
							<span>
								<span className="title-font">
									{` ${formatAverage(formatBaseAmount(lastMonthVolume))}`}
								</span>
								{` ${fullname} ${STRINGS.formatString(
									STRINGS["SUMMARY.NOMINAL_TRADING_WITH_MONTH"],
									moment()
										.subtract(1, 'month')
										.startOf('month')
										.format('MMMM')
								).join('')}`}
							</span>
						)
					}
				>
					{IS_XHT ? (
						<AccountWaveAuction user={user} />
					) : (
						<TradingVolume user={user} />
					)}
				</SummaryBlock>
			</div>*/}
			<SummaryBlock
				title={STRINGS['SUMMARY.ACCOUNT_DETAILS']}
				secondaryTitle={traderAccTitle}
				wrapperClassname="w-100"
			>
				<AccountDetails
					coins={coins}
					config={config}
					pairs={pairs}
					user={user}
					balance={balance}
					activeTheme={activeTheme}
					selectedAccount={selectedAccount}
					onAccountTypeChange={onAccountTypeChange}
					onFeesAndLimits={onFeesAndLimits}
					onUpgradeAccount={onUpgradeAccount}
					verification_level={verification_level}
				/>
			</SummaryBlock>
		</div>
	);
};

export default MobileSummary;
