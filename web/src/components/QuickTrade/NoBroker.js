import React from 'react';
import { Link } from 'react-router';
import { Button, Coin, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';

export const NoBrokerSection = ({ coinData }) => {
    const { icon_id, fullname, display_name, symbol } = coinData;

    const getLink = (linkUrl, linkText) => {
        return (
            <div className="blue-link pointer underline-text">
                <Link to={linkUrl}>
                    {linkText}
                </Link>
            </div>
        );
    };
    return (
        <div className="trade-details-wrapper">
            <div className="trade-details-content">
                <div className='d-flex align-items-center'>
                    <div>
                        <Coin iconId={icon_id} type="CS12" />
                    </div>
                    <div className="ml-3">
                        {getLink(
                            `/assets/coin/${symbol?.toLowerCase()}`,
                            STRINGS.formatString(
                                STRINGS['QUICK_TRADE_COMPONENT.COIN_NAME'],
                                fullname,
                                display_name
                            )
                        )}
                        <div className="light-grey-title">
                            {STRINGS['QUICK_TRADE_COMPONENT.SOURCE_TEXT_NETWORK']}
                        </div>
                    </div>
                </div>
                <div className="main-coin-wrapper mt-8">
                    <Coin iconId={icon_id} type="CS13" />
                </div>
                <div>
                    <div className='grey-title'>
                        {STRINGS['ASSET_INFO']}
                    </div>
                    {getLink(
                        "/assets",
                        STRINGS.formatString(
                            STRINGS['QUICK_TRADE_COMPONENT.COIN_INFORMATION'],
                            display_name
                        )
                    )}
                </div>
                <div className='mt-4'>
                    <div className='grey-title'>
                        {STRINGS['TAKER_FEES_APPLIED']}
                    </div>
                    {getLink(
                        "fees-and-limits",
                        STRINGS['FEES_AND_LIMITS.COIN_PAGE_LINK']
                    )}
                </div>
            </div>
        </div>
    )
};