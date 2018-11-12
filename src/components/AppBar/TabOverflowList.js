import React from 'react';
import ReactSVG from 'react-svg';

import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

const TabOverflowList = ({ selectedTabs, activeTabs, handleOverflow }) => {
    return (
        <div className="app-bar-add-tab-menu">
            <div className="app-bar-tab-overflow-content">
                {Object.keys(selectedTabs).map((pair, index) => {
                    let menu = selectedTabs[pair];
                    return (
                        <div
                            key={index}
                            className="app-bar-add-tab-content-list d-flex align-items-center"
                            onClick={() => handleOverflow(pair)}>
                            {activeTabs[pair]
                                ? <ReactSVG path={ICONS.BLACK_CHECK} wrapperClassName="app-bar-tab-setting" />
                                : <div className="app-bar-tab-setting"> </div>
                            }
                            <ReactSVG path={ICONS[`${menu.pair_base.toUpperCase()}_ICON`]} wrapperClassName="app-bar-add-tab-icons" />
                            <div className="app_bar-pair-font">{STRINGS[`${menu.pair_base.toUpperCase()}_FULLNAME`]}: </div>
                            <div className="title-font"> T 65,800,000 </div>
                            <div className="app-price-diff-red app-bar-price_difference app_bar-pair-font"> -120,000 </div>
                            <div className="app-price-diff-red title-font app_bar-pair-font"> (-1.71%) </div>
                        </div>
                    )
                }
                )}
            </div>
        </div>
    );
};

export default TabOverflowList;