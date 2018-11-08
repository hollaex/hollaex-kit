import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import { connect } from 'react-redux';
import classnames from 'classnames';

import AddTabList from './AddTabList';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

class PairTabs extends Component {
    state = {
        selectedTabs: [{
            pair_base: 'btc',
            pair_2: 'fiat'
        }, {
            pair_base: 'eth',
            pair_2: 'btc'
        }, {
            pair_base: 'bch',
            pair_2: 'btc'
        }],
        activePairTab: '',
        isAddTab: false,
        selectedAddTab: ''
    };

    removeTab = tabValue => {
        console.log('tabValue', tabValue);
    };

    onTabClick = pair => {
        if (pair) {
            this.props.router.push(`/trade/${pair.pair_base}-${pair.pair_2}`);
        }
    };

    handleAddTab = e => {
        this.setState({ isAddTab: !this.state.isAddTab });
    };

    onAddTabChange = pair => {
        this.setState({ selectedAddTab: pair });
    };

    render() {
        const { selectedTabs, isAddTab, selectedAddTab } = this.state;
        const { pairs } = this.props;
        const obj = {};
        Object.entries(pairs).forEach(([key, pair]) => {
            obj[pair.pair_base] = '';
        });
        const symbols = Object.keys(obj).map((key) => key);
        return (
            <div className="d-flex h-100">
                {selectedTabs.map((pair, index) =>
                    <div
                        key={index}
                        className={classnames('app_bar-pair-content', 'd-flex', { 'active-tab-pair': false })}
                        onClick={() => this.onTabClick(pair)}>
                        <div className="app_bar-currency-txt app_bar-pair-font">{STRINGS[`${pair.pair_base.toUpperCase()}_SHORTNAME`]}</div>
                        <ReactSVG path={ICONS[`${pair.pair_base.toUpperCase()}_ICON`]} wrapperClassName="app-bar-currency-icon" />
                        <div className="app_bar-pair-font">{STRINGS[`${pair.pair_base.toUpperCase()}_FULLNAME`]}: </div>
                        <div className="title-font">T 65,800,000</div>
                        <div className="app-price-diff-red app-bar-price_difference app_bar-pair-font"> -120,000 </div>
                        <div className="app-price-diff-red title-font app_bar-pair-font"> (-1.71%) </div>
                        <ReactSVG 
                            path={ICONS.CLOSE_CROSS} 
                            wrapperClassName="app-bar-tab-close" 
                            onClick={() => this.removeTab(pair)}/>
                    </div>
                )
                }
                <div className={classnames('app_bar-pair-content', 'd-flex', 'justify-content-between', { 'active-tab-pair': isAddTab })}>
                    <div onClick={this.handleAddTab}>
                        <ReactSVG path={ICONS.ADD_TAB} wrapperClassName="app-bar-tab-close" />
                    </div>
                {isAddTab
                    && <AddTabList 
                        symbols={symbols} 
                        pairs={pairs} 
                        selectedTabMenu={selectedAddTab || symbols[0]} 
                        onAddTabChange={this.onAddTabChange} />}
                </div>
            </div>
        );
    }
}

const mapStateToProps = store => ({
    pairs: store.app.pairs
});

export default connect(mapStateToProps)(PairTabs);