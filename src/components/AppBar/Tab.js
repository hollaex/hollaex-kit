import React from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

import { Sortable } from '../Sortable';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

const Tab = ({ pair, tab, activePairTab, onTabClick, onTabChange, items, ...rest }) => {
    return (
        <div
            className={classnames('app_bar-pair-content', 'd-flex', { 'active-tab-pair': activePairTab === tab })}
            {...rest}>
            <div className="app_bar-pair-font d-flex align-items-center justify-content-between" onClick={() => onTabClick(tab)}>
                <div className="app_bar-currency-txt">
                    {STRINGS[`${pair.pair_base.toUpperCase()}_SHORTNAME`]}/{STRINGS[`${pair.pair_2.toUpperCase()}_SHORTNAME`]}:
                </div>
                <div className="title-font ml-1">T 65,800,000</div>
                <div className="app-price-diff-red app-bar-price_difference"> -120,000 </div>
                <div className="app-price-diff-red title-font ml-1">-1.71 %</div>
            </div>
            <div onClick={() => onTabChange(tab)}>
                <ReactSVG
                    path={ICONS.CLOSE_CROSS}
                    wrapperClassName="app-bar-tab-close" />
            </div>
        </div>
    );
};

export default Sortable(Tab);
