import React from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

const AddTabList = ({ symbols, pairs, selectedTabs, selectedTabMenu, onAddTabClick, onTabChange }) => {
    const tabMenu = {};
    Object.keys(pairs).map(key => {
        let temp = pairs[key];
        if (temp && temp.pair_base === selectedTabMenu){
            tabMenu[key] = temp;
        }
        return key;
    });

    return (
        <div className="app-bar-add-tab-menu">
            <div className="app-bar-tab-menu d-flex justify-content-between">
                <div className="d-flex">
                    {symbols.map((symbol, index) =>
                        <div
                            key={index}
                            className={classnames("app-bar-tab-menu-list", { 'active-tab': symbol === selectedTabMenu })}
                            onClick={() => onAddTabClick(symbol)}>
                            {symbol.toUpperCase()}
                        </div>
                    )}
                </div>
                <div>
                    <ReactSVG
                        path={ICONS.TAB_SETTING}
                        wrapperClassName="app-bar-tab-setting" />
                </div>
            </div>
            <div className="app-bar-add-tab-content">
                {Object.keys(tabMenu).map((pair, index) => {
                    let menu = tabMenu[pair];
                    return (
                        <div key={index} className="app-bar-add-tab-content-list d-flex align-items-center">
                            <div onClick={() => onTabChange(pair)}>
                                {selectedTabs[pair] 
                                    ? <ReactSVG path={ICONS.TAB_MINUS} wrapperClassName="app-bar-tab-setting" />
                                    : <ReactSVG path={ICONS.TAB_PLUS} wrapperClassName="app-bar-tab-setting" />
                                }
                            </div>
                            <ReactSVG path={ICONS[`${menu.pair_base.toUpperCase()}_ICON`]} wrapperClassName="app-bar-add-tab-icons" />
                            <div className="app_bar-pair-font">{STRINGS[`${menu.pair_base.toUpperCase()}_FULLNAME`]}: </div>
                            <div className="title-font"> T 65,800,000 </div>
                            <div className="app-price-diff-red app-bar-price_difference app_bar-pair-font"> -120,000 </div>
                            <div className="app-price-diff-red title-font app_bar-pair-font"> (-1.71%) </div>
                        </div>
                    )}
                )}
            </div>
        </div>
    );
};

export default AddTabList;