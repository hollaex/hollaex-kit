import React from 'react';
import { Link } from 'react-router';

import LimitsBlock from './LimitsBlock';
import FeesBlock from './FeesBlock';
import { IconTitle, Button } from '../../../components';
import { SUMMMARY_ICON, FEES_LIMIT_SITE_URL } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';

const FeesAndLimits = (props) => {
    const { tradingAccount, fees, limits, verification_level, pairs } = props.data;
    const icon = props.activeTheme === 'dark' && SUMMMARY_ICON[`${tradingAccount.symbol.toUpperCase()}_DARK`]
        ? SUMMMARY_ICON[`${tradingAccount.symbol.toUpperCase()}_DARK`]
        : SUMMMARY_ICON[tradingAccount.symbol.toUpperCase()];
    return (
        <div className="fee-limits-wrapper">
            <IconTitle
                text={`${STRINGS.SUMMARY.FEES_AND_LIMIT} ${tradingAccount.fullName}`}
                iconPath={icon}
                textType="title"
                underline={true}
            />
            <div className="content-txt">
                <div className="my-3">
                    <div>{STRINGS.SUMMARY.FEES_AND_LIMIT_TXT_1}</div>
                    <div className="mt-3">
                        {STRINGS.formatString(
                            STRINGS.SUMMARY.FEES_AND_LIMIT_TXT_2,
                            <Link href={FEES_LIMIT_SITE_URL} target="blank" className="fee-limits-link" >
                                {`${STRINGS.APP_TITLE} ${STRINGS.SUMMARY.WEBSITE}`}
                            </Link>
                        )}
                    </div>
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
            <Button className="mt-4" label={STRINGS.BACK_TEXT} onClick={props.onClose} />
        </div>
    );
};

export default FeesAndLimits;