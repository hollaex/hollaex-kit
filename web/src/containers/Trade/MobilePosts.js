import React from 'react';
import classnames from 'classnames';
import ReactSvg from 'react-svg';
import moment from 'moment';

import TradeBlock from './components/TradeBlock';
// import { ActionNotification, IconTitle } from '../../components';
import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';

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
                {
                    <div>
                        <div>
                            <div className="d-flex my-2">
                                <div className="mr-2 ml-1">
                                    <ReactSvg path={ICONS.TRADE_ANNOUNCEMENT} wrapperClassName="trade_post_icon" />
                                </div>
                                <div>
                                    <div className="post_header">{STRINGS.TRADE_POSTS.ANNOUNCEMENT}</div>
                                    <div className="post-content">{moment().format('MMMM DD, YYYY')}</div>
                                    <div className="post-content">
                                        {STRINGS.TRADE_POSTS.ANNOUNCEMNT_TXT}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="d-flex my-2">
                                <div className="mr-2 ml-1">
                                    <ReactSvg path={ICONS.TRADE_ANNOUNCEMENT} wrapperClassName="trade_post_icon" />
                                </div>
                                <div>
                                    <div className="post_header">{STRINGS.TRADE_POSTS.ANNOUNCEMENT}</div>
                                    <div className="post-content">{moment().format('MMMM DD, YYYY')}</div>
                                    <div className="post-content">
                                        {STRINGS.TRADE_POSTS.ANNOUNCEMNT_TXT_1}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </TradeBlock>
        </div>
    );
}

export default MobilePosts;
