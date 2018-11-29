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
            let tabs = localStorage.getItem('tabs');
            if (tabs !== null && tabs !== '' && !JSON.parse(tabs).length) {
                this.props.router.push('/trade/add/tabs');
            }
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
        const { activePairTab } = this.state;
        let tabs = localStorage.getItem('tabs');
        if (tabs === null || tabs === '') {
            tabs = DEFAULT_TRADING_PAIRS;
        } else if (tabs) {
            tabs = JSON.parse(tabs);
        } else {
            tabs = [];
        }
        if (Object.keys(pairs).length) {
            // tabs = tabs.length ? tabs : DEFAULT_TRADING_PAIRS;
            const tempTabs = {};
            const selected = {};
            tabs.map((key, index) => {
                if (index <= 3)
                    tempTabs[key] = pairs[key];
                selected[key] = pairs[key];
                return key;
            });
            if (activePairTab && !tempTabs[activePairTab] && tabs.length) {
                const temp = pairs[activePairTab];
                const pairKeys = Object.keys(tempTabs);
                if (pairKeys.length < 4) {
                    tempTabs[activePairTab] = temp;
                } else {
                    delete tempTabs[pairKeys[pairKeys.length - 1]];
                    tempTabs[activePairTab] = temp;
                }
                if (!selected[activePairTab]) {
                    selected[activePairTab] = temp;
                }
            }
            this.setState({ selectedTabs: selected, activeTabs: tempTabs });
            this.setTabsLocal(selected);
        }
    }

    onTabClick = pair => {
        if (pair) {
            this.props.router.push(`/trade/${pair}`);
            this.setState({ activePairTab: pair });
        }
    };

    openAddTabMenu = e => {
        this.setState({ isAddTab: !this.state.isAddTab, isTabOverflow: false });
    };

    onAddTabClick = pair => {
        this.setState({ selectedAddTab: pair });
    };
    
    onTabChange = pair => {
        const { selectedTabs, activeTabs, activePairTab } = this.state;
        const { activePath, pairs } = this.props;
        let localTabs = {};
        let tabPairs = [];
        if (selectedTabs[pair]) {
            localTabs = { ...selectedTabs };
            tabPairs = Object.keys(localTabs);
            if (activePairTab === pair || activePath !== 'trade') {
                let index = tabPairs.indexOf(pair);
                if (index < (tabPairs.length - 1)) {
                    this.onTabClick(tabPairs[index + 1]);
                } else {
                    this.onTabClick(tabPairs[index - 1]);
                }
            }
            delete localTabs[pair];
            tabPairs = Object.keys(localTabs);
            this.setState({ selectedTabs: { ...localTabs } });
        } else {
            const temp = pairs[pair];
            if (temp && temp.pair_base) {
                localTabs = { ...selectedTabs, [pair]: temp };
                tabPairs = Object.keys(localTabs);
                this.setState({ selectedTabs: { ...localTabs } });
            }
            this.onTabClick(pair);
        }
        if (activeTabs[pair]) {
            let tempActive = {};
            tabPairs.map((key, index) => {
                if (index <= 3) {
                    tempActive = { ...tempActive, [key]: localTabs[key] };
                }
                return key;
            });
            this.setState({ activeTabs: { ...tempActive } });
        } else if (!activeTabs[pair] && localTabs[pair]) {
            let tempActive = activeTabs;
            let activeKeys = Object.keys(activeTabs);
            if (tabPairs.length <= 4) {
                this.setState({ activeTabs: { ...localTabs } });
            } else {
                delete tempActive[activeKeys[activeKeys.length - 1]];
                tempActive[pair] = localTabs[pair];
                this.setState({ activeTabs: { ...tempActive } });
            }
        }
        this.setTabsLocal(localTabs);
        this.closeAddTabMenu();
    };

    onOverflowClick = () => {
        this.setState({ isTabOverflow: !this.state.isTabOverflow, isAddTab: false });
    };

    handleOverflow = pair => {
        const { selectedTabs, activeTabs } = this.state;
        if (!activeTabs[pair]) {
            const tempTabs = { [pair]: selectedTabs[pair], ...activeTabs };
            const pairs = Object.keys(tempTabs);
            delete tempTabs[pairs[pairs.length - 1]];
            this.setState({
                activeTabs: { ...tempTabs },
                selectedTabs: { ...tempTabs, ...this.state.selectedTabs }
            });
            this.setTabsLocal({ ...tempTabs, ...this.state.selectedTabs });
        }
        this.onTabClick(pair);
        this.closeOverflowMenu();
    };

    closeAddTabMenu = () => {
        this.setState({ isAddTab: false, searchValue: '', searchResult: {} });
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
        this.setTabsLocal({ ...sortedTabs, ...this.state.selectedTabs });
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

    setTabsLocal = tabs => {
        localStorage.setItem('tabs', JSON.stringify(Object.keys(tabs)));
    };

    render() {
        const { selectedTabs, isAddTab, selectedAddTab, activePairTab, isTabOverflow, activeTabs, searchValue, searchResult } = this.state;
        const { pairs, tickers } = this.props;
        const obj = {};
        Object.entries(pairs).forEach(([key, pair]) => {
            obj[pair.pair_base] = '';
        });
        const symbols = Object.keys(obj).map((key) => key);
        return (
            <div className="d-flex h-100">
                {Object.keys(activeTabs).map((tab, index) => {
                    const pair = activeTabs[tab];
                    const ticker = tickers[tab];
                    if (index <= 3) {
                        return (
                            <Tab
                                key={index}
                                tab={tab}
                                pair={pair}
                                ticker={ticker}
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
                    <div onClick={this.openAddTabMenu}>
                        <ReactSVG path={ICONS.TAB_PLUS} wrapperClassName="app-bar-tab-close" />
                    </div>
                    {isAddTab &&
                        <AddTabList 
                            symbols={symbols} 
                            pairs={pairs}
                            tickers={tickers}
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
                {Object.keys(selectedTabs).length > 4
                    && <div
                        className={classnames('app_bar-pair-overflow', 'd-flex', 'align-items-center', { 'active-tab-overflow': isTabOverflow })}>
                        <div onClick={this.onOverflowClick}>
                            <ReactSVG path={ICONS.DOUBLE_ARROW} wrapperClassName="app-bar-tab-close" />
                        </div>
                    {isTabOverflow
                        && <TabOverflowList
                            activeTabs={activeTabs}
                            activePairTab={activePairTab}
                            selectedTabs={selectedTabs}
                            tickers={tickers}
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
    pairs: store.app.pairs,
    tickers: store.app.tickers
});

export default connect(mapStateToProps)(PairTabs);