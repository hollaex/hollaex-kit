import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import { connect } from 'react-redux';
import classnames from 'classnames';

import AddTabList from './AddTabList';
import TabOverflowList from './TabOverflowList';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

class PairTabs extends Component {
    state = {
        selectedTabs: {},
        activeTabs: {},
        activePairTab: '',
        isAddTab: false,
        selectedAddTab: '',
        isTabOverflow: false
    };

    componentDidMount() {
        const { router } = this.props;
        if (router && router.params.pair) {
            this.setState({ activePairTab: router.params.pair });
        } else {
            this.setState({ activePairTab: '' });
        }
        let tabs = localStorage.getItem('tabs');
        if (tabs) {
            tabs = JSON.parse(tabs);
            const tempTabs = {};
            Object.keys(tabs).map((key, index) => {
                if (index <= 2)
                    tempTabs[key] = tabs[key];
            });
            this.setState({ selectedTabs: tabs, activeTabs: tempTabs });
        }
    }

    onTabClick = pair => {
        if (pair) {
            this.props.router.push(`/trade/${pair}`);
            this.setState({ activePairTab: pair });
        }
    };

    handleAddTab = e => {
        this.setState({ isAddTab: !this.state.isAddTab, isTabOverflow: false });
    };

    onAddTabClick = pair => {
        this.setState({ selectedAddTab: pair });
    };

    onTabChange = pair => {
        const { selectedTabs } = this.state;
        let localTabs = {};
        if (selectedTabs[pair]) {
            localTabs = { ...selectedTabs };
            delete localTabs[pair];
            this.setState({ selectedTabs: { ...localTabs } });
        } else {
            const temp = this.props.pairs[pair];
            if (temp && temp.pair_base) {
                localTabs = { ...selectedTabs, [pair]: temp };
                this.setState({ selectedTabs: { ...localTabs } });
            }
        }
        if (Object.keys(localTabs).length <= 3) {
            this.setState({ activeTabs: { ...localTabs } });
        }
        localStorage.setItem('tabs', JSON.stringify(localTabs));
    };

    onOverflowClick = () => {
        this.setState({ isTabOverflow: !this.state.isTabOverflow, isAddTab: false });
    };

    handleOverflow = pair => {
        const { selectedTabs, activeTabs } = this.state;
        const tempTabs = { ...activeTabs };
        if (!activeTabs[pair]) {
            const pairs = Object.keys(activeTabs);
            delete tempTabs[pairs[pairs.length - 1]];
            tempTabs[pair] = selectedTabs[pair];
            this.setState({ activeTabs: { ...tempTabs } });
        } else {
            delete tempTabs[pair];
            const pairs = Object.keys(tempTabs);
            let pushed = false;
            Object.keys(selectedTabs).map((key, index) => {
                if (!pairs.includes(key) && key !== pair && !pushed) {
                    pushed = true;
                    tempTabs[key] = selectedTabs[key];
                }
            });
            this.setState({ activeTabs: { ...tempTabs } });
        }
    };

    render() {
        const { selectedTabs, isAddTab, selectedAddTab, activePairTab, isTabOverflow, activeTabs } = this.state;
        const { pairs } = this.props;
        const obj = {};
        Object.entries(pairs).forEach(([key, pair]) => {
            obj[pair.pair_base] = '';
        });
        const symbols = Object.keys(obj).map((key) => key);
        return (
            <div className="d-flex h-100">
                {Object.keys(activeTabs).map((tab, index) => {
                    const pair = activeTabs[tab];
                    if(index <= 2) {
                        return (
                            <div
                                key={index}
                                className={classnames('app_bar-pair-content', 'd-flex', { 'active-tab-pair': activePairTab === tab })}
                                onClick={() => this.onTabClick(tab)}>
                                <div className="app_bar-currency-txt app_bar-pair-font">{STRINGS[`${pair.pair_base.toUpperCase()}_SHORTNAME`]}</div>
                                <ReactSVG path={ICONS[`${pair.pair_base.toUpperCase()}_ICON`]} wrapperClassName="app-bar-currency-icon" />
                                <div className="app_bar-pair-font">{STRINGS[`${pair.pair_base.toUpperCase()}_FULLNAME`]}: </div>
                                <div className="title-font">T 65,800,000</div>
                                <div className="app-price-diff-red app-bar-price_difference app_bar-pair-font"> -120,000 </div>
                                <div className="app-price-diff-red title-font app_bar-pair-font"> (-1.71%) </div>
                                <div onClick={() => this.onTabChange(tab)}>
                                    <ReactSVG
                                        path={ICONS.CLOSE_CROSS} 
                                        wrapperClassName="app-bar-tab-close" />
                                </div>
                            </div>
                        )
                    }}
                )}
                <div className={classnames('app_bar-pair-content', 'd-flex', 'justify-content-between', { 'active-tab-pair': isAddTab })}>
                    <div onClick={this.handleAddTab}>
                        <ReactSVG path={ICONS.TAB_PLUS} wrapperClassName="app-bar-tab-close" />
                    </div>
                {isAddTab
                    && <AddTabList 
                        symbols={symbols} 
                        pairs={pairs}
                        selectedTabs={selectedTabs}
                        activeTabs={activeTabs}
                        selectedTabMenu={selectedAddTab || symbols[0]} 
                        onAddTabClick={this.onAddTabClick}
                        onTabChange={this.onTabChange} />}
                </div>
                {Object.keys(selectedTabs).length > 3
                    && <div
                        className={classnames('app_bar-pair-overflow', 'd-flex', 'align-items-center', { 'active-tab-pair': isTabOverflow })}>
                        <div onClick={this.onOverflowClick}>
                            <ReactSVG path={ICONS.DOUBLE_ARROW} wrapperClassName="app-bar-tab-close" />
                        </div>
                    {isTabOverflow
                        && <TabOverflowList
                            activeTabs={activeTabs}
                            selectedTabs={selectedTabs}
                            handleOverflow={this.handleOverflow}
                        />
                    }
                </div>}
            </div>
        );
    }
}

const mapStateToProps = store => ({
    pairs: store.app.pairs
});

export default connect(mapStateToProps)(PairTabs);