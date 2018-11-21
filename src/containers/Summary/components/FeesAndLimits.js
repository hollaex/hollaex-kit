import React from 'react';

import LimitsBlock from './LimitsBlock';
import FeesBlock from './FeesBlock';
import { IconTitle } from '../../../components';
import { SUMMMARY_ICON } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';

const FeesAndLimits = (props) => {
    const { tradingAccount, fees, limits, verification_level, pairs } = props.data;
    return (
        <div className="fee-limits-wrapper">
            <IconTitle
                text={`${STRINGS.SUMMARY.FEES_AND_LIMIT} ${tradingAccount.fullName}`}
                iconPath={SUMMMARY_ICON[tradingAccount.symbol.toUpperCase()]}
                textType="title"
                underline={true}
            />
            <div className="content-txt">
                <div className="mt-3 mb-3">
                    <div>{STRINGS.SUMMARY.FEES_AND_LIMIT_TXT_1}</div>
                    <div className="mt-3">{STRINGS.SUMMARY.FEES_AND_LIMIT_TXT_2}</div>
                </div>
                <div>
                    <div className="content-title">{STRINGS.SUMMARY.DEPOSIT_WITHDRAWAL_ALLOWENCE}</div>
                    <LimitsBlock
                        limits={limits}
                        level={verification_level} />
                </div>
                <div>
                    <div className="content-title">{STRINGS.SUMMARY.TRADING_FEE_STRUCTURE}</div>
                    <FeesBlock
                        fees={fees}
                        level={verification_level}
                        pairs={pairs} />
                </div>
            </div>
        </div>
    );
};

export default FeesAndLimits;