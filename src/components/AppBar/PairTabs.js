import React, { Component } from 'react';
import ReactSVG from 'react-svg';

import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

class PairTabs extends Component {
    state = {
        tabs: [{
            currency: 'btc',
            value: 'T 65,800,000',
            price_difference: '-120,000',
            percentage: '-1.71%'
        }, {
            currency: 'eth',
            value: 'T 65,800,000',
            price_difference: '-120,000',
            percentage: '-1.71%'
        }, {
            currency: 'bch',
            value: 'T 65,800,000',
            price_difference: '-120,000',
            percentage: '-1.71%'
        }],
        selectedTabs: []
    };

    removeTab = tabValue => {
        console.log('tabValue', tabValue);
    };

    render() {
        const { tabs } = this.state;
        return (
            <div className="d-flex h-100">
                {tabs.map((pair, index) =>
                    <div key={index} className='app_bar-pair-content d-flex'>
                        <div className="app_bar-currency-txt">{STRINGS[`${pair.currency.toUpperCase()}_SHORTNAME`]}</div>
                        <ReactSVG path={ICONS[`${pair.currency.toUpperCase()}_ICON`]} wrapperClassName="app-bar-currency-icon" />
                        <div>{STRINGS[`${pair.currency.toUpperCase()}_FULLNAME`]}: </div>
                        <div className="title-font">{pair.value}</div>
                        <div className="app-price-diff-red app-bar-price_difference">{pair.price_difference} </div>
                        <div className="app-price-diff-red title-font"> ({pair.percentage})</div>
                        <ReactSVG 
                            path={ICONS.CLOSE_CROSS} 
                            wrapperClassName="app-bar-tab-close" 
                            onClick={() => this.removeTab(pair)}/>
                    </div>
                )
                }
                <div className='app_bar-pair-content d-flex justify-content-between'>
                    <ReactSVG path={ICONS.ADD_TAB} wrapperClassName="app-bar-tab-close" />
                </div>
            </div>
        );
    }
}

export default PairTabs;