import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Tab from './Tab';
import AddTabList from './AddTabList';
import TabOverflowList from './TabOverflowList';
import { DEFAULT_TRADING_PAIRS } from '../../config/constants';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

class PairTabs extends Component {
    state = {
        selectedTabs: {},
        activeTabs: {},
        activePairTab: '',
        isAddTab: false,
        selectedAddTab: '',
        isTabOverflow: false,
        searchValue: '',
        searchResult: {}
    };

    componentDidMount() {
        const { router, pairs } = this.props;
        if (router && router.params.pair) {
            this.setState({ activePairTab: router.params.pair });
        } else {
            this.setState({ activePairTab: '' });
        }
        this.initTabs(pairs);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.activePath !== nextProps.activePath 
            && nextProps.activePath !== 'trade') {
            this.setState({ activePairTab: '' });
        }
        if (JSON.stringify(this.props.pairs) !== JSON.stringify(nextProps.pairs)) {
            this.initTabs(nextProps.pairs);
        }
    }

    initTabs = pairs => {
        let tabs = localStorage.getItem('tabs');
        tabs = tabs ? JSON.parse(tabs) : [];
        if (Object.keys(pairs).length) {
            tabs = tabs.length ? tabs : DEFAULT_TRADING_PAIRS;
            const tempTabs = {};
            const selected = {};
            tabs.map((key, index) => {
                if (index <= 2)
                    tempTabs[key] = pairs[key];
                selected[key] = pairs[key];
                return key;
            });
            this.setState({ selectedTabs: selected, activeTabs: tempTabs });
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
        const { selectedTabs, activeTabs } = this.state;
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
        if (activeTabs[pair]) {
            let tempActive = {};
            Object.keys(localTabs).map((key, index) => {
                if (index <= 2) {
                    tempActive = { ...tempActive, [key]: localTabs[key] };
                }
                return key;
            });
            this.setState({ activeTabs: { ...tempActive } });
        } else if (Object.keys(localTabs).length <= 3) {
            this.setState({ activeTabs: { ...localTabs } });
        }
        localStorage.setItem('tabs', JSON.stringify(Object.keys(localTabs)));
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
            Object.keys(selectedTabs).map(key => {
                if (!pairs.includes(key) && key !== pair && !pushed) {
                    pushed = true;
                    tempTabs[key] = selectedTabs[key];
                }
                return key;
            });
            this.setState({ activeTabs: { ...tempTabs } });
        }
    };

    closeAddTabMenu = () => {
        this.setState({ isAddTab: false });
    };

    closeOverflowMenu = () => {
        this.setState({ isTabOverflow: false });
    };

    onSortItems = sortItems => {
        const sortedTabs = {};
        sortItems.map(pair => {
            let temp = this.state.activeTabs[pair];
            sortedTabs[pair] = temp;
            return pair;
        });
        localStorage.setItem('tabs', JSON.stringify(Object.keys({ ...sortedTabs, ...this.state.selectedTabs })));
        this.setState({ activeTabs: { ...sortedTabs }, selectedTabs: { ...sortedTabs, ...this.state.selectedTabs } });
    };
    
    handleSearch = (_, value) => {
        const { pairs } = this.props;
        if (value) {
            let result = {};
            let searchValue = value.toLowerCase().trim();
            Object.keys(pairs).map(key => {
                let temp = pairs[key];
                let cashName = STRINGS[`${temp.pair_base.toUpperCase()}_FULLNAME`].toLowerCase();
                if (key.indexOf(searchValue) !== -1 ||
                    temp.pair_base.indexOf(searchValue) !== -1 ||
                    temp.pair_2.indexOf(searchValue) !== -1 ||
                    cashName.indexOf(searchValue) !== -1) {
                        result[key] = temp;
                }
                return key;
            });
            this.setState({ searchResult: { ...result }, searchValue: value });
        } else {
            this.setState({ searchResult: {}, searchValue: '' });
        }
    };

    render() {
        const { selectedTabs, isAddTab, selectedAddTab, activePairTab, isTabOverflow, activeTabs, searchValue, searchResult } = this.state;
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
                            <Tab
                                key={index}
                                tab={tab}
                                pair={pair}
                                activePairTab={activePairTab}
                                onSortItems={this.onSortItems}
                                items={Object.keys(activeTabs)}
                                sortId={index}
                                onTabClick={this.onTabClick}
                                onTabChange={this.onTabChange} />
                        )
                    }}
                )}
                <div className={classnames('app_bar-pair-content', 'd-flex', 'justify-content-between', { 'active-tab-pair': isAddTab })}>
                    <div onClick={this.handleAddTab}>
                        <ReactSVG path={ICONS.TAB_PLUS} wrapperClassName="app-bar-tab-close" />
                    </div>
                    {isAddTab &&
                        <AddTabList 
                            symbols={symbols} 
                            pairs={pairs}
                            selectedTabs={selectedTabs}
                            activeTabs={activeTabs}
                            selectedTabMenu={selectedAddTab || symbols[0]}
                            searchValue={searchValue}
                            searchResult={searchResult}
                            onAddTabClick={this.onAddTabClick}
                            onTabChange={this.onTabChange}
                            closeAddTabMenu={this.closeAddTabMenu}
                            handleSearch={this.handleSearch}
                        />
                    }
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
                            closeOverflowMenu={this.closeOverflowMenu}
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