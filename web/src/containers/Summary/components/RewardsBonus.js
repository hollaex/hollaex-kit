import React from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';
import { isMobile } from 'react-device-detect';

import SummaryRequirements from './SummaryRequirements';
import { ICONS } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';

const RewardsBonus = ({
    user,
    coins,
    balance,
    affiliation,
    lastMonthVolume,
    onUpgradeAccount
}) => {
    return (
        <div
            className={
                classnames(
                    "account-details-wrapper w-75",
                    { "w-100": isMobile }
                )
            }>
            <div className="d-flex">
                <ReactSVG
                    path={ICONS.BONUS_OFFERING}
                    wrapperClassName='trader-wrapper-icon'
                />
                <div>
                   <div className="requirement-content"> {STRINGS["SUMMARY.COMPLETE_TASK_DESC"]}</div>
                    <div className="mt-2">
                        <a
                            target="blank"
                            className="blue-link pointer font-weight-bold"
                            href="https://info.hollaex.com/hc/en-us/articles/360041337953-Rewards-and-bonuses-in-HollaEx">
                            {STRINGS["TRADE_POSTS.LEARN_MORE"].toUpperCase()}
                        </a>
                    </div>
                </div>
            </div>
            <div className="requirement-header d-flex justify-content-between">
                <div>
                    {STRINGS["SUMMARY.TASKS"]}
                </div>
                <div className="status-header">{STRINGS["STATUS"]}</div>
            </div>
            <div>
                <SummaryRequirements
                    user={user}
                    isBonusSection={true}
                    coins={coins}
                    balance={balance}
                    lastMonthVolume={lastMonthVolume}
                    affiliation={affiliation}
                    onUpgradeAccount={onUpgradeAccount}
                    contentClassName="w-100"
                />
            </div>
        </div>
    )
}

export default RewardsBonus;
