import React from 'react';
import classnames from 'classnames';
import ReactSvg from 'react-svg';

import TradeBlock from './components/TradeBlock';
// import { ActionNotification, IconTitle } from '../../components';
import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';
import { isLoggedIn } from '../../utils/token';

const MobilePosts = () => {
    return (
        <div
            className={classnames(
                'trade_post-wrapper',
                'flex-column',
                'd-flex',
                'justify-content-between',
                'f-1',
                'apply_rtl'
            )}
        >
            <TradeBlock
                title={STRINGS.TRADE_TAB_POSTS}
                className="f-1"
            >
                {isLoggedIn()
                    ? <div>{''}</div>
                    : <div className="d-flex my-2 trade_announcement">
                        <div className="mr-2">
                            <ReactSvg path={ICONS.TRADE_ANNOUNCEMENT} wrapperClassName="trade_post_icon" />
                        </div>
                        <div>
                            <div className="post_header">{STRINGS.TRADE_POSTS.ANNOUNCEMENT}</div>
                            <div>
                                {STRINGS.formatString(
                                    STRINGS.TRADE_POSTS.DEFAULT_ANNOUNCEMENT,
                                    <span className="blue-link ml-1">{STRINGS.TRADE_POSTS.LEARN_MORE}</span>
                                )}
                            </div>
                        </div>
                    </div>
                }
            </TradeBlock>
        </div>
    );
}

export default MobilePosts;
